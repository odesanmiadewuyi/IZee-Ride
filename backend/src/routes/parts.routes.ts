import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { createPart, listParts } from '../controllers/parts.controller';

const router = Router();

router.get('/', listParts);
router.post('/', protect, createPart);

export default router;

