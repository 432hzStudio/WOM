const { Campaign, User, Content, CampaignParticipant } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

/**
 * Obtener listado de campañas con filtros
 */
const getCampaigns = async (req, res) => {
  try {
    const {
      status,
      industry,
      minBudget,
      maxBudget,
      location,
      platform,
      page = 1,
      limit = 10
    } = req.query;

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Configurar where para filtros
    const where = {
      isPublic: true
    };

    if (status) {
      where.status = status;
    } else {
      // Por defecto mostrar solo campañas activas o aprobadas
      where.status = { [Op.in]: ['active', 'approved', 'in_progress'] };
    }

    if (industry) {
      where.industry = { [Op.iLike]: `%${industry}%` };
    }

    if (minBudget) {
      where.budget = { ...(where.budget || {}), [Op.gte]: minBudget };
    }

    if (maxBudget) {
      where.budget = { ...(where.budget || {}), [Op.lte]: maxBudget };
    }

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (platform) {
      where.requiredPlatforms = { [Op.contains]: [platform] };
    }

    // Buscar campañas filtradas
    const campaigns = await Campaign.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'firstName', 'lastName', 'avatar']
      }],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      status: 'success',
      data: {
        campaigns: campaigns.rows,
        totalCount: campaigns.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(campaigns.count / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener campañas:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener campañas',
      error: error.message
    });
  }
};

/**
 * Crear una nueva campaña
 */
const createCampaign = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title, description, brief, targetAudience, budget, paymentPerVoicer,
      startDate, endDate, industry, requiredReach, maxParticipants,
      location, requiredPlatforms, keywords, contentRequirements, doAndDonts,
      exampleMedia, brandAssets, coverImage, isPublic = true
    } = req.body;

    // Crear campaña
    const campaign = await Campaign.create({
      id: uuidv4(),
      creatorId: userId,
      title,
      description,
      brief,
      targetAudience,
      budget,
      paymentPerVoicer,
      startDate,
      endDate,
      status: 'draft',
      industry,
      requiredReach,
      maxParticipants,
      location,
      requiredPlatforms,
      keywords,
      contentRequirements,
      doAndDonts,
      exampleMedia,
      brandAssets,
      coverImage,
      isPublic
    });

    return res.status(201).json({
      status: 'success',
      message: 'Campaña creada exitosamente',
      data: { campaign }
    });
  } catch (error) {
    console.error('Error al crear campaña:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al crear campaña',
      error: error.message
    });
  }
};

/**
 * Obtener detalle de una campaña por ID
 */
const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'firstName', 'lastName', 'avatar'],
          through: { attributes: ['status'] }
        }
      ]
    });

    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaña no encontrada'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { campaign }
    });
  } catch (error) {
    console.error('Error al obtener campaña por ID:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener campaña',
      error: error.message
    });
  }
};

/**
 * Actualizar una campaña
 */
const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, brief, targetAudience, budget, paymentPerVoicer,
      startDate, endDate, status, industry, requiredReach, maxParticipants,
      location, requiredPlatforms, keywords, contentRequirements, doAndDonts,
      exampleMedia, brandAssets, coverImage, isPublic
    } = req.body;

    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaña no encontrada'
      });
    }

    // Actualizar campos proporcionados
    await campaign.update({
      title,
      description,
      brief,
      targetAudience,
      budget,
      paymentPerVoicer,
      startDate,
      endDate,
      status,
      industry,
      requiredReach,
      maxParticipants,
      location,
      requiredPlatforms,
      keywords,
      contentRequirements,
      doAndDonts,
      exampleMedia,
      brandAssets,
      coverImage,
      isPublic
    });

    return res.status(200).json({
      status: 'success',
      message: 'Campaña actualizada exitosamente',
      data: { campaign }
    });
  } catch (error) {
    console.error('Error al actualizar campaña:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar campaña',
      error: error.message
    });
  }
};

/**
 * Eliminar una campaña
 */
const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaña no encontrada'
      });
    }

    // Solo permitir eliminar campañas en borrador o canceladas
    if (!['draft', 'cancelled'].includes(campaign.status)) {
      return res.status(400).json({
        status: 'error',
        message: 'No se puede eliminar una campaña activa o en progreso'
      });
    }

    await campaign.destroy();

    return res.status(200).json({
      status: 'success',
      message: 'Campaña eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar campaña:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al eliminar campaña',
      error: error.message
    });
  }
};

/**
 * Aplicar a una campaña como Voicer
 */
const applyToCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar si la campaña existe
    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaña no encontrada'
      });
    }

    // Verificar que la campaña esté abierta a aplicaciones
    if (!['active', 'approved'].includes(campaign.status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Esta campaña no está aceptando aplicaciones'
      });
    }

    // Verificar si ya aplicó a la campaña
    const existingApplication = await CampaignParticipant.findOne({
      where: {
        campaignId: id,
        userId
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        status: 'error',
        message: 'Ya has aplicado a esta campaña'
      });
    }

    // Crear la aplicación
    const participant = await CampaignParticipant.create({
      id: uuidv4(),
      campaignId: id,
      userId,
      status: 'applied',
      appliedAt: new Date()
    });

    return res.status(201).json({
      status: 'success',
      message: 'Aplicación enviada exitosamente',
      data: { participant }
    });
  } catch (error) {
    console.error('Error al aplicar a campaña:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al aplicar a campaña',
      error: error.message
    });
  }
};

/**
 * Actualizar el estado de un participante en una campaña
 */
const updateParticipantStatus = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { status, rejectionReason } = req.body;

    // Buscar la participación
    const participant = await CampaignParticipant.findOne({
      where: {
        campaignId: id,
        userId
      }
    });

    if (!participant) {
      return res.status(404).json({
        status: 'error',
        message: 'Participante no encontrado en esta campaña'
      });
    }

    // Determinar qué campos actualizar según el nuevo estado
    const updateFields = { status };

    if (status === 'approved') {
      updateFields.approvedAt = new Date();
    } else if (status === 'rejected') {
      updateFields.rejectedAt = new Date();
      updateFields.rejectionReason = rejectionReason;
    } else if (status === 'completed') {
      updateFields.completedAt = new Date();
    }

    // Actualizar estado
    await participant.update(updateFields);

    return res.status(200).json({
      status: 'success',
      message: 'Estado de participante actualizado exitosamente',
      data: { participant }
    });
  } catch (error) {
    console.error('Error al actualizar estado de participante:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar estado de participante',
      error: error.message
    });
  }
};

/**
 * Obtener participantes de una campaña
 */
const getCampaignParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    // Verificar si la campaña existe
    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaña no encontrada'
      });
    }

    // Configurar where para filtros
    const where = { campaignId: id };

    if (status) {
      where.status = status;
    }

    // Buscar participantes
    const participants = await CampaignParticipant.findAll({
      where,
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'role']
      }]
    });

    return res.status(200).json({
      status: 'success',
      data: { participants }
    });
  } catch (error) {
    console.error('Error al obtener participantes de campaña:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener participantes',
      error: error.message
    });
  }
};

/**
 * Agregar contenido a una campaña
 */
const addContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      mediaUrl, thumbnailUrl, caption, platform, contentType
    } = req.body;

    // Verificar si la campaña existe
    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaña no encontrada'
      });
    }

    // Verificar si el usuario es participante aprobado de la campaña
    const isParticipant = await CampaignParticipant.findOne({
      where: {
        campaignId: id,
        userId,
        status: 'approved'
      }
    });

    // Solo el creador o participantes aprobados pueden agregar contenido
    if (campaign.creatorId !== userId && !isParticipant) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permisos para agregar contenido a esta campaña'
      });
    }

    // Crear el contenido
    const content = await Content.create({
      id: uuidv4(),
      campaignId: id,
      creatorId: userId,
      mediaUrl,
      thumbnailUrl,
      caption,
      platform,
      contentType,
      status: 'draft',
      submissionDate: null
    });

    return res.status(201).json({
      status: 'success',
      message: 'Contenido agregado exitosamente',
      data: { content }
    });
  } catch (error) {
    console.error('Error al agregar contenido:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al agregar contenido',
      error: error.message
    });
  }
};

/**
 * Obtener contenidos de una campaña
 */
const getCampaignContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    // Verificar si la campaña existe
    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaña no encontrada'
      });
    }

    // Configurar where para filtros
    const where = { campaignId: id };

    if (status) {
      where.status = status;
    }

    // Buscar contenidos
    const contents = await Content.findAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'firstName', 'lastName', 'avatar']
      }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      status: 'success',
      data: { contents }
    });
  } catch (error) {
    console.error('Error al obtener contenidos de campaña:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener contenidos',
      error: error.message
    });
  }
};

/**
 * Actualizar el estado de un contenido
 */
const updateContentStatus = async (req, res) => {
  try {
    const { id, contentId } = req.params;
    const userId = req.user.id;
    const { status, reviewComments } = req.body;

    // Buscar el contenido
    const content = await Content.findOne({
      where: {
        id: contentId,
        campaignId: id
      }
    });

    if (!content) {
      return res.status(404).json({
        status: 'error',
        message: 'Contenido no encontrado'
      });
    }

    // Verificar que el usuario tenga permisos:
    // - Si es el creador del contenido, solo puede enviar a revisión (submitted)
    // - Si es el creador de la campaña, puede aprobar o rechazar
    const campaign = await Campaign.findByPk(id);

    if (content.creatorId === userId && status !== 'submitted') {
      return res.status(403).json({
        status: 'error',
        message: 'Como creador del contenido solo puedes enviarlo a revisión'
      });
    }

    if (campaign.creatorId !== userId && ['approved', 'rejected'].includes(status)) {
      return res.status(403).json({
        status: 'error',
        message: 'Solo el creador de la campaña puede aprobar o rechazar contenido'
      });
    }

    // Determinar qué campos actualizar según el estado
    const updateFields = { 
      status,
      reviewComments
    };

    if (status === 'submitted') {
      updateFields.submissionDate = new Date();
    } else if (['approved', 'rejected'].includes(status)) {
      updateFields.reviewDate = new Date();
      updateFields.reviewerId = userId;
    } else if (status === 'published') {
      updateFields.publishedDate = new Date();
    }

    // Actualizar contenido
    await content.update(updateFields);

    return res.status(200).json({
      status: 'success',
      message: 'Estado de contenido actualizado exitosamente',
      data: { content }
    });
  } catch (error) {
    console.error('Error al actualizar estado de contenido:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar estado de contenido',
      error: error.message
    });
  }
};

module.exports = {
  getCampaigns,
  createCampaign,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  applyToCampaign,
  updateParticipantStatus,
  getCampaignParticipants,
  addContent,
  getCampaignContent,
  updateContentStatus
}; 