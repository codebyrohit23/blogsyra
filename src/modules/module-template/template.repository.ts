import {
  buildQuery,
  paginate,
  BuildQueryOptions,
  PaginationResult,
  PaginationInput,
} from '@/core/db/toolkit';

import { TemplateLean, TemplateDocument, TemplateModel, Template } from './template.model';
import { DeleteResult, FilterQuery, QueryOptions, UpdateQuery, UpdateResult } from 'mongoose';
import { MongoId } from '@/shared/types';
import { CreateTemplateInput, UpdateTemplateInput } from './template.type';

export class TemplateRepository {
  constructor(private readonly model = TemplateModel) {}

  findById(
    id: MongoId,
    payload?: Omit<BuildQueryOptions<TemplateDocument>, 'filter' | 'limit' | 'skip'>
  ): Promise<TemplateLean | TemplateDocument | null> {
    const { populate, select, options, projection, lean } = payload ?? {};

    let q = this.model.findById(id, projection, options);

    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (lean) return q.lean().exec();

    return q.exec();
  }

  create(data: CreateTemplateInput): Promise<TemplateDocument> {
    return this.model.create(data);
  }

  findOne(opts: BuildQueryOptions<Template>): Promise<TemplateDocument | null> {
    return buildQuery(this.model, opts).findOne().exec();
  }

  updateOne(
    filter: FilterQuery<Template>,
    update: UpdateQuery<UpdateTemplateInput>,
    options: QueryOptions = { new: true }
  ): Promise<TemplateDocument | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  updateMany(filter: FilterQuery<Template>, update: UpdateQuery<Template>): Promise<UpdateResult> {
    return this.model.updateMany(filter, update);
  }

  deleteById(id: MongoId): Promise<TemplateLean | null> {
    return this.model.findByIdAndDelete(id).lean();
  }

  deleteOne(filter: FilterQuery<Template>): Promise<TemplateLean | null> {
    return this.model.findOneAndDelete(filter).lean();
  }

  deleteMany(filter: FilterQuery<Template>): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }

  paginate(payload: PaginationInput<Template>): Promise<PaginationResult<TemplateLean>> {
    return paginate(this.model, { ...payload });
  }

  softDelete(id: MongoId): Promise<TemplateLean | null> {
    return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  }

  async exists(filter: FilterQuery<Template>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
