import mongoose from "mongoose";
import validator from "validator";

// -------------------- Color Sub-Schema --------------------
const colorSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
      minlength: [1, "Color cannot be empty"],
    },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.every((url) => typeof url === "string"),
        message: "Images must be an array of strings",
      },
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
  },
  { _id: false }
);

// -------------------- Product Schema --------------------
const productSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },

    isHook: { type: Boolean },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [7, "Title must be at least 7 characters"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be more than 0"],
    },

    discountPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          // Only validate if discount exists
          return !value || value < this.price;
        },
        message: "Discount price must be lower than price",
      },
    },

    ratingCount: {
      type: Number,
      required: [true, "Rating count is required"],
      min: [0, "Rating count cannot be negative"],
    },

    avgRate: {
      type: Number,
      required: [true, "Average rating is required"],
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },

    mainImgSRC: {
      type: String,
      required: [true, "Main image is required"],
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Main image must be a valid URL",
      },
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    subCategory: {
      type: String,
      required: [true, "Sub-category is required"],
      trim: true,
    },

    isFeatured: { type: Boolean },

    isFlash: { type: Boolean },

    colors: {
      type: [colorSchema],
      required: [true, "Colors are required"],
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one color is required",
      },
    },
  },
  { timestamps: true }
);

// Create the Product model and specify the collection name as "Products"
const Product = mongoose.model("Product", productSchema, "Products");

export default Product;
