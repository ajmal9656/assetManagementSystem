import { body } from "express-validator";

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email."),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];