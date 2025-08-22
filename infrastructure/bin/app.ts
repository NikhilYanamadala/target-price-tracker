#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PriceTrackerStack } from '../lib/price-tracker-stack';

const app = new cdk.App();
new PriceTrackerStack(app, 'HelloWorldStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});