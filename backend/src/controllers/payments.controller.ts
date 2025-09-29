import { Request, Response } from "express";
import db from "../config/knex-pg";
import { internalDebitWallet } from "./wallets.controller";

// Get all payments
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await db("payments").select("*");
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ success: false, message: "Could not fetch payments" });
  }
};

// Get a single payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await db("payments").where({ id }).first();
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ success: false, message: "Could not fetch payment" });
  }
};

// Create a new payment
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { ride_id, user_id, amount } = req.body;

    const [payment] = await db("payments")
      .insert({ ride_id, user_id, amount, status: "completed" })
      .returning("*");

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ success: false, message: "Payment could not be created" });
  }
};

// Update a payment
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ride_id, user_id, amount, status } = req.body;
    const [payment] = await db("payments")
      .where({ id })
      .update({ ride_id, user_id, amount, status, updated_at: db.fn.now() })
      .returning("*");
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ success: false, message: "Payment could not be updated" });
  }
};

// Delete a payment
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db("payments").where({ id }).del();
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ success: false, message: "Payment could not be deleted" });
  }
};

// Pay service charge to rider
export const payServiceCharge = async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.id;
    if (!authUserId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { rideId, amount, method = 'wallet', reference } = req.body as any;
    if (!rideId || !amount || amount <= 0) return res.status(400).json({ success: false, message: "Invalid payload" });

    const ride = await db('rides').where({ id: rideId }).first();
    if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });

    if (method === 'wallet') {
      const wallet = await db('wallets').where({ user_id: authUserId }).first();
      if (!wallet) return res.status(400).json({ success: false, message: 'Wallet not found' });
      await internalDebitWallet(wallet.id, Number(amount), 'service_charge', reference, { rideId });
    }
    const [payment] = await db('payments')
      .insert({ ride_id: rideId, user_id: authUserId, amount, status: 'completed', method, recipient: 'rider', reference, type: 'service_charge' })
      .returning('*');

    res.status(201).json({ success: true, data: payment });
  } catch (e) {
    console.error('payServiceCharge error', e);
    const message = (e as Error)?.message?.includes('Insufficient') ? (e as Error).message : 'Service charge payment failed';
    res.status(500).json({ success: false, message });
  }
};

// Pay commission to platform
export const payCommission = async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.id;
    if (!authUserId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { rideId, amount, method = 'wallet', reference } = req.body as any;
    if (!rideId || amount === undefined || amount < 0) return res.status(400).json({ success: false, message: 'Invalid payload' });

    const ride = await db('rides').where({ id: rideId }).first();
    if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });

    if (method === 'wallet' && amount > 0) {
      const wallet = await db('wallets').where({ user_id: authUserId }).first();
      if (!wallet) return res.status(400).json({ success: false, message: 'Wallet not found' });
      await internalDebitWallet(wallet.id, Number(amount), 'commission', reference, { rideId });
    }
    const [payment] = await db('payments')
      .insert({ ride_id: rideId, user_id: authUserId, amount, status: 'completed', method, recipient: 'platform', reference, type: 'commission' })
      .returning('*');
    res.status(201).json({ success: true, data: payment });
  } catch (e) {
    console.error('payCommission error', e);
    const message = (e as Error)?.message?.includes('Insufficient') ? (e as Error).message : 'Commission payment failed';
    res.status(500).json({ success: false, message });
  }
};
