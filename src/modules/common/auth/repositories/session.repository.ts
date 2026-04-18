import {
  buildQuery,
  paginate,
  BuildQueryOptions,
  PaginationResult,
  PaginationInput,
} from '@/core/db/toolkit';

import { SessionLean, SessionDocument, SessionModel, Session } from '../models';

import { DeleteResult, FilterQuery, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { CreateSessionInput } from '../types';
import { MongoId } from '@/shared/types';

export class SessionRepository {
  constructor(private readonly model = SessionModel) {}

  findById(
    id: MongoId,
    payload?: Omit<BuildQueryOptions<SessionDocument>, 'filter' | 'limit' | 'skip'>
  ): Promise<SessionLean | SessionDocument | null> {
    const { populate, select, options, projection, lean } = payload ?? {};

    let q = this.model.findById(id, projection, options);

    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (lean) return q.lean().exec();

    return q.exec();
  }

  create(data: CreateSessionInput): Promise<SessionDocument> {
    return this.model.create(data);
  }

  findOne(opts: BuildQueryOptions<Session>): Promise<SessionDocument | null> {
    return buildQuery(this.model, opts).findOne().exec();
  }

  updateOne(
    filter: FilterQuery<Session>,
    update: UpdateQuery<Session>,
    options: QueryOptions = { new: true }
  ): Promise<SessionDocument | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  deleteById(id: MongoId): Promise<SessionLean | null> {
    return this.model.findByIdAndDelete(id).lean();
  }

  deleteOne(
    filter: FilterQuery<Session>,
    update: UpdateQuery<Session>,
    options: QueryOptions = { new: true }
  ): Promise<SessionLean | null> {
    return this.model.findOneAndUpdate(filter, update, options).lean();
  }

  deleteMany(filter: FilterQuery<Session>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  paginate(payload: PaginationInput<Session>): Promise<PaginationResult<SessionLean>> {
    return paginate(this.model, { ...payload });
  }

  softDelete(id: MongoId): Promise<SessionLean | null> {
    return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  }

  async exists(filter: FilterQuery<Session>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
