import { cloudinaryService } from '@/infra/storage';
import { FileCacheVersion } from './file.cache';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { cacheService, cacheVersionService } from '@/infra/cache';

const fileRepository = new FileRepository();
const fileCacheVersion = new FileCacheVersion(cacheVersionService);

export const fileService = new FileService(
  fileRepository,
  cacheService,
  fileCacheVersion,
  cloudinaryService
);

export const fileController = new FileController(fileService);
