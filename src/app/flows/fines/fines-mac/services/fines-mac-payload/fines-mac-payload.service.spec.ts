import { TestBed } from '@angular/core/testing';
import { FinesMacPayloadService } from './fines-mac-payload.service';
import { FINES_MAC_PAYLOAD_FINES_MAC_STATE } from './mocks/fines-mac-payload-fines-mac-state.mock';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from './mocks/fines-mac-payload-add-account.mock';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { DateService } from '@services/date-service/date.service';
import { DateTime } from 'luxon';
import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE } from './utils/mocks/state/fines-mac-payload-offence-details-minor-creditor-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR } from './utils/mocks/fines-mac-payload-account-offences-with-minor-creditor.mock';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { ISessionUserState } from '@services/session-service/interfaces/session-user-state.interface';
import { IFinesMacAddAccountPayload } from './interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_MAC_PAYLOAD_STATUSES } from './constants/fines-mac-payload-statuses.constant';

describe('FinesMacPayloadService', () => {
  let service: FinesMacPayloadService | null;
  let dateService: DateService | null;
  let finesMacState: IFinesMacState | null;
  let sessionUserState: ISessionUserState | null;
  let finesMacPayloadAddAccount: IFinesMacAddAccountPayload | null;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesMacPayloadService);
    dateService = TestBed.inject(DateService);

    finesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    sessionUserState = structuredClone(SESSION_USER_STATE_MOCK);
    finesMacPayloadAddAccount = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
  });

  afterAll(() => {
    service = null;
    dateService = null;
    finesMacState = null;
    sessionUserState = null;
    finesMacPayloadAddAccount = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an add account payload', () => {
    if (!finesMacState || !sessionUserState || !finesMacPayloadAddAccount || !dateService || !service) {
      fail('Required mock states are not properly initialised');
      return;
    }

    spyOn(dateService, 'getDateNow').and.returnValue(DateTime.fromISO('2023-07-03T12:30:00Z'));

    const result = service.buildAddAccountPayload(finesMacState, sessionUserState);
    finesMacPayloadAddAccount.account.defendant.parent_guardian = null;
    expect(result).toEqual(finesMacPayloadAddAccount);
  });

  it('should create an add account payload with minor creditor', () => {
    if (!finesMacState || !sessionUserState || !finesMacPayloadAddAccount || !dateService || !service) {
      fail('Required mock states are not properly initialised');
      return;
    }

    finesMacState.offenceDetails = structuredClone([FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE]);
    spyOn(dateService, 'getDateNow').and.returnValue(DateTime.fromISO('2023-07-03T12:30:00Z'));
    const result = service.buildAddAccountPayload(finesMacState, sessionUserState);

    finesMacPayloadAddAccount.account.offences = FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR;
    finesMacPayloadAddAccount.account.defendant.parent_guardian = null;
    expect(result).toEqual(finesMacPayloadAddAccount);
  });

  it('should create a replace account payload', () => {
    if (!finesMacState || !sessionUserState || !finesMacPayloadAddAccount || !dateService || !service) {
      fail('Required mock states are not properly initialised');
      return;
    }

    finesMacPayloadAddAccount.account_status = FINES_MAC_PAYLOAD_STATUSES.resubmitted;
    finesMacPayloadAddAccount.timeline_data = [
      {
        ...finesMacPayloadAddAccount.timeline_data[0],
        status: FINES_MAC_PAYLOAD_STATUSES.resubmitted,
      },
    ];

    spyOn(dateService, 'getDateNow').and.returnValue(DateTime.fromISO('2023-07-03T12:30:00Z'));

    const result = service.buildReplaceAccountPayload(finesMacState, sessionUserState);
    finesMacPayloadAddAccount.account.defendant.parent_guardian = null;
    expect(result).toEqual(finesMacPayloadAddAccount);
  });

  it('should mapAccountPayload', () => {
    if (!sessionUserState || !finesMacPayloadAddAccount || !dateService || !service) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const result = service.mapAccountPayload(finesMacPayloadAddAccount);
    const finesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    finesMacState.parentGuardianDetails.formData = FINES_MAC_STATE.parentGuardianDetails.formData;
    finesMacState.companyDetails.formData = FINES_MAC_STATE.companyDetails.formData;

    expect(result).toEqual(finesMacState);
  });

  it('should check if an array has an array of values', () => {
    if (!service) {
      fail('Service is not properly initialised');
      return;
    }
    const array = [1, 2, 3];
    expect(service['hasNonEmptyValue'](array)).toBeTrue();
  });

  it('should check if an array does not have an array of values', () => {
    if (!service) {
      fail('Service is not properly initialised');
      return;
    }

    expect(service['hasNonEmptyValue']([])).toBeFalse();
  });

  it('should check if we have a value ', () => {
    if (!service) {
      fail('Service is not properly initialised');
      return;
    }

    expect(service['hasNonEmptyValue']('test')).toBeTrue();
  });
  it('should check if we have a null value ', () => {
    if (!service) {
      fail('Service is not properly initialised');
      return;
    }

    expect(service['hasNonEmptyValue'](null)).toBeFalse();
  });

  it('should get the status of provided if we have values', () => {
    if (!service || !finesMacState) {
      fail('Required mock states are not properly initialised');
      return;
    }
    expect(service['getFinesMacStateFormStatus'](finesMacState.accountDetails.formData)).toEqual(
      FINES_MAC_STATUS.PROVIDED,
    );
  });

  it('should get the status of not provided if we dont have values', () => {
    if (!service || !finesMacState) {
      fail('Required mock states are not properly initialised');
      return;
    }

    finesMacState.accountDetails.formData = {
      fm_create_account_account_type: null,
      fm_create_account_business_unit_id: null,
      fm_create_account_defendant_type: null,
    };
    expect(service['getFinesMacStateFormStatus'](finesMacState.accountDetails.formData)).toEqual(
      FINES_MAC_STATUS.NOT_PROVIDED,
    );
  });

  it('should get the business unit user id', () => {
    if (!service || !sessionUserState) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const businessUnitId = 17;
    const businessUnitUserId = 'L017KG';
    const result = service['getBusinessUnitBusinessUserId'](businessUnitId, sessionUserState);
    expect(result).toEqual(businessUnitUserId);
  });
});
