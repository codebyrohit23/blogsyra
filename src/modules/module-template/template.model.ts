import { MODELS } from '@/shared/constants';
import { EntityStatus } from '@/shared/constants/enums';
import { Schema, model, InferSchemaType, HydratedDocument, Types } from 'mongoose';

const TemplateSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    description: String,
    tags: [String],
    createdBy: { type: Schema.Types.ObjectId, ref: MODELS.USER.CORE, required: true },
    status: {
      type: String,
      enum: Object.values(EntityStatus),
      default: EntityStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

// indexes
TemplateSchema.index({ name: 1 }, { unique: true });
TemplateSchema.index({ status: 1, createdBy: 1 });

export const TemplateModel = model(MODELS.TEMPLATE, TemplateSchema);

export type Template = InferSchemaType<typeof TemplateSchema>;

// export type CreateTemplateInput = Omit<Template, 'status' | 'createdAt' | 'updatedAt'>;
// export type UpdateTemplateInput = Partial<Omit<Template, 'createdAt' | 'updatedAt'>>;

export type TemplateDocument = HydratedDocument<Template>;
export type TemplateLean = { _id: Types.ObjectId } & Template;
