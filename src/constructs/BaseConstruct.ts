import * as cdk from '@aws-cdk/core'
import { IRole, PolicyStatement } from '@aws-cdk/aws-iam'
import * as env from '../env'

// 全てのConstructorはこのクラスを継承する
export default class BaseConstruct {
  stack: cdk.Stack

  /**
   * 場合分けに使う
   * 例: 本番にのみ作成するリソースがある場合 => `if (this.env === EnvEnum.prod)`
   */
  env: env.EnvEnum

  /**
   * Prod, Dev, Stg
   * CloudFormationのID部分に使用
   * ex: `Vpc${this.EnvName}`
   */
  EnvName: string

  /**
   * prod, dev, dtg
   * リソースの名前をケバブケースでつけるときに使用
   * ex: clusterName: `api-${this.envName}`
   */
  envName: string

  // Construct共通のプロパティ
  protected common: any

  protected dependEnvProps: DependEnvProps<any>

  constructor (stack: cdk.Stack) {
    this.stack = stack
    this.env = env.environment(stack)
    this.EnvName = env.envName(stack, env.CaseEnum.TitleCase)
    this.envName = env.envName(stack)
  }

  /**
   * CDKはリソースとIAM Roleをセットで作成することが多い
   * 自動で作成されたIAM Roleにマネージドのポリシーをアタッチしやすいように共通化
   */
  protected addManagedPolicy (managedPolicyArn: string, role?: IRole) {
    if (role !== undefined) {
      role.addManagedPolicy({ managedPolicyArn })
    }

    return this
  }

  protected addManagedPolicies (managedPolicyArns: string[], role?: IRole) {
    managedPolicyArns.forEach((arn) => this.addManagedPolicy(arn, role))

    return this
  }

  protected addToPolicy (policyStatement: PolicyStatement, role?: IRole) {
    if (role !== undefined) {
      role.addToPolicy(policyStatement)
    }

    return this
  }

  protected addToPolicies (policyStatements: PolicyStatement[], role?: IRole) {
    policyStatements.forEach((statement) => this.addToPolicy(statement, role))

    return this
  }
}

/**
 * 環境に依存する値はこのTypeで型付けしたオブジェクトで定義する
 * 例: 定義時
 * cidrs: DependEnvProps<string> = {
 *   [EnvEnum.prod]: '192.168.0.0/24',
 *   [EnvEnum.stg]: '192.168.1.0/24',
 *   [EnvEnum.dev]: '192.168.2.0/24'
 * }
 *
 * 例: 使用時
 * this.cidrs[this.env]
 */
export type DependEnvProps<T = any> = {
  [env in env.EnvEnum]: T;
};
