import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import * as dashboardController from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", isAuthenticated, dashboardController.dashboard);

export default router;