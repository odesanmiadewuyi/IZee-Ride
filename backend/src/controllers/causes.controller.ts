import { Request, Response } from "express";
import db from "../config/knex-pg";

export const listCauses = async (_req: Request, res: Response) => {
  try {
    const rows = await db('causes').orderBy('id', 'desc');
    res.json(rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      amountRequired: Number(row.amount_required ?? 0),
      currency: row.currency,
      createdAt: row.created_at,
    })));
  } catch (err) {
    console.error('listCauses error', err);
    res.status(500).json({ message: 'Could not fetch causes' });
  }
};

export const createCause = async (req: Request, res: Response) => {
  try {
    const { title, description, amountRequired, currency = 'NGN' } = req.body ?? {};
    if (!title) return res.status(400).json({ message: 'title is required' });
    const amount = Number(amountRequired ?? 0);
    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ message: 'amountRequired must be a positive number' });
    }
    const [cause] = await db('causes')
      .insert({
        title,
        description,
        amount_required: amount,
        currency,
      })
      .returning('*');

    res.status(201).json({
      id: cause.id,
      title: cause.title,
      description: cause.description,
      amountRequired: Number(cause.amount_required ?? 0),
      currency: cause.currency,
      createdAt: cause.created_at,
    });
  } catch (err) {
    console.error('createCause error', err);
    res.status(500).json({ message: 'Could not create cause' });
  }
};
