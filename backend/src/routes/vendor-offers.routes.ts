import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { createVendorOffer, listVendorOffers } from '../controllers/vendorOffers.controller';

const router = Router();

router.get('/', listVendorOffers);
router.post('/', protect, createVendorOffer);

export default router;

