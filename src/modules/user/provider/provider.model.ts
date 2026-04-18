import { AuthProvider, MODELS } from '@/shared/constants';
import { Schema, model, InferSchemaType, HydratedDocument, Types } from 'mongoose';

const ProviderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODELS.USER.CREDENTIAL,
      required: true,
    },

    providerId: {
      type: String,
      required: true,
    },

    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      required: true,
    },
  },
  { timestamps: true }
);

ProviderSchema.index({ userId: 1, provider: 1 }, { unique: true });

ProviderSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export const ProviderModel = model(MODELS.USER.AUTH_PROVIDER, ProviderSchema);

export type Provider = InferSchemaType<typeof ProviderSchema>;
export type ProviderDocument = HydratedDocument<Provider>;
export type ProviderLean = { _id: Types.ObjectId } & Provider;
