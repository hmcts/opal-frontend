import { TestBed } from '@angular/core/testing';
import { Settings } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { buildInboundFilesSearchParams } from './fines-finance-payload-build-inbound-files-search.utils';
import { FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE } from '../../constants/fines-finance-inbound-files-initial-filter-state.constant';
import { FinesFinanceInterfaceFileType } from '../../constants/fines-finance-interface-file-type.constant';
import { InterfaceFileViewerFileStatus } from '../../constants/fines-finance-interface-file-status.constant';
import { FinesFinanceInterfaceFileSource } from '../../constants/fines-finance-interface-file-source.constant';
import { InterfaceFileViewerSupportedDomain } from '../../constants/fines-finance-interface-file-domain.constant';
import { IFinesFinanceInboundFilesForm } from '../interfaces/fines-finance-inbound-files-form.interface';

describe('buildInboundFilesSearchParams', () => {
  let dateService: DateService;
  let previousZone: typeof Settings.defaultZone;
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-06T12:00:00Z'));
    previousZone = Settings.defaultZone;
    Settings.defaultZone = 'Europe/London';

    TestBed.configureTestingModule({});
    dateService = TestBed.inject(DateService);
  });

  afterEach(() => {
    Settings.defaultZone = previousZone;
    vi.useRealTimers();
  });

  it('builds the initial last-seven-days search without optional filter selections', () => {
    const formData: IFinesFinanceInboundFilesForm = {
      businessUnit: null,
      dateFilter: 'last7Days',
      days: '',
      dateFrom: '',
      dateTo: '',
      fileType: null,
      source: null,
    };

    const params = buildInboundFilesSearchParams(formData, dateService);

    expect(params).toEqual({
      domain: InterfaceFileViewerSupportedDomain.Fines,
      from_date: '2026-09-29T23:00:00',
      not_status: [InterfaceFileViewerFileStatus.FailedSuperseded],
      target: 'OPAL',
      type: ['SOURCE', 'TRANSFORMED_JSON'],
      to_date: '2026-10-06T22:59:59.999999',
    });
  });

  it('combines business unit, source, type and an inclusive custom-day range', () => {
    const formData: IFinesFinanceInboundFilesForm = {
      businessUnit: '077',
      dateFilter: 'customDays',
      days: '14',
      dateFrom: '',
      dateTo: '',
      fileType: FinesFinanceInterfaceFileType.TransformedJson,
      source: FinesFinanceInterfaceFileSource.Allpay,
    };

    const params = buildInboundFilesSearchParams(formData, dateService);

    expect(params).toEqual({
      business_unit_code: '077',
      domain: InterfaceFileViewerSupportedDomain.Fines,
      from_date: '2026-09-22T23:00:00',
      not_status: [InterfaceFileViewerFileStatus.FailedSuperseded],
      source: FinesFinanceInterfaceFileSource.Allpay,
      target: 'OPAL',
      to_date: '2026-10-06T22:59:59.999999',
      type: [FinesFinanceInterfaceFileType.TransformedJson],
    });
  });

  it('converts explicit date boundaries to inclusive API timestamps', () => {
    const formData: IFinesFinanceInboundFilesForm = {
      businessUnit: null,
      dateFilter: 'dateRange',
      days: '',
      dateFrom: '01/10/2026',
      dateTo: '05/10/2026',
      fileType: null,
      source: null,
    };

    const params = buildInboundFilesSearchParams(formData, dateService);

    expect(params).toEqual({
      domain: InterfaceFileViewerSupportedDomain.Fines,
      from_date: '2026-09-30T23:00:00',
      not_status: [InterfaceFileViewerFileStatus.FailedSuperseded],
      target: 'OPAL',
      type: ['SOURCE', 'TRANSFORMED_JSON'],
      to_date: '2026-10-05T22:59:59.999999',
    });
  });

  it.each([
    {
      season: 'British Summer Time',
      date: '20/10/2026',
      from: '2026-10-19T23:00:00',
      to: '2026-10-20T22:59:59.999999',
      hours: 24,
    },
    {
      season: 'winter',
      date: '20/01/2026',
      from: '2026-01-20T00:00:00',
      to: '2026-01-20T23:59:59.999999',
      hours: 24,
    },
    {
      season: 'the spring DST transition',
      date: '29/03/2026',
      from: '2026-03-29T00:00:00',
      to: '2026-03-29T22:59:59.999999',
      hours: 23,
    },
    {
      season: 'the autumn DST transition',
      date: '25/10/2026',
      from: '2026-10-24T23:00:00',
      to: '2026-10-25T23:59:59.999999',
      hours: 25,
    },
  ])('converts the whole local day during $season to UTC without an offset', ({ date, from, to, hours }) => {
    const params = buildInboundFilesSearchParams(
      {
        ...FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE,
        dateFilter: 'dateRange',
        dateFrom: date,
        dateTo: date,
      },
      dateService,
    );

    expect(params.from_date).toBe(from);
    expect(params.to_date).toBe(to);
    expect(Date.parse(`${params.to_date}Z`) - Date.parse(`${params.from_date}Z`) + 1).toBe(hours * 60 * 60 * 1000);
  });

  it('includes the 00:30 BST file and the final microsecond while excluding neighbouring local days', () => {
    const params = buildInboundFilesSearchParams(
      {
        ...FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE,
        dateFilter: 'dateRange',
        dateFrom: '20/10/2026',
        dateTo: '20/10/2026',
      },
      dateService,
    );
    const files = [
      { name: 'Previous local day', created: '2026-10-19T22:59:59.999999' },
      { name: '00:30 BST', created: '2026-10-19T23:30:00.000000' },
      { name: 'Final microsecond', created: '2026-10-20T22:59:59.999999' },
      { name: 'Next local day', created: '2026-10-20T23:00:00.000000' },
    ];

    // The API compares offset-free UTC timestamps, retaining database microseconds.
    const included = files
      .filter((file) => file.created >= params.from_date! && file.created <= params.to_date!)
      .map((file) => file.name);

    expect(included).toEqual(['00:30 BST', 'Final microsecond']);
  });

  it.each([
    {
      dateFilter: 'last7Days',
      days: '',
      now: '2026-03-29T12:00:00Z',
      from: '2026-03-23T00:00:00',
      to: '2026-03-29T22:59:59.999999',
    },
    {
      dateFilter: 'customDays',
      days: '2',
      now: '2026-03-29T12:00:00Z',
      from: '2026-03-28T00:00:00',
      to: '2026-03-29T22:59:59.999999',
    },
    {
      dateFilter: 'last7Days',
      days: '',
      now: '2026-10-25T12:00:00Z',
      from: '2026-10-18T23:00:00',
      to: '2026-10-25T23:59:59.999999',
    },
    {
      dateFilter: 'customDays',
      days: '2',
      now: '2026-10-25T12:00:00Z',
      from: '2026-10-23T23:00:00',
      to: '2026-10-25T23:59:59.999999',
    },
  ] as const)(
    'uses calendar days for $dateFilter across the DST change on $now',
    ({ dateFilter, days, now, from, to }) => {
      vi.setSystemTime(new Date(now));

      const params = buildInboundFilesSearchParams(
        { ...FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE, dateFilter, days },
        dateService,
      );

      expect(params.from_date).toBe(from);
      expect(params.to_date).toBe(to);
    },
  );

  it.each([
    {
      boundary: 'from date',
      dateFrom: '01/10/2026',
      dateTo: null,
      expected: { from_date: '2026-09-30T23:00:00' },
    },
    {
      boundary: 'to date',
      dateFrom: null,
      dateTo: '05/10/2026',
      expected: { to_date: '2026-10-05T22:59:59.999999' },
    },
    {
      boundary: 'from date on the autumn DST transition',
      dateFrom: '25/10/2026',
      dateTo: null,
      expected: { from_date: '2026-10-24T23:00:00' },
    },
    {
      boundary: 'to date on the spring DST transition',
      dateFrom: null,
      dateTo: '29/03/2026',
      expected: { to_date: '2026-03-29T22:59:59.999999' },
    },
  ])('supports a date range with only a $boundary', ({ dateFrom, dateTo, expected }) => {
    const formData: IFinesFinanceInboundFilesForm = {
      businessUnit: null,
      dateFilter: 'dateRange',
      days: null,
      dateFrom,
      dateTo,
      fileType: null,
      source: null,
    };

    expect(buildInboundFilesSearchParams(formData, dateService)).toEqual({
      domain: InterfaceFileViewerSupportedDomain.Fines,
      not_status: [InterfaceFileViewerFileStatus.FailedSuperseded],
      target: 'OPAL',
      type: ['SOURCE', 'TRANSFORMED_JSON'],
      ...expected,
    });
  });

  it.each([
    { label: 'unset', value: null },
    { label: 'blank', value: '' },
  ])('omits $label optional search parameters and retains the inbound type restriction', ({ value }) => {
    const formData: IFinesFinanceInboundFilesForm = {
      businessUnit: value,
      dateFilter: null,
      days: value,
      dateFrom: value,
      dateTo: value,
      fileType: value,
      source: value,
    };

    expect(buildInboundFilesSearchParams(formData, dateService)).toEqual({
      domain: InterfaceFileViewerSupportedDomain.Fines,
      not_status: [InterfaceFileViewerFileStatus.FailedSuperseded],
      target: 'OPAL',
      type: ['SOURCE', 'TRANSFORMED_JSON'],
    });
  });

  it.each([null, ''])('omits custom-day boundaries when days is %s', (days) => {
    const params = buildInboundFilesSearchParams(
      {
        ...FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE,
        dateFilter: 'customDays',
        days,
      },
      dateService,
    );
    expect(params).not.toHaveProperty('from_date');
    expect(params).not.toHaveProperty('to_date');
  });

  it('keeps independent scope arrays for each request', () => {
    const form = { ...FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE };
    const first = buildInboundFilesSearchParams(form, dateService);
    first.type!.push('OTHER');
    first.not_status!.push('FAILED');
    const second = buildInboundFilesSearchParams(form, dateService);
    expect(second.type).toEqual(['SOURCE', 'TRANSFORMED_JSON']);
    expect(second.not_status).toEqual(['FAILED_SUPERSEDED']);
  });
});
