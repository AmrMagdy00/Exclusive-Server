import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError.js";

export default class AuthMiddleware {
  verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError({
          message: "No token provided",
          statusCode: 401,
          errorCode: "NO_TOKEN",
        });
      }

      const token = authHeader.split(" ")[1];

      // Check Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      next();
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        return next(
          new ApiError({
            message: "Invalid token",
            statusCode: 401,
            errorCode: "INVALID_TOKEN",
          })
        );
      }

      if (err.name === "TokenExpiredError") {
        return next(
          new ApiError({
            message: "Token expired",
            statusCode: 401,
            errorCode: "TOKEN_EXPIRED",
          })
        );
      }

      next(err);
    }
  }
}
