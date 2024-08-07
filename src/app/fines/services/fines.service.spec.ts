import { TestBed } from '@angular/core/testing';

import { FinesService } from './fines.service';
import { FINES_MAC_STATE } from '../fines-mac/constants';

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
    service.fineMacState = FINES_MAC_STATE;
    expect(service.fineMacState).toEqual(FINES_MAC_STATE);
  });
});
