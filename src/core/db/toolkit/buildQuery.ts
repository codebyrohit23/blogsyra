import { Model } from 'mongoose';
import { BuildQueryOptions } from './types';

export function buildQuery<T>(model: Model<T>, opts: BuildQueryOptions<T>) {
  const {
    filter = {},
    projection,
    options,
    populate,
    select,
    sort,
    limit,
    skip,
    lean = false,
  } = opts;

  let q = model.find(filter, projection, options);

  if (populate) q = q.populate(populate);
  if (select) q = q.select(select);
  if (sort) q = q.sort(sort);
  if (limit !== undefined) q = q.limit(limit);
  if (skip !== undefined) q = q.skip(skip);

  if (lean) return q.lean();

  return q;
}
