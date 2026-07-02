import express from "express";
import * as employeeController from "../controllers/employeeController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  createEmployeeValidator,
  updateEmployeeValidator,
} from "../validators/employeeValidator.js";
import validateRequest from "../utils/validateRequest.js";

const router = express.Router();

router.get("/", isAuthenticated, employeeController.getEmployees);

router.get("/create", isAuthenticated, employeeController.showCreateEmployee);

router.post(
  "/create",
  isAuthenticated,
  createEmployeeValidator,
  employeeController.createEmployee,
);

router.get("/edit/:id", isAuthenticated, employeeController.showEditEmployee);

router.post(
  "/edit/:id",
  isAuthenticated,
  updateEmployeeValidator,
  employeeController.updateEmployee,
);

export default router;
