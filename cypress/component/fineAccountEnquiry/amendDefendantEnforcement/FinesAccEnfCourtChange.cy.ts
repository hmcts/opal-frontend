import { DOM_ELEMENTS as ENF_COURT_CHANGE } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement-court-change.locators';
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENF } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { setupAccountEnquiryComponent } from '../accountEnquiry/setup/SetupComponent';
import { IComponentProperties } from '../accountEnquiry/setup/setupComponent.interface';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import {
  interceptDefendantHeader,
  interceptEnforcementStatus,
} from '../accountEnquiry/intercept/defendantAccountIntercepts';
import {
  createDefendantHeaderMockWithName,
  DEFENDANT_HEADER_MOCK,
  DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK,
} from '../accountEnquiry/mocks/defendant_details_mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { IOpalFinesAccountDefendantDetailsHeader } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';

const ACCOUNT_ENQUIRY_TAGS = ['@JIRA-STORY:PO-1866', '@JIRA-LABEL:account-enquiry'];
const PAGE_TITLE = 'Change enforcement court';
const FIELD_LABEL = 'Enforcement court';
const SUBMIT_BUTTON_TEXT = 'Change';
const ERROR_SUMMARY_TITLE = 'There is a problem';
const REQUIRED_ERROR = 'Select an enforcement court';
const CHANGE_ENFORCEMENT_COURT_ROUTE = '../enforcement/court/change';

const COMPONENT_PROPERTIES: IComponentProperties = {
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

interface ISetupResult {
  courtsMock: IOpalFinesCourtRefData;
  expectedCaption: string;
}

function interceptCourtsByBusinessUnit(businessUnitId: number, courtsMock: IOpalFinesCourtRefData) {
  return cy
    .intercept('GET', `/opal-fines-service/courts?business_unit=${businessUnitId}`, {
      statusCode: 200,
      body: courtsMock,
    })
    .as('getCourtsByBusinessUnit');
}

function getExpectedCaption(headerMock: IOpalFinesAccountDefendantDetailsHeader): string {
  const accountNumber = headerMock.account_number;
  const organisationName = headerMock.party_details.organisation_details?.organisation_name;
  const individualDetails = headerMock.party_details.individual_details;

  if (organisationName) {
    return `${accountNumber} - ${organisationName}`;
  }

  return `${accountNumber} - ${individualDetails!.title} ${individualDetails!.forenames} ${individualDetails!.surname.toUpperCase()}`;
}

function setupChangeEnforcementCourt(headerMock: IOpalFinesAccountDefendantDetailsHeader): ISetupResult {
  const enforcementMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK);
  const courtsMock = structuredClone(OPAL_FINES_COURT_REF_DATA_MOCK);
  const businessUnitId = Number(headerMock.business_unit_summary.business_unit_id);
  const accountId = headerMock.defendant_account_party_id;

  courtsMock.refData = courtsMock.refData.map((court) => ({
    ...court,
    business_unit_id: businessUnitId,
  }));

  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptDefendantHeader(accountId, headerMock, '123');
  interceptEnforcementStatus(accountId, enforcementMock, '123');
  interceptCourtsByBusinessUnit(businessUnitId, courtsMock);

  setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

  return {
    courtsMock,
    expectedCaption: getExpectedCaption(headerMock),
  };
}

function commonSetup(): ISetupResult {
  const headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
  headerMock.debtor_type = 'individual';

  return setupChangeEnforcementCourt(headerMock);
}

function parentGuardianSetup(): ISetupResult {
  const headerMock = structuredClone(DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK);
  headerMock.party_details.individual_details = structuredClone(DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK.party_details.individual_details);
  headerMock.party_details.individual_details!.forenames = 'Robert';
  headerMock.party_details.individual_details!.surname = 'Thomson';

  return setupChangeEnforcementCourt(headerMock);
}

function companySetup(): ISetupResult {
  const headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
  headerMock.party_details.organisation_flag = true;
  headerMock.party_details.organisation_details = {
    organisation_name: 'Test Org Ltd',
    organisation_aliases: [],
  };
  headerMock.party_details.individual_details = null;
  headerMock.debtor_type = 'company';

  return setupChangeEnforcementCourt(headerMock);
}

function navigateToChangeEnforcementCourt() {
  cy.get(ENF.changeEnforcementCourtLink).should('exist').click();
}

function submitForm() {
  cy.get(ENF_COURT_CHANGE.submitButton).click();
}

function assertNavigation(expectedRoute: string) {
  cy.get('@routerNavigate').should('have.been.calledWithMatch', [expectedRoute]);
}

function assertTitle() {
  cy.get(ENF_COURT_CHANGE.title).should('contain.text', PAGE_TITLE);
}

function assertCaption(expectedCaption: string) {
  cy.get(ENF_COURT_CHANGE.caption).should('contain.text', expectedCaption);
}

function assertContent() {
  cy.get('router-outlet').should('exist');
  cy.get(ENF_COURT_CHANGE.headingWithCaption).should('exist');
  cy.get(ENF_COURT_CHANGE.form).should('exist');
}

function assertForm(courtsMock: IOpalFinesCourtRefData) {
  cy.get(ENF_COURT_CHANGE.enforcementCourtLabel).should('contain.text', FIELD_LABEL);
  cy.get(ENF_COURT_CHANGE.enforcementCourtInput)
    .should('exist')
    .and('have.attr', 'type', 'text')
    .and('have.class', 'autocomplete__input')
    .and('have.value', '');
  cy.get(ENF_COURT_CHANGE.hiddenEnforcementCourtInput).should('exist').and('have.value', '');
  cy.get(ENF_COURT_CHANGE.submitButton).should('contain.text', SUBMIT_BUTTON_TEXT);

  cy.get(ENF_COURT_CHANGE.enforcementCourtInput).click();
  cy.get(ENF_COURT_CHANGE.dropdownOptions)
    .should('contain.text', `${courtsMock.refData[0].name} (${courtsMock.refData[0].court_code})`)
    .and('contain.text', `${courtsMock.refData[1].name} (${courtsMock.refData[1].court_code})`);
}

function assertErrors() {
  cy.get(ENF_COURT_CHANGE.errorSummary).should('exist');
  cy.get(ENF_COURT_CHANGE.errorSummaryTitle).should('contain.text', ERROR_SUMMARY_TITLE);
  cy.get(ENF_COURT_CHANGE.errorSummaryList).should('contain.text', REQUIRED_ERROR);
  cy.get(ENF_COURT_CHANGE.fieldError).should('contain.text', REQUIRED_ERROR);
}

describe('Change Enforcement Court - Individual', { tags: ACCOUNT_ENQUIRY_TAGS }, () => {
  it('should navigate to the change enforcement court screen and display the form', () => {
    // AC1, AC1a, AC2a, AC2b, AC2c, AC2ci
    const { courtsMock, expectedCaption } = commonSetup();

    navigateToChangeEnforcementCourt();

    assertNavigation(CHANGE_ENFORCEMENT_COURT_ROUTE);
    assertTitle();
    assertCaption(expectedCaption);
    assertContent();
    assertForm(courtsMock);
  });

  it('should show validation errors when no enforcement court is selected', () => {
    // AC3a
    commonSetup();

    navigateToChangeEnforcementCourt();
    submitForm();

    assertErrors();
  });
});

describe('Change Enforcement Court - Parent/Guardian', { tags: ACCOUNT_ENQUIRY_TAGS }, () => {
  it('should navigate to the change enforcement court screen and display the form', () => {
    // AC1, AC1a, AC2a, AC2b, AC2c, AC2ci
    const { courtsMock, expectedCaption } = parentGuardianSetup();

    navigateToChangeEnforcementCourt();

    assertNavigation(CHANGE_ENFORCEMENT_COURT_ROUTE);
    assertTitle();
    assertCaption(expectedCaption);
    assertContent();
    assertForm(courtsMock);
  });

  it('should show validation errors when no enforcement court is selected', () => {
    // AC3a
    parentGuardianSetup();

    navigateToChangeEnforcementCourt();
    submitForm();

    assertErrors();
  });
});

describe('Change Enforcement Court - Company', { tags: ACCOUNT_ENQUIRY_TAGS }, () => {
  it('should navigate to the change enforcement court screen and display the form', () => {
    // AC1, AC1a, AC2a, AC2b, AC2c, AC2ci
    const { courtsMock, expectedCaption } = companySetup();

    navigateToChangeEnforcementCourt();

    assertNavigation(CHANGE_ENFORCEMENT_COURT_ROUTE);
    assertTitle();
    assertCaption(expectedCaption);
    assertContent();
    assertForm(courtsMock);
  });

  it('should show validation errors when no enforcement court is selected', () => {
    // AC3a
    companySetup();

    navigateToChangeEnforcementCourt();
    submitForm();

    assertErrors();
  });
});
