import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { listMyDocuments, uploadDocument } from '../controllers/documents.controller';

const router = Router();

router.get('/me', protect, listMyDocuments);
router.post('/', protect, uploadDocument);

export default router;

