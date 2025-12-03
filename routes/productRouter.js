import express from "express";
import Roles from "../constants/roles.js";
import authorizeRole from "../middleware/auth/authorizeRole.js";
import verifyToken from "../middleware/auth/verifyToken.js";

// Factory function to create a router for product-related routes
// We receive the controller as a parameter instead of importing a fixed one
export default function createProductRouter(productController) {
  const router = express.Router(); // Create a new Express router instance

  // -------------------- Get All Products Route --------------------
  // GET /products
  // Calls the getAllProducts method of the controller
  // Supports query parameters for filtering, sorting, and pagination
  router.get("/", (req, res, next) =>
    productController.getAllProducts(req, res, next)
  );

  // -------------------- Get Product by ID Route --------------------
  // GET /products/:id
  // Calls the getProductById method of the controller
  router.get("/:id", (req, res, next) =>
    productController.getProductById(req, res, next)
  );

  // -------------------- Protected Routes (Admin Only) --------------------
  // All routes below require authentication and admin role
  router.use(verifyToken);
  router.use(authorizeRole(Roles.ADMIN));

  // -------------------- Create Product Route --------------------
  // POST /products/create
  // Calls the create method of the controller
  router.post("/create", (req, res, next) =>
    productController.create(req, res, next)
  );

  // -------------------- Update Product Route --------------------
  // PUT /products/:id
  // Calls the update method of the controller
  router.put("/:id", (req, res, next) =>
    productController.update(req, res, next)
  );

  // -------------------- Delete Product Route --------------------
  // DELETE /products/:id
  // Calls the delete method of the controller
  router.delete("/:id", (req, res, next) =>
    productController.delete(req, res, next)
  );

  return router; // Return the configured router
}
