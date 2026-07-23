/**
 * Converts a local DD/MM/YYYY date string into an RFC3339 UTC timestamp at midnight.
 *
 * @param date - The local date string in DD/MM/YYYY format.
 * @returns The equivalent RFC3339 UTC timestamp.
 */
export function finesAccDateToRfc3339UtcTimestamp(date: string): string {
  const [day, month, year] = date.split('/').map(Number);

  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)).toISOString();
}
