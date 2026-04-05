import { FilterQuery, Model } from 'mongoose';

export async function exists<T>(model: Model<T>, filter: FilterQuery<T>): Promise<boolean> {
  return !!(await model.exists(filter).lean().exec());
}
