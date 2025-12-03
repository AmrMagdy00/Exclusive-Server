# 🛍️ Exclusive Server

A robust and scalable RESTful API server built with Node.js and Express.js for an e-commerce platform. This server handles product management and user authentication with a clean architecture following best practices.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Server](#running-the-server)
- [API Endpoints](#-api-endpoints)
- [Authentication & Authorization](#-authentication--authorization)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Logging](#-logging)
- [Error Handling](#-error-handling)

---

## ✨ Features

- 🔐 **User Authentication**: Secure registration and login with JWT tokens and password hashing
- 🔒 **Role-Based Authorization**: Admin and user roles with protected routes
- 📦 **Product Management**: Full CRUD operations (Create, Read, Update, Delete) for products
- 🔍 **Advanced Filtering**: Filter products by category, price range, featured status, and more
- 📄 **Pagination & Sorting**: Efficient data retrieval with customizable pagination and sorting
- 🎨 **Product Variants**: Support for multiple colors and images per product
- 📊 **Structured Logging**: Daily rotating log files using Winston
- 🏗️ **Clean Architecture**: Repository, Service, and Controller layers for maintainability
- 🛡️ **Error Handling**: Centralized error handling with custom error classes (ApiError/ApiSuccess)
- ✅ **Input Validation**: Comprehensive validation using custom validators
- 🧪 **Testing**: Jest configured for unit and integration tests
- 🔄 **CORS Enabled**: Cross-origin resource sharing for frontend integration

---

## 🏗️ Architecture

This project follows a **layered architecture** pattern:

```
Request → Routes → Controllers → Services → Repositories → Database
```

### Layer Responsibilities:

- **Routes**: Define API endpoints, HTTP methods, and middleware (authentication, authorization)
- **Controllers**: Handle HTTP requests/responses only (no business logic)
- **Services**: Contain business logic, validation, error handling, and response formatting
- **Repositories**: Handle database operations only (CRUD - no validation or business logic)
- **Models**: Define data schemas and validation rules using Mongoose
- **Middleware**: Authentication (JWT verification) and authorization (role-based access control)
- **Validators**: Input validation and data sanitization

This separation ensures:
- ✅ Easy testing and mocking
- ✅ Code reusability
- ✅ Clear separation of concerns
- ✅ Maintainability and scalability

---

## 🛠️ Tech Stack

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.1.0 | Web framework |
| `mongoose` | ^8.19.1 | MongoDB ODM |
| `bcrypt` | ^6.0.0 | Password hashing |
| `jsonwebtoken` | ^9.0.2 | JWT token generation and verification |
| `cookie-parser` | ^1.4.7 | Parse HTTP cookies |
| `cors` | ^2.8.5 | Cross-origin resource sharing |
| `winston` | ^3.18.3 | Logging library |
| `winston-daily-rotate-file` | ^5.0.0 | Daily log file rotation |
| `validator` | ^13.15.15 | Input validation |
| `dotenv` | ^17.2.3 | Environment variables |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `nodemon` | ^3.1.10 | Auto-restart on file changes |
| `jest` | ^30.2.0 | Testing framework |
| `supertest` | ^7.1.4 | HTTP assertion library |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local instance or MongoDB Atlas account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Exclusive-Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Configuration

1. **Create a `.env` file** in the root directory:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/exclusive-db
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

2. **Important**: Replace `your-secret-key-here` with a strong, random secret key for JWT token signing.

3. **Customize environment variables** as needed for your setup.

### Running the Server

**Development mode** (with auto-reload):
```bash
npm start
```

The server will start on `http://localhost:4000` (or the port specified in `.env`).

---

## 📡 API Endpoints

### Authentication Endpoints

#### Register a New User
```http
POST /users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "user"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "statusCode": 201,
  "data": {
    "userId": "..."
  },
  "successCode": "USER_CREATED",
  "isSuccess": true
}
```

#### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User logged in successfully",
  "statusCode": 200,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user"
    }
  },
  "successCode": "USER_LOGIN",
  "isSuccess": true
}
```

**Note**: JWT token is automatically stored in an HTTP-only cookie for security.

### Product Endpoints

#### Get All Products (Public)
```http
GET /products?page=1&limit=10&sort=price&category=electronics
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (e.g., `price`, `-price` for descending)
- `category`: Filter by category
- `subCategory`: Filter by sub-category
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `isFeatured`: Filter featured products (true/false)
- `isFlash`: Filter flash sale products (true/false)
- `random`: Return random products (true/false)

**Response:**
```json
{
  "message": "Products fetched successfully",
  "statusCode": 200,
  "data": [...],
  "successCode": "PRODUCTS_FETCHED",
  "isSuccess": true
}
```

#### Get Product by ID (Public)
```http
GET /products/:id
```

**Response:**
```json
{
  "message": "Product fetched successfully",
  "statusCode": 200,
  "data": {
    "id": 1,
    "title": "Product Name",
    "price": 99.99,
    "discountPrice": 79.99,
    "ratingCount": 150,
    "avgRate": 4.5,
    "mainImgSRC": "https://...",
    "description": "Product description...",
    "category": "electronics",
    "subCategory": "phones",
    "colors": [
      {
        "color": "red",
        "images": ["url1", "url2"],
        "quantity": 10
      }
    ]
  },
  "successCode": "PRODUCT_FETCHED",
  "isSuccess": true
}
```

#### Create Product (Admin Only)
```http
POST /products/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Product",
  "price": 99.99,
  "discountPrice": 79.99,
  "ratingCount": 0,
  "avgRate": 0,
  "mainImgSRC": "https://...",
  "description": "Product description...",
  "category": "electronics",
  "subCategory": "phones",
  "colors": [
    {
      "color": "red",
      "images": ["url1"],
      "quantity": 10
    }
  ]
}
```

**Response:**
```json
{
  "message": "Product created successfully",
  "statusCode": 201,
  "data": { ... },
  "successCode": "PRODUCT_CREATED",
  "isSuccess": true
}
```

#### Update Product (Admin Only)
```http
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Product Name",
  "price": 89.99
}
```

**Response:**
```json
{
  "message": "Product updated successfully",
  "statusCode": 200,
  "data": { ... },
  "successCode": "PRODUCT_UPDATED",
  "isSuccess": true
}
```

#### Delete Product (Admin Only)
```http
DELETE /products/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Product deleted successfully",
  "statusCode": 200,
  "data": { ... },
  "successCode": "PRODUCT_DELETED",
  "isSuccess": true
}
```

**Note**: Admin-only endpoints require JWT authentication and admin role.

---

## 📁 Project Structure

```
Exclusive-Server/
├── config/
│   ├── cors.js              # CORS configuration
│   ├── db.js                 # MongoDB connection configuration
│   └── jwt.js                # JWT configuration
├── constants/
│   └── roles.js              # User roles definitions
├── controllers/
│   ├── authController.js      # Authentication request handlers
│   └── productController.js  # Product request handlers
├── middleware/
│   ├── auth/
│   │   ├── authorizeRole.js  # Role-based authorization middleware
│   │   └── verifyToken.js    # JWT token verification middleware
│   └── logger/
│       └── logger.js          # Winston logger configuration
├── models/
│   ├── productModel.js       # Product schema and model
│   └── userModel.js          # User schema and model
├── Repositories/
│   ├── productRepository.js  # Product database operations
│   └── userRepository.js     # User database operations
├── routes/
│   ├── authRouter.js         # Authentication route definitions
│   └── productRouter.js      # Product route definitions
├── services/
│   ├── auth/
│   │   ├── authService.js    # Authentication business logic
│   │   └── tokenService.js   # JWT token generation service
│   └── productService.js     # Product business logic
├── tests/
│   └── buildQueryOptions.test.js  # Test files
├── utils/
│   ├── ApiError.js           # Custom error class
│   ├── ApiSuccess.js          # Success response helper
│   └── builder.js             # Query builder utilities
├── validators/
│   ├── authValidator.js      # Authentication input validation
│   └── productValidator.js   # Product input validation
├── logs/                     # Generated log files (not committed)
├── app.js                    # Express app configuration
├── server.js                 # Application entry point
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

---

## 🧪 Testing

Run tests with:
```bash
npm test
```

The project uses **Jest** for testing with ES modules support. Tests are located in the `tests/` directory.

---

## 📝 Logging

The application uses **Winston** for structured logging:

- **Console Logging**: All logs are printed to console
- **File Logging**: Logs are saved to daily rotating files in `logs/`
  - Combined logs: `YYYY-MM-DD-combined.log`
  - Error logs: `error.log`

**Log Levels:**
- `info`: General information (requests, server events)
- `error`: Error messages and exceptions

---

## 🔐 Authentication & Authorization

The server uses JWT (JSON Web Tokens) for authentication:

- **Token Storage**: Tokens are stored in HTTP-only cookies for security
- **Token Expiration**: Tokens expire after 7 days
- **Role-Based Access**: Two roles are supported:
  - `user`: Standard user access
  - `admin`: Full access including product management (create, update, delete)

### Protected Routes

Admin-only routes require:
1. Valid JWT token (via `verifyToken` middleware)
2. Admin role (via `authorizeRole` middleware)

Protected endpoints:
- `POST /products/create` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

---

## ⚠️ Error Handling

The server implements a centralized error handling system using `ApiError` and `ApiSuccess`:

1. **Operational Errors**: Expected errors with status codes and messages
   ```json
   {
     "message": "Product not found",
     "statusCode": 404,
     "errorCode": "PRODUCT_NOT_FOUND",
     "details": null
   }
   ```

2. **Success Responses**: Structured success responses
   ```json
   {
     "message": "Product fetched successfully",
     "statusCode": 200,
     "data": {...},
     "successCode": "PRODUCT_FETCHED",
     "isSuccess": true
   }
   ```

3. **Common Error Codes**:
   - `MISSING_PRODUCT_ID` - Product ID not provided
   - `INVALID_PRODUCT_ID` - Invalid product ID format
   - `PRODUCT_NOT_FOUND` - Product doesn't exist
   - `MISSING_PRODUCT_DATA` - Required product data missing
   - `EMAIL_EXISTS` - Email already registered
   - `USER_NOT_FOUND` - User doesn't exist
   - `INVALID_PASSWORD` - Incorrect password

---

## 📄 License

ISC

---

## 👥 Author

Built with ❤️ for the Exclusive e-commerce platform.

---

**Happy Coding! 🚀**
