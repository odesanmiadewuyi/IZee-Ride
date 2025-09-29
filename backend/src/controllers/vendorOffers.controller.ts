import { Request, Response } from 'express';
import db from '../config/knex-pg';

export const listVendorOffers = async (req: Request, res: Response) => {
  try {
    const { vendor_id, service_key } = req.query as any;
    const q = db('vendor_service_offers as o')
      .join('vendors as v', 'o.vendor_id', 'v.id')
      .join('services_catalog as s', 'o.service_id', 's.id')
      .select('o.*', 'v.name as vendor_name', 's.key as service_key', 's.name as service_name');
    if (vendor_id) q.where('o.vendor_id', Number(vendor_id));
    if (service_key) q.where('s.key', service_key);
    const rows = await q.orderBy('o.id', 'desc').limit(200);
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('listVendorOffers error', e);
    res.status(500).json({ success: false, message: 'Could not fetch offers' });
  }
};

export const createVendorOffer = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const vendor = await db('vendors').where({ user_id: userId }).first();
    if (!vendor) return res.status(400).json({ message: 'Create vendor profile first' });

    const { service_key, name, price, description } = req.body as any;
    if (!service_key || !name) return res.status(400).json({ message: 'service_key and name are required' });
    const svc = await db('services_catalog').where({ key: service_key }).first();
    if (!svc) return res.status(400).json({ message: 'Unknown service_key' });

    const [row] = await db('vendor_service_offers')
      .insert({ vendor_id: vendor.id, service_id: svc.id, name, price: price ?? 0, description })
      .returning('*');
    res.status(201).json({ success: true, data: row });
  } catch (e) {
    console.error('createVendorOffer error', e);
    res.status(500).json({ success: false, message: 'Could not create offer' });
  }
};

