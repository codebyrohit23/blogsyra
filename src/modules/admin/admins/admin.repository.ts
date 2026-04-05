import {
  buildQuery,
  BuildQueryOptions,
  paginate,
  PaginationInput,
  PaginationResult,
} from '@/core/db/toolkit';

import { Admin, AdminDocument, AdminLean, AdminModel } from './admin.model.js';

import {
  DeleteResult,
  FilterQuery,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateResult,
} from 'mongoose';
import { EntityStatus } from '@/shared/constants/enums.js';
import { CreateAdminInput } from './admin.types.js';

export class AdminRepository {
  private readonly model = AdminModel;

  findById(
    id: Types.ObjectId,
    payload?: Omit<BuildQueryOptions<AdminDocument>, 'filter' | 'limit' | 'skip'>
  ): Promise<AdminLean | AdminDocument | null> {
    const { populate, select, options, projection, lean } = payload ?? {};

    let q = this.model.findById(id, projection, options);

    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (lean) return q.lean().exec();

    return q.exec();
  }

  create(data: CreateAdminInput): Promise<AdminDocument> {
    return this.model.create(data);
  }

  findOne(opts: BuildQueryOptions<Admin>): Promise<AdminDocument | null> {
    return buildQuery(this.model, opts).findOne().exec();
  }

  updateOne(
    filter: FilterQuery<Admin>,
    update: UpdateQuery<Admin>,
    options: QueryOptions = { new: true }
  ): Promise<AdminDocument | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  updateMany(filter: FilterQuery<Admin>, update: UpdateQuery<Admin>): Promise<UpdateResult> {
    return this.model.updateMany(filter, update);
  }

  deleteById(id: string | Types.ObjectId): Promise<AdminDocument | null> {
    return this.model.findByIdAndDelete(id);
  }

  deleteOne(filter: FilterQuery<Admin>): Promise<AdminDocument | null> {
    return this.model.findOneAndDelete(filter);
  }

  deleteMany(filter: FilterQuery<Admin>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  paginate(payload: PaginationInput<Admin>): Promise<PaginationResult<Admin>> {
    return paginate(this.model, { ...payload });
  }

  softDelete(id: string) {
    return this.model.findByIdAndUpdate(id, { status: EntityStatus.DELETED }, { new: true }).lean();
  }

  async exists(filter: FilterQuery<Admin>) {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
