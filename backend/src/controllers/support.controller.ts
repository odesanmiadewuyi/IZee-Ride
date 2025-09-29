import { Request, Response } from 'express';
import db from '../config/knex-pg';

export const sendSupportMessage = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { subject, message, email } = req.body as any;
    if (!message) return res.status(400).json({ success: false, message: 'message is required' });
    const [row] = await db('support_messages')
      .insert({ user_id: user?.id, subject, message, email })
      .returning('*');
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    console.error('sendSupportMessage error', e);
    res.status(500).json({ success: false, message: 'Failed to send support message' });
  }
};

export const mySupportMessages = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const rows = await db('support_messages').where({ user_id: user.id }).orderBy('id', 'desc');
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('mySupportMessages error', e);
    res.status(500).json({ success: false, message: 'Failed to fetch support messages' });
  }
};

