// src/routes/vehicles.routes.ts
import { Router } from "express";
import { addVehicle, getAllVehicles, getVehicleById, deleteVehicle } from "../controllers/vehicles.controller";

const router = Router();

// GET all vehicles
router.get("/", getAllVehicles);

// POST a new vehicle
router.post("/", addVehicle);

// GET a single vehicle by ID
router.get("/:id", getVehicleById);

// DELETE a vehicle
router.delete("/:id", deleteVehicle);

export default router;
