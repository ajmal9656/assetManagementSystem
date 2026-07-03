import { performModelQuery } from "../utils/commonQuery.js";

export const getDashboardData = async () => {
  const [
    totalEmployees,
    assetsInStock,
    issuedAssets,
    assetsUnderRepair,
    scrappedAssets,
  ] = await Promise.all([
    performModelQuery("Employee", "count", { status: "ACTIVE" }),
    performModelQuery("Asset", "count", {
      where: {
        status: "IN_STOCK",
      },
    }),
    performModelQuery("Asset", "count", {
      where: {
        status: "ISSUED",
      },
    }),
    performModelQuery("Asset", "count", {
      where: {
        status: "UNDER_REPAIR",
      },
    }),
    performModelQuery("Asset", "count", {
      where: {
        status: "SCRAPPED",
      },
    }),
  ]);

  return {
    totalEmployees,
    assetsInStock,
    issuedAssets,
    assetsUnderRepair,
    scrappedAssets,
  };
};
