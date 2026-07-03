import asyncHandler from "../middleware/asyncHandler.js";
import * as dashboardService from "../services/dashboardService.js";

export const dashboard = asyncHandler(async (req, res) => {
  const dashboardData = await dashboardService.getDashboardData();

  res.render("dashboard/index", {
    title: "Dashboard",
    ...dashboardData,
  });
});
