// import mongoose, { ClientSession, Query, Types } from 'mongoose';
// import { isDate } from 'node:util/types';
// import { notFoundError } from '@errors/index';
// import { NotificationDocument } from '../types/notification.type';
// import { NotificationRepository } from '../repositories/notification.repository';
// import { CreateNotificationInput, UpdateNotificationInput } from '../schemas/notification.schema';
// import { BaseService } from '@core/base.service';

// export class NotificationService extends BaseService<NotificationDocument, NotificationRepository> {
//   constructor() {
//     super(new NotificationRepository());
//   }

//   // getNotifications = async (
//   //   query: QueryNotificationInput
//   // ): Promise<PaginationResult<NotificationDocument>> => {
//   //   const { page, limit, search, isActive, sortBy, sortOrder } = query;

//   //   // Logic to fetch Notifications based on validated query parameters
//   //   const skip = (Number(page) - 1) * Number(limit);
//   //   const filter: any = {};

//   //   if (search) {
//   //     filter.$or = [
//   //       { name: { $regex: search, $options: 'i' } },
//   //       { description: { $regex: search, $options: 'i' } },
//   //     ];
//   //   }

//   //   if (isActive !== undefined) {
//   //     query.isActive = isActive === true;
//   //   }

//   //   const sortOptions: { [key: string]: 1 | -1 } = {
//   //     name: sortOrder === 'asc' ? 1 : -1,
//   //     createdAt: sortOrder === 'asc' ? 1 : -1,
//   //   };
//   //   return this.findWithPagination(filter, { page, limit, sort: sortOptions });
//   // };

//   // createNotification = async (payload: CreateNotificationInput): Promise<NotificationDocument> => {
//   //   return this.create({ ...payload, senderId: new Types.ObjectId(payload.senderId) });
//   // };

//   createNotification = async (
//     payload: CreateNotificationInput,
//     session?: ClientSession
//   ): Promise<NotificationDocument> => {
//     return this.repository.createNotification(payload, session);
//   };

//   getNotification = async (id: string): Promise<NotificationDocument> => {
//     const Notification = await this.findById(id);
//     if (!Notification) throw notFoundError('Notification');
//     return Notification;
//   };
//   updateNotification = async (
//     payload: UpdateNotificationInput,
//     id: string
//   ): Promise<NotificationDocument> => {
//     const Notification = await this.updateById(id, payload);
//     if (!Notification) throw notFoundError('Notification');
//     return Notification;
//   };
//   deleteNotification = async (id: string): Promise<NotificationDocument> => {
//     const Notification = await this.deleteById(id);
//     if (!Notification) throw notFoundError('Notification');
//     return Notification;
//   };
// }
