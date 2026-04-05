import {
  buildQuery,
  paginate,
  BuildQueryOptions,
  PaginationResult,
  PaginationInput,
} from '@/core/db/toolkit';

import { OtpLean, OtpDocument, OtpModel, Otp } from './otp.model';

import {
  DeleteResult,
  FilterQuery,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateResult,
} from 'mongoose';
import { CreateOtpInput } from './otp.type';

export class OtpRepository {
  constructor(private readonly model = OtpModel) {}

  findById(
    id: string,
    payload?: Omit<BuildQueryOptions<OtpDocument>, 'filter' | 'limit' | 'skip'>
  ): Promise<OtpLean | OtpDocument | null> {
    const { populate, select, options, projection, lean } = payload ?? {};

    let q = this.model.findById(id, projection, options);

    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (lean) return q.lean().exec();

    return q.exec();
  }

  create(data: CreateOtpInput): Promise<OtpDocument> {
    return this.model.create(data);
  }

  findOne(opts: BuildQueryOptions<Otp>): Promise<OtpDocument | null> {
    return buildQuery(this.model, opts).findOne().exec();
  }

  updateOne(
    filter: FilterQuery<Otp>,
    update: UpdateQuery<Otp>,
    options: QueryOptions = { new: true }
  ): Promise<OtpDocument | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  updateMany(filter: FilterQuery<Otp>, update: UpdateQuery<Otp>): Promise<UpdateResult> {
    return this.model.updateMany(filter, update);
  }

  deleteById(id: string | Types.ObjectId): Promise<OtpLean | null> {
    return this.model.findByIdAndDelete(id).lean();
  }

  deleteOne(filter: FilterQuery<Otp>): Promise<OtpLean | null> {
    return this.model.findOneAndUpdate(filter).lean();
  }

  deleteMany(filter: FilterQuery<Otp>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  paginate(payload: PaginationInput<Otp>): Promise<PaginationResult<OtpLean>> {
    return paginate(this.model, { ...payload });
  }

  softDelete(id: string): Promise<OtpLean | null> {
    return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  }

  async exists(filter: FilterQuery<Otp>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
