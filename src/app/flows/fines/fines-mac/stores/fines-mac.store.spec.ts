import { TestBed } from '@angular/core/testing';
import { FinesMacStore } from './fines-mac.store';

import { FINES_MAC_EMPLOYER_DETAILS_FORM } from '../fines-mac-employer-details/constants/fines-mac-employer-details-form';
import { FINES_MAC_ACCOUNT_DETAILS_FORM } from '../fines-mac-account-details/constants/fines-mac-account-details-form';
import { FINES_MAC_CONTACT_DETAILS_FORM } from '../fines-mac-contact-details/constants/fines-mac-contact-details-form';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM } from '../fines-mac-parent-guardian-details/constants/fines-mac-parent-guardian-details-form';
import { FINES_MAC_PERSONAL_DETAILS_FORM } from '../fines-mac-personal-details/constants/fines-mac-personal-details-form';
import { FINES_MAC_COMPANY_DETAILS_FORM } from '../fines-mac-company-details/constants/fines-mac-company-details-form';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM } from '../fines-mac-account-comments-notes/constants/fines-mac-account-comments-notes-form';
import { FINES_MAC_OFFENCE_DETAILS_FORM } from '../fines-mac-offence-details/constants/fines-mac-offence-details-form.constant';
import { FINES_MAC_PAYMENT_TERMS_FORM } from '../fines-mac-payment-terms/constants/fines-mac-payment-terms-form';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM } from '../fines-mac-language-preferences/constants/fines-mac-language-preferences-form';
import { FINES_MAC_BUSINESS_UNIT_STATE } from '../constants/fines-mac-business-unit-state';
import { FinesMacStoreType } from './types/fines-mac-store.type';
import { FINES_MAC_COURT_DETAILS_FORM } from '../fines-mac-court-details/constants/fines-mac-court-details-form';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK } from '../fines-mac-account-comments-notes/mocks/fines-mac-account-comments-notes-form.mock';
import { FINES_MAC_COMPANY_DETAILS_FORM_MOCK } from '../fines-mac-company-details/mocks/fines-mac-company-details-form.mock';
import { FINES_MAC_CONTACT_DETAILS_FORM_MOCK } from '../fines-mac-contact-details/mocks/fines-mac-contact-details-form.mock';
import { FINES_MAC_COURT_DETAILS_FORM_MOCK } from '../fines-mac-court-details/mocks/fines-mac-court-details-form.mock';
import { FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK } from '../fines-mac-employer-details/mocks/fines-mac-employer-details-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../fines-mac-offence-details/mocks/fines-mac-offence-details-form.mock';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK } from '../fines-mac-parent-guardian-details/mocks/fines-mac-parent-guardian-details-form.mock';
import { FINES_MAC_PAYMENT_TERMS_FORM_MOCK } from '../fines-mac-payment-terms/mocks/fines-mac-payment-terms-form.mock';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../fines-mac-personal-details/mocks/fines-mac-personal-details-form.mock';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_STATE } from '../constants/fines-mac-state';
import { DateService, UtilsService } from '@hmcts/opal-frontend-common/core/services';

describe('FinesMacStore', () => {
  let store: FinesMacStoreType;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  beforeEach(() => {
    mockUtilsService = jasmine.createSpyObj(UtilsService, [
      'checkFormValues',
      'checkFormArrayValues',
      'getFormStatus',
      'getArrayFormStatus',
    ]);
    mockDateService = jasmine.createSpyObj(DateService, ['getDateFromFormat']);

    TestBed.configureTestingModule({
      providers: [
        { provide: DateService, useValue: mockDateService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    });

    store = TestBed.inject(FinesMacStore);
  });

  it('should initialize with default state', () => {
    expect(store.employerDetails()).toEqual(FINES_MAC_EMPLOYER_DETAILS_FORM);
    expect(store.accountDetails()).toEqual(FINES_MAC_ACCOUNT_DETAILS_FORM);
    expect(store.contactDetails()).toEqual(FINES_MAC_CONTACT_DETAILS_FORM);
    expect(store.parentGuardianDetails()).toEqual(FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM);
    expect(store.personalDetails()).toEqual(FINES_MAC_PERSONAL_DETAILS_FORM);
    expect(store.companyDetails()).toEqual(FINES_MAC_COMPANY_DETAILS_FORM);
    expect(store.courtDetails()).toEqual(FINES_MAC_COURT_DETAILS_FORM);
    expect(store.accountCommentsNotes()).toEqual(FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM);
    expect(store.offenceDetails()).toEqual(FINES_MAC_OFFENCE_DETAILS_FORM);
    expect(store.paymentTerms()).toEqual(FINES_MAC_PAYMENT_TERMS_FORM);
    expect(store.languagePreferences()).toEqual(FINES_MAC_LANGUAGE_PREFERENCES_FORM);
    expect(store.businessUnit()).toEqual(FINES_MAC_BUSINESS_UNIT_STATE);
    expect(store.unsavedChanges()).toBe(false);
    expect(store.stateChanges()).toBe(false);
    expect(store.deleteFromCheckAccount()).toBe(false);
  });

  it('should set employer details', () => {
    const newEmployerDetails = {
      ...structuredClone(FINES_MAC_EMPLOYER_DETAILS_FORM),
      formData: { ...structuredClone(FINES_MAC_EMPLOYER_DETAILS_FORM.formData), name: 'New Employer' },
    };
    store.setEmployerDetails(newEmployerDetails);
    expect(store.employerDetails()).toEqual(newEmployerDetails);
    expect(store.stateChanges()).toBe(true);
    expect(store.unsavedChanges()).toBe(false);
  });

  it('should set all data', () => {
    const businessUnit = structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    const languagePreferences = structuredClone(FINES_MAC_LANGUAGE_PREFERENCES_FORM);
    const accountDetails = structuredClone(FINES_MAC_ACCOUNT_DETAILS_FORM);
    accountDetails.formData = {
      ...accountDetails.formData,
      fm_create_account_account_type: 'fine',
      fm_create_account_business_unit_id: businessUnit.business_unit_id,
      fm_create_account_defendant_type: 'adultOrYouthOnly',
    };

    store.setAccountDetails(accountDetails, businessUnit, languagePreferences);
    store.setAccountCommentsNotes(FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK);
    store.setCompanyDetails(FINES_MAC_COMPANY_DETAILS_FORM_MOCK);
    store.setContactDetails(FINES_MAC_CONTACT_DETAILS_FORM_MOCK);
    store.setCourtDetails(FINES_MAC_COURT_DETAILS_FORM_MOCK);
    store.setEmployerDetails(FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK);
    store.setOffenceDetails([FINES_MAC_OFFENCE_DETAILS_FORM_MOCK]);
    store.setParentGuardianDetails(FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK);
    store.setPaymentTerms(FINES_MAC_PAYMENT_TERMS_FORM_MOCK);
    store.setPersonalDetails(FINES_MAC_PERSONAL_DETAILS_FORM_MOCK);
    store.setLanguagePreferences(languagePreferences);
    store.setBusinessUnit(businessUnit);
    store.setStateChanges(true);
    store.setUnsavedChanges(false);
    store.setDeleteFromCheckAccount(false);
    store.setBusinessUnitId(businessUnit.business_unit_id);

    expect(store.accountDetails()).toEqual(accountDetails);
    expect(store.businessUnit()).toEqual(businessUnit);
    expect(store.languagePreferences()).toEqual(languagePreferences);
    expect(store.accountCommentsNotes()).toEqual(FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK);
    expect(store.companyDetails()).toEqual(FINES_MAC_COMPANY_DETAILS_FORM_MOCK);
    expect(store.contactDetails()).toEqual(FINES_MAC_CONTACT_DETAILS_FORM_MOCK);
    expect(store.courtDetails()).toEqual(FINES_MAC_COURT_DETAILS_FORM_MOCK);
    expect(store.employerDetails()).toEqual(FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK);
    expect(store.offenceDetails()).toEqual([FINES_MAC_OFFENCE_DETAILS_FORM_MOCK]);
    expect(store.parentGuardianDetails()).toEqual(FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK);
    expect(store.paymentTerms()).toEqual(FINES_MAC_PAYMENT_TERMS_FORM_MOCK);
    expect(store.personalDetails()).toEqual(FINES_MAC_PERSONAL_DETAILS_FORM_MOCK);
    expect(store.languagePreferences()).toEqual(languagePreferences);
    expect(store.businessUnit()).toEqual(businessUnit);
    expect(store.stateChanges()).toBe(true);
    expect(store.unsavedChanges()).toBe(false);
    expect(store.deleteFromCheckAccount()).toBe(false);
    expect(store.accountDetails().formData.fm_create_account_business_unit_id).toBe(businessUnit.business_unit_id);
  });

  it('should reset payment terms and put status to incomplete', () => {
    store.setPaymentTerms(FINES_MAC_PAYMENT_TERMS_FORM_MOCK);
    expect(store.paymentTerms()).toEqual(FINES_MAC_PAYMENT_TERMS_FORM_MOCK);

    // reset days in default
    const paymentTermsWithoutDaysInDefault = structuredClone(FINES_MAC_PAYMENT_TERMS_FORM_MOCK);
    paymentTermsWithoutDaysInDefault.formData = {
      ...paymentTermsWithoutDaysInDefault.formData,
      fm_payment_terms_has_days_in_default: false,
      fm_payment_terms_default_days_in_jail: null,
      fm_payment_terms_suspended_committal_date: null,
    };
    store.resetPaymentTermsDaysInDefault();
    expect(store.paymentTerms()).toEqual(paymentTermsWithoutDaysInDefault);

    // change status
    store.setPaymentTermsStatus(FINES_MAC_STATUS.INCOMPLETE);
    expect(store.paymentTerms().status).toEqual(FINES_MAC_STATUS.INCOMPLETE);
  });

  it('should set finesMacStore and get finesMacState, then reset ', () => {
    store.setFinesMacStore(FINES_MAC_STATE_MOCK);
    expect(store.getFinesMacStore()).toEqual(FINES_MAC_STATE_MOCK);

    store.resetFinesMacStore();
    expect(store.getFinesMacStore()).toEqual(FINES_MAC_STATE);
  });

  it('should test computed signals', () => {
    store.setFinesMacStore(FINES_MAC_STATE_MOCK);
    expect(store.getFinesMacStore()).toEqual(FINES_MAC_STATE_MOCK);

    expect(store.getDefendantType()).toEqual(
      FINES_MAC_STATE_MOCK.accountDetails.formData.fm_create_account_defendant_type!,
    );

    mockUtilsService.getFormStatus.and.returnValue(FINES_MAC_STATUS.PROVIDED);
    mockUtilsService.getArrayFormStatus.and.returnValue(FINES_MAC_STATUS.PROVIDED);
    mockUtilsService.checkFormValues.and.returnValue(true);
    mockUtilsService.checkFormArrayValues.and.returnValue(true);

    expect(store.getBusinessUnitId()).toEqual(FINES_MAC_STATE_MOCK.businessUnit.business_unit_id);
    expect(store.employerDetailsStatus()).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(store.contactDetailsStatus()).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(store.personalDetailsStatus()).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(store.companyDetailsStatus()).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(store.parentGuardianDetailsStatus()).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(store.courtDetailsStatus()).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(store.accountCommentsNotesStatus()).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(store.offenceDetailsStatus()).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(store.paymentTermsStatus()).toEqual(FINES_MAC_STATUS.PROVIDED);
    expect(store.adultOrYouthSectionsCompleted()).toEqual(true);
    expect(store.parentGuardianSectionsCompleted()).toEqual(true);
    expect(store.companySectionsCompleted()).toEqual(true);
  });

  it('should test payment term status changing', () => {
    store.setPaymentTermsStatus(FINES_MAC_STATUS.INCOMPLETE);
    expect(store.paymentTermsStatus()).toEqual(FINES_MAC_STATUS.INCOMPLETE);
  });

  it('should test earliest date of sentence return a date', () => {
    // should test earliest date of sentence
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData),
          fm_offence_details_date_of_sentence: '02/09/2024',
        },
      },
    ];
    store.setFinesMacStore(finesMacState);

    const offenceDate = new Date('2024-09-01');
    mockDateService.getDateFromFormat.and.returnValue(offenceDate);

    expect(store.getEarliestDateOfSentence()).toEqual(offenceDate);
  });

  it('should test earliest date of sentence return a null', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData),
          fm_offence_details_date_of_sentence: null,
        },
      },
    ];
    store.setFinesMacStore(finesMacState);

    expect(store.getEarliestDateOfSentence()).toEqual(null);
  });

  it('should test earliest date of sentence return a null (empty offence details)', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [];
    store.setFinesMacStore(finesMacState);

    expect(store.getEarliestDateOfSentence()).toEqual(null);
  });
});
