import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { AdminService } from './admin.service';
import { cacheService } from '@/core/cache';

const adminRepository = new AdminRepository();

export const adminService = new AdminService(adminRepository, cacheService);

export const adminController = new AdminController(adminService);
