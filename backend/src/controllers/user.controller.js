const { User, VoicerProfile, BrandProfile } = require('../models');
const { Op } = require('sequelize');

/**
 * Obtener el perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userWithProfile = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken', 'resetPasswordExpires'] },
      include: req.user.role === 'voicer' 
        ? [{ model: VoicerProfile, as: 'voicerProfile' }] 
        : [{ model: BrandProfile, as: 'brandProfile' }]
    });

    if (!userWithProfile) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { user: userWithProfile }
    });
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener perfil de usuario',
      error: error.message
    });
  }
};

/**
 * Actualizar datos básicos del usuario
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, avatar } = req.body;

    // Actualizar usuario con los campos proporcionados
    await User.update(
      { firstName, lastName, phone, avatar },
      { where: { id: userId } }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Perfil actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar perfil de usuario:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar perfil de usuario',
      error: error.message
    });
  }
};

/**
 * Actualizar perfil de Voicer
 */
const updateVoicerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      bio, instagramHandle, instagramFollowers,
      tiktokHandle, tiktokFollowers, 
      facebookHandle, facebookFollowers,
      youtubeHandle, youtubeFollowers,
      interests, location, birthday, gender,
      preferredPaymentMethod, paymentInfo,
      availableForCampaigns
    } = req.body;

    // Buscar el perfil existente
    const voicerProfile = await VoicerProfile.findOne({ where: { userId } });

    if (!voicerProfile) {
      return res.status(404).json({
        status: 'error',
        message: 'Perfil de Voicer no encontrado'
      });
    }

    // Actualizar perfil con los campos proporcionados
    await voicerProfile.update({
      bio, instagramHandle, instagramFollowers,
      tiktokHandle, tiktokFollowers,
      facebookHandle, facebookFollowers,
      youtubeHandle, youtubeFollowers,
      interests, location, birthday, gender,
      preferredPaymentMethod, paymentInfo,
      availableForCampaigns
    });

    return res.status(200).json({
      status: 'success',
      message: 'Perfil de Voicer actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar perfil de Voicer:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar perfil de Voicer',
      error: error.message
    });
  }
};

/**
 * Actualizar perfil de Marca
 */
const updateBrandProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      brandName, logo, industry, description, website,
      instagramHandle, facebookHandle, tiktokHandle, youtubeHandle,
      businessAddress, city, state, zipCode, country,
      taxId, contactPersonName, contactPersonPosition,
      billingInfo, foundedYear
    } = req.body;

    // Buscar el perfil existente
    const brandProfile = await BrandProfile.findOne({ where: { userId } });

    if (!brandProfile) {
      return res.status(404).json({
        status: 'error',
        message: 'Perfil de Marca no encontrado'
      });
    }

    // Actualizar perfil con los campos proporcionados
    await brandProfile.update({
      brandName, logo, industry, description, website,
      instagramHandle, facebookHandle, tiktokHandle, youtubeHandle,
      businessAddress, city, state, zipCode, country,
      taxId, contactPersonName, contactPersonPosition,
      billingInfo, foundedYear
    });

    return res.status(200).json({
      status: 'success',
      message: 'Perfil de Marca actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar perfil de Marca:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar perfil de Marca',
      error: error.message
    });
  }
};

/**
 * Obtener lista de Voicers con filtros
 */
const getVoicers = async (req, res) => {
  try {
    const {
      location,
      interests,
      platform,
      minFollowers,
      page = 1,
      limit = 10
    } = req.query;

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Configurar where para filtros
    const where = {};
    const includeWhere = {};

    if (location) {
      includeWhere.location = { [Op.iLike]: `%${location}%` };
    }

    if (interests) {
      includeWhere.interests = { [Op.overlap]: Array.isArray(interests) ? interests : [interests] };
    }

    if (platform && minFollowers) {
      if (platform === 'instagram') {
        includeWhere.instagramFollowers = { [Op.gte]: minFollowers };
      } else if (platform === 'tiktok') {
        includeWhere.tiktokFollowers = { [Op.gte]: minFollowers };
      } else if (platform === 'facebook') {
        includeWhere.facebookFollowers = { [Op.gte]: minFollowers };
      } else if (platform === 'youtube') {
        includeWhere.youtubeFollowers = { [Op.gte]: minFollowers };
      }
    }

    // Buscar usuarios Voicer con sus perfiles
    const voicers = await User.findAndCountAll({
      where: { 
        role: 'voicer',
        status: 'active'
      },
      attributes: { 
        exclude: ['password', 'verificationToken', 'resetPasswordToken', 'resetPasswordExpires'] 
      },
      include: [{
        model: VoicerProfile,
        as: 'voicerProfile',
        where: Object.keys(includeWhere).length > 0 ? includeWhere : undefined
      }],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      status: 'success',
      data: {
        voicers: voicers.rows,
        totalCount: voicers.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(voicers.count / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener lista de voicers:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener lista de voicers',
      error: error.message
    });
  }
};

/**
 * Obtener lista de Marcas con filtros
 */
const getBrands = async (req, res) => {
  try {
    const {
      industry,
      location,
      page = 1,
      limit = 10
    } = req.query;

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Configurar where para filtros
    const where = {};
    const includeWhere = {};

    if (industry) {
      includeWhere.industry = { [Op.iLike]: `%${industry}%` };
    }

    if (location) {
      includeWhere.city = { [Op.iLike]: `%${location}%` };
    }

    // Buscar usuarios Marca con sus perfiles
    const brands = await User.findAndCountAll({
      where: { 
        role: 'brand',
        status: 'active'
      },
      attributes: { 
        exclude: ['password', 'verificationToken', 'resetPasswordToken', 'resetPasswordExpires'] 
      },
      include: [{
        model: BrandProfile,
        as: 'brandProfile',
        where: Object.keys(includeWhere).length > 0 ? includeWhere : undefined
      }],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      status: 'success',
      data: {
        brands: brands.rows,
        totalCount: brands.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(brands.count / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener lista de marcas:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener lista de marcas',
      error: error.message
    });
  }
};

/**
 * Obtener detalle de un usuario por ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { 
        exclude: ['password', 'verificationToken', 'resetPasswordToken', 'resetPasswordExpires'] 
      },
      include: [
        { 
          model: VoicerProfile, 
          as: 'voicerProfile',
          required: false
        },
        { 
          model: BrandProfile, 
          as: 'brandProfile',
          required: false
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateVoicerProfile,
  updateBrandProfile,
  getVoicers,
  getBrands,
  getUserById
}; 