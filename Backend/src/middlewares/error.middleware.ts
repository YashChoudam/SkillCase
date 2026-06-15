import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { ApiError } from "../utils/api.errors.js";

const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
      data: null,
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
      data: null,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    errors: [],
    data: null,
  });
};

export { errorMiddleware };
