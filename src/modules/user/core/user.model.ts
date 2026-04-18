import { AccountStatus, Gender, MODELS } from '@/shared/constants';
import { Schema, model, InferSchemaType, HydratedDocument, Types } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },

    gender: {
      type: String,
      enum: Object.values(Gender),
    },

    dob: {
      type: Date,
    },

    bio: {
      type: String,
    },

    avatar: {
      type: String,
    },

    coverImage: {
      type: String,
    },

    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

UserSchema.index({ name: 'text' });

UserSchema.index({ status: 1 });

export const UserModel = model(MODELS.USER.CORE, UserSchema);

export type User = InferSchemaType<typeof UserSchema>;
export type UserDocument = HydratedDocument<User>;
export type UserLean = { _id: Types.ObjectId } & User;
