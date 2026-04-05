import { FlattenMaps, PopulateOptions, Require_id } from 'mongoose';
import { FilterQuery, ProjectionType, QueryOptions, SortOrder } from 'mongoose';

export type Lean<T> = Require_id<FlattenMaps<T>>;

export interface PaginationInput<T> {
  filter?: FilterQuery<T>;
  projection?: ProjectionType<T>;
  options?: QueryOptions;
  populate?: PopulateOptions | PopulateOptions[];
  select?: string | string[];
  sort?: Record<string, SortOrder>;
  lean?: boolean;
  page?: number;
  limit?: number;
}
export interface PaginationResult<T> {
  data: Lean<T>[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type PopulateArg = PopulateOptions | PopulateOptions[];

export interface BuildQueryOptions<T> {
  filter?: FilterQuery<T>;
  projection?: ProjectionType<T>;
  options?: QueryOptions;
  populate?: PopulateOptions | PopulateOptions[];
  select?: string | string[];
  sort?: Record<string, SortOrder>;
  limit?: number;
  skip?: number;
  lean?: boolean;
}
