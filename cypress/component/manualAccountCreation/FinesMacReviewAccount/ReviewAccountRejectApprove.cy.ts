import { mount } from 'cypress/angular';
import { FinesMacReviewAccountComponent } from 'src/app/flows/fines/fines-mac/fines-mac-review-account/fines-mac-review-account.component';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
//../../../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock
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
import { DOM_ELEMENTS } from 'cypress/component/manualAccountCreation/FinesDraft/FinesDraftCheckAndValidate/FinesDraftCheckAndValidate/constants/fines_draft_review_account_elements';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FINES_DRAFT_STATE } from 'src/app/flows/fines/fines-draft/constants/fines-draft-state.constant';
import { DRAFT_SESSION_USER_STATE_MOCK } from '../../../../cypress/component/manualAccountCreation/FinesMacReviewAccount/mocks/check-and-validate-session-mock';
import { getToday } from 'cypress/support/utils/dateUtils';

describe('ReviewAccountRejectedApproveComponent', () => {
  let finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
  let finesDraftState = structuredClone(FINES_DRAFT_STATE);
  let finesAccountPayload = FINES_MAC_PAYLOAD_ADD_ACCOUNT;

  let store: any;
  const setupComponent = (
    finesDraftStateMock: any = finesDraftState,
    activatedRouteMock: any = null,
    amend: boolean = true,
    checker: boolean = true,
  ) => {
    mount(FinesMacReviewAccountComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        UtilsService,
        FinesMacPayloadService,
        Router,
        {
          provide: GlobalStore,
          useFactory: () => {
            let store = new GlobalStore();
            store.setUserState(DRAFT_SESSION_USER_STATE_MOCK);
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
            store.setChecker(checker);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                reviewAccountFetchMap: {
                  finesMacStore: finesMacState,
                  finesMacDraft: activatedRouteMock,
                },
                results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
                majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
                localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
                courts: OPAL_FINES_COURT_REF_DATA_MOCK,
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
    cy.intercept('POST', '**/opal-fines-service/draft-accounts/**', {
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

  it('(AC.4) should render summary tables under review account for AY', { tags: ['@PO-594'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload, true);

    cy.get(DOM_ELEMENTS.heading).should('exist');
    cy.get(DOM_ELEMENTS.backLink).should('exist');
    cy.get(DOM_ELEMENTS.status).should('exist').and('contain', 'In review');

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
    cy.get(DOM_ELEMENTS.approveRadioButton).should('exist');
    cy.get(DOM_ELEMENTS.rejectRadioButton).should('exist');
    cy.get(DOM_ELEMENTS.continue).should('exist');
    cy.get(DOM_ELEMENTS.deleteLink).should('exist');
  });

  it('(AC.5) should render all elements on the screen for AYPG', { tags: ['@PO-594'] }, () => {
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
    cy.get(DOM_ELEMENTS.approveRadioButton).should('exist');
    cy.get(DOM_ELEMENTS.rejectRadioButton).should('exist');
    cy.get(DOM_ELEMENTS.continue).should('exist');
    cy.get(DOM_ELEMENTS.deleteLink).should('exist');
  });

  it('(AC.6) should render all elements on the screen for company defendant type', { tags: ['@PO-594'] }, () => {
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
    cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '0123456789');

    cy.get(DOM_ELEMENTS.paymentTerms).should('contain', 'Payment terms').should('contain', 'Pay in full');
    cy.get(DOM_ELEMENTS.payByDate).should('contain', 'Pay by date').should('contain', '01 January 2022');
    cy.get(DOM_ELEMENTS.enforcementActions).should('contain', 'Enforcement action').should('contain', 'No');

    cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
    cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

    cy.get(DOM_ELEMENTS.changeLink).should('exist');
    cy.get(DOM_ELEMENTS.approveRadioButton).should('exist');
    cy.get(DOM_ELEMENTS.rejectRadioButton).should('exist');
    cy.get(DOM_ELEMENTS.continue).should('exist');
    cy.get(DOM_ELEMENTS.deleteLink).should('exist');
  });

  it(
    '(AC.7) should show dashed line if Data is empty for non required details for all defendant types',
    { tags: ['@PO-594'] },
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
        fm_account_comments_notes_system_notes: '',
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
  it('AC.2 The Review Account screen will be created as per the design artefact', { tags: ['@PO-594'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload, false, true);

    cy.get(DOM_ELEMENTS.reviewComponent).should('exist');

    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Mr John DOE');
    cy.get(DOM_ELEMENTS.accountStatus).should('exist').and('contain', 'In review');
  });

  it('AC.8, Decision table will be shown as per the design artefact', { tags: ['@PO-594'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload, false, true);
    cy.get(DOM_ELEMENTS.approveRadioButton).should('exist');
    cy.get(DOM_ELEMENTS.rejectRadioButton).should('exist').click();
    cy.get(DOM_ELEMENTS.rejectionText).should('exist');
    cy.get(DOM_ELEMENTS.continue).should('exist');
    cy.get(DOM_ELEMENTS.deleteLink).should('exist');
  });
  it('AC.8a user does not select any radio button and selects the Continue button', { tags: ['@PO-594'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload, false, true);
    cy.get(DOM_ELEMENTS.continue).should('exist').click();
    cy.get(DOM_ELEMENTS.heading).contains('Mr John DOE').should('exist');
    cy.get('p').should('contain', 'Select whether approved or rejected');
  });
  it(
    'AC.8b,AC.8c,AC.8ci user does not select any radio button and selects the Continue button',
    { tags: ['@PO-594'] },
    () => {
      setupComponent(finesAccountPayload, finesAccountPayload, false, true);
      cy.get(DOM_ELEMENTS.rejectRadioButton).should('exist').click();
      cy.get(DOM_ELEMENTS.continue).should('exist').click();
      cy.get(DOM_ELEMENTS.heading).contains('Mr John DOE').should('exist');
      cy.get('p').should('contain', 'Enter reason for rejection');

      //when user enters non acceptable characters into rejection text box
      cy.get(DOM_ELEMENTS.textArea).should('exist').type('*');
      cy.get(DOM_ELEMENTS.continue).should('exist').click();
      cy.get(DOM_ELEMENTS.heading).contains('Mr John DOE').should('exist');
      cy.get('p').should(
        'contain',
        'Reason for rejection must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      );
    },
  );

  //PO-969
  it('AC.1b update draft account with patch method', { tags: ['@PO-969'] }, () => {
    cy.intercept('PATCH', '**/opal-fines-service/draft-accounts/**', { statusCode: 200 }).as('patchDraftAccount');
    let payload = structuredClone(finesAccountPayload);
    payload.draft_account_id = 342;
    setupComponent(finesAccountPayload, payload, false, true);

    cy.get(DOM_ELEMENTS.rejectRadioButton).should('exist').click();
    cy.get(DOM_ELEMENTS.rejectionText).type('I have rejected this account because the surname is incorrect');
    cy.get(DOM_ELEMENTS.continue).click();

    cy.wait('@patchDraftAccount').then(({ request }) => {
      expect(request.body).to.exist;
      expect(request.url).to.include('/opal-fines-service/draft-accounts/342');
      expect(request.method).to.equal('PATCH');

      expect(request.body).to.have.property('account_status', 'Rejected');
      expect(request.body).to.have.property('timeline_data');

      expect(request.body.timeline_data[0]).to.have.property('username', 'Timmy Test');
      expect(request.body.timeline_data[0]).to.have.property('status', 'Submitted');
      expect(request.body.timeline_data[0]).to.have.property('status_date', '2023-07-03');
      expect(request.body.timeline_data[0]).to.have.property('reason_text', null);

      expect(request.body.timeline_data[1]).to.have.property('username', 'Timmy Test');
      expect(request.body.timeline_data[1]).to.have.property('status', 'Rejected');
      expect(request.body.timeline_data[1]).to.have.property('status_date', getToday());
      expect(request.body.timeline_data[1]).to.have.property(
        'reason_text',
        'I have rejected this account because the surname is incorrect',
      );
    });
  });


});
