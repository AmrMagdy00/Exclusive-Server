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
 * Middleware:
 * - verifyToken(req, res, next)
 *   - Checks for token in HTTP-only cookies
 *   - Verifies token using JWT_SECRET
 *   - Attaches decoded user info (id, email, role) to req.user
 *   - Throws ApiError if token is missing, invalid, or expired
 *
 * @dependencies
 * - jsonwebtoken: For decoding/verifying JWT
 * - ApiError: Custom error class for consistent API error responses
 *
 * @usage
 * import verifyToken from './middleware/auth/verifyToken.js';
 * router.get('/protected', verifyToken, handler);
 */

import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError.js";

export default function verifyToken(req, res, next) {
  try {
    // Extract JWT token from HTTP-only cookie
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      throw new ApiError({
        message: "No token provided",
        statusCode: 401,
        errorCode: "NO_TOKEN",
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request object
    req.user = decoded;

    next(); // Pass control to the next middleware/route
  } catch (err) {
    // Token is invalid/malformed
    if (err.name === "JsonWebTokenError") {
      return next(
        new ApiError({
          message: "Invalid token",
          statusCode: 401,
          errorCode: "INVALID_TOKEN",
        })
      );
    }

    // Token is expired
    if (err.name === "TokenExpiredError") {
      return next(
        new ApiError({
          message: "Token expired",
          statusCode: 401,
          errorCode: "TOKEN_EXPIRED",
        })
      );
    }

    // Other unexpected errors
    next(err);
  }
}
