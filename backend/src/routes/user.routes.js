const express = require('express');
const { body, param } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

/**
 * @route GET /api/users/profile
 * @desc Obtener perfil del usuario autenticado
 * @access Private
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @route PUT /api/users/profile
 * @desc Actualizar perfil del usuario autenticado
 * @access Private
 */
router.put('/profile', [
  authenticate,
  body('firstName').optional().isString().trim().withMessage('El nombre debe ser un texto'),
  body('lastName').optional().isString().trim().withMessage('El apellido debe ser un texto'),
  body('phone').optional().isString().trim().withMessage('El teléfono debe ser un texto'),
  body('avatar').optional().isString().trim().withMessage('El avatar debe ser una URL'),
  validateRequest
], userController.updateProfile);

/**
 * @route PUT /api/users/voicer-profile
 * @desc Actualizar perfil de Voicer
 * @access Private
 */
router.put('/voicer-profile', [
  authenticate,
  authorize(['voicer']),
  validateRequest
], userController.updateVoicerProfile);

/**
 * @route PUT /api/users/brand-profile
 * @desc Actualizar perfil de Marca
 * @access Private
 */
router.put('/brand-profile', [
  authenticate,
  authorize(['brand']),
  validateRequest
], userController.updateBrandProfile);

/**
 * @route GET /api/users/voicers
 * @desc Obtener lista de Voicers con filtros opcionales
 * @access Public
 */
router.get('/voicers', userController.getVoicers);

/**
 * @route GET /api/users/brands
 * @desc Obtener lista de Marcas con filtros opcionales
 * @access Public
 */
router.get('/brands', userController.getBrands);

/**
 * @route GET /api/users/:id
 * @desc Obtener detalle de un usuario por ID
 * @access Public
 */
router.get('/:id', [
  param('id').isUUID(4).withMessage('ID de usuario inválido'),
  validateRequest
], userController.getUserById);

module.exports = router; 