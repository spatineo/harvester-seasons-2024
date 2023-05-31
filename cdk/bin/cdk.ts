#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StaticResourcesS3Stack } from '../lib/static-resources-stack';

const app = new cdk.App();
new StaticResourcesS3Stack(app, 'HarvesterS3', {});
