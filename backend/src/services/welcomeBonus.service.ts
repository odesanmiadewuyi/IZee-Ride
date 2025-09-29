import type { Knex } from 'knex';
import db from '../config/knex-pg';

export const WELCOME_BONUS_TOTAL = 5000;
export const WELCOME_BONUS_RATE = 0.1; // 10%

const BONUS_TABLE = 'welcome_bonuses';
const BONUS_USAGE_TABLE = 'welcome_bonus_applications';

type Tx = Knex.Transaction;

type NumericLike = number | string | null | undefined;

const toAmount = (value: NumericLike) => {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
};

const twoDp = (value: number) => Math.round(value * 100) / 100;

const executor = (trx?: Tx) => (trx ?? db);

export async function ensureWelcomeBonus(userId: number, trx?: Tx) {
  const knex = executor(trx);
  let bonus = await knex(BONUS_TABLE).where({ user_id: userId }).first();
  if (!bonus) {
    const [created] = await knex(BONUS_TABLE)
      .insert({ user_id: userId, initial_amount: WELCOME_BONUS_TOTAL, balance: WELCOME_BONUS_TOTAL })
      .returning('*');
    bonus = created;
  }
  return bonus;
}

export async function hasUsedWelcomeBonusToday(userId: number, trx?: Tx) {
  const knex = executor(trx);
  const row = await knex(BONUS_USAGE_TABLE)
    .where({ user_id: userId })
    .whereRaw('DATE(applied_at) = CURRENT_DATE')
    .first();
  return Boolean(row);
}

export async function lockWelcomeBonus(userId: number, trx: Tx) {
  const knex = executor(trx);
  let bonus = await knex(BONUS_TABLE).where({ user_id: userId }).forUpdate().first();
  if (!bonus) {
    const [created] = await knex(BONUS_TABLE)
      .insert({ user_id: userId, initial_amount: WELCOME_BONUS_TOTAL, balance: WELCOME_BONUS_TOTAL })
      .returning('*');
    bonus = created;
  }
  return bonus;
}

export async function evaluateWelcomeBonus(trx: Tx, userId: number, fare: NumericLike) {
  const bonus = await lockWelcomeBonus(userId, trx);
  const balance = toAmount(bonus?.balance);
  if (balance <= 0) {
    return { applied: 0, balance, alreadyUsedToday: false };
  }
  const alreadyUsedToday = await hasUsedWelcomeBonusToday(userId, trx);
  if (alreadyUsedToday) {
    return { applied: 0, balance, alreadyUsedToday: true };
  }

  const fareAmount = toAmount(fare);
  const potential = twoDp(fareAmount * WELCOME_BONUS_RATE);
  const applied = potential > 0 ? Math.min(twoDp(balance), potential) : 0;
  return {
    applied: twoDp(applied),
    balance,
    alreadyUsedToday: false,
  };
}

export async function recordWelcomeBonusUsage(trx: Tx, userId: number, rideId: number, amount: number) {
  const applied = twoDp(amount);
  if (applied <= 0) return;
  const knex = executor(trx);
  const current = await knex(BONUS_TABLE).where({ user_id: userId }).first();
  const remaining = twoDp(toAmount(current?.balance) - applied);
  await knex(BONUS_TABLE)
    .where({ user_id: userId })
    .update({
      balance: remaining,
      last_applied_on: knex.raw('CURRENT_DATE'),
      updated_at: knex.fn.now(),
    });
  await knex(BONUS_USAGE_TABLE)
    .insert({ user_id: userId, ride_id: rideId, amount: applied });
}

export async function getWelcomeBonusSummary(userId: number, trx?: Tx) {
  const knex = executor(trx);
  const bonus = await ensureWelcomeBonus(userId, trx);
  const latestUsage = await knex(BONUS_USAGE_TABLE)
    .where({ user_id: userId })
    .orderBy('id', 'desc')
    .first();
  return {
    initialAmount: toAmount(bonus?.initial_amount || WELCOME_BONUS_TOTAL),
    balance: toAmount(bonus?.balance),
    lastAppliedOn: bonus?.last_applied_on ?? null,
    lastAppliedAmount: latestUsage ? toAmount(latestUsage.amount) : 0,
  };
}
