import { Request, Response } from 'express';
import db from '../config/knex-pg';

export const listParts = async (req: Request, res: Response) => {
  try {
    const { vendor_id } = req.query as any;
    const q = db('parts').select('*').orderBy('id', 'desc');
    if (vendor_id) q.where({ vendor_id: Number(vendor_id) });
    const rows = await q.limit(200);
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('listParts error', e);
    res.status(500).json({ success: false, message: 'Could not fetch parts' });
  }
};

export const createPart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    // find vendor by user
    const vendor = await db('vendors').where({ user_id: userId }).first();
    if (!vendor) return res.status(400).json({ message: 'Create vendor profile first' });

    const payload = {
      vendor_id: vendor.id,
      name: req.body.name,
      brand: req.body.brand,
      vehicle_make: req.body.vehicle_make,
      vehicle_model: req.body.vehicle_model,
      vehicle_type: req.body.vehicle_type,
      price: req.body.price ?? 0,
      stock: req.body.stock ?? 0,
      image_url: req.body.image_url,
      description: req.body.description,
    };

    const [row] = await db('parts').insert(payload).returning('*');
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    console.error('createPart error', e);
    res.status(500).json({ success: false, message: 'Could not create part' });
  }
};

