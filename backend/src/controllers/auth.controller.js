const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, VoicerProfile, BrandProfile } = require('../models');
const config = require('../config/config');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

/**
 * Registrar un nuevo usuario
 */
const register = async (req, res) => {
  try {
    const { 
      email, password, firstName, lastName, role, phone,
      // Campos para perfil de Voicer
      bio, instagramHandle, tiktokHandle, facebookHandle,
      // Campos para perfil de Marca
      brandName, industry, website, description, logo
    } = req.body;

    // Verificar si el email ya está en uso
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'El email ya está registrado'
      });
    }

    // Validar que el rol sea válido
    if (role && !['voicer', 'brand'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Rol inválido'
      });
    }

    // Crear usuario
    const user = await User.create({
      id: uuidv4(),
      email,
      password,
      firstName,
      lastName,
      role: role || 'voicer', // Default a 'voicer' si no se especifica
      phone,
      verificationToken: uuidv4(),
      isVerified: false,
      status: 'active'
    });

    // Según el rol, crear el perfil correspondiente
    if (role === 'brand' || role === undefined) {
      await BrandProfile.create({
        id: uuidv4(),
        userId: user.id,
        brandName: brandName || firstName,
        industry,
        website,
        description,
        logo
      });
    }

    if (role === 'voicer' || role === undefined) {
      await VoicerProfile.create({
        id: uuidv4(),
        userId: user.id,
        bio,
        instagramHandle,
        tiktokHandle,
        facebookHandle
      });
    }

    // Generar token JWT para devolverlo en la respuesta
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // TODO: Enviar email de verificación

    // Enviar respuesta sin exponer la contraseña
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      isVerified: user.isVerified
    };

    return res.status(201).json({
      status: 'success',
      message: 'Usuario registrado correctamente',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

/**
 * Iniciar sesión
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });

    // Si no se encuentra el usuario o la contraseña no coincide
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar que la cuenta esté activa
    if (user.status !== 'active') {
      return res.status(403).json({
        status: 'error',
        message: 'Cuenta suspendida o inactiva'
      });
    }

    // Actualizar último login
    await user.update({ lastLogin: new Date() });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Preparar datos del usuario sin exponer información sensible
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar
    };

    // Incluir el perfil correspondiente según el rol
    let profile = null;
    if (user.role === 'voicer') {
      profile = await VoicerProfile.findOne({ where: { userId: user.id } });
    } else if (user.role === 'brand') {
      profile = await BrandProfile.findOne({ where: { userId: user.id } });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Login exitoso',
      data: {
        user: userResponse,
        profile,
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

/**
 * Verificar cuenta de usuario
 */
const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token de verificación inválido o expirado'
      });
    }

    // Actualizar usuario a verificado
    await user.update({
      isVerified: true,
      verificationToken: null
    });

    return res.status(200).json({
      status: 'success',
      message: 'Cuenta verificada correctamente'
    });
  } catch (error) {
    console.error('Error al verificar cuenta:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al verificar la cuenta',
      error: error.message
    });
  }
};

/**
 * Solicitar restablecimiento de contraseña
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // No revelar si el email existe o no por seguridad
      return res.status(200).json({
        status: 'success',
        message: 'Si existe una cuenta con este email, se enviará un enlace para restablecer la contraseña'
      });
    }

    // Generar token y guardar en la base de datos
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Expira en 1 hora

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry
    });

    // TODO: Enviar email con instrucciones y token

    return res.status(200).json({
      status: 'success',
      message: 'Si existe una cuenta con este email, se enviará un enlace para restablecer la contraseña'
    });
  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al procesar la solicitud',
      error: error.message
    });
  }
};

/**
 * Restablecer contraseña con token
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() } // Token no expirado
      }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token de restablecimiento inválido o expirado'
      });
    }

    // Actualizar contraseña y limpiar tokens
    await user.update({
      password,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    return res.status(200).json({
      status: 'success',
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al restablecer la contraseña',
      error: error.message
    });
  }
};

/**
 * Obtener datos del usuario autenticado
 */
const getMe = async (req, res) => {
  try {
    const user = req.user;

    // Obtener perfil según el rol
    let profile = null;
    if (user.role === 'voicer') {
      profile = await VoicerProfile.findOne({ where: { userId: user.id } });
    } else if (user.role === 'brand') {
      profile = await BrandProfile.findOne({ where: { userId: user.id } });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          isVerified: user.isVerified,
          isKYCVerified: user.isKYCVerified,
          avatar: user.avatar,
          status: user.status,
          lastLogin: user.lastLogin
        },
        profile
      }
    });
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener los datos del usuario',
      error: error.message
    });
  }
};

/**
 * Actualizar contraseña del usuario autenticado
 */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Obtener usuario completo con contraseña
    const user = await User.findByPk(userId);

    // Verificar la contraseña actual
    if (!(await user.validatePassword(currentPassword))) {
      return res.status(400).json({
        status: 'error',
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Actualizar contraseña
    await user.update({ password: newPassword });

    return res.status(200).json({
      status: 'success',
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar la contraseña',
      error: error.message
    });
  }
};

/**
 * Autenticación con Google
 */
const googleAuth = async (req, res) => {
  try {
    const { googleToken } = req.body;
    
    // TODO: Verificar token con Firebase Admin SDK
    // Este es un placeholder, se debe implementar la lógica real
    const googleId = 'placeholder_id';
    const email = 'placeholder_email';
    
    // Buscar si el usuario ya existe
    let user = await User.findOne({
      where: {
        [Op.or]: [
          { googleId },
          { email }
        ]
      }
    });
    
    // Si no existe, crear un nuevo usuario
    if (!user) {
      user = await User.create({
        id: uuidv4(),
        googleId,
        email,
        isVerified: true, // Google ya verificó el email
        role: 'voicer', // Default a voicer
        status: 'active'
      });
      
      // Crear perfil básico
      await VoicerProfile.create({
        id: uuidv4(),
        userId: user.id
      });
    } else {
      // Si existe pero no tiene googleId vinculado, actualizarlo
      if (!user.googleId) {
        await user.update({ googleId, isVerified: true });
      }
    }
    
    // Actualizar último login
    await user.update({ lastLogin: new Date() });
    
    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // Devolver respuesta
    return res.status(200).json({
      status: 'success',
      message: 'Autenticación con Google exitosa',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    console.error('Error en autenticación con Google:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error en la autenticación con Google',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  verifyAccount,
  forgotPassword,
  resetPassword,
  getMe,
  updatePassword,
  googleAuth
}; 