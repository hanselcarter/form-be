# Express.js Backend with JWT Authentication on AWS Lambda

This project contains an Express.js API with JWT authentication that can be deployed to AWS Lambda using CDK. The application provides user registration, login, and protected routes with token refresh functionality.

**GitHub Repository:** [https://github.com/hanselcarter/form-be](https://github.com/hanselcarter/form-be)

## Project Structure

```
bf-ridley/
├── express-lambda/       ← Express.js application code
│   ├── src/
│   │   ├── models/       ← Data models
│   │   ├── services/     ← Business logic
│   │   ├── middleware/   ← Express middleware
│   │   ├── routes/       ← API routes
│   │   └── index.ts      ← Main application entry point
│   ├── test-auth-local.http ← API test file
│   ├── tsconfig.json
│   ├── package.json
│   └── ...
└── express-infra/        ← CDK infrastructure code
    ├── bin/
    │   └── express-infra.ts
    └── lib/
        └── express-stack.ts
```

## Features

- User registration and login with JWT authentication
- Protected routes requiring valid JWT tokens
- Token refresh mechanism for improved security
- Serverless deployment to AWS Lambda
- API Gateway integration

## Development

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- AWS CLI configured with appropriate credentials
- AWS CDK installed globally (`npm install -g aws-cdk`)

### Local Development

To run the Express.js application locally:

```bash
cd express-lambda
npm install
npm run dev
```

The application will be available at http://localhost:3000.

### Test the API

Use the provided test-auth-local.http file with a REST client (like VS Code's REST Client extension) to test:

- User registration: `POST /auth/register`
- User login: `POST /auth/login`
- Access to protected routes: `GET /auth/profile`
- Token refresh: `POST /auth/refresh`

## Deployment to AWS

### Step 1: AWS Account Setup (First-time only)

If you've never used AWS CDK before, you need to bootstrap your AWS environment:

1. Install AWS CLI and configure it with your credentials:
   ```bash
   # Install AWS CLI (macOS example)
   brew install awscli
   
   # Configure AWS credentials
   aws configure
   # Enter your AWS Access Key ID, Secret Access Key, region (e.g., us-east-1), and output format (json)
   ```

2. Install AWS CDK globally:
   ```bash
   npm install -g aws-cdk
   ```

3. Bootstrap your AWS environment (only needed once per AWS account/region):
   ```bash
   cd express-infra
   cdk bootstrap
   ```

### Step 2: Build the Express.js Application

```bash
cd express-lambda
npm install
npm run build
```

### Step 3: Deploy Using AWS CDK

```bash
cd ../express-infra
npm install
npm run deploy
```

After deployment completes, the CDK will output the API Gateway URL where your application is hosted. It will look something like:
`https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/`

### Connecting with Front-End Applications

**Important:** If you deploy this API yourself, you'll need to update any front-end applications to use your new API Gateway URL. Look for API configuration files in your front-end code and replace the existing API URL with your newly deployed endpoint.

For example, if your front-end is deployed at `https://dhpbb0hg9mvh1.cloudfront.net`, you'll need to update the API base URL in that application to point to your new API Gateway URL.

### Testing the Deployed API

The test-auth-local.http file includes endpoints for both local and production environments. Replace the production URL with your actual deployed API URL if needed.

## AWS Resources Created

The CDK stack creates:
- AWS Lambda function running the Express.js application
- Lambda Layer for dependencies
- API Gateway to expose the Lambda function
- Appropriate IAM roles and policies

## Environment Variables

The following environment variables can be configured:

- `JWT_SECRET`: Secret key for JWT authentication (default: "your-jwt-secret-key")
- `JWT_EXPIRATION_TIME`: Access token expiration time (default: "1h")
- `REFRESH_TOKEN_SECRET`: Secret key for refresh tokens (default: "your-refresh-token-secret-key")
- `REFRESH_TOKEN_EXPIRATION`: Refresh token expiration time (default: "7d")

**Note:** For simplicity, this demo uses hardcoded default values. In a production environment, you should:

1. Use AWS Secrets Manager or Parameter Store to securely store sensitive values
2. Configure these variables in the CDK stack using secure methods
3. Never hardcode secrets in your application code
4. Use different secrets for different environments (dev, staging, production)

## Security Considerations

- The current implementation uses in-memory storage for users and refresh tokens. In a production environment, you should use a database.
- Always use HTTPS in production to protect tokens in transit.
- Consider implementing token revocation for enhanced security.

## Troubleshooting

- **Deployment Timeout**: If deployment times out while pulling the AWS SAM build image, modify the CDK stack to use local bundling instead.
- **CORS Issues**: If you're calling the API from a browser, ensure the client origin is allowed in the CORS configuration.
- **JWT Errors**: Verify that the JWT_SECRET environment variable is correctly set in both environments.
