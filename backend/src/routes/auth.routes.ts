import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { getProfile, register, login, changePassword } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.post("/change-password", protect, changePassword);

export default router; // important for default import
