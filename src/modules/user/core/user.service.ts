import { CacheService } from '@/infra/cache';
import { UserRepository } from './user.repository';
import { CreateUserInput, UpdateUserInput } from './user.type';
import { UserDocument, UserLean } from './user.model';
import { notFoundError } from '@/core/error';
import { ClientSession } from 'mongoose';
import { UserCacheKeys, UserCacheVersion } from './user.cache';
import { MongoId } from '@/shared/types';

export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly cache: CacheService,
    private readonly userCacheVersion: UserCacheVersion
  ) {}

  //   public async getUsers(query: UserPaginationDto): Promise<PaginationResult<UserLean>> {
  //     const redisKey = USER_REDIS_KEYS.usersList(query);

  //     const cached = await this.cache.get<PaginationResult<UserLean>>(redisKey);
  //     if (cached) return cached;

  //     const { page, limit, search, status, sortBy, sortOrder } = query;

  //     const filter: Record<string, any> = {};

  //     if (search) {
  //       filter.$or = [
  //         { name: { $regex: search, $options: 'i' } },
  //         { description: { $regex: search, $options: 'i' } },
  //       ];
  //     }

  //     if (status) {
  //       filter.status = status;
  //     }

  //     const sort: Record<string, 1 | -1> = {
  //       [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
  //     };

  //     const result = await this.repo.paginate({
  //       filter,
  //       sort,
  //       page,
  //       limit,
  //     });

  //     if (result) {
  //       await this.cache.set(redisKey, result);
  //     }

  //     return result;
  //   }

  public async createUser(
    payload: CreateUserInput,
    session?: ClientSession
  ): Promise<UserDocument> {
    const user = await this.repo.create(payload, session);

    await this.userCacheVersion.bumpListVersion();

    return user;
  }

  public async getUserById(id: MongoId): Promise<UserLean | null> {
    const cacheKey = UserCacheKeys.byId(id.toString());

    const cached = await this.cache.get<UserLean>(cacheKey);

    if (cached) return cached;

    const user = await this.repo.findById(id);

    await this.cache.set(cacheKey, user);

    return user;
  }

  public async updateUser(id: MongoId, payload: UpdateUserInput): Promise<UserLean> {
    const user = await this.repo.updateOne({ _id: id }, payload);

    if (!user) throw notFoundError('User');

    await Promise.all([
      this.cache.del(UserCacheKeys.byId(id)),
      this.userCacheVersion.bumpListVersion(),
    ]);

    return user;
  }

  public async deleteUser(id: string) {
    const user = await this.repo.deleteById(id);

    if (!user) throw notFoundError('User');

    await Promise.all([
      this.cache.del(UserCacheKeys.byId(id)),
      this.userCacheVersion.bumpListVersion(),
    ]);

    return user;
  }
}
