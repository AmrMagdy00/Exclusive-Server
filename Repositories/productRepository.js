// ProductRepository handles direct database operations for products
import Product from "../models/productModel.js";

export default class ProductRepository {
  // -------------------- Find Products with Pagination / Filtering --------------------
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
  async findWithID(id) {
    if (!id) return null; // Return null if no ID provided

    const numericId = Number(id); // Convert ID to number
    if (Number.isNaN(numericId)) return null; // Return null if ID is not a valid number

    // Find a single product with the given numeric ID
    return Product.findOne({ id: numericId });
  }
}
