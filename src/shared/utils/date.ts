import ms, { StringValue } from 'ms';

export const convertMinutesToMs = (minutes: number): number => minutes * 60 * 1000;

export const convertTimeToMs = (time: string): number => ms(time as StringValue);

export function normalizeTTL(ttl: number | StringValue): number {
  if (typeof ttl === 'number') {
    return ttl;
  }

  if (/^\d+$/.test(ttl)) {
    return parseInt(ttl, 10);
  }
  const durationMs = ms(ttl);
  if (durationMs === undefined) {
    throw new Error(`Invalid TTL format: ${ttl}`);
  }

  return Math.floor(durationMs / 1000);
}
