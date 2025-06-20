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
import { FINES_MAC_DELETE_ACCOUNT_CONFIRMATION_FORM } from '../fines-mac-delete-account-confirmation/constants/fines-mac-delete-account-confirmation-form';
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
import { FINES_MAC_STATE } from '../constants/fines-mac-state';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_MAC_FIXED_PENALTY_OFFENCE_DETAILS_FORM } from '../fines-mac-fixed-penalty-details/constants/fines-mac-fixed-penalty-offence-details-form';
import { IFinesMacFixedPenaltyOffenceDetailsForm } from '../fines-mac-fixed-penalty-details/interfaces/fines-mac-fixed-penalty-offence-details-form.interface';
import { IFinesMacDeleteAccountConfirmationForm } from '../fines-mac-delete-account-confirmation/interfaces/fines-mac-delete-account-confirmation-form.interface';

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
    fixedPenaltyOffenceDetails: FINES_MAC_FIXED_PENALTY_OFFENCE_DETAILS_FORM,
    unsavedChanges: false,
    stateChanges: false,
    deleteFromCheckAccount: false,
    deleteAccountConfirmation: FINES_MAC_DELETE_ACCOUNT_CONFIRMATION_FORM,
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
    const utilsService = inject(UtilsService);

    return {
      getDefendantType: computed(() => {
        return store.accountDetails().formData.fm_create_account_defendant_type!;
      }),
      getBusinessUnitId: computed(() => {
        return store.businessUnit().business_unit_id;
      }),
      employerDetailsStatus: computed(() => {
        return utilsService.getFormStatus(
          store.employerDetails().formData,
          FINES_MAC_STATUS.PROVIDED,
          FINES_MAC_STATUS.NOT_PROVIDED,
        );
      }),
      contactDetailsStatus: computed(() => {
        return utilsService.getFormStatus(
          store.contactDetails().formData,
          FINES_MAC_STATUS.PROVIDED,
          FINES_MAC_STATUS.NOT_PROVIDED,
        );
      }),
      parentGuardianDetailsStatus: computed(() => {
        return utilsService.getFormStatus(
          store.parentGuardianDetails().formData,
          FINES_MAC_STATUS.PROVIDED,
          FINES_MAC_STATUS.NOT_PROVIDED,
        );
      }),
      personalDetailsStatus: computed(() => {
        return utilsService.getFormStatus(
          store.personalDetails().formData,
          FINES_MAC_STATUS.PROVIDED,
          FINES_MAC_STATUS.NOT_PROVIDED,
        );
      }),
      companyDetailsStatus: computed(() => {
        return utilsService.getFormStatus(
          store.companyDetails().formData,
          FINES_MAC_STATUS.PROVIDED,
          FINES_MAC_STATUS.NOT_PROVIDED,
        );
      }),
      courtDetailsStatus: computed(() => {
        return utilsService.getFormStatus(
          store.courtDetails().formData,
          FINES_MAC_STATUS.PROVIDED,
          FINES_MAC_STATUS.NOT_PROVIDED,
        );
      }),
      accountCommentsNotesStatus: computed(() => {
        return utilsService.getFormStatus(
          [
            store.accountCommentsNotes().formData.fm_account_comments_notes_notes,
            store.accountCommentsNotes().formData.fm_account_comments_notes_comments,
          ],
          FINES_MAC_STATUS.PROVIDED,
          FINES_MAC_STATUS.NOT_PROVIDED,
        );
      }),
      deleteAccountConfirmationStatus: computed(() => {
        return utilsService.getFormStatus(
          store.deleteAccountConfirmation().formData,
          FINES_MAC_STATUS.PROVIDED,
          FINES_MAC_STATUS.NOT_PROVIDED,
        );
      }),
      offenceDetailsStatus: computed(() => {
        return utilsService.getArrayFormStatus(
          store.offenceDetails(),
          FINES_MAC_STATUS.PROVIDED,
          FINES_MAC_STATUS.NOT_PROVIDED,
        );
      }),
      paymentTermsStatus: computed(() => {
        if (store.paymentTerms().status) {
          return store.paymentTerms().status;
        } else {
          return utilsService.getFormStatus(
            store.paymentTerms().formData,
            FINES_MAC_STATUS.PROVIDED,
            FINES_MAC_STATUS.NOT_PROVIDED,
          );
        }
      }),
      fixedPenaltyOffenceDetailsStatus: computed(() => {
        return utilsService.getFormStatus(
          store.fixedPenaltyOffenceDetails().formData,
          FINES_MAC_STATUS.PROVIDED,
          FINES_MAC_STATUS.NOT_PROVIDED,
        );
      }),
      adultOrYouthSectionsCompleted: computed(() => {
        const formsToCheck = [
          utilsService.checkFormValues(store.courtDetails().formData),
          utilsService.checkFormValues(store.personalDetails().formData),
          utilsService.checkFormValues(store.paymentTerms().formData),
          utilsService.checkFormArrayValues(store.offenceDetails()),
        ];
        return formsToCheck.every(Boolean);
      }),
      parentGuardianSectionsCompleted: computed(() => {
        const formsToCheck = [
          utilsService.checkFormValues(store.courtDetails().formData),
          utilsService.checkFormValues(store.parentGuardianDetails().formData),
          utilsService.checkFormValues(store.personalDetails().formData),
          utilsService.checkFormValues(store.paymentTerms().formData),
          utilsService.checkFormArrayValues(store.offenceDetails()),
        ];
        return formsToCheck.every(Boolean);
      }),
      companySectionsCompleted: computed(() => {
        const formsToCheck = [
          utilsService.checkFormValues(store.courtDetails().formData),
          utilsService.checkFormValues(store.companyDetails().formData),
          utilsService.checkFormValues(store.paymentTerms().formData),
          utilsService.checkFormArrayValues(store.offenceDetails()),
        ];
        return formsToCheck.every(Boolean);
      }),
      getEarliestDateOfSentence: computed(() => {
        return store.offenceDetails().reduce(
          (mostRecent, offence) => {
            const offenceDate = offence.formData.fm_offence_details_date_of_sentence
              ? dateServiceGetDateFromFormat(offence.formData.fm_offence_details_date_of_sentence, 'dd/MM/yyyy')
              : null;
            return offenceDate && (!mostRecent || offenceDate < mostRecent) ? offenceDate : mostRecent;
          },
          null as Date | null,
        );
      }),
      getPersonalDetailsName: computed(() => {
        const {
          fm_personal_details_title: title,
          fm_personal_details_forenames: forenames,
          fm_personal_details_surname: surname,
        } = store.personalDetails().formData;

        return `${title} ${forenames} ${utilsService.upperCaseAllLetters(surname!)}`;
      }),
      getCompanyDetailsName: computed(() => {
        return store.companyDetails().formData.fm_company_details_company_name!;
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
    },
    setDeleteAccountConfirmation: (deleteAccountConfirmation: IFinesMacDeleteAccountConfirmationForm) => {
      patchState(store, { deleteAccountConfirmation, stateChanges: true, unsavedChanges: false });
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
    setFixedPenaltyOffenceDetails: (fixedPenaltyOffenceDetails: IFinesMacFixedPenaltyOffenceDetailsForm) => {
      patchState(store, { fixedPenaltyOffenceDetails, stateChanges: true, unsavedChanges: false });
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
    setFinesMacStore: (finesMacState: IFinesMacState) => {
      patchState(store, finesMacState);
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
        deleteAccountConfirmation: store.deleteAccountConfirmation(),
        fixedPenaltyOffenceDetails: store.fixedPenaltyOffenceDetails(),
      };
      return finesMacStore;
    },
    resetFinesMacStore: () => {
      patchState(store, FINES_MAC_STATE);
    },
    resetStateChangesUnsavedChanges: () => {
      patchState(store, { stateChanges: false, unsavedChanges: false });
    },
  })),
);
