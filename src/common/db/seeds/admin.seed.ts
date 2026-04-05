// import { AdminService } from '@admin/admins/admin.service.js';
// import { RoleService } from '@admin/role/role.service.js';

// const adminService = new AdminService();
// const roleService = new RoleService();

// export const adminSeeds = async (): Promise<void> => {
//   const roles = await roleService.findAll({ projection: { name: 1, _id: 1 } });
//   if (!roles.length) return;

//   for (const { name, _id } of roles) {
//     if (!name || !_id) continue;
//     await adminService.updateMany({ roleName: name }, { $addToSet: { roles: _id } });
//   }
// };

// // touch admin.controller.ts admin.model.ts admin.repository.ts admin.schema.ts admin.service.ts admin.type.ts
