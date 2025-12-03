/**
 * @file server.js
 * @description
 * Entry point for the API server.
 *
 * This file performs the following tasks:
 * 1. Loads environment variables from `.env` file.
 * 2. Connects to MongoDB.
 * 3. Initializes repositories, services, and controllers.
 * 4. Creates the Express app.
 * 5. Registers product and user routes.

 * 5. Starts the server on the configured port.
 *
 * @dependencies
 * - dotenv: Loads environment variables.
 * - createApp: Function that sets up Express middlewares.
 * - connectDB: Function that connects to MongoDB.
 * - Logger: Custom logger for server events.
 * - Repositories: Handles DB operations.
 * - Services: Contains business logic.
 * - Controllers: Handles HTTP requests.
 *
 * @environment
 * - PORT: The port number the server listens on (default: 4000).
 * - MONGO_URI: MongoDB connection string.
 *
 * @example
 * To start the server:
 *   node server.js
 *
 * All routes are mounted as:
 *   /products → Product routes
 *   /users → User routes
 * 
 */

// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// Import the function that creates the Express app
import createApp from "./app.js";

// Import the function to connect to MongoDB
import connectDB from "./config/db.js";

// Import custom logger for logging server events
import logger from "./middleware/logger/logger.js";

// Import repositories, services, and controllers for products
import ProductRepository from "./Repositories/productRepository.js";
import ProductService from "./services/productService.js";
import ProductController from "./controllers/productController.js";

// Import repositories, services, and controllers for users
import UserRepository from "./Repositories/userRepository.js";
import AuthService from "./services/auth/authService.js";
import UserController from "./controllers/authController.js";
import createProductRouter from "./routes/productRouter.js";
import createAuthRouter from "./routes/authRouter.js";

// -------------------- Dependency Injection --------------------
// Create instances of repositories, services, and controllers
const productRepository = new ProductRepository(); // Handles DB operations for products
const productService = new ProductService(productRepository); // Contains business logic for products
const productController = new ProductController(productService); // Handles HTTP requests for products

const userRepository = new UserRepository(); // Handles DB operations for users
const authService = new AuthService(userRepository); // Contains business logic for users
const userController = new UserController(authService); // Handles HTTP requests for users

// -------------------- Create Express App --------------------
// Initialize Express app
const app = createApp();

// -------------------- Connect to Database --------------------
// Connect to MongoDB using the connection function
await connectDB();

// -------------------- Register Routes --------------------
// Mount product routes at /products
app.use("/products", createProductRouter(productController));

// Mount user routes at /users
app.use("/users", createAuthRouter(userController));

// -------------------- Error Handler --------------------
// This middleware catches any errors thrown in routes or other middlewares
// It should be registered after all routes
app.use((err, req, res, next) => {
  logger.error(`[ERROR] ${err.message}`);

  if (err.isOperational) {
    // Errors
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode || null,
      details: err.details || null,
    });
  } else {
    // Errors Not Expected → 500
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please check logs.",
      errorCode: "INTERNAL_SERVER_ERROR",
    });
  }
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`); // Log when server is running
});
