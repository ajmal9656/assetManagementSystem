const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).render("error", {
    title: "Error",
    statusCode,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;