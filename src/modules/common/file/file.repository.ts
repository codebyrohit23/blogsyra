import {
  buildQuery,
  paginate,
  BuildQueryOptions,
  PaginationResult,
  PaginationInput,
} from '@/core/db/toolkit';

import { FileLean, FileDocument, FileModel, File } from './file.model';

import { DeleteResult, FilterQuery, QueryOptions, UpdateQuery, UpdateResult } from 'mongoose';

import { CreateFileInput } from './file.types';
import { MongoId } from '@/shared/types';

export class FileRepository {
  constructor(private readonly model = FileModel) {}

  findById(
    id: MongoId,
    payload?: Omit<BuildQueryOptions<FileDocument>, 'filter' | 'limit' | 'skip'>
  ): Promise<FileLean | FileDocument | null> {
    const { populate, select, options, projection, lean } = payload ?? {};

    let q = this.model.findById(id, projection, options);

    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (lean) return q.lean().exec();

    return q.exec();
  }

  async create(payload: CreateFileInput): Promise<FileDocument> {
    return this.model.create(payload);
  }

  findOne(opts: BuildQueryOptions<File>): Promise<FileDocument | null> {
    return buildQuery(this.model, opts).findOne().exec();
  }

  updateOne(
    filter: FilterQuery<File>,
    update: UpdateQuery<File>,
    options: QueryOptions = { new: true }
  ): Promise<FileDocument | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  updateMany(filter: FilterQuery<File>, update: UpdateQuery<File>): Promise<UpdateResult> {
    return this.model.updateMany(filter, update);
  }

  deleteById(id: MongoId): Promise<FileLean | null> {
    return this.model.findByIdAndDelete(id).lean();
  }

  deleteOne(filter: FilterQuery<File>): Promise<FileLean | null> {
    return this.model.findOneAndDelete(filter).lean();
  }

  deleteMany(filter: FilterQuery<File>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  paginate(payload: PaginationInput<File>): Promise<PaginationResult<FileLean>> {
    return paginate(this.model, { ...payload });
  }

  async exists(filter: FilterQuery<File>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
