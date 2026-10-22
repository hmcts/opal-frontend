import { TestBed } from '@angular/core/testing';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { Settings } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_FINANCE_INTERFACE_FILES_INITIAL_FILTER_STATE } from '../../constants/fines-finance-interface-files-initial-filter-state.constant';
import { buildOutboundFilesSearchParams } from './fines-finance-payload-build-outbound-files-search.utils';

describe('buildOutboundFilesSearchParams', () => {
  let dateService: DateService;
  let previousZone: typeof Settings.defaultZone;
  const scope = { domain: 'FINES', source: 'OPAL', not_target: 'OPAL', not_status: ['FAILED_SUPERSEDED'] };

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-20T12:00:00Z'));
    previousZone = Settings.defaultZone;
    Settings.defaultZone = 'Europe/London';
    TestBed.configureTestingModule({});
    dateService = TestBed.inject(DateService);
  });

  afterEach(() => {
    Settings.defaultZone = previousZone;
    vi.useRealTimers();
  });

  it('limits the initial last-seven-days search to outbound fines without restricting type', () => {
    expect(
      buildOutboundFilesSearchParams({ ...FINES_FINANCE_INTERFACE_FILES_INITIAL_FILTER_STATE }, dateService),
    ).toEqual({
      ...scope,
      from_date: '2026-10-13T23:00:00',
      to_date: '2026-10-20T22:59:59.999999',
    });
  });

  it('applies custom days without sending the API business-unit predicate that excludes unassigned files', () => {
    expect(
      buildOutboundFilesSearchParams(
        {
          ...FINES_FINANCE_INTERFACE_FILES_INITIAL_FILTER_STATE,
          businessUnit: '0046',
          dateFilter: 'customDays',
          days: '14',
        },
        dateService,
      ),
    ).toEqual({
      ...scope,
      from_date: '2026-10-06T23:00:00',
      to_date: '2026-10-20T22:59:59.999999',
    });
  });

  it.each([
    {
      name: 'both boundaries',
      dateFrom: '01/10/2026',
      dateTo: '05/10/2026',
      expected: { from_date: '2026-09-30T23:00:00', to_date: '2026-10-05T22:59:59.999999' },
    },
    { name: 'only a start', dateFrom: '01/10/2026', dateTo: '', expected: { from_date: '2026-09-30T23:00:00' } },
    { name: 'only an end', dateFrom: '', dateTo: '05/10/2026', expected: { to_date: '2026-10-05T22:59:59.999999' } },
    { name: 'blank boundaries', dateFrom: '', dateTo: '', expected: {} },
  ])('builds an inclusive explicit range with $name', ({ dateFrom, dateTo, expected }) => {
    expect(
      buildOutboundFilesSearchParams(
        {
          ...FINES_FINANCE_INTERFACE_FILES_INITIAL_FILTER_STATE,
          dateFilter: 'dateRange',
          dateFrom,
          dateTo,
        },
        dateService,
      ),
    ).toEqual({ ...scope, ...expected });
  });

  it.each([
    { name: 'spring', date: '29/03/2026', from: '2026-03-29T00:00:00', to: '2026-03-29T22:59:59.999999', hours: 23 },
    { name: 'autumn', date: '25/10/2026', from: '2026-10-24T23:00:00', to: '2026-10-25T23:59:59.999999', hours: 25 },
  ])('uses the whole local day across the $name DST change', ({ date, from, to, hours }) => {
    const params = buildOutboundFilesSearchParams(
      {
        ...FINES_FINANCE_INTERFACE_FILES_INITIAL_FILTER_STATE,
        dateFilter: 'dateRange',
        dateFrom: date,
        dateTo: date,
      },
      dateService,
    );
    expect(params).toEqual({ ...scope, from_date: from, to_date: to });
    expect(Date.parse(`${params.to_date}Z`) - Date.parse(`${params.from_date}Z`) + 1).toBe(hours * 60 * 60 * 1000);
  });

  it.each([null, ''])('omits optional filters when business unit and dates are %s', (value) => {
    expect(
      buildOutboundFilesSearchParams(
        {
          businessUnit: value,
          dateFilter: null,
          dateFrom: value,
          dateTo: value,
          days: value,
        },
        dateService,
      ),
    ).toEqual(scope);
  });

  it('preserves the selected business unit for response filtering without restricting the API query', () => {
    const form = Object.freeze({
      ...FINES_FINANCE_INTERFACE_FILES_INITIAL_FILTER_STATE,
      businessUnit: '0046',
      dateFilter: null,
    });

    expect(buildOutboundFilesSearchParams(form, dateService)).toEqual(scope);
    expect(form.businessUnit).toBe('0046');
  });

  it('keeps each search independent when a caller changes excluded statuses', () => {
    const form = { ...FINES_FINANCE_INTERFACE_FILES_INITIAL_FILTER_STATE };
    buildOutboundFilesSearchParams(form, dateService).not_status!.push('FAILED');
    expect(buildOutboundFilesSearchParams(form, dateService).not_status).toEqual(['FAILED_SUPERSEDED']);
  });
});
