const ApiError = require("../utils/ApiError");

/**
 * Global error handling middleware.
 * Catches all errors and formats them into a standard JSON response.
 */
const errorHandler = (err, req, res, next) => {
    let error = err;

    // Check if error is an instance of ApiError
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, [], err.stack);
    }

    const response = {
        success: false,
        message: error.message,
        errors: error.errors || [],
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };

    return res.status(error.statusCode || 500).json(response);
};

module.exports = errorHandler;
