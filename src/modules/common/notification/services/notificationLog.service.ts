import { ClientSession } from 'mongoose';
import { notFoundError } from '@errors/index';
import { convertToObjectId } from '@utils/index';
import { NotificationLogDocument } from '../types/notificationLog.type';
import { NotificationLogRepository } from '../repositories/notificationLog.repository';
import {
  CreateNotificationLogInput,
  UpdateNotificationLogInput,
} from '../schemas/notificationLog.schema';
import { BaseService } from '@core/base.service';

export class NotificationLogService extends BaseService<NotificationLogDocument> {
  constructor() {
    super(new NotificationLogRepository());
  }

  private BATCH_SIZE: number = 100;

  //   getNotificationLogs = async (
  //     query: QueryNotificationLogInput
  //   ): Promise<PaginationResult<NotificationLogDocument>> => {
  //     const { page, limit, search, isActive, sortBy, sortOrder } = query;

  //     // Logic to fetch NotificationLogs based on validated query parameters
  //     const skip = (Number(page) - 1) * Number(limit);
  //     const filter: any = {};

  //     if (search) {
  //       filter.$or = [
  //         { name: { $regex: search, $options: 'i' } },
  //         { description: { $regex: search, $options: 'i' } },
  //       ];
  //     }

  //     if (isActive !== undefined) {
  //       query.isActive = isActive === true;
  //     }

  //     const sortOptions: { [key: string]: 1 | -1 } = {
  //       name: sortOrder === 'asc' ? 1 : -1,
  //       createdAt: sortOrder === 'asc' ? 1 : -1,
  //     };
  //     return this.findWithPagination(filter, { page, limit, sort: sortOptions });
  //   };

  async createNotificationLogs(payload: CreateNotificationLogInput[], session?: ClientSession) {
    for (let i = 0; i < payload.length; i += this.BATCH_SIZE) {
      const chunk = payload.slice(i, i + this.BATCH_SIZE);

      const logsPyload = chunk.map((log) => ({
        ...log,
        notificationId: convertToObjectId(log.notificationId),
        receiverId: convertToObjectId(log.receiverId),
      }));

      await this.repository.insertMany(logsPyload, session);
    }
  }

  createNotificationLog = async (
    payload: CreateNotificationLogInput
  ): Promise<NotificationLogDocument> => {
    const notificationLogPayload = {
      ...payload,
      notificationId: convertToObjectId(payload.notificationId),
      receiverId: convertToObjectId(payload.receiverId),
    };

    return this.create(notificationLogPayload);
  };

  getNotificationLog = async (id: string): Promise<NotificationLogDocument> => {
    const options = {
      populate: [
        { path: 'notificationId' },
        { path: 'receiverId' },
        { path: 'notificationId.senderId' },
      ],
    };

    const notificationLog = await this.findById(id, options);

    if (!notificationLog) throw notFoundError('NotificationLog');

    return notificationLog;
  };

  updateNotificationLog = async (
    id: string,
    payload: UpdateNotificationLogInput
  ): Promise<NotificationLogDocument> => {
    const NotificationLog = await this.updateById(id, payload);

    if (!NotificationLog) throw notFoundError('NotificationLog');

    return NotificationLog;
  };

  deleteNotificationLog = async (id: string): Promise<NotificationLogDocument> => {
    const NotificationLog = await this.deleteById(id);
    if (!NotificationLog) throw notFoundError('NotificationLog');
    return NotificationLog;
  };
}
