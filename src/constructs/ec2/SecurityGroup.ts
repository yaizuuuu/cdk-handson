import {
  Peer,
  Port,
  SecurityGroup as BaseSecurityGroup,
  Vpc
} from '@aws-cdk/aws-ec2'
import BaseConstruct from '../BaseConstruct'

export default class SecurityGroup extends BaseConstruct {
  securityGroup: BaseSecurityGroup

  forWebAny (vpc: Vpc) {
    this.securityGroup = new BaseSecurityGroup(this.stack, `webAny${this.EnvName}`, {
      vpc,
      allowAllOutbound: true,
      securityGroupName: `web-any-${this.envName}`
    })

    this.securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80))
    this.securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(443))

    return this
  }

  forInternal (vpc: Vpc) {
    this.securityGroup = new BaseSecurityGroup(this.stack, `internalAny${this.EnvName}`, {
      vpc,
      allowAllOutbound: true,
      securityGroupName: `internal-any-${this.envName}`
    })

    this.securityGroup.addIngressRule(Peer.ipv4(vpc.vpcCidrBlock), Port.allTraffic())

    return this
  }
}
