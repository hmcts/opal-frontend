import { TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsService } from './fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../../constants/fines-mac-offence-details-draft-state';

describe('FinesMacOffenceDetailsService', () => {
  let service: FinesMacOffenceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesMacOffenceDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store offence details draft state', () => {
    service.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;
    expect(service.finesMacOffenceDetailsDraftState).toEqual(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE);
  });
});
