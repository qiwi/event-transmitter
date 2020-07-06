import { IPromise } from '@qiwi/substrate'

export interface IBrowserInfo {
  name?: string
  version?: string | null
  layout?: string | null
}

export interface IOperationalSystemInfo {
  architecture?: number
  family?: string | null
  version?: string | null
}

export interface IDeviceInfo {
  browser: IBrowserInfo
  model: {
    product?: string | null,
    manufacturer?: string | null
  },
  os?: IOperationalSystemInfo
}

export interface ITransmittable {
  data: any
  err?: any
  meta: {
    history: Array<IHistoryEntry>
  }
}

export interface ITransmitter {
  push(input: any): IPromise<IPipeOutput>
}

export interface IHistoryEntry {
  pipeType: string
  pipelineId: string
  pipeId: string
  res: any,
  err: any
}

export type IPipeOutput = [any, any]

export interface IPipe {
  type: string
  execute: (data: ITransmittable, next: any) => Promise<IPipeOutput>
}

export type TPipeline = Array<IPipe | TPipeline>
