import { IPipe, IPipeOutput, ITransmittable } from '../interfaces'
import { identity } from '.'

export async function executePipeline (transmittable: ITransmittable, pipeline: IPipe[]): Promise<IPipeOutput> {
  const pipe = pipeline.shift() as IPipe
  const [err, succ] = await pipe.execute(transmittable, identity)

  if (pipeline.length === 0) {
    return succ
      ? [null, succ]
      : [err, null]
  }

  return executePipeline(transmittable, pipeline)
}
