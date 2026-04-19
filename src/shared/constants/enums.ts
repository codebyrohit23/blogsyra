export enum Environment {
  DEVELOPEMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
  OPTIONS = 'options',
  HEAD = 'head',
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TOO_MANY_REQUESTS = 429,

  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  CONFLICT = 409,
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum AuthProvider {
  APPLE = 'apple',
  GOOGLE = 'google',
}

export enum Platform {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web',
}

export enum Channel {
  EMAIL = 'email',
  SMS = 'sns',
  PUSH = 'push',
}

export enum Language {
  EN = 'en',
  FR = 'fr',
  HI = 'hi',
}

export enum ValidationSource {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',
  FILE = 'file',
}

export enum EntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
  BLOCKED = 'blocked',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum TimeUnit {
  Minutes = 'minutes',
  Hours = 'hours',
  Days = 'days',
  Seconds = 'seconds',
}

export enum REDIS_TTL {
  DEFAULT = 15 * 60,
  LIST = 5 * 60,
  ACCESS_TOKEN = 15 * 60,
  REFRESH_TOKEN = 30 * 24 * 60 * 60,
  RESET_PASSWORD_TOKEN = 10 * 60,
  EMAIL_VERIFICATION_TOKEN = 10 * 60,
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
