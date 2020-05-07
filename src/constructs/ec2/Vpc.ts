import { SubnetConfiguration, Vpc as BaseVpc } from '@aws-cdk/aws-ec2'
import BaseConstruct, { DependEnvProps } from '../BaseConstruct'
import { EnvEnum } from '../../env'

type variableProps = {
  cidr: string
  subnetConfiguration?: SubnetConfiguration[]
}

export default class Vpc extends BaseConstruct {
  protected dependEnvProps: DependEnvProps<variableProps> = {
    [EnvEnum.prod]: {
      cidr: '192.168.0.0/24'
    },
    [EnvEnum.stg]: {
      cidr: '192.168.1.0/24'
    },
    [EnvEnum.dev]: {
      cidr: '192.168.2.0/24'
    }
  }

  vpc: BaseVpc

  forApi () {
    this.vpc = new BaseVpc(this.stack, `vpc${this.EnvName}`, {
      ...this.dependEnvProps[this.env],
      maxAzs: 2
    })

    return this
  }
}
