const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Definir relaciones
      User.hasOne(models.VoicerProfile, {
        foreignKey: 'userId',
        as: 'voicerProfile'
      });
      User.hasOne(models.BrandProfile, {
        foreignKey: 'userId',
        as: 'brandProfile'
      });
      User.hasMany(models.Campaign, {
        foreignKey: 'creatorId',
        as: 'createdCampaigns'
      });
      User.belongsToMany(models.Campaign, {
        through: 'CampaignParticipants',
        foreignKey: 'userId',
        as: 'participatingCampaigns'
      });
      User.hasMany(models.Review, {
        foreignKey: 'reviewerId',
        as: 'givenReviews'
      });
      User.hasMany(models.Review, {
        foreignKey: 'reviewedId',
        as: 'receivedReviews'
      });
      User.hasMany(models.Payment, {
        foreignKey: 'payerId',
        as: 'payments'
      });
      User.hasMany(models.Payment, {
        foreignKey: 'recipientId',
        as: 'receivedPayments'
      });
    }

    // Método para validar contraseña
    async validatePassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // Permite null para usuarios de OAuth
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('voicer', 'brand', 'admin'),
        allowNull: false,
        defaultValue: 'voicer',
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isKYCVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      firebaseUid: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: async (user) => {
          // Solo hashear si hay contraseña (puede ser null para OAuth)
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          // Solo hashear si se modificó la contraseña
          if (user.changed('password') && user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  return User;
}; 