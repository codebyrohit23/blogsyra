import { Types } from 'mongoose';

import { randomUUID } from 'crypto';

export const convertToObjectId = (id: string): Types.ObjectId => new Types.ObjectId(id);

export const generateUniqueId = () => randomUUID();
