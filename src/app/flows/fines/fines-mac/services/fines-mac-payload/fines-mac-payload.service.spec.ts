import { TestBed } from '@angular/core/testing';

import { FinesMacPayloadService } from './fines-mac-payload.service';
import { FINES_MAC_PAYLOAD_FINES_MAC_STATE } from './mocks/fines-mac-payload-fines-mac-state.mock';
import { FINES_MAC_PAYLOAD_MOCK } from './mocks/fines-mac-payload.mock';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';

describe('FinesMacPayloadService', () => {
  let service: FinesMacPayloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesMacPayloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a payload', () => {
    const finesMacState: IFinesMacState = { ...FINES_MAC_PAYLOAD_FINES_MAC_STATE };

    const result = service.buildPayload(finesMacState);

    expect(result).toEqual(FINES_MAC_PAYLOAD_MOCK);
  });
});
