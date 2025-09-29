import { Router } from 'express';
import { sendSupportMessage, mySupportMessages } from '../controllers/support.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/me', protect, mySupportMessages);
router.post('/', protect, sendSupportMessage);

export default router;

