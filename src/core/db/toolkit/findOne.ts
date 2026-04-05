import { Model, ProjectionType, QueryOptions, PopulateOptions, FilterQuery } from 'mongoose';
import { Lean } from './types';

export async function findOne<T>(
  model: Model<T>,
  filter: FilterQuery<T>,
  opts: {
    projection?: ProjectionType<T>;
    options?: QueryOptions;
    populate?: PopulateOptions | PopulateOptions[];
    select?: string | string[];
  } = {}
): Promise<Lean<T> | null> {
  let q = model.findOne(filter, opts.projection, opts.options).populate(opts.populate ?? []);

  if (opts.select) {
    q = q.select(opts.select);
  }

  return q.lean<Lean<T>>().exec();
}
