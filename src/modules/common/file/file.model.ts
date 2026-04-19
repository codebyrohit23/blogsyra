import mongoose, { HydratedDocument, InferSchemaType, Schema, Types } from 'mongoose';
import { FileOwnerRef, FileResourceRef, FileStatus, StorageProvider } from './file.types';
import { MODELS } from '@/shared/constants';

const FileSchema = new Schema(
  {
    storageProvider: {
      type: String,
      enum: Object.values(StorageProvider),
      default: StorageProvider.CLOUDINARY,
      required: true,
    },

    bucket: { type: String, required: true },

    key: { type: String, required: true },
    url: { type: String, required: true },

    // originalName: { type: String, required: true },
    // filename: { type: String, required: true },

    mimeType: { type: String },
    size: { type: Number, required: true },

    checksum: { type: String },

    ownerType: {
      type: String,
      enum: Object.values(FileOwnerRef),
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      refPath: 'ownerType',
    },

    resourceType: {
      type: String,
      enum: Object.values(FileResourceRef),
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      refPath: 'resourceType',
    },

    meta: { type: Schema.Types.Mixed },

    status: {
      type: String,
      enum: Object.values(FileStatus),
      default: FileStatus.TEMP,
    },

    deletedAt: Date,

    retentionTag: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

FileSchema.index({ key: 1 }, { unique: true });

FileSchema.index({ ownerId: 1, ownerType: 1 });

FileSchema.index({ resourceId: 1, resourceType: 1 });

FileSchema.index({ status: 1 });

FileSchema.index({ url: 1 });

FileSchema.index({ deletedAt: 1 });

FileSchema.index({ checksum: 1 });

FileSchema.index({ status: 1, createdAt: -1 });

FileSchema.index({ mimeType: 1 });

export const FileModel = mongoose.model(MODELS.COMMON.FILE, FileSchema);

export type File = InferSchemaType<typeof FileSchema>;
export type FileDocument = HydratedDocument<File>;
export type FileLean = { _id: Types.ObjectId } & File;
