import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Employee from "./Employee.js";
import Asset from "./Asset.js";
import Admin from "./Admin.js";
import { ASSET_TRANSACTION_ACTIONS, RETURN_REASONS } from "../constants/constant.js";

const AssetTransaction = sequelize.define(
  "AssetTransaction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    action: {
      type: DataTypes.ENUM(...ASSET_TRANSACTION_ACTIONS),
      allowNull: false,
    },

    transactionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    assetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Asset,
        key: "id",
      },
    },

    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Employee,
        key: "id",
      },
    },

    reason: {
      type: DataTypes.ENUM(...RETURN_REASONS),
      allowNull: true,
    },

    remarks: {
      type: DataTypes.TEXT,
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
        fields: ["assetId"],
      },
      {
        fields: ["employeeId"],
      },
    ],
  },
);

export default AssetTransaction;
