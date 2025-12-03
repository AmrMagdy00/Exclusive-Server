/**
 * @file authorizeRole.js
 * @description
 * Middleware for role-based authorization.
 *
 * Responsibilities:
 * 1. Ensure user is authenticated (req.user exists)
 * 2. Check if user role matches allowed roles
 * 3. Throw ApiError (403) if not authorized
 *
 * Usage:
 * router.post("/admin", verifyToken, authorizeRole("admin"), controller.action)
 */

import ApiError from "../../utils/ApiError.js";

export default function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    try {
      // Check if user object exists (added by verifyToken)
      if (!req.user) {
        throw new ApiError({
          message: "Not authenticated",
          statusCode: 401,
          errorCode: "NOT_AUTHENTICATED",
        });
      }

      // Check if user's role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError({
          message: "Forbidden: You do not have permission",
          statusCode: 403,
          errorCode: "FORBIDDEN",
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
