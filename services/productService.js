import { buildQueryOptions } from "../utils/builder.js"; // Utility to parse query parameters
import logger from "../middleware/logger/logger.js";
import ApiError from "../utils/ApiError.js";
import ApiSuccess from "../utils/ApiSuccess.js";

/**
 * ProductService handles business logic for product operations
 * Responsibilities:
 * - Validation of input data
 * - Error handling and formatting
 * - Response formatting using ApiSuccess/ApiError
 * - Orchestrating repository calls
 */
export default class ProductService {
  constructor(ProductRepository) {
    // Dependency Injection: store the repository instance
    this.ProductRepository = ProductRepository;
  }

  // -------------------- Get All Products --------------------
  /**
   * Retrieves all products with optional filtering, sorting, and pagination
   * @param {Object} query - Query parameters for filtering and pagination
   * @returns {Promise<ApiSuccess>} Structured success response with products array
   * @throws {ApiError} If database operation fails
   */
  async getAllProducts(query) {
    try {
      // Parse the query parameters into filter and options for repository
      // options may include sort, skip, limit, random, etc.
      const { filter, options } = buildQueryOptions(query);

      // Fetch products from repository with filtering, pagination, and sorting
      const products = await this.ProductRepository.findWithPagination(
        filter,
        options
      );

      // Log the number of fetched products
      logger.info(`[${products.length}] products fetched successfully`);

      // Return structured success response
      return new ApiSuccess({
        message: "Products fetched successfully",
        statusCode: 200,
        data: products,
        successCode: "PRODUCTS_FETCHED",
      });
    } catch (error) {
      // Log the error
      logger.error("Error fetching products:", error);

      // If it's already an ApiError, re-throw it
      if (error instanceof ApiError) {
        throw error;
      }

      // Otherwise, wrap it in an ApiError
      throw new ApiError({
        message: "Failed to fetch products",
        statusCode: 500,
        errorCode: "PRODUCTS_FETCH_ERROR",
        details: error.message,
      });
    }
  }

  // -------------------- Get Product by ID --------------------
  /**
   * Retrieves a single product by its ID
   * @param {string|number} id - Product ID
   * @returns {Promise<ApiSuccess>} Structured success response with product data
   * @throws {ApiError} If ID is missing, invalid, or product not found
   */
  async getProductById(id) {
    try {
      if (!id) {
        throw new ApiError({
          message: "Product ID is required",
          statusCode: 400,
          errorCode: "MISSING_PRODUCT_ID",
        });
      }

      // Fetch the product by ID using the repository
      const product = await this.ProductRepository.findWithID(id);

      // If product not found, throw an error
      if (!product) {
        logger.info(`Product [${id}] not found`);
        throw new ApiError({
          message: "Product not found",
          statusCode: 404,
          errorCode: "PRODUCT_NOT_FOUND",
        });
      }

      // Log successful fetch
      logger.info(`Product [${id}] fetched successfully`);

      // Return structured success response
      return new ApiSuccess({
        message: "Product fetched successfully",
        statusCode: 200,
        data: product,
        successCode: "PRODUCT_FETCHED",
      });
    } catch (error) {
      // Log the error
      logger.error(`Error fetching product [${id}]:`, error);

      // If it's already an ApiError, re-throw it
      if (error instanceof ApiError) {
        throw error;
      }

      // Otherwise, wrap it in an ApiError
      throw new ApiError({
        message: "Failed to fetch product",
        statusCode: 500,
        errorCode: "PRODUCT_FETCH_ERROR",
        details: error.message,
      });
    }
  }

  // -------------------- Create Product --------------------
  /**
   * Creates a new product in the database
   * @param {Object} productData - Product data to create
   * @returns {Promise<ApiSuccess>} Structured success response with created product
   * @throws {ApiError} If product data is missing or creation fails
   */
  async create(productData) {
    try {
      if (!productData) {
        throw new ApiError({
          message: "Product data is required",
          statusCode: 400,
          errorCode: "MISSING_PRODUCT_DATA",
        });
      }

      // Get the last ID and increment it
      const lastId = await this.ProductRepository.getLastId();
      productData.id = lastId + 1;

      // Create the product
      const createdProduct = await this.ProductRepository.create(productData);

      // Log successful creation
      logger.info(`Product [${createdProduct.id}] created successfully`);

      // Return structured success response
      return new ApiSuccess({
        message: "Product created successfully",
        statusCode: 201,
        data: createdProduct,
        successCode: "PRODUCT_CREATED",
      });
    } catch (error) {
      // Log the error
      logger.error("Error creating product:", error);

      // Otherwise, wrap it in an ApiError
      throw new ApiError({
        message: "Failed to create product",
        statusCode: 500,
        errorCode: "PRODUCT_CREATE_ERROR",
        details: error.message,
      });
    }
  }

  // -------------------- Update Product --------------------
  /**
   * Updates an existing product
   * Validates ID, checks product existence, then updates
   * @param {string|number} id - Product ID to update
   * @param {Object} updateData - Data to update the product with
   * @returns {Promise<ApiSuccess>} Structured success response with updated product
   * @throws {ApiError} If ID is missing/invalid, product not found, or update fails
   */
  async update(id, updateData) {
    try {
      // Validation: Check if ID is provided
      if (!id) {
        throw new ApiError({
          message: "Product ID is required",
          statusCode: 400,
          errorCode: "MISSING_PRODUCT_ID",
        });
      }

      // Validation: Convert ID to number and check if valid
      const numericId = Number(id);
      if (Number.isNaN(numericId)) {
        throw new ApiError({
          message: "Invalid product ID format",
          statusCode: 400,
          errorCode: "INVALID_PRODUCT_ID",
        });
      }

      // Validation: Check if update data is provided
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new ApiError({
          message: "Update data is required",
          statusCode: 400,
          errorCode: "MISSING_UPDATE_DATA",
        });
      }

      // Check if product exists before updating
      const existingProduct = await this.ProductRepository.findWithID(
        numericId
      );
      if (!existingProduct) {
        throw new ApiError({
          message: "Product not found",
          statusCode: 404,
          errorCode: "PRODUCT_NOT_FOUND",
        });
      }

      // Update the product in database
      const updatedProduct = await this.ProductRepository.update(
        existingProduct,
        updateData
      );

      // Log successful update
      logger.info(`Product [${numericId}] updated successfully`);

      // Return structured success response
      return new ApiSuccess({
        message: "Product updated successfully",
        statusCode: 200,
        data: updatedProduct,
        successCode: "PRODUCT_UPDATED",
      });
    } catch (error) {
      // Log the error
      logger.error(`Error updating product [${id}]:`, error);

      // Otherwise, wrap it in an ApiError
      throw new ApiError({
        message: "Failed to update product",
        statusCode: 500,
        errorCode: "PRODUCT_UPDATE_ERROR",
        details: error.message,
      });
    }
  }

  // -------------------- Delete Product --------------------
  /**
   * Deletes a product from the database
   * Validates ID and checks product existence before deletion
   * @param {string|number} id - Product ID to delete
   * @returns {Promise<ApiSuccess>} Structured success response with deleted product
   * @throws {ApiError} If ID is missing/invalid, product not found, or deletion fails
   */
  async delete(id) {
    try {
      // Validation: Check if ID is provided
      if (!id) {
        throw new ApiError({
          message: "Product ID is required",
          statusCode: 400,
          errorCode: "MISSING_PRODUCT_ID",
        });
      }

      // Validation: Convert ID to number and check if valid
      const numericId = Number(id);
      if (Number.isNaN(numericId)) {
        throw new ApiError({
          message: "Invalid product ID format",
          statusCode: 400,
          errorCode: "INVALID_PRODUCT_ID",
        });
      }

      // Check if product exists before deleting
      const existingProduct = await this.ProductRepository.findWithID(
        numericId
      );
      if (!existingProduct) {
        throw new ApiError({
          message: "Product not found",
          statusCode: 404,
          errorCode: "PRODUCT_NOT_FOUND",
        });
      }

      // Delete the product from database
      const deletedProduct = await this.ProductRepository.deleteById(numericId);

      // Log successful deletion
      logger.info(`Product [${numericId}] deleted successfully`);

      // Return structured success response
      return new ApiSuccess({
        message: "Product deleted successfully",
        statusCode: 200,
        data: deletedProduct,
        successCode: "PRODUCT_DELETED",
      });
    } catch (error) {
      // Log the error
      logger.error(`Error deleting product [${id}]:`, error);

      // If it's already an ApiError, re-throw it
      if (error instanceof ApiError) {
        throw error;
      }

      // Otherwise, wrap it in an ApiError
      throw new ApiError({
        message: "Failed to delete product",
        statusCode: 500,
        errorCode: "PRODUCT_DELETE_ERROR",
        details: error.message,
      });
    }
  }
}
