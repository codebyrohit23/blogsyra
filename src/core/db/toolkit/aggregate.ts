import { Model, PipelineStage } from 'mongoose';

export async function aggregate<T>(model: Model<T>, pipeline: PipelineStage[]): Promise<any[]> {
  return model.aggregate(pipeline).exec();
}
