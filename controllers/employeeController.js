import asyncHandler from "../middleware/asyncHandler.js";
import * as employeeService from "../services/employeeService.js";
import { BRANCHES, EMPLOYEE_STATUS } from "../constants/constant.js";

export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await employeeService.getEmployees(req.query);

  res.render("employees/index", {
    title: "Employee Management",
    employees: employees.result,
    branches: BRANCHES,
    employeeStatus: EMPLOYEE_STATUS,
    search: req.query.search || "",
    status: req.query.status || "",
    pagination: {
      currentPage: employees.current_page,
      totalPages: employees.total_pages,
      totalCount: employees.total_count,
    },
  });
});
