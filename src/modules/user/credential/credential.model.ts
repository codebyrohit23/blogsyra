import { MODELS } from '@/shared/constants';
import { Schema, model, InferSchemaType, HydratedDocument, Types } from 'mongoose';

const CredentialSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODELS.USER.CREDENTIAL,
      required: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
  },
  { timestamps: true }
);

CredentialSchema.index({ userId: 1 }, { unique: true });

export const CredentialModel = model(MODELS.USER.CREDENTIAL, CredentialSchema);

export type Credential = InferSchemaType<typeof CredentialSchema>;
export type CredentialDocument = HydratedDocument<Credential>;
export type CredentialLean = { _id: Types.ObjectId } & Credential;
