import { PaginationResult } from '@/core/db/toolkit';
import { PermissionRepository } from './permission.repository';
import { PermissionDocument, PermissionLean } from './permission.model';
import { EntityStatus, HttpStatus, SortOrder } from '@/shared/constants';
import { notFoundError } from '@/core/error';
import { CreatePermissionDto, UpdatePermissionDto } from './schemas/permission.schema';
import { ApiError } from '@/shared/utils';
import { PermissionType } from './permission.type';
import { CacheService } from '@/core/cache';
import { PERMISSION_REDIS_KEYS } from './permission.redis-keys';
import { PermissionPaginationDto } from './schemas';

export class PermissionService {
  constructor(
    private readonly repo: PermissionRepository,
    private readonly cache: CacheService
  ) {}

  public async getPermissions(
    query: PermissionPaginationDto
  ): Promise<PaginationResult<PermissionLean>> {
    const redisKey = PERMISSION_REDIS_KEYS.permissionsList(query);

    const cached = await this.cache.get<PaginationResult<PermissionLean>>(redisKey);
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

  public async createPermissioin(payload: CreatePermissionDto): Promise<PermissionDocument> {
    const { action, resource } = payload;

    const exist = await this.exists({ action, resource });

    if (exist) new ApiError('Permission already exists', HttpStatus.BAD_REQUEST);

    const permission = await this.repo.create(payload);

    const redisKey = PERMISSION_REDIS_KEYS.permissionById(permission._id.toString());
    const redisPatternKey = PERMISSION_REDIS_KEYS.patterns.permissionsList();

    await Promise.all([
      this.cache.deleteByPattern(redisPatternKey),
      this.cache.set(redisKey, permission),
    ]);

    return permission;
  }

  public async getPermissionById(id: string): Promise<PermissionLean> {
    const redisKey = PERMISSION_REDIS_KEYS.permissionById(id);

    const cached = await this.cache.get<PermissionLean>(redisKey);

    if (cached) return cached;

    const permission = await this.repo.findById(id);

    if (!permission) throw notFoundError('Permission');

    await this.cache.set(redisKey, permission);

    return permission;
  }

  public async getPermission(payload: PermissionType): Promise<PermissionLean | null> {
    const { resource, action } = payload;

    const redisKey = PERMISSION_REDIS_KEYS.permission(resource, action);

    const cached = await this.cache.get<PermissionLean>(redisKey);

    if (cached) return cached;

    const permission = await this.repo.findOne({
      filter: { resource, action, status: EntityStatus.ACTIVE },
    });

    if (permission) {
      await this.cache.set(redisKey, permission);
    }

    return permission;
  }

  public async updatePermissionById(
    id: string,
    payload: UpdatePermissionDto
  ): Promise<PermissionLean> {
    const permission = await this.repo.updateOne({ _id: id }, payload);

    if (!permission) throw notFoundError('Permission');

    const redisKey = PERMISSION_REDIS_KEYS.permissionById(permission._id.toString());
    const redisPatternKey = PERMISSION_REDIS_KEYS.patterns.permissionsList();

    await Promise.all([
      this.cache.deleteByPattern(redisPatternKey),
      this.cache.set(redisKey, permission),
    ]);

    return permission;
  }

  public async updatePermission(payload: PermissionType): Promise<PermissionLean | null> {
    const permission = await this.repo.updateOne(
      payload,
      { $setOnInsert: payload },
      { upsert: true }
    );

    if (!permission) throw notFoundError('Permission');

    const redisKey = PERMISSION_REDIS_KEYS.permissionById(permission._id.toString());
    const redisPatternKey = PERMISSION_REDIS_KEYS.patterns.permissionsList();

    await Promise.all([
      this.cache.deleteByPattern(redisPatternKey),
      this.cache.set(redisKey, permission),
    ]);
    return permission;
  }

  public async deletePermission(id: string): Promise<PermissionDocument> {
    const permission = await this.repo.deleteById(id);

    if (!permission) throw notFoundError('Permission');

    const redisKey = PERMISSION_REDIS_KEYS.patterns.all();

    await this.cache.deleteByPattern(redisKey);

    return permission;
  }

  private async exists(filter: object): Promise<boolean> {
    return this.repo.exists(filter);
  }
}
