import { EntityStatus } from '@/shared/constants';
import { MongoId } from '@/shared/types';

export interface TemplateBase {
  name: string;
  description?: string;
  tags: Array<string>;
  createdBy: MongoId;
  status: EntityStatus;
}

export type CreateTemplateInput = Omit<TemplateBase, 'status'>;

export type UpdateTemplateInput = Partial<Omit<TemplateBase, 'createdBy'>>;
