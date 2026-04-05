import { cacheService } from '@/core/cache';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

const roleRepository = new RoleRepository();
export const roleService = new RoleService(roleRepository, cacheService);

export const roleController = new RoleController(roleService);
