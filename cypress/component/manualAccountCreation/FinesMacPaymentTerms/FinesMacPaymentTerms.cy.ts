import { mount } from 'cypress/angular';
import { FinesMacPaymentTermsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-payment-terms/fines-mac-payment-terms.component';
import { ActivatedRoute } from '@angular/router';
import { FINES_PAYMENT_TERMS_MOCK } from './mocks/fines-payment-terms-mock';
import {
  ERROR_MESSAGES,
  LUMPSUM_ERRORS,
  INSTALLMENT_ERRORS,
  ENFORCEMENT_ERRORS,
} from './constants/fines_mac_payment_terms_errors';
import { DOM_ELEMENTS } from './constants/fines_mac_payment_terms_elements';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { PAYMENT_TERMS_SESSION_USER_STATE_MOCK } from './mocks/fines-payment-terms-session-user-mock';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { of } from 'rxjs';

describe('FinesMacPaymentTermsComponent', () => {
  let finesMacState = structuredClone(FINES_PAYMENT_TERMS_MOCK);
  const date = new Date();
  const defendantTypes = ['adultOrYouthOnly', 'pgToPay', 'company'];

  const setupComponent = (
    defendantTypeMock: string | undefined = '',
    mockSetAccountCommentsNote: any | undefined = null,
  ) => {
    mount(FinesMacPaymentTermsComponent, {
      providers: [
        OpalFines,
        PermissionsService,
        GlobalStore,
        {
          provide: GlobalStore,
          useFactory: () => {
            const store = new GlobalStore();
            store.setUserState(PAYMENT_TERMS_SESSION_USER_STATE_MOCK);
            return store;
          },
        },
        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(finesMacState);
            store.setAccountCommentsNotes = mockSetAccountCommentsNote;
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
      componentProperties: {
        defendantType: defendantTypeMock,
      },
    });
  };

  afterEach(() => {
    cy.then(() => {
      finesMacState.paymentTerms.formData = {
        fm_payment_terms_payment_terms: '',
        fm_payment_terms_pay_by_date: '',
        fm_payment_terms_lump_sum_amount: null,
        fm_payment_terms_instalment_amount: null,
        fm_payment_terms_instalment_period: '',
        fm_payment_terms_start_date: '',
        fm_payment_terms_payment_card_request: null,
        fm_payment_terms_has_days_in_default: null,
        fm_payment_terms_suspended_committal_date: '',
        fm_payment_terms_default_days_in_jail: null,
        fm_payment_terms_add_enforcement_action: null,
        fm_payment_terms_hold_enforcement_on_account: null,
        fm_payment_terms_reason_account_is_on_noenf: '',
        fm_payment_terms_earliest_release_date: '',
        fm_payment_terms_prison_and_prison_number: '',
        fm_payment_terms_enforcement_action: '',
        fm_payment_terms_collection_order_made: null,
        fm_payment_terms_collection_order_date: '',
        fm_payment_terms_collection_order_made_today: null,
      };
    });
  });

  it('(AC.1) should render the component', { tags: ['@PO-566'] }, () => {
    setupComponent('adultOrYouthOnly');
    cy.get(DOM_ELEMENTS['finesMacPaymentTermsForm']).should('exist');
  });
  //Dom-Elements check for each defendant type

  it(
    '(AC.1,AC.3,AC.4,)should load all elements on the screen correctly for adult or youth defendant types',
    { tags: ['@PO-566', '@PO-429', '@PO-471', '@PO-272'] },
    () => {
      setupComponent('adultOrYouthOnly');

      cy.get(DOM_ELEMENTS.pageTitle).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('exist');
      cy.get(DOM_ELEMENTS.payInFullLabel).should('exist');
      cy.get(DOM_ELEMENTS.instalmentsOnlyLabel).should('exist');
      cy.get(DOM_ELEMENTS.lumpSumPlusInstalmentsLabel).should('exist');
      cy.get(DOM_ELEMENTS.addEnforcementActionLabel).should('exist');
      cy.get(DOM_ELEMENTS.payInFull).should('exist');
      cy.get(DOM_ELEMENTS.instalmentsOnly).should('exist');
      cy.get(DOM_ELEMENTS.lumpSumPlusInstalments).should('exist');
      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.addEnforcementAction).should('exist');
      // pay in full
      cy.get(DOM_ELEMENTS.payInFull).click();
      cy.get(DOM_ELEMENTS.payByDateLabel).should('contain', 'Enter pay by date');
      cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
      cy.get(DOM_ELEMENTS.payByDate).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).click();
      cy.get(DOM_ELEMENTS.datePickerPayByDateElement).should('exist');
      cy.get(DOM_ELEMENTS.datePickerSubmitButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerCancelButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');

      // instalments only
      cy.get(DOM_ELEMENTS.instalmentsOnly).click();
      cy.get(DOM_ELEMENTS.instalmentAmountLabel).should('contain', 'Instalment');
      cy.get(DOM_ELEMENTS.instalmentAmount).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('contain', 'Frequency');
      cy.get(DOM_ELEMENTS.frequencyWeeklyLabel).should('contain', 'Weekly');
      cy.get(DOM_ELEMENTS.frequencyFortnightlyLabel).should('contain', 'Fortnightly');
      cy.get(DOM_ELEMENTS.frequencyMonthlyLabel).should('contain', 'Monthly');
      cy.get(DOM_ELEMENTS.frequencyFortnightly).should('exist');
      cy.get(DOM_ELEMENTS.frequencyMonthly).should('exist');
      cy.get(DOM_ELEMENTS.frequencyWeekly).should('exist');
      cy.get(DOM_ELEMENTS.startDate).should('exist');
      cy.get(DOM_ELEMENTS.startDateLabel).should('contain', 'Start date');
      cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
      cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).click();
      cy.get(DOM_ELEMENTS.datePickerStartDateElement).should('exist');
      cy.get(DOM_ELEMENTS.datePickerSubmitButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerCancelButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');

      //lump plus instalments

      cy.get(DOM_ELEMENTS.lumpSumPlusInstalments).click();
      cy.get(DOM_ELEMENTS.lumpSumAmountLabel).should('contain', 'Lump sum');
      cy.get(DOM_ELEMENTS.lumpSumAmount).should('exist');
      cy.get(DOM_ELEMENTS.instalmentAmountLabel).should('contain', 'Instalment');
      cy.get(DOM_ELEMENTS.instalmentAmount).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('contain', 'Frequency');
      cy.get(DOM_ELEMENTS.frequencyWeeklyLabel).should('contain', 'Weekly');
      cy.get(DOM_ELEMENTS.frequencyFortnightlyLabel).should('contain', 'Fortnightly');
      cy.get(DOM_ELEMENTS.frequencyMonthlyLabel).should('contain', 'Monthly');
      cy.get(DOM_ELEMENTS.frequencyFortnightly).should('exist');
      cy.get(DOM_ELEMENTS.frequencyMonthly).should('exist');
      cy.get(DOM_ELEMENTS.frequencyWeekly).should('exist');
      cy.get(DOM_ELEMENTS.startDate).should('exist');
      cy.get(DOM_ELEMENTS.startDateLabel).should('contain', 'Start date');
      cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
      cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).click();
      cy.get(DOM_ELEMENTS.datePickerStartDateElement).should('exist');
      cy.get(DOM_ELEMENTS.datePickerSubmitButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerCancelButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');

      // enforcement action PRIS

      cy.get(DOM_ELEMENTS.addEnforcementAction).click();
      cy.get(DOM_ELEMENTS.prisLabel).should('exist');
      cy.get(DOM_ELEMENTS.pris).should('exist');
      cy.get(DOM_ELEMENTS.pris).click();
      cy.get(DOM_ELEMENTS.earliestReleaseDateLabel).should('contain', 'Earliest release date (EDR)');
      cy.get(DOM_ELEMENTS.earliestReleaseDate).should('exist');
      cy.get(DOM_ELEMENTS.prisonAndPrisonNumberLabel).should('contain', 'Prison and prison number');
      cy.get(DOM_ELEMENTS.prisonAndPrisonNumber).should('exist');
      cy.get(DOM_ELEMENTS.prisHint).should('contain', 'Held as enforcement comment');
      cy.get(DOM_ELEMENTS.prisCharHint).should('contain', 'You have 28 characters remaining');

      // enforcement action NOENF

      cy.get(DOM_ELEMENTS.noenfLabel).should('exist');
      cy.get(DOM_ELEMENTS.noenf).should('exist');
      cy.get(DOM_ELEMENTS.noenf).click();
      cy.get(DOM_ELEMENTS.reasonAccountIsOnNoenfLabel).should('contain', 'Reason account is on NOENF');
      cy.get(DOM_ELEMENTS.reasonAccountIsOnNoenf).should('exist');
      cy.get(DOM_ELEMENTS.noenfCharHint).should('contain', 'You have 28 characters remaining');

      // collection order
      cy.get(DOM_ELEMENTS.collectionOrderMadeTrue).should('exist');
      cy.get(DOM_ELEMENTS.collectionNo).should('exist');
      cy.get(DOM_ELEMENTS.collectionYes).should('exist');
      cy.get(DOM_ELEMENTS.collectionYesLabel).should('contain', 'Yes');
      cy.get(DOM_ELEMENTS.collectionNoLabel).should('contain', 'No');
      cy.get(DOM_ELEMENTS.collectionOrderMadeTrue).click();
      cy.get(DOM_ELEMENTS.collectionOrderDate).should('exist');
      cy.get(DOM_ELEMENTS.collectionOrderDateLabel).should('contain', 'Date of collection order');
      cy.get(DOM_ELEMENTS.collectionOrderHint).should('contain', 'For example, 31/01/2023');
    },
  );

  it(
    '(AC.1,AC.3,AC.4)Should load all elements on the screen correctly for AYPG defendant types',
    { tags: ['@PO-566', '@PO-587', '@PO-649', '@PO-344'] },
    () => {
      setupComponent('pgToPay');

      cy.get(DOM_ELEMENTS.pageTitle).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('exist');
      cy.get(DOM_ELEMENTS.payInFullLabel).should('exist');
      cy.get(DOM_ELEMENTS.instalmentsOnlyLabel).should('exist');
      cy.get(DOM_ELEMENTS.lumpSumPlusInstalmentsLabel).should('exist');
      cy.get(DOM_ELEMENTS.addEnforcementActionLabel).should('exist');
      cy.get(DOM_ELEMENTS.payInFull).should('exist');
      cy.get(DOM_ELEMENTS.instalmentsOnly).should('exist');
      cy.get(DOM_ELEMENTS.lumpSumPlusInstalments).should('exist');
      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.addEnforcementAction).should('exist');
      // pay in full
      cy.get(DOM_ELEMENTS.payInFull).click();
      cy.get(DOM_ELEMENTS.payByDateLabel).should('contain', 'Enter pay by date');
      cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
      cy.get(DOM_ELEMENTS.payByDate).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).click();
      cy.get(DOM_ELEMENTS.datePickerPayByDateElement).should('exist');
      cy.get(DOM_ELEMENTS.datePickerSubmitButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerCancelButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');

      // instalments only
      cy.get(DOM_ELEMENTS.instalmentsOnly).click();
      cy.get(DOM_ELEMENTS.instalmentAmountLabel).should('contain', 'Instalment');
      cy.get(DOM_ELEMENTS.instalmentAmount).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('contain', 'Frequency');
      cy.get(DOM_ELEMENTS.frequencyWeeklyLabel).should('contain', 'Weekly');
      cy.get(DOM_ELEMENTS.frequencyFortnightlyLabel).should('contain', 'Fortnightly');
      cy.get(DOM_ELEMENTS.frequencyMonthlyLabel).should('contain', 'Monthly');
      cy.get(DOM_ELEMENTS.frequencyFortnightly).should('exist');
      cy.get(DOM_ELEMENTS.frequencyMonthly).should('exist');
      cy.get(DOM_ELEMENTS.frequencyWeekly).should('exist');
      cy.get(DOM_ELEMENTS.startDate).should('exist');
      cy.get(DOM_ELEMENTS.startDateLabel).should('contain', 'Start date');
      cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
      cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).click();
      cy.get(DOM_ELEMENTS.datePickerStartDateElement).should('exist');
      cy.get(DOM_ELEMENTS.datePickerSubmitButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerCancelButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');

      //lump plus instalments

      cy.get(DOM_ELEMENTS.lumpSumPlusInstalments).click();
      cy.get(DOM_ELEMENTS.lumpSumAmountLabel).should('contain', 'Lump sum');
      cy.get(DOM_ELEMENTS.lumpSumAmount).should('exist');
      cy.get(DOM_ELEMENTS.instalmentAmountLabel).should('contain', 'Instalment');
      cy.get(DOM_ELEMENTS.instalmentAmount).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('contain', 'Frequency');
      cy.get(DOM_ELEMENTS.frequencyWeeklyLabel).should('contain', 'Weekly');
      cy.get(DOM_ELEMENTS.frequencyFortnightlyLabel).should('contain', 'Fortnightly');
      cy.get(DOM_ELEMENTS.frequencyMonthlyLabel).should('contain', 'Monthly');
      cy.get(DOM_ELEMENTS.frequencyFortnightly).should('exist');
      cy.get(DOM_ELEMENTS.frequencyMonthly).should('exist');
      cy.get(DOM_ELEMENTS.frequencyWeekly).should('exist');
      cy.get(DOM_ELEMENTS.startDate).should('exist');
      cy.get(DOM_ELEMENTS.startDateLabel).should('contain', 'Start date');
      cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
      cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).click();
      cy.get(DOM_ELEMENTS.datePickerStartDateElement).should('exist');
      cy.get(DOM_ELEMENTS.datePickerSubmitButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerCancelButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');

      // collection order
      cy.get(DOM_ELEMENTS.collectionOrderMadeTrue).should('exist');
      cy.get(DOM_ELEMENTS.collectionNo).should('exist');
      cy.get(DOM_ELEMENTS.collectionYes).should('exist');
      cy.get(DOM_ELEMENTS.collectionYesLabel).should('contain', 'Yes');
      cy.get(DOM_ELEMENTS.collectionNoLabel).should('contain', 'No');
      cy.get(DOM_ELEMENTS.collectionOrderMadeTrue).click();
      cy.get(DOM_ELEMENTS.collectionOrderDate).should('exist');
      cy.get(DOM_ELEMENTS.collectionOrderDateLabel).should('contain', 'Date of collection order');
      cy.get(DOM_ELEMENTS.collectionOrderHint).should('contain', 'For example, 31/01/2023');
    },
  );

  it(
    '(AC.1,AC.3,AC.4)Should load all elements for company defendant type',
    { tags: ['@PO-566', '@PO-592', '@PO-345'] },
    () => {
      setupComponent('company');

      cy.get(DOM_ELEMENTS.pageTitle).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('exist');
      cy.get(DOM_ELEMENTS.payInFullLabel).should('exist');
      cy.get(DOM_ELEMENTS.instalmentsOnlyLabel).should('exist');
      cy.get(DOM_ELEMENTS.lumpSumPlusInstalmentsLabel).should('exist');
      cy.get(DOM_ELEMENTS.payInFull).should('exist');
      cy.get(DOM_ELEMENTS.instalmentsOnly).should('exist');
      cy.get(DOM_ELEMENTS.lumpSumPlusInstalments).should('exist');
      cy.get(DOM_ELEMENTS.submitButton).should('exist');

      // pay in full
      cy.get(DOM_ELEMENTS.payInFull).click();
      cy.get(DOM_ELEMENTS.payByDateLabel).should('contain', 'Enter pay by date');
      cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
      cy.get(DOM_ELEMENTS.payByDate).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).click();
      cy.get(DOM_ELEMENTS.datePickerPayByDateElement).should('exist');
      cy.get(DOM_ELEMENTS.datePickerSubmitButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerCancelButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');

      // instalments only
      cy.get(DOM_ELEMENTS.instalmentsOnly).click();
      cy.get(DOM_ELEMENTS.instalmentAmountLabel).should('contain', 'Instalment');
      cy.get(DOM_ELEMENTS.instalmentAmount).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('contain', 'Frequency');
      cy.get(DOM_ELEMENTS.frequencyWeeklyLabel).should('contain', 'Weekly');
      cy.get(DOM_ELEMENTS.frequencyFortnightlyLabel).should('contain', 'Fortnightly');
      cy.get(DOM_ELEMENTS.frequencyMonthlyLabel).should('contain', 'Monthly');
      cy.get(DOM_ELEMENTS.frequencyFortnightly).should('exist');
      cy.get(DOM_ELEMENTS.frequencyMonthly).should('exist');
      cy.get(DOM_ELEMENTS.frequencyWeekly).should('exist');
      cy.get(DOM_ELEMENTS.startDate).should('exist');
      cy.get(DOM_ELEMENTS.startDateLabel).should('contain', 'Start date');
      cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
      cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).click();
      cy.get(DOM_ELEMENTS.datePickerStartDateElement).should('exist');
      cy.get(DOM_ELEMENTS.datePickerSubmitButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerCancelButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');

      //lump plus instalments

      cy.get(DOM_ELEMENTS.lumpSumPlusInstalments).click();
      cy.get(DOM_ELEMENTS.lumpSumAmountLabel).should('contain', 'Lump sum');
      cy.get(DOM_ELEMENTS.lumpSumAmount).should('exist');
      cy.get(DOM_ELEMENTS.instalmentAmountLabel).should('contain', 'Instalment');
      cy.get(DOM_ELEMENTS.instalmentAmount).should('exist');
      cy.get(DOM_ELEMENTS.legend).should('contain', 'Frequency');
      cy.get(DOM_ELEMENTS.frequencyWeeklyLabel).should('contain', 'Weekly');
      cy.get(DOM_ELEMENTS.frequencyFortnightlyLabel).should('contain', 'Fortnightly');
      cy.get(DOM_ELEMENTS.frequencyMonthlyLabel).should('contain', 'Monthly');
      cy.get(DOM_ELEMENTS.frequencyFortnightly).should('exist');
      cy.get(DOM_ELEMENTS.frequencyMonthly).should('exist');
      cy.get(DOM_ELEMENTS.frequencyWeekly).should('exist');
      cy.get(DOM_ELEMENTS.startDate).should('exist');
      cy.get(DOM_ELEMENTS.startDateLabel).should('contain', 'Start date');
      cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
      cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).click();
      cy.get(DOM_ELEMENTS.datePickerStartDateElement).should('exist');
      cy.get(DOM_ELEMENTS.datePickerSubmitButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerCancelButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');
    },
  );
  //Collection order tests
  it('(AC.1) should only load collection order for adult over 18 years old', { tags: ['@PO-471', '@PO-272'] }, () => {
    setupComponent('adultOrYouthOnly');

    finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
    cy.get(DOM_ELEMENTS.collectionOrderMadeTrue).should('exist');
    cy.get(DOM_ELEMENTS.collectionNo).should('exist');
    cy.get(DOM_ELEMENTS.collectionYes).should('exist');
    cy.get(DOM_ELEMENTS.collectionYesLabel).should('contain', 'Yes');
    cy.get(DOM_ELEMENTS.collectionNoLabel).should('contain', 'No');
  });

  it(
    '(AC.3) Should load make a new collection order for correct permission for AYPG and AY',
    { tags: ['@PO-471', '@PO-649', '@PO-272', '@PO-344'] },
    () => {
      finesMacState.accountDetails.formData.fm_create_account_business_unit_id = 17;
      finesMacState.businessUnit.business_unit_id = 17;
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);
          cy.get(DOM_ELEMENTS.collectionNo).click();
          cy.get(DOM_ELEMENTS.makeCollection).should('exist');
          cy.get(DOM_ELEMENTS.makeCollectionLabel).should('contain', 'Make collection order today');
        });
      }
    },
  );

  it(
    '(AC.1) should not load collection order for adult or youth under 18 years old',
    { tags: ['@PO-471', '@PO-272'] },
    () => {
      setupComponent('adultOrYouthOnly');

      finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2020';
      cy.get(DOM_ELEMENTS.collectionNo).should('not.exist');
      cy.get(DOM_ELEMENTS.collectionYes).should('not.exist');
    },
  );
  //collection order validation check
  it(
    '(AC.1, AC.2)should prefill date of sentence in date of collection order field',
    { tags: ['@PO-853', '@PO-272', '@PO-344'] },
    () => {
      finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);
          cy.get(DOM_ELEMENTS.collectionYes).click();
          cy.get(DOM_ELEMENTS.collectionOrderDate).should('have.value', '01/10/2022');
        });
      }
    },
  );

  it(
    '(AC.1)should have error handling with date of sentence and collection order date to ensure date cannot be before date of sentence',
    { tags: ['@PO-796', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);
          cy.get(DOM_ELEMENTS.collectionYes).click();
          cy.get(DOM_ELEMENTS.collectionOrderDate).clear();
          cy.get(DOM_ELEMENTS.collectionOrderDate).type('01/02/2004', { delay: 0 });
          cy.get(DOM_ELEMENTS.submitButton).first().click();
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.collectionDatePast);
        });
      }
    },
  );

  it(
    '(AC.4)should throw error if no collection order field is selected and user presses submit or return',
    { tags: ['@PO-471', '@PO-649', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          cy.get(DOM_ELEMENTS.submitButton).first().click();
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.collectionError);
        });
      }
    },
  );

  it(
    '(AC.5)If a yser selects yes to collection order and does not enter a date, an error should be thrown',
    { tags: ['@PO-471', '@PO-649', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          cy.get(DOM_ELEMENTS.collectionYes).click();
          cy.get(DOM_ELEMENTS.collectionOrderDate).clear();
          cy.get(DOM_ELEMENTS.submitButton).first().click();
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.collectionDateError);
        });
      }
    },
  );

  it(
    '(AC.6)Should throw error for collection date validation',
    { tags: ['@PO-471', '@PO-649', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          cy.get(DOM_ELEMENTS.collectionYes).click();
          cy.get(DOM_ELEMENTS.collectionOrderDate).clear();
          cy.get(DOM_ELEMENTS.collectionOrderDate).type('32/01/2022', { delay: 0 });
          cy.get(DOM_ELEMENTS.submitButton).first().click();
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validDate);

          cy.get(DOM_ELEMENTS.collectionOrderDate).clear();
          cy.get(DOM_ELEMENTS.collectionOrderDate).type('01.13.2022', { delay: 0 });
          cy.get(DOM_ELEMENTS.submitButton).first().click();
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.collectionDateFormat);

          cy.get(DOM_ELEMENTS.collectionOrderDate).clear();
          cy.get(DOM_ELEMENTS.collectionOrderDate).type('20/11/2060', { delay: 0 });
          cy.get(DOM_ELEMENTS.submitButton).first().click();
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.collectionDateFuture);

          cy.get(DOM_ELEMENTS.collectionOrderDate).clear();
          cy.get(DOM_ELEMENTS.collectionOrderDate).type('01/11/2001', { delay: 0 });
          cy.get(DOM_ELEMENTS.submitButton).first().click();
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.collectionDatePast);
        });
      }
    },
  );

  //Checking pay by date, installment option and lump sum flow checks and error handling
  it(
    '(AC.2a) should allow payByDate to be entered via date picker for all defendant types',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        setupComponent(defendantType);

        cy.get(DOM_ELEMENTS.payInFull).click();
        cy.get(DOM_ELEMENTS.datePickerButton).click();
        cy.get(DOM_ELEMENTS.datePickerPayByDateElement).should('exist');
        cy.get(DOM_ELEMENTS.testDate).click();
        cy.get(DOM_ELEMENTS.payByDate).should(
          'have.value',
          `${date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
        );
      });
    },
  );

  it(
    '(AC.3c) should allow startDate to be entered via date picker for all defendant types',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        setupComponent(defendantType);

        cy.get(DOM_ELEMENTS.instalmentsOnly).click();
        cy.get(DOM_ELEMENTS.datePickerButton).click();
        cy.get(DOM_ELEMENTS.datePickerStartDateElement).should('exist');
        cy.get(DOM_ELEMENTS.testDate).click();
        cy.get(DOM_ELEMENTS.startDate).should(
          'have.value',
          `${date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
        );
      });
    },
  );

  it(
    '(AC.16a) should load button for next page for adultOrYouthOnly Defendant',
    { tags: ['@PO-429', '@PO-272'] },
    () => {
      setupComponent('adultOrYouthOnly');

      cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add account comments and notes');
    },
  );

  it('(AC.16a) should load button for next page for AYPG Defendant', { tags: ['@PO-429', '@PO-344'] }, () => {
    setupComponent('pgToPay');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add account comments and notes');
  });

  it('(AC.17a) should load button for next page for Company Defendant', { tags: ['@PO-592', '@PO-345'] }, () => {
    setupComponent('company');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Add account comments and notes');
  });

  it(
    '(AC.3ci))should handle "Pay in full" with past dates',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
          finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2022';
          cy.get(DOM_ELEMENTS.mojTicketPanel).should('contain', ERROR_MESSAGES.dateInPast);
        });
      });
    },
  );

  it(
    '(AC.3cii)should handle "Pay in full" with future dates',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
          finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2033';
          cy.get(DOM_ELEMENTS.mojTicketPanel).should('contain', ERROR_MESSAGES.dateInFuture);
        });
      });
    },
  );

  it(
    '(AC.4ci) should handle "Instalments only" with past dates',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
          finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = 1000;
          finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/01/2022';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.mojTicketPanel).should('contain', ERROR_MESSAGES.startDateInPast);
        });
      });
    },
  );

  it(
    '(AC.4cii) should handle "Instalments only" with future dates',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
          finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = 1000;
          finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/01/2030';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.mojTicketPanel).should('contain', ERROR_MESSAGES.startDateInFuture);
        });
      });
    },
  );

  it(
    '(AC.3Ci) should handle "Lump sum plus instalments" with past dates',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
          finesMacState.paymentTerms.formData.fm_payment_terms_lump_sum_amount = 500;
          finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = 1000;
          finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/01/2022';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.mojTicketPanel).should('contain', ERROR_MESSAGES.startDateInPast);
        });
      });
    },
  );

  it(
    '(AC.3Cii) should handle "Lump sum plus instalments" with future dates',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
          finesMacState.paymentTerms.formData.fm_payment_terms_lump_sum_amount = 500;
          finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = 1000;
          finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/01/2030';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.mojTicketPanel).should('contain', ERROR_MESSAGES.startDateInFuture);
        });
      });
    },
  );

  it(
    '(AC.7,AC.8)should handle empty data for Pay by date',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.paymentTerms);

          cy.get(DOM_ELEMENTS.payInFull).first().click();
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.payByDate);
          cy.get(DOM_ELEMENTS.payInFull).first().click();
        });
      });
    },
  );

  it(
    '(AC.5)should round lumpsum amount and instalment amount to .2 decimal place values',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          cy.get(DOM_ELEMENTS.lumpSumPlusInstalments).click();
          cy.get(DOM_ELEMENTS.lumpSumAmount).type('100.5', { delay: 0 });
          cy.get(DOM_ELEMENTS.instalmentAmount).type('100.5', { delay: 0 });
          cy.get(DOM_ELEMENTS.submitButton).first().click();

          cy.get(DOM_ELEMENTS.lumpSumAmount).should('have.value', '100.50');
          cy.get(DOM_ELEMENTS.instalmentAmount).should('have.value', '100.50');
        });
      });
    },
  );

  it(
    '(AC.11)should handle date Format error for pay in full',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
          finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01,01.2022';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validDateFormat);
        });
      });
    },
  );

  it(
    '(AC.11)should handle valid date Error for Pay in full',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
          finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '32/01/2022';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validDate);
        });
      });
    },
  );

  it('(AC.9)should handle errors for Installment', { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] }, () => {
    defendantTypes.forEach((defendantType) => {
      cy.then(() => {
        setupComponent(defendantType);

        cy.get(DOM_ELEMENTS.instalmentsOnly).click({ multiple: true });

        cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });

        for (const [, value] of Object.entries(INSTALLMENT_ERRORS)) {
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', value);
        }
      });
    });
  });

  it(
    '(AC.13)should handle valid instalmentAmount error for installment',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
          finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = -1;
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validInstalmentAmount);
        });
      });
    },
  );

  it(
    '(AC.12) should handle valid InstalmentDateFormat error for installment',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
          finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '01/21/12212';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validInstalmentDateFormat);
        });
      });
    },
  );

  it(
    '(AC.12) should handle valid date error for installment',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'instalmentsOnly';
          finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '32/09/2025';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validDate);
        });
      });
    },
  );

  it(
    '(AC.10)should handle errors for Lump sum plus Installment',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          cy.get(DOM_ELEMENTS.lumpSumPlusInstalments).click({ multiple: true });
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });

          for (const [, value] of Object.entries(LUMPSUM_ERRORS)) {
            cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', value);
          }
        });
      });
    },
  );

  it(
    '(AC.14) should have validations in place for validLumpSumAmount',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
          finesMacState.paymentTerms.formData.fm_payment_terms_lump_sum_amount = -1;
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validLumpSumAmount);
        });
      });
    },
  );

  it(
    '(AC.14) should have validations in place for validLumpSuminstallmentAmount',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
          finesMacState.paymentTerms.formData.fm_payment_terms_instalment_amount = -1;
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validInstalmentAmount);
        });
      });
    },
  );

  it(
    '(AC.12) should have validations in place for validLumpSumStartDateFormat',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
          finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '32/09/202555';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validInstalmentDateFormat);
        });
      });
    },
  );

  it(
    '(AC.12) should have validations in place for validLumpSumStartDate',
    { tags: ['@PO-587', '@PO-429', '@PO-592', '@PO-545'] },
    () => {
      defendantTypes.forEach((defendantType) => {
        cy.then(() => {
          setupComponent(defendantType);

          finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'lumpSumPlusInstalments';
          finesMacState.paymentTerms.formData.fm_payment_terms_start_date = '32/09/2025';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.validDate);
        });
      });
    },
  );

  //Days in default tests
  it(
    '(AC.1,AC.2,AC.3) should load days in default for adult or youth over 18 only',
    { tags: ['@PO-432', '@PO-272'] },
    () => {
      setupComponent('adultOrYouthOnly');
      finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';

      cy.get(DOM_ELEMENTS.hasDaysInDefault).should('exist');
      cy.get(DOM_ELEMENTS.hasDaysInDefault).click();
      cy.get(DOM_ELEMENTS.hasDaysInDefault).should('be.checked');
      cy.get(DOM_ELEMENTS.hasDaysInDefaultLabel).should('contain', 'There are days in default');
      cy.get(DOM_ELEMENTS.suspendedCommittalDate).should('exist');
      cy.get(DOM_ELEMENTS.defaultDaysInJail).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
      cy.get(DOM_ELEMENTS.suspendedCommittalDateLabel).should('contain', 'Date days in default were imposed');
      cy.get(DOM_ELEMENTS.dateHint).should(
        'contain',
        'This should be whichever date is most recent - the sentencing date or the date of the suspended committal order.',
      );
      cy.get(DOM_ELEMENTS.defaultDaysInJailLabel).should('contain', 'Enter days in default');
    },
  );

  it(
    '(AC.1) should not load days in default for adult or youth under 18 years old',
    { tags: ['@PO-432', '@PO-588', '@PO-272'] },
    () => {
      setupComponent('adultOrYouthOnly');

      finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2010';
      cy.get(DOM_ELEMENTS.hasDaysInDefault).should('not.exist');
    },
  );

  it(
    '(AC.4) Validation check to ensure only 5 integers can be inputed to the days in default field Adult or youth, AYPG',
    { tags: ['@PO-432', '@PO-588', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
          cy.get(DOM_ELEMENTS.hasDaysInDefault).click();
          cy.get(DOM_ELEMENTS.defaultDaysInJail).type('123456', { delay: 0 });
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.daysInDefaultLength);
        });
      }
    },
  );

  it(
    '(AC.10a,AC.10c) should have validations in place for days in default enter valid data Adult or youth ,AYPG',
    { tags: ['@PO-432', '@PO-588', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          finesMacState.paymentTerms.formData.fm_payment_terms_has_days_in_default = true;
          finesMacState.paymentTerms.formData.fm_payment_terms_suspended_committal_date = '32/09/2025';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage)
            .should('contain', ERROR_MESSAGES.validDate)
            .should('contain', ERROR_MESSAGES.defaultDays);
        });
      }
    },
  );

  it(
    '(AC.10b) should have validations in place for days in default future date Adult or youth ,AYPG',
    { tags: ['@PO-432', '@PO-588', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          finesMacState.paymentTerms.formData.fm_payment_terms_has_days_in_default = true;
          finesMacState.paymentTerms.formData.fm_payment_terms_suspended_committal_date = '20/09/2200';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.futureDate);
        });
      }
    },
  );
  it(
    '(AC.5,AC.6)should have all elements in the calculate days in default panel for AYPG, Adult or Youth Only and calculate days accurately',
    { tags: ['@PO-432', '@PO-588', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          cy.get(DOM_ELEMENTS.hasDaysInDefault).click();
          cy.get(DOM_ELEMENTS.suspendedCommittalDate).type('01/01/2022', { delay: 0 });
          cy.get(DOM_ELEMENTS.defaultDaysInJail).type('10', { delay: 0 });
          cy.get(DOM_ELEMENTS.caculateLink).first().click();
          cy.get(DOM_ELEMENTS.panel).should('exist');
          cy.get(DOM_ELEMENTS.caculateHeading).should('contain', 'Calculate days in default');
          cy.get(DOM_ELEMENTS.days).should('exist');
          cy.get(DOM_ELEMENTS.weeks).should('exist');
          cy.get(DOM_ELEMENTS.months).should('exist');
          cy.get(DOM_ELEMENTS.years).should('exist');
          cy.get(DOM_ELEMENTS.daysLabel).should('contain', 'Days');
          cy.get(DOM_ELEMENTS.weeksLabel).should('contain', 'Weeks');
          cy.get(DOM_ELEMENTS.monthsLabel).should('contain', 'Months');
          cy.get(DOM_ELEMENTS.yearsLabel).should('contain', 'Years');

          cy.get(DOM_ELEMENTS.days).type('10', { delay: 0 });
          cy.get(DOM_ELEMENTS.weeks).type('1', { delay: 0 });
          cy.get(DOM_ELEMENTS.months).type('1', { delay: 0 });
          cy.get(DOM_ELEMENTS.years).type('1', { delay: 0 });

          cy.get(DOM_ELEMENTS.calculatedDays).should('contain', '413 days');
        });
      }
    },
  );

  it(
    '(AC.7) should not allow the user to calculate days until date has been filled out for days in default, AYPG, Adult or Youth Only',
    { tags: ['@PO-432', '@PO-588', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          cy.get(DOM_ELEMENTS.hasDaysInDefault).click();
          cy.get(DOM_ELEMENTS.caculateLink).first().click();
          cy.get(DOM_ELEMENTS.calculatedDays).should('contain', 'Cannot calculate total time in days');
          cy.get(DOM_ELEMENTS.calculatedDays).should('contain', 'You must enter a date days in default were imposed');

          setupComponent('pgToPay');
          cy.get(DOM_ELEMENTS.calculatedDays).should('contain', 'Cannot calculate total time in days');
          cy.get(DOM_ELEMENTS.calculatedDays).should('contain', 'You must enter a date days in default were imposed');
        });
      }
    },
  );

  it(
    '(AC.10d) should have validations in place for days in default invalid date date Adult or youth ,AYPG',
    { tags: ['@PO-432', '@PO-588', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        setupComponent(defendantTypes[i]);

        finesMacState.paymentTerms.formData.fm_payment_terms_has_days_in_default = true;
        finesMacState.paymentTerms.formData.fm_payment_terms_default_days_in_jail = -1;
        cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
        cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.defaultDaysTypeCheck);
      }
    },
  );
  //Enforcement action tests

  it(
    '(AC.1,AC.2,AC.3)should load enforcement action PRIS and NOENF for Adult or youth and APYG',
    { tags: ['@PO-548', '@PO-590', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          cy.get(DOM_ELEMENTS.addEnforcementAction).click();
          cy.get(DOM_ELEMENTS.prisLabel).should('exist');
          cy.get(DOM_ELEMENTS.pris).should('exist');
          cy.get(DOM_ELEMENTS.pris).click();
          cy.get(DOM_ELEMENTS.earliestReleaseDateLabel).should('contain', 'Earliest release date (EDR)');
          cy.get(DOM_ELEMENTS.earliestReleaseDate).should('exist');
          cy.get(DOM_ELEMENTS.prisonAndPrisonNumberLabel).should('contain', 'Prison and prison number');
          cy.get(DOM_ELEMENTS.prisonAndPrisonNumber).should('exist');
          cy.get(DOM_ELEMENTS.prisHint).should('contain', 'Held as enforcement comment');
          cy.get(DOM_ELEMENTS.prisCharHint).should('contain', 'You have 28 characters remaining');

          cy.get(DOM_ELEMENTS.noenfLabel).should('exist');
          cy.get(DOM_ELEMENTS.noenf).should('exist');
          cy.get(DOM_ELEMENTS.noenf).click();
          cy.get(DOM_ELEMENTS.reasonAccountIsOnNoenfLabel).should('contain', 'Reason account is on NOENF');
          cy.get(DOM_ELEMENTS.reasonAccountIsOnNoenf).should('exist');
          cy.get(DOM_ELEMENTS.noenfCharHint).should('contain', 'You have 28 characters remaining');
        });
      }
    },
  );

  it(
    '(AC.4)should provide error for selection enforcement action panel but not selecting any enforcement action',
    { tags: ['@PO-548', '@PO-590', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          cy.get(DOM_ELEMENTS.addEnforcementAction).click();
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.enforcementActionReason);
        });
      }
    },
  );

  it(
    '(AC.5,AC.6)should have validations in place for enforcement action (pris)',
    { tags: ['@PO-548', '@PO-590', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          finesMacState.paymentTerms.formData.fm_payment_terms_add_enforcement_action = true;
          finesMacState.paymentTerms.formData.fm_payment_terms_enforcement_action = 'PRIS';
          finesMacState.paymentTerms.formData.fm_payment_terms_prison_and_prison_number = 'HMP:Example-Prison';
          cy.get(DOM_ELEMENTS.earliestReleaseDate).type('32/09/2025', { delay: 0 });
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });

          for (const [, value] of Object.entries(ENFORCEMENT_ERRORS)) {
            cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', value);
          }

          cy.get(DOM_ELEMENTS.earliestReleaseDate).clear().type('29/09/2021', { delay: 0 });
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.futureDateMust);

          cy.get(DOM_ELEMENTS.earliestReleaseDate).clear().type('29,09.2021', { delay: 0 });
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.prisonDateFormat);
        });
      }
    },
  );

  it(
    '(AC.7) Should provide error if (NOENF) field is left empty',
    { tags: ['@PO-548', '@PO-590', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          finesMacState.paymentTerms.formData.fm_payment_terms_add_enforcement_action = true;
          finesMacState.paymentTerms.formData.fm_payment_terms_enforcement_action = 'NOENF';
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.noenfReason);
        });
      }
    },
  );

  it(
    '(AC.8) should have validations in place for enforcement action (NOENF)',
    { tags: ['@PO-548', '@PO-590', '@PO-272', '@PO-344'] },
    () => {
      for (let i = 0; i < 2; i++) {
        cy.then(() => {
          setupComponent(defendantTypes[i]);

          finesMacState.paymentTerms.formData.fm_payment_terms_add_enforcement_action = true;
          finesMacState.paymentTerms.formData.fm_payment_terms_enforcement_action = 'NOENF';
          cy.get(DOM_ELEMENTS.reasonAccountIsOnNoenf).type('@', { delay: 0 });
          cy.get(DOM_ELEMENTS.submitButton).click({ multiple: true });
          cy.get(DOM_ELEMENTS.govukErrorMessage).should('contain', ERROR_MESSAGES.noenfTypeCheck);
        });
      }
    },
  );

  it(
    '(AC.1,4,5a) correct system note - A collection order was previously made - AY',
    { tags: ['@PO-545', '@PO-651'] },
    () => {
      const setAccountCommentsNotesSpy = Cypress.sinon.spy();

      finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
      finesMacState.accountDetails.formData.fm_create_account_business_unit_id = 17;
      finesMacState.businessUnit.business_unit_id = 17;
      finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made = true;
      finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_date = '05/01/2023';
      finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
      finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2023';

      setupComponent('adultOrYouthOnly', setAccountCommentsNotesSpy);
      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledOnce');
      cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
        const arg = calls.args[0][0];
        const systemNote = arg.formData.fm_account_comments_notes_system_notes;
        expect(systemNote).to.equal(
          'A collection order was previously made on 05/01/2023 prior to this account creation',
        );
      });
    },
  );
  it(
    '(AC.1,4,5b) correct system note - A collection order was previously made - AYPG',
    { tags: ['@PO-545', '@PO-651'] },
    () => {
      const setAccountCommentsNotesSpy = Cypress.sinon.spy();

      finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
      finesMacState.accountDetails.formData.fm_create_account_business_unit_id = 17;
      finesMacState.businessUnit.business_unit_id = 17;

      finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made = true;
      finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_date = '05/01/2023';
      finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
      finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2023';

      setupComponent('pgToPay', setAccountCommentsNotesSpy);
      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledOnce');
      cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
        const arg = calls.args[0][0];
        const systemNote = arg.formData.fm_account_comments_notes_system_notes;
        expect(systemNote).to.equal(
          'A collection order was previously made on 05/01/2023 prior to this account creation',
        );
      });
    },
  );
  it('(AC.2,4,5a) correct system note - Make collection order today - AY', { tags: ['@PO-545', '@PO-651'] }, () => {
    const setAccountCommentsNotesSpy = Cypress.sinon.spy();

    finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
    finesMacState.accountDetails.formData.fm_create_account_business_unit_id = 17;
    finesMacState.businessUnit.business_unit_id = 17;

    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made = false;
    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made_today = true;
    finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2023';

    setupComponent('adultOrYouthOnly', setAccountCommentsNotesSpy);
    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledOnce');
    cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
      const arg = calls.args[0][0];
      const systemNote = arg.formData.fm_account_comments_notes_system_notes;
      expect(systemNote).to.equal('A collection order has been made by Timmy Test using Authorised Functions');
    });
  });

  it('(AC.2,4,5b) correct system note - Make collection order today - AYPG', { tags: ['@PO-545', '@PO-651'] }, () => {
    const setAccountCommentsNotesSpy = Cypress.sinon.spy();
    finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
    finesMacState.accountDetails.formData.fm_create_account_business_unit_id = 17;
    finesMacState.businessUnit.business_unit_id = 17;

    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made = false;
    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made_today = true;
    finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2023';

    setupComponent('pgToPay', setAccountCommentsNotesSpy);
    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledOnce');
    cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
      const arg = calls.args[0][0];
      const systemNote = arg.formData.fm_account_comments_notes_system_notes;
      expect(systemNote).to.equal('A collection order has been made by Timmy Test using Authorised Functions');
    });
  });

  it('(AC3a,c,4,5a) update system note - Made today - Previously made - AY ', { tags: ['@PO-545', '@PO-651'] }, () => {
    const setAccountCommentsNotesSpy = Cypress.sinon.spy();

    finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
    finesMacState.accountDetails.formData.fm_create_account_business_unit_id = 17;
    finesMacState.businessUnit.business_unit_id = 17;

    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made = false;
    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made_today = true;
    finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2023';

    setupComponent('adultOrYouthOnly', setAccountCommentsNotesSpy);
    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledOnce');
    cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
      cy.log('Calls:', calls);
      const arg = calls.args[0][0];
      const systemNote = arg.formData.fm_account_comments_notes_system_notes;
      cy.log('System note:', systemNote);
      expect(systemNote).to.equal('A collection order has been made by Timmy Test using Authorised Functions');
    });

    cy.get(DOM_ELEMENTS.collectionYes).check();
    cy.get(DOM_ELEMENTS.collectionOrderDate).clear().type('01/01/2023', { delay: 0, force: true });
    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledTwice');
    cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
      cy.log('Calls:', calls);
      const arg = calls.args[1][0];
      const systemNote = arg.formData.fm_account_comments_notes_system_notes;
      cy.log('System note:', systemNote);
      expect(systemNote).to.equal(
        'A collection order was previously made on 01/01/2023 prior to this account creation',
      );
    });
  });

  it('(AC3a,c,4,5b) update system note - Made today - Previously made - AYPG', { tags: ['@PO-545', '@PO-651'] }, () => {
    const setAccountCommentsNotesSpy = Cypress.sinon.spy();

    finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
    finesMacState.accountDetails.formData.fm_create_account_business_unit_id = 17;
    finesMacState.businessUnit.business_unit_id = 17;

    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made = false;
    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made_today = true;
    finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2023';

    setupComponent('pgToPay', setAccountCommentsNotesSpy);

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledOnce');
    cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
      cy.log('Calls:', calls);
      const arg = calls.args[0][0];
      const systemNote = arg.formData.fm_account_comments_notes_system_notes;
      cy.log('System note:', systemNote);
      expect(systemNote).to.equal('A collection order has been made by Timmy Test using Authorised Functions');
    });

    cy.get(DOM_ELEMENTS.collectionYes).check();
    cy.get(DOM_ELEMENTS.collectionOrderDate).clear().type('01/01/2023', { delay: 0, force: true });
    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledTwice');
    cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
      cy.log('Calls:', calls);
      const arg = calls.args[1][0];
      const systemNote = arg.formData.fm_account_comments_notes_system_notes;
      cy.log('System note:', systemNote);
      expect(systemNote).to.equal(
        'A collection order was previously made on 01/01/2023 prior to this account creation',
      );
    });
  });

  it('(AC3b,d,4,5a) update system note - Previously made - Made today - AY ', { tags: ['@PO-545', '@PO-651'] }, () => {
    const setAccountCommentsNotesSpy = Cypress.sinon.spy();

    finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
    finesMacState.accountDetails.formData.fm_create_account_business_unit_id = 17;
    finesMacState.businessUnit.business_unit_id = 17;

    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made = true;
    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_date = '05/01/2023';
    finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2023';

    setupComponent('adultOrYouthOnly', setAccountCommentsNotesSpy);

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledOnce');
    cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
      cy.log('Calls:', calls);
      const arg = calls.args[0][0];
      const systemNote = arg.formData.fm_account_comments_notes_system_notes;
      cy.log('System note:', systemNote);
      expect(systemNote).to.equal(
        'A collection order was previously made on 05/01/2023 prior to this account creation',
      );
    });

    cy.get(DOM_ELEMENTS.collectionNo).check();
    cy.get(DOM_ELEMENTS.makeCollection).check();

    cy.get(DOM_ELEMENTS.payInFull).check();
    cy.get(DOM_ELEMENTS.payByDate).clear().type('01/01/2023', { delay: 0, force: true });

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledTwice');
    cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
      cy.log('Calls:', calls);
      const arg = calls.args[1][0];
      const systemNote = arg.formData.fm_account_comments_notes_system_notes;
      cy.log('System note:', systemNote);
      expect(systemNote).to.equal('A collection order has been made by Timmy Test using Authorised Functions');
    });
  });

  it(
    '(AC3b,d,4,5b) update system note - Previously made - Made today - AYPG ',
    { tags: ['@PO-545', '@PO-651'] },
    () => {
      const setAccountCommentsNotesSpy = Cypress.sinon.spy();

      finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
      finesMacState.accountDetails.formData.fm_create_account_business_unit_id = 17;
      finesMacState.businessUnit.business_unit_id = 17;

      finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made = true;
      finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_date = '05/01/2023';
      finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
      finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2023';

      setupComponent('pgToPay', setAccountCommentsNotesSpy);
      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledOnce');
      cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
        cy.log('Calls:', calls);
        const arg = calls.args[0][0];
        const systemNote = arg.formData.fm_account_comments_notes_system_notes;
        cy.log('System note:', systemNote);
        expect(systemNote).to.equal(
          'A collection order was previously made on 05/01/2023 prior to this account creation',
        );
      });

      cy.get(DOM_ELEMENTS.collectionNo).check();
      cy.get(DOM_ELEMENTS.makeCollection).check();

      cy.get(DOM_ELEMENTS.payInFull).check();
      cy.get(DOM_ELEMENTS.payByDate).clear().type('01/01/2023', { delay: 0, force: true });

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledTwice');
      cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
        cy.log('Calls:', calls);
        const arg = calls.args[1][0];
        const systemNote = arg.formData.fm_account_comments_notes_system_notes;
        cy.log('System note:', systemNote);
        expect(systemNote).to.equal('A collection order has been made by Timmy Test using Authorised Functions');
      });
    },
  );

  it('(AC1b, 1e) Update system note - Previously made → Criteria not met', { tags: ['@PO-1592'] }, () => {
    const setAccountCommentsNotesSpy = cy.spy().as('setAccountCommentsNotesSpy');

    finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
    finesMacState.accountDetails.formData.fm_create_account_business_unit_id = 17;
    finesMacState.businessUnit.business_unit_id = 17;

    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made = true;
    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_date = '05/01/2023';
    finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2023';

    setupComponent('pgToPay', setAccountCommentsNotesSpy);
    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledOnce');
    cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
      cy.log('Calls:', calls);
      const arg = calls.args[0][0];
      const systemNote = arg.formData.fm_account_comments_notes_system_notes;
      cy.log('System note:', systemNote);
      expect(systemNote).to.equal(
        'A collection order was previously made on 05/01/2023 prior to this account creation',
      );
    });

    cy.get(DOM_ELEMENTS.collectionNo).check();
    cy.get(DOM_ELEMENTS.makeCollection).uncheck();

    cy.get(DOM_ELEMENTS.payInFull).check();
    cy.get(DOM_ELEMENTS.payByDate).clear().type('01/01/2023', { delay: 0, force: true });

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledTwice');
    cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
      cy.log('Calls:', calls);
      const arg = calls.args[1][0];
      cy.log('Arg:', arg);
      const systemNote = arg.formData.fm_account_comments_notes_system_notes;
      cy.log('System note:', systemNote);
      expect(systemNote).to.be.null;
    });
  });

  it('(AC1b, 1e) Update system note - Made today → Criteria not met', { tags: ['@PO-1592'] }, () => {
    const setAccountCommentsNotesSpy = cy.spy().as('setAccountCommentsNotesSpy');

    finesMacState.personalDetails.formData.fm_personal_details_dob = '01/01/2000';
    finesMacState.accountDetails.formData.fm_create_account_business_unit_id = 17;
    finesMacState.businessUnit.business_unit_id = 17;

    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made = false;
    finesMacState.paymentTerms.formData.fm_payment_terms_collection_order_made_today = true;
    finesMacState.paymentTerms.formData.fm_payment_terms_payment_terms = 'payInFull';
    finesMacState.paymentTerms.formData.fm_payment_terms_pay_by_date = '01/01/2023';

    setupComponent('pgToPay', setAccountCommentsNotesSpy);

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledOnce');
    cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
      cy.log('Calls:', calls);
      const arg = calls.args[0][0];
      const systemNote = arg.formData.fm_account_comments_notes_system_notes;
      cy.log('System note:', systemNote);
      expect(systemNote).to.equal('A collection order has been made by Timmy Test using Authorised Functions');
    });

    cy.get(DOM_ELEMENTS.collectionNo).check();
    cy.get(DOM_ELEMENTS.makeCollection).uncheck();

    cy.get(DOM_ELEMENTS.payInFull).check();
    cy.get(DOM_ELEMENTS.payByDate).clear().type('01/01/2023', { delay: 0, force: true });

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.wrap(setAccountCommentsNotesSpy).should('have.been.calledTwice');
    cy.wrap(setAccountCommentsNotesSpy).then((calls: any) => {
      cy.log('Calls:', calls);
      const arg = calls.args[1][0];
      cy.log('Arg:', arg);
      const systemNote = arg.formData.fm_account_comments_notes_system_notes;
      cy.log('System note:', systemNote);
      expect(systemNote).to.be.null;
    });
  });
});
