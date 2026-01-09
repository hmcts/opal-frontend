// cypress/support/utils/table.ts
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import set from 'lodash/set';

/**
 * Converts a Cucumber DataTable to a nested object using dot-path keys.
 * @param dataTable Source Cucumber data table to convert.
 * @returns Nested object keyed by the provided dot-paths.
 */
export function convertDataTableToNestedObject(dataTable: DataTable): Record<string, any> {
  const overrides: Record<string, any> = {};
  const rows = dataTable.rowsHash();
  for (const [path, value] of Object.entries(rows)) {
    let parsed: any = value;
    try {
      parsed = JSON.parse(value);
    } catch {
      /* keep as string */
    }
    set(overrides, path, parsed);
  }
  return overrides;
}

/**
 * Converts a Cucumber DataTable into a trimmed key/value object.
 * @param table The input DataTable.
 * @returns A readonly hash of field names to trimmed string values.
 */
export const rowsHashSafe = (table: DataTable): Readonly<Record<string, string>> => {
  const raw = table.rowsHash?.() ?? {};
  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, (value ?? '').trim()]));
};
