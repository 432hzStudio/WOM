const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');

/**
 * Middleware para verificar el token JWT y autenticar al usuario
 */
const authenticate = async (req, res, next) => {
  try {
    // Obtener el token del header de autorización
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Acceso no autorizado. Token no proporcionado'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Buscar el usuario en la base de datos
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }
    
    if (user.status !== 'active') {
      return res.status(403).json({
        status: 'error',
        message: 'Cuenta suspendida o inactiva'
      });
    }
    
    // Agregar el objeto de usuario a la solicitud
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expirado'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido'
      });
    }
    
    console.error('Error de autenticación:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error de servidor en la autenticación'
    });
  }
};

/**
 * Middleware para verificar el rol del usuario
 * @param {Array} roles - Array de roles permitidos
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado'
      });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'No tiene permiso para acceder a este recurso'
      });
    }
    
    next();
  };
};

/**
 * Middleware para verificar si el usuario es dueño del recurso
 * @param {Function} getResourceOwnerId - Función que extrae el ID del dueño del recurso
 */
const isResourceOwner = (getResourceOwnerId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'No autenticado'
        });
      }
      
      // Si es admin, permitir acceso
      if (req.user.role === 'admin') {
        return next();
      }
      
      const ownerId = await getResourceOwnerId(req);
      
      // Si el usuario actual es el dueño, permitir
      if (req.user.id === ownerId) {
        return next();
      }
      
      return res.status(403).json({
        status: 'error',
        message: 'No tiene permisos para acceder a este recurso'
      });
    } catch (error) {
      console.error('Error en verificación de propiedad del recurso:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error de servidor al verificar permisos'
      });
    }
  };
};

module.exports = {
  authenticate,
  authorize,
  isResourceOwner
}; 