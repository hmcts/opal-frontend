import { TestBed } from '@angular/core/testing';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { Settings } from 'luxon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK } from '../mocks/fines-finance-outbound-files-response.mock';
import { mapOutboundFilesToTableData } from './fines-finance-payload-map-outbound-files.utils';

describe('mapOutboundFilesToTableData', () => {
  let dateService: DateService;
  let previousZone: typeof Settings.defaultZone;
  const file = FINES_FINANCE_OUTBOUND_FILES_RESPONSE_MOCK.interface_files![0];
  const businessUnits = [{ name: 'Camberwell Green', value: '0046' }];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    dateService = TestBed.inject(DateService);
    previousZone = Settings.defaultZone;
    Settings.defaultZone = 'Europe/London';
  });

  afterEach(() => {
    Settings.defaultZone = previousZone;
  });

  it('maps outbound recipient labels and localized row metadata without inbound-only columns', () => {
    const original = structuredClone(file);
    expect(mapOutboundFilesToTableData([file], businessUnits, dateService)).toEqual([
      {
        'File ID': 2001,
        'Date and time': Date.parse('2026-10-20T12:00:00Z'),
        dateTimeDisplay: '20 Oct 2026 at 13:00',
        Title: 'ant_2001.csv',
        'Business unit': 'Camberwell Green',
        Target: 'ANT CSV',
        Status: 'Ready',
        Actions: 'Download',
      },
    ]);
    expect(file).toEqual(original);
  });

  it.each([
    ['ANT_CSV', 'ANT CSV'],
    ['ALLPAY_OUT', 'Allpay Out'],
    ['OTHER_TARGET', 'OTHER_TARGET'],
    [null, null],
  ])('maps target %s to %s', (target, expected) => {
    expect(mapOutboundFilesToTableData([{ ...file, target }], businessUnits, dateService)[0].Target).toBe(expected);
  });

  it('retains files with null business units and joins multiple codes with an unknown-code fallback', () => {
    const rows = mapOutboundFilesToTableData(
      [
        { ...file, business_unit_codes: null },
        { ...file, business_unit_codes: ['0046', 'UNKNOWN'] },
      ],
      businessUnits,
      dateService,
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]['Business unit']).toBeNull();
    expect(rows[1]['Business unit']).toBe('Camberwell Green, UNKNOWN');
  });

  it.each([null, undefined, []])('returns no rows for %s files', (files) => {
    expect(mapOutboundFilesToTableData(files, businessUnits, dateService)).toEqual([]);
  });

  it.each([
    ['SUCCESS', 'Ready'],
    ['SUCCESS_NO_TRANSACTIONS', 'Ready'],
    ['DUPLICATE', 'Ready'],
    ['SUPERSEDED', 'Ready'],
    ['FAILED', 'File failed'],
    ['FAILED_SUPERSEDED', 'File failed'],
    ['INGESTED', 'In-Progress'],
    ['UNKNOWN_STATUS', 'UNKNOWN_STATUS'],
  ])('keeps the finance status mapping for outbound %s files', (status, expected) => {
    expect(mapOutboundFilesToTableData([{ ...file, status }], businessUnits, dateService)[0].Status).toBe(expected);
  });
});
