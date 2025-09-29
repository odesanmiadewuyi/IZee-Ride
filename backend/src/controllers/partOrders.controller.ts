import { Request, Response } from 'express';
import db from '../config/knex-pg';

const allowedStatuses = ['pending', 'accepted', 'declined', 'shipped', 'delivered', 'cancelled'] as const;
type OrderStatus = typeof allowedStatuses[number];

async function getOrCreateWallet(userId: number) {
  let wallet = await db('wallets').where({ user_id: userId }).first();
  if (!wallet) {
    const [row] = await db('wallets').insert({ user_id: userId, balance: 0, currency: 'NGN' }).returning('*');
    wallet = row;
  }
  return wallet;
}

export const createPartOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    // Prefer mechanic profile; if not, allow drivers to place orders directly
    const mech = await db('mechanics').where({ user_id: userId }).first();

    const items: Array<{ part_id: number; quantity: number }> = req.body?.items || [];
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'items[] required' });

    const partIds = items.map(i => Number(i.part_id)).filter(Boolean);
    const parts = await db('parts').whereIn('id', partIds);
    if (parts.length !== partIds.length) return res.status(400).json({ message: 'Some parts not found' });

    const vendorId = parts[0].vendor_id;
    const mixed = parts.some(p => p.vendor_id !== vendorId);
    if (mixed) return res.status(400).json({ message: 'All items must be from the same vendor' });

    let subTotal = 0;
    const itemsWithPrice = items.map(i => {
      const p = parts.find(pp => pp.id === i.part_id)!;
      const qty = Math.max(1, Number(i.quantity) || 1);
      subTotal += Number(p.price) * qty;
      return { part_id: p.id, quantity: qty, unit_price: p.price };
    });

    const courier_cost = Number(req.body?.courier_cost || 0);
    const installation_fee = Number(req.body?.installation_fee || 0);
    const ADMIN_FEE_RATE = 0.05; // 5% service charge; adjust as needed
    const admin_fee = +(subTotal * ADMIN_FEE_RATE).toFixed(2);
    const total = subTotal + courier_cost + installation_fee + admin_fee;

    const [order] = await db('part_orders')
      .insert({
        vendor_id: vendorId,
        mechanic_id: mech ? mech.id : null,
        driver_id: mech ? null : userId,
        status: 'pending',
        total_amount: total,
        courier_cost,
        installation_fee,
        admin_fee,
        delivery_address: req.body?.delivery_address,
        price_locked: true,
        locked_at: db.fn.now(),
      })
      .returning('*');
    const itemsRows = await db('part_order_items').insert(itemsWithPrice.map(i => ({ ...i, order_id: order.id }))).returning('*');

    // Wallet movements
    // Driver (or ordering user) debit
    const driverWallet = await getOrCreateWallet(userId);
    if (Number(driverWallet.balance) < total) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }
    const driverBalanceAfter = Number(driverWallet.balance) - total;
    await db('wallets').where({ id: driverWallet.id }).update({ balance: driverBalanceAfter, updated_at: db.fn.now() });
    await db('wallet_transactions').insert({
      wallet_id: driverWallet.id,
      type: 'debit',
      amount: total,
      balance_after: driverBalanceAfter,
      reference: `ORDER-${order.id}`,
      meta: JSON.stringify({ order_id: order.id, admin_fee, courier_cost, installation_fee, subTotal }),
    });

    // Vendor credit (locked for 24h) for subtotal only
    const vendor = await db('vendors').where({ id: vendorId }).first();
    const vendorUserId = vendor?.user_id;
    if (vendorUserId) {
      const vendorWallet = await getOrCreateWallet(vendorUserId);
      const vendorBalanceAfter = Number(vendorWallet.balance) + subTotal;
      const lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await db('wallets').where({ id: vendorWallet.id }).update({ balance: vendorBalanceAfter, updated_at: db.fn.now() });
      await db('wallet_transactions').insert({
        wallet_id: vendorWallet.id,
        type: 'credit',
        amount: subTotal,
        balance_after: vendorBalanceAfter,
        reference: `ORDER-${order.id}`,
        locked_until: lockedUntil,
        released: false,
        meta: JSON.stringify({ order_id: order.id, reason: 'order_subtotal_hold' }),
      });
    }

    return res.status(201).json({ success: true, data: { order, items: itemsRows, totals: { subTotal, courier_cost, installation_fee, admin_fee, total } } });
  } catch (e) {
    console.error('createPartOrder error', e);
    return res.status(500).json({ success: false, message: 'Could not create order' });
  }
};

export const listVendorOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const vendor = await db('vendors').where({ user_id: userId }).first();
    if (!vendor) return res.status(400).json({ message: 'Create vendor profile first' });

    const rows = await db('part_orders as o')
      .where('o.vendor_id', vendor.id)
      .select('o.*')
      .orderBy('o.id', 'desc')
      .limit(200);
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('listVendorOrders error', e);
    res.status(500).json({ success: false, message: 'Could not fetch orders' });
  }
};

export const listMechanicOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const mech = await db('mechanics').where({ user_id: userId }).first();
    if (!mech) return res.status(400).json({ message: 'Create mechanic profile first' });

    const rows = await db('part_orders as o')
      .where('o.mechanic_id', mech.id)
      .select('o.*')
      .orderBy('o.id', 'desc')
      .limit(200);
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('listMechanicOrders error', e);
    res.status(500).json({ success: false, message: 'Could not fetch orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const vendor = await db('vendors').where({ user_id: userId }).first();
    if (!vendor) return res.status(400).json({ message: 'Vendor only' });

    const orderId = Number(req.params.id);
    const status: OrderStatus = (req.body?.status || '').toLowerCase();
    if (!allowedStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await db('part_orders').where({ id: orderId, vendor_id: vendor.id }).first();
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await db('part_orders').where({ id: orderId }).update({ status, updated_at: db.fn.now() });
    const updated = await db('part_orders').where({ id: orderId }).first();
    res.json({ success: true, data: updated });
  } catch (e) {
    console.error('updateOrderStatus error', e);
    res.status(500).json({ success: false, message: 'Could not update status' });
  }
};
