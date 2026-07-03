import { checkFieldValueExist, performModelQuery } from "../utils/commonQuery.js";

export const getCategories = async (page) => {
  return await performModelQuery("AssetCategory", "read", {
    page,
    limit: 6,
    order: [["name", "ASC"]],
  });
};

export const createCategory = async (data, adminId) => {
  const errors = {};

  if (data.name) {
    const nameExists = await checkFieldValueExist(
      "AssetCategory",
      "name",
      data.name
    );

    if (nameExists) {
      errors.name = {
        msg: "Category name already exists.",
      };
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  await performModelQuery("AssetCategory", "create", {
    name: data.name,
    description: data.description,
    createdBy: adminId,
    updatedBy: adminId,
  });

  return {
    success: true,
  };
};

export const getCategoryById = async (id) => {
  const category = await performModelQuery("AssetCategory", "findOne", {
    where: {
      id,
    },
  });

  if (!category) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

export const updateCategory = async (id, data, adminId) => {
  const errors = {};

  if (data.name) {
    const nameExists = await checkFieldValueExist(
      "AssetCategory",
      "name",
      data.name,
      id
    );

    if (nameExists) {
      errors.name = {
        msg: "Category name already exists.",
      };
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  await performModelQuery("AssetCategory", "update", {
    where: {
      id,
    },
    update: {
      name: data.name,
      description: data.description,
      updatedBy: adminId,
    },
  });

  return {
    success: true,
  };
};