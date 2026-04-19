import {
  buildQuery,
  paginate,
  BuildQueryOptions,
  PaginationResult,
  PaginationInput,
} from '@/core/db/toolkit';

import { IdentityLean, IdentityDocument, IdentityModel, Identity } from './identity.model';

import {
  ClientSession,
  DeleteResult,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
  UpdateResult,
} from 'mongoose';

import { CreateIdentityInput } from './identity.type';
import { MongoId } from '@/shared/types';

export class IdentityRepository {
  constructor(private readonly model = IdentityModel) {}

  findById(
    id: MongoId,
    payload?: Omit<BuildQueryOptions<IdentityDocument>, 'filter' | 'limit' | 'skip'>
  ): Promise<IdentityLean | IdentityDocument | null> {
    const { populate, select, options, projection, lean } = payload ?? {};

    let q = this.model.findById(id, projection, options);

    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (lean) return q.lean().exec();

    return q.exec();
  }

  create(data: CreateIdentityInput, session: ClientSession): Promise<IdentityDocument> {
    const identity = new this.model(data, session);

    return identity.save(session ? { session } : {});
  }

  findOne(opts: BuildQueryOptions<Identity>): Promise<IdentityDocument | null> {
    return buildQuery(this.model, opts).findOne().exec();
  }

  updateOne(
    filter: FilterQuery<Identity>,
    update: UpdateQuery<Identity>,
    options: QueryOptions = { new: true }
  ): Promise<IdentityDocument | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  updateMany(filter: FilterQuery<Identity>, update: UpdateQuery<Identity>): Promise<UpdateResult> {
    return this.model.updateMany(filter, update);
  }

  deleteById(id: MongoId): Promise<IdentityLean | null> {
    return this.model.findByIdAndDelete(id).lean();
  }

  deleteOne(filter: FilterQuery<Identity>): Promise<IdentityLean | null> {
    return this.model.findOneAndDelete(filter).lean();
  }

  deleteMany(filter: FilterQuery<Identity>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  paginate(payload: PaginationInput<Identity>): Promise<PaginationResult<IdentityLean>> {
    return paginate(this.model, { ...payload });
  }

  async exists(filter: FilterQuery<Identity>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
