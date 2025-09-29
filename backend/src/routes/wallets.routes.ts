import { Router } from "express";
import { getMyWallet, topUpWallet, getWalletTransactions, withdrawFromWallet } from "../controllers/wallets.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/me", auth(), getMyWallet);
router.get("/me/transactions", auth(), getWalletTransactions);
router.get("/", auth(), getMyWallet);
router.post("/topup", auth(), topUpWallet);
router.post("/withdraw", auth(), withdrawFromWallet);

export default router;
