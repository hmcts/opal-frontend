import {
  interceptAtAGlance,
  interceptDefendantHeader,
  interceptMinorCreditorHeader,
} from './intercept/defendantAccountIntercepts';

// constants + mocks
import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as DOM } from './constants/account_enquiry_header_elements';
import {
  DEFENDANT_HEADER_MOCK,
  DEFENDANT_HEADER_YOUTH_MOCK,
  DEFENDANT_HEADER_ORG_MOCK,
} from './mocks/defendant_details_mock';

import {
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from '../../CommonIntercepts/CommonUserState.mocks';

import { FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK } from 'src/app/flows/fines/fines-acc/fines-acc-minor-creditor-details/mocks/fines-acc-minor-creditor-details-header.mock';

import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from './mocks/defendant_details_at_glance_mock';

describe('Account Enquiry - Defendant Header', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  const componentProperties: IComponentProperties = {
    accountId: '77',
    fragments: undefined,
    interceptedRoutes: [
      '/access-denied',
      '../note/add',
      '../debtor/individual/amend',
      '../debtor/parentGuardian/amend',
      // Add more routes here as needed
    ],
  };

  it('AC1a: renders the Defendant Account Header Summary', { tags: ['PO-1593', 'PO-866'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get(DOM.pageHeader).should('exist');
    cy.get(DOM.headingWithCaption).should('exist');
    cy.get(DOM.headingName).should('exist').and('contain.text', 'Mr Anna GRAHAM');
    cy.get(DOM.accountInfo).should('exist');
    cy.get(DOM.summaryMetricBar).should('exist');
    cy.get(DOM.subnav).should('exist');
    cy.get(DOM.atAGlanceTabComponent).should('exist');
  });

  it('AC1a: renders the Company Account Header Summary', { tags: ['PO-867'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, DEFENDANT_HEADER_ORG_MOCK, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get(DOM.pageHeader).should('exist');
    cy.get(DOM.headingWithCaption).should('exist');
    cy.get(DOM.headingName).should('exist').and('contain.text', 'Sainsco');
    cy.get(DOM.accountInfo).should('exist');
    cy.get(DOM.summaryMetricBar).should('exist');
    cy.get(DOM.subnav).should('exist');
    cy.get(DOM.atAGlanceTabComponent).should('exist');
  });

  it(
    'AC1b: applies field rules (PCR uppercase, BU formatting, summary labels)',
    { tags: ['PO-1593', 'PO-866'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.prosecutor_case_reference = 'ref123'; // UI should uppercase
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.accountInfo).within(() => {
        cy.contains(DOM.labelAccountType).should('be.visible');
        cy.contains(String(header.account_type)).should('be.visible');

        cy.contains(DOM.labelCaseNumber).should('be.visible');
        cy.contains('REF123').should('be.visible');

        cy.contains(DOM.labelBusinessUnit).should('be.visible');
        cy.contains(header.business_unit_summary.business_unit_name).should('be.visible');
        cy.contains(`(${header.business_unit_summary.business_unit_id})`).should('be.visible');
      });

      cy.get(DOM.summaryMetricBar).within(() => {
        cy.contains(DOM.labelImposed).should('be.visible');
        cy.contains(DOM.labelArrears).should('be.visible');
        cy.contains('£').should('exist'); // any currency value in the bar
      });
    },
  );

  it(
    'AC1b: applies field rules (PCR uppercase, BU formatting, summary labels) - Company',
    { tags: ['PO-1593', 'PO-866'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
      header.prosecutor_case_reference = 'ref123'; // UI should uppercase

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.accountInfo).within(() => {
        cy.contains(DOM.labelAccountType).should('be.visible');
        cy.contains(String(header.account_type)).should('be.visible');

        cy.contains(DOM.labelCaseNumber).should('be.visible');
        cy.contains('REF123').should('be.visible');

        cy.contains(DOM.labelBusinessUnit).should('be.visible');
        cy.contains(header.business_unit_summary.business_unit_name).should('be.visible');
        cy.contains(`(${header.business_unit_summary.business_unit_id})`).should('be.visible');
      });

      cy.get(DOM.summaryMetricBar).within(() => {
        cy.contains(DOM.labelImposed).should('be.visible');
        cy.contains(DOM.labelArrears).should('be.visible');
        cy.contains('£').should('exist'); // any currency value in the bar
      });
    },
  );

  // ONLY Youth tag when youth is the debtor and no P/G associated
  it(
    'AC2: shows ONLY "Youth Account" when youth=true, debtor=Defendant, and no Parent/Guardian',
    { tags: ['PO-1593'] },
    () => {
      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 15); // 15 years old

      const header = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
      header.is_youth = true;
      header.debtor_type = 'Defendant';
      header.parent_guardian_party_id = null;
      header.party_details.individual_details = {
        ...header.party_details.individual_details!,
        date_of_birth: '2010-06-15',
        age: '14',
      };

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.log('header', header);

      cy.get(DOM.statusTag).should('exist').and('contain.text', 'Youth Account');
    },
  );

  it('AC2: shows ONLY "Parent or Guardian" when youth=true, debtor=Parent/Guardian', { tags: ['PO-866'] }, () => {
    const header = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
    header.debtor_type = 'Parent/Guardian';
    header.parent_guardian_party_id = '99';

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, header, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get(DOM.statusTag)
      .should('exist')
      .and('contain.text', 'Parent or Guardian to pay')
      .and('have.class', 'govuk-tag');
    cy.get(DOM.statusTag).should('not.contain.text', 'Youth Account');
  });

  //  ONLY "Parent or Guardian to pay" (even if youth)
  it('AC2i: Youth defendant who is not the debtor hides "Youth" label', { tags: ['PO-1593', 'PO-866'] }, () => {
    const header = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
    header.debtor_type = 'Parent/Guardian';
    header.parent_guardian_party_id = '99';

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, header, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get(DOM.statusTag).should('not.contain.text', 'Youth Account');
    cy.get(DOM.statusTag).should('contain.text', 'Parent or Guardian to pay');
  });

  //  Adult defendant → no tag at all
  it('AC2a: renders no tag for adult defendants', { tags: ['PO-1593'] }, () => {
    const adult = structuredClone(DEFENDANT_HEADER_MOCK);
    adult.is_youth = false;
    adult.debtor_type = 'Defendant';
    adult.parent_guardian_party_id = null;

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, adult, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get(DOM.statusTag).should('not.exist');
  });

  // Negative balance prefixed with minus (e.g. -£4.50)
  it('AC3: negative balance is prefixed with a minus', { tags: ['PO-1593', 'PO-866'] }, () => {
    const header = structuredClone(DEFENDANT_HEADER_MOCK);
    header.payment_state_summary.account_balance = -4.5;

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, header, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get(DOM.summaryMetricBar)
      .contains(/-£\s*4\.50|−£\s*4\.50/)
      .should('exist');
  });

  it('AC3: negative balance is prefixed with a minus - Company', { tags: ['PO-867'] }, () => {
    const header = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
    header.payment_state_summary.account_balance = -4.5;

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, header, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get(DOM.summaryMetricBar)
      .contains(/-£\s*4\.50|−£\s*4\.50/)
      .should('exist');
  });

  it('AC4: shows "Add account note" when user has permission', { tags: ['PO-1593', 'PO-866', 'PO-867'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get(DOM.addNoteButton).should('exist').and('be.enabled');
  });

  it('AC4: Calls add note path when user has permission in this BU', { tags: ['PO-1593', 'PO-866', 'PO-867'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get(DOM.addNoteButton).click();
    cy.get('@routerNavigate')
      .its('lastCall.args.0')
      .should((arg0) => {
        const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
        expect(path).to.match(/note\/add/);
      });
  });

  it(
    'AC4a: Calls error path when user has no permission in this BU only in other BU',
    { tags: ['PO-1593', 'PO-866', 'PO-867'] },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.addNoteButton).click();
      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/access-denied/);
        });
    },
  );

  it('AC4b: hides "Add account note" when user has no permission in any BU', { tags: ['PO-1593', 'PO-866'] }, () => {
    interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
    interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get(DOM.addNoteButton).should('not.exist');
  });

  it('AC3: shows "Add account note" when user has permission - Company', { tags: ['PO-867'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, DEFENDANT_HEADER_ORG_MOCK, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get(DOM.addNoteButton).should('exist').and('be.enabled');
  });
  it('AC3: Calls add note path when user has permission in this BU - Company', { tags: ['PO-867'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, DEFENDANT_HEADER_ORG_MOCK, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);
    cy.get(DOM.addNoteButton).click();
    cy.get('@routerNavigate')
      .its('lastCall.args.0')
      .should((arg0) => {
        const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
        expect(path).to.match(/note\/add/);
      });
  });

  it(
    'AC3a: Calls error path when user has no permission in this BU only in other BU - Company',
    { tags: ['PO-867'] },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(77, DEFENDANT_HEADER_ORG_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);
      cy.get(DOM.addNoteButton).click();
      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/access-denied/);
        });
    },
  );

  it('AC3b: hides "Add account note" when user has no permission in any BU - Company', { tags: ['PO-867'] }, () => {
    interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
    interceptDefendantHeader(77, DEFENDANT_HEADER_ORG_MOCK, '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);
    cy.get(DOM.addNoteButton).should('not.exist');
  });
});

describe('Account Enquiry - Minor Creditor Header', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  const minorCreditorAccountId = FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK.account_number;
  const minorCreditorComponentProperties: IComponentProperties = {
    accountId: minorCreditorAccountId,
    routeRoot: 'minor-creditor',
    fragments: undefined,
    interceptedRoutes: [
      '/access-denied',
      '../note/add',
      '../debtor/individual/amend',
      '../debtor/parentGuardian/amend',
      // Add more routes here as needed
    ],
  };

  it.only('AC1, AC2a: renders the Minor Creditor Account Header Summary', { tags: ['PO-1924'] }, () => {
    const header = structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);
    header.has_associated_defendant = true;
    header.awaiting_payout_amount = 100;
    header.awarded_amount = 200;
    header.paid_out_amount = 50;
    header.outstanding_amount = 150;

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptMinorCreditorHeader(minorCreditorAccountId, header, '1');
    setupAccountEnquiryComponent(minorCreditorComponentProperties);

    cy.get(DOM.pageHeader).should('exist');
    cy.get(DOM.minorCreditorAccountType).should('contain.text', 'Minor Creditor');
    cy.get(DOM.minorCreditorBusinessUnit).should('contain.text', 'Camberwell Green (77)');

    cy.get(DOM.summaryMetricBar).within(() => {
      cy.contains(DOM.labelAwaitingPayout)
        .should('be.visible')
        .closest(DOM.summaryMetricBarItem)
        .should('contain.text', '£100.00');
      cy.contains(DOM.labelAwarded)
        .should('be.visible')
        .closest(DOM.summaryMetricBarItem)
        .should('contain.text', '£200.00');
      cy.contains(DOM.labelPaidOut)
        .should('be.visible')
        .closest(DOM.summaryMetricBarItem)
        .should('contain.text', '£50.00');
      cy.contains(DOM.labelOutstanding)
        .should('be.visible')
        .closest(DOM.summaryMetricBarItem)
        .should('contain.text', '£150.00');
    });
  });

  it.only('AC3a: shows add account note button and navigates to add note page', { tags: ['PO-1924'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptMinorCreditorHeader(minorCreditorAccountId, FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK, '1');
    setupAccountEnquiryComponent(minorCreditorComponentProperties);

    cy.get(DOM.pageHeader).should('exist');
    cy.get(DOM.minorCreditorAddNoteButton).should('exist').click();
    cy.get('@routerNavigate')
      .its('lastCall.args.0')
      .should((arg0) => {
        const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
        expect(path).to.match(/note\/add/);
      });
  });

  it.only(
    'AC3b: access denied when user has no permission and minor creditor does have permission',
    { tags: ['PO-1924'] },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptMinorCreditorHeader(minorCreditorAccountId, FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK, '1');
      setupAccountEnquiryComponent(minorCreditorComponentProperties);

      cy.get(DOM.minorCreditorAddNoteButton).should('exist').click();
      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/access-denied/);
        });
    },
  );
});
