import * as cdk from 'aws-cdk-lib';
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class StaticResourcesS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'HarvesterWebsite', {});

    const distribution = new cloudfront.Distribution(this, 'HarvesterDistribution', {
        defaultBehavior: {
            origin: new origins.S3Origin(bucket)
        },
        defaultRootObject: 'index.html'
    });

    const deployment = new s3deploy.BucketDeployment(this, 'DeployHarvesterWebsite', {
        sources: [ s3deploy.Source.asset('../dist')],
        destinationBucket: bucket,
        distribution,
        distributionPaths: ['/*']
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
        value: distribution.domainName
    });
  }
}