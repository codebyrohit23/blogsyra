import { AdminDocument, AdminLean } from './admin.model.js';
import { AdminRepository } from './admin.repository.js';

import { AdminPaginationDto, CreateAdminDto, UpdateAdminDto } from './schemas';

import { CreateAdminInput } from './admin.types.js';

import { AccountStatus, HttpStatus, SortOrder } from '@/shared/constants';
import { ApiError, convertToObjectId } from '@/shared/utils';

import { CacheService } from '@/core/cache';

import { PaginationResult } from '@/core/db/toolkit';
import { notFoundError } from '@/core/error';
import { ADMIN_REDIS_KEYS } from './admin.redis-keys.js';
import { Types } from 'mongoose';

export class AdminService {
  constructor(
    private readonly repo: AdminRepository,
    private readonly cache: CacheService
  ) {}

  // public async login(payload: LoginDto): Promise<LoginResponse> {
  //   const { email, password } = payload;

  //   const admin = await this.getAdminByEmailWithPassword(email);

  //   if (!admin) throw invalidCredentialError();

  //   validateAccountStatus(admin.status);

  //   validatePassword(password, admin.password);

  //   const sessionAndTokenResponse = await this.authService.createSessionAndIssueTokens({
  //     id: admin._id,
  //     role: Role.ADMIN,
  //     platform: payload.platform,
  //     deviceId: payload.deviceId,
  //     fcmToken: payload.fcmToken,
  //     timezone: payload.timeZone,
  //   });

  //   const adminResponse = buildAdminResponse(admin);

  //   return { admin: adminResponse, tokensResponse: sessionAndTokenResponse.token };
  // }

  // public async register(payload: RegisterDto) {
  //   const exists = await this.exists({ email: payload.email });

  //   if (exists) throw new ApiError('Admin already exists with this email', HttpStatus.BAD_REQUEST);

  //   const admin = await this.repo.create(payload);

  //   const sessionAndTokenResponse = await this.authService.createSessionAndIssueTokens({
  //     id: admin._id,
  //     role: Role.ADMIN,
  //     platform: payload.platform,
  //     deviceId: payload.deviceId,
  //     fcmToken: payload.fcmToken,
  //     timezone: payload.timeZone,
  //   });

  //   const adminResponse = buildAdminResponse(admin);

  //   const redisKey = ADMIN_REDIS_KEYS.patterns.adminsList();

  //   await this.cache.deleteByPattern(redisKey);

  //   return { admin: adminResponse, tokensResponse: sessionAndTokenResponse.token };
  // }

  public async createAdminByAdmin(
    payload: CreateAdminDto,
    createdBy: string
  ): Promise<AdminDocument> {
    const { email, roleId, avatar } = payload;

    const exists = await this.repo.exists({ email });

    if (exists) throw new ApiError('Admin already exists with this email', HttpStatus.BAD_REQUEST);

    const admin = await this.repo.create({
      ...payload,
      createdBy: convertToObjectId(createdBy),
      roleId: roleId ? convertToObjectId(roleId) : undefined,
      avatar: avatar ? convertToObjectId(avatar) : undefined,
    });
    const redisKey = ADMIN_REDIS_KEYS.patterns.adminsList();

    await this.cache.deleteByPattern(redisKey);

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

  public async getAdminByIdWithPassword(id: string): Promise<AdminLean | null> {
    const options = {
      filter: { _id: convertToObjectId(id), status: AccountStatus.ACTIVE },
      projection: { password: 1 },
    };

    const admin = await this.repo.findOne(options);

    return admin;
  }

  public async getAdmins(query: AdminPaginationDto): Promise<PaginationResult<AdminLean>> {
    const redisKey = ADMIN_REDIS_KEYS.adminsList(query);

    const cached = await this.cache.get<PaginationResult<AdminLean>>(redisKey);
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

  public async create(payload: CreateAdminInput): Promise<AdminDocument> {
    const admin = await this.repo.create(payload);

    const redisKey = ADMIN_REDIS_KEYS.patterns.adminsList();

    await this.cache.deleteByPattern(redisKey);

    return admin;
  }

  public async getAdminById(id: string): Promise<AdminLean> {
    const redisKey = ADMIN_REDIS_KEYS.adminById(id);

    const cached = await this.cache.get<AdminLean>(redisKey);

    if (cached) return cached;

    const filter = { _id: convertToObjectId(id), status: AccountStatus.ACTIVE };

    const populate = {
      path: 'avatar',
      select: 'url',
    };

    const admin = await this.repo.findOne({ filter, populate });

    if (!admin) throw notFoundError('Admin');

    await this.cache.set(redisKey, admin);

    return admin;
  }

  public async getAdminByEmail(email: string): Promise<AdminLean | null> {
    const redisKey = ADMIN_REDIS_KEYS.adminByEmail(email);

    const cached = await this.cache.get<AdminLean>(redisKey);

    if (cached) return cached;

    const admin = await this.repo.findOne({ filter: { email } });

    await this.cache.set(redisKey, admin);

    return admin;
  }

  public async updateAdminById(id: string, payload: UpdateAdminDto): Promise<AdminLean> {
    const admin = await this.repo.updateOne({ _id: id }, payload);

    if (!admin) throw notFoundError('Admin');

    const redisPattern = ADMIN_REDIS_KEYS.patterns.all();

    const redisKey = ADMIN_REDIS_KEYS.adminById(id.toString());

    await Promise.all([this.cache.deleteByPattern(redisPattern), this.cache.set(redisKey, admin)]);

    return admin;
  }

  public async updatePasswordById(id: Types.ObjectId, password: string): Promise<AdminLean | null> {
    const admin = await this.repo.updateOne(
      { _id: id },
      { password, passwordChangedAt: new Date() }
    );

    return admin;
  }

  public async deleteAdmin(id: string) {
    const admin = await this.repo.deleteById(id);

    if (!admin) throw notFoundError('Admin');

    const redisPattern = ADMIN_REDIS_KEYS.patterns.all();

    await this.cache.deleteByPattern(redisPattern);

    return admin;
  }

  public async exists(filter: object): Promise<boolean> {
    return this.repo.exists(filter);
  }
}
