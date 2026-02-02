/**
 * @file cucumberHelpers.ts
 * @description Helpers for normalizing Cucumber DataTable values in step definitions.
 */
import { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { applyUniqPlaceholder } from './stringUtils';

/**
 * Normalize a DataTable cell value to a trimmed string with uniq placeholders applied.
 * @param cell - Cell value to normalize.
 * @returns Normalized string value.
 */
const normalizeCell = (cell: unknown): string => applyUniqPlaceholder((cell ?? '').toString().trim());

/**
 * Normalises a Cucumber DataTable into a trimmed key/value map.
 * @param table Source DataTable from a step definition.
 * @returns Hash of keys to trimmed values.
 */
export const normalizeHash = (table: DataTable): Record<string, string> => {
  const rawRows = table.raw().map((row) => row.map(normalizeCell));
  const firstRow = rawRows[0] ?? [];
  const [firstCell, secondCell] = firstRow.map((cell) => cell.toLowerCase());
  const headerKeys = ['field', 'key', 'name'];
  const valueKeys = ['value', 'val'];
  const looksLikeHeader = headerKeys.includes(firstCell) && valueKeys.includes(secondCell);

  if (looksLikeHeader) {
    return Object.fromEntries(
      rawRows
        .slice(1)
        .filter((row) => row.length >= 2)
        .map((row) => [row[0], row[1] ?? '']),
    );
  }

  // Handle a single data row with multiple columns by mapping header -> value.
  if (firstRow.length > 2) {
    const dataRow = rawRows[1] ?? [];
    if (dataRow.length === 0) {
      return {};
    }

    return Object.fromEntries(firstRow.map((key, index) => [key, dataRow[index] ?? '']));
  }

  const raw = table.rowsHash();
  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key.trim(), normalizeCell(value)]));
};

/**
 * Normalises a Cucumber DataTable into trimmed rows.
 * @param table Source DataTable from a step definition.
 * @returns 2D array of trimmed cell values.
 */
export const normalizeTableRows = (table: DataTable): string[][] => {
  return table.raw().map((row) => row.map(normalizeCell));
};
