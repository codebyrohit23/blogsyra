// import { ApiResponse, LogMetadata } from '@/types';
// import { asyncHandler, convertToObjectId, logger, sendResponse } from '@utils/index';

// import { Request, Response } from 'express';
// import { BaseRepository } from '@core/base.repository';
// import { NotificationLogService } from './services/notificationLog.service';
// import { NotificationLogDocument, ReceiverTypeEnum } from './types/notificationLog.type';
// import { HttpStatus } from '@/constants/enums';
// import { NotificationLog } from './models/notificationLog.model';
// import {
//   NotificationChannelEnum,
//   NotificationPriorityEnum,
//   NotificationType,
//   SenderEnum,
// } from './types/notification.type';
// import { AdminService } from '@admin/admins';
// import { NotificationManager } from './notification.manager';

// export class NotificationLogController extends BaseRepository<NotificationLogDocument> {
//   constructor() {
//     super(NotificationLog);
//   }

//   private notificationLogService = new NotificationLogService();

//   private adminService = new AdminService();

//   private notificationManager = new NotificationManager();

//   // getNotificationLogs = asyncHandler(
//   //   async (req: Request, res: Response<ApiResponse<NotificationLogDocument[]>>) => {
//   //     const query = PaginatedQuerySchema.parse(req.query);
//   //     const NotificationLogs = await this.notificationLogService.getNotificationLogs(query);
//   //     sendResponse(res, {
//   //       statusCode: HttpStatus.CREATED,
//   //       message: 'Admin created successfully',
//   //       data: NotificationLogs.data,
//   //       pagination: NotificationLogs.pagination,
//   //     });
//   //   }
//   // );

//   createNotificationLog = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
//     const receiverIds = await this.adminService.findAll({}, { projection: '_id' });
//     const payload = {
//       type: NotificationType.SYSTEM_ALERT,
//       title: 'Test Email - Please Ignore',
//       message: `Hi ,I hope this message finds you well.I'm sending this email as a test, so please disregard it if it isn't relevant to you.If you receive this, kindly confirm that everything is working on your end.Thanks for your time!Best regards,[Your Name][Your Contact Information, if needed]`,
//       senderType: SenderEnum.ADMIN,
//       senderId: convertToObjectId(req.user.sub),
//       channel: [NotificationChannelEnum.EMAIL, NotificationChannelEnum.PUSH],
//       receiverType: ReceiverTypeEnum.ADMIN,
//       receiverIds: receiverIds?.map((reciver) => reciver._id),
//       priority: NotificationPriorityEnum.NORMAL,
//     };

//     await this.notificationManager.createAndDispatchAsync(payload);
//     sendResponse(res, { message: 'notification schuled successgully' });
//   });

//   getNotificationLog = asyncHandler(
//     async (req: Request, res: Response<ApiResponse<NotificationLogDocument>>) => {
//       const id = req.params.id;
//       const NotificationLog = await this.notificationLogService.getNotificationLog(id);
//       sendResponse(res, {
//         statusCode: HttpStatus.CREATED,
//         data: NotificationLog,
//       });
//     }
//   );

//   updateNotificationLog = asyncHandler(
//     async (req: Request, res: Response<ApiResponse<NotificationLogDocument>>) => {
//       const id = req.params.id;
//       const NotificationLog = await this.notificationLogService.updateNotificationLog(id, req.body);
//       sendResponse(res, {
//         statusCode: HttpStatus.OK,
//         message: 'NotificationLog updated successfully',
//         data: NotificationLog,
//       });
//     }
//   );

//   deleteNotificationLog = asyncHandler(async (req: Request, res: Response<ApiResponse<null>>) => {
//     const id = req.params.id;
//     await this.notificationLogService.deleteNotificationLog(id);
//     sendResponse(res, {
//       statusCode: HttpStatus.OK,
//       message: 'NotificationLog delted successfully',
//       data: null,
//     });
//   });
// }
