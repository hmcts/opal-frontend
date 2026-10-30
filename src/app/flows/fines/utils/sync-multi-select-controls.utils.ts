import { FormControl } from '@angular/forms';
import { MultiSelectRowIdentifier } from '@hmcts/opal-frontend-common/directives/moj-multi-select';

/** Keeps row checkbox controls and the select-all control aligned with the selected row IDs. */
export function syncMultiSelectControls<TRow, TRowId extends MultiSelectRowIdentifier>(
  rows: TRow[],
  rowControls: Map<TRowId, FormControl<boolean>>,
  selectedRowIds: Set<TRowId>,
  getRowIdentifier: (row: TRow) => TRowId,
  selectAllControl: FormControl<boolean>,
  areAllRowsSelected: () => boolean,
): void {
  const currentRowIds = new Set(rows.map(getRowIdentifier));

  rows.forEach((row) => {
    const rowId = getRowIdentifier(row);
    const selected = selectedRowIds.has(rowId);
    const control = rowControls.get(rowId);

    if (control) {
      if (control.value !== selected) {
        control.setValue(selected, { emitEvent: false });
      }
      return;
    }

    rowControls.set(rowId, new FormControl<boolean>(selected, { nonNullable: true }));
  });

  Array.from(rowControls.keys()).forEach((rowId) => {
    if (!currentRowIds.has(rowId)) {
      rowControls.delete(rowId);
    }
  });

  const allSelected = areAllRowsSelected();
  if (selectAllControl.value !== allSelected) {
    selectAllControl.setValue(allSelected, { emitEvent: false });
  }
}
