import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { createMechanic, listMechanics } from '../controllers/mechanics.controller';

const router = Router();

router.get('/', listMechanics);
router.post('/', protect, createMechanic);

export default router;

