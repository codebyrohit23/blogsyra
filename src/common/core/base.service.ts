// import {
//   Document,
//   FilterQuery,
//   HydratedDocument,
//   PipelineStage,
//   ProjectionType,
//   QueryOptions,
//   SortOrder,
//   UpdateQuery,
//   Types,
//   ClientSession,
// } from 'mongoose';
// import { BaseRepository, PaginationResult, PopulateArg } from './base.repository.js';

// export interface ServiceOptions<T extends Document = Document> {
//   populate?: PopulateArg;
//   sort?: Record<string, SortOrder>;
//   projection?: ProjectionType<T>;
//   queryOptions?: QueryOptions;
//   select?: string | string[];
//   lean?: boolean;
// }

// export interface PaginationOptions extends ServiceOptions {
//   page?: number;
//   limit?: number;
// }

// export class BaseService<T extends Document, R extends BaseRepository<T> = BaseRepository<T>> {
//   protected repository: R;

//   constructor(repository: R) {
//     this.repository = repository;
//   }

//   // ---------- FIND METHODS ----------
//   async findById(
//     id: string | Types.ObjectId,
//     options?: ServiceOptions<T>
//   ): Promise<HydratedDocument<T> | null> {
//     return this.repository.findById(
//       id,
//       options?.projection,
//       options?.queryOptions,
//       options?.populate
//     );
//   }

//   async findOne(
//     query: FilterQuery<T>,
//     options?: ServiceOptions<T>
//   ): Promise<HydratedDocument<T> | null> {
//     return this.repository.findOne(
//       query,
//       options?.projection,
//       options?.queryOptions,
//       options?.populate,
//       options?.select,
//       options?.lean
//     );
//   }

//   async findAll(
//     query: FilterQuery<T> = {}, // Added default value
//     options?: ServiceOptions<T>
//   ): Promise<HydratedDocument<T>[]> {
//     return this.repository.findAll(
//       query,
//       options?.projection,
//       options?.queryOptions,
//       options?.populate,
//       options?.sort
//     );
//   }

//   async findWithPagination(
//     query: FilterQuery<T> = {}, // Added default value
//     options?: PaginationOptions
//   ): Promise<PaginationResult<T>> {
//     // Added proper return type
//     const page = options?.page || 1;
//     const limit = options?.limit || 10;
//     return this.repository.findWithPagination(
//       query,
//       page,
//       limit,
//       options?.projection,
//       options?.queryOptions,
//       options?.populate,
//       options?.sort
//     );
//   }

//   // ---------- MUTATION METHODS ----------

//   async create(data: Partial<T>): Promise<HydratedDocument<T>> {
//     return this.repository.create(data);
//   }

//   async createMany(data: Partial<T>[], session?: ClientSession): Promise<void> {
//     // Type casting to resolve the return type mismatch
//     return this.repository.insertMany(data, session);
//   }

//   async updateById(
//     id: string | Types.ObjectId,
//     updateQuery: UpdateQuery<T>,
//     options?: ServiceOptions<T>
//   ): Promise<HydratedDocument<T> | null> {
//     return this.repository.updateById(
//       id,
//       updateQuery,
//       { new: true, ...options?.queryOptions },
//       options?.populate
//     );
//   }

//   async updateOne(query: FilterQuery<T>, updateQuery: UpdateQuery<T>, options?: QueryOptions) {
//     return this.repository.updateOne(query, updateQuery, options || {});
//   }

//   async updateMany(query: FilterQuery<T>, updateQuery: UpdateQuery<T>, options?: QueryOptions) {
//     return this.repository.updateMany(query, updateQuery, options || {});
//   }

//   async deleteById(id: string | Types.ObjectId): Promise<HydratedDocument<T> | null> {
//     return this.repository.deleteById(id);
//   }

//   async deleteMany(query: FilterQuery<T>) {
//     return this.repository.deleteMany(query);
//   }

//   // ---------- ADVANCED ----------

//   async aggregate(pipeline: PipelineStage[]) {
//     return this.repository.aggregate(pipeline);
//   }

//   async exists(query: FilterQuery<T>): Promise<boolean> {
//     const document = await this.repository.findOne(query);
//     return !!document;
//   }

//   async count(query: FilterQuery<T> = {}): Promise<number> {
//     const result = await this.repository.aggregate([{ $match: query }, { $count: 'total' }]);
//     return result[0]?.total || 0;
//   }
// }
