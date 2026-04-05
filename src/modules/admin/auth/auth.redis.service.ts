// import { RedisKeys, RedisService } from '@db/redis/index';
// import { AdminDocument } from '@admin/admins';
// import { AdminRolsAndPermissions } from './auth.type';

// export class AdminRedisService extends RedisService {
//   async setAdmin(adminId: string, admin: AdminDocument): Promise<void> {
//     return this.set(RedisKeys.ADMIN.PROFILE.key(adminId), admin);
//   }
//   async getAdmin(adminId: string): Promise<AdminDocument | null> {
//     return this.get(RedisKeys.ADMIN.PROFILE.key(adminId));
//   }

//   async revokeAdmin(adminId: string): Promise<void> {
//     return this.del(RedisKeys.ADMIN.PROFILE.key(adminId));
//   }

//   async setAdminWithRolsAndPermissions(adminId: string, payload: AdminRolsAndPermissions) {
//     return this.set(RedisKeys.ADMIN.ROLES.key(adminId), payload);
//   }
//   async getAdminWithRolsAndPermissions(adminId: string): Promise<AdminRolsAndPermissions | null> {
//     return this.get(RedisKeys.ADMIN.ROLES.key(adminId));
//   }
// }
