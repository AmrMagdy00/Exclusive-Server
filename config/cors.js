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
    "http://localhost:4173", // Vite preview port
    "http://127.0.0.1:3000", // Localhost alternative notation
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:4173",
    "http://197.120.222.153:5173", // Friend's IP with Vite dev server
    "http://197.120.222.153:4173", // Friend's IP with Vite preview
    "http://197.120.222.153:3000", // Friend's IP with React dev server
    "http://197.120.222.153:3001", // Friend's IP alternative port
  ],
  staging: ["https://staging.example.com", "https://stage.example.com"],
  production: [
    "https://example.com", // Main production domain
    "https://www.example.com", // www subdomain
    // Add more production domains as needed
  ],
};

// -------------------- CORS Options Configuration --------------------
/**
 * Configure CORS options to allow any domain
 * This configuration enables CORS for all origins (any domain)
 * @type {import('cors').CorsOptions}
 */
export const corsOptions = {
  // Allow any origin (any domain) - enables CORS for all domains
  // This makes the API accessible from any domain (development & production)
  origin: "*",

  // Allow these HTTP methods in cross-origin requests
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  // Allow these headers in cross-origin requests
  allowedHeaders: [
    "Content-Type", // JSON/form data content type
    "Authorization", // Bearer tokens or Basic auth
    "X-Requested-With", // AJAX requests identification
  ],

  // Note: credentials cannot be true when origin is "*"
  // If you need credentials, use origin: true or a function that returns the origin
  credentials: false,

  // Preflight request caching time (in seconds)
  // Browsers cache preflight responses to reduce OPTIONS requests
  maxAge: 3600, // 1 hour in seconds
};

/**
 * Alternative: CORS configuration with credentials support
 * Allows any origin but enables credentials (cookies, auth headers)
 * Use this if you need to send cookies/auth headers from any domain
 *
 * @type {import('cors').CorsOptions}
 */
export const corsOptionsWithCredentials = {
  // Use a function to allow any origin while supporting credentials
  origin: (origin, callback) => {
    // Allow any origin
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true, // Enable credentials when using origin function
  maxAge: 3600,
};

export default corsOptions;
