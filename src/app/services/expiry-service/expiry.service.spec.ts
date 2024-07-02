import { TestBed } from '@angular/core/testing';

import { ExpiryService } from './expiry.service';

describe('ExpiryService', () => {
  let service: ExpiryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpiryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
