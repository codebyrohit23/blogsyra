import { Router } from 'express';
import { auth, validate } from '@/middlewares/index';
import { createTemplateSchema, templatePaginationSchema, updateTemplateSchema } from './schemas';
import { templateController } from './template.module';
import { ADMIN_PERMISSIONS } from '@/modules/admin/permission';
import { zParamId } from '@/shared/schemas';
import { Role, ValidationSource } from '@/shared/constants';

export const templateRoutes = Router();

templateRoutes
  .route('/')
  .get(validate(templatePaginationSchema, ValidationSource.QUERY), templateController.getTemplates)
  .post(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.TEMPLATE.CREATE),
    validate(createTemplateSchema),
    templateController.createTemplate
  );

templateRoutes
  .route('/:id')
  .get(validate(zParamId('id'), ValidationSource.QUERY), templateController.getTemplate)
  .patch(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.TEMPLATE.UPDATE),
    validate(zParamId('id'), ValidationSource.QUERY),
    validate(updateTemplateSchema),
    templateController.updateTemplate
  )
  .delete(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.TEMPLATE.DELETE),
    validate(zParamId('id'), ValidationSource.QUERY),
    templateController.deleteTemplate
  );
