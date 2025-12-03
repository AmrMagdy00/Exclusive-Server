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
   * Handles POST /users/login
   *
   * Flow:
   * 1. Extracts email and password from req.body.
   * 2. Calls authService.login(email, password).
   * 3. Returns structured JSON response with success status and data.
   * 4. If an error occurs, forwards it to the global error handler using `next(err)`.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      return res.status(result.statusCode).json(result);
    } catch (err) {
      next(err);
    }
  }

  // -------------------- Register Handler --------------------
  /**
   * Handles POST /users/Register
   *
   * Flow:
   * 1. Extracts email and password from req.body.
   * 2. Calls authService.Register(email, password).
   * 3. Returns structured JSON response with success status and data.
   * 4. If an error occurs, forwards it to the global error handler using `next(err)`.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async register(req, res, next) {
    try {
      const result = await this.authService.register(req.body);

      return res.status(result.statusCode).json(result);
    } catch (err) {
      next(err);
    }
  }
}
