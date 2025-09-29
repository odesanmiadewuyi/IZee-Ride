import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { listCommunityMessages, postCommunityMessage } from '../controllers/community.controller';

const router = Router();

router.get('/', listCommunityMessages);
router.post('/', protect, postCommunityMessage);

export default router;

