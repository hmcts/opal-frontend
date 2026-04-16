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
  interceptDefendantHeader,
  interceptEnforcementStatus,
  interceptPatchDefendantAccount,
} from '../accountEnquiry/intercept/defendantAccountIntercepts';
import {
  createDefendantHeaderMockWithName,
  createParentGuardianHeaderMockWithName,
  DEFENDANT_HEADER_MOCK,
  DEFENDANT_HEADER_YOUTH_MOCK,
} from '../accountEnquiry/mocks/defendant_details_mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';

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
  ],
};

const ENFORCEMENT_OVERRIDE_RESULT_CODES = [
  'ABDC',
  'AEOC',
  'BWTD',
  'BWTU',
  'CLAMPO',
  'CWN',
  'DW',
  'FSN',
  'MAN',
  'NBWT',
  'REGF',
  'SUMA',
  'TFOOUT',
] as const;

function buildParentGuardianHeaderMock() {
  const headerMock = structuredClone(createParentGuardianHeaderMockWithName('Robert', 'Thomson'));
  headerMock.debtor_type = 'Parent/Guardian';

  return headerMock;
}

function buildCompanyHeaderMock() {
  const headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
  headerMock.party_details.organisation_flag = true;
  headerMock.party_details.organisation_details = {
    organisation_name: 'Test Org Ltd',
    organisation_aliases: [],
  };
  headerMock.party_details.individual_details = null;
  headerMock.debtor_type = 'company';

  return headerMock;
}

function buildAdultOrYouthHeaderMock() {
  const headerMock = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
  headerMock.party_details.individual_details = {
    ...headerMock.party_details.individual_details!,
    forenames: 'Robert',
    surname: 'Thomson',
  };

  return headerMock;
}

function buildExistingEnforcementOverrideMock() {
  const enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

  enforcementMock.enforcement_override = {
    enforcement_override_result: {
      enforcement_override_result_id: 'ABDC',
      enforcement_override_result_name: 'Application made for Benefit Deductions',
    },
    enforcer: {
      enforcer_id: 770000000003,
      enforcer_name: 'The DWP',
    },
    lja: {
      lja_id: 0,
      lja_name: '',
    },
  };

  return enforcementMock;
}

function registerChangeEnforcementOverrideIntercepts(
  headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson')),
) {
  const enforcementMock = buildExistingEnforcementOverrideMock();
  const accountId = headerMock.defendant_account_party_id;

  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptDefendantHeader(accountId, headerMock, '123');
  interceptEnforcementStatus(accountId, enforcementMock, '123');
  interceptEnforcementOverrideResults();
  interceptLocalJusticeAreas();
  interceptEnforcers();
  ENFORCEMENT_OVERRIDE_RESULT_CODES.forEach((code) => interceptResultByCode(code));
  interceptPatchDefendantAccount();
  cy.intercept('/opal-fines-service/results/').as('getResults');

  return { accountId };
}

function setupChangeEnforcementOverride(
  headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson')),
) {
  const { accountId } = registerChangeEnforcementOverrideIntercepts(headerMock);

  setupAccountEnquiryComponent({ ...componentProperties, accountId });
  cy.get(ENF.enforcementOverrideValue).should('contain.text', 'Application made for Benefit Deductions (ABDC)');
  cy.get(ENF.changeEnforcementOverrideLink).click();

  return { accountId };
}

function openChangeEnforcementOverrideFromSummary() {
  cy.get(ENF.changeEnforcementOverrideLink).click();
}

function clearEnforcementOverrideSelection() {
  cy.get(ENF_OVR.enfOverrideDropdown)
    .should('be.visible')
    .click()
    .type('{selectall}{backspace}', { force: true })
    .blur();
}

function clearEnforcerSelection() {
  cy.get(ENF_OVR.enforcerDropdown).should('be.visible').click().type('{selectall}{backspace}', { force: true }).blur();
}

function parentGuardianSetup() {
  return setupChangeEnforcementOverride(buildParentGuardianHeaderMock());
}

function companySetup() {
  return setupChangeEnforcementOverride(buildCompanyHeaderMock());
}

function adultOrYouthOnlySetup() {
  return setupChangeEnforcementOverride(buildAdultOrYouthHeaderMock());
}

describe('Change Enforcement Override - Parent/Guardian', { tags: ['@PO-1870'] }, () => {
  it('AC1. Selecting Change enforcement override on the Enforcement tab navigates to the change screen', () => {
    const { accountId } = registerChangeEnforcementOverrideIntercepts(buildParentGuardianHeaderMock());
    setupAccountEnquiryComponent({ ...componentProperties, accountId });

    cy.get(ENF.enforcementOverrideValue).should('contain.text', 'Application made for Benefit Deductions (ABDC)');
    cy.get(ENF.changeEnforcementOverrideLink).should('exist');
    openChangeEnforcementOverrideFromSummary();

    cy.get(ENF_OVR.title).should('contain.text', 'Change enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
  });

  it('AC1a, AC1b. Should render the change enforcement override form with the individual account identifier', () => {
    parentGuardianSetup();

    cy.get(ENF_OVR.title).should('contain.text', '177A - Mr Robert THOMSON');
    cy.get(ENF_OVR.title).should('contain.text', 'Change enforcement override');
  });

  it('AC1c, AC1ci, AC1d. Should display the override dropdown, results reference data, add override button and cancel link', () => {
    parentGuardianSetup();

    cy.get(ENF_OVR.subtitle).should('contain.text', 'Select an enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    clearEnforcementOverrideSelection();

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

    cy.get(ENF_OVR.addOverrideButton).should('exist').and('contain.text', 'Add override');
    cy.contains('a.govuk-link', /^Cancel$/i).should('exist');
  });

  it('AC2, AC2a, AC2ai. Enforcer dropdown displays dynamically for overrides that require an enforcer', () => {
    parentGuardianSetup();

    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    clearEnforcerSelection();
    clearEnforcementOverrideSelection();

    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    cy.get(ENF_OVR.enfOverrideDropdown).type('AB');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('ABDC').should('exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('AEOC').should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('BWTD').should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('BWTU').should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('CLAMPO').should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('CWN').should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('DW').should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('FSN').should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('MAN').should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('NBWT').should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('REGF').should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('SUMA').should('not.exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('TFOOUT').should('not.exist');

    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('ABDC').click();
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'ABDC');

    cy.get(ENF_OVR.enforcerDropdown).should('exist');

    cy.get(ENF_OVR.enforcerDropdown).click();
    cy.get(ENF_OVR.enforcerDropdownOptions).contains('The DWP (3)').should('exist');
  });

  it('AC3, AC3a, AC3ai. LJA dropdown displays dynamically for overrides that require a Local Justice Area', () => {
    parentGuardianSetup();

    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    clearEnforcementOverrideSelection();
    cy.get(ENF_OVR.enfOverrideDropdown).type('TFO');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('TFOOUT').should('exist');

    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('TFOOUT').click();
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'TFOOUT');

    cy.get(ENF_OVR.localJusticeAreaDropdown).should('exist');
    cy.get(ENF_OVR.localJusticeAreaDropdown).click();
    cy.get(ENF_OVR.localJusticeAreaDropdownOptions).contains("Bedfordshire Magistrates' Court (4165)").should('exist');
  });

  it('AC4a. Error when no enforcement override is selected', () => {
    parentGuardianSetup();

    clearEnforcementOverrideSelection();
    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    cy.get(ENF_OVR.addOverrideButton).click();
    cy.get(ENF_OVR.errorSummary)
      .should('exist')
      .contains('There is a problem')
      .next()
      .should('contain.text', 'Select an enforcement override');
  });

  it('AC4b. Error when no enforcer is selected for an override that requires one', () => {
    parentGuardianSetup();

    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    clearEnforcementOverrideSelection();
    cy.get(ENF_OVR.enfOverrideDropdown).type('BW');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('BWTD').should('exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('BWTU').should('exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('BWTD').click();
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'BWTD');
    cy.get(ENF_OVR.enforcerDropdown).should('exist');
    clearEnforcerSelection();

    cy.get(ENF_OVR.addOverrideButton).click();
    cy.get(ENF_OVR.errorSummary)
      .should('exist')
      .contains('There is a problem')
      .next()
      .should('contain.text', 'Select an enforcer');
  });

  it('AC4c. Error when no Local Justice Area is selected for an override that requires one', () => {
    parentGuardianSetup();

    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
    clearEnforcementOverrideSelection();
    cy.get(ENF_OVR.enfOverrideDropdown).type('TFO');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('TFOOUT').should('exist');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('TFOOUT').click();
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'TFOOUT');
    cy.get(ENF_OVR.localJusticeAreaDropdown).should('exist');

    cy.get(ENF_OVR.addOverrideButton).click();
    cy.get(ENF_OVR.errorSummary)
      .should('exist')
      .contains('There is a problem')
      .next()
      .should('contain.text', 'Select a Local Justice Area');
  });

  it('AC5. Valid submission returns to Enforcement tab with success banner and updated override panel', () => {
    const { accountId } = parentGuardianSetup();
    const updatedEnforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);

    updatedEnforcementMock.enforcement_override = {
      enforcement_override_result: {
        enforcement_override_result_id: 'TFOOUT',
        enforcement_override_result_name: 'Transfer of Fine Order to a Court in England or Wales',
      },
      enforcer: {
        enforcer_id: 0,
        enforcer_name: '',
      },
      lja: {
        lja_id: 4165,
        lja_name: "Bedfordshire Magistrates' Court",
      },
    };

    interceptEnforcementStatus(accountId, updatedEnforcementMock, '124');

    clearEnforcementOverrideSelection();
    cy.get(ENF_OVR.enfOverrideDropdown).type('TFO');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('TFOOUT').click();
    cy.get(ENF_OVR.enfOverrideDropdown).should('contain.value', 'TFOOUT');

    cy.get(ENF_OVR.localJusticeAreaDropdown).click();
    cy.get(ENF_OVR.localJusticeAreaDropdownOptions).contains("Bedfordshire Magistrates' Court (4165)").click();
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
    cy.get(VERSION_CONTROL.successBannerText).should('contain', 'Enforcement override changed');

    cy.get(ENF.tableTitle).should('contain.text', 'Enforcement override');
    cy.get(ENF.enforcementOverride).should('exist').and('contain.text', 'Enforcement override');
    cy.get(ENF.enforcementOverrideValue).and(
      'contain.text',
      'Transfer of Fine Order to a Court in England or Wales (TFOOUT)',
    );
    cy.get(ENF.localJusticeArea).should('exist').and('contain.text', 'Local Justice Area (LJA)');
    cy.get(ENF.localJusticeAreaValue).should('exist').and('contain.text', "Bedfordshire Magistrates' Court(4165)");
  });

  it('AC6a. Cancel without changes returns to the Enforcement tab without confirmation', () => {
    parentGuardianSetup();

    cy.get(ENF_OVR.title).should('contain.text', 'Change enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');

    cy.window().then((win) => {
      cy.stub(win, 'confirm').as('confirm');
    });

    cy.contains('a.govuk-link', /^Cancel$/i).click();

    cy.get('@confirm').should('not.have.been.called');
    cy.get(ENF.headingName).should('contain.text', '177A Mr Robert THOMSON');
    cy.get(ENF.tableTitle).should('contain.text', 'Enforcement overview');
    cy.get(ENF_OVR.enfOverrideDropdown).should('not.exist');
  });

  it('AC6b. Cancel after selecting a value shows confirmation before navigating away', () => {
    parentGuardianSetup();

    cy.get(ENF_OVR.title).should('contain.text', 'Change enforcement override');
    clearEnforcementOverrideSelection();
    cy.get(ENF_OVR.enfOverrideDropdown).type('TFO');
    cy.get(ENF_OVR.enfOverrideDropdownOptions).contains('TFOOUT').click();
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
    cy.get(ENF.headingName).should('contain.text', '177A Mr Robert THOMSON');
    cy.get(ENF.tableTitle).should('contain.text', 'Enforcement overview');
    cy.get(ENF_OVR.enfOverrideDropdown).should('not.exist');
  });
});

describe('Change Enforcement Override - Company', { tags: ['@PO-1871'] }, () => {
  it('AC1. Selecting Change enforcement override on the company Enforcement tab navigates to the change screen', () => {
    const { accountId } = registerChangeEnforcementOverrideIntercepts(buildCompanyHeaderMock());
    setupAccountEnquiryComponent({ ...componentProperties, accountId });

    cy.get(ENF.enforcementOverrideValue).should('contain.text', 'Application made for Benefit Deductions (ABDC)');
    cy.get(ENF.changeEnforcementOverrideLink).should('exist');
    openChangeEnforcementOverrideFromSummary();

    cy.get(ENF_OVR.title).should('contain.text', 'Change enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
  });

  it('AC1a, AC1b. Should render the change enforcement override form with the company account identifier', () => {
    companySetup();

    cy.get(ENF_OVR.title).should('contain.text', '177A - Test Org Ltd');
    cy.get(ENF_OVR.title).should('contain.text', 'Change enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
  });
});

describe('Change Enforcement Override - Adult or youth only', { tags: ['@PO-1869'] }, () => {
  it('AC1. Selecting Change enforcement override on the Enforcement tab navigates to the change screen', () => {
    const { accountId } = registerChangeEnforcementOverrideIntercepts(buildAdultOrYouthHeaderMock());
    setupAccountEnquiryComponent({ ...componentProperties, accountId });

    cy.get(ENF.enforcementOverrideValue).should('contain.text', 'Application made for Benefit Deductions (ABDC)');
    cy.get(ENF.changeEnforcementOverrideLink).should('exist');
    openChangeEnforcementOverrideFromSummary();

    cy.get(ENF_OVR.title).should('contain.text', 'Change enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
  });

  it('AC1a, AC1b. Should render the change enforcement override form with the adult or youth only account identifier', () => {
    adultOrYouthOnlySetup();

    cy.get(ENF_OVR.title).should('contain.text', '177A - Mr Robert THOMSON');
    cy.get(ENF_OVR.title).should('contain.text', 'Change enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown).should('exist');
  });
});
