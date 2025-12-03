/**
 * ProductRepository handles direct database operations for products
 * Responsibilities:
 * - Database CRUD operations only
 * - No validation or business logic
 * - Returns raw database results
 */
import Product from "../models/productModel.js";

export default class ProductRepository {
  // -------------------- Find Products with Pagination / Filtering --------------------
  /**
   * Finds products with pagination, filtering, and sorting
   * @param {Object} filter - MongoDB filter object
   * @param {Object} options - Options for pagination, sorting, and random selection
   * @returns {Promise<Array>} Array of product documents
   */
  async findWithPagination(filter, options) {
    // If "random" option is true, return random products using aggregation
    if (options.random) {
      return Product.aggregate([
        { $match: filter }, // Filter documents
        { $sample: { size: options.limit } }, // Randomly select "limit" number of products
      ]);
    }

    // Otherwise, return products with standard pagination and sorting
    return Product.find(filter) // Apply filter
      .sort(options.sort) // Sort by given field(s)
      .skip(options.skip) // Skip a number of documents for pagination
      .limit(options.limit); // Limit the number of results
  }

  // -------------------- Find Product by ID --------------------
  /**
   * Finds a single product by its numeric ID
   * @param {string|number} id - Product ID
   * @returns {Promise<Object|null>} Product document or null if not found
   */
  async findWithID(id) {
    if (!id) return null; // Return null if no ID provided

    const numericId = Number(id); // Convert ID to number
    if (Number.isNaN(numericId)) return null; // Return null if ID is not a valid number

    // Find a single product with the given numeric ID
    return Product.findOne({ id: numericId });
  }
  /**
   * Gets the highest product ID from the database
   * @returns {Promise<number>} The maximum product ID or 0 if no products exist
   */
  async getLastId() {
    const result = await Product.aggregate([
      { $group: { _id: null, maxId: { $max: "$id" } } },
    ]);
    return result.length ? result[0].maxId : 0;
  }

  /**
   * Creates a new product in the database
   * @param {Object} data - Product data to create
   * @returns {Promise<Object>} Created product document
   */
  async create(data) {
    return Product.create(data);
  }

  // -------------------- Update Product --------------------
  /**
   * Updates an existing product with new data
   * @param {Object} existingProduct - The product document to update
   * @param {Object} updatedData - The data to update the product with
   * @returns {Promise<Object>} The updated product document
   */
  async update(existingProduct, updatedData) {
    // Assign new data to existing product
    Object.assign(existingProduct, updatedData);
    // Save and return the updated product
    return await existingProduct.save();
  }

  // -------------------- Delete Product by ID --------------------
  /**
   * Deletes a product by its numeric ID
   * @param {number} id - Product ID to delete
   * @returns {Promise<Object|null>} Deleted product document or null if not found
   */
  async deleteById(id) {
    // Repository is only responsible for database operations
    // Find and delete the product with the given numeric ID
    return Product.findOneAndDelete({ id: id });
  }
}
