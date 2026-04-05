import { forbiddenError } from '@/core/error';
import { logger } from '@/core/logger';
import { adminService } from '@/modules/admin/admins';
import { permissionService } from '@/modules/admin/permission/permission.module';
import { PermissionType } from '@/modules/admin/permission/permission.type';
import { roleService } from '@/modules/admin/role';
import { asyncHandler } from '@/shared/utils';
import { Request, Response, NextFunction } from 'express';

export const requireAdminPermission = (payload: PermissionType) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const id = req.user.sub;

    const admin = await adminService.getAdminById(id);

    if (!admin || !admin.roleId) throw forbiddenError();

    const permission = await permissionService.getPermission(payload);

    if (!permission) throw forbiddenError();

    const { permissions } = await roleService.getRole(admin.roleId.toString());

    if (!permissions || !permissions.length) throw forbiddenError();

    const hasPermission = permissions.find((perm) => perm._id === permission._id);

    if (!hasPermission) throw forbiddenError();

    next();
  });

// export const requireUserPermission = (permission: string) =>
//   asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
//     const user = req.user as UserPayload; // auth middleware attached user
//     if (!user) throw forbiddenError('Not authenticated');

//     if (!user.role.permissions.includes(permission)) {
//       throw forbiddenError('You do not have permission');
//     }

//     next();
//   });
