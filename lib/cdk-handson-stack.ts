import * as cdk from '@aws-cdk/core'
import Vpc from '../src/constructs/ec2/Vpc'
import SecurityGroup from '../src/constructs/ec2/SecurityGroup'

export class CdkHandsonStack extends cdk.Stack {
  constructor (scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const { vpc } = new Vpc(this).forApi()
    new SecurityGroup(this).forInternal(vpc)
    new SecurityGroup(this).forWebAny(vpc)
  }
}
