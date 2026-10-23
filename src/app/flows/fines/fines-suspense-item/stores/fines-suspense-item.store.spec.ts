import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesSuspenseItemStore } from './fines-suspense-item.store';

describe('FinesSuspenseItemStore', () => {
  let store: InstanceType<typeof FinesSuspenseItemStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(FinesSuspenseItemStore);
  });

  it('starts without a selected BU', () => {
    expect(store.selectedBusinessUnitId()).toBeNull();
  });

  it('retains the selected BU and allows it to be cleared', () => {
    store.setSelectedBusinessUnitId(22);
    expect(store.selectedBusinessUnitId()).toBe(22);
    store.setSelectedBusinessUnitId(null);
    expect(store.selectedBusinessUnitId()).toBeNull();
  });

  it('clears the selected BU when the journey is reset', () => {
    store.setSelectedBusinessUnitId(22);
    store.resetStore();
    expect(store.selectedBusinessUnitId()).toBeNull();
  });
});
