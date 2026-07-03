import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { performModelQuery } from "../utils/commonQuery.js";

export const getStockView = async () => {
  const stock = await performModelQuery("Asset", "aggregate", {
    where: {
      status: {
        [Op.ne]: "SCRAPPED",
      },
    },
    attributes: [
      "branch",
      [sequelize.fn("COUNT", sequelize.col("id")), "totalAssets"],
      [sequelize.fn("SUM", sequelize.col("purchasePrice")), "totalValue"],
    ],
    groupBy: "branch",
    order: [["branch", "ASC"]],
  });

  return stock;
};
