import { Router } from 'express';
import { auth, validate } from '@/middlewares';
import { createAdminSchema, adminPaginationSchema, updateAdminSchema } from './schemas';
import { adminController } from './admin.module';
import { ADMIN_PERMISSIONS } from '@/modules/admin/permission';
import { zParamId } from '@/shared/schemas';
import { Role, ValidationSource } from '@/shared/constants';

export const adminUsersRoutes = Router();

adminUsersRoutes
  .route('/')
  .get(validate(adminPaginationSchema, ValidationSource.QUERY), adminController.getAdmins)
  .post(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.ADMIN.ADMIN.CREATE),
    validate(createAdminSchema),
    adminController.createAdmin
  );

adminUsersRoutes
  .route('/:id')
  .get(validate(zParamId('id'), ValidationSource.QUERY), adminController.getAdmin)
  .patch(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.ADMIN.ADMIN.UPDATE),
    validate(zParamId('id'), ValidationSource.QUERY),
    validate(updateAdminSchema),
    adminController.updateAdmin
  )
  .delete(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.ADMIN.ADMIN.DELETE),
    validate(zParamId('id'), ValidationSource.QUERY),
    adminController.deleteAdmin
  );
