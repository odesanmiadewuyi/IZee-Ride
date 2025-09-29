import { Request, Response } from "express";
import db from "../config/knex-pg";

// Add new vehicle
export const addVehicle = async (req: Request, res: Response) => {
  try {
    const { model, plate_number, driver_id } = req.body;

    // Validate required fields and check for empty strings
    if (!model || !plate_number || model.trim() === '' || plate_number.trim() === '') {
      return res.status(400).json({ message: "Model and plate number are required and cannot be empty" });
    }

    const vehicleData: any = { model: model.trim(), plate_number: plate_number.trim() };
    if (driver_id !== undefined && driver_id !== null) {
      vehicleData.driver_id = driver_id;
    }
    const [vehicle] = await db("vehicles").insert(vehicleData).returning("*");
    res.json({ vehicle });
  } catch (err: any) {
    console.error(err);
    // Check for duplicate plate_number error (PostgreSQL)
    if (err.code === '23505' || (err.message && err.message.includes('duplicate key value'))) {
      return res.status(409).json({ message: "Plate number already exists" });
    }
    // Check for SQLite constraint error (fallback)
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.message.includes('constraint failed')) {
      return res.status(409).json({ message: "Plate number already exists" });
    }
    res.status(500).json({ message: "Error adding vehicle" });
  }
};

// Get all vehicles
export const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await db("vehicles").select("*");
    // Fix JSON formatting by returning array directly
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching vehicles" });
  }
};

// Get vehicle by ID
export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await db("vehicles").where({ id }).first();
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    // Fix JSON formatting by returning object directly
    res.json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching vehicle" });
  }
};

// Delete vehicle by ID
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCount = await db("vehicles").where({ id }).del();
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting vehicle" });
  }
};
