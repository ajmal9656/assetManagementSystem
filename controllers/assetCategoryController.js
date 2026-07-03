import { validationResult } from "express-validator";
import asyncHandler from "../middleware/asyncHandler.js";
import * as categoryService from "../services/assetCategoryService.js";

export const getCategories = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const categories = await categoryService.getCategories(page);

  res.render("categories/index", {
    title: "Asset Categories",
    categories: categories.result,
    pagination: {
      currentPage: categories.current_page,
      totalPages: categories.total_pages,
      limit: 6,
    },
  });
});

export const showCreateCategory = asyncHandler(async (req, res) => {
  res.render("categories/create", {
    title: "Add Asset Category",
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const validationErrors = validationResult(req);

  let errors = {};

  if (!validationErrors.isEmpty()) {
    errors = validationErrors.mapped();
  }

  const result = await categoryService.createCategory(
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
    return res.status(400).render("categories/create", {
      title: "Add Asset Category",
      errors,
      old: req.body,
    });
  }

  res.redirect("/categories");
});

export const showEditCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  res.render("categories/edit", {
    title: "Edit Asset Category",
    category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const validationErrors = validationResult(req);

  let errors = {};

  if (!validationErrors.isEmpty()) {
    errors = validationErrors.mapped();
  }

  const result = await categoryService.updateCategory(
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
    return res.status(400).render("categories/edit", {
      title: "Edit Asset Category",
      category: {
        id: req.params.id,
        ...req.body,
      },
      errors,
      old: req.body,
    });
  }

  return res.redirect("/categories");
});
