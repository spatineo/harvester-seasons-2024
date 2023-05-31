import * as cdk from 'aws-cdk-lib';
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";

import { Construct } from 'constructs';

interface StaticResourcesS3StackProps extends cdk.StackProps {
    certificate: certificatemanager.ICertificate,
    domainName: string,
    hostedZone: route53.IHostedZone
}

export class StaticResourcesS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StaticResourcesS3StackProps) {
    super(scope, id, {
        env: {
            region: 'eu-north-1'
        },
        crossRegionReferences: true,
        ...props
    });
    
    const bucket = new s3.Bucket(this, 'HarvesterWebsite', {});

    const distribution = new cloudfront.Distribution(this, 'HarvesterDistribution', {
        defaultBehavior: {
            origin: new origins.S3Origin(bucket)
        },
        defaultRootObject: 'index.html',
        domainNames: [ props.domainName ],
        certificate: props.certificate
    });

    new s3deploy.BucketDeployment(this, 'DeployHarvesterWebsite', {
        sources: [ s3deploy.Source.asset('../dist')],
        destinationBucket: bucket,
        distribution,
        distributionPaths: ['/*']
    });

    new route53.ARecord(this, 'HarvesterDNS_A', {
        zone: props.hostedZone,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
    });

    new route53.AaaaRecord(this, 'HarvesterDNS_AAAA', {
        zone: props.hostedZone,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
    });
  }
}