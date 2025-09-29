import { Request, Response } from "express";
import db from "../config/knex-pg";

async function getOrCreatePoints(userId: number) {
  let row = await db("milepoints").where({ user_id: userId }).first();
  if (!row) {
    const [created] = await db("milepoints").insert({ user_id: userId, points: 0 }).returning("*");
    row = created;
  }
  return row;
}

export const getMyPoints = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const points = await getOrCreatePoints(userId);
    res.json({ success: true, data: { points: points.points } });
  } catch (e) {
    console.error("getMyPoints error", e);
    res.status(500).json({ success: false, message: "Could not fetch points" });
  }
};

export const earnPoints = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { points, reference, meta } = req.body as any;
    if (!Number.isInteger(points) || points <= 0) return res.status(400).json({ success: false, message: "Invalid points" });
    const row = await getOrCreatePoints(userId);
    const newPoints = Number(row.points) + points;
    await db("milepoints").where({ id: row.id }).update({ points: newPoints, updated_at: db.fn.now() });
    await db("milepoint_transactions").insert({ user_id: userId, type: 'earn', points, reference, meta });
    res.status(201).json({ success: true, data: { points: newPoints } });
  } catch (e) {
    console.error("earnPoints error", e);
    res.status(500).json({ success: false, message: "Could not add points" });
  }
};

export const listTickets = async (_req: Request, res: Response) => {
  try {
    const tickets = await db("tickets").orderBy("price_points");
    res.json({ success: true, data: tickets });
  } catch (e) {
    console.error("listTickets error", e);
    res.status(500).json({ success: false, message: "Could not fetch tickets" });
  }
};

export const claimTicket = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { ticketId } = req.body as any;
    const ticket = await db("tickets").where({ id: ticketId }).first();
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    const pointsRow = await getOrCreatePoints(userId);
    if (Number(pointsRow.points) < Number(ticket.price_points)) {
      return res.status(400).json({ success: false, message: "Insufficient mile points" });
    }
    const newPoints = Number(pointsRow.points) - Number(ticket.price_points);
    await db("milepoints").where({ id: pointsRow.id }).update({ points: newPoints, updated_at: db.fn.now() });
    const [claim] = await db("ticket_claims").insert({ user_id: userId, ticket_id: ticket.id, points_spent: ticket.price_points, status: 'pending' }).returning("*");
    await db("milepoint_transactions").insert({ user_id: userId, type: 'redeem', points: ticket.price_points, reference: `ticket:${ticket.id}`, meta: { ticket_name: ticket.name } });
    res.status(201).json({ success: true, data: { claim, remainingPoints: newPoints } });
  } catch (e) {
    console.error("claimTicket error", e);
    res.status(500).json({ success: false, message: "Could not claim ticket" });
  }
};

