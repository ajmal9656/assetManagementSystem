import asyncHandler from "../middleware/asyncHandler.js";
import * as assetService from "../services/assetService.js";
import {
  ASSET_STATUS,
  BRANCHES,
  RETURN_REASONS,
} from "../constants/constant.js";
import { validationResult } from "express-validator";

export const getAssets = asyncHandler(async (req, res) => {
  const { page = 1, search = "", status = "", categoryId = "" } = req.query;

  const data = await assetService.getAssets({
    page,
    search,
    status,
    categoryId,
  });

  res.render("assets/index", {
    title: "Asset Management",
    assets: data.assets,
    categories: data.categories,
    assetStatuses: ASSET_STATUS,
    pagination: data.pagination,
    search,
    status,
    categoryId,
  });
});

export const showCreateAsset = asyncHandler(async (req, res) => {
  const categories = await assetService.getCategories();
  const today = new Date().toISOString().split("T")[0];

  res.render("assets/create", {
    title: "Add Asset",
    categories,
    branches: BRANCHES,
    today,
  });
});

export const createAsset = asyncHandler(async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const categories = await assetService.getCategories();

    return res.status(400).render("assets/create", {
      title: "Add Asset",
      categories,
      branches: BRANCHES,
      errors: validationErrors.mapped(),
      old: req.body,
    });
  }

  const result = await assetService.createAsset(req.body, req.session.admin.id);

  if (!result.success) {
    const categories = await assetService.getCategories();

    return res.status(400).render("assets/create", {
      title: "Add Asset",
      categories,
      branches: BRANCHES,
      today: new Date().toISOString().split("T")[0],
      errors: result.errors,
      old: req.body,
    });
  }

  res.redirect("/assets");
});

export const showEditAsset = asyncHandler(async (req, res) => {
  const asset = await assetService.getAssetById(req.params.id);
  const categories = await assetService.getCategories();

  res.render("assets/edit", {
    title: "Edit Asset",
    asset,
    categories,
    branches: BRANCHES,
    today: new Date().toISOString().split("T")[0],
  });
});

export const updateAsset = asyncHandler(async (req, res) => {
  const validationErrors = validationResult(req);

  let errors = {};

  if (!validationErrors.isEmpty()) {
    errors = validationErrors.mapped();
  }

  const result = await assetService.updateAsset(
    req.params.id,
    req.body,
    req.session.admin.id,
  );

  if (!result.success) {
    errors = {
      ...errors,
      ...result.errors,
    };
  }

  if (Object.keys(errors).length > 0) {
    const categories = await assetService.getCategories();

    return res.status(400).render("assets/edit", {
      title: "Edit Asset",
      asset: {
        id: req.params.id,
        ...req.body,
      },
      categories,
      branches: BRANCHES,
      today: new Date().toISOString().split("T")[0],
      errors,
      old: req.body,
    });
  }

  res.redirect("/assets");
});

export const showIssueAsset = asyncHandler(async (req, res) => {
  const asset = await assetService.getAssetById(req.params.id);
  const employees = await assetService.getActiveEmployees();

  res.render("assets/issue", {
    title: "Issue Asset",
    asset,
    employees,
    today: new Date().toLocaleDateString("en-GB"),
  });
});

export const issueAsset = asyncHandler(async (req, res) => {
  const asset = await assetService.getAssetById(req.params.id);

  if (asset.status !== "IN_STOCK") {
    const employees = await assetService.getActiveEmployees();

    return res.status(400).render("assets/issue", {
      title: "Issue Asset",
      asset,
      employees,
      today: new Date().toLocaleDateString("en-GB"),
      error: "Only assets that are in stock can be issued.",
      old: req.body,
    });
  }

  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const employees = await assetService.getActiveEmployees();

    return res.status(400).render("assets/issue", {
      title: "Issue Asset",
      asset,
      employees,
      today: new Date().toLocaleDateString("en-GB"),
      errors: validationErrors.mapped(),
      old: req.body,
    });
  }

  try {
    await assetService.issueAsset(
      req.params.id,
      req.body,
      req.session.admin.id,
    );

    return res.redirect("/assets");
  } catch (error) {
    const employees = await assetService.getActiveEmployees();

    return res.status(error.statusCode || 400).render("assets/issue", {
      title: "Issue Asset",
      asset,
      employees,
      old: req.body,
      error: error.message,
    });
  }
});

export const showReturnAsset = asyncHandler(async (req, res) => {
  const data = await assetService.getReturnAssetDetails(req.params.id);

  res.render("assets/return", {
    title: "Return Asset",
    asset: data.asset,
    employee: data.employee,
    returnReasons: RETURN_REASONS,
    today: new Date().toISOString().split("T")[0],
  });
});

export const returnAsset = asyncHandler(async (req, res) => {
  const validationErrors = validationResult(req);

  const employeeId = req.body.employeeId;
  const data = await assetService.getReturnAssetDetails(req.params.id);

  if (!validationErrors.isEmpty()) {
    return res.status(400).render("assets/return", {
      title: "Return Asset",
      asset: data.asset,
      employee: data.employee,
      returnReasons: RETURN_REASONS,
      today: new Date().toISOString().split("T")[0],
      errors: validationErrors.mapped(),
      old: req.body,
    });
  }

  try {
    await assetService.returnAsset(
      req.params.id,
      req.body,
      req.session.admin.id,
    );

    res.redirect("/assets");
  } catch (error) {
    return res.status(error.statusCode || 400).render("assets/return", {
      title: "Return Asset",
      asset: data.asset,
      employee: data.employee,
      returnReasons: RETURN_REASONS,
      today: new Date().toISOString().split("T")[0],
      old: req.body,
      error: error.message,
    });
  }
});

export const updateAssetStatus = asyncHandler(async (req, res) => {
  await assetService.updateAssetStatus(
    req.params.id,
    req.body.action,
    req.body.remarks,
    req.session.admin.id,
  );

  res.redirect("/assets");
});

export const showAssetHistory = asyncHandler(async (req, res) => {
  const assets = await assetService.getAssetsForHistory();

  res.render("assets/history", {
    title: "Asset History",
    assets: assets.result,
    history: [],
    selectedAsset: null,
  });
});

export const getAssetHistory = asyncHandler(async (req, res) => {
  const assets = await assetService.getAssetsForHistory();

  const history = await assetService.getAssetHistory(req.params.id);

  res.render("assets/history", {
    title: "Asset History",
    assets: assets.result,
    history: history.result,
    selectedAsset: req.params.id,
  });
});
