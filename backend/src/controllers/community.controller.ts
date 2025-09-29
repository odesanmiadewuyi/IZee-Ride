import { Request, Response } from 'express';
import db from '../config/knex-pg';

export const listCommunityMessages = async (_req: Request, res: Response) => {
  try {
    const rows = await db('community_messages')
      .leftJoin('users', 'community_messages.user_id', 'users.id')
      .select('community_messages.*', 'users.name as user_name')
      .orderBy('community_messages.id', 'asc')
      .limit(200);
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('listCommunityMessages error', e);
    res.status(500).json({ success: false, message: 'Could not fetch messages' });
  }
};

export const postCommunityMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { content } = req.body as any;
    if (!content) return res.status(400).json({ success: false, message: 'content is required' });
    const [row] = await db('community_messages').insert({ user_id: userId, content }).returning('*');
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    console.error('postCommunityMessage error', e);
    res.status(500).json({ success: false, message: 'Could not post message' });
  }
};

