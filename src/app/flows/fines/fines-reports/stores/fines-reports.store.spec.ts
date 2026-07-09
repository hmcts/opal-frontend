import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesReportsStore } from './fines-reports.store';

describe('FinesReportsStore', () => {
  let store: InstanceType<typeof FinesReportsStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinesReportsStore],
    });
    store = TestBed.inject(FinesReportsStore);
  });

  it('should initialise with no selected business units', () => {
    expect(store.selectedReportTypeId()).toBeNull();
    expect(store.selectedBusinessUnitIds()).toEqual([]);
    expect(store.hasSelectedBusinessUnits()).toBe(false);
    expect(store.hasSelectedBusinessUnitsForReport('operational_report_enforcement')).toBe(false);
  });

  it('should set selected business unit ids', () => {
    store.setSelectedBusinessUnitIds('operational_report_enforcement', [61, 68]);

    expect(store.selectedReportTypeId()).toBe('operational_report_enforcement');
    expect(store.selectedBusinessUnitIds()).toEqual([61, 68]);
    expect(store.getSelectedBusinessUnitIdsForReport('operational_report_enforcement')).toEqual([61, 68]);
    expect(store.getSelectedBusinessUnitIdsForReport('operational_report_payment')).toEqual([]);
    expect(store.hasSelectedBusinessUnits()).toBe(true);
    expect(store.hasSelectedBusinessUnitsForReport('operational_report_enforcement')).toBe(true);
    expect(store.hasSelectedBusinessUnitsForReport('operational_report_payment')).toBe(false);
  });

  it('should clear selected business unit ids', () => {
    store.setSelectedBusinessUnitIds('operational_report_enforcement', [61, 68]);

    store.clearSelectedBusinessUnitIds();

    expect(store.selectedReportTypeId()).toBeNull();
    expect(store.selectedBusinessUnitIds()).toEqual([]);
    expect(store.hasSelectedBusinessUnits()).toBe(false);
  });
});
