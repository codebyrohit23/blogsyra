// import { Types } from 'mongoose';
// import { FileOwnerEnum } from './fileOwner.type';
// import { FileResourceEnum } from './fileResource.type';
// import { BaseDocument } from '@/types';

// export enum StorageProviderEnum {
//   S3 = 's3',
//   GCS = 'gcs',
//   AZURE = 'azure',
//   MINIO = 'minio',
//   CLOUDINARY = 'cloudinary',
// }

// export interface FileMeta {
//   width?: number;
//   height?: number;
//   duration?: number;
//   tags?: string[];
//   [key: string]: string | number | boolean | string[] | number[] | undefined;
// }

// export enum UploadStatusEnum {
//   TEMP = 'temp',
//   UPLOADED = 'uploaded',
//   REISTERED = 'registered',
//   ARCHIVED = 'archived',
//   DELETED = 'deleted',
// }

// export interface FileDocument extends BaseDocument {
//   storageProvider: StorageProviderEnum;
//   bucket: string;
//   key: string;
//   url: string;

//   originalName: string;
//   filename: string;
//   mimeType?: string;
//   size: number;
//   checksum?: string;

//   ownerType?: FileOwnerEnum;
//   ownerId?: Types.ObjectId;

//   resourceType?: FileResourceEnum;
//   resourceId?: Types.ObjectId;

//   referenceCount: number;
//   used: boolean;
//   lastAccessedAt?: Date | null;
//   expiresAt?: Date | null;

//   isDeleted: boolean;
//   deletedAt?: Date | null;

//   uploadedBy?: Types.ObjectId;
//   meta?: FileMeta;

//   uploadStatus: UploadStatusEnum;
//   retentionTag?: string | null;
// }

// export interface FinalizeUpload {
//   id: string | Types.ObjectId;
//   folderName: string;
//   ownerId: string;
//   ownerType: FileOwnerEnum;
//   resourceType: FileResourceEnum;
//   resourceId: string;
//   uploadedBy: string;
// }
