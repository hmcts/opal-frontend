import { TestBed } from '@angular/core/testing';
import { MacStateService } from './mac-state.service';
import { MANUAL_ACCOUNT_CREATION_STATE } from '@constants';

describe('MacStateServiceService', () => {
  let service: MacStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store search state', () => {
    service.manualAccountCreation = MANUAL_ACCOUNT_CREATION_STATE;
    expect(service.manualAccountCreation).toEqual(MANUAL_ACCOUNT_CREATION_STATE);
  });
});
