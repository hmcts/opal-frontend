import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import type { IOpalFileHandlingInterfaceFile } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import { Settings } from 'luxon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK } from '../../fines-finance-inbound-files/mocks/fines-finance-inbound-files-response.mock';
import {
  getInterfaceFileDisplayName,
  mapInterfaceFileToTableData,
} from './fines-finance-payload-map-interface-files.utils';

const businessUnits: IAlphagovAccessibleAutocompleteItem[] = [
  { name: 'Camberwell Green', value: '0046' },
  { name: 'Unpadded unit', value: 46 },
  { name: 'Numeric unit', value: 99 },
];

describe('getInterfaceFileDisplayName', () => {
  it.each([
    { name: 'a known string code', value: '0046', expected: 'Camberwell Green' },
    { name: 'a numeric option value', value: '99', expected: 'Numeric unit' },
    { name: 'an unpadded numeric code', value: '46', expected: 'Unpadded unit' },
    { name: 'an unmatched code with leading zeros', value: '046', expected: '046' },
    { name: 'an unknown code', value: 'UNKNOWN', expected: 'UNKNOWN' },
    { name: 'an empty code', value: '', expected: '' },
    { name: 'a missing code', value: null, expected: null },
  ])('resolves $name while retaining unknown or missing values', ({ value, expected }) => {
    expect(getInterfaceFileDisplayName(value, businessUnits)).toBe(expected);
  });

  it('retains the original code when reference options are empty', () => {
    expect(getInterfaceFileDisplayName('0046', [])).toBe('0046');
  });

  it('leaves reference option values and ordering unchanged', () => {
    const options = structuredClone(businessUnits);
    const original = structuredClone(options);
    options.forEach((option) => Object.freeze(option));
    Object.freeze(options);

    expect(getInterfaceFileDisplayName('99', options)).toBe('Numeric unit');
    expect(getInterfaceFileDisplayName('0046', options)).toBe('Camberwell Green');
    expect(options).toEqual(original);
  });
});

describe('mapInterfaceFileToTableData', () => {
  let dateService: DateService;
  let previousZone: typeof Settings.defaultZone;
  let file: IOpalFileHandlingInterfaceFile;

  beforeEach(() => {
    previousZone = Settings.defaultZone;
    Settings.defaultZone = 'Europe/London';
    dateService = new DateService();
    file = structuredClone(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files![0]);
  });

  afterEach(() => {
    Settings.defaultZone = previousZone;
  });

  it('returns exactly the shared table cells without direction-specific metadata', () => {
    expect(mapInterfaceFileToTableData(file, businessUnits, dateService)).toEqual({
      'File ID': 1001,
      'Date and time': Date.parse('2026-10-20T12:00:00Z'),
      dateTimeDisplay: '20 Oct 2026 at 13:00',
      Title: 'allpay_1001.xml',
      'Business unit': 'Camberwell Green',
      Status: 'Ready',
      Actions: 'Download',
    });
  });

  it('retains missing file identifiers and titles', () => {
    const row = mapInterfaceFileToTableData(
      { ...file, interface_file_id: null, file_name: null },
      businessUnits,
      dateService,
    );

    expect(row['File ID']).toBeNull();
    expect(row.Title).toBeNull();
    expect(row.Actions).toBe('');
  });

  it.each([
    {
      name: 'multiple codes in API order, including duplicates and unknown codes',
      codes: ['99', '0046', 'UNKNOWN', '99'],
      expected: 'Numeric unit, Camberwell Green, UNKNOWN, Numeric unit',
    },
    { name: 'an empty list', codes: [], expected: '' },
    { name: 'a missing list', codes: null, expected: null },
    { name: 'an unknown code', codes: ['UNLISTED'], expected: 'UNLISTED' },
  ])('maps business units for $name', ({ codes, expected }) => {
    const row = mapInterfaceFileToTableData({ ...file, business_unit_codes: codes }, businessUnits, dateService);

    expect(row['Business unit']).toBe(expected);
  });

  it('retains business-unit codes when reference data is unavailable', () => {
    expect(mapInterfaceFileToTableData(file, [], dateService)['Business unit']).toBe('0046');
  });

  it.each([
    { status: 'SUCCESS', expected: 'Ready', action: 'Download' },
    { status: 'SUCCESS_NO_TRANSACTIONS', expected: 'Ready', action: 'Download' },
    { status: 'DUPLICATE', expected: 'Ready', action: 'Download' },
    { status: 'SUPERSEDED', expected: 'Ready', action: 'Download' },
    { status: 'FAILED', expected: 'File failed', action: 'Download' },
    { status: 'FAILED_SUPERSEDED', expected: 'File failed', action: 'Download' },
    { status: 'INGESTED', expected: 'In-Progress', action: '' },
    { status: 'UNRECOGNISED_STATUS', expected: 'UNRECOGNISED_STATUS', action: '' },
    { status: '', expected: null, action: '' },
    { status: null, expected: null, action: '' },
  ])('maps status $status to $expected with the available action label', ({ status, expected, action }) => {
    const row = mapInterfaceFileToTableData({ ...file, status }, businessUnits, dateService);
    expect(row.Status).toBe(expected);
    expect(row.Actions).toBe(action);
  });

  it.each([
    { name: 'an unzoned timestamp with microseconds', timestamp: '2026-07-01T12:15:30.123456' },
    { name: 'an explicit UTC timestamp', timestamp: '2026-07-01T12:15:30.123Z' },
    { name: 'a positive offset with a colon', timestamp: '2026-07-01T14:45:30.123+02:30' },
    { name: 'a positive offset without a colon', timestamp: '2026-07-01T14:45:30.123+0230' },
    { name: 'a negative offset with a colon', timestamp: '2026-07-01T07:15:30.123-05:00' },
    { name: 'a negative offset without a colon', timestamp: '2026-07-01T07:15:30.123-0500' },
  ])('preserves the instant and formats local time for $name', ({ timestamp }) => {
    const row = mapInterfaceFileToTableData({ ...file, created_datetime: timestamp }, businessUnits, dateService);

    expect(row['Date and time']).toBe(Date.parse('2026-07-01T12:15:30.123Z'));
    expect(row.dateTimeDisplay).toBe('01 Jul 2026 at 13:15');
  });

  it.each([
    { timestamp: '2026-03-29T00:30:00', expected: '29 Mar 2026 at 00:30' },
    { timestamp: '2026-03-29T01:30:00', expected: '29 Mar 2026 at 02:30' },
  ])('treats unzoned $timestamp as UTC across the spring DST change', ({ timestamp, expected }) => {
    const row = mapInterfaceFileToTableData({ ...file, created_datetime: timestamp }, businessUnits, dateService);

    expect(row['Date and time']).toBe(Date.parse(`${timestamp}Z`));
    expect(row.dateTimeDisplay).toBe(expected);
  });

  it('keeps distinct sortable instants when local times repeat at the autumn DST change', () => {
    const before = mapInterfaceFileToTableData(
      { ...file, created_datetime: '2026-10-25T00:30:00Z' },
      businessUnits,
      dateService,
    );
    const after = mapInterfaceFileToTableData(
      { ...file, created_datetime: '2026-10-25T01:30:00Z' },
      businessUnits,
      dateService,
    );

    expect(before.dateTimeDisplay).toBe('25 Oct 2026 at 01:30');
    expect(after.dateTimeDisplay).toBe(before.dateTimeDisplay);
    expect(before['Date and time']).toBe(Date.parse('2026-10-25T00:30:00Z'));
    expect(after['Date and time']).toBe(Date.parse('2026-10-25T01:30:00Z'));
  });

  it.each([
    { timestamp: '2026-01-01T02:30:00Z', expected: '31 Dec 2025 at 21:30' },
    { timestamp: '2026-07-01T02:30:00Z', expected: '30 Jun 2026 at 22:30' },
  ])('uses the user timezone and its seasonal offset for $timestamp', ({ timestamp, expected }) => {
    Settings.defaultZone = 'America/New_York';

    const row = mapInterfaceFileToTableData({ ...file, created_datetime: timestamp }, businessUnits, dateService);

    expect(row['Date and time']).toBe(Date.parse(timestamp));
    expect(row.dateTimeDisplay).toBe(expected);
  });

  it.each(['invalid-time', '2026-02-30T12:00:00', '', null])(
    'retains invalid or missing timestamp %s for display without a sort value',
    (timestamp) => {
      const row = mapInterfaceFileToTableData({ ...file, created_datetime: timestamp }, businessUnits, dateService);

      expect(row['Date and time']).toBeNull();
      expect(row.dateTimeDisplay).toBe(timestamp);
    },
  );

  it('leaves file metadata, business-unit codes and reference options unchanged', () => {
    const originalFile = structuredClone(file);
    const options = structuredClone(businessUnits);
    const originalOptions = structuredClone(options);
    Object.freeze(file.business_unit_codes);
    Object.freeze(file);
    options.forEach((option) => Object.freeze(option));
    Object.freeze(options);

    mapInterfaceFileToTableData(file, options, dateService);

    expect(file).toEqual(originalFile);
    expect(options).toEqual(originalOptions);
  });
});
