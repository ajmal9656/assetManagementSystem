import express from "express";
import authRoutes from "./authRoutes.js"
import employeeRoutes from "./employeeRoutes.js";
import assetCategoryRoutes from "./assetCategoryRoutes.js";
import assetRoutes from "./assetRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import stockRoutes from "./stockRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/categories", assetCategoryRoutes);
router.use("/assets", assetRoutes);
router.use("/transactions", transactionRoutes);
router.use("/stock", stockRoutes);

export default router;