import { TestBed } from '@angular/core/testing';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { Settings } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IFinesFinanceInterfaceFilesForm } from '../../interfaces/fines-finance-interface-files-form.interface';
import { buildInterfaceFilesFilters } from './fines-finance-payload-build-interface-files-filters.utils';

describe('buildInterfaceFilesFilters', () => {
  let dateService: DateService;
  let previousZone: typeof Settings.defaultZone;
  const emptyFilters: IFinesFinanceInterfaceFilesForm = {
    businessUnit: null,
    dateFilter: null,
    days: null,
    dateFrom: null,
    dateTo: null,
  };

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

  it.each([null, ''])('omits an empty business unit (%s) and unset date criteria', (businessUnit) => {
    expect(buildInterfaceFilesFilters({ ...emptyFilters, businessUnit }, dateService)).toEqual({});
  });

  it('preserves leading zeros in business-unit codes without adding direction-specific restrictions', () => {
    expect(buildInterfaceFilesFilters({ ...emptyFilters, businessUnit: '0046' }, dateService)).toEqual({
      business_unit_code: '0046',
    });
  });

  it('ignores date values when no date option is selected', () => {
    expect(
      buildInterfaceFilesFilters(
        { ...emptyFilters, days: '14', dateFrom: '01/01/2026', dateTo: '02/01/2026' },
        dateService,
      ),
    ).toEqual({});
  });

  it('uses the last seven local calendar days rather than inactive date or custom-day inputs', () => {
    expect(
      buildInterfaceFilesFilters(
        {
          ...emptyFilters,
          dateFilter: 'last7Days',
          days: '30',
          dateFrom: '01/01/2026',
          dateTo: '02/01/2026',
        },
        dateService,
      ),
    ).toEqual({ from_date: '2026-10-13T23:00:00', to_date: '2026-10-20T22:59:59.999999' });
  });

  it.each([
    { days: '1', from: '2026-10-19T23:00:00' },
    { days: '3', from: '2026-10-17T23:00:00' },
    { days: '14', from: '2026-10-06T23:00:00' },
  ])('combines the business unit with $days inclusive calendar days', ({ days, from }) => {
    expect(
      buildInterfaceFilesFilters(
        { ...emptyFilters, businessUnit: '0046', dateFilter: 'customDays', days },
        dateService,
      ),
    ).toEqual({
      business_unit_code: '0046',
      from_date: from,
      to_date: '2026-10-20T22:59:59.999999',
    });
  });

  it.each([null, ''])('keeps the business-unit filter when custom days are missing (%s)', (days) => {
    expect(
      buildInterfaceFilesFilters(
        { ...emptyFilters, businessUnit: '0046', dateFilter: 'customDays', days },
        dateService,
      ),
    ).toEqual({ business_unit_code: '0046' });
  });

  it.each([
    {
      name: 'both dates',
      dateFrom: '01/10/2026',
      dateTo: '05/10/2026',
      expected: { from_date: '2026-09-30T23:00:00', to_date: '2026-10-05T22:59:59.999999' },
    },
    {
      name: 'only a start with a null end',
      dateFrom: '01/10/2026',
      dateTo: null,
      expected: { from_date: '2026-09-30T23:00:00' },
    },
    {
      name: 'only a start with a blank end',
      dateFrom: '01/10/2026',
      dateTo: '',
      expected: { from_date: '2026-09-30T23:00:00' },
    },
    {
      name: 'only an end with a null start',
      dateFrom: null,
      dateTo: '05/10/2026',
      expected: { to_date: '2026-10-05T22:59:59.999999' },
    },
    {
      name: 'only an end with a blank start',
      dateFrom: '',
      dateTo: '05/10/2026',
      expected: { to_date: '2026-10-05T22:59:59.999999' },
    },
    { name: 'no dates', dateFrom: null, dateTo: null, expected: {} },
  ])('includes only the supplied boundaries for a range with $name', ({ dateFrom, dateTo, expected }) => {
    expect(
      buildInterfaceFilesFilters({ ...emptyFilters, dateFilter: 'dateRange', dateFrom, dateTo }, dateService),
    ).toEqual(expected);
  });

  it.each([
    {
      name: 'the spring DST transition',
      zone: 'Europe/London',
      date: '29/03/2026',
      from: '2026-03-29T00:00:00',
      to: '2026-03-29T22:59:59.999999',
      hours: 23,
    },
    {
      name: 'the autumn DST transition',
      zone: 'Europe/London',
      date: '25/10/2026',
      from: '2026-10-24T23:00:00',
      to: '2026-10-25T23:59:59.999999',
      hours: 25,
    },
    {
      name: 'a leap day in UTC',
      zone: 'UTC',
      date: '29/02/2024',
      from: '2024-02-29T00:00:00',
      to: '2024-02-29T23:59:59.999999',
      hours: 24,
    },
    {
      name: 'a day in a negative-offset time zone',
      zone: 'America/New_York',
      date: '20/10/2026',
      from: '2026-10-20T04:00:00',
      to: '2026-10-21T03:59:59.999999',
      hours: 24,
    },
  ])('preserves inclusive local-day boundaries during $name', ({ zone, date, from, to, hours }) => {
    Settings.defaultZone = zone;
    const params = buildInterfaceFilesFilters(
      { ...emptyFilters, dateFilter: 'dateRange', dateFrom: date, dateTo: date },
      dateService,
    );

    expect(params).toEqual({ from_date: from, to_date: to });
    expect(Date.parse(`${params.to_date}Z`) - Date.parse(`${params.from_date}Z`) + 1).toBe(hours * 60 * 60 * 1000);
  });

  it('does not mutate submitted filters or share the returned parameters between searches', () => {
    const form = Object.freeze({ ...emptyFilters, businessUnit: '0046', dateFilter: 'last7Days' as const });
    const first = buildInterfaceFilesFilters(form, dateService);
    const expected = { ...first };
    first.business_unit_code = 'OTHER';
    first.from_date = 'changed';

    expect(buildInterfaceFilesFilters(form, dateService)).toEqual(expected);
    expect(form).toEqual({ ...emptyFilters, businessUnit: '0046', dateFilter: 'last7Days' });
  });
});
