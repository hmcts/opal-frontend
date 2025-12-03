import { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { calculateWeeksInFuture, calculateWeeksInPast } from '../../utils/dateUtils';

/**
 * Parses a relative weeks phrase (e.g., "9 weeks in the past") into a tuple.
 */
export const parseWeeksValue = (value: string): { weeks: number; direction: 'past' | 'future' } => {
  const match = value.match(/(\d+)\s+weeks?/i);
  const weeks = match ? Number(match[1]) : 0;
  const direction = /future/i.test(value) ? 'future' : 'past';
  return { weeks, direction };
};

/**
 * Resolves a relative weeks phrase into an ISO date string.
 */
export const resolveRelativeDate = (value: string): string => {
  const { weeks, direction } = parseWeeksValue(value);
  return direction === 'future' ? calculateWeeksInFuture(weeks) : calculateWeeksInPast(weeks);
};

/**
 * Normalises a Cucumber DataTable into a trimmed key/value map.
 */
export const normalizeHash = (table: DataTable): Record<string, string> => {
  // Supports both two-column tables and single-row multi-column tables
  const hashes = table.hashes();
  const raw = hashes.length === 1 ? hashes[0] : table.rowsHash();

  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key.trim(), (value ?? '').toString().trim()]));
};

/**
 * Normalises a Cucumber DataTable into trimmed rows.
 */
export const normalizeTableRows = (table: DataTable): string[][] => {
  return table.raw().map((row) => row.map((cell) => cell.trim()));
};
