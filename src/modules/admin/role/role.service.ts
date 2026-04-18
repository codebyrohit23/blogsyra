import { CacheService } from '@/infra/cache';
import { RoleRepository } from './role.repository';
import { RoleDocument, RoleLean } from './role.model';
import { ApiError } from '@/shared/utils';
import { EntityStatus, HttpStatus, SortOrder } from '@/shared/constants';
import { ROLE_REDIS_KEYS } from './role.redis-keys';
import { notFoundError } from '@/core/error';
import { CreateRoleDto, RolePaginationDto, UpdateRoleDto } from './schemas';
import { PaginationResult } from '@/core/db/toolkit';

export class RoleService {
  constructor(
    private readonly repo: RoleRepository,
    private readonly cache: CacheService
  ) {}

  public async getRoles(query: RolePaginationDto): Promise<PaginationResult<RoleLean>> {
    const redisKey = ROLE_REDIS_KEYS.rolesList(query);

    const cached = await this.cache.get<PaginationResult<RoleLean>>(redisKey);
    if (cached) return cached;

    const { page, limit, search, status, sortBy, sortOrder } = query;

    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
    };

    const result = await this.repo.paginate({
      filter,
      sort,
      page,
      limit,
    });

    if (result) {
      await this.cache.set(redisKey, result);
    }

    return result;
  }

  public async createRole(payload: CreateRoleDto): Promise<RoleDocument> {
    const { name } = payload;

    const exist = await this.exists({ name });

    if (exist) new ApiError(`Role already exists with name ${name}`, HttpStatus.BAD_REQUEST);

    const role = await this.repo.create(payload);

    const redisKey = ROLE_REDIS_KEYS.patterns.rolesList();

    await this.cache.deleteByPattern(redisKey);

    return role;
  }

  public async getRole(id: string): Promise<RoleLean> {
    const filter = { _id: id, status: EntityStatus.ACTIVE };

    const populate = {
      path: 'permissions',
      match: { status: EntityStatus.ACTIVE },
    };

    const role = await this.repo.findOne({ filter, populate });
    if (!role) throw notFoundError('Role');
    return role;
  }

  public async updateRole(payload: UpdateRoleDto, id: string): Promise<RoleLean> {
    if (payload.permissions) {
      payload.permissions = [...new Set(payload.permissions)];
    }

    const role = await this.repo.updateOne({ _id: id }, payload);
    if (!role) throw notFoundError('Role');
    return role;
  }

  public async deleteRole(id: string): Promise<RoleDocument> {
    const role = await this.repo.deleteById(id);
    if (!role) throw notFoundError('Role');
    return role;
  }

  private async exists(filter: object): Promise<boolean> {
    return this.repo.exists(filter);
  }
}
