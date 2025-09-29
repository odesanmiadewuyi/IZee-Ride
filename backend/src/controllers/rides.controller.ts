import { Request, Response } from "express";
import db from "../config/knex-pg";
import { evaluateWelcomeBonus, recordWelcomeBonusUsage } from "../services/welcomeBonus.service";

const toNumber = (value: any) => {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
};

const toTwoDp = (value: number) => Math.round(value * 100) / 100;

const toNullableInt = (value: any) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

// Get all rides for the authenticated user
export const getRides = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const rides = await db("rides").where({ user_id: userId });
    res.json({ rides });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching rides" });
  }
};

// Get ride by ID
export const getRideById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ride = await db("rides").where({ id }).first();

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.json({ ride });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ride" });
  }
};

// Request a ride with welcome bonus consideration
export const requestRide = async (req: Request, res: Response) => {
  try {
    const { driver_id, pickup_location, dropoff_location, fare } = req.body;
    const userIdRaw = req.user?.id;

    if (!userIdRaw) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = Number(userIdRaw);
    const numericFare = toTwoDp(toNumber(fare));
    const driverId = toNullableInt(driver_id);

    const { ride, bonus } = await db.transaction(async (trx) => {
      const bonusEvaluation = await evaluateWelcomeBonus(trx, userId, numericFare);
      const applied = toTwoDp(bonusEvaluation.applied);
      const fareAfterBonus = toTwoDp(Math.max(0, numericFare - applied));
      const [createdRide] = await trx("rides")
        .insert({
          user_id: userId,
          driver_id: driverId,
          pickup_location,
          dropoff_location,
          fare: numericFare,
          welcome_bonus_applied: applied,
          fare_after_bonus: fareAfterBonus,
        })
        .returning("*");

      if (applied > 0) {
        await recordWelcomeBonusUsage(trx, userId, createdRide.id, applied);
      }

      const remaining = bonusEvaluation.alreadyUsedToday
        ? toTwoDp(bonusEvaluation.balance)
        : toTwoDp(Math.max(0, bonusEvaluation.balance - applied));

      return {
        ride: createdRide,
        bonus: {
          applied,
          remaining,
          alreadyUsedToday: bonusEvaluation.alreadyUsedToday,
        },
      };
    });

    res.json({ ride, bonus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating ride" });
  }
};

// Update ride status
export const updateRideStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [ride] = await db("rides")
      .where({ id })
      .update({ status })
      .returning("*");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.json({ ride });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating ride" });
  }
};
