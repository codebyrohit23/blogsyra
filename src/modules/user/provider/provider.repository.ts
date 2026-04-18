import { buildQuery, BuildQueryOptions } from '@/core/db/toolkit';

import { ProviderLean, ProviderDocument, ProviderModel, Provider } from './provider.model';

import {
  ClientSession,
  DeleteResult,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
  UpdateResult,
} from 'mongoose';

import { CreateProviderInput } from './provider.type';

import { MongoId } from '@/shared/types';

export class ProviderRepository {
  constructor(private readonly model = ProviderModel) {}

  findById(
    id: MongoId,
    payload?: Omit<BuildQueryOptions<ProviderDocument>, 'filter' | 'limit' | 'skip'>
  ): Promise<ProviderLean | ProviderDocument | null> {
    const { populate, select, options, projection, lean } = payload ?? {};

    let q = this.model.findById(id, projection, options);

    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (lean) return q.lean().exec();

    return q.exec();
  }

  create(data: CreateProviderInput, session?: ClientSession): Promise<ProviderDocument> {
    const provider = new this.model(data);
    return provider.save(session ? { session } : {});
  }

  findOne(opts: BuildQueryOptions<Provider>): Promise<ProviderDocument | null> {
    return buildQuery(this.model, opts).findOne().exec();
  }

  updateOne(
    filter: FilterQuery<Provider>,
    update: UpdateQuery<Provider>,
    options: QueryOptions = { new: true }
  ): Promise<ProviderDocument | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  updateMany(filter: FilterQuery<Provider>, update: UpdateQuery<Provider>): Promise<UpdateResult> {
    return this.model.updateMany(filter, update);
  }

  deleteById(id: MongoId): Promise<ProviderLean | null> {
    return this.model.findByIdAndDelete(id).lean();
  }

  deleteOne(filter: FilterQuery<Provider>): Promise<ProviderLean | null> {
    return this.model.findOneAndDelete(filter).lean();
  }

  deleteMany(filter: FilterQuery<Provider>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  async exists(filter: FilterQuery<Provider>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
