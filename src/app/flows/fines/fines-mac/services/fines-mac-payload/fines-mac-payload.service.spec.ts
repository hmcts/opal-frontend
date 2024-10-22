import { TestBed } from '@angular/core/testing';

import { FinesMacPayloadService } from './fines-mac-payload.service';

describe('FinesMacPayloadService', () => {
  let service: FinesMacPayloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesMacPayloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
