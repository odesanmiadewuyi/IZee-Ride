import { Router } from "express";
import {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
    payServiceCharge,
    payCommission,
  } from "../controllers/payments.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

// New endpoints for the payment flows in UI
router.post("/service-charge", auth(), payServiceCharge);
router.post("/commission", auth(), payCommission);

export default router;
