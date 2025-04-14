import errorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    return next(errorHandler(401, "Your session has expired. Please sign out and sign in again to continue ...."));
  }

  jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decodedId) => {
    if (err) return next(errorHandler(403, "Forbidden"));
    req.verifiedUserId = decodedId;
    next();
  });
}