import { signalStore, withState, withMethods, patchState, withComputed, withHooks } from '@ngrx/signals';
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
import { IFinesMacEmployerDetailsForm } from '../fines-mac-employer-details/interfaces/fines-mac-employer-details-form.interface';
import { IFinesMacAccountDetailsForm } from '../fines-mac-account-details/interfaces/fines-mac-account-details-form.interface';
import { IFinesMacContactDetailsForm } from '../fines-mac-contact-details/interfaces/fines-mac-contact-details-form.interface';
import { IFinesMacParentGuardianDetailsForm } from '../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-form.interface';
import { IFinesMacPersonalDetailsForm } from '../fines-mac-personal-details/interfaces/fines-mac-personal-details-form.interface';
import { IFinesMacCompanyDetailsForm } from '../fines-mac-company-details/interfaces/fines-mac-company-details-form.interface';
import { IFinesMacCourtDetailsForm } from '../fines-mac-court-details/interfaces/fines-mac-court-details-form.interface';
import { FINES_MAC_COURT_DETAILS_FORM } from '../fines-mac-court-details/constants/fines-mac-court-details-form';
import { IFinesMacAccountCommentsNotesForm } from '../fines-mac-account-comments-notes/interfaces/fines-mac-account-comments-notes-form.interface';
import { IFinesMacOffenceDetailsForm } from '../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacPaymentTermsForm } from '../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-form.interface';
import { IFinesMacLanguagePreferencesForm } from '../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-form.interface';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { computed, inject } from '@angular/core';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { IFinesMacState } from '../interfaces/fines-mac-state.interface';
import { DateService } from '@services/date-service/date.service';
import { FINES_MAC_STATE } from '../constants/fines-mac-state';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkFormValues(form: { [key: string]: any }): boolean {
  return Object.values(form).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    } else {
      return Boolean(value);
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkFormArrayValues(forms: { [key: string]: any }[]): boolean {
  return forms.every((form) => checkFormValues(form));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFormStatus(form: { [key: string]: any }): string {
  return checkFormValues(form) ? FINES_MAC_STATUS.PROVIDED : FINES_MAC_STATUS.NOT_PROVIDED;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getArrayFormStatus(forms: { [key: string]: any }[]): string {
  return forms.every((form) => getFormStatus(form)) ? FINES_MAC_STATUS.PROVIDED : FINES_MAC_STATUS.NOT_PROVIDED;
}

export const FinesMacStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    employerDetails: FINES_MAC_EMPLOYER_DETAILS_FORM,
    accountDetails: FINES_MAC_ACCOUNT_DETAILS_FORM,
    contactDetails: FINES_MAC_CONTACT_DETAILS_FORM,
    parentGuardianDetails: FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM,
    personalDetails: FINES_MAC_PERSONAL_DETAILS_FORM,
    companyDetails: FINES_MAC_COMPANY_DETAILS_FORM,
    courtDetails: FINES_MAC_COURT_DETAILS_FORM,
    accountCommentsNotes: FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM,
    offenceDetails: FINES_MAC_OFFENCE_DETAILS_FORM,
    paymentTerms: FINES_MAC_PAYMENT_TERMS_FORM,
    languagePreferences: FINES_MAC_LANGUAGE_PREFERENCES_FORM,
    businessUnit: FINES_MAC_BUSINESS_UNIT_STATE,
    unsavedChanges: false,
    stateChanges: false,
    deleteFromCheckAccount: false,
  })),
  withHooks((store) => {
    return {
      onDestroy() {
        patchState(store, FINES_MAC_STATE);
      },
    };
  }),
  withComputed((store) => {
    const dateServiceGetDateFromFormat = inject(DateService).getDateFromFormat;

    return {
      getDefendantType: computed(() => {
        return store.accountDetails().formData.fm_create_account_defendant_type!;
      }),
      getBusinessUnitId: computed(() => {
        return store.businessUnit().business_unit_id;
      }),
      employerDetailsStatus: computed(() => {
        return getFormStatus(store.employerDetails().formData);
      }),
      contactDetailsStatus: computed(() => {
        return getFormStatus(store.contactDetails().formData);
      }),
      parentGuardianDetailsStatus: computed(() => {
        return getFormStatus(store.parentGuardianDetails().formData);
      }),
      personalDetailsStatus: computed(() => {
        return getFormStatus(store.personalDetails().formData);
      }),
      companyDetailsStatus: computed(() => {
        return getFormStatus(store.companyDetails().formData);
      }),
      courtDetailsStatus: computed(() => {
        return getFormStatus(store.courtDetails().formData);
      }),
      accountCommentsNotesStatus: computed(() => {
        return getFormStatus(store.accountCommentsNotes().formData);
      }),
      offenceDetailsStatus: computed(() => {
        return getArrayFormStatus(store.offenceDetails());
      }),
      paymentTermsStatus: computed(() => {
        if (store.paymentTerms().status) {
          return store.paymentTerms().status;
        } else {
          return getFormStatus(store.paymentTerms().formData);
        }
      }),
      adultOrYouthSectionsCompleted: computed(() => {
        const formsToCheck = [
          checkFormValues(store.courtDetails().formData),
          checkFormValues(store.personalDetails().formData),
          checkFormValues(store.paymentTerms().formData),
          checkFormArrayValues(store.offenceDetails()),
        ];
        console.log(formsToCheck);
        return formsToCheck.every(Boolean);
      }),
      parentGuardianSectionsCompleted: computed(() => {
        const formsToCheck = [
          checkFormValues(store.courtDetails().formData),
          checkFormValues(store.parentGuardianDetails().formData),
          checkFormValues(store.personalDetails().formData),
          checkFormValues(store.paymentTerms().formData),
          checkFormArrayValues(store.offenceDetails()),
        ];
        return formsToCheck.every(Boolean);
      }),
      companySectionsCompleted: computed(() => {
        const formsToCheck = [
          checkFormValues(store.courtDetails().formData),
          checkFormValues(store.companyDetails().formData),
          checkFormValues(store.paymentTerms().formData),
          checkFormArrayValues(store.offenceDetails()),
        ];
        return formsToCheck.every(Boolean);
      }),
      getEarliestDateOfSentence: computed(() => {
        return store.offenceDetails().reduce(
          (mostRecent, offence) => {
            const offenceDate = dateServiceGetDateFromFormat(
              offence.formData.fm_offence_details_date_of_sentence!,
              'dd/MM/yyyy',
            );
            return offenceDate && (!mostRecent || offenceDate < mostRecent) ? offenceDate : mostRecent;
          },
          null as Date | null,
        );
      }),
    };
  }),
  withMethods((store) => ({
    setEmployerDetails: (employerDetails: IFinesMacEmployerDetailsForm) => {
      patchState(store, { employerDetails, stateChanges: true, unsavedChanges: false });
    },
    setAccountDetails: (
      accountDetails: IFinesMacAccountDetailsForm,
      businessUnit: IOpalFinesBusinessUnit,
      languagePreferences: IFinesMacLanguagePreferencesForm,
    ) => {
      patchState(store, {
        accountDetails,
        businessUnit,
        languagePreferences,
        stateChanges: true,
        unsavedChanges: false,
      });
    },
    setContactDetails: (contactDetails: IFinesMacContactDetailsForm) => {
      patchState(store, { contactDetails, stateChanges: true, unsavedChanges: false });
    },
    setParentGuardianDetails: (parentGuardianDetails: IFinesMacParentGuardianDetailsForm) => {
      patchState(store, { parentGuardianDetails, stateChanges: true, unsavedChanges: false });
    },
    setPersonalDetails: (personalDetails: IFinesMacPersonalDetailsForm) => {
      patchState(store, { personalDetails, stateChanges: true, unsavedChanges: false });
    },
    setCompanyDetails: (companyDetails: IFinesMacCompanyDetailsForm) => {
      patchState(store, { companyDetails, stateChanges: true, unsavedChanges: false });
    },
    setCourtDetails: (courtDetails: IFinesMacCourtDetailsForm) => {
      patchState(store, { courtDetails, stateChanges: true, unsavedChanges: false });
    },
    setAccountCommentsNotes: (accountCommentsNotes: IFinesMacAccountCommentsNotesForm) => {
      patchState(store, { accountCommentsNotes, stateChanges: true, unsavedChanges: false });
      console.log(store.accountCommentsNotes());
    },
    setOffenceDetails: (offenceDetails: IFinesMacOffenceDetailsForm[]) => {
      patchState(store, { offenceDetails, stateChanges: true, unsavedChanges: false });
    },
    setPaymentTerms: (paymentTerms: IFinesMacPaymentTermsForm) => {
      patchState(store, { paymentTerms, stateChanges: true, unsavedChanges: false });
    },
    setLanguagePreferences: (languagePreferences: IFinesMacLanguagePreferencesForm) => {
      patchState(store, { languagePreferences, stateChanges: true, unsavedChanges: false });
    },
    setBusinessUnit: (businessUnit: IOpalFinesBusinessUnit) => {
      patchState(store, { businessUnit, stateChanges: true, unsavedChanges: false });
    },
    setStateChanges: (stateChanges: boolean) => {
      patchState(store, { stateChanges });
    },
    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, { unsavedChanges });
    },
    setDeleteFromCheckAccount: (deleteFromCheckAccount: boolean) => {
      patchState(store, { deleteFromCheckAccount });
    },
    setBusinessUnitId: (businessUnitId: number) => {
      patchState(store, {
        accountDetails: {
          ...store.accountDetails(),
          formData: { ...store.accountDetails().formData, fm_create_account_business_unit_id: businessUnitId },
        },
      });
    },
    setPaymentTermsStatus: (status: string) => {
      patchState(store, { paymentTerms: { ...store.paymentTerms(), status } });
    },
    resetPaymentTermsDaysInDefault: () => {
      patchState(store, {
        paymentTerms: {
          ...store.paymentTerms(),
          formData: {
            ...store.paymentTerms().formData,
            fm_payment_terms_has_days_in_default: false,
            fm_payment_terms_default_days_in_jail: null,
            fm_payment_terms_suspended_committal_date: null,
          },
        },
      });
    },
    getFinesMacStore: () => {
      const finesMacStore: IFinesMacState = {
        employerDetails: store.employerDetails(),
        accountDetails: store.accountDetails(),
        contactDetails: store.contactDetails(),
        parentGuardianDetails: store.parentGuardianDetails(),
        personalDetails: store.personalDetails(),
        companyDetails: store.companyDetails(),
        courtDetails: store.courtDetails(),
        accountCommentsNotes: store.accountCommentsNotes(),
        offenceDetails: store.offenceDetails(),
        paymentTerms: store.paymentTerms(),
        languagePreferences: store.languagePreferences(),
        businessUnit: store.businessUnit(),
        unsavedChanges: store.unsavedChanges(),
        stateChanges: store.stateChanges(),
        deleteFromCheckAccount: store.deleteFromCheckAccount(),
      };
      return finesMacStore;
    },
    resetFinesMacStore: () => {
      patchState(store, FINES_MAC_STATE);
    },
  })),
);
