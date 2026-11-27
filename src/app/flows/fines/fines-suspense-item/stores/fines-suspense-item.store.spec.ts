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
    expect(store.selectedBusinessUnitName()).toBeNull();
    expect(store.submittedBusinessUnitId()).toBeNull();
    expect(store.submittedBusinessUnitName()).toBeNull();
    expect(store.unsavedChanges()).toBe(false);
  });

  it('retains the selected BU and allows it to be cleared', () => {
    store.setSelectedBusinessUnit(22, 'Test business unit');
    expect(store.selectedBusinessUnitId()).toBe(22);
    expect(store.selectedBusinessUnitName()).toBe('Test business unit');
    store.setSelectedBusinessUnit(35, 'West London');
    expect(store.selectedBusinessUnitId()).toBe(35);
    expect(store.selectedBusinessUnitName()).toBe('West London');
    store.setSelectedBusinessUnit(null, null);
    expect(store.selectedBusinessUnitId()).toBeNull();
    expect(store.selectedBusinessUnitName()).toBeNull();
    expect(store.unsavedChanges()).toBe(false);
  });

  it('tracks edits and allows them to be cleared without losing the BU', () => {
    store.setSelectedBusinessUnit(22, 'Test business unit');
    store.setUnsavedChanges(true);
    expect(store.unsavedChanges()).toBe(true);
    store.setUnsavedChanges(false);
    expect(store.unsavedChanges()).toBe(false);
    expect(store.selectedBusinessUnitId()).toBe(22);
    expect(store.selectedBusinessUnitName()).toBe('Test business unit');
  });

  it('keeps submitted BU context independent of later selection changes and releases it after navigation', () => {
    store.setSelectedBusinessUnit(22, 'Submitted BU');
    store.setSubmittedBusinessUnit(22, 'Submitted BU');
    store.setSelectedBusinessUnit(35, 'Amended BU');

    expect(store.submittedBusinessUnitId()).toBe(22);
    expect(store.submittedBusinessUnitName()).toBe('Submitted BU');
    store.setSubmittedBusinessUnit(null, null);
    expect(store.submittedBusinessUnitId()).toBeNull();
    expect(store.submittedBusinessUnitName()).toBeNull();
    expect(store.selectedBusinessUnitId()).toBe(35);
    expect(store.selectedBusinessUnitName()).toBe('Amended BU');
  });

  it('clears the selected BU and unsaved changes when the journey is reset', () => {
    store.setSelectedBusinessUnit(22, 'Test business unit');
    store.setSubmittedBusinessUnit(22, 'Test business unit');
    store.setUnsavedChanges(true);
    store.resetStore();
    expect(store.selectedBusinessUnitId()).toBeNull();
    expect(store.selectedBusinessUnitName()).toBeNull();
    expect(store.submittedBusinessUnitId()).toBeNull();
    expect(store.submittedBusinessUnitName()).toBeNull();
    expect(store.unsavedChanges()).toBe(false);
  });
});
