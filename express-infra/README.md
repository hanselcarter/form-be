# Express.js API AWS CDK Infrastructure

This project contains the AWS CDK infrastructure code to deploy the Express.js JWT Authentication API to AWS Lambda with API Gateway.

## Architecture

This CDK stack creates the following AWS resources:

- **AWS Lambda Function**: Runs the Express.js application
- **Lambda Layer**: Contains the application dependencies
- **API Gateway**: HTTP API that routes requests to the Lambda function
- **IAM Roles and Policies**: Necessary permissions for the Lambda function

## Prerequisites

- AWS CLI installed and configured with appropriate credentials
- AWS CDK installed globally (`npm install -g aws-cdk`)
- Node.js 18.x or later

## Deployment Steps

### First-time Setup

If you've never used AWS CDK in your AWS account/region, you need to bootstrap it first:

```bash
cdk bootstrap
```

### Deploy the Stack

1. Make sure the Express.js application is built first:
   ```bash
   cd ../express-lambda
   npm run build
   ```

2. Deploy the CDK stack:
   ```bash
   cd ../express-infra
   npm run build
   npm run deploy
   ```

3. After deployment completes, the CDK will output the API Gateway URL where your application is hosted.

## Environment Variables

The following environment variables are set in the Lambda function:

- `JWT_SECRET`: Secret key for JWT authentication
- `JWT_EXPIRATION_TIME`: Access token expiration time
- `REFRESH_TOKEN_SECRET`: Secret key for refresh tokens
- `REFRESH_TOKEN_EXPIRATION`: Refresh token expiration time

You can modify these values in the CDK stack.

## Troubleshooting

- If deployment times out while pulling the AWS SAM build image, the stack is configured to use local bundling instead.
- For debugging deployment issues, check the CloudFormation console in the AWS Management Console.

## Useful Commands

* `npm run build`   Compile TypeScript to JavaScript
* `npm run watch`   Watch for changes and compile
* `npm run test`    Perform Jest unit tests
* `npm run deploy`  Deploy this stack to your default AWS account/region
* `npx cdk diff`    Compare deployed stack with current state
* `npx cdk synth`   Emit the synthesized CloudFormation template
