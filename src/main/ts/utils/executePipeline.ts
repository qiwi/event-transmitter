import { IPipe, IPipeOutput, ITransmittable } from '../interfaces'
import { identity } from '.'

export async function executePipeline (transmittable: ITransmittable, pipeline: IPipe[], errors: any[] = []): Promise<IPipeOutput> {
  if (pipeline.length === 0) {
    return [errors, null]
  }

  const pipe = pipeline.shift() as IPipe
  const [err, succ] = await pipe.execute(transmittable, identity)

  if (succ) {
    return [null, succ]
  }

  return executePipeline(transmittable, pipeline, [...errors, err])
}
