import mongoose, { HydratedDocument, InferSchemaType, Schema, Types } from 'mongoose';
import { ActionEnum } from './permission.type.js';
import { EntityStatus, MODELS } from '@/shared/constants';

const PermissionSchema = new Schema(
  {
    resource: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: Object.values(ActionEnum),
    },
    status: {
      type: String,
      enum: EntityStatus,
      default: EntityStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

PermissionSchema.index({ resource: 1, action: 1 }, { unique: true });

export const PermissionModel = mongoose.model(MODELS.ADMIN.PERMISSION, PermissionSchema);

export type Permission = InferSchemaType<typeof PermissionSchema>;

export type CreatePermissionInput = Omit<Permission, 'status' | 'createdAt' | 'updatedAt'>;
export type UpdatePermissionInput = Partial<Omit<Permission, 'createdAt' | 'updatedAt'>>;

export type PermissionDocument = HydratedDocument<Permission>;
export type PermissionLean = { _id: Types.ObjectId } & Permission;
