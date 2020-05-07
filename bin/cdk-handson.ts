#!/usr/bin/env node
import * as cdk from '@aws-cdk/core'
import { CdkHandsonStack } from '../lib/cdk-handson-stack'

const app = new cdk.App()
new CdkHandsonStack(app, 'CdkHandsonStack')
