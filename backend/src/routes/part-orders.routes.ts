import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { createPartOrder, listMechanicOrders, listVendorOrders, updateOrderStatus } from '../controllers/partOrders.controller';

const router = Router();

// Mechanic creates an order
router.post('/', protect, createPartOrder);

// Mechanic views own orders
router.get('/me', protect, listMechanicOrders);

// Vendor views incoming orders
router.get('/vendor', protect, listVendorOrders);

// Vendor updates status
router.patch('/:id/status', protect, updateOrderStatus);

export default router;

