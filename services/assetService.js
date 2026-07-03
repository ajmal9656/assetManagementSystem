import { Op } from "sequelize";
import {
  checkFieldValueExist,
  performModelQuery,
} from "../utils/commonQuery.js";

export const getAssets = async ({ page, search, status, categoryId }) => {
  const where = {};

  if (search) {
    where[Op.or] = [
      {
        make: {
          [Op.iLike]: `%${search}%`,
        },
      },
      {
        model: {
          [Op.iLike]: `%${search}%`,
        },
      },
      {
        serialNumber: {
          [Op.iLike]: `%${search}%`,
        },
      },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const assets = await performModelQuery("Asset", "read", {
    where,
    page: Number(page),
    limit: 10,
    include: [
      {
        model: "AssetCategory",
        as: "category",
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const categories = await performModelQuery("AssetCategory", "readAll", {
    order: [["name", "ASC"]],
  });

  return {
    assets: assets.result,
    categories: categories.result,
    pagination: {
      currentPage: assets.current_page,
      totalPages: assets.total_pages,
      totalCount: assets.total_count,
    },
  };
};

export const getCategories = async () => {
  const categories = await performModelQuery("AssetCategory", "readAll", {
    order: [["name", "ASC"]],
  });

  return categories.result;
};

export const createAsset = async (data, adminId) => {
  const errors = {};

  if (data.serialNumber) {
    const serialExists = await checkFieldValueExist(
      "Asset",
      "serialNumber",
      data.serialNumber,
    );

    if (serialExists) {
      errors.serialNumber = {
        msg: "Serial number already exists.",
      };
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  const lastAsset = await performModelQuery("Asset", "findOne", {
    order: [["id", "DESC"]],
  });

  let assetCode = "AST001";

  if (lastAsset) {
    const number = Number(lastAsset.assetCode.replace("AST", ""));

    assetCode = `AST${String(number + 1).padStart(3, "0")}`;
  }

  await performModelQuery("Asset", "create", {
    assetCode,
    categoryId: data.categoryId,
    serialNumber: data.serialNumber,
    make: data.make,
    model: data.model,
    purchaseDate: data.purchaseDate,
    purchasePrice: data.purchasePrice,
    branch: data.branch,
    createdBy: adminId,
    updatedBy: adminId,
  });

  return {
    success: true,
  };
};

export const getAssetById = async (id) => {
  const asset = await performModelQuery("Asset", "findOne", {
    where: {
      id,
    },
  });

  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  return asset;
};

export const updateAsset = async (id, data, adminId) => {
  const errors = {};

  if (data.serialNumber) {
    const serialExists = await checkFieldValueExist(
      "Asset",
      "serialNumber",
      data.serialNumber,
      id,
    );

    if (serialExists) {
      errors.serialNumber = {
        msg: "Serial number already exists.",
      };
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  await performModelQuery("Asset", "update", {
    where: {
      id,
    },
    update: {
      categoryId: data.categoryId,
      serialNumber: data.serialNumber,
      make: data.make,
      model: data.model,
      purchaseDate: data.purchaseDate,
      purchasePrice: data.purchasePrice,
      branch: data.branch,
      updatedBy: adminId,
    },
  });

  return {
    success: true,
  };
};
