import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OpalFines } from './opal-fines.service';

describe('OpalFines court fees', () => {
  it('loads the selected business unit’s court fees from PO-3701', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const service = TestBed.inject(OpalFines);
    const http = TestBed.inject(HttpTestingController);
    const response = {
      court_fees: [{ court_fee_id: 1, court_fee_code: 'CF001', description: 'Application', amount: 12.5 }],
    };
    let received = null;

    service.getCourtFees(2).subscribe((result) => {
      received = result;
    });

    const request = http.expectOne('/opal-fines-service/court-fees?business_unit_id=2');
    expect(request.request.method).toBe('GET');
    request.flush(response);
    expect(received).toEqual(response);
    http.verify();
  });
});
