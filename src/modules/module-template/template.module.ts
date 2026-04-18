import { TemplateCacheVersion } from './template.cache';
import { TemplateController } from './template.controller';
import { TemplateRepository } from './template.repository';
import { TemplateService } from './template.service';
import { cacheService, cacheVersionService } from '@/infra/cache';

const templateRepository = new TemplateRepository();
const templateCacheVersion = new TemplateCacheVersion(cacheVersionService);

const templateService = new TemplateService(templateRepository, cacheService, templateCacheVersion);

export const templateController = new TemplateController(templateService);
