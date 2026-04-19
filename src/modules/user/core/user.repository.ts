import {
  buildQuery,
  paginate,
  BuildQueryOptions,
  PaginationResult,
  PaginationInput,
} from '@/core/db/toolkit';

import { UserLean, UserDocument, UserModel, User } from './user.model';
import {
  ClientSession,
  DeleteResult,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
  UpdateResult,
} from 'mongoose';
import { CreateUserInput } from './user.type';
import { MongoId } from '@/shared/types';

export class UserRepository {
  constructor(private readonly model = UserModel) {}

  findById(
    id: MongoId,
    payload?: Omit<BuildQueryOptions<UserDocument>, 'filter' | 'limit' | 'skip'>
  ): Promise<UserLean | UserDocument | null> {
    const { populate, select, options, projection, lean } = payload ?? {};

    let q = this.model.findById(id, projection, options);

    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (lean) return q.lean().exec();

    return q.exec();
  }

  async create(payload: CreateUserInput, session?: ClientSession): Promise<UserDocument> {
    const user = new this.model(payload);
    return user.save(session ? { session } : {});
  }

  findOne(opts: BuildQueryOptions<User>): Promise<UserDocument | null> {
    return buildQuery(this.model, opts).findOne().exec();
  }

  updateOne(
    filter: FilterQuery<User>,
    update: UpdateQuery<User>,
    options: QueryOptions = { new: true }
  ): Promise<UserDocument | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  updateMany(filter: FilterQuery<User>, update: UpdateQuery<User>): Promise<UpdateResult> {
    return this.model.updateMany(filter, update);
  }

  deleteById(id: MongoId): Promise<UserLean | null> {
    return this.model.findByIdAndDelete(id).lean();
  }

  deleteOne(filter: FilterQuery<User>): Promise<UserLean | null> {
    return this.model.findOneAndDelete(filter).lean();
  }

  deleteMany(filter: FilterQuery<User>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  paginate(payload: PaginationInput<User>): Promise<PaginationResult<UserLean>> {
    return paginate(this.model, { ...payload });
  }

  async exists(filter: FilterQuery<User>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
