import {
  buildQuery,
  paginate,
  BuildQueryOptions,
  PaginationResult,
  PaginationInput,
} from '@/core/db/toolkit';

import { RefreshTokenLean, RefreshTokenDocument, RefreshTokenModel, RefreshToken } from '../models';

import { DeleteResult, FilterQuery, QueryOptions, UpdateQuery, UpdateResult } from 'mongoose';

import { CreateRefreshTokenInput } from '../types';
import { MongoId } from '@/shared/types';

export class RefreshTokenRepository {
  constructor(private readonly model = RefreshTokenModel) {}

  findById(
    id: MongoId,
    payload?: Omit<BuildQueryOptions<RefreshTokenDocument>, 'filter' | 'limit' | 'skip'>
  ): Promise<RefreshTokenLean | RefreshTokenDocument | null> {
    const { populate, select, options, projection, lean } = payload ?? {};

    let q = this.model.findById(id, projection, options);

    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (lean) return q.lean().exec();

    return q.exec();
  }

  create(data: CreateRefreshTokenInput): Promise<RefreshTokenDocument> {
    return this.model.create(data);
  }

  findOne(opts: BuildQueryOptions<RefreshToken>): Promise<RefreshTokenDocument | null> {
    return buildQuery(this.model, opts).findOne().exec();
  }

  updateOne(
    filter: FilterQuery<RefreshToken>,
    update: UpdateQuery<RefreshToken>,
    options: QueryOptions = { new: true }
  ): Promise<RefreshTokenDocument | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  updateMany(
    filter: FilterQuery<RefreshToken>,
    update: UpdateQuery<RefreshToken>
  ): Promise<UpdateResult> {
    return this.model.updateMany(filter, update);
  }

  deleteById(id: MongoId): Promise<RefreshTokenLean | null> {
    return this.model.findByIdAndDelete(id).lean();
  }

  deleteOne(filter: FilterQuery<RefreshToken>): Promise<RefreshTokenLean | null> {
    return this.model.findOneAndDelete(filter).lean();
  }

  deleteMany(filter: FilterQuery<RefreshToken>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  paginate(payload: PaginationInput<RefreshToken>): Promise<PaginationResult<RefreshTokenLean>> {
    return paginate(this.model, { ...payload });
  }

  softDelete(id: MongoId): Promise<RefreshTokenLean | null> {
    return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  }

  async exists(filter: FilterQuery<RefreshToken>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
