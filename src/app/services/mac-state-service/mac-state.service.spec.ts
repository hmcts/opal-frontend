import { TestBed } from '@angular/core/testing';

import { MacStateService } from './mac-state.service';
import { SEARCH_STATE_MOCK } from '@mocks';
import { MANUAL_ACCOUNT_CREATION_STATE } from '@constants';

describe('MacStateServiceService', () => {
  let service: MacStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MacStateService],
    });
    service = TestBed.inject(MacStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store search state', () => {
    service.accountEnquiry = { search: SEARCH_STATE_MOCK };
    service.manualAccountCreation = MANUAL_ACCOUNT_CREATION_STATE;
    expect(service.accountEnquiry.search).toEqual(SEARCH_STATE_MOCK);
    expect(service.manualAccountCreation).toEqual(MANUAL_ACCOUNT_CREATION_STATE);
  });
});
