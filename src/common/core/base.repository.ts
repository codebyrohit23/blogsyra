// import { ClientSession, MongooseUpdateQueryOptions, Query } from 'mongoose';
// import {
//   Model,
//   Document,
//   FilterQuery,
//   UpdateQuery,
//   ProjectionType,
//   QueryOptions,
//   HydratedDocument,
//   FlattenMaps,
//   PipelineStage,
//   PopulateOptions,
//   SortOrder,
//   Require_id,
//   Types,
// } from 'mongoose';

// // export interface PaginationResult<T> {
// //   data: HydratedDocument<T>[];
// //   pagination: {
// //     total: number;
// //     page: number;
// //     limit: number;
// //     totalPages: number;
// //   };
// // }

// export type PopulateArg = PopulateOptions | PopulateOptions[];
// // Plain lean return type for v7
// export type LeanDoc<T> = Require_id<FlattenMaps<T>>;

// export class BaseRepository<T extends Document> {
//   protected model: Model<T>;

//   constructor(model: Model<T>) {
//     this.model = model;
//   }

//   // ---------- FIND METHODS ----------

//   async findById(
//     id: string,
//     projection?: ProjectionType<T>,
//     options?: QueryOptions,
//     populate?: PopulateArg,
//     select?: string | string[],
//     lean?: boolean
//   ): Promise<HydratedDocument<T> | null> {
//     type QueryType = Query<HydratedDocument<T> | null, HydratedDocument<T>, {}, T>;
//     let query = this.model.findById(id, projection, options);
//     if (populate) query = query.populate(populate);
//     if (select) query = query.select(select) as QueryType;
//     if (lean) query = query.lean() as QueryType;
//     return query.exec() as Promise<HydratedDocument<T> | null>;
//   }

//   async findOne(
//     query: FilterQuery<T>,
//     projection?: ProjectionType<T>,
//     options?: QueryOptions,
//     populate?: PopulateArg,
//     select?: string | string[],
//     lean?: boolean
//   ): Promise<HydratedDocument<T> | null> {
//     type QueryType = Query<HydratedDocument<T> | null, HydratedDocument<T>, {}, T>;
//     let q = this.model.findOne(query, projection, options);
//     if (populate) q = q.populate(populate);
//     if (select) q = q.select(select) as QueryType;
//     if (lean) q = q.lean() as QueryType;
//     return q;
//   }

//   async findAll(
//     query: FilterQuery<T> = {},
//     projection?: ProjectionType<T>,
//     options?: QueryOptions,
//     populate?: PopulateArg,
//     sort?: Record<string, SortOrder>
//   ): Promise<HydratedDocument<T>[]> {
//     let q = this.model.find(query, projection, options);
//     if (populate) q = q.populate(populate);
//     if (sort) q = q.sort(sort);
//     return q;
//   }

//   async findWithPagination(
//     query: FilterQuery<T> = {},
//     page: number = 1,
//     limit: number = 10,
//     projection?: ProjectionType<T>,
//     options?: QueryOptions,
//     populate?: PopulateArg,
//     sort?: Record<string, SortOrder>
//   ): Promise<PaginationResult<T>> {
//     const skip = (page - 1) * limit;

//     let q = this.model.find(query, projection, { ...options, limit, skip });
//     if (populate) q = q.populate(populate);
//     if (sort) q = q.sort(sort);

//     const [data, total] = await Promise.all([q, this.model.countDocuments(query)]);

//     return {
//       data,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }

//   // ---------- MUTATION METHODS ----------

//   async create(data: Partial<T>): Promise<HydratedDocument<T>> {
//     return this.model.create(data);
//   }

//   async insertMany(data: Partial<T>[], session?: ClientSession): Promise<void> {
//     const result = await this.model.insertMany(data, { session, ordered: true, rawResult: false });
//     result;
//     // return result as HydratedDocument<T>[];
//   }

//   async updateById(
//     id: string,
//     updateQuery: UpdateQuery<T>,
//     options: QueryOptions = { new: true },
//     populate?: PopulateArg
//   ): Promise<HydratedDocument<T> | null> {
//     let q = this.model.findByIdAndUpdate(id, updateQuery, options);
//     if (populate) q = q.populate(populate);
//     return q;
//   }

//   async updateOne(
//     query: FilterQuery<T>,
//     updateQuery: UpdateQuery<T>,
//     options: MongooseUpdateQueryOptions
//   ) {
//     return this.model.findOneAndUpdate(query, updateQuery, options);
//   }

//   async updateMany(
//     query: FilterQuery<T>,
//     updateQuery: UpdateQuery<T>,
//     options: MongooseUpdateQueryOptions
//   ) {
//     return this.model.updateMany(query, updateQuery, options);
//   }

//   async deleteById(id: string): Promise<HydratedDocument<T> | null> {
//     return this.model.findByIdAndDelete(id);
//   }

//   async deleteMany(query: FilterQuery<T>) {
//     return this.model.deleteMany(query);
//   }

//   // ---------- ADVANCED ----------

//   async aggregate(pipeline: PipelineStage[]) {
//     return this.model.aggregate(pipeline);
//   }
// }
