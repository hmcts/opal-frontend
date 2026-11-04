import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesSuspenseItemStore } from './fines-suspense-item.store';

describe('FinesSuspenseItemStore', () => {
  let store: InstanceType<typeof FinesSuspenseItemStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(FinesSuspenseItemStore);
  });

  it('starts without a selected BU or unsaved changes', () => {
    expect(store.selectedBusinessUnitId()).toBeNull();
    expect(store.unsavedChanges()).toBe(false);
  });

  it('retains the selected BU and allows it to be cleared', () => {
    store.setSelectedBusinessUnitId(22);
    expect(store.selectedBusinessUnitId()).toBe(22);
    store.setSelectedBusinessUnitId(null);
    expect(store.selectedBusinessUnitId()).toBeNull();
    expect(store.unsavedChanges()).toBe(false);
  });

  it('tracks edits and allows them to be cleared without losing the BU', () => {
    store.setSelectedBusinessUnitId(22);
    store.setUnsavedChanges(true);
    expect(store.unsavedChanges()).toBe(true);
    store.setUnsavedChanges(false);
    expect(store.unsavedChanges()).toBe(false);
    expect(store.selectedBusinessUnitId()).toBe(22);
  });

  it('clears the selected BU and unsaved changes when the journey is reset', () => {
    store.setSelectedBusinessUnitId(22);
    store.setUnsavedChanges(true);
    store.resetStore();
    expect(store.selectedBusinessUnitId()).toBeNull();
    expect(store.unsavedChanges()).toBe(false);
  });
});
