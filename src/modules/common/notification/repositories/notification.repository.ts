// import { BaseRepository } from '@core/base.repository';
// import { Notification } from '../models/notification.model';
// import { NotificationDocument } from '../types/notification.type';
// import { CreateNotificationInput } from '../schemas/notification.schema';
// import { ClientSession } from 'mongoose';

// export class NotificationRepository extends BaseRepository<NotificationDocument> {
//   constructor() {
//     super(Notification);
//   }

//   async createNotification(
//     payload: CreateNotificationInput,
//     session?: ClientSession
//   ): Promise<NotificationDocument> {
//     return this.model.create([{ ...payload }], { session }).then((res) => res[0]);
//   }
// }
