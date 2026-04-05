import { Model, QueryOptions } from 'mongoose';
import { Lean } from './types';

export async function updateById<T>(
  model: Model<T>,
  id: string,
  update: Partial<T>,
  opts: QueryOptions = { new: true }
): Promise<Lean<T> | null> {
  const doc = await model.findByIdAndUpdate(id, update, opts).exec();
  return doc ? (doc.toObject() as Lean<T>) : null;
}
