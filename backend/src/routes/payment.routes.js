const express = require('express');
const { body, param } = require('express-validator');
const { authenticate, authorize, isResourceOwner } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const paymentController = require('../controllers/payment.controller');

const router = express.Router();

/**
 * @route POST /api/payments/create
 * @desc Crear una intención de pago
 * @access Private
 */
router.post('/create', [
  authenticate,
  authorize(['brand']),
  body('campaignId').isUUID(4).withMessage('ID de campaña inválido'),
  body('recipientId').isUUID(4).withMessage('ID de receptor inválido'),
  body('contentId').optional().isUUID(4).withMessage('ID de contenido inválido'),
  body('amount').isNumeric().withMessage('El monto debe ser un número'),
  body('description').optional().isString(),
  validateRequest
], paymentController.createPaymentIntent);

/**
 * @route GET /api/payments/:id
 * @desc Obtener detalles de un pago
 * @access Private
 */
router.get('/:id', [
  authenticate,
  param('id').isUUID(4).withMessage('ID de pago inválido'),
  validateRequest
], paymentController.getPaymentById);

/**
 * @route GET /api/payments/campaign/:campaignId
 * @desc Obtener pagos de una campaña
 * @access Private
 */
router.get('/campaign/:campaignId', [
  authenticate,
  param('campaignId').isUUID(4).withMessage('ID de campaña inválido'),
  validateRequest
], paymentController.getPaymentsByCampaign);

/**
 * @route GET /api/payments/user/received
 * @desc Obtener pagos recibidos por el usuario
 * @access Private
 */
router.get('/user/received', authenticate, paymentController.getReceivedPayments);

/**
 * @route GET /api/payments/user/sent
 * @desc Obtener pagos enviados por el usuario
 * @access Private
 */
router.get('/user/sent', authenticate, paymentController.getSentPayments);

/**
 * @route PUT /api/payments/:id/confirm
 * @desc Confirmar un pago después de aprobación del contenido
 * @access Private
 */
router.put('/:id/confirm', [
  authenticate,
  param('id').isUUID(4).withMessage('ID de pago inválido'),
  validateRequest
], paymentController.confirmPayment);

/**
 * @route POST /api/payments/webhook
 * @desc Webhook para recibir actualizaciones de la pasarela de pago
 * @access Public
 */
router.post('/webhook', paymentController.handlePaymentWebhook);

module.exports = router; 