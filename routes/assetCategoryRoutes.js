import express from "express";
import * as categoryController from "../controllers/assetCategoryController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { categoryValidator } from "../validators/assetCategoryValidator.js";

const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  categoryController.getCategories
);

router.get(
  "/create",
  isAuthenticated,
  categoryController.showCreateCategory
);

router.post(
  "/create",
  isAuthenticated,
  categoryValidator,
  categoryController.createCategory
);

router.get(
  "/edit/:id",
  isAuthenticated,
  categoryController.showEditCategory
);

router.post(
  "/edit/:id",
  isAuthenticated,
  categoryValidator,
  categoryController.updateCategory
);


export default router;