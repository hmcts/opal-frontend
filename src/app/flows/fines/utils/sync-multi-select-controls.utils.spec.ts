import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { syncMultiSelectControls } from './sync-multi-select-controls.utils';

describe('syncMultiSelectControls', () => {
  it('creates, updates, and removes row controls and synchronises select-all', () => {
    const rows = [{ id: 'till-1' }, { id: 'till-2' }];
    const rowControls = new Map([['stale-till', new FormControl(true, { nonNullable: true })]]);
    const selectedRowIds = new Set(['till-2']);
    const selectAllControl = new FormControl(true, { nonNullable: true });

    syncMultiSelectControls(
      rows,
      rowControls,
      selectedRowIds,
      (row) => row.id,
      selectAllControl,
      () => false,
    );

    expect([...rowControls.keys()]).toEqual(['till-1', 'till-2']);
    expect(rowControls.get('till-1')?.value).toBe(false);
    expect(rowControls.get('till-2')?.value).toBe(true);
    expect(selectAllControl.value).toBe(false);
  });
});
