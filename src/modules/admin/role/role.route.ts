import { Router } from 'express';
import { auth, validate } from '@/middlewares';
import { roleController } from './role.module';
import { ADMIN_PERMISSIONS } from '../permission';
import { createRoleSchema, rolePaginationSchema, updateRoleSchema } from './schemas';
import { Role, ValidationSource } from '@/shared/constants';
import { zParamId } from '@/shared/schemas';

export const adminRoleRoutes = Router();

adminRoleRoutes
  .route('/')

  .get(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.ADMIN.PERMISSION.READ),
    validate(rolePaginationSchema, ValidationSource.QUERY),
    roleController.getRoles
  )

  .post(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.ADMIN.ROLE.CREATE),
    validate(createRoleSchema),
    roleController.createRole
  );

adminRoleRoutes
  .route('/:id')

  .get(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.ADMIN.PERMISSION.READ),
    validate(zParamId('id'), ValidationSource.PARAMS),
    roleController.getRole
  )

  .patch(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.ADMIN.PERMISSION.UPDATE),
    validate(zParamId('id'), ValidationSource.PARAMS),
    validate(updateRoleSchema),
    roleController.updateRole
  )

  .delete(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.ADMIN.PERMISSION.UPDATE),
    validate(zParamId('id'), ValidationSource.PARAMS),
    validate(updateRoleSchema),
    roleController.deleteRole
  );
