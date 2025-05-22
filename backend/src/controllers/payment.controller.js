const { Payment, User, Campaign, Content } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const config = require('../config/config');

// En un entorno real, aquí se importaría el SDK de Mercado Pago o Stripe
// const mercadopago = require('mercadopago');
// mercadopago.configure({ access_token: config.mercadoPago.accessToken });

/**
 * Crear una intención de pago
 */
const createPaymentIntent = async (req, res) => {
  try {
    const payerId = req.user.id;
    const { 
      campaignId, 
      recipientId, 
      contentId, 
      amount, 
      description = 'Pago por contenido' 
    } = req.body;

    // Validar campaña
    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaña no encontrada'
      });
    }

    // Validar que el usuario sea el creador de la campaña
    if (campaign.creatorId !== payerId) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permisos para crear pagos en esta campaña'
      });
    }

    // Validar receptor
    const recipient = await User.findByPk(recipientId);
    if (!recipient) {
      return res.status(404).json({
        status: 'error',
        message: 'Receptor no encontrado'
      });
    }

    // Si se proporciona contentId, validar que exista y pertenezca a la campaña
    if (contentId) {
      const content = await Content.findOne({
        where: {
          id: contentId,
          campaignId,
          creatorId: recipientId
        }
      });

      if (!content) {
        return res.status(404).json({
          status: 'error',
          message: 'Contenido no encontrado o no corresponde al receptor en esta campaña'
        });
      }

      // Validar que el contenido esté aprobado
      if (content.status !== 'approved' && content.status !== 'published') {
        return res.status(400).json({
          status: 'error',
          message: 'El contenido debe estar aprobado o publicado para poder pagarlo'
        });
      }
    }

    // Calcular comisión de la plataforma (10% por defecto)
    const platformFeePercentage = 10.00; // 10%
    const platformFee = (amount * platformFeePercentage) / 100;
    const netAmount = amount - platformFee;

    // Crear registro de pago en la base de datos
    const payment = await Payment.create({
      id: uuidv4(),
      payerId,
      recipientId,
      campaignId,
      contentId,
      amount,
      platformFee,
      platformFeePercentage,
      description,
      status: 'pending',
      currency: 'ARS',
      paymentGateway: 'mercadopago'
    });

    // En un entorno real, aquí se crearía una preferencia de pago en Mercado Pago
    // Este es un ejemplo de integración con Mercado Pago (comentado para el MVP)
    /*
    const preference = {
      items: [
        {
          id: payment.id,
          title: `Pago para campaña ${campaign.title}`,
          description,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: parseFloat(amount)
        }
      ],
      external_reference: payment.id,
      back_urls: {
        success: `${config.frontendUrl}/pagos/exito`,
        failure: `${config.frontendUrl}/pagos/fallo`,
        pending: `${config.frontendUrl}/pagos/pendiente`
      },
      auto_return: 'approved',
      notification_url: `${config.apiUrl}/payments/webhook`,
    };

    const mpResponse = await mercadopago.preferences.create(preference);
    
    // Actualizar el pago con la referencia de Mercado Pago
    await payment.update({
      transactionId: mpResponse.body.id
    });
    */

    // Simulación para el MVP: actualizar directamente el pago a estado "processing"
    await payment.update({
      transactionId: `MOCK-${uuidv4().substring(0, 8)}`,
      status: 'processing'
    });

    return res.status(201).json({
      status: 'success',
      message: 'Intención de pago creada exitosamente',
      data: {
        payment,
        // En un caso real, aquí se entregaría el init_point para redirigir al usuario
        // paymentUrl: mpResponse.body.init_point 
        paymentUrl: `${config.frontendUrl}/pagos/simular/${payment.id}` // URL simulada para el MVP
      }
    });
  } catch (error) {
    console.error('Error al crear intención de pago:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al crear intención de pago',
      error: error.message
    });
  }
};

/**
 * Obtener detalles de un pago por ID
 */
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findByPk(id, {
      include: [
        { 
          model: User, 
          as: 'payer',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        { 
          model: User, 
          as: 'recipient',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        { 
          model: Campaign, 
          as: 'campaign',
          attributes: ['id', 'title', 'description']
        },
        { 
          model: Content, 
          as: 'content',
          attributes: ['id', 'mediaUrl', 'thumbnailUrl', 'caption', 'contentType']
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Pago no encontrado'
      });
    }

    // Verificar que el usuario sea parte de la transacción
    if (payment.payerId !== userId && payment.recipientId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permisos para ver este pago'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    console.error('Error al obtener pago:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener información del pago',
      error: error.message
    });
  }
};

/**
 * Obtener pagos de una campaña
 */
const getPaymentsByCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user.id;

    // Verificar que el usuario sea parte de la campaña
    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaña no encontrada'
      });
    }

    // Solo el creador o participantes pueden ver los pagos
    const isCreator = campaign.creatorId === userId;
    
    if (!isCreator && req.user.role !== 'admin') {
      const isParticipant = await CampaignParticipant.findOne({
        where: {
          campaignId,
          userId,
          status: { [Op.in]: ['approved', 'completed'] }
        }
      });

      if (!isParticipant) {
        return res.status(403).json({
          status: 'error',
          message: 'No tienes permisos para ver los pagos de esta campaña'
        });
      }
    }

    // Si es participante, solo ver sus propios pagos
    const where = { campaignId };
    if (!isCreator && req.user.role !== 'admin') {
      where.recipientId = userId;
    }

    const payments = await Payment.findAll({
      where,
      include: [
        { 
          model: User, 
          as: 'payer',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        { 
          model: User, 
          as: 'recipient',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        { 
          model: Content, 
          as: 'content',
          attributes: ['id', 'mediaUrl', 'thumbnailUrl', 'caption', 'contentType']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      status: 'success',
      data: { payments }
    });
  } catch (error) {
    console.error('Error al obtener pagos de campaña:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener pagos',
      error: error.message
    });
  }
};

/**
 * Obtener pagos recibidos por el usuario
 */
const getReceivedPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      status, 
      campaignId,
      page = 1, 
      limit = 10 
    } = req.query;

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Configurar where para filtros
    const where = { recipientId: userId };

    if (status) {
      where.status = status;
    }

    if (campaignId) {
      where.campaignId = campaignId;
    }

    const payments = await Payment.findAndCountAll({
      where,
      include: [
        { 
          model: User, 
          as: 'payer',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        { 
          model: Campaign, 
          as: 'campaign',
          attributes: ['id', 'title', 'coverImage']
        },
        { 
          model: Content, 
          as: 'content',
          attributes: ['id', 'mediaUrl', 'thumbnailUrl', 'caption', 'contentType']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      status: 'success',
      data: {
        payments: payments.rows,
        totalCount: payments.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(payments.count / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener pagos recibidos:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener pagos',
      error: error.message
    });
  }
};

/**
 * Obtener pagos enviados por el usuario
 */
const getSentPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      status, 
      campaignId,
      page = 1, 
      limit = 10 
    } = req.query;

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Configurar where para filtros
    const where = { payerId: userId };

    if (status) {
      where.status = status;
    }

    if (campaignId) {
      where.campaignId = campaignId;
    }

    const payments = await Payment.findAndCountAll({
      where,
      include: [
        { 
          model: User, 
          as: 'recipient',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        { 
          model: Campaign, 
          as: 'campaign',
          attributes: ['id', 'title', 'coverImage']
        },
        { 
          model: Content, 
          as: 'content',
          attributes: ['id', 'mediaUrl', 'thumbnailUrl', 'caption', 'contentType']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      status: 'success',
      data: {
        payments: payments.rows,
        totalCount: payments.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(payments.count / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener pagos enviados:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener pagos',
      error: error.message
    });
  }
};

/**
 * Confirmar un pago después de aprobación del contenido
 */
const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Pago no encontrado'
      });
    }

    // Solo el pagador puede confirmar el pago
    if (payment.payerId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permisos para confirmar este pago'
      });
    }

    // Verificar que el pago esté en estado 'processing'
    if (payment.status !== 'processing') {
      return res.status(400).json({
        status: 'error',
        message: `No se puede confirmar un pago en estado '${payment.status}'`
      });
    }

    // En un entorno real, aquí se ejecutaría la captura del pago a través de la pasarela
    // Para el MVP, simplemente cambiamos el estado
    await payment.update({
      status: 'completed',
      paymentDate: new Date()
    });

    return res.status(200).json({
      status: 'success',
      message: 'Pago confirmado exitosamente',
      data: { payment }
    });
  } catch (error) {
    console.error('Error al confirmar pago:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al confirmar pago',
      error: error.message
    });
  }
};

/**
 * Manejar webhook de la pasarela de pago
 */
const handlePaymentWebhook = async (req, res) => {
  try {
    // En un entorno real, aquí se procesaría la notificación de la pasarela de pago
    // Por ejemplo, si es Mercado Pago:
    /*
    const { data } = req.body;
    
    if (data.type === 'payment') {
      const paymentInfo = await mercadopago.payment.findById(data.id);
      const externalReference = paymentInfo.body.external_reference;
      
      const payment = await Payment.findByPk(externalReference);
      
      if (payment) {
        let status;
        switch(paymentInfo.body.status) {
          case 'approved':
            status = 'completed';
            break;
          case 'pending':
          case 'in_process':
            status = 'processing';
            break;
          case 'rejected':
            status = 'failed';
            break;
          default:
            status = 'pending';
        }
        
        await payment.update({
          status,
          transactionId: paymentInfo.body.id.toString(),
          paymentDate: status === 'completed' ? new Date() : null,
          metadata: paymentInfo.body
        });
      }
    }
    */

    // Para el MVP, solo devolvemos una respuesta exitosa
    return res.status(200).end();
  } catch (error) {
    console.error('Error procesando webhook de pago:', error);
    return res.status(500).end();
  }
};

module.exports = {
  createPaymentIntent,
  getPaymentById,
  getPaymentsByCampaign,
  getReceivedPayments,
  getSentPayments,
  confirmPayment,
  handlePaymentWebhook
}; 