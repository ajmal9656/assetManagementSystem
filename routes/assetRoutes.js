import express from "express";
import * as assetController from "../controllers/assetController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { assetValidator } from "../validators/assetvalidator.js";

const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  assetController.getAssets
);

router.get(
  "/create",
  isAuthenticated,
  assetController.showCreateAsset
);

router.post(
  "/create",
  isAuthenticated,
  assetValidator,
  assetController.createAsset
);

router.get(
  "/edit/:id",
  isAuthenticated,
  assetController.showEditAsset
);

router.post(
  "/edit/:id",
  isAuthenticated,
  assetValidator,
  assetController.updateAsset
);
export default router;