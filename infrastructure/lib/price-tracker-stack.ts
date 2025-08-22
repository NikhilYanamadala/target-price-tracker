import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';

export class PriceTrackerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'HelloWorldVpc', {
      maxAzs: 2,
      natGateways: 1 // Cost optimization
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'HelloWorldCluster', {
      vpc: vpc
    });

    // Single Bundled Service
    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'HelloWorldService', {
      cluster: cluster,
      cpu: 256,
      memoryLimitMiB: 512,
      desiredCount: 1,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset('../backend'),
        containerPort: 8080,
        environment: {
          'SPRING_PROFILES_ACTIVE': 'prod'
        }
      },
      publicLoadBalancer: true,
      healthCheckGracePeriod: cdk.Duration.minutes(5)
    });

    // Health check configuration
    service.targetGroup.configureHealthCheck({
      path: '/api/health',
      healthyHttpCodes: '200'
    });

    // Auto scaling
    const scaling = service.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 10
    });

    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 70
    });

    // Output
    new cdk.CfnOutput(this, 'ApplicationUrl', {
      value: `http://${service.loadBalancer.loadBalancerDnsName}`,
      description: 'URL of the bundled application'
    });
  }
}