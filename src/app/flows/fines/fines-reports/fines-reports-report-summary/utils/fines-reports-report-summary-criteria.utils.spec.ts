import { describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { OPAL_FINES_RESULT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-ref-data.mock';
import { mapReportSummaryCriteria } from './fines-reports-report-summary-criteria.utils';

const dateService = {
  getFromIso: (value: string) => DateTime.fromISO(value),
  toFormat: (value: DateTime, format: string) => value.toFormat(format),
} as DateService;

const mapCriteria = (parameters: Record<string, unknown> | null | undefined) =>
  mapReportSummaryCriteria(parameters, 'Summary', null, dateService);

describe('mapReportSummaryCriteria', () => {
  it.each([null, undefined, {}])('returns no rows for missing parameters: %j', (parameters) => {
    expect(mapCriteria(parameters)).toEqual([]);
  });

  it('omits an account-type row when every account-type flag is false', () => {
    expect(mapCriteria({ includeAdult: false, includeYouth: false, includeCompany: false })).toEqual([]);
  });

  it('combines selected account types once, retaining their supplied order', () => {
    expect(
      mapCriteria({
        includeCompany: true,
        accountStatus: 'LIVE',
        includeAdult: true,
        onlyAccountsWithParentGuardian: true,
        includeYouth: false,
      }),
    ).toEqual([
      { key: 'Account type', value: 'Company, Adult, Only accounts with parent or guardian to pay' },
      { key: 'Account status', value: 'Live' },
    ]);
  });

  it.each([
    { parameters: { enforcementDateFrom: '2006-05-01' }, expected: 'From 01 May 2006' },
    { parameters: { enforcementDateTo: '2006-06-30' }, expected: 'To 30 Jun 2006' },
    {
      parameters: { regfDateFrom: '2006-05-01', regfDateTo: '2006-06-30' },
      expected: 'From 01 May 2006 to 30 Jun 2006',
    },
  ])('renders the supplied date range: $expected', ({ parameters, expected }) => {
    expect(mapCriteria(parameters)).toEqual([{ key: 'Action date', value: expected }]);
  });

  it('emits a date range once at its first parameter, even when the end date arrives first', () => {
    expect(
      mapCriteria({
        lastActionDateTo: '2006-06-30',
        reportType: 'SUMMARY',
        lastActionDateFrom: '2006-05-01',
      }),
    ).toEqual([
      { key: 'Action date', value: 'From 01 May 2006 to 30 Jun 2006' },
      { key: 'Report Type', value: 'Summary' },
    ]);
  });

  it.each([
    { value: 'ALL', expected: 'All accounts' },
    { value: 'REGF', expected: 'Registration of fine (REGF)' },
    { value: 'NOT_UNDER_ENFORCEMENT', expected: 'Accounts not under enforcement' },
    { value: 'UNRECOGNISED', expected: 'UNRECOGNISED' },
    { value: null, expected: '' },
  ])('renders enforcement mode $value as $expected', ({ value, expected }) => {
    expect(mapCriteria({ reportEnforcementMode: value })).toEqual([{ key: 'Enforcement', value: expected }]);
  });

  it.each([
    { code: 'BWTD', expected: 'Last enforcement action (BWTD)' },
    { code: '', expected: 'Last enforcement action' },
    { code: '  ', expected: 'Last enforcement action' },
    { code: undefined, expected: 'Last enforcement action' },
  ])('retains the last-action criterion when reference data is absent: $code', ({ code, expected }) => {
    expect(mapCriteria({ reportEnforcementMode: 'LAST_ACTION', enforcementAction: code })).toEqual([
      { key: 'Enforcement', value: expected },
    ]);
  });

  it('uses the resolved action title and identifier when reference data is available', () => {
    const result = mapReportSummaryCriteria(
      { reportEnforcementMode: 'LAST_ACTION', enforcementAction: 'BWTD' },
      'Summary',
      { ...OPAL_FINES_RESULT_REF_DATA_MOCK, result_id: 'BWTD', result_title: 'Bail Warrant - dated' },
      dateService,
    );
    expect(result).toEqual([{ key: 'Enforcement', value: 'Last enforcement - Bail Warrant - dated (BWTD)' }]);
  });

  it.each([
    { key: 'accountStatus', value: 'ALL', label: 'Account status', expected: 'All accounts' },
    { key: 'accountStatus', value: 'CLOSED', label: 'Account status', expected: 'Closed' },
    { key: 'accountStatus', value: 'UNRECOGNISED', label: 'Account status', expected: 'UNRECOGNISED' },
    { key: 'collectionOrderChoice', value: 'ALL', label: 'Collection order', expected: 'All accounts' },
    { key: 'collectionOrderChoice', value: 'WITH', label: 'Collection order', expected: 'With collection order' },
    { key: 'collectionOrderChoice', value: 'WITHOUT', label: 'Collection order', expected: 'Without collection order' },
    { key: 'collectionOrderChoice', value: 'UNRECOGNISED', label: 'Collection order', expected: 'UNRECOGNISED' },
    { key: 'reportMode', value: 'SINCE_DATE', label: 'Payment report mode', expected: 'Since date' },
    {
      key: 'reportMode',
      value: 'WITH_REGF',
      label: 'Payment report mode',
      expected: 'With registration of fine (REGF)',
    },
    {
      key: 'reportMode',
      value: 'SINCE_LAST_ENFORCEMENT',
      label: 'Payment report mode',
      expected: 'Since last enforcement action',
    },
    { key: 'reportMode', value: 'UNRECOGNISED', label: 'Payment report mode', expected: 'UNRECOGNISED' },
  ])('maps $key=$value to its display wording', ({ key, value, label, expected }) => {
    expect(mapCriteria({ [key]: value })).toEqual([{ key: label, value: expected }]);
  });

  it.each([
    { value: true, expected: 'Yes' },
    { value: false, expected: 'No' },
    { value: null, expected: '' },
  ])('renders the payment-made value $value as $expected', ({ value, expected }) => {
    expect(mapCriteria({ isPaymentMade: value })).toEqual([{ key: 'Payments made', value: expected }]);
  });

  it('includes the initial-payment criterion only when selected', () => {
    expect(mapCriteria({ firstPaymentOrPayByInNext7Days: true })).toEqual([
      { key: 'Only accounts with initial or full payment due in the next 7 days', value: 'TRUE' },
    ]);
    expect(mapCriteria({ firstPaymentOrPayByInNext7Days: false })).toEqual([]);
  });

  it('maps name limits, balances and payment dates while omitting empty optional criteria', () => {
    expect(
      mapCriteria({
        lowerNameRange: 'A',
        upperNameRange: 'M',
        minBalance: '£1,200.50',
        maxBalance: 2500,
        sinceLastEnforcementAction: true,
        sinceDate: '2006-05-01',
        includeAdult: false,
        unknownParameter: 'not shown',
      }),
    ).toEqual([
      { key: 'Lower name range', value: 'A' },
      { key: 'Upper name range', value: 'M' },
      { key: 'Minimum account balance', value: 1200.5, isCurrency: true },
      { key: 'Maximum account balance', value: 2500, isCurrency: true },
      { key: 'Since last enforcement action', value: 'TRUE' },
      { key: 'Since date', value: '01 May 2006' },
    ]);
    expect(mapCriteria({ lowerNameRange: '', upperNameRange: null, minBalance: undefined, sinceDate: '' })).toEqual([]);
  });
});
