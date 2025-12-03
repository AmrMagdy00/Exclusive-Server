import mongoose from "mongoose";

// -------------------- Color Sub-Schema --------------------
// This defines a color variant for a product
const colorSchema = new mongoose.Schema(
  {
    color: { type: String, required: true }, // Color name (e.g., "red")
    images: { type: [String] }, // Array of image URLs for this color
    quantity: { type: Number, required: true }, // Stock quantity for this color
  },
  { _id: false } // Disable _id for subdocuments, as it's not needed here
);

// -------------------- Product Schema --------------------
// Main schema for products
const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true }, // Product ID (unique)
    isHook: { type: Boolean }, // Optional field
    title: { type: String, required: true }, // Product title
    price: { type: Number, required: true }, // Original price
    discountPrice: { type: Number }, // Optional discounted price
    ratingCount: { type: Number, required: true }, // Number of ratings
    avgRate: { type: Number, required: true }, // Average rating
    mainImgSRC: { type: String, required: true }, // Main image URL
    description: { type: String, required: true }, // Product description
    category: { type: String, required: true }, // Main category
    subCategory: { type: String, required: true }, // Sub-category
    isFeatured: { type: Boolean }, // Optional: featured product
    isFlash: { type: Boolean }, // Optional: flash sale
    colors: { type: [colorSchema], required: true }, // Array of color variants
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the Product model and specify the collection name as "Products"
const Product = mongoose.model("Product", productSchema, "Products");

export default Product;
