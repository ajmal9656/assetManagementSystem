import express from "express";
import * as authController from "../controllers/authController.js";
import { isAuthenticated, redirectIfAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

export default router;