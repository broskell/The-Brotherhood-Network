import express from 'express';
import * as circleController from './trustedCircle.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth protection middleware to all circle routes
router.use(protect);

router.post('/request', circleController.sendRequest);
router.patch('/:id/accept', circleController.acceptRequest);
router.patch('/:id/reject', circleController.rejectRequest);
router.delete('/:id', circleController.removeMember);
router.get('/', circleController.getMembers);

export default router;
