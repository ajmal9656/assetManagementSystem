import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Admin from "./Admin.js";
import { BRANCHES, EMPLOYEE_STATUS } from "../constants/constant.js";

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    employeeCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    phone: {
      type: DataTypes.STRING,
    },

    designation: {
      type: DataTypes.STRING,
    },

    branch: {
      type: DataTypes.ENUM(...BRANCHES),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(...EMPLOYEE_STATUS),
      defaultValue: "ACTIVE",
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
        fields: ["status"],
      },
    ],
  },
);

export default Employee;
