// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middleware/errorHandler"; // ? Correct

import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import vehiclesRoutes from "./routes/vehicles.routes";
import driversRoutes from "./routes/drivers.routes";
import ridesRoutes from "./routes/rides.routes";
import paymentsRoutes from "./routes/payments.routes";
import walletsRoutes from "./routes/wallets.routes";
import cardsRoutes from "./routes/cards.routes";
import rewardsRoutes from "./routes/rewards.routes";
import supportRoutes from "./routes/support.routes";
import documentsRoutes from "./routes/documents.routes";
import communityRoutes from "./routes/community.routes";
import mechanicsRoutes from "./routes/mechanics.routes";
import vendorsRoutes from "./routes/vendors.routes";
import partsRoutes from "./routes/parts.routes";
import partOrdersRoutes from "./routes/part-orders.routes";
import servicesRoutes from "./routes/services.routes";
import vendorOffersRoutes from "./routes/vendor-offers.routes";
import causesRoutes from "./routes/causes.routes";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, usersRoutes);
app.use("/api/vehicles", vehiclesRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/rides", authMiddleware, ridesRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/wallets", walletsRoutes);
app.use("/api/cards", cardsRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/mechanics", mechanicsRoutes);
app.use("/api/vendors", vendorsRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/part-orders", partOrdersRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/vendor-offers", vendorOffersRoutes);
app.use("/api/causes", causesRoutes);

app.use(errorHandler);

export default app;
