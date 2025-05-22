const { validationResult } = require('express-validator');

/**
 * Middleware para validar solicitudes usando express-validator
 * Debe usarse después de definir las reglas de validación en las rutas
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Error de validación',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateRequest
}; 