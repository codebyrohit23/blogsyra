// import { PermissionService } from '@/modules/admin/permission/permission.service.js';
// import permissionData from './data/permissions.json' with { type: 'json' };
// import { PermissionDocument } from '@/modules/admin/permission/permission.type.js';

// const permissionService = new PermissionService();

// export const permissionSeeds = async (): Promise<void> => {
//   if (!permissionData?.length) return;
//   for (const {
//     resource,
//     action,
//     description,
//     isActive,
//   } of permissionData as PermissionDocument[]) {
//     await permissionService.updateOne(
//       { resource, action },
//       { resource, action, description, isActive },
//       { upsert: true }
//     );
//   }
// };
