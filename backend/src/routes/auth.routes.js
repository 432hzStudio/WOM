const express = require('express');
const { body, param } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Registrar un nuevo usuario
 * @access Public
 */
router.post('/register', [
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('role').optional().isIn(['voicer', 'brand']).withMessage('Rol inválido'),
  validateRequest
], authController.register);

/**
 * @route POST /api/auth/login
 * @desc Iniciar sesión con email y contraseña
 * @access Public
 */
router.post('/login', [
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  validateRequest
], authController.login);

/**
 * @route GET /api/auth/verify/:token
 * @desc Verificar cuenta con token
 * @access Public
 */
router.get('/verify/:token', [
  param('token').isUUID(4).withMessage('Token inválido'),
  validateRequest
], authController.verifyAccount);

/**
 * @route POST /api/auth/forgot-password
 * @desc Solicitar restablecimiento de contraseña
 * @access Public
 */
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Debe ser un email válido'),
  validateRequest
], authController.forgotPassword);

/**
 * @route POST /api/auth/reset-password
 * @desc Restablecer contraseña con token
 * @access Public
 */
router.post('/reset-password', [
  body('token').isString().withMessage('Token inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  validateRequest
], authController.resetPassword);

/**
 * @route GET /api/auth/me
 * @desc Obtener datos del usuario autenticado
 * @access Private
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @route PUT /api/auth/update-password
 * @desc Actualizar contraseña del usuario autenticado
 * @access Private
 */
router.put('/update-password', [
  authenticate,
  body('currentPassword').isLength({ min: 6 }).withMessage('La contraseña actual debe tener al menos 6 caracteres'),
  body('newPassword').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  validateRequest
], authController.updatePassword);

/**
 * @route POST /api/auth/google
 * @desc Autenticación con Google
 * @access Public
 */
router.post('/google', [
  body('googleToken').isString().withMessage('Token de Google inválido'),
  validateRequest
], authController.googleAuth);

module.exports = router; 
 