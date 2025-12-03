/**
 * @file authService.js
 * @description
 * Service class to handle business logic related to users, such as Register and login.
 *
 * Responsibilities:
 * 1. Interacts with userRepository to perform data operations.
 * 2. Implements Register and login logic including validation and password checks.
 * 3. Returns structured success or error responses for controllers using ApiSuccess / ApiError.
 *
 * Methods:
 * - async register({ email, password, fullName })
 *    - Validates email format (English only)
 *    - Checks if email already exists
 *    - Creates a new user with fullName
 *    - Returns ApiSuccess with userId
 *
 * - async login({ email, password })
 *    - Finds user by email
 *    - Compares password with hashed password
 *    - Generates JWT token via TokenService
 *    - Returns ApiSuccess with token and user payload (id, email, fullName, role)
 *
 * @dependencies
 * - userRepository: Repository object for accessing user data
 * - ApiError: Custom error class for operational errors
 * - ApiSuccess: Custom success class for structured responses
 * - logger: Custom logger for logging messages
 *
 * Usage:
 * import UserService from './services/userService.js';
 * const userService = new UserService(userRepository);
 *
 * Example:
 * const result = await userService.signup('test@example.com', 'password123');
 * console.log(result);
 * // Returns ApiSuccess:
 * // {
 * //   message: "User created successfully",
 * //   statusCode: 201,
 * //   data: { userId: "..." },
 * //   successCode: "USER_CREATED"
 * // }
 */

import logger from "../../middleware/logger/logger.js";
import ApiError from "../../utils/ApiError.js";
import ApiSuccess from "../../utils/ApiSuccess.js";
import { validateEmail } from "../../validators/authValidator.js";
import TokenService from "./tokenService.js";

export default class AuthService {
  constructor(userRepository) {
    /**
     * Repository instance for user data access
     * @type {UserRepository}
     */
    this.userRepository = userRepository;
    this.tokenService = new TokenService();
  }

  // -------------------- Register --------------------
  /**
   * Register  a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {ApiSuccess} Structured success response
   * @throws {ApiError} If email contains non-English characters or already exists
   */
  async register({ email, password, fullName, role }) {
    // Validate that email contains only English characters
    validateEmail(email);
    // Check if the email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError({
        message: "Email already exists",
        statusCode: 400,
        errorCode: "EMAIL_EXISTS",
      });
    }

    // Create the new user
    const user = await this.userRepository.create({
      email,
      password,
      fullName,
      role,
    });

    // Log successful creation
    logger.log("User has been created successfully:", email);

    // Return structured success response
    return new ApiSuccess({
      message: "User created successfully",
      statusCode: 201,
      data: { userId: user._id },
      successCode: "USER_CREATED",
    });
  }

  // -------------------- Login --------------------
  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {ApiSuccess} Structured success response
   * @throws {ApiError} If user not found or password is invalid
   */
  async login({ email, password }) {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError({
        message: "User not found",
        statusCode: 404,
        errorCode: "USER_NOT_FOUND",
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError({
        message: "Invalid password",
        statusCode: 401,
        errorCode: "INVALID_PASSWORD",
      });
    }

    // Generate JWT token
    const payload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    const token = this.tokenService.generateToken(payload);

    // Return structured success response
    return new ApiSuccess({
      message: "User logged in successfully",
      statusCode: 200,
      data: { token: token, user: payload },
      successCode: "USER_LOGIN",
    });
  }
}
