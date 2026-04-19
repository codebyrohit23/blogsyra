import { MODELS } from '@/shared/constants';
import { MongoId } from '@/shared/types';

interface FileBase {
  storageProvider: StorageProvider;
  bucket: string;
  key: string;
  url: string;
  mimeType: string;
  size: number;
  checksum?: string;
  ownerType?: FileOwnerRef;
  ownerId?: MongoId;
  resourceType?: FileOwnerRef;
  resourceId?: MongoId;
  meta?: unknown;
  status: FileStatus;
}

export type CreateFileInput = Omit<FileBase, 'status'>;
export type UpdateFileInput = Partial<FileBase>;

export enum StorageProvider {
  S3 = 's3',
  AZURE = 'azure',
  CLOUDINARY = 'cloudinary',
}

export interface FileMeta {
  width?: number;
  height?: number;
  duration?: number;
  tags?: string[];
  [key: string]: string | number | boolean | string[] | number[] | undefined;
}

export enum FileStatus {
  TEMP = 'temp',
  ACTIVE = 'active',
  DELETED = 'deleted',
}

export const FileOwnerRef = {
  USER: MODELS.USER.CORE,
  ADMIN: MODELS.ADMIN.ADMIN,
} as const;

export type FileOwnerRef = (typeof FileOwnerRef)[keyof typeof FileOwnerRef];

export const FileResourceRef = {
  USER: MODELS.USER.CORE,
  TEMPLATE: MODELS.TEMPLATE,
  ADMIN: MODELS.ADMIN.ADMIN,
} as const;

export type FileResourceRef = (typeof FileResourceRef)[keyof typeof FileResourceRef];

// export interface FinalizeUpload {
//   id: string;
//   folderName: string;
//   ownerId: string;
//   ownerType: FileOwnerRef;
//   resourceType: FileResourceEnum;
//   resourceId: string;
//   uploadedBy: string;
// }
