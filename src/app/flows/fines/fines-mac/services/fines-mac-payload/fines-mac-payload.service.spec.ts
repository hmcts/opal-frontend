import { TestBed } from '@angular/core/testing';

import { FinesMacPayloadService } from './fines-mac-payload.service';
import { FINES_MAC_PAYLOAD_FINES_MAC_STATE } from './mocks/fines-mac-payload-fines-mac-state.mock';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from './mocks/fines-mac-payload-add-account.mock';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';

import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { DateService } from '@services/date-service/date.service';
import { DateTime } from 'luxon';
import { FineMacPayloadAccountAccountStatuses } from './enums/fines-mac-payload-account-account-statuses.enum';
import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE } from './utils/mocks/state/fines-mac-payload-offence-details-minor-creditor-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR } from './utils/mocks/fines-mac-payload-account-offences-with-minor-creditor.mock';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';

fdescribe('FinesMacPayloadService', () => {
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
    const finesMacState: IFinesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    spyOn(dateService, 'getDateNow').and.returnValue(DateTime.fromISO('2023-07-03T12:30:00Z'));

    const result = service.buildAddAccountPayload(finesMacState, SESSION_USER_STATE_MOCK);
    expect(result).toEqual(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
  });

  it('should create an add account payload with minor creditor', () => {
    const finesMacState: IFinesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    finesMacState.offenceDetails = structuredClone([{ ...FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE }]);
    spyOn(dateService, 'getDateNow').and.returnValue(DateTime.fromISO('2023-07-03T12:30:00Z'));
    const result = service.buildAddAccountPayload(finesMacState, SESSION_USER_STATE_MOCK);
    const payload = structuredClone({ ...FINES_MAC_PAYLOAD_ADD_ACCOUNT });
    payload.account.offences = FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR;
    expect(result).toEqual(payload);
  });

  it('should create a replace account payload', () => {
    const finesMacState: IFinesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    const finesMacPayloadReplaceAccount = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    finesMacPayloadReplaceAccount.account_status = FineMacPayloadAccountAccountStatuses.resubmitted;
    finesMacPayloadReplaceAccount.timeline_data = [
      {
        ...FINES_MAC_PAYLOAD_ADD_ACCOUNT.timeline_data[0],
        status: FineMacPayloadAccountAccountStatuses.resubmitted,
      },
    ];

    spyOn(dateService, 'getDateNow').and.returnValue(DateTime.fromISO('2023-07-03T12:30:00Z'));

    const result = service.buildReplaceAccountPayload(finesMacState, SESSION_USER_STATE_MOCK);
    expect(result).toEqual(finesMacPayloadReplaceAccount);
  });

  it('should mapAccountPayload', () => {
    const result = service.mapAccountPayload(structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT));
    const finesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    finesMacState.parentGuardianDetails.formData = { ...FINES_MAC_STATE.parentGuardianDetails.formData };
    finesMacState.parentGuardianDetails.status = FINES_MAC_STATUS.NOT_PROVIDED;
    finesMacState.companyDetails.formData = { ...FINES_MAC_STATE.companyDetails.formData };
    finesMacState.companyDetails.status = FINES_MAC_STATUS.NOT_PROVIDED;

    expect(result).toEqual(finesMacState);
  });

  it('should check if an array has an array of values', () => {
    const array = [1, 2, 3];
    expect(service['hasNonEmptyValue'](array)).toBeTrue();
  });

  it('should check if an array does not have an array of values', () => {
    expect(service['hasNonEmptyValue']([])).toBeFalse();
  });

  it('should check if we have a value ', () => {
    expect(service['hasNonEmptyValue']('test')).toBeTrue();
  });
  it('should check if we have a null value ', () => {
    expect(service['hasNonEmptyValue'](null)).toBeFalse();
  });

  it('should get the status of provided if we have values', () => {
    const finesMacState: IFinesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    expect(service['getFinesMacStateFormStatus'](finesMacState.accountDetails.formData)).toEqual(
      FINES_MAC_STATUS.PROVIDED,
    );
  });

  it('should get the status of not provided if we dont have values', () => {
    const finesMacState: IFinesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    finesMacState.accountDetails.formData = {
      fm_create_account_account_type: null,
      fm_create_account_business_unit_id: null,
      fm_create_account_defendant_type: null,
    };
    expect(service['getFinesMacStateFormStatus'](finesMacState.accountDetails.formData)).toEqual(
      FINES_MAC_STATUS.NOT_PROVIDED,
    );
  });

  it('should set the statuses of the states', () => {
    const finesMacState: IFinesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    const result = service['setFinesMacStateStatuses'](finesMacState);

    expect(result.accountDetails.status).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(result.parentGuardianDetails.status).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(result.companyDetails.status).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(result.courtDetails.status).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(result.accountCommentsNotes.status).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(result.offenceDetails[0].status).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(result.paymentTerms.status).toEqual(FINES_MAC_STATUS.PROVIDED);
  });

  it('should set the statuses of the states to not provided', () => {
    const finesMacState: IFinesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    finesMacState.accountDetails.formData = {
      fm_create_account_account_type: null,
      fm_create_account_business_unit_id: null,
      fm_create_account_defendant_type: null,
    };

    const result = service['setFinesMacStateStatuses'](finesMacState);
    expect(result.accountDetails.status).toEqual(FINES_MAC_STATUS.NOT_PROVIDED);
  });
});
