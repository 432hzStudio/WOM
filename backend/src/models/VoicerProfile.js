const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VoicerProfile extends Model {
    static associate(models) {
      VoicerProfile.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  VoicerProfile.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instagramHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instagramFollowers: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tiktokHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tiktokFollowers: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      facebookHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebookFollowers: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      youtubeHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      youtubeFollowers: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      interests: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      averageRating: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      completedCampaigns: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      preferredPaymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentInfo: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      availableForCampaigns: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'VoicerProfile',
    }
  );

  return VoicerProfile;
}; 