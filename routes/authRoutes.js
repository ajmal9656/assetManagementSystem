import express from "express";
import * as authController from "../controllers/authController.js";
import {
  isAuthenticated,
  redirectIfAuthenticated,
} from "../middleware/authMiddleware.js";
import { loginValidator } from "../validators/authValidator.js";
import validateRequest from "../utils/validateRequest.js";

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.admin) {
    return res.redirect("/dashboard");
  }

  return res.redirect("/login");
});

router.get(
  "/login",
  redirectIfAuthenticated,
  authController.showLogin
);

router.post(
  "/login",
  redirectIfAuthenticated,
  loginValidator,
  validateRequest("login"),
  authController.login
);

router.get(
  "/logout",
  isAuthenticated,
  authController.logout
);

export default router;