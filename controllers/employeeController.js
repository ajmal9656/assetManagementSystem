import asyncHandler from "../middleware/asyncHandler.js";
import * as employeeService from "../services/employeeService.js";
import { BRANCHES, EMPLOYEE_STATUS } from "../constants/constant.js";
import { validationResult } from "express-validator";

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

export const showCreateEmployee = asyncHandler(async (req, res) => {
  res.render("employees/create", {
    title: "Add Employee",
    branches: BRANCHES,
    employeeStatus: EMPLOYEE_STATUS,
  });
});

export const createEmployee = asyncHandler(async (req, res) => {
  const validationErrors = validationResult(req);

  let errors = {};

  if (!validationErrors.isEmpty()) {
    errors = validationErrors.mapped();
  }

  const result = await employeeService.createEmployee(
    req.body,
    req.session.admin.id,
  );

  if (!result.success) {
    errors = {
      ...errors,
      ...result.errors,
    };
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).render("employees/create", {
      title: "Add Employee",
      branches: BRANCHES,
      employeeStatus: EMPLOYEE_STATUS,
      errors,
      old: req.body,
    });
  }

  res.redirect("/employees");
});

export const showEditEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);

  res.render("employees/edit", {
    title: "Edit Employee",
    employee,
    branches: BRANCHES,
    employeeStatus: EMPLOYEE_STATUS,
  });
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const validationErrors = validationResult(req);

  const employee = await employeeService.getEmployeeById(req.params.id);

  let errors = {};

  if (!validationErrors.isEmpty()) {
    errors = validationErrors.mapped();
  }

  const result = await employeeService.updateEmployee(
    req.params.id,
    req.body,
    req.session.admin.id,
  );

  if (!result.success) {
    errors = {
      ...errors,
      ...result.errors,
    };
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).render("employees/edit", {
      title: "Edit Employee",
      employee,
      branches: BRANCHES,
      employeeStatus: EMPLOYEE_STATUS,
      errors,
      old: req.body,
    });
  }

  return res.redirect("/employees");
});
