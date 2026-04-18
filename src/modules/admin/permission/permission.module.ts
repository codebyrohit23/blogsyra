import { cacheService } from '@/infra/cache';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';

const permissionRepository = new PermissionRepository();

export const permissionService = new PermissionService(permissionRepository, cacheService);

export const permissionController = new PermissionController(permissionService);
