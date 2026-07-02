const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  if (req.xhr || req.headers.accept?.includes("application/json")) {
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }

  return res.status(statusCode).render("error", {
    title: "Error",
    statusCode,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;