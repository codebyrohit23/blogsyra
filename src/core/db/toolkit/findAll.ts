import {
  FilterQuery,
  Model,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  SortOrder,
} from 'mongoose';
import { Lean } from './types';

export async function findAll<T>(
  model: Model<T>,
  filter: FilterQuery<T> = {},
  opts: {
    projection?: ProjectionType<T>;
    options?: QueryOptions;
    populate?: PopulateOptions | PopulateOptions[];
    select?: string | string[];
    sort?: Record<string, SortOrder>;
  } = {}
): Promise<Lean<T>[]> {
  let q = model.find(filter, opts.projection, opts.options).populate(opts.populate ?? []);

  if (opts.select) {
    q = q.select(opts.select);
  }

  if (opts.sort) {
    q = q.sort(opts.sort);
  }

  return q.lean<Lean<T>[]>().exec();
}
