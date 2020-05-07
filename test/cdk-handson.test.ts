import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as CdkHandson from '../lib/cdk-handson-stack'

test('VPC Created', () => {
  const app = new cdk.App({
    context: {
      env: 'dev'
    }
  })
  // WHEN
  const stack = new CdkHandson.CdkHandsonStack(app, 'MyTestStack')
  // THEN
  expectCDK(stack).to(haveResource('AWS::EC2::VPC', {
    CidrBlock: '192.168.2.0/24'
  }))
})
