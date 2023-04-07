import once from 'lodash.once'

import { IPipeOutput, ITransmittable, TPipeline } from '../interfaces'

export const getPipelineId = (pipeline: TPipeline): string =>
  pipeline.reduce(
    (acc, pipe, index) =>
      acc +
      (Array.isArray(pipe)
        ? `{${index}-[${getPipelineId(pipe)}]}`
        : `{${index}-${pipe.type}}`),
    '',
  )

export const execute = async (
  transmittable: ITransmittable,
  pipeline: TPipeline,
  prefix = 0,
  pipelineId = getPipelineId(pipeline),
): Promise<IPipeOutput> => {
  const pipe = pipeline[0]

  if (!pipe) {
    return [null, null]
  }

  if (Array.isArray(pipe)) {
    return execute(transmittable, pipe)
  }

  const next = once(([err, data]: IPipeOutput) =>
    execute(
      { ...transmittable, data, err },
      pipeline.slice(1),
      prefix + 1,
      pipelineId,
    ),
  )

  return pipe.execute(transmittable, next).then(async (output) => {
    transmittable.meta.history.push({
      pipelineId,
      pipeId: '' + prefix,
      pipeType: pipe.type,
      err: output[0],
      res: !!output[1],
    })

    await next(output)

    return output
  })
}
