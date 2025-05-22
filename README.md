# Form Backend Application with AWS CDK Deployment

This project contains a NestJS API with JWT authentication that can be deployed to AWS Lambda using CDK.

## Project Structure

```
form-be/
├── app/               ← NestJS application code
│   ├── src/
│   ├── tsconfig.json
│   ├── package.json
│   └── ...
└── infra/             ← CDK infrastructure code
    ├── bin/
    │   └── form-be.ts
    └── lib/
        └── nest-stack.ts
```

## Development

### Local Development

To run the NestJS application locally:

```bash
cd app
npm install
npm run start:dev
```

The application will be available at http://localhost:3000.

### Test the API

Use the provided test-auth.http file with a REST client (like VS Code's REST Client extension) to test:

- User registration
- User login
- Access to protected routes

## Deployment

### Build and Deploy

To deploy the application to AWS:

1. Build the NestJS application:
   ```bash
   cd app
   npm install
   npm run build
   ```

2. Deploy using AWS CDK:
   ```bash
   cd ../infra
   npm install
   npm run bootstrap   # Only needed the first time in a new AWS account/region
   npm run deploy
   ```

### AWS Resources Created

The CDK stack creates:
- AWS Lambda function running the NestJS application
- API Gateway to expose the Lambda function
- Appropriate IAM roles and policies

## Environment Variables

- `JWT_SECRET`: Secret key for JWT authentication
- `JWT_EXPIRATION_TIME`: JWT token expiration time (default: 1h)
