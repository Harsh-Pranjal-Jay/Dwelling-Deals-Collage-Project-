import jwt from "jsonwebtoken";
import errorHandler from './error.js';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(errorHandler(401, "Authentication required. Please login."));
    }

    jwt.verify(token, 'edlmY+rfbah/THFfLucEAaboPH3aoKt3VGGSYm0UZZk=', (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return next(errorHandler(401, "Session expired. Please login again."));
        }
        return next(errorHandler(403, "Invalid token. Please login again."));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return next(errorHandler(500, "Internal server error during authentication."));
  }
};
