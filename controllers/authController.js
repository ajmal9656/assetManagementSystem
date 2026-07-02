import asyncHandler from "../middleware/asyncHandler.js";
import * as authService from "../services/authService.js";

export const showLogin = asyncHandler(async (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

export const login = asyncHandler(async (req, res) => {
  try {
    const admin = await authService.login(req.body);

    req.session.admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    };

    console.log(req.session.admin);
    
    res.redirect("/dashboard");
  } catch (error) {
    res.status(error.statusCode || 401).render("login", {
      title: "Login",
      error: error.message,
      old: {
        email: req.body.email,
      },
    });
  }
});

export const logout = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }

    res.redirect("/login");
  });
});