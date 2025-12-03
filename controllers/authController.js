/**
 * @file authController.js
 * @description
 * Controller class to handle HTTP requests for user-related actions (Register, login).
 *
 * Responsibilities:
 * 1. Receives HTTP requests and interacts with the authController for business logic.
 * 2. Handles login and Register requests.
 * 3. Sends structured JSON responses with appropriate HTTP status codes.
 * 4. Delegates errors to the global error handler using `next(err)`.
 *
 * @dependencies
 * - authController: Service object that contains Register and login logic.
 *
 * Usage:
 * import authController from './controllers/authController.js';
 * const authController = new authController(authService);
 *
 * Example with Router:
 * import authController from './routes/authController.js';
 * app.use('/users', createUserRouter(authController));
 */
export default class authController {
  /**
   * @param {object} authService - Instance of authService injected via dependency injection
   */
  constructor(authService) {
    this.authService = authService;
  }

  // -------------------- Login Handler --------------------
  /**
   * Handles POST /users/login requests
   *
   * Flow:
   * 1. Extracts email and password from request body.
   * 2. Validates credentials through authService.
   * 3. Generates JWT token and stores in HTTP-only cookie.
   * 4. Returns success response with user data (token excluded from response body for security).
   * 5. If an error occurs, forwards it to the global error handler.
   *
   * Security measures:
   * - httpOnly: Prevents JavaScript access to token (XSS protection).
   * - secure: Cookie only sent over HTTPS in production.
   * - sameSite: Prevents CSRF attacks.
   * - maxAge: Token expires after 7 days.
   *
   * @param {import('express').Request} req - Express request with email/password in body
   * @param {import('express').Response} res - Express response object
   * @param {import('express').NextFunction} next - Express next function for error handling
   */
  async login(req, res, next) {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;

      // Call authService to verify credentials and generate token
      const result = await this.authService.login({ email, password });

      // Extract token from response (should not be sent in JSON response body)
      const token = result.data.token;

      // Remove token from response body for security (it's in cookie already)
      delete result.data.token;

      // Configure secure cookie options
      const cookieOptions = {
        httpOnly: true, // Accessible only by web server, not JavaScript (XSS protection)
        // In production we require HTTPS; during development (localhost) secure=false
        secure: process.env.NODE_ENV === "production",
        // Allow cross-site cookies so browsers send cookies for requests from other origins.
        // Note: Browsers require `secure: true` when `sameSite: 'none'`.
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // Expire after 7 days (in milliseconds)
      };

      // Store token in HTTP-only cookie for subsequent requests
      res.cookie("token", token, cookieOptions);

      // Return response with user data (token stored securely in cookie)
      return res.status(result.statusCode).json(result);
    } catch (err) {
      // Forward authentication errors to global error handler
      next(err);
    }
  }

  // -------------------- Register Handler --------------------
  /**
   * Handles POST /users/register requests
   *
   * Flow:
   * 1. Extracts fullName, email, and password from request body.
   * 2. Validates input and checks email uniqueness through authService.
   * 3. Creates new user account in database with fullName.
   * 4. Returns success response with new user ID.
   * 5. If an error occurs (invalid email, duplicate email, etc.), forwards it to global error handler.
   *
   * Validations performed:
   * - Full name must be 3-50 characters.
   * - Email must contain only English characters.
   * - Email must be valid format.
   * - Email must not already exist in database.
   * - Password must be at least 6 characters.
   *
   * @param {import('express').Request} req - Express request with fullName/email/password in body
   * @param {import('express').Response} res - Express response object
   * @param {import('express').NextFunction} next - Express next function for error handling
   */
  async register(req, res, next) {
    try {
      // Extract fullName, email, and password from request body
      const { email, password, fullName, role } = req.body;

      // Call authService to validate and register new user
      const result = await this.authService.register({
        email,
        password,
        fullName,
        role,
      });

      // Return success response with newly created user ID
      return res.status(result.statusCode).json(result);
    } catch (err) {
      // Forward registration errors to global error handler
      next(err);
    }
  }
}
