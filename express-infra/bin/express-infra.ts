#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ExpressInfraStack } from '../lib/express-infra-stack';

const app = new cdk.App();
new ExpressInfraStack(app, 'ExpressBeStack', {
  // Use the environment from the current CLI configuration
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  
  // Add description and tags for better organization
  description: 'Express.js backend deployed to AWS Lambda with API Gateway',
  tags: {
    'Project': 'ExpressJS-BE',
    'Environment': 'Production'
  }
});