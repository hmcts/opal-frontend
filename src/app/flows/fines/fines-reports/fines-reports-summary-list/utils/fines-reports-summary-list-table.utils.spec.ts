import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { IOpalFinesReportInstance } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instance.interface';
import {
  getReportInstancesCountFromResponse,
  getReportInstancesFromResponse,
  getReportInstancesLimitFromResponse,
  isReportInstancesOverLimit,
  mapReportInstancesToTableData,
} from './fines-reports-summary-list-table.utils';

describe('fines-reports-summary-list-table.utils', () => {
  const businessUnitRefData: IOpalFinesBusinessUnit[] = [
    {
      business_unit_id: 67,
      business_unit_name: 'London Central & South East',
      business_unit_code: 'CLAMPO',
      account_number_prefix: '123',
      business_unit_type: 'area',
      opal_domain: 'Fines',
      configuration_items: [],
      welsh_language: false,
    },
    {
      business_unit_id: 77,
      business_unit_name: 'London North West',
      business_unit_code: 'LNWN',
      account_number_prefix: '456',
      business_unit_type: 'area',
      opal_domain: 'Fines',
      configuration_items: [],
      welsh_language: false,
    },
  ];

  it('should read report instances from supported response shapes', () => {
    const instances: IOpalFinesReportInstance[] = [{ instance_id: 1, name: 'Instance 1' }];

    expect(getReportInstancesFromResponse(null)).toEqual([]);
    expect(getReportInstancesFromResponse(instances)).toBe(instances);
    expect(getReportInstancesFromResponse({ report_instances: instances })).toBe(instances);
    expect(getReportInstancesFromResponse({ instances })).toBe(instances);
    expect(getReportInstancesFromResponse({ refData: instances })).toBe(instances);
    expect(getReportInstancesFromResponse({})).toEqual([]);
  });

  it('should read counts, limits, and over-limit state from supported response shapes', () => {
    const instances: IOpalFinesReportInstance[] = [{ instance_id: 1, name: 'Instance 1' }];

    expect(getReportInstancesCountFromResponse(null)).toBe(0);
    expect(getReportInstancesCountFromResponse(instances)).toBe(1);
    expect(getReportInstancesCountFromResponse({ count: 7, report_instances: instances })).toBe(7);
    expect(getReportInstancesCountFromResponse({ total_count: 8, report_instances: instances })).toBe(8);
    expect(getReportInstancesCountFromResponse({ total: 9, report_instances: instances })).toBe(9);
    expect(getReportInstancesCountFromResponse({ report_instances: instances })).toBe(1);

    expect(getReportInstancesLimitFromResponse(null)).toBeNull();
    expect(getReportInstancesLimitFromResponse(instances)).toBeNull();
    expect(getReportInstancesLimitFromResponse({ max_results: 10, report_instances: instances })).toBe(10);
    expect(getReportInstancesLimitFromResponse({ limit: 11, report_instances: instances })).toBe(11);

    expect(isReportInstancesOverLimit(null)).toBe(false);
    expect(isReportInstancesOverLimit(instances)).toBe(false);
    expect(isReportInstancesOverLimit({ has_more: true, report_instances: instances })).toBe(true);
    expect(isReportInstancesOverLimit({ count: 12, max_results: 10, report_instances: instances })).toBe(true);
    expect(isReportInstancesOverLimit({ count: 10, max_results: 10, report_instances: instances })).toBe(false);
  });

  it('should map report instances with date, status, file type, creator, and business unit fallbacks', () => {
    const dateService = TestBed.inject(DateService);
    const rows = mapReportInstancesToTableData(
      [
        {
          instance_id: 1,
          created_at: '2026-06-08T09:15:00Z',
          report_name: 'Operational report',
          business_units: ['CLAMPO', '77'],
          requested_by_name: 'Olivia Smith',
          generation_status: 'READY',
          number_of_records: 0,
          is_downloadable: true,
          supported_types: [' csv ', 'PDF'],
        },
        {
          instanceId: 2,
          requestedAt: 'not-a-date',
          name: 'Fallback report',
          businessUnits: [{ businessUnitName: 'Named business unit' }, { businessUnitCode: 'CLAMPO' }, {}],
          requestedBy: { name: 'James Brown' },
          status: { code: 'READY', display_name: 'Ready' },
          numberOfRecords: 5,
          isDownloadable: true,
          supportedFileTypes: ['CSV'],
        },
        {
          name: 'Details report',
          business_units_details: [{ business_unit_id: 67 }, { business_unit_name: 'Explicit business unit' }],
          created_by: 'Sarah Johnson',
          status: 'FAILED',
          supported_file_types: ['PDF'],
        },
        {
          name: 'Mixed business units report',
          business_units: ['CLAMPO', { business_unit_id: 77 }, {}],
          status: 'READY',
          number_of_records: 1,
        },
        {
          generatedAt: '2026-06-10T10:30:00Z',
          requested_at: '2026-06-09T10:30:00Z',
          business_units: [{ business_unit_id: 67 }, { business_unit_code: 'LNWN' }],
          status: { code: 'READY', displayName: 'Display ready' },
          no_of_records: 2,
        },
        {
          requested_at: '2026-06-11T10:30:00Z',
          business_units: ['UNKNOWN'],
        },
        {
          business_units_details: [{}, { business_unit_code: 'LNWN' }],
        },
        {
          status: { code: 'READY' },
        },
      ],
      businessUnitRefData,
      dateService,
    );

    expect(rows[0]).toEqual(
      expect.objectContaining({
        'Date and time': expect.any(Number),
        Title: 'Operational report',
        'Business unit': 'London Central & South East, London North West',
        'Created by': 'Olivia Smith',
        Status: 'No content',
        instanceId: '1',
        dateTimeDisplay: expect.stringContaining('08 Jun 2026 at'),
        isDownloadable: true,
        supportsCsv: true,
      }),
    );
    expect(rows[1]).toEqual(
      expect.objectContaining({
        'Date and time': 0,
        'Business unit': 'Named business unit, London Central & South East',
        'Created by': 'James Brown',
        Status: 'Ready',
        instanceId: '2',
        dateTimeDisplay: 'not-a-date',
        supportsCsv: true,
      }),
    );
    expect(rows[2]).toEqual(
      expect.objectContaining({
        'Business unit': 'London Central & South East, Explicit business unit',
        'Created by': 'Sarah Johnson',
        Status: 'Failed',
        instanceId: '',
        isDownloadable: false,
        supportsCsv: false,
      }),
    );
    expect(rows[3]).toEqual(
      expect.objectContaining({
        'Business unit': 'London Central & South East, London North West',
      }),
    );
    expect(rows[4]).toEqual(
      expect.objectContaining({
        Title: '',
        'Business unit': 'London Central & South East, London North West',
        Status: 'Display ready',
      }),
    );
    expect(rows[5]).toEqual(
      expect.objectContaining({
        'Business unit': 'UNKNOWN',
        Status: '',
      }),
    );
    expect(rows[6]).toEqual(
      expect.objectContaining({
        'Business unit': 'London North West',
        Status: '',
      }),
    );
    expect(rows[7]).toEqual(
      expect.objectContaining({
        'Business unit': '',
        Status: 'Ready',
      }),
    );
  });

  it('should map report instances without optional services or nested business unit data', () => {
    const rows = mapReportInstancesToTableData([
      {
        created_timestamp: '2026-06-08T09:15:00Z',
        name: 'Basic report',
        business_unit: 'Multiple',
        status: { displayName: 'Queued' },
      },
    ]);

    expect(rows[0]).toEqual(
      expect.objectContaining({
        'Date and time': 0,
        Title: 'Basic report',
        'Business unit': 'Multiple',
        'Created by': '',
        Status: 'Queued',
        dateTimeDisplay: '2026-06-08T09:15:00Z',
        supportsCsv: false,
      }),
    );
  });
});
