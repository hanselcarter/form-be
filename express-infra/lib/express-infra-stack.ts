import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Architecture } from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class ExpressInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Calculate absolute paths
    const projectRoot = path.join(__dirname, '../..');
    const expressLambdaDir = path.join(projectRoot, 'express-lambda');
    const lambdaEntryPath = path.join(expressLambdaDir, 'src/index.ts');
    const tsconfigPath = path.join(expressLambdaDir, 'tsconfig.json');
    const packageLockPath = path.join(expressLambdaDir, 'package-lock.json');
    
    // Log paths for debugging
    console.log('Project root:', projectRoot);
    console.log('Express Lambda dir:', expressLambdaDir);
    console.log('Lambda entry path:', lambdaEntryPath);
    console.log('tsconfig path:', tsconfigPath);
    
    // Create the Lambda function
    const expressFn = new NodejsFunction(this, 'ExpressApi', {
      entry: lambdaEntryPath,
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 512,
      timeout: Duration.seconds(30),
      architecture: Architecture.X86_64,
      depsLockFilePath: packageLockPath, // Important! Tells CDK where to find dependencies
      environment: {
        NODE_ENV: 'production',
        JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret-key',
        JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || '1h'
      },
      bundling: {
        externalModules: ['aws-sdk'],
        nodeModules: ['express', '@vendia/serverless-express'], // Include these node modules in the bundle
        forceDockerBundling: false, // Try local bundling first
      },
    });

    // Create an API Gateway REST API
    const api = new apigateway.LambdaRestApi(this, 'ExpressApiGateway', {
      handler: expressFn,
      proxy: true, // Use Lambda Proxy integration
      // Configure CORS for the API Gateway
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      },
      // Set deployment options with logging disabled
      deployOptions: {
        stageName: 'prod',
        // Disable logging to avoid the CloudWatch Logs role error
        loggingLevel: apigateway.MethodLoggingLevel.OFF,
        dataTraceEnabled: false
      }
    });

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'URL of the API Gateway endpoint',
      exportName: 'ExpressApiUrl'
    });
  }
}
