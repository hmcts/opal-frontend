import { TestBed } from '@angular/core/testing';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { Settings } from 'luxon';
import { afterEach, describe, expect, it } from 'vitest';
import { FinesApiPayloadService } from '../fines-api-payload.service';
import { mapIgnoredData } from './fines-api-payload-map-ignored.utils';

const job: IOpalFinesInterfaceJobSummary = {
  interface_job_id: 99000000015015,
  interface_file_id: 99000000016015,
  file_name: 'file-10.csv',
  source: 'DWP',
  business_unit_name: 'BU Alpha',
  status: 'IGNORED',
  completed_datetime: '2026-10-11T12:17:04.323177',
  created_datetime: '2026-10-01T10:00:00',
};
const labels = new Map([
  ['DWP', 'DWP/AEA'],
  ['ALLPAY_DD', 'Resolved direct debit'],
]);
const map = (jobs: IOpalFinesInterfaceJobSummary[]) =>
  mapIgnoredData({ interface_jobs: jobs }, TestBed.inject(DateService), labels).rows;

describe('mapIgnoredData', () => {
  const originalZone = Settings.defaultZone;
  afterEach(() => {
    Settings.defaultZone = originalZone;
  });

  it('uses real UK date parsing, endpoint labels and distinct job/file IDs through the facade', () => {
    Settings.defaultZone = 'America/New_York';
    const result = TestBed.inject(FinesApiPayloadService).mapIgnoredData({ interface_jobs: [job] }, labels);
    expect(result.rows[0]).toEqual({
      interfaceJobId: '99000000015015',
      interfaceFileId: '99000000016015',
      'File name': 'file-10.csv',
      Source: 'DWP/AEA',
      'Business unit': 'BU Alpha',
      'Date processed': Date.parse('2026-10-11T11:17:04.323Z'),
      dateProcessedDisplay: '11 October 2026 at 12:17',
    });
  });
  it('uses winter UK time without converting it from the host zone', () => {
    Settings.defaultZone = 'Asia/Tokyo';
    const [row] = map([{ ...job, completed_datetime: '2026-12-11T16:17:04.323177' }]);
    expect(row.dateProcessedDisplay).toBe('11 December 2026 at 16:17');
    expect(row['Date processed']).toBe(Date.parse('2026-12-11T16:17:04.323Z'));
  });
  it('preserves all rows in API order without the Process cap', () => {
    const jobs = Array.from({ length: 501 }, (_, index) => ({
      ...job,
      interface_job_id: index,
      file_name: `file-${501 - index}.csv`,
    }));
    const rows = map(jobs);
    expect(rows).toHaveLength(501);
    expect(rows.map((row) => row['File name'])).toEqual(jobs.map((item) => item.file_name));
    expect(map([])).toEqual([]);
  });
  it('normalizes lookup codes, uses supplied display names and retains unknown codes', () => {
    expect(
      map([
        { ...job, source: ' allpay_dd ' },
        { ...job, source: 'UNKNOWN' },
      ]).map((row) => row.Source),
    ).toEqual(['Resolved direct debit', 'UNKNOWN']);
  });
  it.each([null, '', 'invalid'])('shows an unavailable date for %s, never substituting creation time', (date) => {
    const [row] = map([{ ...job, completed_datetime: date }]);
    expect(row.dateProcessedDisplay).toBe('—');
    expect(row['Date processed']).toBe(0);
  });
});
