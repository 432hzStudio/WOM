const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CampaignParticipant extends Model {
    static associate(models) {
      // No se definen asociaciones directamente aquí ya que es una tabla intermedia
    }
  }

  CampaignParticipant.init(
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
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      status: {
        type: DataTypes.ENUM('invited', 'applied', 'rejected', 'approved', 'active', 'completed'),
        defaultValue: 'applied',
      },
      invitedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      appliedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rejectedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      contractAccepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      contractAcceptedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      contractUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      assignedPayment: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'CampaignParticipant',
      tableName: 'CampaignParticipants'
    }
  );

  return CampaignParticipant;
}; 