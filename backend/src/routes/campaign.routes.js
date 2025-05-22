const express = require('express');
const { body, param, query } = require('express-validator');
const { authenticate, authorize, isResourceOwner } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const campaignController = require('../controllers/campaign.controller');

const router = express.Router();

// Middleware para verificar si el usuario es dueño de la campaña
const isCampaignOwner = isResourceOwner(async (req) => {
  const campaignId = req.params.id;
  const campaign = await req.app.locals.db.Campaign.findByPk(campaignId);
  return campaign ? campaign.creatorId : null;
});

/**
 * @route GET /api/campaigns
 * @desc Obtener listado de campañas con filtros
 * @access Public
 */
router.get('/', [
  query('status').optional().isIn(['draft', 'active', 'pending_approval', 'approved', 'in_progress', 'completed', 'cancelled']),
  query('industry').optional().isString(),
  query('minBudget').optional().isNumeric(),
  query('maxBudget').optional().isNumeric(),
  query('location').optional().isString(),
  query('platform').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  validateRequest
], campaignController.getCampaigns);

/**
 * @route POST /api/campaigns
 * @desc Crear una nueva campaña
 * @access Private
 */
router.post('/', [
  authenticate,
  authorize(['brand']),
  body('title').isString().notEmpty().withMessage('El título es obligatorio'),
  body('description').optional().isString(),
  body('brief').optional().isString(),
  body('budget').isNumeric().withMessage('El presupuesto debe ser un número'),
  body('paymentPerVoicer').isNumeric().withMessage('El pago por Voicer debe ser un número'),
  validateRequest
], campaignController.createCampaign);

/**
 * @route GET /api/campaigns/:id
 * @desc Obtener detalle de una campaña
 * @access Public
 */
router.get('/:id', [
  param('id').isUUID(4).withMessage('ID de campaña inválido'),
  validateRequest
], campaignController.getCampaignById);

/**
 * @route PUT /api/campaigns/:id
 * @desc Actualizar una campaña
 * @access Private
 */
router.put('/:id', [
  authenticate,
  param('id').isUUID(4).withMessage('ID de campaña inválido'),
  body('title').optional().isString().notEmpty().withMessage('El título no puede estar vacío'),
  body('description').optional().isString(),
  body('brief').optional().isString(),
  body('budget').optional().isNumeric().withMessage('El presupuesto debe ser un número'),
  body('paymentPerVoicer').optional().isNumeric().withMessage('El pago por Voicer debe ser un número'),
  body('status').optional().isIn(['draft', 'active', 'pending_approval', 'in_progress', 'completed', 'cancelled']),
  validateRequest,
  isCampaignOwner
], campaignController.updateCampaign);

/**
 * @route DELETE /api/campaigns/:id
 * @desc Eliminar una campaña
 * @access Private
 */
router.delete('/:id', [
  authenticate,
  param('id').isUUID(4).withMessage('ID de campaña inválido'),
  validateRequest,
  isCampaignOwner
], campaignController.deleteCampaign);

/**
 * @route POST /api/campaigns/:id/apply
 * @desc Aplicar a una campaña como Voicer
 * @access Private
 */
router.post('/:id/apply', [
  authenticate,
  authorize(['voicer']),
  param('id').isUUID(4).withMessage('ID de campaña inválido'),
  validateRequest
], campaignController.applyToCampaign);

/**
 * @route PUT /api/campaigns/:id/participants/:userId
 * @desc Actualizar el estado de un participante en una campaña
 * @access Private
 */
router.put('/:id/participants/:userId', [
  authenticate,
  param('id').isUUID(4).withMessage('ID de campaña inválido'),
  param('userId').isUUID(4).withMessage('ID de usuario inválido'),
  body('status').isIn(['approved', 'rejected', 'completed']).withMessage('Estado inválido'),
  validateRequest,
  isCampaignOwner
], campaignController.updateParticipantStatus);

/**
 * @route GET /api/campaigns/:id/participants
 * @desc Obtener participantes de una campaña
 * @access Private
 */
router.get('/:id/participants', [
  authenticate,
  param('id').isUUID(4).withMessage('ID de campaña inválido'),
  validateRequest
], campaignController.getCampaignParticipants);

/**
 * @route POST /api/campaigns/:id/content
 * @desc Agregar contenido a una campaña
 * @access Private
 */
router.post('/:id/content', [
  authenticate,
  param('id').isUUID(4).withMessage('ID de campaña inválido'),
  body('mediaUrl').optional().isURL().withMessage('URL de media inválida'),
  body('caption').optional().isString(),
  body('contentType').isIn(['image', 'video', 'text', 'audio', 'story', 'reel', 'tiktok']).withMessage('Tipo de contenido inválido'),
  validateRequest
], campaignController.addContent);

/**
 * @route GET /api/campaigns/:id/content
 * @desc Obtener contenidos de una campaña
 * @access Public
 */
router.get('/:id/content', [
  param('id').isUUID(4).withMessage('ID de campaña inválido'),
  validateRequest
], campaignController.getCampaignContent);

/**
 * @route PUT /api/campaigns/:id/content/:contentId
 * @desc Actualizar el estado de un contenido
 * @access Private
 */
router.put('/:id/content/:contentId', [
  authenticate,
  param('id').isUUID(4).withMessage('ID de campaña inválido'),
  param('contentId').isUUID(4).withMessage('ID de contenido inválido'),
  body('status').isIn(['submitted', 'approved', 'rejected', 'published']).withMessage('Estado inválido'),
  validateRequest
], campaignController.updateContentStatus);

module.exports = router; 