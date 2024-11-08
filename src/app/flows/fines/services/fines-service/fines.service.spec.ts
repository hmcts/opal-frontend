import { TestBed } from '@angular/core/testing';
import { FINES_MAC_STATE } from '../../fines-mac/constants/fines-mac-state';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_EMPLOYER_DETAILS_FORM } from '../../fines-mac/fines-mac-employer-details/constants/fines-mac-employer-details-form';
import { FINES_MAC_STATUS } from '../../fines-mac/constants/fines-mac-status';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../../fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-form.mock';

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
    service.finesMacState = FINES_MAC_STATE;
    expect(service.finesMacState).toEqual(FINES_MAC_STATE);
  });

  it('should validate employer details status', () => {
    const employerDetails = { ...FINES_MAC_EMPLOYER_DETAILS_FORM };
    expect(service['checkEmployerDetailsStatus'](employerDetails)).toBeTrue();

    employerDetails.status = FINES_MAC_STATUS.NOT_PROVIDED;
    expect(service['checkEmployerDetailsStatus'](employerDetails)).toBeTrue();

    employerDetails.status = FINES_MAC_STATUS.INCOMPLETE;
    expect(service['checkEmployerDetailsStatus'](employerDetails)).toBeFalse();
  });

  it('should validate each offence status', () => {
    const offenceDetails = [{ ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK }];
    expect(service['checkEachOffenceStatus'](offenceDetails)).toBeTrue();

    offenceDetails[0].status = FINES_MAC_STATUS.INCOMPLETE;
    expect(service['checkEachOffenceStatus'](offenceDetails)).toBeFalse();
  });

  it('should check mandatory sections for adult or youth', () => {
    service.finesMacState = {
      ...FINES_MAC_STATE,
      courtDetails: { ...FINES_MAC_STATE.courtDetails, status: FINES_MAC_STATUS.PROVIDED },
      personalDetails: { ...FINES_MAC_STATE.personalDetails, status: FINES_MAC_STATUS.PROVIDED },
      employerDetails: { ...FINES_MAC_STATE.employerDetails, status: FINES_MAC_STATUS.PROVIDED },
      offenceDetails: [{ ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK, status: FINES_MAC_STATUS.PROVIDED }],
      paymentTerms: { ...FINES_MAC_STATE.paymentTerms, status: FINES_MAC_STATUS.PROVIDED },
    };
    expect(service['adultOrYouthMandatorySectionsCheck']()).toBeTrue();

    service.finesMacState.courtDetails.status = FINES_MAC_STATUS.INCOMPLETE;
    expect(service['adultOrYouthMandatorySectionsCheck']()).toBeFalse();
  });

  it('should check mandatory sections for adult or youth parent/guardian', () => {
    service.finesMacState = {
      ...FINES_MAC_STATE,
      courtDetails: { ...FINES_MAC_STATE.courtDetails, status: FINES_MAC_STATUS.PROVIDED },
      parentGuardianDetails: { ...FINES_MAC_STATE.parentGuardianDetails, status: FINES_MAC_STATUS.PROVIDED },
      personalDetails: { ...FINES_MAC_STATE.personalDetails, status: FINES_MAC_STATUS.PROVIDED },
      employerDetails: { ...FINES_MAC_STATE.employerDetails, status: FINES_MAC_STATUS.PROVIDED },
      offenceDetails: [{ ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK, status: FINES_MAC_STATUS.PROVIDED }],
      paymentTerms: { ...FINES_MAC_STATE.paymentTerms, status: FINES_MAC_STATUS.PROVIDED },
    };
    expect(service['adultOrYouthParentGuardianMandatorySectionsCheck']()).toBeTrue();

    service.finesMacState.parentGuardianDetails.status = FINES_MAC_STATUS.INCOMPLETE;
    expect(service['adultOrYouthParentGuardianMandatorySectionsCheck']()).toBeFalse();
  });

  it('should check mandatory sections for a company', () => {
    service.finesMacState = {
      ...FINES_MAC_STATE,
      courtDetails: { ...FINES_MAC_STATE.courtDetails, status: FINES_MAC_STATUS.PROVIDED },
      companyDetails: { ...FINES_MAC_STATE.companyDetails, status: FINES_MAC_STATUS.PROVIDED },
      employerDetails: { ...FINES_MAC_STATE.employerDetails, status: FINES_MAC_STATUS.PROVIDED },
      offenceDetails: [{ ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK, status: FINES_MAC_STATUS.PROVIDED }],
      paymentTerms: { ...FINES_MAC_STATE.paymentTerms, status: FINES_MAC_STATUS.PROVIDED },
    };
    expect(service['companyMandatorySectionsCheck']()).toBeTrue();

    service.finesMacState.companyDetails.status = 'INVALID_STATUS';
    expect(service['companyMandatorySectionsCheck']()).toBeFalse();
  });

  it('should check mandatory sections based on defendant type', () => {
    service.finesMacState = {
      ...FINES_MAC_STATE,
    };

    service.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';
    expect(service.checkMandatorySections()).toBeFalse();

    service.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';
    expect(service.checkMandatorySections()).toBeFalse();

    service.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';
    expect(service.checkMandatorySections()).toBeFalse();
  });
});
