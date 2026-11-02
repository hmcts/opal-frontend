import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { httpRetryInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-retry';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from './opal-fines.service';

describe('OpalFines alternate payment references', () => {
  let service: OpalFines;
  let http: HttpTestingController;
  const url = '/opal-fines-service/defendant-accounts/77/alternate-payment-references';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([httpRetryInterceptor])), provideHttpClientTesting()],
    });
    service = TestBed.inject(OpalFines);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('maps a bare array and preserves the quoted account ETag', () => {
    const result = vi.fn();
    service.getAprs(77).subscribe(result);
    const request = http.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush([], { headers: { ETag: '"7"' } });
    expect(result).toHaveBeenCalledWith({ references: [], version: '"7"' });
  });

  it('does not cache across entries or accounts', () => {
    service.getAprs(77).subscribe();
    http.expectOne(url).flush([]);
    service.getAprs(77).subscribe();
    http.expectOne(url).flush([]);
    service.getAprs(78).subscribe();
    http.expectOne(url.replace('/77/', '/78/')).flush([]);
  });

  it('represents a missing ETag explicitly', () => {
    const result = vi.fn();
    service.getAprs(77).subscribe(result);
    http.expectOne(url).flush([]);
    expect(result).toHaveBeenCalledWith({ references: [], version: null });
  });

  it('creates the reference with its original text and account ETag, with no business unit header', () => {
    const result = vi.fn();
    const reference = { alternate_payment_reference_id: 11, apr_text: ' MiXeD-123 ' };
    service.createApr(77, { apr_text: ' MiXeD-123 ' }, '"7"').subscribe(result);
    const request = http.expectOne(url);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ apr_text: ' MiXeD-123 ' });
    expect(request.request.headers.get('If-Match')).toBe('"7"');
    expect(request.request.headers.keys()).toEqual(['If-Match']);
    request.flush(reference, { status: 201, statusText: 'Created', headers: { ETag: '"8"' } });
    expect(result).toHaveBeenCalledWith({ reference, version: '"8"' });
  });

  it.each([409, 412, 500, 503])('does not retry a failed create request with status %s', (status) => {
    const error = vi.fn();
    service.createApr(77, { apr_text: 'Reference' }, '"7"').subscribe({ error });
    http.expectOne(url).flush({ status }, { status, statusText: 'Failure' });

    expect(error).toHaveBeenCalledOnce();
    http.expectNone(url);
  });
});
