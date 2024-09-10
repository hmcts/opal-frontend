import { TestBed } from '@angular/core/testing';
import { FINES_MAC_STATE } from '../../fines-mac/constants/fines-mac-state';
import { FinesService } from '@services/fines/fines-service/fines';

describe('FinesService', () => {
  let service: FinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store search state', () => {
    service.finesMacState = FINES_MAC_STATE;
    expect(service.finesMacState).toEqual(FINES_MAC_STATE);
  });
});
