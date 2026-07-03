import express from "express";
import * as assetController from "../controllers/assetController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  assetValidator,
  issueAssetValidator,
  returnAssetValidator,
} from "../validators/assetvalidator.js";

const router = express.Router();

router.get("/", isAuthenticated, assetController.getAssets);

router.get("/create", isAuthenticated, assetController.showCreateAsset);

router.post(
  "/create",
  isAuthenticated,
  assetValidator,
  assetController.createAsset,
);

router.get("/edit/:id", isAuthenticated, assetController.showEditAsset);

router.post(
  "/edit/:id",
  isAuthenticated,
  assetValidator,
  assetController.updateAsset,
);

router.get("/issue/:id", isAuthenticated, assetController.showIssueAsset);

router.post(
  "/issue/:id",
  isAuthenticated,
  issueAssetValidator,
  assetController.issueAsset,
);

router.get("/return/:id", isAuthenticated, assetController.showReturnAsset);

router.post(
  "/return/:id",
  isAuthenticated,
  returnAssetValidator,
  assetController.returnAsset,
);

router.post(
  "/scrapOrRepairOrStock/:id",
  isAuthenticated,
  assetController.updateAssetStatus,
);

router.get("/history", isAuthenticated, assetController.showAssetHistory);

router.get("/history/:id", isAuthenticated, assetController.getAssetHistory);
export default router;
