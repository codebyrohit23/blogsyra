import mongoose, { HydratedDocument, InferSchemaType, Schema, Types } from 'mongoose';

import { DEFAULT_LANGUAGE, DEFAULT_TIMEZONE, EntityStatus, MODELS } from '@/shared/constants';
import { EMAIL_REGEX } from '@/shared/utils';
import { AccountStatus } from '@/shared/constants/enums';

const AdminSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, 'Please enter a valid email'],
      index: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    passwordChangedAt: {
      type: Date,
      select: false,
    },

    roleId: {
      type: Schema.Types.ObjectId,
      ref: MODELS.ADMIN.ROLE,
    },

    avatar: {
      type: Schema.Types.ObjectId,
      ref: MODELS.COMMON.FILE,
    },

    timezone: {
      type: String,
      default: DEFAULT_TIMEZONE,
    },
    language: {
      type: String,
      default: DEFAULT_LANGUAGE,
      maxlength: [5, 'Language code cannot exceed 5 characters'],
    },

    // Account Status
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },

    // Metadata
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },

    // Audit Fields
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: MODELS.ADMIN.ADMIN,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: MODELS.ADMIN.ADMIN,
    },
  },
  {
    timestamps: true,
    collection: 'admins',
  }
);

// Indexes
AdminSchema.index({ role: 1 });
AdminSchema.index({ email: 1, status: 1 });
AdminSchema.index({ createdAt: -1 });

// Text search index
AdminSchema.index({
  name: 'text',
  email: 'text',
});

export const AdminModel = mongoose.model(MODELS.ADMIN.ADMIN, AdminSchema);

export type Admin = InferSchemaType<typeof AdminSchema>;

export type AdminDocument = HydratedDocument<Admin>;
export type AdminLean = { _id: Types.ObjectId } & Admin;
