import express from "express";
import * as stockController from "../controllers/stockController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, stockController.showStockView);
export default router;
