import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Lean } from './types';

export async function updateOne<T>(
  model: Model<T>,
  filter: FilterQuery<T>,
  update: Partial<T>,
  opts: QueryOptions = { new: true }
): Promise<Lean<T> | null> {
  const doc = await model.findOneAndUpdate(filter, update, opts).exec();
  return doc ? (doc.toObject() as Lean<T>) : null;
}
