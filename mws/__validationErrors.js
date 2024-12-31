const { validationResult } = require("express-validator");

const ResponseDispatcher = require("../managers/response_dispatcher/ResponseDispatcher.manager.js");
const dispatcher = new ResponseDispatcher();

/**
 * Middleware to handle validation errors
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 * @param {*} next - Express next middleware function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return dispatcher.dispatch(res, {
      ok: false,
      code: 400,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = handleValidationErrors;
