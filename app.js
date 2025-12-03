/**
 * @file app.js
 * @description
 * This module creates and configures an Express application instance.
 *
 * Responsibilities:
 * 1. Initializes Express app.
 * 2. Enables CORS for all routes.
 * 3. Parses JSON request bodies.
 * 4. Logs incoming requests and their duration.
 * 5. Handles errors globally with a generic response.
 *
 * Middleware Flow:
 * - Request Logger: Logs method, URL, and response time for each request.
 * - JSON Body Parser: Parses JSON bodies of incoming requests.
 * - CORS: Allows cross-origin requests.
 * - Error Handler: Catches errors thrown in routes/middlewares and responds with 500.
 *
 * Usage:
 * import createApp from './app.js';
 * const app = createApp();
 *
 * The returned app can then be used in server.js to register routes and start the server.
 *
 * @dependencies
 * - express: Web framework.
 * - cors: Middleware to enable Cross-Origin Resource Sharing.
 * - logger: Custom logger to log server events and requests.
 * - Routers: Sets up route handlers.
 *
 * @example
 * import createApp from './app.js';
 * const app = createApp();
 * app.listen(4000, () => console.log('Server running on port 4000'));

 */

import express from "express";
import cors from "cors";
import logger from "./middleware/logger/logger.js";
import cookieParser from "cookie-parser";
import { corsOptionsOpen } from "./config/cors.js";

// Import router creation functions
import createAuthRouter from "./routes/authRouter.js";
import createProductRouter from "./routes/productRouter.js";
// Function to create and configure the Express app
export function createApp() {
  const app = express();

  // -------------------- CORS Configuration --------------------
  // Enable CORS to allow all origins (any domain can access this API)
  // Warning: This is permissive and should only be used for public APIs
  // For production with sensitive data, use corsOptions with origin whitelist instead
  app.use(cors(corsOptionsOpen));

  // Enable parsing of JSON request bodies
  app.use(express.json());

  // -------------------- Cookie Parser Middleware --------------------
  // Enable parsing of HTTP cookies from request headers
  // Allows access to cookies via req.cookies object in route handlers
  // Used for storing and retrieving JWT tokens in HTTP-only cookies (more secure than Authorization headers)
  app.use(cookieParser());

  // -------------------- Request Logger --------------------
  // Custom middleware to log each incoming request and its duration
  app.use((req, res, next) => {
    // Log when request starts
    logger.info(`[REQUEST STARTED] ${req.method} ${req.originalUrl}`);

    const start = Date.now(); // Track start time

    // When response finishes, log the status code and duration
    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.info(
        `[REQUEST ENDED] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
      );
    });

    next(); // Pass control to the next middleware/route
  });

  return app; // Return the configured Express app
}

export default createApp;
