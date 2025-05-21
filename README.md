# Form Backend Authentication API

A secure authentication backend built with NestJS, providing JWT-based authentication for the Form frontend application. This backend handles user registration, login, and protected routes with JWT token validation.

## Features

- **User Registration**: Create new user accounts with email and password
- **User Authentication**: Login with credentials and receive JWT tokens
- **Protected Routes**: Access control using JWT authentication
- **Password Security**: Bcrypt hashing for secure password storage
- **CORS Support**: Configured for the frontend application

## Tech Stack

- **NestJS**: Modern, efficient Node.js framework
- **Passport.js**: Authentication middleware
- **JWT**: JSON Web Tokens for stateless authentication
- **Bcrypt**: Password hashing

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

- `POST /auth/login` - Login and receive JWT token
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

### Protected Routes

- `GET /auth/profile` - Get user profile (requires authentication)
  ```
  Headers: Authorization: Bearer <jwt_token>
  ```

## Installation

```bash
# Install dependencies
npm install

# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## Testing

You can test the API using the included `test-auth.http` file with a REST client extension.

## Frontend Integration

This backend is designed to work with the Form frontend application deployed at:

[https://dhpbb0hg9mvh1.cloudfront.net](https://dhpbb0hg9mvh1.cloudfront.net)

## License

MIT
