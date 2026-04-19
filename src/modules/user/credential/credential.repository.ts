import {
  buildQuery,
  paginate,
  BuildQueryOptions,
  PaginationResult,
  PaginationInput,
} from '@/core/db/toolkit';

import {
  CredentialLean,
  CredentialDocument,
  CredentialModel,
  Credential,
} from './credential.model';
import {
  ClientSession,
  DeleteResult,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
  UpdateResult,
} from 'mongoose';
import { CreateCredentialInput } from './credential.type';
import { MongoId } from '@/shared/types';

export class CredentialRepository {
  constructor(private readonly model = CredentialModel) {}

  findById(
    id: MongoId,
    payload?: Omit<BuildQueryOptions<CredentialDocument>, 'filter' | 'limit' | 'skip'>
  ): Promise<CredentialLean | CredentialDocument | null> {
    const { populate, select, options, projection, lean } = payload ?? {};

    let q = this.model.findById(id, projection, options);

    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (lean) return q.lean().exec();

    return q.exec();
  }

  create(data: CreateCredentialInput, session: ClientSession): Promise<CredentialDocument> {
    const credential = new this.model(data);
    return credential.save(session ? { session } : {});
  }

  findOne(opts: BuildQueryOptions<Credential>): Promise<CredentialDocument | null> {
    return buildQuery(this.model, opts).findOne().exec();
  }

  updateOne(
    filter: FilterQuery<Credential>,
    update: UpdateQuery<Credential>,
    options: QueryOptions = { new: true }
  ): Promise<CredentialDocument | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  updateMany(
    filter: FilterQuery<Credential>,
    update: UpdateQuery<Credential>
  ): Promise<UpdateResult> {
    return this.model.updateMany(filter, update);
  }

  deleteById(id: MongoId): Promise<CredentialLean | null> {
    return this.model.findByIdAndDelete(id).lean();
  }

  deleteOne(filter: FilterQuery<Credential>): Promise<CredentialLean | null> {
    return this.model.findOneAndDelete(filter).lean();
  }

  deleteMany(filter: FilterQuery<Credential>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  paginate(payload: PaginationInput<Credential>): Promise<PaginationResult<CredentialLean>> {
    return paginate(this.model, { ...payload });
  }

  async exists(filter: FilterQuery<Credential>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
