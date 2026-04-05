import Router from 'express';
import { adminAuth, requireAdminPermission, validate } from '@/middlewares';
import { PERMISSIONS } from '@admin/permission';
import { validateId } from '@/schema';
import { NotificationLogController } from './notification.controller';

export const NotificationRouter = Router();

const controller = new NotificationLogController();

NotificationRouter.route('/')

  // .get(validate(queryTemplateSchema, 'query'), controller.getTemplates)

  .post(adminAuth, controller.createNotificationLog);

// TemplateRouter.route('/:id')
//   .get(validate(validateId, 'params'), controller.getTemplate)
//   .patch(
//     adminAuth,
//     requireAdminPermission(PERMISSIONS.TEMPLATE.UPDATE),
//     validate(validateId),
//     validate(updateTemplateSchema),
//     controller.updateTemplate
//   )
//   .delete(
//     adminAuth,
//     requireAdminPermission(PERMISSIONS.TEMPLATE.DELETE),
//     validate(validateId, 'params'),
//     controller.deleteTemplate
//   );
