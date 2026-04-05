import { TemplateController } from './template.controller';
import { TemplateRepository } from './template.repository';
import { TemplateService } from './template.service';
import { cacheService } from '@/core/cache';

const templateRepository = new TemplateRepository();

const templateService = new TemplateService(templateRepository, cacheService);

export const templateController = new TemplateController(templateService);
