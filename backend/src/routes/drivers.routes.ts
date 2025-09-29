// src/routes/drivers.routes.ts
import { Router } from "express";
import {
  addDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver
} from "../controllers/drivers.controller";

const router = Router();

// GET all drivers
router.get("/", getAllDrivers);

// POST a new driver
router.post("/", addDriver);

// GET a single driver by ID
router.get("/:id", getDriverById);

// PUT update a driver
router.put("/:id", updateDriver);

// DELETE a driver
router.delete("/:id", deleteDriver);

export default router;
