import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesReportsSummaryListStore } from './fines-reports-summary-list.store';

describe('FinesReportsSummaryListStore', () => {
  let store: InstanceType<typeof FinesReportsSummaryListStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinesReportsSummaryListStore],
    });

    store = TestBed.inject(FinesReportsSummaryListStore);
    store.resetFilters();
  });

  it('should store the current report type id', () => {
    store.setReportTypeId('report-a');

    expect(store.reportTypeId()).toBe('report-a');
  });

  it('should keep filters when resetting for the same report type', () => {
    store.setReportTypeId('report-a');
    store.setFilters({
      businessUnit: '67',
      dateFilter: 'customDays',
      days: '10',
      dateFrom: '',
      dateTo: '',
    });

    store.resetForReportType('report-a');

    expect(store.filters()).toEqual({
      businessUnit: '67',
      dateFilter: 'customDays',
      days: '10',
      dateFrom: '',
      dateTo: '',
    });
  });

  it('should reset filters when resetting for a different report type', () => {
    store.setReportTypeId('report-a');
    store.setFilters({
      businessUnit: '67',
      dateFilter: 'customDays',
      days: '10',
      dateFrom: '',
      dateTo: '',
    });
    store.setAppliedQuery({
      fromDate: '2026-06-01',
      toDate: '2026-06-10',
      businessUnit: '67',
    });

    store.resetForReportType('report-b');

    expect(store.reportTypeId()).toBe('report-b');
    expect(store.filters()).toEqual({
      businessUnit: 'all',
      dateFilter: 'last7Days',
      days: '',
      dateFrom: '',
      dateTo: '',
    });
    expect(store.appliedQuery()).toBeNull();
  });
});
