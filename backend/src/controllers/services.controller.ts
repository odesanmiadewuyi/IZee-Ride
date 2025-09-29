import { Request, Response } from 'express';
import db from '../config/knex-pg';

export const listServices = async (_req: Request, res: Response) => {
  try {
    const rows = await db('services_catalog').select('*').orderBy('id', 'asc');
    res.json({ success: true, data: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Could not fetch services' });
  }
};

export const setMyVendorServices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const vendor = await db('vendors').where({ user_id: userId }).first();
    if (!vendor) return res.status(400).json({ message: 'Create vendor profile first' });

    const serviceKeys: string[] = Array.isArray(req.body?.keys) ? req.body.keys : [];
    const services = await db('services_catalog').whereIn('key', serviceKeys);
    const ids = services.map((s) => s.id);

    await db('vendor_services').where({ vendor_id: vendor.id }).del();
    if (ids.length) {
      await db('vendor_services').insert(ids.map((sid) => ({ vendor_id: vendor.id, service_id: sid })));
    }
    res.json({ success: true });
  } catch (e) {
    console.error('setMyVendorServices error', e);
    res.status(500).json({ success: false, message: 'Could not update vendor services' });
  }
};

export const listVendorsByService = async (req: Request, res: Response) => {
  try {
    const { key, state, lga } = req.query as any;
    const svc = await db('services_catalog').where({ key }).first();
    if (!svc) return res.status(400).json({ success: false, message: 'Unknown service key' });

    let q = db('vendors as v')
      .join('vendor_services as vs', 'v.id', 'vs.vendor_id')
      .where('vs.service_id', svc.id)
      .andWhere('v.is_active', true)
      .select('v.*');

    if (state) q = q.andWhere('v.state', state);
    if (lga) q = q.andWhere('v.lga', lga);

    const rows = await q.orderBy('v.id', 'desc').limit(200);
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('listVendorsByService error', e);
    res.status(500).json({ success: false, message: 'Could not fetch vendors' });
  }
};

export const activateVendor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { is_active } = req.body as any;
    await db('vendors').where({ id }).update({ is_active: !!is_active, vetted_at: db.fn.now() });
    const row = await db('vendors').where({ id }).first();
    res.json({ success: true, data: row });
  } catch (e) {
    console.error('activateVendor error', e);
    res.status(500).json({ success: false, message: 'Could not update vendor' });
  }
};

