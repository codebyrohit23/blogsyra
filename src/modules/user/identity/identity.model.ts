import { EntityStatus, MODELS } from '@/shared/constants';
import { Schema, model, InferSchemaType, HydratedDocument, Types } from 'mongoose';

const IdentitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODELS.USER.PROFILE,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    // phone: {
    //   type: String,
    // },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    // phoneVerified: Boolean,

    status: {
      type: String,
      enum: EntityStatus,
      default: EntityStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

IdentitySchema.index({ userId: 1 }, { unique: true });
IdentitySchema.index({ email: 1 }, { unique: true });

export const IdentityModel = model(MODELS.USER.IDENTITY, IdentitySchema);

export type Identity = InferSchemaType<typeof IdentitySchema>;
export type IdentityDocument = HydratedDocument<Identity>;
export type IdentityLean = { _id: Types.ObjectId } & Identity;
