import { TestBed } from '@angular/core/testing';

import { AeStateService } from './ae-state.service';
import { SEARCH_STATE_MOCK } from '@mocks';

describe('AeStateService', () => {
  let service: AeStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AeStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store search state', () => {
    service.accountEnquiry = { search: SEARCH_STATE_MOCK };
    expect(service.accountEnquiry.search).toEqual(SEARCH_STATE_MOCK);
  });
});
