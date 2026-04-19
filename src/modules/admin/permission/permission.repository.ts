import {
  buildQuery,
  paginate,
  BuildQueryOptions,
  PaginationResult,
  PaginationInput,
} from '@/core/db/toolkit';

import {
  CreatePermissionInput,
  Permission,
  PermissionDocument,
  PermissionLean,
  PermissionModel,
  UpdatePermissionInput,
} from './permission.model';

import {
  DeleteResult,
  FilterQuery,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateResult,
} from 'mongoose';

export class PermissionRepository {
  constructor(private readonly model = PermissionModel) {}

  findById(
    id: string,
    payload?: Omit<BuildQueryOptions<Permission>, 'filter' | 'limit' | 'skip'>
  ): Promise<PermissionLean | PermissionDocument | null> {
    const { populate, select, options, projection, lean } = payload ?? {};

    let q = this.model.findById(id, projection, options);

    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (lean) return q.lean().exec();

    return q.exec();
  }

  create(data: CreatePermissionInput): Promise<PermissionDocument> {
    return this.model.create(data);
  }

  findOne(opts: BuildQueryOptions<Permission>): Promise<PermissionDocument | null> {
    return buildQuery(this.model, opts).findOne().exec();
  }

  updateOne(
    filter: FilterQuery<Permission>,
    update: UpdateQuery<UpdatePermissionInput>,
    options: QueryOptions = { new: true }
  ): Promise<PermissionDocument | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  updateMany(
    filter: FilterQuery<Permission>,
    update: UpdateQuery<Permission>
  ): Promise<UpdateResult> {
    return this.model.updateMany(filter, update);
  }

  deleteById(id: string): Promise<PermissionDocument | null> {
    return this.model.findByIdAndDelete(id);
  }

  deleteOne(filter: FilterQuery<Permission>): Promise<PermissionLean | null> {
    return this.model.findOneAndDelete(filter).lean();
  }

  deleteMany(filter: FilterQuery<Permission>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  paginate(payload: PaginationInput<Permission>): Promise<PaginationResult<PermissionLean>> {
    return paginate(this.model, { ...payload });
  }

  async exists(filter: FilterQuery<Permission>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
