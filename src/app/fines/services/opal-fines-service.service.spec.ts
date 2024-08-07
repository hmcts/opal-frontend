import { TestBed } from '@angular/core/testing';

import { OpalFinesServiceService } from './opal-fines-service.service';

describe('OpalFinesServiceService', () => {
  let service: OpalFinesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpalFinesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
