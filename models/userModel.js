/**
 * @file userModel.js
 * @description
 * Defines the User schema and model for MongoDB using Mongoose.
 *
 * Responsibilities:
 * Defines User fields (fullName, email, password, role) with validation rules.
 * 2. Adds timestamps for createdAt and updatedAt.
 * 3. Pre-save middleware to hash passwords before saving.
 * 4. Instance method to compare a plain password with the hashed password.
 *
 * Field Details:
 * - fullName: required, string (3-50 chars), trimmed.
 * - email: required, unique, lowercase, trimmed, validated as a proper email (English only).
 * - password: required, minimum length 6, hashed before saving.
 * - role: optional, enum (user/admin), defaults to 'user'.
 *
 * Middleware:
 * - pre("save"): hashes password if modified or new.
 *
 * Instance Methods:
 * - comparePassword(candidatePassword): compares given password with stored hashed password.
 *
 * @dependencies
 * - mongoose: MongoDB ODM for schema/model creation.
 * - validator: Validates email format.
 * - bcrypt: Hashing and comparing passwords.
 *
 * @example
 * import User from './models/userModel.js';
 * const user = new User({ email: 'test@example.com', password: 'secret123' });
 * await user.save();
 * const isMatch = await user.comparePassword('secret123');
 */

import mongoose from "mongoose";
import validator from "validator"; // Library to validate strings like emails
import bcrypt from "bcrypt"; // Library to hash passwords
import ROLES from "../constants/roles.js";

// -------------------- User Schema Definition --------------------
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name Is Required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },
    // Email field
    email: {
      type: String,
      required: [true, "Email is required"], // Make email mandatory
      unique: true, // Ensure no two users have the same email
      lowercase: true, // Convert email to lowercase before saving
      trim: true, // Remove whitespace from both ends
      validate: [
        {
          validator: validator.isEmail,
          message: "Please enter a valid email",
        },
        {
          validator: function (value) {
            return /^[\x00-\x7F]+$/.test(value);
          },
          message: "Email must not contain Arabic or non-ASCII characters",
        },
      ],
    },
    // Password field
    password: {
      type: String,
      required: true, // Make password mandatory
      minlength: [6, "Password must be at least 6 characters"], // Minimum length validation
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
  },

  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// -------------------- Middleware: Pre-save --------------------
// Runs before saving a document
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  // Hash the password with bcrypt
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// -------------------- Instance Method: Compare Password --------------------
// Method to compare a given password with the hashed password in DB
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model based on the schema
export default mongoose.model("User", userSchema);
