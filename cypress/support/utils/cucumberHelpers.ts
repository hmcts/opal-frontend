import { DataTable } from '@badeball/cypress-cucumber-preprocessor';

/**
 * Normalises a Cucumber DataTable into a trimmed key/value map.
 */
export const normalizeHash = (table: DataTable): Record<string, string> => {
  const rawRows = table.raw();
  const firstRow = rawRows[0] ?? [];
  const [firstCell, secondCell] = firstRow.map((cell) => (cell ?? '').toString().trim().toLowerCase());
  const headerKeys = ['field', 'key', 'name'];
  const valueKeys = ['value', 'val'];
  const looksLikeHeader = headerKeys.includes(firstCell) && valueKeys.includes(secondCell);

  if (looksLikeHeader) {
    return Object.fromEntries(
      rawRows
        .slice(1)
        .filter((row) => row.length >= 2)
        .map((row) => [row[0].trim(), (row[1] ?? '').toString().trim()]),
    );
  }

  const raw = table.rowsHash();
  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key.trim(), (value ?? '').toString().trim()]));
};

/**
 * Normalises a Cucumber DataTable into trimmed rows.
 */
export const normalizeTableRows = (table: DataTable): string[][] => {
  return table.raw().map((row) => row.map((cell) => cell.trim()));
};
