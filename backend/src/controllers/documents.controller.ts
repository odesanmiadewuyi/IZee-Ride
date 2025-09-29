import { Request, Response } from 'express';
import db from '../config/knex-pg';

export const listMyDocuments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const docs = await db('documents').where({ user_id: userId }).orderBy('id', 'desc');
    res.json({ success: true, data: docs });
  } catch (e) {
    console.error('listMyDocuments error', e);
    res.status(500).json({ success: false, message: 'Could not fetch documents' });
  }
};

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { category, fileName, fileUrl } = req.body as any; // fileUrl is a placeholder to a stored file
    if (!category) return res.status(400).json({ success: false, message: 'category is required' });
    const [doc] = await db('documents').insert({ user_id: userId, category, file_name: fileName, file_url: fileUrl }).returning('*');
    res.status(201).json({ success: true, data: doc });
  } catch (e) {
    console.error('uploadDocument error', e);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

