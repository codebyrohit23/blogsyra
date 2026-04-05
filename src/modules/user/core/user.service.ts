import { CacheService } from '@/core/cache';
import { UserRepository } from './user.repository';
import { CreateUserInput, UpdateUserInput } from './user.type';
import { UserDocument, UserLean } from './user.model';
import { USER_REDIS_KEYS } from './user.redis-keys';
import { notFoundError } from '@/core/error';
import { ClientSession } from 'mongoose';
import { convertToObjectId } from '@/shared/utils';

export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly cache: CacheService
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
    // const { userName } = payload;

    // if (userName) {
    //   const exists = await this.repo.exists({ userName });

    //   if (exists) {
    //     throw new ApiError('Username is already taken. Please choose a different one.');
    //   }
    // }

    const user = await this.repo.create(payload, session);

    const redisKey = USER_REDIS_KEYS.patterns.usersList();

    await this.cache.deleteByPattern(redisKey);

    return user;
  }

  public async getUserById(id: string): Promise<UserLean | null> {
    const redisKey = USER_REDIS_KEYS.userById(id);

    const cached = await this.cache.get<UserLean>(redisKey);

    if (cached) return cached;

    const user = await this.repo.findById(id);

    await this.cache.set(redisKey, user);

    return user;
  }

  public async updateUser(id: string, payload: UpdateUserInput): Promise<UserLean> {
    // const { userName } = payload;

    // if (userName) {
    //   const exists = await this.repo.exists({ _id: { $ne: convertToObjectId(id) }, userName });

    //   if (exists) {
    //     throw new ApiError('Username is already taken. Please choose a different one.');
    //   }
    // }

    const user = await this.repo.updateOne({ _id: convertToObjectId(id) }, payload);

    if (!user) throw notFoundError('User');

    const redisPattern = USER_REDIS_KEYS.patterns.all();

    await this.cache.deleteByPattern(redisPattern);

    return user;
  }

  public async deleteUser(id: string) {
    const user = await this.repo.deleteById(id);

    if (!user) throw notFoundError('User');

    const redisPattern = USER_REDIS_KEYS.patterns.all();

    await this.cache.deleteByPattern(redisPattern);

    return user;
  }
}
