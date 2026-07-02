import Admin from "./Admin.js";
import Employee from "./Employee.js";
import AssetCategory from "./AssetCategory.js";
import Asset from "./Asset.js";
import AssetTransaction from "./AssetTransaction.js";

AssetCategory.hasMany(Asset, {
  foreignKey: "categoryId",
  as: "assets",
});

Asset.belongsTo(AssetCategory, {
  foreignKey: "categoryId",
  as: "category",
});


Employee.hasMany(AssetTransaction, {
  foreignKey: "employeeId",
  as: "transactions",
});

AssetTransaction.belongsTo(Employee, {
  foreignKey: "employeeId",
  as: "employee",
});


Asset.hasMany(AssetTransaction, {
  foreignKey: "assetId",
  as: "transactions",
});

AssetTransaction.belongsTo(Asset, {
  foreignKey: "assetId",
  as: "asset",
});


Admin.hasMany(Employee, {
  foreignKey: "createdBy",
  as: "createdEmployees",
});

Employee.belongsTo(Admin, {
  foreignKey: "createdBy",
  as: "creator",
});


Admin.hasMany(Employee, {
  foreignKey: "updatedBy",
  as: "updatedEmployees",
});

Employee.belongsTo(Admin, {
  foreignKey: "updatedBy",
  as: "updater",
});


Admin.hasMany(AssetCategory, {
  foreignKey: "createdBy",
  as: "createdCategories",
});

AssetCategory.belongsTo(Admin, {
  foreignKey: "createdBy",
  as: "creator",
});

Admin.hasMany(AssetCategory, {
  foreignKey: "updatedBy",
  as: "updatedCategories",
});

AssetCategory.belongsTo(Admin, {
  foreignKey: "updatedBy",
  as: "updater",
});


Admin.hasMany(Asset, {
  foreignKey: "createdBy",
  as: "createdAssets",
});

Asset.belongsTo(Admin, {
  foreignKey: "createdBy",
  as: "creator",
});

// Updated By
Admin.hasMany(Asset, {
  foreignKey: "updatedBy",
  as: "updatedAssets",
});

Asset.belongsTo(Admin, {
  foreignKey: "updatedBy",
  as: "updater",
});


Admin.hasMany(AssetTransaction, {
  foreignKey: "createdBy",
  as: "createdTransactions",
});

AssetTransaction.belongsTo(Admin, {
  foreignKey: "createdBy",
  as: "creator",
});

Admin.hasMany(AssetTransaction, {
  foreignKey: "updatedBy",
  as: "updatedTransactions",
});

AssetTransaction.belongsTo(Admin, {
  foreignKey: "updatedBy",
  as: "updater",
});

const db = {
  Admin,
  Employee,
  AssetCategory,
  Asset,
  AssetTransaction,
};

export default db;

export {
  Admin,
  Employee,
  AssetCategory,
  Asset,
  AssetTransaction,
};