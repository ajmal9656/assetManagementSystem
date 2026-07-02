import { validationResult } from "express-validator";

const validateRequest = (view) => {
  return (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).render(view, {
      title: "Validation Error",
      errors: errors.mapped(),
      old: req.body,
    });
  };
};

export default validateRequest;
