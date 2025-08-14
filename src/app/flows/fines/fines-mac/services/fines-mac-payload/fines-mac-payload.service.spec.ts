import { TestBed } from '@angular/core/testing';
import { FinesMacPayloadService } from './fines-mac-payload.service';
import { FINES_MAC_PAYLOAD_FINES_MAC_STATE } from './mocks/fines-mac-payload-fines-mac-state.mock';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from './mocks/fines-mac-payload-add-account.mock';
import { IFinesMacState } from '../../interfaces/fines-mac-state.interface';
import { DateTime } from 'luxon';
import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE } from './utils/mocks/state/fines-mac-payload-offence-details-minor-creditor-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR } from './utils/mocks/fines-mac-payload-account-offences-with-minor-creditor.mock';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { IFinesMacAddAccountPayload } from './interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_MAC_PAYLOAD_STATUSES } from './constants/fines-mac-payload-statuses.constant';
import { OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-non-snake-case.mock';
import { OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offence-data-non-snake-case.mock';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { ISessionUserState } from '@hmcts/opal-frontend-common/services/session-service/interfaces';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { finesMacPayloadBuildAccountTimelineData } from './utils/fines-mac-payload-build-account/fines-mac-payload-build-account-timeline-data.utils';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT_FIXED_PENALTY_MOCK } from './mocks/fines-mac-payload-add-account-fixed-penalty.mock';
import { FINES_MAC_PAYLOAD_FIXED_PENALTY_DETAILS_STATE_MOCK } from './utils/mocks/state/fines-mac-payload-fixed-penalty-details-state.mock';
import { FINES_MAC_ACCOUNT_TYPES } from '../../constants/fines-mac-account-types';

describe('FinesMacPayloadService', () => {
  let service: FinesMacPayloadService | null;
  let dateService: DateService | null;
  let finesMacState: IFinesMacState | null;
  let sessionUserState: ISessionUserState | null;
  let finesMacPayloadAddAccount: IFinesMacAddAccountPayload | null;
  let finesMacPayloadAddAccountFixedPenalty: IFinesMacAddAccountPayload;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesMacPayloadService);
    dateService = TestBed.inject(DateService);

    finesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    sessionUserState = structuredClone(SESSION_USER_STATE_MOCK);
    finesMacPayloadAddAccount = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    finesMacPayloadAddAccountFixedPenalty = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT_FIXED_PENALTY_MOCK);
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

  it('should create an add account payload for fixed penalty', () => {
    if (!finesMacState || !sessionUserState || !finesMacPayloadAddAccount || !dateService || !service) {
      fail('Required mock states are not properly initialised');
      return;
    }

    finesMacState.accountDetails.formData.fm_create_account_account_type = FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'];
    finesMacState.fixedPenaltyDetails.formData = structuredClone(FINES_MAC_PAYLOAD_FIXED_PENALTY_DETAILS_STATE_MOCK);

    spyOn(dateService, 'getDateNow').and.returnValue(DateTime.fromISO('2023-07-03T12:30:00Z'));
    const result = service.buildAddAccountPayload(finesMacState, sessionUserState);

    expect(result).toEqual(finesMacPayloadAddAccountFixedPenalty);
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

    const result = service.buildReplaceAccountPayload(finesMacState, finesMacPayloadAddAccount, sessionUserState);
    finesMacPayloadAddAccount.account.defendant.parent_guardian = null;
    expect(result).toEqual(finesMacPayloadAddAccount);
  });

  it('should mapAccountPayload', () => {
    if (!sessionUserState || !finesMacPayloadAddAccount || !dateService || !service) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const result = service.mapAccountPayload(finesMacPayloadAddAccount, null, null);
    const finesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    finesMacState.fixedPenaltyDetails.formData = FINES_MAC_STATE.fixedPenaltyDetails.formData;
    finesMacState.parentGuardianDetails.formData = FINES_MAC_STATE.parentGuardianDetails.formData;
    finesMacState.deleteAccountConfirmation.formData = FINES_MAC_STATE.deleteAccountConfirmation.formData;
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

  it('should mapAccountPayload with businessUnitRefData and offencesRefData', () => {
    if (!sessionUserState || !finesMacPayloadAddAccount || !dateService || !service) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const businessUnitRefData = structuredClone(OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK);
    const offencesRefData = structuredClone(OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK);

    const result = service.mapAccountPayload(finesMacPayloadAddAccount, businessUnitRefData, [offencesRefData]);
    const finesMacState = structuredClone(FINES_MAC_PAYLOAD_FINES_MAC_STATE);
    finesMacState.fixedPenaltyDetails.formData = { ...FINES_MAC_STATE.fixedPenaltyDetails.formData };
    finesMacState.deleteAccountConfirmation.formData = { ...FINES_MAC_STATE.deleteAccountConfirmation.formData };
    finesMacState.parentGuardianDetails.formData = { ...FINES_MAC_STATE.parentGuardianDetails.formData };
    finesMacState.companyDetails.formData = { ...FINES_MAC_STATE.companyDetails.formData };
    finesMacState.businessUnit = {
      business_unit_code: businessUnitRefData.businessUnitCode,
      business_unit_type: businessUnitRefData.businessUnitType,
      account_number_prefix: businessUnitRefData.accountNumberPrefix,
      opal_domain: businessUnitRefData.opalDomain,
      business_unit_id: businessUnitRefData.businessUnitId,
      business_unit_name: businessUnitRefData.businessUnitName,
      configuration_items: businessUnitRefData.configurationItems.map((item) => ({
        item_name: item.itemName,
        item_value: item.itemValue,
        item_values: item.itemValues,
      })),
      welsh_language: businessUnitRefData.welshLanguage,
    };

    expect(result).toEqual(finesMacState);
  });

  it('should build a patch payload with provided status and reason', () => {
    if (!service || !finesMacPayloadAddAccount || !sessionUserState || !dateService) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const status = 'Rejected';
    const reasonText = 'Some reason';

    spyOn(dateService, 'getDateNow').and.returnValue(DateTime.fromISO('2023-07-03T12:30:00Z'));

    // We need to call the real util to get the expected timeline_data
    const timeline_data = finesMacPayloadBuildAccountTimelineData(
      sessionUserState['name'],
      status,
      dateService.toFormat(DateTime.fromISO('2023-07-03T12:30:00Z'), 'yyyy-MM-dd'),
      reasonText,
      finesMacPayloadAddAccount.timeline_data,
    );

    const result = service.buildPatchAccountPayload(finesMacPayloadAddAccount, status, reasonText, sessionUserState);

    expect(result).toEqual({
      account_status: status,
      business_unit_id: finesMacPayloadAddAccount.business_unit_id!,
      reason_text: reasonText,
      timeline_data,
      validated_by: null,
      validated_by_name: null,
      version: finesMacPayloadAddAccount.version!,
    });
  });

  it('should build a patch payload with null reasonText', () => {
    if (!service || !finesMacPayloadAddAccount || !sessionUserState || !dateService) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const status = FINES_MAC_PAYLOAD_STATUSES.resubmitted;
    const reasonText = null;

    spyOn(dateService, 'getDateNow').and.returnValue(DateTime.fromISO('2023-07-03T12:30:00Z'));

    const timeline_data = finesMacPayloadBuildAccountTimelineData(
      sessionUserState['name'],
      status,
      dateService.toFormat(DateTime.fromISO('2023-07-03T12:30:00Z'), 'yyyy-MM-dd'),
      reasonText,
      finesMacPayloadAddAccount.timeline_data,
    );

    const result = service.buildPatchAccountPayload(finesMacPayloadAddAccount, status, reasonText, sessionUserState);

    expect(result).toEqual({
      account_status: status,
      business_unit_id: finesMacPayloadAddAccount.business_unit_id!,
      reason_text: reasonText,
      timeline_data,
      validated_by: service['getBusinessUnitBusinessUserId'](
        finesMacPayloadAddAccount.business_unit_id!,
        sessionUserState,
      )!,
      validated_by_name: sessionUserState['name'],
      version: finesMacPayloadAddAccount.version!,
    });
  });

  it('should return forenames and surname when defendant_type is "adultOrYouthOnly"', () => {
    if (!service) {
      fail('Service is not properly initialised');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      account: {
        defendant_type: FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly,
        defendant: {
          forenames: 'John',
          surname: 'Doe',
          company_name: 'Acme Ltd',
        },
      },
    };
    expect(service.getDefendantName(payload)).toBe('John Doe');
  });

  it('should return forenames and surname when defendant_type is "parentOrGuardianToPay"', () => {
    if (!service) {
      fail('Service is not properly initialised');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      account: {
        defendant_type: FINES_MAC_DEFENDANT_TYPES_KEYS.parentOrGuardianToPay,
        defendant: {
          forenames: 'Jane',
          surname: 'Smith',
          company_name: 'Widgets Inc',
        },
      },
    };
    expect(service.getDefendantName(payload)).toBe('Jane Smith');
  });

  it('should return company_name when defendant_type is not "adultOrYouthOnly" or "parentOrGuardianToPay"', () => {
    if (!service) {
      fail('Service is not properly initialised');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      account: {
        defendant_type: FINES_MAC_DEFENDANT_TYPES_KEYS.company,
        defendant: {
          forenames: 'N/A',
          surname: 'N/A',
          company_name: 'MegaCorp Ltd',
        },
      },
    };
    expect(service.getDefendantName(payload)).toBe('MegaCorp Ltd');
  });

  it('should handle missing forenames or surname gracefully', () => {
    if (!service) {
      fail('Service is not properly initialised');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      account: {
        defendant_type: FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly,
        defendant: {
          forenames: undefined,
          surname: null,
          company_name: 'Fallback Ltd',
        },
      },
    };
    expect(service.getDefendantName(payload)).toBe('undefined null');
  });

  it('should handle missing company_name gracefully', () => {
    if (!service) {
      fail('Service is not properly initialised');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      account: {
        defendant_type: FINES_MAC_DEFENDANT_TYPES_KEYS.company,
        defendant: {
          forenames: 'N/A',
          surname: 'N/A',
          company_name: undefined,
        },
      },
    };
    expect(service.getDefendantName(payload)).toBe('undefined');
  });
});
