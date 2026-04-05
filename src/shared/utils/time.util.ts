import { DateTime, DurationLikeObject, IANAZone } from 'luxon';
import { TimeUnit } from '../constants';

// Current Time Helpers
export const nowUTC = () => DateTime.utc();

export const nowUTCDate = () => DateTime.utc().toJSDate();

export const nowUnix = () => DateTime.utc().toUnixInteger();

// Expiry / Future / Past Date Generator
export const addTime = (duration: DurationLikeObject): Date => {
  return DateTime.utc().plus(duration).toJSDate();
};

export const subtractTime = (duration: DurationLikeObject): Date => {
  return DateTime.utc().minus(duration).toJSDate();
};

export const isExpired = (date: Date): boolean => {
  return DateTime.fromJSDate(date).toUTC() <= DateTime.utc();
};

// Date Comparison
export const isBefore = (date1: Date, date2: Date) =>
  DateTime.fromJSDate(date1) < DateTime.fromJSDate(date2);

export const isAfter = (date1: Date, date2: Date) =>
  DateTime.fromJSDate(date1) > DateTime.fromJSDate(date2);

// Difference Between Dates
export const diff = (date1: Date, date2: Date, unit: TimeUnit) => {
  return DateTime.fromJSDate(date1).diff(DateTime.fromJSDate(date2), unit).toObject()[unit];
};

// Timezone Conversion
export const toTimezone = (date: Date, timezone: string) => {
  return DateTime.fromJSDate(date).setZone(timezone);
};

export const formatWithTimezone = (date: Date, timezone: string, format = 'dd-MM-yyyy HH:mm') => {
  return DateTime.fromJSDate(date).setZone(timezone).toFormat(format);
};

// Start & End of Day / Month / Year
export const startOfDay = () => DateTime.utc().startOf('day').toJSDate();

export const endOfDay = () => DateTime.utc().endOf('day').toJSDate();

export const startOfMonth = () => DateTime.utc().startOf('month').toJSDate();

export const endOfMonth = () => DateTime.utc().endOf('month').toJSDate();

// ISO Formatter (API Safe)
export const toISO = (date: Date) => DateTime.fromJSDate(date).toUTC().toISO();

export const parseISO = (isoString: string) => DateTime.fromISO(isoString).toJSDate();

export const isValidTimezone = (tz: string): boolean => IANAZone.isValidZone(tz);
/*
Example Real Usage in Entire Backend

Soft Delete After 30 Days
deletedAt: addTime({ days: 30 })

OTP Expiry (5 minutes)
otpExpiresAt: addTime({ minutes: 5 })

if (isExpired(user.subscriptionExpiresAt)) {
  // block access
}

*/
