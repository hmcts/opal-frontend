// cypress/support/utils/table.ts
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import set from 'lodash/set';

/** Converts a Cucumber DataTable to a nested object using dot-path keys. */
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
