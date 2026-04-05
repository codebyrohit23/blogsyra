import { Model } from 'mongoose';
import { Lean } from './types';

export async function insertMany<T>(model: Model<T>, data: Partial<T>[]): Promise<Lean<T>[]> {
  return model.insertMany(data, { lean: true }) as Promise<Lean<T>[]>;
}
