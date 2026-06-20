import express from 'express';
import * as sosController from './sos.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth protection middleware
router.use(protect);

router.post('/', sosController.createSos);
router.patch('/:id/location', sosController.updateLocation);
router.patch('/:id/accept', sosController.acceptSos);
router.patch('/:id/resolve', sosController.resolveSos);
router.get('/active', sosController.getActiveAlerts);
router.get('/history', sosController.getHistory);

export default router;
