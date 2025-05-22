const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    static associate(models) {
      Content.belongsTo(models.Campaign, {
        foreignKey: 'campaignId',
        as: 'campaign'
      });
      Content.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator'
      });
    }
  }

  Content.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      campaignId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Campaigns',
          key: 'id'
        }
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      mediaUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      thumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      caption: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      platform: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contentType: {
        type: DataTypes.ENUM('image', 'video', 'text', 'audio', 'story', 'reel', 'tiktok'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected', 'published'),
        defaultValue: 'draft',
      },
      publishedUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true
        }
      },
      publishedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      metrics: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      comments: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      shares: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      submissionDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reviewerId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      reviewComments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      revisions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      }
    },
    {
      sequelize,
      modelName: 'Content',
    }
  );

  return Content;
}; 