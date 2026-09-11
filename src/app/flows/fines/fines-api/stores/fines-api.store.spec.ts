import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_API_STATE } from './constants/fines-api-state.constant';
import { FinesApiStore } from './fines-api.store';

describe('FinesApiStore', () => {
  let store: InstanceType<typeof FinesApiStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(FinesApiStore);
    store.resetFinesApiState();
  });

  it('should be created with the initial state', () => {
    expect(store).toBeTruthy();
    expect(store.selectedBusinessUnitIds()).toEqual(FINES_API_STATE.selectedBusinessUnitIds);
    expect(store.selectedFileIds()).toEqual(FINES_API_STATE.selectedFileIds);
    expect(store.overrideInhibitFileIds()).toEqual(FINES_API_STATE.overrideInhibitFileIds);
    expect(store.activeTab()).toBe(FINES_API_STATE.activeTab);
    expect(store.stateChanges()).toBe(false);
    expect(store.unsavedChanges()).toBe(false);
  });

  it('should set selected business unit ids and clear file selections', () => {
    store.setSelectedFileIds(['file-1']);
    store.setOverrideInhibitFileIds(['file-1']);

    store.setSelectedBusinessUnitIds([101, 202]);

    expect(store.selectedBusinessUnitIds()).toEqual([101, 202]);
    expect(store.selectedFileIds()).toEqual([]);
    expect(store.overrideInhibitFileIds()).toEqual([]);
    expect(store.stateChanges()).toBe(true);
    expect(store.unsavedChanges()).toBe(true);
  });

  it('should compute whether business units have been selected', () => {
    expect(store.hasSelectedBusinessUnits()).toBe(false);

    store.setSelectedBusinessUnitIds([101]);

    expect(store.hasSelectedBusinessUnits()).toBe(true);
  });

  it('should clear selected business unit ids and dependent selections', () => {
    store.setSelectedBusinessUnitIds([101]);
    store.setSelectedFileIds(['file-1']);
    store.setOverrideInhibitFileIds(['file-1']);

    store.clearSelectedBusinessUnitIds();

    expect(store.selectedBusinessUnitIds()).toEqual([]);
    expect(store.selectedFileIds()).toEqual([]);
    expect(store.overrideInhibitFileIds()).toEqual([]);
    expect(store.stateChanges()).toBe(false);
    expect(store.unsavedChanges()).toBe(false);
  });

  it('should set selected file ids and clear override inhibits', () => {
    store.setOverrideInhibitFileIds(['file-1']);

    store.setSelectedFileIds(['file-2']);

    expect(store.selectedFileIds()).toEqual(['file-2']);
    expect(store.overrideInhibitFileIds()).toEqual([]);
    expect(store.hasSelectedFiles()).toBe(true);
    expect(store.stateChanges()).toBe(true);
    expect(store.unsavedChanges()).toBe(true);
  });

  it('should set override inhibit file ids', () => {
    store.setOverrideInhibitFileIds(['file-1', 'file-2']);

    expect(store.overrideInhibitFileIds()).toEqual(['file-1', 'file-2']);
  });

  it('should set the active tab', () => {
    store.setActiveTab('allocate');

    expect(store.activeTab()).toBe('allocate');
  });

  it('should set state and unsaved change flags explicitly', () => {
    store.setStateChanges(true);
    store.setUnsavedChanges(true);

    expect(store.stateChanges()).toBe(true);
    expect(store.unsavedChanges()).toBe(true);
  });

  it('should reset to the initial state', () => {
    store.setSelectedBusinessUnitIds([101]);
    store.setSelectedFileIds(['file-1']);
    store.setOverrideInhibitFileIds(['file-1']);
    store.setActiveTab('ignored');

    store.resetFinesApiState();

    expect(store.selectedBusinessUnitIds()).toEqual(FINES_API_STATE.selectedBusinessUnitIds);
    expect(store.selectedFileIds()).toEqual(FINES_API_STATE.selectedFileIds);
    expect(store.overrideInhibitFileIds()).toEqual(FINES_API_STATE.overrideInhibitFileIds);
    expect(store.activeTab()).toBe(FINES_API_STATE.activeTab);
    expect(store.stateChanges()).toBe(false);
    expect(store.unsavedChanges()).toBe(false);
  });
});
