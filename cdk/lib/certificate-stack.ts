import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";

import { Construct } from 'constructs';

export class CertificateStack extends cdk.Stack {
  certificate: certificatemanager.Certificate
  domainName: string
  hostedZoneId: string
  hostedZone: route53.IHostedZone

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
        env: {
            region: 'us-east-1'
        },
        crossRegionReferences: true,
        ...props
    });

    const targetEnv = this.node.tryGetContext('environment') || 'staging';

    switch(targetEnv) {
        case 'staging':
            this.domainName = 'harvester-seasons-staging.net';
            this.hostedZoneId = 'Z0462309TFCIKB6GSWB9';
            break;
        default:
            throw Error(`Unknown environment ${targetEnv}`)
    }

    this.hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', { zoneName: this.domainName, hostedZoneId: this.hostedZoneId });

    this.certificate = new certificatemanager.Certificate(this, 'HarvesterCertificate', {
        domainName: this.domainName,
        validation: certificatemanager.CertificateValidation.fromDns(this.hostedZone)
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
        value: `https://${this.domainName}/`
    });
  }
}