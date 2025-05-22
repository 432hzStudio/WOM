const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.User, {
        foreignKey: 'payerId',
        as: 'payer'
      });
      Payment.belongsTo(models.User, {
        foreignKey: 'recipientId',
        as: 'recipient'
      });
      Payment.belongsTo(models.Campaign, {
        foreignKey: 'campaignId',
        as: 'campaign'
      });
      Payment.belongsTo(models.Content, {
        foreignKey: 'contentId',
        as: 'content'
      });
    }
  }

  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      payerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      recipientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      campaignId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Campaigns',
          key: 'id'
        }
      },
      contentId: {
        type: DataTypes.UUID,
        allowNull: true, // Puede ser null si el pago es para toda la campaña
        references: {
          model: 'Contents',
          key: 'id'
        }
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'ARS', // Peso Argentino
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentGateway: {
        type: DataTypes.STRING,
        defaultValue: 'mercadopago',
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      platformFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      platformFeePercentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 10.00, // 10% por defecto
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      invoiceId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      invoiceUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      refundReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      refundDate: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'Payment',
    }
  );

  return Payment;
}; 