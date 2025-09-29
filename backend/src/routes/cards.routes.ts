import { Router } from "express";
import { listCards, addCard, deleteCard } from "../controllers/cards.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", auth(), listCards);
router.post("/", auth(), addCard);
router.delete("/:id", auth(), deleteCard);

export default router;

