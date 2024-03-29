import { ICallable, IPromise } from '@qiwi/substrate'

export interface IHistoryEntry {
  pipeType: string
  pipelineId: string
  pipeId: string
  res: any
  err: any
}

export interface ITransmittable {
  data: any
  err?: any
  meta: {
    history: Array<IHistoryEntry>
    [key: string]: any
  }
}

export type IPipeOutput = [any, any]

export interface ITransmitter {
  push(input: any): IPromise<IPipeOutput>
}

export interface IPipe {
  type: string
  execute: (data: ITransmittable, next: ICallable) => IPromise<IPipeOutput>
}

export type TPipeline = Array<IPipe | TPipeline>
