// import { Types } from 'mongoose';

// import { PermissionService } from '@admin/permission/index.js';
// import roleData from './data/roles.json' with { type: 'json' };
// import { RoleDocument, RoleService } from '@admin/role/index.js';
// import { logger } from '@utils/index';
// import { LogMetadata } from '@/types';

// const permissionService = new PermissionService();
// const roleService = new RoleService();

// export const roleSeeds = async (): Promise<void> => {
//   try {
//     const excludePermissions = ['role', 'permission'];
//     if (!roleData?.length) return;
//     const permissions = await permissionService.findAll();
//     const adminPermissions: Types.ObjectId[] = permissions
//       ?.filter(
//         (permission) =>
//           excludePermissions.includes(permission.resource) || permission.action !== 'create'
//       )
//       ?.map((permission) => permission._id as Types.ObjectId);

//     for (const {
//       name,
//       isSystem,
//       description,
//       isActive,
//       isSuperAdmin,
//     } of roleData as RoleDocument[]) {
//       let permissions: Types.ObjectId[] = [];
//       if (!isSuperAdmin) permissions = [...adminPermissions];
//       const isExist = await roleService.findOne({ name });
//       if (isExist)
//         await roleService.updateOne(
//           { name },
//           { $addToSet: { permissions: { $each: permissions } } }
//         );
//       else
//         await roleService.create({
//           name,
//           isSuperAdmin,
//           isSystem,
//           description,
//           isActive,
//           permissions,
//         });
//     }
//   } catch (error) {
//     logger.error('error in seed roles', error as LogMetadata);
//   }
// };
