import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, provideRouter, RedirectCommand } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { summaryResponse } from '../../fines-api-summary-report/mocks/summary-response.mock';
import { IFinesApiSummaryReport } from '../../fines-api-summary-report/interfaces/fines-api-summary-report.interface';
import { finesApiSummaryReportResolver } from './fines-api-summary-report.resolver';

describe('summary report resolver', () => {
  const service = { getInterfaceJobProcessedFileSummary: vi.fn(), getSourceMappings: vi.fn() };
  const execute = (id: string) =>
    TestBed.runInInjectionContext(() =>
      finesApiSummaryReportResolver(
        { paramMap: convertToParamMap({ interfaceJobId: id }) } as ActivatedRouteSnapshot,
        {} as never,
      ),
    );
  beforeEach(() => {
    service.getInterfaceJobProcessedFileSummary.mockReset().mockReturnValue(of(summaryResponse()));
    service.getSourceMappings.mockReset().mockReturnValue(of([{ code: ' test ', display_name: 'Test source' }]));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: OpalFines, useValue: service }] });
  });
  it('preserves int64 job IDs and maps source labels', async () => {
    const report = await firstValueFrom(execute('9223372036854775807') as Observable<IFinesApiSummaryReport>);
    expect(service.getInterfaceJobProcessedFileSummary).toHaveBeenCalledWith('9223372036854775807');
    expect(report.fileDetails[1].value).toBe('Test source');
  });
  it.each(['', '0', '-1', 'abc', '1.5', '9223372036854775808'])('redirects invalid ID %s without fetching', (id) => {
    expect(execute(id)).toBeInstanceOf(RedirectCommand);
    expect(service.getInterfaceJobProcessedFileSummary).not.toHaveBeenCalled();
  });
  it('fetches again after a successful visit and propagates allocation-related 404', async () => {
    await firstValueFrom(execute('7') as Observable<IFinesApiSummaryReport>);
    const error = { status: 404 };
    service.getInterfaceJobProcessedFileSummary.mockReturnValue(throwError(() => error));
    await expect(firstValueFrom(execute('7') as Observable<IFinesApiSummaryReport>)).rejects.toBe(error);
    expect(service.getInterfaceJobProcessedFileSummary).toHaveBeenCalledTimes(2);
  });
});
