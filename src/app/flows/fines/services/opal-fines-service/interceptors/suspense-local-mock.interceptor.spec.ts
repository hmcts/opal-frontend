import { DOCUMENT } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { suspenseLocalMockInterceptor } from './suspense-local-mock.interceptor';
import { OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK } from '../mocks/opal-fines-suspense-item-summary.mock';
import { OPAL_FINES_SUSPENSE_ITEM_HISTORY_MOCK } from '../mocks/opal-fines-suspense-item-history.mock';

const summaryUrl = '/opal-fines-service/suspense-accounts/22/suspense-items/00042/summary';
const historyUrl = '/opal-fines-service/suspense-items/1001/history';

describe('suspenseLocalMockInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  function setup(hostname = 'localhost'): void {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([suspenseLocalMockInterceptor])),
        provideHttpClientTesting(),
        { provide: DOCUMENT, useValue: { location: { hostname } } },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => httpMock.verify());

  it('tries the real summary request before returning the requested reference in a mock on 404', () => {
    setup();
    const received = vi.fn();
    http.get(summaryUrl).subscribe(received);
    const request = httpMock.expectOne(summaryUrl);
    expect(received).not.toHaveBeenCalled();
    request.flush({}, { status: 404, statusText: 'Not Found' });
    expect(received).toHaveBeenCalledWith({ ...OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK, suspense_item_number: '00042' });
  });

  it('returns mock history and notes after a history 404', () => {
    setup();
    const received = vi.fn();
    http.get(historyUrl).subscribe(received);
    httpMock.expectOne(historyUrl).flush({}, { status: 404, statusText: 'Not Found' });
    expect(received).toHaveBeenCalledWith(OPAL_FINES_SUSPENSE_ITEM_HISTORY_MOCK);
  });

  it('preserves a successful real response', () => {
    setup();
    const received = vi.fn();
    const actual = { ...OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK, balance: 900 };
    http.get(summaryUrl).subscribe(received);
    httpMock.expectOne(summaryUrl).flush(actual);
    expect(received).toHaveBeenCalledWith(actual);
  });

  it.each([401, 403, 500])('propagates HTTP %s without fabricating data', (status) => {
    setup();
    const failed = vi.fn();
    http.get(summaryUrl).subscribe({ error: failed });
    httpMock.expectOne(summaryUrl).flush({}, { status, statusText: 'Failure' });
    expect(failed).toHaveBeenCalledWith(expect.objectContaining({ status }));
  });

  it.each(['example.com', ''])('does not mock requests on host "%s"', (hostname) => {
    setup(hostname);
    const failed = vi.fn();
    http.get(summaryUrl).subscribe({ error: failed });
    httpMock.expectOne(summaryUrl).flush({}, { status: 404, statusText: 'Not Found' });
    expect(failed).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
  });

  it('does not mock an unrelated URL', () => {
    setup();
    const failed = vi.fn();
    const url = '/opal-fines-service/business-units';
    http.get(url).subscribe({ error: failed });
    httpMock.expectOne(url).flush({}, { status: 404, statusText: 'Not Found' });
    expect(failed).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
  });

  it('does not mock writes', () => {
    setup();
    const failed = vi.fn();
    http.post(summaryUrl, {}).subscribe({ error: failed });
    httpMock.expectOne(summaryUrl).flush({}, { status: 404, statusText: 'Not Found' });
    expect(failed).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
  });
});
