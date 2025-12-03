// ProductController handles HTTP requests for product-related actions
export default class ProductController {
  constructor(productService) {
    // Dependency Injection: store the service instance
    this.productService = productService;
  }

  // -------------------- Get All Products --------------------
  async getAllProducts(req, res, next) {
    try {
      // Pass query parameters to the service (for filtering, sorting, pagination)
      const result = await this.productService.getAllProducts(req.query);

      // Respond with structured success response
      return res.status(result.statusCode).json(result);
    } catch (err) {
      // Pass errors to the error-handling middleware
      next(err);
    }
  }

  // -------------------- Get Product by ID --------------------
  async getProductById(req, res, next) {
    try {
      const { id } = req.params; // Get the product ID from the route parameters

      // Call the service layer to retrieve the product
      const result = await this.productService.getProductById(id);

      // Respond with structured success response
      return res.status(result.statusCode).json(result);
    } catch (err) {
      // Pass errors to the error-handling middleware
      next(err);
    }
  }

  // -------------------- Create Product --------------------
  async create(req, res, next) {
    try {
      // Call the service layer to create the product
      const result = await this.productService.create(req.body);

      // Respond with structured success response
      return res.status(result.statusCode).json(result);
    } catch (err) {
      // Pass errors to the error-handling middleware
      next(err);
    }
  }

  // -------------------- Update Product --------------------
  async update(req, res, next) {
    try {
      const { id } = req.params; // Get the product ID from the route parameters

      // Call the service layer to update the product
      const result = await this.productService.update(id, req.body);

      // Respond with structured success response
      return res.status(result.statusCode).json(result);
    } catch (err) {
      // Pass errors to the error-handling middleware
      next(err);
    }
  }

  // -------------------- Delete Product --------------------
  async delete(req, res, next) {
    try {
      const { id } = req.params; // Get the product ID from the route parameters

      // Call the service layer to delete the product
      const result = await this.productService.delete(id);

      // Respond with structured success response
      return res.status(result.statusCode).json(result);
    } catch (err) {
      // Pass errors to the error-handling middleware
      next(err);
    }
  }
}
