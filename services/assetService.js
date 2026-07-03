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

export const getActiveEmployees = async () => {
  const employees = await performModelQuery("Employee", "readAll", {
    where: {
      status: "ACTIVE",
    },
    order: [["firstName", "ASC"]],
  });

  return employees.result;
};

export const issueAsset = async (assetId, data, adminId) => {
  const asset = await performModelQuery("Asset", "findOne", {
    where: {
      id: assetId,
    },
  });

  if (!asset) {
    const error = new Error("Asset not found.");
    error.statusCode = 404;
    throw error;
  }

  if (asset.status !== "IN_STOCK") {
    const error = new Error("Asset is not available for issue.");
    error.statusCode = 400;
    throw error;
  }

  const employee = await performModelQuery("Employee", "findOne", {
    where: {
      id: data.employeeId,
      status: "ACTIVE",
    },
  });

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  await performModelQuery("AssetTransaction", "create", {
    action: "ISSUE",
    assetId,
    employeeId: data.employeeId,
    remarks: data.remarks,
    createdBy: adminId,
    updatedBy: adminId,
  });

  await performModelQuery("Asset", "update", {
    where: {
      id: assetId,
    },
    update: {
      status: "ISSUED",
      updatedBy: adminId,
    },
  });
};

export const getReturnAssetDetails = async (assetId) => {
  const asset = await getAssetById(assetId);

  if (asset.status !== "ISSUED") {
    const error = new Error("Asset is not currently issued.");
    error.statusCode = 400;
    throw error;
  }

  const transaction = await performModelQuery("AssetTransaction", "findOne", {
    where: {
      assetId,
      action: "ISSUE",
    },
    order: [["transactionDate", "DESC"]],
    include: [
      {
        model: "Employee",
        as: "employee",
      },
    ],
  });

  if (!transaction) {
    const error = new Error("Issue transaction not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    asset,
    employee: transaction.employee,
  };
};

export const returnAsset = async (assetId, data, adminId) => {
  const asset = await getAssetById(assetId);

  if (asset.status !== "ISSUED") {
    const error = new Error("Asset is not currently issued.");
    error.statusCode = 400;
    throw error;
  }

  const transaction = await performModelQuery("AssetTransaction", "findOne", {
    where: {
      assetId,
      employeeId: data.employeeId,
      action: "ISSUE",
    },
    order: [["transactionDate", "DESC"]],
  });

  if (!transaction) {
    const error = new Error("Issue transaction not found.");
    error.statusCode = 404;
    throw error;
  }

  await performModelQuery("AssetTransaction", "create", {
    action: "RETURN",
    assetId,
    employeeId: transaction.employeeId,
    reason: data.reason,
    remarks: data.remarks,
    createdBy: adminId,
    updatedBy: adminId,
  });

  let assetStatus = "IN_STOCK";

  if (data.reason === "REPAIR") {
    assetStatus = "UNDER_REPAIR";
  }

  await performModelQuery("Asset", "update", {
    where: {
      id: assetId,
    },
    update: {
      status: assetStatus,
      updatedBy: adminId,
    },
  });

  return {
    success: true,
  };
};

export const updateAssetStatus = async (assetId, action, remarks, adminId) => {
  const asset = await getAssetById(assetId);

  let status;

  switch (action) {
    case "REPAIR":
      if (asset.status !== "IN_STOCK") {
        const error = new Error("Only assets in stock can be sent for repair.");
        error.statusCode = 400;
        throw error;
      }

      status = "UNDER_REPAIR";
      break;

    case "MAKE_IN_STOCK":
      if (asset.status !== "UNDER_REPAIR") {
        const error = new Error(
          "Only assets under repair can be marked as in stock.",
        );
        error.statusCode = 400;
        throw error;
      }

      status = "IN_STOCK";
      break;

    case "SCRAP":
      if (asset.status !== "UNDER_REPAIR") {
        const error = new Error("Only assets under repair can be scrapped.");
        error.statusCode = 400;
        throw error;
      }

      status = "SCRAPPED";
      break;

    default:
      const error = new Error("Invalid action.");
      error.statusCode = 400;
      throw error;
  }

  await performModelQuery("AssetTransaction", "create", {
    action,
    assetId,
    remarks,
    createdBy: adminId,
    updatedBy: adminId,
  });

  await performModelQuery("Asset", "update", {
    where: {
      id: assetId,
    },
    update: {
      status,
      updatedBy: adminId,
    },
  });

  return {
    success: true,
  };
};

export const getAssetsForHistory = async () => {
  return await performModelQuery("Asset", "readAll", {
    attributes: ["id", "make", "model", "assetCode"],
    order: [
      ["make", "ASC"],
      ["model", "ASC"],
    ],
  });
};

export const getAssetHistory = async (assetId) => {
  return await performModelQuery("AssetTransaction", "readAll", {
    where: {
      assetId,
    },
    include: [
      {
        model: "Employee",
        as: "employee",
        attributes: ["employeeCode", "firstName", "lastName"],
      },
    ],
    order: [["createdAt", "ASC"]],
  });
};
