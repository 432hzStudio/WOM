const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    static associate(models) {
      Campaign.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator'
      });
      Campaign.belongsToMany(models.User, {
        through: 'CampaignParticipants',
        foreignKey: 'campaignId',
        as: 'participants'
      });
      Campaign.hasMany(models.Content, {
        foreignKey: 'campaignId',
        as: 'contents'
      });
      Campaign.hasMany(models.Payment, {
        foreignKey: 'campaignId',
        as: 'payments'
      });
    }
  }

  Campaign.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      brief: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      targetAudience: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      budget: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentPerVoicer: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('draft', 'active', 'pending_approval', 'approved', 'in_progress', 'completed', 'cancelled'),
        defaultValue: 'draft',
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      requiredReach: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      maxParticipants: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      requiredPlatforms: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      keywords: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      contentRequirements: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      doAndDonts: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      exampleMedia: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      brandAssets: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      coverImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isTemplate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      templateName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      templateCategory: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'Campaign',
    }
  );

  return Campaign;
}; 