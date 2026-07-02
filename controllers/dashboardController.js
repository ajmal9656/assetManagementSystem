import asyncHandler from "../middleware/asyncHandler.js";

export const dashboard = asyncHandler(async (req, res) => {
  res.render("dashboard/index", {
    title: "Dashboard",
  });
});