const asyncWrapper = require("../middleWare/asyncWrapper");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");

exports.isAuthentictedUser = asyncWrapper(async (req, res, next) => {
  let token;

  // Check for token in cookies first, then in Authorization header
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // if there is no token found
  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  // now verify that token with secret key
  const deCodeToken = jwt.verify(token, process.env.JWT_SECRET);

  // now get user id from deCodeToken and store user in req object
  const user = await userModel.findById(deCodeToken.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 401));
  }

  req.user = user; // now we have user in req.user

  next();
});

// taking role as param and converting it into array using spread operator
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }
    
    if (roles.includes(req.user.role) === false) {
      return next(
        new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403)
      );
    }

    next();
  }
}