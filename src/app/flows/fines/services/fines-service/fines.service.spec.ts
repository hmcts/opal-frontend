import { TestBed } from '@angular/core/testing';
import { FINES_MAC_STATE } from '../../fines-mac/constants/fines-mac-state';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_EMPLOYER_DETAILS_FORM } from '../../fines-mac/fines-mac-employer-details/constants/fines-mac-employer-details-form';
import { FINES_MAC_STATUS } from '../../fines-mac/constants/fines-mac-status';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../../fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-form.mock';
import { DateService } from '@services/date-service/date.service';

describe('FinesService', () => {
  let service: FinesService | null;
  let mockDateService: jasmine.SpyObj<DateService> | null;

  beforeEach(() => {
    mockDateService = jasmine.createSpyObj(DateService, ['getDateFromFormat']);

    TestBed.configureTestingModule({
      providers: [{ provide: DateService, useValue: mockDateService }],
    });
    service = TestBed.inject(FinesService);
  });

  afterAll(() => {
    service = null;
    mockDateService = null;
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store search state', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    service.finesMacState = structuredClone(FINES_MAC_STATE);
    expect(service.finesMacState).toEqual(FINES_MAC_STATE);
  });

  it('should validate employer details status', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const employerDetails = structuredClone(FINES_MAC_EMPLOYER_DETAILS_FORM);
    expect(service['checkEmployerDetailsStatus'](employerDetails)).toBeTrue();

    employerDetails.status = FINES_MAC_STATUS.NOT_PROVIDED;
    expect(service['checkEmployerDetailsStatus'](employerDetails)).toBeTrue();

    employerDetails.status = FINES_MAC_STATUS.INCOMPLETE;
    expect(service['checkEmployerDetailsStatus'](employerDetails)).toBeFalse();
  });

  it('should validate each offence status', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const offenceDetails = [structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)];
    expect(service['checkEachOffenceStatus'](offenceDetails)).toBeTrue();

    offenceDetails[0].status = FINES_MAC_STATUS.INCOMPLETE;
    expect(service['checkEachOffenceStatus'](offenceDetails)).toBeFalse();
  });

  it('should check mandatory sections for adult or youth', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    service.finesMacState = {
      ...structuredClone(FINES_MAC_STATE),
      courtDetails: { ...structuredClone(FINES_MAC_STATE.courtDetails), status: FINES_MAC_STATUS.PROVIDED },
      personalDetails: { ...structuredClone(FINES_MAC_STATE.personalDetails), status: FINES_MAC_STATUS.PROVIDED },
      employerDetails: { ...structuredClone(FINES_MAC_STATE.employerDetails), status: FINES_MAC_STATUS.PROVIDED },
      offenceDetails: [{ ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK), status: FINES_MAC_STATUS.PROVIDED }],
      paymentTerms: { ...structuredClone(FINES_MAC_STATE.paymentTerms), status: FINES_MAC_STATUS.PROVIDED },
    };
    expect(service['adultOrYouthMandatorySectionsCheck']()).toBeTrue();

    service.finesMacState.courtDetails.status = FINES_MAC_STATUS.INCOMPLETE;
    expect(service['adultOrYouthMandatorySectionsCheck']()).toBeFalse();
  });

  it('should check mandatory sections for adult or youth parent/guardian', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    service.finesMacState = {
      ...structuredClone(FINES_MAC_STATE),
      courtDetails: { ...structuredClone(FINES_MAC_STATE.courtDetails), status: FINES_MAC_STATUS.PROVIDED },
      parentGuardianDetails: {
        ...structuredClone(FINES_MAC_STATE.parentGuardianDetails),
        status: FINES_MAC_STATUS.PROVIDED,
      },
      personalDetails: { ...structuredClone(FINES_MAC_STATE.personalDetails), status: FINES_MAC_STATUS.PROVIDED },
      employerDetails: { ...structuredClone(FINES_MAC_STATE.employerDetails), status: FINES_MAC_STATUS.PROVIDED },
      offenceDetails: [{ ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK), status: FINES_MAC_STATUS.PROVIDED }],
      paymentTerms: { ...structuredClone(FINES_MAC_STATE.paymentTerms), status: FINES_MAC_STATUS.PROVIDED },
    };
    expect(service['adultOrYouthParentGuardianMandatorySectionsCheck']()).toBeTrue();

    service.finesMacState.parentGuardianDetails.status = FINES_MAC_STATUS.INCOMPLETE;
    expect(service['adultOrYouthParentGuardianMandatorySectionsCheck']()).toBeFalse();
  });

  it('should check mandatory sections for a company', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    service.finesMacState = {
      ...structuredClone(FINES_MAC_STATE),
      courtDetails: { ...structuredClone(FINES_MAC_STATE.courtDetails), status: FINES_MAC_STATUS.PROVIDED },
      companyDetails: { ...structuredClone(FINES_MAC_STATE.companyDetails), status: FINES_MAC_STATUS.PROVIDED },
      employerDetails: { ...structuredClone(FINES_MAC_STATE.employerDetails), status: FINES_MAC_STATUS.PROVIDED },
      offenceDetails: [{ ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK), status: FINES_MAC_STATUS.PROVIDED }],
      paymentTerms: { ...structuredClone(FINES_MAC_STATE.paymentTerms), status: FINES_MAC_STATUS.PROVIDED },
    };
    expect(service['companyMandatorySectionsCheck']()).toBeTrue();

    service.finesMacState.companyDetails.status = 'INVALID_STATUS';
    expect(service['companyMandatorySectionsCheck']()).toBeFalse();
  });

  it('should check mandatory sections based on defendant type', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    service.finesMacState = {
      ...structuredClone(FINES_MAC_STATE),
      accountDetails: {
        ...structuredClone(FINES_MAC_STATE.accountDetails),
        formData: {
          ...structuredClone(FINES_MAC_STATE.accountDetails.formData),
          fm_create_account_defendant_type: 'adultOrYouthOnly',
        },
      },
    };

    service.finesMacState.accountDetails.formData = {
      ...structuredClone(service.finesMacState.accountDetails.formData),
      fm_create_account_defendant_type: 'adultOrYouthOnly',
    };
    expect(service.checkMandatorySections()).toBeFalse();

    service.finesMacState.accountDetails.formData = {
      ...structuredClone(service.finesMacState.accountDetails.formData),
      fm_create_account_defendant_type: 'parentOrGuardianToPay',
    };
    expect(service.checkMandatorySections()).toBeFalse();

    service.finesMacState.accountDetails.formData = {
      ...structuredClone(service.finesMacState.accountDetails.formData),
      fm_create_account_defendant_type: 'company',
    };
    expect(service.checkMandatorySections()).toBeFalse();
  });

  it('should retrieve the earliest date of sentence', () => {
    if (!service || !mockDateService) {
      fail('Required properties not properly initialised');
      return;
    }

    service.finesMacState.offenceDetails = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData),
          fm_offence_details_date_of_sentence: '02/09/2024',
        },
      },
    ];
    const offenceDate = new Date('2024-09-01');

    mockDateService.getDateFromFormat.and.returnValue(offenceDate);

    expect(service.getEarliestDateOfSentence()).toEqual(offenceDate);
  });

  it('should return null if no offence details are present', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    service.finesMacState.offenceDetails = [];
    expect(service.getEarliestDateOfSentence()).toBeNull();
  });
});
