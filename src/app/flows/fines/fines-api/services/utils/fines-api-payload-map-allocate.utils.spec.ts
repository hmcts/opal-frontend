import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { IOpalFinesTillSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-till-summary.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mapAllocateData } from './fines-api-payload-map-allocate.utils';

const buildTill = (overrides: Partial<IOpalFinesTillSummary> = {}): IOpalFinesTillSummary => ({
  till_id: 101,
  till_number: 7,
  errors: 0,
  file_name: 'payments.dat',
  source: 'NATWEST',
  amount: '1234.50',
  business_unit_name: 'BU Alpha',
  processed_by: 'original.operator',
  date_processed: '2026-09-22T13:31:27.270Z',
  ...overrides,
});

const buildJob = (id: number, businessUnit: string): IOpalFinesInterfaceJobSummary => ({
  interface_job_id: id,
  interface_file_id: id + 1000,
  file_name: `payments-${id}.dat`,
  business_unit_name: businessUnit,
  source: 'NATWEST',
  status: 'PROCESSING',
  created_datetime: '2026-09-22T13:31:27.270Z',
  completed_datetime: null,
});

describe('mapAllocateData', () => {
  let dateService: DateService;
  let parsedDate: ReturnType<DateService['getFromIso']>;

  beforeEach(() => {
    parsedDate = { isValid: true, setLocale: vi.fn().mockReturnValue({}) } as unknown as ReturnType<
      DateService['getFromIso']
    >;
    dateService = {
      getFromIso: vi.fn().mockReturnValue(parsedDate),
      toFormat: vi.fn().mockReturnValue('22 September 2026 at 14:31'),
    } as unknown as DateService;
  });

  const map = (tills: IOpalFinesTillSummary[], jobs: IOpalFinesInterfaceJobSummary[] = []) =>
    mapAllocateData({ interface_jobs: jobs }, { tills }, dateService);

  it('maps successful empty responses to the empty display state', () => {
    expect(map([])).toEqual({ processingTotal: 0, processingByBusinessUnit: [], tills: [] });
  });

  it('counts all files above the Process cap and orders business units alphabetically', () => {
    const jobs = Array.from({ length: 502 }, (_, index) => buildJob(index, index < 501 ? 'BU Beta' : 'BU Alpha'));
    const original = structuredClone(jobs);
    const data = map([], jobs);
    expect(data.processingTotal).toBe(502);
    expect(data.processingByBusinessUnit).toEqual([
      { businessUnitName: 'BU Alpha', count: 1 },
      { businessUnitName: 'BU Beta', count: 501 },
    ]);
    expect(jobs).toEqual(original);
  });

  it('maps supplied values and formats the till creation timestamp using the existing date convention', () => {
    expect(map([buildTill()]).tills[0]).toEqual({
      tillId: '101',
      tillNumber: '7',
      errorsDisplay: '0',
      fileName: 'payments.dat',
      sourceLabel: 'NatWest',
      amount: '1234.50',
      businessUnitName: 'BU Alpha',
      processedByDisplay: 'original.operator',
      dateProcessedDisplay: '22 September 2026 at 14:31',
    });
    expect(dateService.getFromIso).toHaveBeenCalledWith('2026-09-22T13:31:27.270Z');
    expect(parsedDate.setLocale).toHaveBeenCalledWith('en-gb');
    expect(dateService.toFormat).toHaveBeenCalledWith(expect.anything(), "dd MMMM yyyy 'at' HH:mm");
  });

  it('retains all tills in backend order with distinct IDs for the same visible till number', () => {
    const tills = Array.from({ length: 502 }, (_, index) => buildTill({ till_id: 1000 - index, till_number: 7 }));
    const original = structuredClone(tills);
    const rows = map(tills).tills;
    expect(rows).toHaveLength(502);
    expect(rows[0].tillId).toBe('1000');
    expect(rows[1].tillId).toBe('999');
    expect(rows.at(-1)?.tillId).toBe('499');
    expect(tills).toEqual(original);
  });

  it.each([
    ['ALLPAY', 'allpay'],
    ['NATWEST', 'NatWest'],
    ['BTECKOH', 'British Telecom'],
    ['BARCLAYCARD', 'Barclaycard'],
    ['DWP', 'DWP/AEA'],
    [' natwest ', 'NatWest'],
    ['NEW_SOURCE', 'NEW_SOURCE'],
  ])('maps source %s to %s', (source, expected) => {
    expect(map([buildTill({ source })]).tills[0].sourceLabel).toBe(expected);
  });

  it.each([undefined, null, ''])(
    'shows unavailable optional cells for %s without inventing a date or zero errors',
    (value) => {
      const row = map([
        buildTill({
          file_name: value,
          source: value,
          date_processed: value,
          errors: value == null ? value : undefined,
        }),
      ]).tills[0];
      expect(row.fileName).toBe('—');
      expect(row.sourceLabel).toBe('—');
      expect(row.dateProcessedDisplay).toBe('—');
      expect(row.errorsDisplay).toBe('—');
      expect(dateService.getFromIso).not.toHaveBeenCalled();
    },
  );

  it('shows an unavailable date for an invalid timestamp', () => {
    vi.mocked(dateService.getFromIso).mockReturnValue({ isValid: false } as ReturnType<DateService['getFromIso']>);
    expect(map([buildTill({ date_processed: 'invalid' })]).tills[0].dateProcessedDisplay).toBe('—');
    expect(dateService.toFormat).not.toHaveBeenCalled();
  });

  it.each([0, 1234, 1234.5, -20, '1234.50'])(
    'retains the raw amount %s for display formatting and sorting',
    (amount) => {
      expect(map([buildTill({ amount })]).tills[0].amount).toBe(amount);
    },
  );

  it('preserves a large string ID and the supplied message count/operator', () => {
    const row = map([buildTill({ till_id: '9223372036854775807', errors: 3, processed_by: 'processing-service' })])
      .tills[0];
    expect(row.tillId).toBe('9223372036854775807');
    expect(row.errorsDisplay).toBe('3');
    expect(row.processedByDisplay).toBe('processing-service');
  });

  it.each(['', 'invalid', -1, 1.5, Number.MAX_SAFE_INTEGER + 1, undefined])('rejects unusable till ID %s', (id) => {
    const till = { ...buildTill(), till_id: id } as IOpalFinesTillSummary;
    expect(() => map([till])).toThrow('Invalid till identifier');
  });
});
