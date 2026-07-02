import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { BRANCHES } from "../constants/constant.js";
import AssetCategory from "./AssetCategory.js";
import Admin from "./Admin.js";
import { ASSET_STATUS } from "../constants/constant.js";

const Asset = sequelize.define(
  "Asset",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AssetCategory,
        key: "id",
      },
    },

    assetCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    serialNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    make: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    purchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    purchasePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    branch: {
      type: DataTypes.ENUM(...BRANCHES),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(...ASSET_STATUS),
      defaultValue: "IN_STOCK",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Admin,
        key: "id",
      },
    },

    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Admin,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["categoryId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["branch"],
      },
    ],
  },
);

export default Asset;
