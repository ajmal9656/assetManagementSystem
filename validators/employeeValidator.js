import { body } from "express-validator";

export const createEmployeeValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required."),

  body("lastName").trim().notEmpty().withMessage("Last name is required."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email."),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must contain 10 digits.")
    .isNumeric()
    .withMessage("Phone number must contain only digits."),

  body("designation").trim().notEmpty().withMessage("Designation is required."),

  body("branch").trim().notEmpty().withMessage("Branch is required."),
];

export const updateEmployeeValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required."),

  body("lastName").trim().notEmpty().withMessage("Last name is required."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email."),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must contain 10 digits.")
    .isNumeric()
    .withMessage("Phone number must contain only digits."),

  body("designation").trim().notEmpty().withMessage("Designation is required."),

  body("branch").trim().notEmpty().withMessage("Branch is required."),
];
