export const isAuthenticated = (req, res, next) => {
  try {
    if (req.session?.admin) {
      return next();
    }

    return res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

export const redirectIfAuthenticated = (req, res, next) => {
  try {
    if (req.session?.admin) {
      return res.redirect("/dashboard");
    }

    next();
  } catch (error) {
    next(error);
  }
};
