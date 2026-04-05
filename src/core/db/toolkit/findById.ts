import { Model, ProjectionType, QueryOptions, PopulateOptions } from 'mongoose';
import { Lean } from './types';

export async function findById<T>(
  model: Model<T>,
  id: string,
  opts: {
    projection?: ProjectionType<T>;
    options?: QueryOptions;
    populate?: PopulateOptions | PopulateOptions[];
    select?: string | string[];
  } = {}
): Promise<Lean<T> | null> {
  let q = model.findById(id, opts.projection, opts.options).populate(opts.populate ?? []);

  if (opts.select) {
    q = q.select(opts.select);
  }

  return q.lean<Lean<T>>().exec();
}
