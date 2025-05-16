import { mount } from 'cypress/angular';
import { FinesMacReviewAccountComponent } from 'src/app/flows/fines/fines-mac/fines-mac-review-account/fines-mac-review-account.component';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-draft-add-account-payload.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_AYG_CHECK_ACCOUNT_MOCK } from 'cypress/component/manualAccountCreation/FinesMacReviewAccount/mocks/fines_mac_review_account_mocks';
import { DOM_ELEMENTS } from './constants/fines_mac_review_account_elements';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FINES_DRAFT_STATE } from 'src/app/flows/fines/fines-draft/constants/fines-draft-state.constant';

describe('FinesMacReviewAccountComponent', () => {
  let finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
  let finesDraftState = structuredClone(FINES_DRAFT_STATE);
  let finesAccountPayload = FINES_MAC_PAYLOAD_ADD_ACCOUNT;

  let store: any;
  const setupComponent = (
    finesDraftStateMock: any = finesDraftState,
    activatedRouteMock: any = null,
    amend: boolean = true,
  ) => {
    mount(FinesMacReviewAccountComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        UtilsService,
        FinesMacPayloadService,
        Router,

        {
          provide: FinesMacPayloadService,
          useValue: {
            buildAddAccountPayload: () => {
              return finesAccountPayload;
            },
            buildReplaceAccountPayload: () => {
              return finesAccountPayload;
            },
          },
        },
        {
          provide: GlobalStore,
          useFactory: () => {
            let store = new GlobalStore();
            store.setUserState(SESSION_USER_STATE_MOCK);
            store.setError({
              error: false,
              message: '',
            });
            return store;
          },
        },
        {
          provide: FinesMacStore,
          useFactory: () => {
            let store = new FinesMacStore();
            store.setFinesMacStore(finesMacState);
            return store;
          },
        },
        {
          provide: FinesDraftStore,
          useFactory: () => {
            let store = new FinesDraftStore();
            store.setFinesDraftState(finesDraftStateMock);
            store.setAmend(amend);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                reviewAccountFetchMap: {
                  FinesMacStore: finesMacState,
                  finesMacDraft: activatedRouteMock,
                },
              },
              parent: {
                snapshot: {
                  url: [{ path: 'manual-account-creation' }],
                },
              },
            },
          },
        },
      ],
      componentProperties: {},
    });
  };
  beforeEach(() => {
    cy.intercept('GET', '**/opal-fines-service/local-justice-areas', {
      statusCode: 200,
      body: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
    }).as('getLocalJusticeAreas');
    cy.intercept('GET', '**/opal-fines-service/courts**', {
      statusCode: 200,
      body: OPAL_FINES_COURT_REF_DATA_MOCK,
    }).as('getCourts');
    cy.intercept('GET', '**/opal-fines-service/results**', {
      statusCode: 200,
      body: OPAL_FINES_RESULTS_REF_DATA_MOCK,
    }).as('getResults');
    cy.intercept('GET', '**/opal-fines-service/major-creditors**', {
      statusCode: 200,
      body: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
    }).as('getMajorCreditors');
    cy.intercept('POST', '**/opal-fines-service/draft-accounts**', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK,
    });
    cy.intercept('PUT', '**/opal-fines-service/draft-accounts/**', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK,
    });
    cy.intercept(
      {
        method: 'GET',
        pathname: '/opal-fines-service/offences',
      },
      (req) => {
        const requestedCjsCode = req.query['q'];
        const matchedOffences = OPAL_FINES_OFFENCES_REF_DATA_MOCK.refData.filter(
          (offence) => offence.get_cjs_code === requestedCjsCode,
        );
        req.reply({
          count: matchedOffences.length,
          refData: matchedOffences,
        });
      },
    ).as('getOffenceByCjsCode');
    cy.intercept('GET', '**/opal-fines-service/draft-accounts**', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK,
    }).as('getDraftAccounts');
    cy.then(() => {
      finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
      finesDraftState = structuredClone(FINES_DRAFT_STATE);
      finesAccountPayload = FINES_MAC_PAYLOAD_ADD_ACCOUNT;
    });
  });

  it('should render component', () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it(
    '(AC.1a)should render court details and offence details for all defendant types',
    { tags: ['@PO-560', '@PO-662', '@PO-663', '@PO-545', '@PO-657'] },
    () => {
      setupComponent();
      cy.wait('@getOffenceByCjsCode');
      cy.wait('@getCourts');

      cy.get(DOM_ELEMENTS.originatorName).should('exist');
      cy.get(DOM_ELEMENTS.prosecutorCaseReference).should('exist');
      cy.get(DOM_ELEMENTS.enforcementCourt).should('exist');

      cy.get(DOM_ELEMENTS.headingLarge).should('exist');
      cy.get(DOM_ELEMENTS.headingMedium).should('exist');
      cy.get(DOM_ELEMENTS.dateOfSentence).should('exist');
      cy.get(DOM_ELEMENTS.offencecode).should('exist');

      cy.get(DOM_ELEMENTS.tableHeadings).should('exist');

      cy.get(DOM_ELEMENTS.impositionType).should('exist');
      cy.get(DOM_ELEMENTS.creditor).should('exist');
      cy.get(DOM_ELEMENTS.amountImposed).should('exist');
      cy.get(DOM_ELEMENTS.amountPaid).should('exist');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('exist');

      cy.get(DOM_ELEMENTS.totalHeading).should('exist');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('exist');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('exist');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('exist');

      cy.get(DOM_ELEMENTS.GrandtotalAmountImposed).should('exist');
      cy.get(DOM_ELEMENTS.GrandtotalAmountPaid).should('exist');
      cy.get(DOM_ELEMENTS.GrandtotalRemainingBalance).should('exist');

      cy.get(DOM_ELEMENTS.originatorName)
        .should('contain', 'Sending area or Local Justice Area (LJA)')
        .should('contain', 'Asylum & Immigration Tribunal (9985)');
      cy.get(DOM_ELEMENTS.prosecutorCaseReference)
        .should('contain', 'Prosecutor Case Reference (PCR)')
        .should('contain', 'O1AT204003');
      cy.get(DOM_ELEMENTS.enforcementCourt)
        .should('contain', 'Enforcement court')
        .should('contain', 'Historic Debt Database (101)');

      cy.get(DOM_ELEMENTS.dateOfSentence).should('contain', 'Date of sentence').should('contain', '01 October 2022');
      cy.get(DOM_ELEMENTS.offencecode).should('contain', 'AK123456').should('contain', 'ak test');

      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Imposition');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Creditor');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Amount imposed');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Amount paid');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Balance remaining');

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Criminal Courts Charge');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'HM Courts & Tribunals Service (HMCTS)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£50.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£150.00');

      cy.get(DOM_ELEMENTS.totalHeading).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('contain', '£50.00');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('contain', '£150.00');

      cy.get(DOM_ELEMENTS.headingMedium).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.GrandtotalAmountImposed).should('contain', '£200.00').should('contain', 'Amount imposed');
      cy.get(DOM_ELEMENTS.GrandtotalAmountPaid).should('contain', '£50.00').should('contain', 'Amount paid');
      cy.get(DOM_ELEMENTS.GrandtotalRemainingBalance)
        .should('contain', '£150.00')
        .should('contain', 'Balance remaining');

      cy.get(DOM_ELEMENTS.paymentTerms).should('contain', 'Payment terms').should('contain', 'Pay in full');
      cy.get(DOM_ELEMENTS.payByDate).should('contain', 'Pay by date').should('contain', '01 January 2022');
      cy.get(DOM_ELEMENTS.requestPaymentCard).should('contain', 'Request payment card').should('contain', 'Yes');
      cy.get(DOM_ELEMENTS.hasDaysInDefault).should('contain', 'There are days in default').should('contain', 'No');
      cy.get(DOM_ELEMENTS.enforcementActions).should('contain', 'Enforcement action').should('contain', 'No');
    },
  );

  it(
    '(AC.1a,AC.2,AC.5)should render all elements on the screen for AY check account',
    { tags: ['@PO-560', '@PO-272', '@PO-657'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.heading).should('exist');
      cy.get(DOM_ELEMENTS.backLink).should('exist');

      // Account details
      cy.get(DOM_ELEMENTS.businessUnitData).should('exist');
      cy.get(DOM_ELEMENTS.accountTypeData).should('exist');
      cy.get(DOM_ELEMENTS.defendantTypeData).should('exist');

      // Personal details
      cy.get(DOM_ELEMENTS.summaryTitle).should('exist');
      cy.get(DOM_ELEMENTS.title).should('exist');
      cy.get(DOM_ELEMENTS.forenames).should('exist');
      cy.get(DOM_ELEMENTS.surname).should('exist');
      cy.get(DOM_ELEMENTS.aliases).should('exist');
      cy.get(DOM_ELEMENTS.dob).should('exist');
      cy.get(DOM_ELEMENTS.nationalInsuranceNumber).should('exist');
      cy.get(DOM_ELEMENTS.address).should('exist');
      cy.get(DOM_ELEMENTS.vehicleMakeOrModel).should('exist');
      cy.get(DOM_ELEMENTS.registrationNumber).should('exist');

      // Contact details
      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('exist');

      // Employer details
      cy.get(DOM_ELEMENTS.employerName).should('exist');
      cy.get(DOM_ELEMENTS.employeeReference).should('exist');
      cy.get(DOM_ELEMENTS.employerEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.employerTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.employerAddress).should('exist');

      // Payment terms
      cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
      cy.get(DOM_ELEMENTS.payByDate).should('exist');
      cy.get(DOM_ELEMENTS.requestPaymentCard).should('exist');
      cy.get(DOM_ELEMENTS.hasDaysInDefault).should('exist');
      cy.get(DOM_ELEMENTS.enforcementActions).should('exist');

      // Account comments and notes
      cy.get(DOM_ELEMENTS.comments).should('exist');
      cy.get(DOM_ELEMENTS.accountNotes).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.deleteLink).should('exist');
    },
  );

  it(
    '(AC.4a) should check each summary list has change button next to them for AY',
    { tags: ['@PO-560', '@PO-272', '@PO-657'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Personal details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Contact details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Employer details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Offences and impositions').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Payment terms').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Account comments and notes').should('contain', 'Change');
    },
  );

  it(
    '(AC.1,AC.2,AC.4) should have all correct text on all elements for AY',
    { tags: ['@PO-560', '@PO-272', '@PO-657'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.heading).should('contain', 'Check account details');

      cy.get(DOM_ELEMENTS.businessUnitData).should('contain', 'Business unit');
      cy.get(DOM_ELEMENTS.accountTypeData).should('contain', 'Account type').should('contain', 'Fine');
      cy.get(DOM_ELEMENTS.defendantTypeData)
        .should('contain', 'Defendant type')
        .should('contain', 'Adult or youth only');

      cy.get(DOM_ELEMENTS.title).should('contain', 'Title').should('contain', 'Mr');
      cy.get(DOM_ELEMENTS.forenames).should('contain', 'First names').should('contain', 'John');
      cy.get(DOM_ELEMENTS.surname).should('contain', 'Last name').should('contain', 'Doe');
      cy.get(DOM_ELEMENTS.aliases).should('contain', 'Aliases').should('contain', 'Rebecca Johnson');
      cy.get(DOM_ELEMENTS.dob).should('contain', 'Date of birth').should('contain', '01 January 2000 (Adult)');
      cy.get(DOM_ELEMENTS.nationalInsuranceNumber)
        .should('contain', 'National Insurance number')
        .should('contain', 'AB123456C');
      cy.get(DOM_ELEMENTS.address)
        .should('contain', 'Address')
        .should('contain', '123 Fake Street')
        .should('contain', 'Fake Town')
        .should('contain', 'Fake City')
        .should('contain', 'AB12 3CD');
      cy.get(DOM_ELEMENTS.vehicleMakeOrModel).should('contain', 'Vehicle make and model').should('contain', 'Ford');
      cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'Registration number').should('contain', 'AB12 CDE');

      cy.get(DOM_ELEMENTS.primaryEmailAddress)
        .should('contain', 'Primary email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress)
        .should('contain', 'Secondary email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
        .should('contain', 'Mobile telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber)
        .should('contain', 'Home telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.workTelephoneNumber)
        .should('contain', 'Work telephone number')
        .should('contain', '0123456789');

      cy.get(DOM_ELEMENTS.employerName).should('contain', 'Employer name').should('contain', 'Test Company');
      cy.get(DOM_ELEMENTS.employeeReference)
        .should('contain', 'Employee reference')
        .should('contain', 'Test Reference');
      cy.get(DOM_ELEMENTS.employerEmailAddress)
        .should('contain', 'Employer email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.employerTelephoneNumber)
        .should('contain', 'Employer telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.employerAddress)
        .should('contain', 'Employer address')
        .should('contain', 'test address line 1')
        .should('contain', 'test address line 2')
        .should('contain', 'test address line 3')
        .should('contain', 'test address line 4')
        .should('contain', 'test address line 5')
        .should('contain', 'test post code');

      cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

      cy.get(DOM_ELEMENTS.changeLink).should('exist');
      cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Submit for review');
      cy.get(DOM_ELEMENTS.deleteLink).should('contain', 'Delete account');
    },
  );

  it(
    '(AC.3) should show dashed line if Data is empty for non required details',
    { tags: ['@PO-560', '@PO-272', '@PO-657'] },
    () => {
      setupComponent();

      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: '',
        fm_contact_details_email_address_2: '',
        fm_contact_details_telephone_number_business: '',
        fm_contact_details_telephone_number_home: '',
        fm_contact_details_telephone_number_mobile: '',
      };
      finesMacState.employerDetails.formData = {
        fm_employer_details_employer_address_line_1: '',
        fm_employer_details_employer_address_line_2: '',
        fm_employer_details_employer_address_line_3: '',
        fm_employer_details_employer_address_line_4: '',
        fm_employer_details_employer_address_line_5: '',
        fm_employer_details_employer_company_name: '',
        fm_employer_details_employer_email_address: '',
        fm_employer_details_employer_post_code: '',
        fm_employer_details_employer_reference: '',
        fm_employer_details_employer_telephone_number: '',
      };
      finesMacState.accountCommentsNotes.formData = {
        fm_account_comments_notes_comments: '',
        fm_account_comments_notes_notes: '',
      };

      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('contain', 'Primary email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('contain', 'Secondary email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('contain', 'Mobile telephone number').should('contain', '—');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '—');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '—');

      cy.get(DOM_ELEMENTS.employerName).should('contain', 'Employer name').should('contain', '—');
      cy.get(DOM_ELEMENTS.employeeReference).should('contain', 'Employee reference').should('contain', '—');
      cy.get(DOM_ELEMENTS.employerEmailAddress).should('contain', 'Employer email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.employerTelephoneNumber)
        .should('contain', 'Employer telephone number')
        .should('contain', '—');
      cy.get(DOM_ELEMENTS.employerAddress)
        .should('contain', 'Employer address')
        .should('contain', '—')
        .should('contain', '—')
        .should('contain', '—')
        .should('contain', '—')
        .should('contain', '—');

      cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', '—');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', '—');
    },
  );

  it(
    '(AC.3) should show dash lines for non required fields in the details',
    { tags: ['@PO-560', '@PO-272', '@PO-657'] },
    () => {
      setupComponent();

      finesMacState.personalDetails.formData.fm_personal_details_vehicle_make = '';

      cy.get(DOM_ELEMENTS.vehicleMakeOrModel).should('contain', 'Vehicle make and model').should('contain', '—');
    },
  );

  it(
    '(AC.1,AC.2,AC.5)should render all elements on the screen for AYPG ',
    { tags: ['@PO-662', '@PO-344', '@PO-657'] },
    () => {
      setupComponent();

      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';
      cy.get(DOM_ELEMENTS.heading).should('exist');
      cy.get(DOM_ELEMENTS.backLink).should('exist');

      // Account details
      cy.get(DOM_ELEMENTS.businessUnitData).should('exist');
      cy.get(DOM_ELEMENTS.accountTypeData).should('exist');
      cy.get(DOM_ELEMENTS.defendantTypeData).should('exist');

      // Personal details
      cy.get(DOM_ELEMENTS.summaryTitle).should('exist');
      cy.get(DOM_ELEMENTS.title).should('exist');
      cy.get(DOM_ELEMENTS.forenames).should('exist');
      cy.get(DOM_ELEMENTS.surname).should('exist');
      cy.get(DOM_ELEMENTS.aliases).should('exist');
      cy.get(DOM_ELEMENTS.dob).should('exist');
      cy.get(DOM_ELEMENTS.nationalInsuranceNumber).should('exist');
      cy.get(DOM_ELEMENTS.address).should('exist');

      // Contact details
      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('exist');

      // Employer details
      cy.get(DOM_ELEMENTS.employerName).should('exist');
      cy.get(DOM_ELEMENTS.employeeReference).should('exist');
      cy.get(DOM_ELEMENTS.employerEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.employerTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.employerAddress).should('exist');

      // Payment terms
      cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
      cy.get(DOM_ELEMENTS.payByDate).should('exist');
      cy.get(DOM_ELEMENTS.requestPaymentCard).should('exist');
      cy.get(DOM_ELEMENTS.hasDaysInDefault).should('exist');
      cy.get(DOM_ELEMENTS.enforcementActions).should('exist');

      // Account comments and notes
      cy.get(DOM_ELEMENTS.comments).should('exist');
      cy.get(DOM_ELEMENTS.accountNotes).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.deleteLink).should('exist');

      //parent guardian details
      cy.get(DOM_ELEMENTS.PGforenames).should('exist');
      cy.get(DOM_ELEMENTS.PGsurname).should('exist');
      cy.get(DOM_ELEMENTS.aliases).should('exist');
      cy.get(DOM_ELEMENTS.PGdob).should('exist');
      cy.get(DOM_ELEMENTS.PGnationalInsuranceNumber).should('exist');
      cy.get(DOM_ELEMENTS.PGaddress).should('exist');
      cy.get(DOM_ELEMENTS.PGvehicleMakeOrModel).should('exist');
      cy.get(DOM_ELEMENTS.PGregistrationNumber).should('exist');
    },
  );

  it('(AC.3,AC.5) should load all data into elements for AYPG', { tags: ['@PO-662', '@PO-344', '@PO-657'] }, () => {
    setupComponent();
    finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Check account details');

    cy.get(DOM_ELEMENTS.businessUnitData).should('contain', 'Business unit');
    cy.get(DOM_ELEMENTS.accountTypeData).should('contain', 'Account type').should('contain', 'Fine');
    cy.get(DOM_ELEMENTS.defendantTypeData)
      .should('contain', 'Defendant type')
      .should('contain', 'Adult or youth with parent or guardian to pay');

    cy.get(DOM_ELEMENTS.PGforenames).should('contain', 'Test');
    cy.get(DOM_ELEMENTS.PGsurname).should('contain', 'test');
    cy.get(DOM_ELEMENTS.PGAliases).should('contain', 'test test');
    cy.get(DOM_ELEMENTS.PGdob).should('contain', '01 February 1990');
    cy.get(DOM_ELEMENTS.PGnationalInsuranceNumber).should('contain', 'AB123456C');
    cy.get(DOM_ELEMENTS.PGaddress)
      .should('contain', 'Address')
      .should('contain', 'test address line 1')
      .should('contain', 'test address line 2')
      .should('contain', 'test address line 3')
      .should('contain', 'test post code');

    cy.get(DOM_ELEMENTS.PGvehicleMakeOrModel).should('contain', 'renault');
    cy.get(DOM_ELEMENTS.PGregistrationNumber).should('contain', 'cd12 efg');

    cy.get(DOM_ELEMENTS.title).should('contain', 'Title').should('contain', 'Mr');
    cy.get(DOM_ELEMENTS.forenames).should('contain', 'First names').should('contain', 'John');
    cy.get(DOM_ELEMENTS.surname).should('contain', 'Last name').should('contain', 'Doe');
    cy.get(DOM_ELEMENTS.aliases).should('contain', 'Aliases').should('contain', 'Rebecca Johnson');
    cy.get(DOM_ELEMENTS.dob).should('contain', 'Date of birth').should('contain', '01 January 2000 (Adult)');
    cy.get(DOM_ELEMENTS.nationalInsuranceNumber)
      .should('contain', 'National Insurance number')
      .should('contain', 'AB123456C');
    cy.get(DOM_ELEMENTS.address)
      .should('contain', 'Address')
      .should('contain', '123 Fake Street')
      .should('contain', 'Fake Town')
      .should('contain', 'Fake City')
      .should('contain', 'AB12 3CD');

    cy.get(DOM_ELEMENTS.primaryEmailAddress)
      .should('contain', 'Primary email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.secondaryEmailAddress)
      .should('contain', 'Secondary email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
      .should('contain', 'Mobile telephone number')
      .should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '0123456789');

    cy.get(DOM_ELEMENTS.employerName).should('contain', 'Employer name').should('contain', 'Test Company');
    cy.get(DOM_ELEMENTS.employeeReference).should('contain', 'Employee reference').should('contain', 'Test Reference');
    cy.get(DOM_ELEMENTS.employerEmailAddress)
      .should('contain', 'Employer email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.employerTelephoneNumber)
      .should('contain', 'Employer telephone number')
      .should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.employerAddress)
      .should('contain', 'Employer address')
      .should('contain', 'test address line 1')
      .should('contain', 'test address line 2')
      .should('contain', 'test address line 3')
      .should('contain', 'test address line 4')
      .should('contain', 'test address line 5')
      .should('contain', 'test post code');

    cy.get(DOM_ELEMENTS.paymentTerms).should('contain', 'Payment terms').should('contain', 'Pay in full');
    cy.get(DOM_ELEMENTS.payByDate).should('contain', 'Pay by date').should('contain', '01 January 2022');
    cy.get(DOM_ELEMENTS.requestPaymentCard).should('contain', 'Request payment card').should('contain', 'Yes');
    cy.get(DOM_ELEMENTS.hasDaysInDefault).should('contain', 'There are days in default').should('contain', 'No');
    cy.get(DOM_ELEMENTS.enforcementActions).should('contain', 'Enforcement action').should('contain', 'No');

    cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
    cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

    cy.get(DOM_ELEMENTS.changeLink).should('exist');
    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Submit for review');
    cy.get(DOM_ELEMENTS.deleteLink).should('contain', 'Delete account');
  });

  it(
    '(AC.4a)should check each summary list has change button next to them for AYPG',
    { tags: ['@PO-662', '@PO-344', '@PO-657'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';

      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Defendant details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Contact details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Employer details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Offences and impositions').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Parent or guardian details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Payment terms').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Account comments and notes').should('contain', 'Change');
    },
  );
  it(
    '(AC.3)should show dashed line if Data is empty for non required details AYPG',
    { tags: ['@PO-662', '@PO-344'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';

      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: '',
        fm_contact_details_email_address_2: '',
        fm_contact_details_telephone_number_business: '',
        fm_contact_details_telephone_number_home: '',
        fm_contact_details_telephone_number_mobile: '',
      };
      finesMacState.employerDetails.formData = {
        fm_employer_details_employer_address_line_1: '',
        fm_employer_details_employer_address_line_2: '',
        fm_employer_details_employer_address_line_3: '',
        fm_employer_details_employer_address_line_4: '',
        fm_employer_details_employer_address_line_5: '',
        fm_employer_details_employer_company_name: '',
        fm_employer_details_employer_email_address: '',
        fm_employer_details_employer_post_code: '',
        fm_employer_details_employer_reference: '',
        fm_employer_details_employer_telephone_number: '',
      };
      finesMacState.accountCommentsNotes.formData = {
        fm_account_comments_notes_comments: '',
        fm_account_comments_notes_notes: '',
      };

      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('contain', 'Primary email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('contain', 'Secondary email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('contain', 'Mobile telephone number').should('contain', '—');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '—');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '—');

      cy.get(DOM_ELEMENTS.employerName).should('contain', 'Employer name').should('contain', '—');
      cy.get(DOM_ELEMENTS.employeeReference).should('contain', 'Employee reference').should('contain', '—');
      cy.get(DOM_ELEMENTS.employerEmailAddress).should('contain', 'Employer email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.employerTelephoneNumber)
        .should('contain', 'Employer telephone number')
        .should('contain', '—');
      cy.get(DOM_ELEMENTS.employerAddress)
        .should('contain', 'Employer address')
        .should('contain', '—')
        .should('contain', '—')
        .should('contain', '—')
        .should('contain', '—')
        .should('contain', '—');
      cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', '—');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', '—');
    },
  );

  it(
    '(AC.3) should show dash lines for non required fields in the details AYPG',
    { tags: ['@PO-662', '@PO-344', '@PO-657'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';

      finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_vehicle_make = '';

      cy.get(DOM_ELEMENTS.PGvehicleMakeOrModel).should('contain', 'Vehicle make and model').should('contain', '—');
    },
  );

  it(
    '(AC.1,AC.2,AC.5,AC.6)should render all elements for company defendant type',
    { tags: ['@PO-663', '@PO-345', '@PO-657'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      cy.get(DOM_ELEMENTS.heading).should('exist');
      cy.get(DOM_ELEMENTS.backLink).should('exist');

      // Account details
      cy.get(DOM_ELEMENTS.businessUnitData).should('exist');
      cy.get(DOM_ELEMENTS.accountTypeData).should('exist');
      cy.get(DOM_ELEMENTS.defendantTypeData).should('exist');

      // Company Details
      cy.get(DOM_ELEMENTS.companyName).should('exist');
      cy.get(DOM_ELEMENTS.companyAliases).should('exist');
      cy.get(DOM_ELEMENTS.companyAddress).should('exist');

      // Contact details
      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('exist');

      // Payment terms
      cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
      cy.get(DOM_ELEMENTS.payByDate).should('exist');
      cy.get(DOM_ELEMENTS.enforcementActions).should('exist');

      // Account comments and notes
      cy.get(DOM_ELEMENTS.comments).should('exist');
      cy.get(DOM_ELEMENTS.accountNotes).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.deleteLink).should('exist');
    },
  );

  it(
    '(AC.1,AC.2,AC.6)should load all data into elements for company',
    { tags: ['@PO-663', '@PO-345', '@PO-657'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      cy.get(DOM_ELEMENTS.heading).should('contain', 'Check account details');

      cy.get(DOM_ELEMENTS.businessUnitData).should('contain', 'Business unit');
      cy.get(DOM_ELEMENTS.accountTypeData).should('contain', 'Account type').should('contain', 'Fine');
      cy.get(DOM_ELEMENTS.defendantTypeData).should('contain', 'Defendant type').should('contain', 'Company');

      cy.get(DOM_ELEMENTS.companyName).should('contain', 'Company name').should('contain', 'test company');
      cy.get(DOM_ELEMENTS.companyAliases).should('contain', 'Aliases').should('contain', 'test alias');
      cy.get(DOM_ELEMENTS.companyAddress)
        .should('contain', 'Address')
        .should('contain', 'test address line 1')
        .should('contain', 'test address line 2')
        .should('contain', 'test address line 3')
        .should('contain', 'test post code');

      cy.get(DOM_ELEMENTS.primaryEmailAddress)
        .should('contain', 'Primary email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress)
        .should('contain', 'Secondary email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
        .should('contain', 'Mobile telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber)
        .should('contain', 'Home telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.workTelephoneNumber)
        .should('contain', 'Work telephone number')
        .should('contain', '0123456789');

      cy.get(DOM_ELEMENTS.paymentTerms).should('contain', 'Payment terms').should('contain', 'Pay in full');
      cy.get(DOM_ELEMENTS.payByDate).should('contain', 'Pay by date').should('contain', '01 January 2022');
      cy.get(DOM_ELEMENTS.enforcementActions).should('contain', 'Enforcement action').should('contain', 'No');

      cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

      cy.get(DOM_ELEMENTS.changeLink).should('exist');
      cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Submit for review');
      cy.get(DOM_ELEMENTS.deleteLink).should('contain', 'Delete account');
    },
  );

  it(
    '(AC.4a)should check each summary list has change button next to them for Company',
    { tags: ['@PO-663', '@PO-345', '@PO-657'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Company details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Contact details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Offences and impositions').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Payment terms').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Account comments and notes').should('contain', 'Change');
    },
  );
  it(
    '(AC.3) should show dashed line if Data is empty for non required details Company',
    { tags: ['@PO-663', '@PO-345', '@PO-657'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: '',
        fm_contact_details_email_address_2: '',
        fm_contact_details_telephone_number_business: '',
        fm_contact_details_telephone_number_home: '',
        fm_contact_details_telephone_number_mobile: '',
      };
      finesMacState.accountCommentsNotes.formData = {
        fm_account_comments_notes_comments: '',
        fm_account_comments_notes_notes: '',
      };

      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('contain', 'Primary email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('contain', 'Secondary email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('contain', 'Mobile telephone number').should('contain', '—');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '—');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '—');

      cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', '—');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', '—');
    },
  );
  it('(AC.2,AC,3a,AC.3bi) should show in review for accounts in review', { tags: ['@PO-610', '@PO-584'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload);

    cy.get(DOM_ELEMENTS.heading).contains('Mr John DOE').should('exist');
    cy.get(DOM_ELEMENTS.reviewComponent).should('exist');
    cy.get(DOM_ELEMENTS.status).contains('In review').should('exist');
    cy.get(DOM_ELEMENTS.reviewHistory).contains('Review history').should('exist');
    cy.get(DOM_ELEMENTS.timeLine).should('exist');
    cy.get(DOM_ELEMENTS.timeLineTitle).contains('Submitted').should('exist');
    cy.get(DOM_ELEMENTS.timelineAuthor).contains('by Timmy Test').should('exist');
    cy.get(DOM_ELEMENTS.timelineDate).contains('03 July 2023').should('exist');
  });

  it(
    'should not load review component if account is not in review and should load normal Check account details heading',
    { tags: ['@PO-610', '@PO-584'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.reviewComponent).should('not.exist');
      cy.get(DOM_ELEMENTS.heading).contains('Check account details').should('exist');
    },
  );

  it('(AC.3bii,AC.3biii,AC.3c)should show history of timeline data', { tags: ['@PO-610', '@PO-584'] }, () => {
    finesAccountPayload.timeline_data.push({
      username: 'Timmy Test',
      status: 'Rejected',
      status_date: '2023-07-05',
      reason_text: null,
    });
    finesAccountPayload.timeline_data.push({
      username: 'Timmy Test',
      status: 'Submitted',
      status_date: '2023-07-07',
      reason_text: null,
    });

    setupComponent(finesAccountPayload, finesAccountPayload);

    cy.get(DOM_ELEMENTS.timeLine).should('exist');
    const timelineEntries = [
      { title: 'Submitted', author: 'by Timmy Test', date: '03 July 2023' },
      { title: 'Rejected', author: 'by Timmy Test', date: '05 July 2023' },
      { title: 'Submitted', author: 'by Timmy Test', date: '07 July 2023' },
    ];

    timelineEntries.forEach((entry) => {
      cy.get(DOM_ELEMENTS.timeLineTitle).contains(entry.title).should('exist');
      cy.get(DOM_ELEMENTS.timelineAuthor).contains(entry.author).should('exist');
      cy.get(DOM_ELEMENTS.timelineDate).contains(entry.date).should('exist');
    });
  });

  it('(AC.4) should render summary tables under review account for AY', { tags: ['@PO-610', '@PO-584'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload);

    cy.get(DOM_ELEMENTS.heading).should('exist');
    cy.get(DOM_ELEMENTS.backLink).should('exist');

    // Account details
    cy.get(DOM_ELEMENTS.businessUnitData).should('exist');
    cy.get(DOM_ELEMENTS.accountTypeData).should('exist');
    cy.get(DOM_ELEMENTS.defendantTypeData).should('exist');

    // Personal details
    cy.get(DOM_ELEMENTS.summaryTitle).should('exist');
    cy.get(DOM_ELEMENTS.title).should('exist');
    cy.get(DOM_ELEMENTS.forenames).should('exist');
    cy.get(DOM_ELEMENTS.surname).should('exist');
    cy.get(DOM_ELEMENTS.aliases).should('exist');
    cy.get(DOM_ELEMENTS.dob).should('exist');
    cy.get(DOM_ELEMENTS.nationalInsuranceNumber).should('exist');
    cy.get(DOM_ELEMENTS.address).should('exist');
    cy.get(DOM_ELEMENTS.vehicleMakeOrModel).should('exist');
    cy.get(DOM_ELEMENTS.registrationNumber).should('exist');

    // Contact details
    cy.get(DOM_ELEMENTS.primaryEmailAddress).should('exist');
    cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('exist');
    cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('exist');
    cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('exist');
    cy.get(DOM_ELEMENTS.workTelephoneNumber).should('exist');

    // Employer details
    cy.get(DOM_ELEMENTS.employerName).should('exist');
    cy.get(DOM_ELEMENTS.employeeReference).should('exist');
    cy.get(DOM_ELEMENTS.employerEmailAddress).should('exist');
    cy.get(DOM_ELEMENTS.employerTelephoneNumber).should('exist');
    cy.get(DOM_ELEMENTS.employerAddress).should('exist');

    // Payment terms
    cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
    cy.get(DOM_ELEMENTS.payByDate).should('exist');
    cy.get(DOM_ELEMENTS.requestPaymentCard).should('exist');
    cy.get(DOM_ELEMENTS.hasDaysInDefault).should('exist');
    cy.get(DOM_ELEMENTS.enforcementActions).should('exist');

    // Account comments and notes
    cy.get(DOM_ELEMENTS.comments).should('exist');
    cy.get(DOM_ELEMENTS.accountNotes).should('exist');

    cy.get(DOM_ELEMENTS.businessUnitData).should('contain', 'Business unit');
    cy.get(DOM_ELEMENTS.accountTypeData).should('contain', 'Account type').should('contain', 'Fine');
    cy.get(DOM_ELEMENTS.defendantTypeData).should('contain', 'Defendant type').should('contain', 'Adult or youth only');

    cy.get(DOM_ELEMENTS.title).should('contain', 'Title').should('contain', 'Mr');
    cy.get(DOM_ELEMENTS.forenames).should('contain', 'First names').should('contain', 'John');
    cy.get(DOM_ELEMENTS.surname).should('contain', 'Last name').should('contain', 'Doe');
    cy.get(DOM_ELEMENTS.aliases).should('contain', 'Aliases').should('contain', 'Rebecca Johnson');
    cy.get(DOM_ELEMENTS.dob).should('contain', 'Date of birth').should('contain', '01 January 2000 (Adult)');
    cy.get(DOM_ELEMENTS.nationalInsuranceNumber)
      .should('contain', 'National Insurance number')
      .should('contain', 'AB123456C');
    cy.get(DOM_ELEMENTS.address)
      .should('contain', 'Address')
      .should('contain', '123 Fake Street')
      .should('contain', 'Fake Town')
      .should('contain', 'Fake City')
      .should('contain', 'AB12 3CD');
    cy.get(DOM_ELEMENTS.vehicleMakeOrModel).should('contain', 'Vehicle make and model').should('contain', 'Ford');
    cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'Registration number').should('contain', 'AB12 CDE');

    cy.get(DOM_ELEMENTS.primaryEmailAddress)
      .should('contain', 'Primary email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.secondaryEmailAddress)
      .should('contain', 'Secondary email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
      .should('contain', 'Mobile telephone number')
      .should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '0123456789');

    cy.get(DOM_ELEMENTS.employerName).should('contain', 'Employer name').should('contain', 'Test Company');
    cy.get(DOM_ELEMENTS.employeeReference).should('contain', 'Employee reference').should('contain', 'Test Reference');
    cy.get(DOM_ELEMENTS.employerEmailAddress)
      .should('contain', 'Employer email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.employerTelephoneNumber)
      .should('contain', 'Employer telephone number')
      .should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.employerAddress)
      .should('contain', 'Employer address')
      .should('contain', 'test address line 1')
      .should('contain', 'test address line 2')
      .should('contain', 'test address line 3')
      .should('contain', 'test address line 4')
      .should('contain', 'test address line 5')
      .should('contain', 'test post code');

    cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
    cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

    cy.get(DOM_ELEMENTS.changeLink).should('exist');
  });

  it('(AC.5) should render all elements on the screen for AYPG', { tags: ['@PO-610', '@PO-584'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload);
    finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';
    cy.get(DOM_ELEMENTS.heading).should('exist');
    cy.get(DOM_ELEMENTS.backLink).should('exist');

    // Account details
    cy.get(DOM_ELEMENTS.businessUnitData).should('exist');
    cy.get(DOM_ELEMENTS.accountTypeData).should('exist');
    cy.get(DOM_ELEMENTS.defendantTypeData).should('exist');

    // Personal details
    cy.get(DOM_ELEMENTS.summaryTitle).should('exist');
    cy.get(DOM_ELEMENTS.title).should('exist');
    cy.get(DOM_ELEMENTS.forenames).should('exist');
    cy.get(DOM_ELEMENTS.surname).should('exist');
    cy.get(DOM_ELEMENTS.aliases).should('exist');
    cy.get(DOM_ELEMENTS.dob).should('exist');
    cy.get(DOM_ELEMENTS.nationalInsuranceNumber).should('exist');
    cy.get(DOM_ELEMENTS.address).should('exist');

    // Contact details
    cy.get(DOM_ELEMENTS.primaryEmailAddress).should('exist');
    cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('exist');
    cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('exist');
    cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('exist');
    cy.get(DOM_ELEMENTS.workTelephoneNumber).should('exist');

    // Employer details
    cy.get(DOM_ELEMENTS.employerName).should('exist');
    cy.get(DOM_ELEMENTS.employeeReference).should('exist');
    cy.get(DOM_ELEMENTS.employerEmailAddress).should('exist');
    cy.get(DOM_ELEMENTS.employerTelephoneNumber).should('exist');
    cy.get(DOM_ELEMENTS.employerAddress).should('exist');

    // Payment terms
    cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
    cy.get(DOM_ELEMENTS.payByDate).should('exist');
    cy.get(DOM_ELEMENTS.requestPaymentCard).should('exist');
    cy.get(DOM_ELEMENTS.hasDaysInDefault).should('exist');
    cy.get(DOM_ELEMENTS.enforcementActions).should('exist');

    // Account comments and notes
    cy.get(DOM_ELEMENTS.comments).should('exist');
    cy.get(DOM_ELEMENTS.accountNotes).should('exist');

    //parent guardian details
    cy.get(DOM_ELEMENTS.PGforenames).should('exist');
    cy.get(DOM_ELEMENTS.PGsurname).should('exist');
    cy.get(DOM_ELEMENTS.aliases).should('exist');
    cy.get(DOM_ELEMENTS.PGdob).should('exist');
    cy.get(DOM_ELEMENTS.PGnationalInsuranceNumber).should('exist');
    cy.get(DOM_ELEMENTS.PGaddress).should('exist');
    cy.get(DOM_ELEMENTS.PGvehicleMakeOrModel).should('exist');
    cy.get(DOM_ELEMENTS.PGregistrationNumber).should('exist');

    finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';

    cy.get(DOM_ELEMENTS.businessUnitData).should('contain', 'Business unit');
    cy.get(DOM_ELEMENTS.accountTypeData).should('contain', 'Account type').should('contain', 'Fine');
    cy.get(DOM_ELEMENTS.defendantTypeData)
      .should('contain', 'Defendant type')
      .should('contain', 'Adult or youth with parent or guardian to pay');

    cy.get(DOM_ELEMENTS.PGforenames).should('contain', 'Test');
    cy.get(DOM_ELEMENTS.PGsurname).should('contain', 'test');
    cy.get(DOM_ELEMENTS.PGAliases).should('contain', 'test test');
    cy.get(DOM_ELEMENTS.PGdob).should('contain', '01 February 1990');
    cy.get(DOM_ELEMENTS.PGnationalInsuranceNumber).should('contain', 'AB123456C');
    cy.get(DOM_ELEMENTS.PGaddress)
      .should('contain', 'Address')
      .should('contain', 'test address line 1')
      .should('contain', 'test address line 2')
      .should('contain', 'test address line 3')
      .should('contain', 'test post code');

    cy.get(DOM_ELEMENTS.PGvehicleMakeOrModel).should('contain', 'renault');
    cy.get(DOM_ELEMENTS.PGregistrationNumber).should('contain', 'cd12 efg');

    cy.get(DOM_ELEMENTS.title).should('contain', 'Title').should('contain', 'Mr');
    cy.get(DOM_ELEMENTS.forenames).should('contain', 'First names').should('contain', 'John');
    cy.get(DOM_ELEMENTS.surname).should('contain', 'Last name').should('contain', 'Doe');
    cy.get(DOM_ELEMENTS.aliases).should('contain', 'Aliases').should('contain', 'Rebecca Johnson');
    cy.get(DOM_ELEMENTS.dob).should('contain', 'Date of birth').should('contain', '01 January 2000 (Adult)');
    cy.get(DOM_ELEMENTS.nationalInsuranceNumber)
      .should('contain', 'National Insurance number')
      .should('contain', 'AB123456C');
    cy.get(DOM_ELEMENTS.address)
      .should('contain', 'Address')
      .should('contain', '123 Fake Street')
      .should('contain', 'Fake Town')
      .should('contain', 'Fake City')
      .should('contain', 'AB12 3CD');

    cy.get(DOM_ELEMENTS.primaryEmailAddress)
      .should('contain', 'Primary email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.secondaryEmailAddress)
      .should('contain', 'Secondary email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
      .should('contain', 'Mobile telephone number')
      .should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '0123456789');

    cy.get(DOM_ELEMENTS.employerName).should('contain', 'Employer name').should('contain', 'Test Company');
    cy.get(DOM_ELEMENTS.employeeReference).should('contain', 'Employee reference').should('contain', 'Test Reference');
    cy.get(DOM_ELEMENTS.employerEmailAddress)
      .should('contain', 'Employer email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.employerTelephoneNumber)
      .should('contain', 'Employer telephone number')
      .should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.employerAddress)
      .should('contain', 'Employer address')
      .should('contain', 'test address line 1')
      .should('contain', 'test address line 2')
      .should('contain', 'test address line 3')
      .should('contain', 'test address line 4')
      .should('contain', 'test address line 5')
      .should('contain', 'test post code');

    cy.get(DOM_ELEMENTS.paymentTerms).should('contain', 'Payment terms').should('contain', 'Pay in full');
    cy.get(DOM_ELEMENTS.payByDate).should('contain', 'Pay by date').should('contain', '01 January 2022');
    cy.get(DOM_ELEMENTS.requestPaymentCard).should('contain', 'Request payment card').should('contain', 'Yes');
    cy.get(DOM_ELEMENTS.hasDaysInDefault).should('contain', 'There are days in default').should('contain', 'No');
    cy.get(DOM_ELEMENTS.enforcementActions).should('contain', 'Enforcement action').should('contain', 'No');

    cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
    cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

    cy.get(DOM_ELEMENTS.changeLink).should('exist');
  });

  it(
    '(AC.6) should render all elements on the screen for company defendant type',
    { tags: ['@PO-610', '@PO-584'] },
    () => {
      setupComponent(finesAccountPayload, finesAccountPayload);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      cy.get(DOM_ELEMENTS.heading).should('exist');
      cy.get(DOM_ELEMENTS.backLink).should('exist');

      // Account details
      cy.get(DOM_ELEMENTS.businessUnitData).should('exist');
      cy.get(DOM_ELEMENTS.accountTypeData).should('exist');
      cy.get(DOM_ELEMENTS.defendantTypeData).should('exist');

      // Company Details
      cy.get(DOM_ELEMENTS.companyName).should('exist');
      cy.get(DOM_ELEMENTS.companyAliases).should('exist');
      cy.get(DOM_ELEMENTS.companyAddress).should('exist');

      // Contact details
      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('exist');

      // Payment terms
      cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
      cy.get(DOM_ELEMENTS.payByDate).should('exist');
      cy.get(DOM_ELEMENTS.enforcementActions).should('exist');

      // Account comments and notes
      cy.get(DOM_ELEMENTS.comments).should('exist');
      cy.get(DOM_ELEMENTS.accountNotes).should('exist');

      cy.get(DOM_ELEMENTS.businessUnitData).should('contain', 'Business unit');
      cy.get(DOM_ELEMENTS.accountTypeData).should('contain', 'Account type').should('contain', 'Fine');
      cy.get(DOM_ELEMENTS.defendantTypeData).should('contain', 'Defendant type').should('contain', 'Company');

      cy.get(DOM_ELEMENTS.companyName).should('contain', 'Company name').should('contain', 'test company');
      cy.get(DOM_ELEMENTS.companyAliases).should('contain', 'Aliases').should('contain', 'test alias');
      cy.get(DOM_ELEMENTS.companyAddress)
        .should('contain', 'Address')
        .should('contain', 'test address line 1')
        .should('contain', 'test address line 2')
        .should('contain', 'test address line 3')
        .should('contain', 'test post code');

      cy.get(DOM_ELEMENTS.primaryEmailAddress)
        .should('contain', 'Primary email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress)
        .should('contain', 'Secondary email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
        .should('contain', 'Mobile telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber)
        .should('contain', 'Home telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.workTelephoneNumber)
        .should('contain', 'Work telephone number')
        .should('contain', '0123456789');

      cy.get(DOM_ELEMENTS.paymentTerms).should('contain', 'Payment terms').should('contain', 'Pay in full');
      cy.get(DOM_ELEMENTS.payByDate).should('contain', 'Pay by date').should('contain', '01 January 2022');
      cy.get(DOM_ELEMENTS.enforcementActions).should('contain', 'Enforcement action').should('contain', 'No');

      cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

      cy.get(DOM_ELEMENTS.changeLink).should('exist');
    },
  );

  it(
    '(AC.7) should show dashed line if Data is empty for non required details for all defendant types',
    { tags: ['@PO-610', '@PO-584'] },
    () => {
      setupComponent(finesAccountPayload, finesAccountPayload);
      const defendantTypes = ['adultOrYouthOnly', 'parentOrGuardianToPay', 'company'];
      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: '',
        fm_contact_details_email_address_2: '',
        fm_contact_details_telephone_number_business: '',
        fm_contact_details_telephone_number_home: '',
        fm_contact_details_telephone_number_mobile: '',
      };
      finesMacState.accountCommentsNotes.formData = {
        fm_account_comments_notes_comments: '',
        fm_account_comments_notes_notes: '',
      };
      cy.wrap(defendantTypes).each((type: string) => {
        cy.then(() => {
          finesMacState.accountDetails.formData.fm_create_account_defendant_type = type;
          cy.get(DOM_ELEMENTS.primaryEmailAddress).should('contain', 'Primary email address').should('contain', '—');
          cy.get(DOM_ELEMENTS.secondaryEmailAddress)
            .should('contain', 'Secondary email address')
            .should('contain', '—');
          cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
            .should('contain', 'Mobile telephone number')
            .should('contain', '—');
          cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '—');
          cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '—');

          cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', '—');
          cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', '—');
        });
      });
    },
  );
});
