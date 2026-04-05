import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Lean } from './types';

export async function deleteMany<T>(model: Model<T>, filter: FilterQuery<T>): Promise<number> {
  const res = await model.deleteMany(filter).exec();
  return res.deletedCount ?? 0;
}
