import { Request, Response } from 'express';
import db from '../config/knex-pg';

export const createVendor = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const payload = {
      user_id: userId,
      name: req.body.name,
      company_name: req.body.company_name,
      email: req.body.email,
      phone: req.body.phone,
      state: req.body.state,
      lga: req.body.lga,
      business_address: req.body.business_address,
      date_of_birth: req.body.date_of_birth,
      valid_id: req.body.valid_id,
      profile_picture: req.body.profile_picture,
      category: req.body.category,
    };
    const [row] = await db('vendors').insert(payload).onConflict('user_id').merge(payload).returning('*');
    return res.status(201).json({ success: true, data: row });
  } catch (e) {
    console.error('createVendor error', e);
    return res.status(500).json({ success: false, message: 'Could not create vendor profile' });
  }
};

export const listVendors = async (_req: Request, res: Response) => {
  try {
    const rows = await db('vendors').select('*').orderBy('id', 'desc').limit(200);
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('listVendors error', e);
    res.status(500).json({ success: false, message: 'Could not fetch vendors' });
  }
};
