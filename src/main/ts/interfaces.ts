import { ICallable, IPromise } from '@qiwi/substrate'

export interface IHistoryEntry {
  pipeType: string
  pipelineId: string
  pipeId: string
  res: any,
  err: any
}

export interface ITransmittable {
  data: any
  err?: any
  meta: {
    history: Array<IHistoryEntry>
  }
}

export type IPipeOutput = [any, any]

export interface ITransmitter {
  push(input: any): IPromise<IPipeOutput>
}

export interface IPipe {
  type: string
  execute: (data: ITransmittable, next: ICallable) => Promise<IPipeOutput>
}

export type TPipeline = Array<IPipe | TPipeline>
