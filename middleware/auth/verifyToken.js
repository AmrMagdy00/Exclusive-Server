/**
 * @file verifyToken.js
 * @description
 * JWT token verification middleware for protecting authenticated routes.
 *
 * Responsibilities:
 * 1. Extract JWT token from HTTP cookies.
 * 2. Verify token validity and expiration.
 * 3. Decode token and attach user data to request object.
 * 4. Handle token errors (invalid, expired) and respond with appropriate status codes.
 *
 * Methods:
 * - verifyToken(req, res, next)
 *   - Middleware function to check JWT token in cookies
 *   - Attaches decoded user info to req.user
 *   - Returns 401 if token is missing, invalid, or expired
 *
 * @dependencies
 * - jsonwebtoken: JWT library for token verification
 * - ApiError: Custom error class for operational errors
 * - process.env.JWT_SECRET: Secret key for JWT verification
 *
 * @usage
 * import AuthMiddleware from './middleware/auth/verifyToken.js';
 * const authMiddleware = new AuthMiddleware();
 * app.use('/protected', authMiddleware.verifyToken, routeHandler);
 */

import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError.js";

export default class AuthMiddleware {
  // -------------------- JWT Token Verification Middleware --------------------
  /**
   * Middleware function to verify JWT token from HTTP-only cookies
   * @param {import('express').Request} req - Express request object containing cookies
   * @param {import('express').Response} res - Express response object
   * @param {import('express').NextFunction} next - Express next function to pass control to next middleware
   */
  verifyToken(req, res, next) {
    try {
      // Extract JWT token from HTTP-only cookie (more secure than Authorization header)
      const token = req.cookies.token;

      // Check if token exists in cookies
      if (!token) {
        throw new ApiError({
          message: "No token provided",
          statusCode: 401,
          errorCode: "NO_TOKEN",
        });
      }

      // Verify token signature and decode payload using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded user information (id, email, role) to request for use in downstream handlers
      req.user = decoded;

      // Pass control to next middleware or route handler
      next();
    } catch (err) {
      // Handle JWT format/signature errors (malformed token or invalid signature)
      if (err.name === "JsonWebTokenError") {
        return next(
          new ApiError({
            message: "Invalid token",
            statusCode: 401,
            errorCode: "INVALID_TOKEN",
          })
        );
      }

      // Handle expired token errors (token structure valid but past expiration time)
      if (err.name === "TokenExpiredError") {
        return next(
          new ApiError({
            message: "Token expired",
            statusCode: 401,
            errorCode: "TOKEN_EXPIRED",
          })
        );
      }

      // Forward any unexpected errors to global error handler
      next(err);
    }
  }
}
