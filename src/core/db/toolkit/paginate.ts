import { Model } from 'mongoose';
import { Lean, PaginationInput, PaginationResult } from './types';

export async function paginate<T>(
  model: Model<T>,
  payload: PaginationInput<T>
): Promise<PaginationResult<T>> {
  const page = payload.page ?? 1;
  const limit = payload.limit ?? 10;
  const skip = (page - 1) * limit;

  const filter = payload.filter ?? {};
  const sort = payload.sort ?? ({ createdAt: -1 } as any);

  let q = model.find(filter, payload.projection, {
    ...payload.options,
    skip,
    limit,
  });

  if (payload.populate) {
    q = q.populate(payload.populate);
  }

  if (payload.select) {
    q = q.select(payload.select);
  }

  q = q.sort(sort);

  const [data, total] = await Promise.all([
    q.lean<Lean<T>[]>().exec(),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
}
