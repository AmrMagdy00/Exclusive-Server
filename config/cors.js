/**
 * @file cors.js
 * @description
 * CORS (Cross-Origin Resource Sharing) configuration for the Express server.
 *
 * Responsibilities:
 * 1. Define allowed origins (domains that can access this API).
 * 2. Specify allowed HTTP methods.
 * 3. Define allowed request headers.
 * 4. Configure whether credentials (cookies, auth headers) are allowed.
 * 5. Handle preflight requests properly.
 *
 * Security Considerations:
 * - In development: Allow localhost and 127.0.0.1 for testing.
 * - In production: Only allow specific frontend domains.
 * - Always validate origins against a whitelist.
 * - Credentials (cookies/auth) should only be allowed for trusted origins.
 *
 * CORS Headers Explained:
 * - Access-Control-Allow-Origin: Which domains can access this API.
 * - Access-Control-Allow-Methods: Which HTTP methods are permitted (GET, POST, etc.).
 * - Access-Control-Allow-Headers: Which custom headers are allowed in requests.
 * - Access-Control-Allow-Credentials: Whether to allow cookies/auth headers.
 *
 * @usage
 * import { corsOptions } from './config/cors.js';
 * app.use(cors(corsOptions));
 *
 * @environment
 * - NODE_ENV: Set to 'production', 'staging', or 'development'
 * - ALLOWED_ORIGINS: Comma-separated list of allowed domains (for production)
 *
 * @example
 * Development (allows all localhost origins):
 *   http://localhost:3000
 *   http://127.0.0.1:3000
 *
 * Production (only specified domains):
 *   https://example.com
 *   https://www.example.com
 */

// -------------------- Allowed Origins Definition --------------------
// Define which origins (domains) are allowed to make requests to this API
const allowedOrigins = {
  development: [
    "http://localhost:3000", // React/Next.js dev server (common port)
    "http://localhost:3001", // Alternative frontend port
    "http://localhost:5173", // Vite dev server default port
    "http://127.0.0.1:3000", // Localhost alternative notation
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173",
  ],
  staging: [
    "https://staging.example.com",
    "https://stage.example.com",
  ],
  production: [
    "https://example.com", // Main production domain
    "https://www.example.com", // www subdomain
    // Add more production domains as needed
  ],
};

// -------------------- CORS Options Configuration --------------------
/**
 * Configure CORS options based on environment
 * @type {import('cors').CorsOptions}
 */
export const corsOptions = {
  // Define allowed origins dynamically based on environment
  origin: function (origin, callback) {
    const env = process.env.NODE_ENV || "development";
    const origins = allowedOrigins[env] || allowedOrigins.development;

    // Allow requests with no origin (like mobile apps, curl requests, or same-origin requests)
    if (!origin) {
      return callback(null, true);
    }

    // Check if the requesting origin is in the whitelist
    if (origins.includes(origin)) {
      callback(null, true);
    } else {
      // Origin not allowed - reject the request
      callback(new Error(`CORS policy: Origin '${origin}' is not allowed`));
    }
  },

  // Allow these HTTP methods in cross-origin requests
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  // Allow these headers in cross-origin requests
  allowedHeaders: [
    "Content-Type", // JSON/form data content type
    "Authorization", // Bearer tokens or Basic auth
    "X-Requested-With", // AJAX requests identification
  ],

  // Allow credentials (cookies, authorization headers) to be included in cross-origin requests
  // Important: This requires specific origin to be specified, not '*'
  credentials: true,

  // Preflight request caching time (in seconds)
  // Browsers cache preflight responses to reduce OPTIONS requests
  maxAge: 3600, // 1 hour in seconds
};

/**
 * Alternative: Simple CORS configuration for development/testing
 * Allows all origins without validation
 * Warning: Never use in production!
 *
 * @type {import('cors').CorsOptions}
 */
export const corsOptionsOpen = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // Cannot use credentials with '*' origin
};

export default corsOptions;
