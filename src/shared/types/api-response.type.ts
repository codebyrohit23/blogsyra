export interface ApiResponse<T = undefined> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, any> | string | null;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stack?: string;
  status?: string;
}

export interface SendResponsePayload<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  errors?: Record<string, any> | string | null;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stack?: string;
  status?: string;
}

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export interface SendSuccessPayload<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  pagination?: Pagination;
}

export interface SendErrorPayload {
  statusCode?: number;
  message: string;
  errors?: Record<string, any> | string | null;
  status?: string;
  stack?: string;
}

export interface SuccessResponse<T = undefined> {
  success: true;
  message: string;
  data?: T;
  pagination?: Pagination;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, any> | string | null;
  status: string;
  stack?: string;
}

// export type ApiResponse<T = undefined> = SuccessResponse<T> | ErrorResponse;
