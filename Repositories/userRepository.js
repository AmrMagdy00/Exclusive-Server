/**
 * @file userRepository.js
 * @description
 * Repository class to handle direct database operations for the User model.
 *
 * Responsibilities:
 * 1. Interacts with the User model to perform database CRUD operations.
 * 2. Provides methods for finding and creating users.
 * 3. Ensures that business logic (like password hashing) is delegated to the User model.
 *
 * Methods:
 * - async findByEmail(email)
 *   - Searches the database for a user with the given email.
 *   - Includes password field (select +password for comparisons).
 *   - Returns the user document if found, otherwise returns null.
 *
 * - async create(userData)
 *   - Creates a new User document with the provided data (fullName, email, password).
 *   - Saves the user to the database.
 *   - Relies on User model pre-save middleware to hash the password.
 *   - Returns the saved user document.
 *
 * @dependencies
 * - User model: Mongoose model representing the User collection.
 *
 * Usage:
 * import UserRepository from './Repositories/userRepository.js';
 * const userRepository = new UserRepository();
 * const user = await userRepository.create({ fullName: 'John Doe', email: 'test@example.com', password: 'secret123' });
 * const foundUser = await userRepository.findByEmail('test@example.com');
 */

import User from "../models/userModel.js";

// UserRepository handles direct database operations for the User model

export default class UserRepository {
  // -------------------- Find user by email --------------------
  async findByEmail(email) {
    // Search the database for a user with the given email
    return User.findOne({ email }).select("+password");
  }

  // -------------------- Create new user --------------------
  async create(userData) {
    // Create a new User instance using the provided data
    const user = new User(userData);

    // Save the user to the database
    // The pre-save middleware in the User model will hash the password
    return user.save();
  }
}
