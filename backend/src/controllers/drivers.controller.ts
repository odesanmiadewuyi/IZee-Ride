import { Request, Response } from "express";
import db from "../config/knex-pg";

// Add new driver
export const addDriver = async (req: Request, res: Response) => {
  try {
    const { name, license_number, vehicle_type } = req.body;

    // Validate required fields and check for empty strings
    if (!name || !license_number || !vehicle_type ||
        name.trim() === '' || license_number.trim() === '' || vehicle_type.trim() === '') {
      return res.status(400).json({ message: "Name, license number, and vehicle type are required and cannot be empty" });
    }

    const driverData = {
      name: name.trim(),
      license_number: license_number.trim(),
      vehicle_type: vehicle_type.trim()
    };

    const [driver] = await db("drivers").insert(driverData).returning("*");
    res.json({ driver });
  } catch (err: any) {
    console.error(err);
    // Check for duplicate license_number error (PostgreSQL)
    if (err.code === '23505' || (err.message && err.message.includes('duplicate key value'))) {
      return res.status(409).json({ message: "License number already exists" });
    }
    // Check for SQLite constraint error (fallback)
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.message.includes('constraint failed')) {
      return res.status(409).json({ message: "License number already exists" });
    }
    res.status(500).json({ message: "Error adding driver" });
  }
};

// Get all drivers
export const getAllDrivers = async (_req: Request, res: Response) => {
  try {
    const drivers = await db("drivers").select("*");
    res.json(drivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching drivers" });
  }
};

// Get driver by ID
export const getDriverById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const driver = await db("drivers").where({ id }).first();
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching driver" });
  }
};

// Update driver by ID
export const updateDriver = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, license_number, vehicle_type } = req.body;

    // Validate required fields and check for empty strings
    if (!name || !license_number || !vehicle_type ||
        name.trim() === '' || license_number.trim() === '' || vehicle_type.trim() === '') {
      return res.status(400).json({ message: "Name, license number, and vehicle type are required and cannot be empty" });
    }

    const driverData = {
      name: name.trim(),
      license_number: license_number.trim(),
      vehicle_type: vehicle_type.trim()
    };

    const updatedCount = await db("drivers").where({ id }).update(driverData);
    if (updatedCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const updatedDriver = await db("drivers").where({ id }).first();
    res.json({ driver: updatedDriver });
  } catch (err: any) {
    console.error(err);
    // Check for duplicate license_number error (PostgreSQL)
    if (err.code === '23505' || (err.message && err.message.includes('duplicate key value'))) {
      return res.status(409).json({ message: "License number already exists" });
    }
    // Check for SQLite constraint error (fallback)
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.message.includes('constraint failed')) {
      return res.status(409).json({ message: "License number already exists" });
    }
    res.status(500).json({ message: "Error updating driver" });
  }
};

// Delete driver by ID
export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCount = await db("drivers").where({ id }).del();
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json({ message: "Driver deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting driver" });
  }
};
