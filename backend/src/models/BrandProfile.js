const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BrandProfile extends Model {
    static associate(models) {
      BrandProfile.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  BrandProfile.init(
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
      brandName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true
        }
      },
      instagramHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebookHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tiktokHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      youtubeHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      businessAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        defaultValue: 'Argentina',
      },
      taxId: {
        type: DataTypes.STRING, // CUIT en Argentina
        allowNull: true,
      },
      contactPersonName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactPersonPosition: {
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
      billingInfo: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      isVerifiedBusiness: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      foundedYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'BrandProfile',
    }
  );

  return BrandProfile;
}; 