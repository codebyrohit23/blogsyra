import { PaginationResult } from '@/core/db/toolkit';
import { CreateTemplateDto, TemplatePaginationDto, UpdateTemplateDto } from './schemas';
import { TemplateRepository } from './template.repository';
import { convertToObjectId } from '@/shared/utils';
import { notFoundError } from '@/core/error';
import { TemplateDocument, TemplateLean } from './template.model';
import { TEMPLATE_REDIS_KEYS } from './template.redis-keys';
import { CacheService } from '@/core/cache';
import { SortOrder } from '@/shared/constants';

export class TemplateService {
  constructor(
    private readonly repo: TemplateRepository,
    private readonly cache: CacheService
  ) {}

  public async getTemplates(query: TemplatePaginationDto): Promise<PaginationResult<TemplateLean>> {
    const redisKey = TEMPLATE_REDIS_KEYS.templatesList(query);

    const cached = await this.cache.get<PaginationResult<TemplateLean>>(redisKey);
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
      await this.cache.set(redisKey, result);
    }

    return result;
  }

  public async createTemplate(payload: CreateTemplateDto, id: string): Promise<TemplateDocument> {
    const createdBy = convertToObjectId(id);

    const template = await this.repo.create({ ...payload, createdBy });

    const redisKey = TEMPLATE_REDIS_KEYS.patterns.templatesList();

    await this.cache.deleteByPattern(redisKey);

    return template;
  }

  public async getTemplate(id: string): Promise<TemplateLean> {
    const redisKey = TEMPLATE_REDIS_KEYS.templateById(id);

    const cached = await this.cache.get<TemplateLean>(redisKey);

    if (cached) return cached;

    const template = await this.repo.findById(id);

    if (!template) throw notFoundError('Template');

    await this.cache.set(redisKey, template);

    return template;
  }

  public async updateTemplate(payload: UpdateTemplateDto, id: string): Promise<TemplateLean> {
    const template = await this.repo.updateOne({ _id: id }, payload);

    if (!template) throw notFoundError('Template');

    const redisPattern = TEMPLATE_REDIS_KEYS.patterns.all();

    await this.cache.deleteByPattern(redisPattern);

    return template;
  }

  public async deleteTemplate(id: string) {
    const template = await this.repo.deleteById(id);

    if (!template) throw notFoundError('Template');

    const redisPattern = TEMPLATE_REDIS_KEYS.patterns.all();

    await this.cache.deleteByPattern(redisPattern);

    return template;
  }

  private async exists(filter: object): Promise<boolean> {
    return this.repo.exists(filter);
  }
}
