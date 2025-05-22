import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as ExpressInfra from "../lib/express-infra-stack";

describe("Express Infrastructure Stack", () => {
  let app: cdk.App;
  let stack: ExpressInfra.ExpressInfraStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();
    stack = new ExpressInfra.ExpressInfraStack(app, "ExpressTestStack");
    template = Template.fromStack(stack);
  });

  test("Lambda Function Created", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: "nodejs18.x",
      MemorySize: 512,
      Timeout: 30,
      Environment: {
        Variables: {
          NODE_ENV: "production",
          JWT_SECRET: "your-jwt-secret-key",
          JWT_EXPIRATION_TIME: "1h",
        },
      },
    });
  });

  test("API Gateway Created", () => {
    template.resourceCountIs("AWS::ApiGateway::RestApi", 1);
    template.hasResourceProperties("AWS::ApiGateway::Stage", {
      StageName: "prod",
      MethodSettings: [
        {
          LoggingLevel: "OFF",
          DataTraceEnabled: false,
        },
      ],
    });
  });

  test("API Gateway Method Created", () => {
    template.hasResourceProperties("AWS::ApiGateway::Method", {
      HttpMethod: "ANY",
      AuthorizationType: "NONE",
      Integration: {
        Type: "AWS_PROXY",
      },
    });
  });

  test("CORS Configuration", () => {
    template.hasResourceProperties("AWS::ApiGateway::Method", {
      HttpMethod: "OPTIONS",
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              "method.response.header.Access-Control-Allow-Headers":
                "'Content-Type,Authorization,X-Requested-With'",
              "method.response.header.Access-Control-Allow-Methods":
                "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
              "method.response.header.Access-Control-Allow-Origin": "'*'",
            },
          },
        ],
      },
    });
  });

  test("Output Created", () => {
    template.hasOutput("ApiUrl", {
      Description: "URL of the API Gateway endpoint",
      Export: {
        Name: "ExpressApiUrl",
      },
    });
  });
});
