import asyncHandler from "../middleware/asyncHandler.js";
import * as stockService from "../services/stockService.js";

export const showStockView = asyncHandler(async (req, res) => {
  const stock = await stockService.getStockView();

  const totals = stock.reduce(
    (acc, item) => {
      acc.assets += Number(item.totalAssets);
      acc.value += Number(item.totalValue);

      return acc;
    },
    {
      assets: 0,
      value: 0,
    },
  );

  res.render("stocks/index", {
    title: "Stock View",
    stock,
    totals,
  });
});
