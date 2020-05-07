import { Stack } from '@aws-cdk/core'

export enum EnvEnum {
  prod = 'prod',
  stg = 'stg',
  dev = 'dev'
}

export enum CaseEnum {
  LowCase,
  // 頭文字のみ大文字のケース
  TitleCase
}

export function environment (stack: Stack): EnvEnum {
  const envName: EnvEnum = stack.node.tryGetContext('env')

  if (EnvEnum[envName] === undefined) {
    throw Error(`contextのenvキーに正しい値が設定されていません => ${envList().toString()}`)
  }

  return EnvEnum[envName]
}

export function envName (stack: Stack, caseName: CaseEnum = CaseEnum.LowCase): string {
  const name = environment(stack)

  if (caseName === CaseEnum.TitleCase) {
    return covertTitleCase(name)
  }

  return name
}

function envList (): EnvEnum[] {
  return Object
    .entries(EnvEnum)
    .map(([_, value]) => value)
}

function covertTitleCase (text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
