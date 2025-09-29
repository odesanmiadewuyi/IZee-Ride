import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { activateVendor, listServices, listVendorsByService, setMyVendorServices } from '../controllers/services.controller';

const router = Router();

router.get('/', listServices);
router.get('/vendors', listVendorsByService); // ?key=mechanical&state=...&lga=...
router.post('/vendors/me/services', protect, setMyVendorServices);
router.patch('/vendors/:id/activate', protect, activateVendor); // assume protect ensures admin elsewhere

export default router;

