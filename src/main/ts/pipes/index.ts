import { TPipeline, ITransmittable, IPipe, IPipeOutput } from './interfaces'

export const getPipelineId = (pipeline: TPipeline): string => {
  return pipeline.reduce((acc, pipe, index) => {
    return acc + (Array.isArray(pipe)
      ? `|${index}-[${getPipelineId(pipe)}]|`
      : `|${index}-${pipe.type}|`)
  }, '')
}

export const createTransmittable = (event: any): ITransmittable => ({
  data: event,
  meta: { history: [] }
})

export const execute = async (event: ITransmittable, pipeline: TPipeline, prefix = 0, pipelineId = getPipelineId(pipeline)): Promise<IPipeOutput> => {
  const pipe = pipeline[0] as IPipe

  if (!pipe) {
    return [null, null]
  }

  return pipe.execute(event, ([err, res]: any) => {
    event.meta.history.push({
      pipelineId,
      pipeId: '' + prefix,
      pipeType: pipe.type,
      err,
      res
    })

    return execute(event, pipeline.slice(1), prefix + 1)
  })
}

export * from './interfaces'
