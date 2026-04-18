import { Types } from 'mongoose';

import { randomUUID } from 'crypto';
import { MongoId } from '../types';

// export const convertToObjectId = (id: MongoId): Types.ObjectId => new Types.ObjectId(id);

export const toObjectId = (id: MongoId): Types.ObjectId => {
  if (id instanceof Types.ObjectId) return id;

  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId');
  }

  return new Types.ObjectId(id);
};

export const toStringId = (id: MongoId): string => {
  return typeof id === 'string' ? id : id.toString();
};

export const generateUniqueId = () => randomUUID();
