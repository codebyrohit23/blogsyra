import {
  buildQuery,
  paginate,
  BuildQueryOptions,
  PaginationResult,
  PaginationInput,
} from '@/core/db/toolkit';

import {
  RoleLean,
  RoleDocument,
  RoleModel,
  Role,
  CreateRoleInput,
  UpdateRoleInput,
} from './role.model';

import {
  DeleteResult,
  FilterQuery,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateResult,
} from 'mongoose';

export class RoleRepository {
  constructor(private readonly model = RoleModel) {}

  findById(
    id: string,
    payload?: Omit<BuildQueryOptions<RoleDocument>, 'filter' | 'limit' | 'skip'>
  ): Promise<RoleLean | RoleDocument | null> {
    const { populate, select, options, projection, lean } = payload ?? {};

    let q = this.model.findById(id, projection, options);

    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (lean) return q.lean().exec();

    return q.exec();
  }

  public create(data: CreateRoleInput): Promise<RoleDocument> {
    return this.model.create(data);
  }

  findOne(opts: BuildQueryOptions<RoleDocument>): Promise<RoleDocument | null> {
    return buildQuery(this.model, opts).findOne().exec();
  }

  updateOne(
    filter: FilterQuery<Role>,
    update: UpdateQuery<UpdateRoleInput>,
    options: QueryOptions = { new: true }
  ): Promise<RoleDocument | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  updateMany(filter: FilterQuery<Role>, update: UpdateQuery<Role>): Promise<UpdateResult> {
    return this.model.updateMany(filter, update);
  }

  deleteById(id: string | Types.ObjectId): Promise<RoleDocument | null> {
    return this.model.findByIdAndDelete(id);
  }

  deleteOne(filter: FilterQuery<Role>): Promise<RoleLean | null> {
    return this.model.findOneAndDelete(filter);
  }

  deleteMany(filter: FilterQuery<Role>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  paginate(payload: PaginationInput<RoleDocument>): Promise<PaginationResult<RoleLean>> {
    return paginate(this.model, { ...payload });
  }

  softDelete(id: string): Promise<Role | null> {
    return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  }

  async exists(filter: FilterQuery<Role>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
