import { TestBed } from '@angular/core/testing';

import { FinesMacPayloadService } from './fines-mac-payload.service';
import { FINES_MAC_PAYLOAD_FINES_MAC_STATE } from './mocks/fines-mac-payload-fines-mac-state.mock';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from './mocks/fines-mac-payload-add-account.mock';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';

import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { DateService } from '@services/date-service/date.service';
import { DateTime } from 'luxon';
import { FineMacPayloadAccountAccountStatuses } from './enums/fines-mac-payload-account-account-statuses.enum';

describe('FinesMacPayloadService', () => {
  let service: FinesMacPayloadService;
  let dateService: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesMacPayloadService);
    dateService = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an add account payload', () => {
    const finesMacState: IFinesMacState = { ...FINES_MAC_PAYLOAD_FINES_MAC_STATE };
    spyOn(dateService, 'getDateNow').and.returnValue(DateTime.fromISO('2023-07-03T12:30:00Z'));

    const result = service.buildAddAccountPayload(finesMacState, SESSION_USER_STATE_MOCK);
    expect(result).toEqual(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
  });

  it('should create a replace account payload', () => {
    const finesMacState: IFinesMacState = { ...FINES_MAC_PAYLOAD_FINES_MAC_STATE };
    const finesMacPayloadReplaceAccount = {
      ...FINES_MAC_PAYLOAD_ADD_ACCOUNT,
      account_status: FineMacPayloadAccountAccountStatuses.resubmitted,
      timeline_data: [
        {
          ...FINES_MAC_PAYLOAD_ADD_ACCOUNT.timeline_data[0],
          status: FineMacPayloadAccountAccountStatuses.resubmitted,
        },
      ],
    };

    spyOn(dateService, 'getDateNow').and.returnValue(DateTime.fromISO('2023-07-03T12:30:00Z'));

    const result = service.buildReplaceAccountPayload(finesMacState, SESSION_USER_STATE_MOCK);
    expect(result).toEqual(finesMacPayloadReplaceAccount);
  });
});
