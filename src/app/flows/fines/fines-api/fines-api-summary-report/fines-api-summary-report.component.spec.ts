import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { FinesApiSummaryReportComponent } from './fines-api-summary-report.component';
import { summaryResponse } from './mocks/summary-response.mock';
import { mapSummaryReport } from '../services/utils/fines-api-payload-map-summary-report.utils';

describe('summary report component', () => {
  const setup = (isTill: boolean) => {
    const response = summaryResponse();
    response.till_number = isTill ? 42 : null;
    response.file_name = '<script>synthetic</script>';
    TestBed.configureTestingModule({
      imports: [FinesApiSummaryReportComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { data: of({ report: mapSummaryReport(response, new Map()) }) } },
      ],
    });
    return TestBed.createComponent(FinesApiSummaryReportComponent);
  };
  it.each([
    [true, 'allocate'],
    [false, 'ignored'],
  ] as const)('returns to the correct tab for till=%s', (isTill, fragment) => {
    const fixture = setup(isTill);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('a')!.getAttribute('href')).toBe(
      '/fines/auto-payment-in/process-allocate#' + fragment,
    );
    expect(element.textContent).toContain('<script>synthetic</script>');
    expect(element.querySelector('script')).toBeNull();
    expect(element.textContent!.match(/No records found./g)).toHaveLength(3);
  });
  it('opens native printing only when activated', () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    const fixture = setup(true);
    fixture.detectChanges();
    expect(print).not.toHaveBeenCalled();
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    expect(print).toHaveBeenCalledTimes(1);
  });
});
