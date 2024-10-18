import { TestBed } from '@angular/core/testing';

import { FinesMacPayloadService } from './fines-mac-payload.service';

fdescribe('FinesMacPayloadService', () => {
  let service: FinesMacPayloadService;

  const a = () => {
    return true;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesMacPayloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(a()).toBeTrue();
  });
});
