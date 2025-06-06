# Express.js JWT Authentication API

This Express.js application provides a complete JWT authentication system with user registration, login, and protected routes. It's designed to be deployed to AWS Lambda using the companion CDK infrastructure.

**GitHub Repository:** [https://github.com/hanselcarter/form-be](https://github.com/hanselcarter/form-be)

## Features

- User registration and login
- JWT authentication with access tokens
- Refresh token mechanism
- Protected routes
- Serverless-ready with AWS Lambda handler

## Project Structure

```
express-lambda/
├── src/
│   ├── models/       # Data models
│   │   └── user.model.ts
│   ├── services/     # Business logic
│   │   ├── auth.service.ts
│   │   └── users.service.ts
│   ├── middleware/   # Express middleware
│   │   └── auth.middleware.ts
│   ├── routes/       # API routes
│   │   └── auth.routes.ts
│   └── index.ts      # Main application entry point
├── test-auth-local.http  # API test file
├── tsconfig.json
├── package.json
└── ...
```

## API Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate and get tokens
- `GET /auth/profile` - Get user profile (protected)
- `POST /auth/refresh` - Refresh access token
- `GET /health` - Health check endpoint
- `GET /ping` - Simple ping endpoint
- `GET /` - Root endpoint

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. The server will be available at http://localhost:3000

## Testing

Use the provided `test-auth-local.http` file with a REST client (like VS Code's REST Client extension) to test the API endpoints.

## Building for Production

```bash
npm run build
```

This will compile the TypeScript code to JavaScript in the `dist` directory.

## Connecting with Front-End Applications

**Important:** When deploying this API to AWS Lambda, you'll receive a unique API Gateway URL. Any front-end applications that need to communicate with this API must be updated to use this new URL.

If you're using a front-end deployed at a domain like `https://dhpbb0hg9mvh1.cloudfront.net`, you'll need to update the API base URL configuration in that application to point to your deployed API Gateway endpoint.

The CORS configuration in this API allows requests from all origins, so you shouldn't encounter any cross-origin issues when connecting from your front-end application.

## Environment Variables

- `JWT_SECRET` - Secret key for JWT authentication (default: "your-jwt-secret-key")
- `JWT_EXPIRATION_TIME` - Access token expiration time (default: "1h")
- `REFRESH_TOKEN_SECRET` - Secret key for refresh tokens (default: "your-refresh-token-secret-key")
- `REFRESH_TOKEN_EXPIRATION` - Refresh token expiration time (default: "7d")
- `PORT` - Port for local development (default: 3000)

**Note:** This implementation uses hardcoded default values for simplicity. In a production environment, you should:

1. Use AWS Secrets Manager or Parameter Store for sensitive values
2. Set up proper environment variable handling with dotenv or similar tools
3. Never commit secrets to your repository
4. Consider using a configuration service for managing environment-specific settings

## Security Notes

- The current implementation uses in-memory storage for users and refresh tokens
- In a production environment, you should replace this with a database
- Always use HTTPS in production to protect tokens in transit
