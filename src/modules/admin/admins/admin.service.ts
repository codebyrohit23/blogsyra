import { AdminDocument, AdminLean } from './admin.model.js';
import { AdminRepository } from './admin.repository.js';

import { AdminPaginationDto, CreateAdminDto, UpdateAdminDto } from './schemas';

import { CreateAdminInput } from './admin.type.js';

import { AccountStatus, SortOrder } from '@/shared/constants';
import { ApiError } from '@/shared/utils';

import { CacheService } from '@/infra/cache/index.js';

import { PaginationResult } from '@/core/db/toolkit';
import { notFoundError } from '@/core/error';
import { MongoId } from '@/shared/types/common.type.js';
import { AdminCacheKeys, AdminCacheVersion, buildQueryKey } from './admin.cache.js';

export class AdminService {
  constructor(
    private readonly repo: AdminRepository,
    private readonly cache: CacheService,
    private readonly adminCacheVersion: AdminCacheVersion
  ) {}

  public async createAdminByAdmin(
    payload: CreateAdminDto,
    createdBy: MongoId
  ): Promise<AdminDocument> {
    const { email } = payload;

    const exists = await this.repo.exists({ email });

    if (exists) {
      throw new ApiError('Admin already exists with this email');
    }

    const admin = await this.repo.create({ ...payload, createdBy });

    await this.adminCacheVersion.bumpListVersion();
    return admin;
  }

  public async getAdminByEmailWithPassword(email: string): Promise<AdminLean | null> {
    const options = {
      filter: { email: email },
      select: '+password +passwordChangedAt',
      populate: { path: 'avatar', select: 'url -_id' },
    };

    const admin = await this.repo.findOne(options);

    return admin;
  }

  public async getAdminByIdWithPassword(id: MongoId): Promise<AdminLean | null> {
    const options = {
      filter: { _id: id, status: AccountStatus.ACTIVE },
      projection: { password: 1 },
    };

    const admin = await this.repo.findOne(options);

    return admin;
  }

  public async getAdmins(query: AdminPaginationDto): Promise<PaginationResult<AdminLean>> {
    const version = await this.adminCacheVersion.getListVersion();

    const queryKey = buildQueryKey(query);

    const cacheKey = AdminCacheKeys.list(queryKey, version);

    const cached = await this.cache.get<PaginationResult<AdminLean>>(cacheKey);

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
      await this.cache.set(cacheKey, result);
    }

    return result;
  }

  public async create(payload: CreateAdminInput): Promise<AdminDocument> {
    const admin = await this.repo.create(payload);

    await this.adminCacheVersion.bumpListVersion();

    return admin;
  }

  public async getAdminById(id: MongoId): Promise<AdminLean> {
    const cacheKey = AdminCacheKeys.byId(id);

    const cached = await this.cache.get<AdminLean>(cacheKey);

    if (cached) return cached;

    const filter = { _id: id, status: AccountStatus.ACTIVE };

    const populate = {
      path: 'avatar',
      select: 'url',
    };

    const admin = await this.repo.findOne({ filter, populate });

    if (!admin) throw notFoundError('Admin');

    await this.cache.set(cacheKey, admin);

    return admin;
  }

  public async getAdminByEmail(email: string): Promise<AdminLean | null> {
    const admin = await this.repo.findOne({ filter: { email } });

    return admin;
  }

  public async updateAdminById(id: MongoId, payload: UpdateAdminDto): Promise<AdminLean> {
    const admin = await this.repo.updateOne({ _id: id }, payload);

    if (!admin) throw notFoundError('Admin');

    await Promise.all([
      this.cache.del(AdminCacheKeys.byId(id)),
      this.adminCacheVersion.bumpListVersion(),
    ]);

    return admin;
  }

  public async updatePasswordById(id: MongoId, password: string): Promise<AdminLean | null> {
    const admin = await this.repo.updateOne(
      { _id: id },
      { password, passwordChangedAt: new Date() }
    );

    return admin;
  }

  public async deleteAdmin(id: MongoId) {
    const admin = await this.repo.deleteById(id);

    if (!admin) throw notFoundError('Admin');

    await Promise.all([
      this.cache.del(AdminCacheKeys.byId(id)),
      this.adminCacheVersion.bumpListVersion(),
    ]);

    return admin;
  }

  public async exists(filter: object): Promise<boolean> {
    return this.repo.exists(filter);
  }
}
