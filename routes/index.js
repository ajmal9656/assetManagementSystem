import express from "express";
import authRoutes from "./authRoutes.js"
import employeeRoutes from "./employeeRoutes.js";
import assetCategoryRoutes from "./assetCategoryRoutes.js";
import assetRoutes from "./assetRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import stockRoutes from "./stockRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";



const router = express.Router();

router.use("/",authRoutes);
router.use("/dashboard",dashboardRoutes)
router.use("/employees", employeeRoutes);
router.use("/categories", assetCategoryRoutes);
router.use("/assets", assetRoutes);
router.use("/transactions", transactionRoutes);
router.use("/stock", stockRoutes);

export default router;