import { PaginationResult } from '@/core/db/toolkit';
import { CreateTemplateDto, TemplatePaginationDto, UpdateTemplateDto } from './schemas';
import { TemplateRepository } from './template.repository';
import { notFoundError } from '@/core/error';
import { TemplateDocument, TemplateLean } from './template.model';
import { CacheService } from '@/infra/cache';
import { SortOrder } from '@/shared/constants';
import { MongoId } from '@/shared/types';
import { buildQueryKey, TemplateCacheKeys, TemplateCacheVersion } from './template.cache';

export class TemplateService {
  constructor(
    private readonly repo: TemplateRepository,
    private readonly cache: CacheService,
    private readonly templateCacheVersion: TemplateCacheVersion
  ) {}

  public async getTemplates(query: TemplatePaginationDto): Promise<PaginationResult<TemplateLean>> {
    const version = await this.templateCacheVersion.getListVersion();

    const queryKey = buildQueryKey(query);

    const cacheKey = TemplateCacheKeys.list(queryKey, version);

    const cached = await this.cache.get<PaginationResult<TemplateLean>>(cacheKey);

    if (cached) return cached;

    const { page, limit, search, status, sortBy, sortOrder } = query;

    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
    };

    const result = await this.repo.paginate({
      filter,
      sort,
      page,
      limit,
    });

    if (result) {
      await this.cache.set(cacheKey, result);
    }

    return result;
  }

  public async createTemplate(
    payload: CreateTemplateDto,
    createdBy: MongoId
  ): Promise<TemplateDocument> {
    const template = await this.repo.create({ ...payload, createdBy });

    await this.templateCacheVersion.bumpListVersion();

    return template;
  }

  public async getTemplate(id: MongoId): Promise<TemplateLean> {
    const cacheKey = TemplateCacheKeys.byId(id);

    const cached = await this.cache.get<TemplateLean>(cacheKey);

    if (cached) return cached;

    const template = await this.repo.findById(id);

    if (!template) throw notFoundError('Template');

    await this.cache.set(cacheKey, template);

    return template;
  }

  public async updateTemplate(id: MongoId, payload: UpdateTemplateDto): Promise<TemplateLean> {
    const template = await this.repo.updateOne({ _id: id }, payload);

    if (!template) throw notFoundError('Template');

    await Promise.all([
      this.cache.del(TemplateCacheKeys.byId(id)),
      this.templateCacheVersion.bumpListVersion(),
    ]);

    return template;
  }

  public async deleteTemplate(id: MongoId) {
    const template = await this.repo.deleteById(id);

    if (!template) throw notFoundError('Template');

    await Promise.all([
      this.cache.del(TemplateCacheKeys.byId(id)),
      this.templateCacheVersion.bumpListVersion(),
    ]);

    return template;
  }

  private async exists(filter: object): Promise<boolean> {
    return this.repo.exists(filter);
  }
}
