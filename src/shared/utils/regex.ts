export const OBJECT_Id_REGEX = /^[0-9a-fA-F]{24}$/;

export const ALPHANUMERIC_UNDERSCORE_REGEX = /^[a-zA-Z0-9_]+$/;

export const ALPHANUMERIC_UNDERSCORE_HYPHEN_REGEX = /^[a-zA-Z0-9-_]+$/;

export const PHONE_REGEX = /^\+?[\d\s\-\(\)]+$/;

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_\-])[A-Za-z\d@$!%*?&^#_\-]{8,}$/;

export const NUMERIC_REGEX = /^[0-9]+$/;

export const HAS_NUMBER = /\d/;

export const HAS_UPPER_CASE = /[A-Z]/;

export const HAS_LOWER_CASE = /[a-z]/;

export const HAS_SPECIAL_CHAR = /[!@#$%^&*(),.?":{}|<>_\-]/;

export const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const LANGUAGE_CODE_REGEX = /^[a-z]{2,}(-[A-Z]{2,})?$/;

export const HEX_REGEX = /^[0-9a-fA-F]+$/;

export const JWT_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export const FCM_TOKEN_REGEX = /^[a-zA-Z0-9:._-]+$/;

export const YMD_REGEX = /^\d{4}-\d{2}-\d{2}$/;
