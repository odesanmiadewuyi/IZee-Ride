// src/routes/rides.routes.ts
import { Router } from 'express';
import {
  getRides,
  getRideById,
  requestRide,
  updateRideStatus,
} from '../controllers/rides.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getRides);
router.get('/:id', getRideById);
router.post('/', requestRide);
router.put('/:id/status', updateRideStatus);

export default router;
