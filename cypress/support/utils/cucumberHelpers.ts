import { DataTable } from '@badeball/cypress-cucumber-preprocessor';

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
