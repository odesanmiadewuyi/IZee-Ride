import db from "../config/knex-pg"; // your Knex instance
import { Request, Response } from "express";

/**
 * Set a user as online
 * @param userId - ID of the user
 */
export const setOnline = async (userId: number) => {
  try {
    const [user] = await db("users")
      .where({ id: userId })
      .update({ online: true })
      .returning("*"); // Return updated user
    return user;
  } catch (err) {
    console.error("Error setting user online:", err);
    throw err;
  }
};

/**
 * Set a user as offline
 * @param userId - ID of the user
 */
export const setOffline = async (userId: number) => {
  try {
    const [user] = await db("users")
      .where({ id: userId })
      .update({ online: false })
      .returning("*");
    return user;
  } catch (err) {
    console.error("Error setting user offline:", err);
    throw err;
  }
};



// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db("users").select("*");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users", error: err });
  }
};

// Optional: you can also export other functions
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user", error: err });
  }
};

// Get current authenticated user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // req.user is set by authMiddleware
    const user = (req as any).user;
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch current user", error: err });
  }
};

  
