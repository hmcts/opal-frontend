import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { IFinesFpuBusinessUnit } from '../interfaces/fines-fpu-business-unit.interface';
import { FinesFpuStore } from './fines-fpu.store';

describe('FinesFpuStore', () => {
  const businessUnits: IFinesFpuBusinessUnit[] = [
    { business_unit_id: 78, business_unit_name: 'Eastshire', ticket_count: 3 },
    { business_unit_id: 80, business_unit_name: 'Westshire', ticket_count: 2 },
  ];
  let store: InstanceType<typeof FinesFpuStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FinesFpuStore] });
    store = TestBed.inject(FinesFpuStore);
  });

  it('should start with no business units, selections or unsaved changes', () => {
    expect(store.fragment()).toBe('to-publish');
    expect(store.tabData()).toBeNull();
    expect(store.businessUnits()).toEqual([]);
    expect(store.selectedBusinessUnitIds()).toEqual([]);
    expect(store.unsavedChanges()).toBe(false);
  });

  it('should persist the selected tab and its data in the journey state', () => {
    store.setFragment('published');
    store.setTabData(businessUnits);

    expect(store.fragment()).toBe('published');
    expect(store.tabData()).toEqual(businessUnits);
    expect(store.businessUnits()).toEqual(businessUnits);
  });

  it('should update the canonical tab data when setting business units', () => {
    store.setTabData([]);

    store.setBusinessUnits(businessUnits);

    expect(store.tabData()).toEqual(businessUnits);
    expect(store.businessUnits()).toEqual(businessUnits);
  });

  it('should reconcile selections when fresh tab data replaces the displayed business units', () => {
    store.setTabData(businessUnits);
    store.setSelectedBusinessUnitIds([78, 80]);
    const remainingBusinessUnits = [{ business_unit_id: 80, business_unit_name: 'Westshire', ticket_count: 1 }];

    store.setTabData(remainingBusinessUnits);

    expect(store.tabData()).toEqual(remainingBusinessUnits);
    expect(store.businessUnits()).toEqual(remainingBusinessUnits);
    expect(store.selectedBusinessUnitIds()).toEqual([80]);
  });

  it('should hide tab data without losing selections while another tab or request is active', () => {
    store.setTabData(businessUnits);
    store.setSelectedBusinessUnitIds([78, 80]);

    store.setTabData(null);

    expect(store.tabData()).toBeNull();
    expect(store.businessUnits()).toEqual([]);
    expect(store.selectedBusinessUnitIds()).toEqual([78, 80]);

    store.setTabData([{ business_unit_id: 80, business_unit_name: 'Westshire', ticket_count: 1 }]);

    expect(store.selectedBusinessUnitIds()).toEqual([80]);
  });

  it('should retain only unique available selections in the displayed business unit order', () => {
    store.setBusinessUnits(businessUnits);

    store.setSelectedBusinessUnitIds([80, 999, 78, 80]);

    expect(store.selectedBusinessUnitIds()).toEqual([78, 80]);
    expect(store.unsavedChanges()).toBe(false);
  });

  it('should remove deselected business units', () => {
    store.setBusinessUnits(businessUnits);
    store.setSelectedBusinessUnitIds([78, 80]);

    store.setSelectedBusinessUnitIds([80]);

    expect(store.selectedBusinessUnitIds()).toEqual([80]);
  });

  it('should preserve selections that remain available after a refresh and discard stale selections', () => {
    store.setBusinessUnits(businessUnits);
    store.setSelectedBusinessUnitIds([78, 80]);
    const refreshedBusinessUnits = [
      { business_unit_id: 80, business_unit_name: 'Westshire', ticket_count: 1 },
      { business_unit_id: 82, business_unit_name: 'Yorkshire', ticket_count: 4 },
    ];

    store.setBusinessUnits(refreshedBusinessUnits);

    expect(store.businessUnits()).toEqual(refreshedBusinessUnits);
    expect(store.selectedBusinessUnitIds()).toEqual([80]);
  });

  it('should clear selections when a refresh has no tickets', () => {
    store.setBusinessUnits(businessUnits);
    store.setSelectedBusinessUnitIds([78]);

    store.setBusinessUnits([]);

    expect(store.businessUnits()).toEqual([]);
    expect(store.selectedBusinessUnitIds()).toEqual([]);
  });

  it('should reject selections when there are no available business units', () => {
    store.setSelectedBusinessUnitIds([78]);

    expect(store.selectedBusinessUnitIds()).toEqual([]);
  });

  it('should reset the complete journey state', () => {
    store.setFragment('published');
    store.setTabData(businessUnits);
    store.setSelectedBusinessUnitIds([78, 80]);
    store.setUnsavedChanges(true);

    store.resetFinesFpuState();

    expect(store.fragment()).toBe('to-publish');
    expect(store.tabData()).toBeNull();
    expect(store.businessUnits()).toEqual([]);
    expect(store.selectedBusinessUnitIds()).toEqual([]);
    expect(store.unsavedChanges()).toBe(false);
  });
});
