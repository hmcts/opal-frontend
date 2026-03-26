import { DOM_ELEMENTS as ENF_OVR } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement-override-add.locators';
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENF } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { setupAccountEnquiryComponent } from '../accountEnquiry/setup/SetupComponent';
import { IComponentProperties } from '../accountEnquiry/setup/setupComponent.interface';
import { DOM_ELEMENTS as VERSION_CONTROL } from '../accountEnquiry/constants/global_version_control_elements';
import {
  interceptAuthenticatedUser,
  interceptUserState,
  interceptResultByCode,
  interceptEnforcementOverrideResults,
  interceptLocalJusticeAreas,
  interceptEnforcers,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import {
  interceptAtAGlance,
  interceptDefendantHeader,
  interceptEnforcementStatus,
  interceptPatchDefendantAccount,
} from '../accountEnquiry/intercept/defendantAccountIntercepts';
import { createDefendantHeaderMockWithName } from '../accountEnquiry/mocks/defendant_details_mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { defendantAccountAtAGlanceResolver } from '@app/flows/fines/fines-acc/routing/resolvers/defendant-account-at-a-glance.resolver';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '../accountEnquiry/mocks/defendant_details_at_glance_mock';

const componentProperties: IComponentProperties = {
  accountId: '77',
  fragments: 'enforcement',
  interceptedRoutes: [
    '/access-denied',
    '../note/add',
    '../debtor/individual/amend',
    '../debtor/parentGuardian/amend',
    '../enforcement/amend',
    '../enforcement/amend-denied',
    // Add more routes here as needed
  ],
};
function commonSetup() {
  let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
  headerMock.debtor_type = 'individual';
  let enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
  enforcementMock.enforcement_override!.enforcement_override_result = {
    enforcement_override_result_id: null,
    enforcement_override_result_name: null,
  };

  const accountId = headerMock.defendant_account_party_id;
  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, 'W/"123456"');
  interceptDefendantHeader(accountId, headerMock, '123');
  interceptEnforcementStatus(accountId, enforcementMock, '123');

  interceptEnforcementOverrideResults();
  interceptLocalJusticeAreas();
  interceptEnforcers();

  ['ABDC', 'AEOC', 'BWTD', 'BWTU', 'CLAMPO', 'CWN', 'DW', 'MAN', 'NBWT', 'REGF', 'SUMA', 'TFOOUT'].forEach((code) =>
    interceptResultByCode(code),
  );
  interceptPatchDefendantAccount();

  setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
  cy.get(ENF.addEnforcementOverrideLink).click();

  return { accountId };
}

describe('Add Enforcement Override', () => {
  it('AC1a, AC1b. Should render the form with title', () => {
    commonSetup();

    cy.get(ENF_OVR.title).should('contain.text', 'Mr Robert THOMSON - 177A');
    cy.get(ENF_OVR.title).should('contain.text', 'Add enforcement override');
  });

  it('AC1c, AC1d. Select an enforcement override dropdown, add override button and cancel link', () => {
    commonSetup();

    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    cy.get(ENF_OVR.enfOverrideDropdown).click();
    cy.get(ENF_OVR.dropdownOptions).contains('ABDC').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('AEOC').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('BWTD').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('BWTU').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('CLAMPO').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('CWN').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('DW').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('FSN').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('MAN').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('NBWT').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('REGF').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('SUMA').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('TFOOUT').should('exist');

    cy.get(ENF_OVR.addOverrideButton).should('exist');
    cy.get(ENF_OVR.cancelLink).should('exist');
  });

  it('AC2. Enforcer dropdown for valid override', () => {
    commonSetup();

    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    cy.get(ENF_OVR.enfOverrideDropdown).click().type('AB');
    cy.get(ENF_OVR.dropdownOptions).contains('ABDC').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('AEOC').should('not.exist');
    cy.get(ENF_OVR.dropdownOptions).contains('BWTD').should('not.exist');
    cy.get(ENF_OVR.dropdownOptions).contains('BWTU').should('not.exist');
    cy.get(ENF_OVR.dropdownOptions).contains('CLAMPO').should('not.exist');
    cy.get(ENF_OVR.dropdownOptions).contains('CWN').should('not.exist');
    cy.get(ENF_OVR.dropdownOptions).contains('DW').should('not.exist');
    cy.get(ENF_OVR.dropdownOptions).contains('FSN').should('not.exist');
    cy.get(ENF_OVR.dropdownOptions).contains('MAN').should('not.exist');
    cy.get(ENF_OVR.dropdownOptions).contains('NBWT').should('not.exist');
    cy.get(ENF_OVR.dropdownOptions).contains('REGF').should('not.exist');
    cy.get(ENF_OVR.dropdownOptions).contains('SUMA').should('not.exist');
    cy.get(ENF_OVR.dropdownOptions).contains('TFOOUT').should('not.exist');

    cy.get(ENF_OVR.dropdownOptions).contains('ABDC').click();
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'ABDC');

    cy.get(ENF_OVR.enforcerDropdown).should('exist');
    cy.get(ENF_OVR.enforcerDropdown).click();
    cy.get(ENF_OVR.dropdownOptions).contains('The DWP (3)').should('exist');
  });

  it('AC3. LJA dropdown for valid override', () => {
    commonSetup();

    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    cy.get(ENF_OVR.enfOverrideDropdown).click().type('TFO');
    cy.get(ENF_OVR.dropdownOptions).contains('TFOOUT').should('exist');

    cy.get(ENF_OVR.dropdownOptions).contains('TFOOUT').click();
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'TFOOUT');
    cy.get(ENF_OVR.localJusticeAreaDropdown).should('exist');
    cy.get(ENF_OVR.localJusticeAreaDropdown).click();
    cy.get(ENF_OVR.dropdownOptions).contains("Bedfordshire Magistrates' Court (4165)").should('exist');
  });

  it('AC4a. Error when no enforcement override is selected', () => {
    commonSetup();

    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    cy.get(ENF_OVR.addOverrideButton).click();
    cy.get(ENF_OVR.errorSummary)
      .should('exist')
      .contains('There is a problem')
      .next()
      .should('contain.text', 'Select an enforcement override');
  });

  it('AC4b. Error when no enforcer is selected', () => {
    commonSetup();

    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    cy.get(ENF_OVR.enfOverrideDropdown).click().type('BW');
    cy.get(ENF_OVR.dropdownOptions).contains('BWTD').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('BWTU').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('BWTD').click();
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'BWTD');
    cy.get(ENF_OVR.enforcerDropdown).should('exist');

    cy.get(ENF_OVR.addOverrideButton).click();
    cy.get(ENF_OVR.errorSummary)
      .should('exist')
      .contains('There is a problem')
      .next()
      .should('contain.text', 'Select an enforcer');
  });

  it('AC4c. Error when no LJA is selected', () => {
    commonSetup();

    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    cy.get(ENF_OVR.enfOverrideDropdown).click().type('TFO');
    cy.get(ENF_OVR.dropdownOptions).contains('TFOOUT').should('exist');
    cy.get(ENF_OVR.dropdownOptions).contains('TFOOUT').click();
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'TFOOUT');
    cy.get(ENF_OVR.localJusticeAreaDropdown).should('exist');

    cy.get(ENF_OVR.addOverrideButton).click();
    cy.get(ENF_OVR.errorSummary)
      .should('exist')
      .contains('There is a problem')
      .next()
      .should('contain.text', 'Select a Local Justice Area');
  });

  it('AC5. Valid submission returns to Enforcement tab with success banner and new override panel', () => {
    const { accountId } = commonSetup();
    const updatedEnforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

    updatedEnforcementMock.enforcement_override!.enforcement_override_result = {
      enforcement_override_result_id: 'TFOOUT',
      enforcement_override_result_name: 'Transfer of Fine Order to a Court in England or Wales',
    };
    updatedEnforcementMock.enforcement_override!.enforcer = {
      enforcer_id: 0,
      enforcer_name: '',
    };
    updatedEnforcementMock.enforcement_override!.lja = {
      lja_id: 4165,
      lja_name: "Bedfordshire Magistrates' Court",
    };

    interceptEnforcementStatus(accountId, updatedEnforcementMock, '124');

    cy.get(ENF_OVR.enfOverrideDropdown).click().type('TFO');
    cy.get(ENF_OVR.dropdownOptions).contains('TFOOUT').click();
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'TFOOUT');

    cy.get(ENF_OVR.localJusticeAreaDropdown).click();
    cy.get(ENF_OVR.dropdownOptions).contains("Bedfordshire Magistrates' Court (4165)").click();
    cy.get(ENF_OVR.localJusticeAreaDropdown).should('contain.value', "Bedfordshire Magistrates' Court (4165)");

    cy.get(ENF_OVR.addOverrideButton).click();

    cy.wait('@patchDefendantAccount')
      .its('request.body.enforcement_override')
      .should('deep.equal', {
        enforcement_override_result: {
          enforcement_override_result_id: 'TFOOUT',
        },
        enforcer: null,
        lja: {
          lja_id: 4165,
        },
      });

    cy.wait('@getEnforcementStatus');

    cy.get(ENF.tabName).should('exist').and('contain.text', 'Enforcement');

    cy.get(VERSION_CONTROL.successBanner).should('exist');
    cy.get(VERSION_CONTROL.successBannerText).should('contain', 'Enforcement override added');

    cy.get(ENF.tableTitle).should('contain.text', 'Enforcement override');
    cy.get(ENF.enforcementOverride).should('exist').and('contain.text', 'Enforcement override');
    cy.get(ENF.enforcementOverrideValue).and(
      'contain.text',
      'Transfer of Fine Order to a Court in England or Wales(TFOOUT)',
    );
    cy.get(ENF.localJusticeArea).should('exist').and('contain.text', 'Local Justice Area (LJA)');
    cy.get(ENF.localJusticeAreaValue).should('exist').and('contain.text', "Bedfordshire Magistrates' Court(4165)");
  });

  it('AC6a. Cancel without changes returns away from the add override page without confirmation', () => {
    commonSetup();

    cy.get(ENF_OVR.title).should('contain.text', 'Add enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');

    cy.window().then((win) => {
      cy.stub(win, 'confirm').as('confirm');
    });

    cy.contains('a.govuk-link', /^Cancel$/i).click();

    cy.get('@confirm').should('not.have.been.called');
    cy.get(ENF_OVR.title).should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdown).should('not.exist');
  });

  it('AC6b. Cancel after selecting a value shows confirmation before navigating away', () => {
    commonSetup();

    cy.get(ENF_OVR.title).should('contain.text', 'Add enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown).click().type('TFO');
    cy.get(ENF_OVR.dropdownOptions).contains('TFOOUT').click();
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'TFOOUT').blur();

    cy.window().then((win) => {
      cy.stub(win, 'confirm')
        .callsFake((message: string) => {
          expect(message.replace(/\s+/g, ' ')).to.match(/unsaved changes/i);
          return true;
        })
        .as('confirm');
    });

    cy.contains('a.govuk-link', /^Cancel$/i).click();

    cy.get('@confirm').should('have.been.calledOnce');
    cy.get(ENF_OVR.title).should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdown).should('not.exist');
  });

  it('AC6c. Cancel after selecting a value and dismissing the confirmation keeps the user on the page', () => {
    commonSetup();

    cy.get(ENF_OVR.title).should('contain.text', 'Add enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown).click().type('TFO');
    cy.get(ENF_OVR.dropdownOptions).contains('TFOOUT').click();
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'TFOOUT').blur();

    cy.window().then((win) => {
      cy.stub(win, 'confirm')
        .callsFake((message: string) => {
          expect(message.replace(/\s+/g, ' ')).to.match(/unsaved changes/i);
          return false;
        })
        .as('confirm');
    });

    cy.contains('a.govuk-link', /^Cancel$/i).click();

    cy.get('@confirm').should('have.been.calledOnce');
    cy.get(ENF_OVR.title).should('contain.text', 'Add enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'TFOOUT');
  });
});
