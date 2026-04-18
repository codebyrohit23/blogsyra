// import {
//   buildQuery,
//   paginate,
//   BuildQueryOptions,
//   PaginationResult,
//   PaginationInput,
// } from '@/core/db/toolkit';

// import { ProfileLean, ProfileDocument, ProfileModel, Profile } from './profile.model';
// import {
//   DeleteResult,
//   FilterQuery,
//   QueryOptions,
//   Types,
//   UpdateQuery,
//   UpdateResult,
// } from 'mongoose';
// import { CreateProfileInput } from './profile.type';

// export class ProfileRepository {
//   constructor(private readonly model = ProfileModel) {}

//   findById(
//     id: string,
//     payload?: Omit<BuildQueryOptions<ProfileDocument>, 'filter' | 'limit' | 'skip'>
//   ): Promise<ProfileLean | ProfileDocument | null> {
//     const { populate, select, options, projection, lean } = payload ?? {};

//     let q = this.model.findById(id, projection, options);

//     if (populate) q = q.populate(populate);
//     if (select) q = q.select(select);
//     if (lean) return q.lean().exec();

//     return q.exec();
//   }

//   create(data: CreateProfileInput): Promise<ProfileDocument> {
//     return this.model.create(data);
//   }

//   findOne(opts: BuildQueryOptions<Profile>): Promise<ProfileDocument | null> {
//     return buildQuery(this.model, opts).findOne().exec();
//   }

//   updateOne(
//     filter: FilterQuery<Profile>,
//     update: UpdateQuery<Profile>,
//     options?: QueryOptions
//   ): Promise<ProfileDocument | null> {
//     return this.model.findOneAndUpdate(filter, update, options);
//   }

//   updateMany(filter: FilterQuery<Profile>, update: UpdateQuery<Profile>): Promise<UpdateResult> {
//     return this.model.updateMany(filter, update);
//   }

//   deleteById(id: string): Promise<ProfileLean | null> {
//     return this.model.findByIdAndDelete(id).lean();
//   }

//   deleteOne(filter: FilterQuery<Profile>): Promise<ProfileLean | null> {
//     return this.model.findOneAndDelete(filter).lean();
//   }

//   deleteMany(filter: FilterQuery<Profile>): Promise<DeleteResult> {
//     return this.model.deleteMany(filter);
//   }

//   paginate(payload: PaginationInput<Profile>): Promise<PaginationResult<ProfileLean>> {
//     return paginate(this.model, { ...payload });
//   }

//   softDelete(id: string): Promise<ProfileLean | null> {
//     return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
//   }

//   async exists(filter: FilterQuery<Profile>): Promise<boolean> {
//     const result = await this.model.exists(filter);
//     return !!result;
//   }
// }
