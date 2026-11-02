import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { httpRetryInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-retry';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from './opal-fines.service';

describe('OpalFines alternate payment reference reads', () => {
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
});
