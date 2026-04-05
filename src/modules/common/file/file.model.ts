// models/File.js

import mongoose, { Schema } from 'mongoose';
import { FileDocument, StorageProviderEnum, UploadStatusEnum } from './file.type';
import { FileOwnerEnum } from './fileOwner.type';
import { FileResourceEnum } from './fileResource.type';

const FileSchema = new Schema<FileDocument>(
  {
    // Storage + identity
    storageProvider: {
      type: String,
      enum: Object.values(StorageProviderEnum),
      default: StorageProviderEnum.S3,
      required: true,
    },
    bucket: { type: String, required: true },
    key: { type: String, required: true },
    url: { type: String, required: true },

    // file meta
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, index: true },
    size: { type: Number, required: true },
    checksum: { type: String, index: true }, // optional: md5/sha256 to dedupe

    // usage / lifecycle
    ownerType: {
      type: String,
      enum: Object.values(FileOwnerEnum),
      index: true,
    }, // e.g. 'user', 'admin', 'school'
    ownerId: { type: Schema.Types.ObjectId, index: true, refPath: 'ownerType' },

    // Context of usage
    resourceType: {
      type: String,
      enum: Object.values(FileResourceEnum),
      index: true,
    }, // e.g. 'profile', 'post', 'cover'
    resourceId: { type: Schema.Types.ObjectId, index: true, refPath: 'resourceType' },

    referenceCount: { type: Number, default: 0 }, // increment when other entities reference it
    used: { type: Boolean, default: false, index: true }, // quick flag: is file referenced/used
    lastAccessedAt: { type: Date, default: null }, // update when used/served
    expiresAt: { type: Date, default: null }, // optional: scheduled expiry (if you want TTL)

    // soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },

    // operator / audit
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    meta: { type: Schema.Types.Mixed },

    // if you want to mark a file as "temp" (uploaded but not used)
    uploadStatus: {
      type: String,
      enum: Object.values(UploadStatusEnum),
      default: UploadStatusEnum.TEMP,
      index: true,
    },

    // optional retention policy tag for lifecycle rules
    retentionTag: { type: String, default: null, index: true },
  },
  {
    timestamps: true,
  }
);

// Indexes and performance:
// - compound index for owner lookup (fast retrieving files for an entity)
FileSchema.index({ ownerType: 1, ownerId: 1, isDeleted: 1 });

// - find stale uploads quickly: uploaded but not used and older than X days
FileSchema.index({ uploadStatus: 1, createdAt: 1 });

// - TTL index example: if you want DB to auto-delete objects after expiresAt (use carefully)
// Note: TTL will remove the DB document only; you must delete the S3 object in your cleanup hook.
// mongoose will accept: FileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Instance / static helpers
 */
FileSchema.methods.incrementReference = function (n = 1) {
  this.referenceCount += n;
  if (this.referenceCount > 0) this.used = true;
  return this.save();
};

FileSchema.methods.decrementReference = function (n = 1) {
  this.referenceCount = Math.max(0, this.referenceCount - n);
  if (this.referenceCount === 0) this.used = false;
  return this.save();
};

FileSchema.statics.findUnusedOlderThan = function (days) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.find({
    used: false,
    isDeleted: false,
    createdAt: { $lte: cutoff },
  });
};

export const File = mongoose.model<FileDocument>('File', FileSchema);
