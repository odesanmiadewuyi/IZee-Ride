import { Request, Response } from "express";
import db from "../config/knex-pg";
import { hashPassword, comparePassword } from "../utils/crypto";
import { generateToken } from "../utils/jwt";
import { validateUserRegistration, validateUserLogin } from "../utils/validation";
import { ensureWelcomeBonus, getWelcomeBonusSummary } from "../services/welcomeBonus.service";

const formatBonus = (bonus: any) => ({
  initialAmount: Number(bonus?.initial_amount ?? bonus?.initialAmount ?? 0),
  balance: Number(bonus?.balance ?? 0),
  lastAppliedOn: bonus?.last_applied_on ?? bonus?.lastAppliedOn ?? null,
});

export const register = async (req: Request, res: Response) => {
  const { error } = validateUserRegistration(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const hashedPassword = await hashPassword(req.body.password);
    const result = await db.transaction(async (trx) => {
      const payload = { ...req.body, password: hashedPassword };
      const [user] = await trx("users").insert(payload).returning("*");
      await trx("wallets")
        .insert({ user_id: user.id, balance: 0 })
        .onConflict("user_id")
        .ignore();
      const bonus = await ensureWelcomeBonus(user.id, trx);
      return { user, bonus };
    });

    const token = generateToken({ id: result.user.id, email: result.user.email, role: result.user.role || 'user' });
    res.json({ user: result.user, token, welcomeBonus: formatBonus(result.bonus) });
  } catch (err: any) {
    console.error(err);
    if (err.message && err.message.includes('UNIQUE constraint failed: users.email')) {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.message?.includes('constraint failed')) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const [user] = await db("users").where({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await comparePassword(req.body.password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = generateToken({ id: user.id, email: user.email, role: user.role || 'user' });
  const welcomeBonus = await getWelcomeBonusSummary(user.id);
  res.json({ user, token, welcomeBonus });
};

// Get current authenticated user's profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user profile", error: err });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const { oldPassword, newPassword } = req.body as any;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'oldPassword and newPassword are required' });
    const user = await db('users').where({ id: userId }).first();
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ok = await comparePassword(oldPassword, user.password);
    if (!ok) return res.status(400).json({ message: 'Old password incorrect' });
    const hashed = await hashPassword(newPassword);
    await db('users').where({ id: userId }).update({ password: hashed, updated_at: db.fn.now() });
    res.json({ success: true });
  } catch (e) {
    console.error('changePassword error', e);
    res.status(500).json({ message: 'Failed to change password' });
  }
};
