import mongoose, { HydratedDocument, InferSchemaType, Schema, Types } from 'mongoose';
import { EntityStatus, MODELS } from '@/shared/constants';

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: MODELS.ADMIN.PERMISSION,
      },
    ],
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 255,
    },
    status: {
      type: String,
      enum: Object.values(EntityStatus),
      default: EntityStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

RoleSchema.index({ name: 1 }, { unique: true });
RoleSchema.index({ isActive: 1 });
RoleSchema.index({ isActive: 1, isSuperAdmin: 1 });

export const RoleModel = mongoose.model(MODELS.ADMIN.ROLE, RoleSchema);

export type Role = InferSchemaType<typeof RoleSchema>;

export type CreateRoleInput = Omit<Role, 'status' | 'createdAt' | 'updatedAt'>;
export type UpdateRoleInput = Partial<Omit<Role, 'createdAt' | 'updatedAt'>>;

export type RoleDocument = HydratedDocument<Role>;
export type RoleLean = { _id: Types.ObjectId } & Role;
