import { body } from "express-validator";

export const assetValidator = [
  body("categoryId")
    .notEmpty()
    .withMessage("Category is required."),

  body("serialNumber")
  .trim()
  .notEmpty()
  .withMessage("Serial number is required.")
  .matches(/^[A-Z]{2}\d{3}[A-Z]{2}$/)
  .withMessage(
    "Serial number must be in the format AB123XY."
  ),

  body("make")
    .trim()
    .notEmpty()
    .withMessage("Make is required."),

  body("model")
    .trim()
    .notEmpty()
    .withMessage("Model is required."),

  body("purchaseDate")
    .notEmpty()
    .withMessage("Purchase date is required."),

  body("purchasePrice")
    .notEmpty()
    .withMessage("Purchase price is required.")
    .isFloat({ min: 0 })
    .withMessage("Purchase price must be a valid amount."),

  body("branch")
    .notEmpty()
    .withMessage("Branch is required."),
];