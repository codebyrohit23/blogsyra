import path from 'path';
import { FileOwnerEnum } from './fileOwner.type';
import { FileResourceEnum } from './fileResource.type';
import { appConfig } from '@/config';

interface FilePathOptions {
  ownerType: FileOwnerEnum;
  ownerId: string;
  resourceType?: FileResourceEnum;
  resourceId?: string;
  purpose?: string;
  //   filename: string;
  env?: 'dev' | 'prod';
}

export const generateCloudPath = (options: FilePathOptions): string => {
  const {
    env = appConfig.NODE_ENV === 'production' ? 'prod' : 'dev',
    ownerType,
    ownerId,
    resourceType,
    resourceId,
    purpose,
    // filename,
  } = options;

  // Compose path cleanly
  const parts = [env, ownerType, ownerId];
  if (resourceType) parts.push(resourceType);
  if (resourceId) parts.push(resourceId);
  if (purpose) parts.push(purpose);

  //   return path.posix.join(...parts, filename);
  return path.posix.join(...parts);
};
