import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { createVendor, listVendors } from '../controllers/vendors.controller';

const router = Router();

router.get('/', listVendors);
router.post('/', protect, createVendor);

export default router;

