/**
 * @file authRouter.js
 * @description
 * Factory function to create an Express router for user-related routes.
 *
 * Responsibilities:
 * 1. Receives a userController as a parameter.
 * 2. Defines routes for user actions (login, signup).
 * 3. Returns a configured router instance ready to be mounted on the app.
 *
 * Routes:
 * - POST /users/login → Calls userController.login
 * - POST /users/signup → Calls userController.signup
 *
 * Usage:
 * import createUserRouter from './routes/authRouter.js';
 * import userController from './controllers/userController.js';
 * const userRouter = createUserRouter(userController);
 * app.use('/users', userRouter);
 *
 * @dependencies
 * - express: Web framework to create routers and handle HTTP requests.
 * - userController: Controller object with login and signup methods.
 *
 * @example
 * // Mounting the router in the Express app
 * app.use('/users', createUserRouter(userController));
 */

import express from "express";

// Factory function to create a router for user-related routes
// We receive the controller as a parameter instead of importing a fixed one
export default function createAuthRouter(authController) {
  const router = express.Router(); // Create a new Express router instance

  // -------------------- Login Route --------------------
  // POST /users/login
  // Calls the login method of the controller
  router.post("/login", (req, res, next) =>
    authController.login(req, res, next)
  );

  // -------------------- Signup Route --------------------
  // POST /users/signup
  // Calls the signup method of the controller
  router.post("/register", (req, res, next) => {
    authController.register(req, res, next);
  });

  return router; // Return the configured router
}
