import { Request, Response } from "express";
import db from "../config/knex-pg";
import { getWelcomeBonusSummary } from "../services/welcomeBonus.service";

async function getOrCreateWallet(userId: number) {
  let wallet = await db("wallets").where({ user_id: userId }).first();
  if (!wallet) {
    const [created] = await db("wallets").insert({ user_id: userId, balance: 0 }).returning("*");
    wallet = created;
  }
  return wallet;
}

const resolveUserId = (req: Request) => {
  const authUser = (req as any).user;
  const value = authUser?.id ?? authUser?.sub;
  if (value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const getMyWallet = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    if (userId === undefined) return res.status(401).json({ success: false, message: "Unauthorized" });
    const wallet = await getOrCreateWallet(userId);
    const welcomeBonus = await getWelcomeBonusSummary(userId);
    res.json({ success: true, data: { ...wallet, welcomeBonus } });
  } catch (err) {
    console.error("getMyWallet error", err);
    res.status(500).json({ success: false, message: "Could not fetch wallet" });
  }
};

export const topUpWallet = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    if (userId === undefined) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { amount, source = "card", reference } = req.body as { amount: number; source?: string; reference?: string };
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });

    const wallet = await getOrCreateWallet(userId);
    const newBalance = Number(wallet.balance) + Number(amount);
    await db("wallets").where({ id: wallet.id }).update({ balance: newBalance, updated_at: db.fn.now() });
    await db("wallet_transactions").insert({
      wallet_id: wallet.id,
      type: "topup",
      amount,
      balance_after: newBalance,
      reference,
      meta: { source },
    });
    res.status(201).json({ success: true, data: { balance: newBalance } });
  } catch (err) {
    console.error("topUpWallet error", err);
    res.status(500).json({ success: false, message: "Top up failed" });
  }
};

export const withdrawFromWallet = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    if (userId === undefined) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { amount, reference } = req.body as { amount: number; reference?: string };
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });

    const wallet = await getOrCreateWallet(userId);
    try {
      const balance = await internalDebitWallet(wallet.id, Number(amount), "debit", reference, { source: "withdrawal" });
      res.status(201).json({ success: true, data: { balance } });
    } catch (err: any) {
      if (typeof err?.message === "string" && err.message.includes("Insufficient")) {
        return res.status(400).json({ success: false, message: err.message });
      }
      throw err;
    }
  } catch (err) {
    console.error("withdrawFromWallet error", err);
    res.status(500).json({ success: false, message: "Withdrawal failed" });
  }
};

export const getWalletTransactions = async (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    if (userId === undefined) return res.status(401).json({ success: false, message: "Unauthorized" });
    const wallet = await getOrCreateWallet(userId);
    const rows = await db("wallet_transactions").where({ wallet_id: wallet.id }).orderBy("id", "desc");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getWalletTransactions error", err);
    res.status(500).json({ success: false, message: "Could not fetch transactions" });
  }
};

export const internalDebitWallet = async (walletId: number, amount: number, type: "debit" | "service_charge" | "commission", reference?: string, meta?: any) => {
  const wallet = await db("wallets").where({ id: walletId }).first();
  if (!wallet) throw new Error("Wallet not found");
  const current = Number(wallet.balance);
  if (current < amount) throw new Error("Insufficient wallet balance");
  const newBalance = current - Number(amount);
  await db("wallets").where({ id: wallet.id }).update({ balance: newBalance, updated_at: db.fn.now() });
  await db("wallet_transactions").insert({ wallet_id: wallet.id, type, amount, balance_after: newBalance, reference, meta });
  return newBalance;
};
