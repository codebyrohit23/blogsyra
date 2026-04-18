export type KeyPart = string | number | null | undefined;

export const buildKey = (...parts: KeyPart[]): string => {
  return [...parts]
    .filter((part): part is string | number => part !== undefined && part !== null && part !== '')
    .map(String)
    .join(':');
};
