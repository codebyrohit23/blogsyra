// import { Request, Response, NextFunction } from 'express';
// import { Types } from 'mongoose';
// import { AdminDocument, AdminService } from '@admin/admins';
// import { PermissionDocument, PermissionType } from '@admin/permission';
// import { forbiddenError, jwtExpiredError } from '@errors/index';
// import { RoleDocument } from '@admin/role';
// import { AdminRedisService } from '@admin/auth/auth.redis.service';
// import { AdminRolsAndPermissions } from '@admin/auth';

// const adminService = new AdminService();
// const adminRedis = new AdminRedisService();

// /**
//  * Fetch admin from Redis or DB and return structured RedisAdmin
//  */
// export async function getAdminWithRolsAndPermissions(id: string): Promise<AdminRolsAndPermissions> {
//   // 1️⃣ Try Redis
//   let admin = await adminRedis.getAdminWithRolsAndPermissions(id);
//   if (admin) return admin;

//   // 2️⃣ Fetch from DB with roles + permissions populated
//   const options = {
//     populate: [
//       {
//         path: 'roles',
//         match: { isActive: true },
//         select: 'permissions isSuperAdmin isActive',
//         populate: { path: 'permissions', select: 'resource action' },
//       },
//     ],
//     projection: 'roles',
//   };

//   const adminDoc = await adminService.findById(id, options);
//   if (!adminDoc) throw jwtExpiredError();

//   const roles = adminDoc.roles ?? [];
//   let isSuperAdmin = false;
//   const permissions: PermissionType[] = [];

//   // 3️⃣ Extract superadmin + permissions
//   if (!roles.some((role) => (role as any).isSuperAdmin)) {
//     const permissionSet = new Set<string>();

//     for (const role of roles) {
//       const roleDoc = role as unknown as RoleDocument;

//       if (roleDoc.isSuperAdmin) {
//         isSuperAdmin = true;
//         break; // no need to collect permissions
//       }

//       for (const perm of roleDoc.permissions || []) {
//         const permissionDoc = perm as unknown as PermissionDocument;
//         const key = `${permissionDoc.resource}:${permissionDoc.action}`;
//         if (!permissionSet.has(key)) {
//           permissionSet.add(key);
//           permissions.push({ resource: permissionDoc.resource, action: permissionDoc.action });
//         }
//       }
//     }
//   } else {
//     isSuperAdmin = true;
//   }

//   // 4️⃣ Build structured object
//   admin = {
//     _id: adminDoc._id.toString(),
//     roles: roles.map((r: any) => (r instanceof Types.ObjectId ? r.toString() : r._id.toString())),
//     isSuperAdmin,
//     permissions: isSuperAdmin ? [] : permissions,
//   };

//   // 5️⃣ Cache in Redis
//   await adminRedis.setAdminWithRolsAndPermissions(admin._id, admin);

//   return admin;
// }

// /**
//  * Middleware: check if admin has the required permission
//  */
// export const requireAdminPermission =
//   (permission: PermissionType) => async (req: Request, _res: Response, next: NextFunction) => {
//     try {
//       const id = req.user.sub;
//       const admin = await getAdminWithRolsAndPermissions(id);
//       // 1️⃣ SuperAdmin always allowed
//       if (admin.isSuperAdmin) return next();

//       // 2️⃣ Check permission
//       const hasPerm = admin.permissions.some(
//         (perm) => perm.resource === permission.resource && perm.action === permission.action
//       );

//       if (!hasPerm) {
//         throw forbiddenError();
//       }

//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
