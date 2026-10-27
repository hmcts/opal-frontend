import { TestBed } from '@angular/core/testing';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { Settings } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IFinesFinanceInboundFilesTableOptions } from '../interfaces/fines-finance-inbound-files-table-options.interface';
import { FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK } from '../../fines-finance-inbound-files/mocks/fines-finance-inbound-files-response.mock';
import { mapInboundFilesToTableData } from './fines-finance-payload-map-inbound-files.utils';

describe('mapInboundFilesToTableData', () => {
  let dateService: DateService;
  let previousZone: typeof Settings.defaultZone;
  const file = FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files![0];
  const options: IFinesFinanceInboundFilesTableOptions = {
    businessUnits: [
      { name: 'Camberwell Green', value: '0046' },
      { name: 'Numeric code', value: 99 },
    ],
    sources: [{ name: 'Allpay', value: 'ALLPAY' }],
    types: [{ name: 'RAW', value: 'SOURCE' }],
  };
  beforeEach(() => {
    TestBed.configureTestingModule({});
    dateService = TestBed.inject(DateService);
    previousZone = Settings.defaultZone;
    Settings.defaultZone = 'Europe/London';
  });
  afterEach(() => {
    Settings.defaultZone = previousZone;
    vi.restoreAllMocks();
  });

  it('resolves known labels and joins multiple business units with a raw fallback', () => {
    const response = { ...file, business_unit_codes: ['0046', '99', 'UNKNOWN'] };
    const original = structuredClone(response);
    expect(mapInboundFilesToTableData([response], options, dateService)).toEqual([
      {
        'File ID': 1001,
        'Date and time': Date.parse('2026-10-20T12:00:00Z'),
        dateTimeDisplay: '20 Oct 2026 at 13:00',
        Title: 'allpay_1001.xml',
        Type: 'RAW',
        'Business unit': 'Camberwell Green, Numeric code, UNKNOWN',
        Source: 'Allpay',
        Status: 'Ready',
        Actions: null,
      },
    ]);
    expect(response).toEqual(original);
  });

  it.each([null, undefined, []])('returns an empty table for %s files', (files) => {
    expect(mapInboundFilesToTableData(files, options, dateService)).toEqual([]);
  });

  it('retains unknown values and missing nullable fields', () => {
    const unknown = mapInboundFilesToTableData(
      [{ ...file, type: 'OTHER_TYPE', source: 'OTHER_SOURCE', status: 'UNKNOWN_STATUS', business_unit_codes: [] }],
      options,
      dateService,
    )[0];
    expect(unknown).toMatchObject({
      Type: 'OTHER_TYPE',
      Source: 'OTHER_SOURCE',
      Status: 'UNKNOWN_STATUS',
      'Business unit': '',
    });
    const missing = mapInboundFilesToTableData(
      [
        {
          ...file,
          interface_file_id: null,
          file_name: null,
          type: null,
          source: null,
          status: null,
          business_unit_codes: null,
          created_datetime: null,
        },
      ],
      options,
      dateService,
    )[0];
    expect(missing).toEqual({
      'File ID': null,
      'Date and time': null,
      dateTimeDisplay: null,
      Title: null,
      Type: null,
      Source: null,
      Status: null,
      'Business unit': null,
      Actions: null,
    });
  });

  it.each([
    ['SUCCESS', 'Ready'],
    ['SUCCESS_NO_TRANSACTIONS', 'Ready'],
    ['DUPLICATE', 'Ready'],
    ['SUPERSEDED', 'Ready'],
    ['FAILED', 'File failed'],
    ['FAILED_SUPERSEDED', 'File failed'],
    ['INGESTED', 'In-Progress'],
  ])('maps status %s to %s', (status, expected) => {
    expect(mapInboundFilesToTableData([{ ...file, status }], options, dateService)[0].Status).toBe(expected);
  });

  it.each([
    ['2026-10-20T12:00:00', '20 Oct 2026 at 13:00', Date.parse('2026-10-20T12:00:00Z')],
    ['2026-10-20T12:00:00Z', '20 Oct 2026 at 13:00', Date.parse('2026-10-20T12:00:00Z')],
    ['2026-10-20T13:00:00+01:00', '20 Oct 2026 at 13:00', Date.parse('2026-10-20T12:00:00Z')],
    ['2026-10-20T13:30:00+0130', '20 Oct 2026 at 13:00', Date.parse('2026-10-20T12:00:00Z')],
    ['2026-10-20T07:00:00-0500', '20 Oct 2026 at 13:00', Date.parse('2026-10-20T12:00:00Z')],
    ['2026-10-20T12:00:00.123456', '20 Oct 2026 at 13:00', Date.parse('2026-10-20T12:00:00.123Z')],
    ['2026-12-20T12:00:00Z', '20 Dec 2026 at 12:00', Date.parse('2026-12-20T12:00:00Z')],
    ['invalid-time', 'invalid-time', null],
    ['', '', null],
    [null, null, null],
  ])('maps timestamp %s to local display and chronological milliseconds', (timestamp, display, milliseconds) => {
    const row = mapInboundFilesToTableData([{ ...file, created_datetime: timestamp }], options, dateService)[0];
    expect(row.dateTimeDisplay).toBe(display);
    expect(row['Date and time']).toBe(milliseconds);
  });

  it('keeps chronological order across months and timezone offsets independent of display text', () => {
    const files = [
      { ...file, interface_file_id: 1, created_datetime: '2026-02-01T00:15:00+02:00' },
      { ...file, interface_file_id: 2, created_datetime: '2026-01-31T23:00:00Z' },
      { ...file, interface_file_id: 3, created_datetime: '2026-02-01T00:00:00Z' },
    ];
    const rows = mapInboundFilesToTableData(files, options, dateService);
    expect(
      [...rows]
        .sort((first, second) => second['Date and time']! - first['Date and time']!)
        .map((row) => row['File ID']),
    ).toEqual([3, 2, 1]);
    expect(rows[0].dateTimeDisplay).toBe('31 Jan 2026 at 22:15');
  });
});
