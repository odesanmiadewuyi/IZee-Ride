import { Request, Response } from "express";
import db from "../config/knex-pg";

export const listCards = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const cards = await db("cards").where({ user_id: userId }).orderBy("id", "desc");
    res.json({ success: true, data: cards });
  } catch (e) {
    console.error("listCards error", e);
    res.status(500).json({ success: false, message: "Could not fetch cards" });
  }
};

export const addCard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { cardNumber, expMonth, expYear, brand = "Card" } = req.body as any;
    if (!cardNumber || !expMonth || !expYear) {
      return res.status(400).json({ success: false, message: "cardNumber, expMonth, expYear required" });
    }
    const last4 = String(cardNumber).slice(-4);
    const [card] = await db("cards").insert({ user_id: userId, brand, last4, exp_month: expMonth, exp_year: expYear }).returning("*");
    res.status(201).json({ success: true, data: card });
  } catch (e) {
    console.error("addCard error", e);
    res.status(500).json({ success: false, message: "Could not add card" });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { id } = req.params;
    const deleted = await db("cards").where({ id, user_id: userId }).del();
    if (!deleted) return res.status(404).json({ success: false, message: "Card not found" });
    res.status(204).send();
  } catch (e) {
    console.error("deleteCard error", e);
    res.status(500).json({ success: false, message: "Could not delete card" });
  }
};

