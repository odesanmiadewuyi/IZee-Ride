import { Router } from "express";
import { auth } from "../middleware/auth";
import { getMyPoints, listTickets, claimTicket, earnPoints } from "../controllers/rewards.controller";

const router = Router();

router.get("/points/me", auth(), getMyPoints);
router.post("/points/earn", auth(), earnPoints);
router.get("/tickets", listTickets);
router.post("/tickets/claim", auth(), claimTicket);

export default router;

