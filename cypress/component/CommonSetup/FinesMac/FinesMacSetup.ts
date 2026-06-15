import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider, Type } from '@angular/core';
import { ActivatedRoute, provideRouter, Router, Routes } from '@angular/router';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { mount } from 'cypress/angular';
import { DEFAULT_USER_STATE_DOMAIN } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { FinesComponent } from 'src/app/flows/fines/fines.component';
import { FINES_ACCOUNT_TYPES } from 'src/app/flows/fines/constants/fines-account-types.constant';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { finesRouting } from 'src/app/flows/fines/routing/fines.routes';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { IFinesMacAccountCommentsNotesForm } from 'src/app/flows/fines/fines-mac/fines-mac-account-comments-notes/interfaces/fines-mac-account-comments-notes-form.interface';
import { IFinesMacAccountDetailsForm } from 'src/app/flows/fines/fines-mac/fines-mac-account-details/interfaces/fines-mac-account-details-form.interface';
import { IFinesMacCompanyDetailsForm } from 'src/app/flows/fines/fines-mac/fines-mac-company-details/interfaces/fines-mac-company-details-form.interface';
import { IFinesMacContactDetailsForm } from 'src/app/flows/fines/fines-mac/fines-mac-contact-details/interfaces/fines-mac-contact-details-form.interface';
import { IFinesMacCourtDetailsForm } from 'src/app/flows/fines/fines-mac/fines-mac-court-details/interfaces/fines-mac-court-details-form.interface';
import { IFinesMacDeleteAccountConfirmationForm } from 'src/app/flows/fines/fines-mac/fines-mac-delete-account-confirmation/interfaces/fines-mac-delete-account-confirmation-form.interface';
import { IFinesMacEmployerDetailsForm } from 'src/app/flows/fines/fines-mac/fines-mac-employer-details/interfaces/fines-mac-employer-details-form.interface';
import { IFinesMacFixedPenaltyDetailsStoreForm } from 'src/app/flows/fines/fines-mac/fines-mac-fixed-penalty-details/interfaces/fines-mac-fixed-penalty-details-store-form.interface';
import { IFinesMacLanguagePreferencesForm } from 'src/app/flows/fines/fines-mac/fines-mac-language-preferences/interfaces/fines-mac-language-preferences-form.interface';
import { IFinesMacState } from 'src/app/flows/fines/fines-mac/interfaces/fines-mac-state.interface';
import { IFinesMacOffenceDetailsForm } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacOriginatorTypeForm } from 'src/app/flows/fines/fines-mac/fines-mac-originator-type/interfaces/fines-mac-originator-type-form.interface';
import { IFinesMacParentGuardianDetailsForm } from 'src/app/flows/fines/fines-mac/fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-form.interface';
import { IFinesMacPaymentTermsForm } from 'src/app/flows/fines/fines-mac/fines-mac-payment-terms/interfaces/fines-mac-payment-terms-form.interface';
import { IFinesMacPersonalDetailsForm } from 'src/app/flows/fines/fines-mac/fines-mac-personal-details/interfaces/fines-mac-personal-details-form.interface';
import { IFinesMacAddAccountPayload } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FinesAccPayloadService } from 'src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';

const DEFAULT_FINES_MAC_FEATURE_FLAGS = {
  'release-1a': true,
  'release-1b': true,
  'release-1c-write-off': false,
  'release-1c-enforcement-operational-reporting': false,
};

export interface IFinesMacStoreBuilderOptions {
  accountCommentsNotes?: IFinesMacAccountCommentsNotesForm;
  accountDetails?: IFinesMacAccountDetailsForm;
  accountType?: string | null;
  businessUnit?: IOpalFinesBusinessUnit;
  businessUnitId?: number | null;
  companyDetails?: IFinesMacCompanyDetailsForm;
  contactDetails?: IFinesMacContactDetailsForm;
  courtDetails?: IFinesMacCourtDetailsForm;
  defendantType?: string | null;
  deleteAccountConfirmation?: IFinesMacDeleteAccountConfirmationForm;
  deleteFromCheckAccount?: boolean;
  employerDetails?: IFinesMacEmployerDetailsForm;
  fixedPenaltyDetails?: IFinesMacFixedPenaltyDetailsStoreForm;
  initialState?: IFinesMacState;
  languagePreferences?: IFinesMacLanguagePreferencesForm;
  offenceDetails?: IFinesMacOffenceDetailsForm[];
  parentGuardianDetails?: IFinesMacParentGuardianDetailsForm;
  paymentTerms?: IFinesMacPaymentTermsForm;
  paymentTermsStatus?: string;
  originatorType?: 'NEW' | 'TFO';
  personalDetails?: IFinesMacPersonalDetailsForm;
  stateChanges?: boolean;
  unsavedChanges?: boolean;
}

export interface IFinesMacGlobalStoreBuilderOptions {
  featureFlags?: Partial<typeof DEFAULT_FINES_MAC_FEATURE_FLAGS>;
  globalStoreFactory?: () => InstanceType<typeof GlobalStore>;
  userStateDomain?: string;
}

export interface IFinesMacRouteSetupOptions extends IFinesMacStoreBuilderOptions, IFinesMacGlobalStoreBuilderOptions {
  additionalProviders?: Provider[];
  interceptedRoutes?: string[];
  routerConfig?: Routes;
  targetPath?: string;
}

export interface IFinesMacComponentMountOptions<TState extends IFinesMacState> {
  additionalProviders?: Array<Provider | EnvironmentProviders>;
  component: Type<unknown>;
  componentProperties?: Record<string, unknown>;
  draftState?: IFinesMacAddAccountPayload;
  initialState: TState;
  routeParentPath?: string;
  routeSnapshotData?: Record<string, unknown>;
  setAmend?: boolean;
}

export const buildFinesMacGlobalStore = ({
  featureFlags = {},
  globalStoreFactory,
  userStateDomain = DEFAULT_USER_STATE_DOMAIN,
}: IFinesMacGlobalStoreBuilderOptions = {}): InstanceType<typeof GlobalStore> => {
  const store = globalStoreFactory ? globalStoreFactory() : new GlobalStore();

  store.setUserStateDomain(userStateDomain);
  store.setFeatureFlags({
    ...DEFAULT_FINES_MAC_FEATURE_FLAGS,
    ...featureFlags,
  });

  return store;
};

export const buildFinesMacStore = ({
  accountCommentsNotes,
  accountDetails,
  accountType = FINES_ACCOUNT_TYPES.Fine,
  businessUnit,
  businessUnitId = 77,
  companyDetails,
  contactDetails,
  courtDetails,
  defendantType = 'adultOrYouthOnly',
  deleteAccountConfirmation,
  deleteFromCheckAccount,
  employerDetails,
  fixedPenaltyDetails,
  initialState,
  languagePreferences,
  offenceDetails,
  parentGuardianDetails,
  paymentTerms,
  paymentTermsStatus,
  originatorType = 'NEW',
  personalDetails,
  stateChanges,
  unsavedChanges,
}: IFinesMacStoreBuilderOptions = {}): InstanceType<typeof FinesMacStore> => {
  const store = new FinesMacStore();

  if (initialState) {
    store.setFinesMacStore(structuredClone(initialState));
    return store;
  }

  store.setBusinessUnitId(businessUnitId ?? 77);
  store.businessUnit().business_unit_id = businessUnitId ?? 77;
  store.businessUnit().business_unit_name = 'Test Business Unit';

  const originatorTypeForm: IFinesMacOriginatorTypeForm = {
    formData: {
      fm_originator_type_originator_type: originatorType,
    },
    nestedFlow: false,
  };

  store.setOriginatorType(originatorTypeForm);
  store.accountDetails().formData = {
    ...store.accountDetails().formData,
    fm_create_account_account_type: accountType,
    fm_create_account_business_unit_id: businessUnitId,
    fm_create_account_defendant_type: defendantType,
  };

  if (businessUnit) {
    store.setBusinessUnit(businessUnit);
  }

  if (languagePreferences) {
    store.setLanguagePreferences(languagePreferences);
  }

  if (accountDetails) {
    if (businessUnit && languagePreferences) {
      store.setAccountDetails(accountDetails, businessUnit, languagePreferences);
    } else {
      store.setFinesMacStore({
        ...store.getFinesMacStore(),
        accountDetails,
      });
    }
  }

  if (personalDetails) {
    store.setPersonalDetails(personalDetails);
  }

  if (companyDetails) {
    store.setCompanyDetails(companyDetails);
  }

  if (contactDetails) {
    store.setContactDetails(contactDetails);
  }

  if (courtDetails) {
    store.setCourtDetails(courtDetails);
  }

  if (employerDetails) {
    store.setEmployerDetails(employerDetails);
  }

  if (parentGuardianDetails) {
    store.setParentGuardianDetails(parentGuardianDetails);
  }

  if (offenceDetails) {
    store.setOffenceDetails(offenceDetails);
  }

  if (paymentTerms) {
    store.setPaymentTerms(paymentTerms);
  }

  if (paymentTermsStatus) {
    store.setPaymentTermsStatus(paymentTermsStatus);
  }

  if (accountCommentsNotes) {
    store.setAccountCommentsNotes(accountCommentsNotes);
  }

  if (deleteAccountConfirmation) {
    store.setDeleteAccountConfirmation(deleteAccountConfirmation);
  }

  if (fixedPenaltyDetails) {
    store.setFixedPenaltyDetails(fixedPenaltyDetails);
  }

  if (deleteFromCheckAccount !== undefined) {
    store.setDeleteFromCheckAccount(deleteFromCheckAccount);
  }

  if (stateChanges !== undefined) {
    store.setStateChanges(stateChanges);
  }

  if (unsavedChanges !== undefined) {
    store.setUnsavedChanges(unsavedChanges);
  }

  return store;
};

export const setupFinesMacRouteComponent = ({
  additionalProviders = [],
  interceptedRoutes = [],
  routerConfig = [...finesRouting],
  targetPath = 'fines/dashboard',
  ...storeOptions
}: IFinesMacRouteSetupOptions = {}) => {
  cy.then(() => {
    mount(FinesComponent, {
      providers: [
        provideHttpClient(),
        provideRouter(routerConfig),
        FinesAccPayloadService,
        FinesMacPayloadService,
        OpalFines,
        PermissionsService,
        UtilsService,
        FinesAccountStore,
        DateService,
        { provide: FinesMacStore, useFactory: () => buildFinesMacStore(storeOptions) },
        { provide: GlobalStore, useFactory: () => buildFinesMacGlobalStore(storeOptions) },
        ...additionalProviders,
      ],
    }).then(({ fixture }) => {
      const router = fixture.debugElement.injector.get(Router);
      const originalNavigate = router.navigate.bind(router);

      cy.wrap(router).as('router');
      cy.stub(router, 'navigate')
        .as('routerNavigate')
        .callsFake((commands, extras) => {
          if (Array.isArray(commands) && interceptedRoutes.includes(commands[0])) {
            return Promise.resolve(true);
          }

          return originalNavigate(commands, extras);
        });

      return router.navigateByUrl(targetPath).then((success) => {
        expect(success).to.be.true;
        fixture.detectChanges();
      });
    });
  });
};

export const mountFinesMacComponent = <TState extends IFinesMacState>({
  additionalProviders = [],
  component,
  componentProperties = {},
  draftState,
  initialState,
  routeParentPath = 'manual-account-creation',
  routeSnapshotData = {},
  setAmend = false,
}: IFinesMacComponentMountOptions<TState>) => {
  const finesMacState = structuredClone(initialState);

  return mount(component, {
    providers: [
      UtilsService,
      DateService,
      FinesMacPayloadService,
      ...additionalProviders,
      {
        provide: FinesMacStore,
        useFactory: () => {
          const store = new FinesMacStore();
          store.setFinesMacStore(finesMacState);
          return store;
        },
      },
      {
        provide: FinesDraftStore,
        useFactory: () => {
          const store = new FinesDraftStore();
          store.setAmend(setAmend);

          if (draftState) {
            store.setFinesDraftState(structuredClone(draftState));
          }

          return store;
        },
      },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: routeSnapshotData,
            parent: {
              snapshot: {
                url: [{ path: routeParentPath }],
              },
            },
          },
          parent: {
            snapshot: {
              url: [{ path: routeParentPath }],
            },
          },
        },
      },
    ],
    componentProperties,
  });
};
