import { Router } from 'express';
import {
  createPermissionSchema,
  permissionPaginationSchema,
  updatePermissionSchema,
} from './schemas';
import { validate } from '@/middlewares/validate.middleware';
import { auth } from '@/middlewares/auth.middelware';
import { ADMIN_PERMISSIONS } from './permission.enum';
import { permissionController } from './permission.module';
import { zParamId } from '@/shared/schemas';
import { Role, ValidationSource } from '@/shared/constants';

export const permissionRoutes = Router();

permissionRoutes
  .route('/')
  .get(
    validate(permissionPaginationSchema, ValidationSource.QUERY),
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.ADMIN.PERMISSION.READ),
    permissionController.getPermissions
  )
  .post(
    validate(createPermissionSchema),
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.ADMIN.PERMISSION.CREATE),
    permissionController.getPermissions
  );

permissionRoutes
  .route('/:id')
  .get(validate(zParamId('id'), ValidationSource.PARAMS), permissionController.getPermission)
  .patch(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.ADMIN.PERMISSION.UPDATE),
    validate(zParamId('id'), ValidationSource.PARAMS),
    validate(updatePermissionSchema),
    permissionController.updatePermission
  )
  .delete(
    auth(Role.ADMIN),
    // requireAdminPermission(ADMIN_PERMISSIONS.ADMIN.PERMISSION.DELETE),
    validate(zParamId('id'), ValidationSource.PARAMS),
    permissionController.deletePermission
  );
