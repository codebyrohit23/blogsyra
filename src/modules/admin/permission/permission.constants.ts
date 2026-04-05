import { ADMIN_PERMISSIONS } from './permission.enum';
import { PermissionType } from './permission.type';

export const PERMISSIONS_ARRAY: Array<PermissionType> = Object.values(ADMIN_PERMISSIONS).flatMap(
  (resourcePermissions) => Object.values(resourcePermissions)
);
