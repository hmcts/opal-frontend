import { DateTime } from 'luxon';

export const FINES_API_IGNORED_TIME_ZONE = 'Europe/London';
const REQUEST_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

/** Builds UK-local completion bounds from one clock reading, preserving wall time across GMT/BST. */
export const getIgnoredDateBounds = (now: DateTime = DateTime.now()) => {
  const to = now.setZone(FINES_API_IGNORED_TIME_ZONE);
  return {
    completed_date_from: to.minus({ days: 14 }).toFormat(REQUEST_DATE_FORMAT),
    completed_date_to: to.toFormat(REQUEST_DATE_FORMAT),
  };
};
