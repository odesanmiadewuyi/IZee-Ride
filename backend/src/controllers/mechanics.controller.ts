import { Request, Response } from 'express';
import db from '../config/knex-pg';

export const createMechanic = async (req: Request, res: Response) => {
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
    };
    const [row] = await db('mechanics').insert(payload).onConflict('user_id').merge(payload).returning('*');
    return res.status(201).json({ success: true, data: row });
  } catch (e) {
    console.error('createMechanic error', e);
    return res.status(500).json({ success: false, message: 'Could not create mechanic profile' });
  }
};

export const listMechanics = async (_req: Request, res: Response) => {
  try {
    const rows = await db('mechanics').select('*').orderBy('id', 'desc').limit(200);
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('listMechanics error', e);
    res.status(500).json({ success: false, message: 'Could not fetch mechanics' });
  }
};

