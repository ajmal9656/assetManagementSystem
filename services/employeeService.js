import { Op } from "sequelize";
import {
  performModelQuery,
  checkFieldValueExist,
} from "../utils/commonQuery.js";

export const getEmployees = async (query) => {
  const { page = 1, search = "", status = "" } = query;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where[Op.or] = [
      {
        firstName: {
          [Op.iLike]: `%${search}%`,
        },
      },
      {
        lastName: {
          [Op.iLike]: `%${search}%`,
        },
      },
      {
        email: {
          [Op.iLike]: `%${search}%`,
        },
      },
    ];
  }

  return await performModelQuery("Employee", "read", {
    where,
    page: Number(page),
    limit: 6,
    order: [["createdAt", "DESC"]],
  });
};

export const createEmployee = async (data, adminId) => {
  const errors = {};

  let emailExists = false;
  let phoneExists = false;

  if (data.email) {
    emailExists = await checkFieldValueExist("Employee", "email", data.email);

    if (emailExists) {
      errors.email = {
        msg: "Email already exists.",
      };
    }
  }

  if (data.phone) {
    phoneExists = await checkFieldValueExist("Employee", "phone", data.phone);

    if (phoneExists) {
      errors.phone = {
        msg: "Phone number already exists.",
      };
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  const lastEmployee = await performModelQuery("Employee", "findOne", {
    order: [["id", "DESC"]],
  });

  let employeeCode = "EMP001";

  if (lastEmployee) {
    const number = Number(lastEmployee.employeeCode.replace("EMP", ""));

    employeeCode = `EMP${String(number + 1).padStart(3, "0")}`;
  }

  await performModelQuery("Employee", "create", {
    employeeCode,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    designation: data.designation,
    branch: data.branch,
    createdBy: adminId,
    updatedBy: adminId,
  });

  return {
    success: true,
  };
};

export const getEmployeeById = async (id) => {
  const employee = await performModelQuery("Employee", "findOne", {
    where: {
      id,
    },
  });

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  return employee;
};

export const updateEmployee = async (id, data, adminId) => {
  const errors = {};

  if (data.email) {
    const emailExists = await checkFieldValueExist(
      "Employee",
      "email",
      data.email,
      id,
    );

    if (emailExists) {
      errors.email = {
        msg: "Email already exists.",
      };
    }
  }

  if (data.phone) {
    const phoneExists = await checkFieldValueExist(
      "Employee",
      "phone",
      data.phone,
      id,
    );

    if (phoneExists) {
      errors.phone = {
        msg: "Phone number already exists.",
      };
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  await performModelQuery("Employee", "update", {
    where: {
      id,
    },
    update: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      designation: data.designation,
      branch: data.branch,
      status: data.status,
      updatedBy: adminId,
    },
  });

  return {
    success: true,
  };
};
