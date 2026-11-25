import { DOCUMENT } from '@angular/common';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { FinesApiSummaryReportComponent } from './fines-api-summary-report.component';
import { summaryResponse } from './mocks/summary-response.mock';
import { mapSummaryReport } from '../services/utils/fines-api-payload-map-summary-report.utils';

describe('summary report component', () => {
  const setup = (isTill: boolean, response = summaryResponse()) => {
    response.till_number = isTill ? 42 : null;
    response.file_name = '<script>synthetic</script>';
    TestBed.configureTestingModule({
      imports: [FinesApiSummaryReportComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useFactory: () => ({ data: of({ report: mapSummaryReport(response, new Map(), inject(UtilsService)) }) }),
        },
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
  it('safely handles print when there is no browser window', () => {
    const fixture = setup(true);
    const document = TestBed.inject(DOCUMENT);
    vi.spyOn(document, 'defaultView', 'get').mockReturnValue(null);
    expect(() => fixture.componentInstance['print']()).not.toThrow();
  });
  it('renders populated account tables, escaped error panels and separate totals', () => {
    const response = summaryResponse();
    response.interface_messages.push(
      ...['zero_balance', 'enforcement_action'].map((message_text) => ({
        message_text,
        messages: [
          {
            interface_messages_id: 90,
            message_type: 'Warning' as const,
            message_data: {
              account_number: '000123',
              surname: 'Sample',
              value: 10,
              transaction_account: '000456',
              last_action: 'TEST',
              balance: 25,
            },
          },
        ],
      })),
      {
        message_text: 'unknown_bank',
        messages: [
          {
            interface_messages_id: 91,
            message_type: 'Error',
            message_data: { court_amount: 10, Error: '<script>synthetic error</script>' },
          },
        ],
      },
    );
    const fixture = setup(true, response);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('#fines-api-summary-zero-balance tbody')!.textContent).toContain('SAMPLE');
    expect(element.querySelector('#fines-api-summary-enforcement tbody')!.textContent).toContain('£25.00');
    expect(element.querySelectorAll('tfoot')).toHaveLength(2);
    const errors = element.querySelector('#fines-api-summary-errors')!;
    expect(errors.textContent).toContain('<script>synthetic error</script>');
    expect(errors.querySelector('script')).toBeNull();
    const totals = errors.querySelectorAll(':scope > dl');
    expect(totals).toHaveLength(2);
    expect(totals[0].textContent).toContain('£0.00');
    expect(totals[1].textContent).toContain('£10.00');
  });
});
