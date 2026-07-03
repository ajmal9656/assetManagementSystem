import asyncHandler from "../middleware/asyncHandler.js";
import * as assetService from "../services/assetService.js";
import { ASSET_STATUS, BRANCHES } from "../constants/constant.js";
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
