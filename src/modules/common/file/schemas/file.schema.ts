import { z } from 'zod';

import { StorageProviderEnum, UploadStatusEnum } from '../file.type';
import { FileOwnerEnum } from '../fileOwner.type';
import { OBJECT_Id_REGEX } from '@/shared/utils';
import { FileResourceEnum } from '../fileResource.type';

/* ---------- Base Schema ---------- */
const fileBaseSchema = {
  storageProvider: z.nativeEnum(StorageProviderEnum).default(StorageProviderEnum.S3),

  bucket: z.string().min(1, 'Bucket name is required'),
  key: z.string().min(1, 'Object key is required'),
  url: z.string().url('Invalid URL'),

  originalName: z.string().min(1, 'Original name is required'),
  filename: z.string().min(1, 'Filename is required'),
  mimeType: z.string().optional(),
  size: z.number().positive('File size must be positive'),
  checksum: z.string().optional(),

  ownerType: z.nativeEnum(FileOwnerEnum).optional(),
  ownerId: z.string().regex(OBJECT_Id_REGEX, 'Owner is not a valid Id').optional(),

  resourceType: z.nativeEnum(FileResourceEnum).optional(),
  resourceId: z.string().regex(OBJECT_Id_REGEX, 'Resource is not a valid Id').optional(),

  referenceCount: z.number().default(0),
  used: z.boolean().default(false),

  lastAccessedAt: z.coerce.date().nullable().optional(),
  expiresAt: z.coerce.date().nullable().optional(),

  isDeleted: z.boolean().default(false),
  deletedAt: z.coerce.date().nullable().optional(),

  uploadedBy: z.string().optional(),

  // Meta without `any` type
  // meta: z
  //   .record(
  //     z.union([
  //       z.string(),
  //       z.number(),
  //       z.boolean(),
  //       z.array(z.string()),
  //       z.object({}).passthrough(),
  //     ])
  //   )
  //   .optional(),

  uploadStatus: z.nativeEnum(UploadStatusEnum).default(UploadStatusEnum.TEMP),

  retentionTag: z.string().nullable().optional(),
};

/* ---------- Create File Schema ---------- */
export const createFileSchema = z.object({
  ...fileBaseSchema,
  originalName: fileBaseSchema.originalName,
  filename: fileBaseSchema.filename,
  bucket: fileBaseSchema.bucket,
  key: fileBaseSchema.key,
  url: fileBaseSchema.url,
  size: fileBaseSchema.size,
});

/* ---------- Update File Schema ---------- */
export const updateFileSchema = z
  .object({
    ...fileBaseSchema,
  })
  .partial() // All fields optional for updates
  .strict()
  .refine((data) => !data.key && !data.bucket, {
    message: 'Bucket or key cannot be changed after upload.',
    path: ['key'],
  });

/* ---------- Types ---------- */
export type CreateFileInput = z.infer<typeof createFileSchema>;
export type UpdateFileInput = z.infer<typeof updateFileSchema>;
