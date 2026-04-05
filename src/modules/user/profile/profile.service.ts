// import { CacheService } from '@/core/cache';
// import { ProfileRepository } from './profile.repository';
// import { CreateProfileInput, UpdateProfileInput } from './profile.type';
// import { ProfileDocument, ProfileLean } from './profile.model';
// import { ApiError } from '@/shared/utils';
// import { notFoundError } from '@/core/error';
// import { Types } from 'mongoose';

// export class ProfileService {
//   constructor(
//     private readonly repo: ProfileRepository,
//     private readonly cache: CacheService
//   ) {}

//   public async createProfile(payload: CreateProfileInput): Promise<ProfileDocument> {
//     const { userId } = payload;

//     if (userId) {
//       const exists = await this.repo.exists({ userId });

//       if (exists) {
//         throw new ApiError('Credentails already exist for this user.');
//       }
//     }
//     const profile = await this.repo.create(payload);
//     return profile;
//   }

//   public async getProfileByUserId(userId: Types.ObjectId): Promise<ProfileLean> {
//     const profile = await this.repo.findOne({ filter: { userId } });

//     if (!profile) throw notFoundError('Profile');

//     return profile;
//   }

//   public async updateProfileByUserId(
//     userId: Types.ObjectId,
//     payload: UpdateProfileInput
//   ): Promise<ProfileLean | null> {
//     const profile = await this.repo.updateOne({ userId }, payload);

//     return profile;
//   }

//   public async deleteProfileByUserId(userId: Types.ObjectId) {
//     return await this.repo.deleteOne({ userId });
//   }
// }
