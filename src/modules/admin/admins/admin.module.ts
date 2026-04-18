import { AdminCacheVersion } from './admin.cache';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { AdminService } from './admin.service';
import { cacheService, cacheVersionService } from '@/infra/cache';

const adminRepository = new AdminRepository();
const adminCacheVersion = new AdminCacheVersion(cacheVersionService);

export const adminService = new AdminService(adminRepository, cacheService, adminCacheVersion);

export const adminController = new AdminController(adminService);
