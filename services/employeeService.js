import { Op } from "sequelize";
import { performModelQuery } from "../utils/commonQuery.js";

export const getEmployees = async (query) => {
  const {
    page = 1,
    search = "",
    status = "",
  } = query;

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
    limit: 10,
    order: [["createdAt", "DESC"]],
  });
};