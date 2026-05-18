import { DOM_ELEMENTS as ENF_COURT_CHANGE } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement-court-change.locators';
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENF } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { setupAccountEnquiryComponent } from '../accountEnquiry/setup/SetupComponent';
import { IComponentProperties } from '../accountEnquiry/setup/setupComponent.interface';
import { mount } from 'cypress/angular';
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
import { ActivatedRoute, provideRouter } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesAccEnfCourtChangeFormComponent } from 'src/app/flows/fines/fines-acc/fines-acc-enf-court-change/fines-acc-enf-court-change-form/fines-acc-enf-court-change-form.component';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const JIRA_EPIC = '@JIRA-EPIC:PO-1675';

const buildTags = (...tags: string[]): string[] => [...tags, JIRA_EPIC, ACCOUNT_ENQUIRY_JIRA_LABEL];

const ADULT_OR_YOUTH_TAGS = buildTags('@JIRA-STORY:PO-1849', '@JIRA-STORY:PO-3729');
const PARENT_GUARDIAN_TAGS = buildTags('@JIRA-STORY:PO-1862', '@JIRA-STORY:PO-3729');
const COMPANY_TAGS = buildTags('@JIRA-STORY:PO-1863', '@JIRA-STORY:PO-3729');
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

function buildCourtChangeContext(headerMock: IOpalFinesAccountDefendantDetailsHeader): {
  accountId: string;
  businessUnitId: number;
  courtsMock: IOpalFinesCourtRefData;
  expectedCaption: string;
} {
  const courtsMock = structuredClone(OPAL_FINES_COURT_REF_DATA_MOCK);
  const businessUnitId = Number(headerMock.business_unit_summary.business_unit_id);
  const accountId = String(headerMock.defendant_account_party_id);

  courtsMock.refData = courtsMock.refData.map((court) => ({
    ...court,
    business_unit_id: businessUnitId,
  }));

  return {
    accountId,
    businessUnitId,
    courtsMock,
    expectedCaption: getExpectedCaption(headerMock),
  };
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
  const { accountId, businessUnitId, courtsMock, expectedCaption } = buildCourtChangeContext(headerMock);

  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptDefendantHeader(accountId, headerMock, '123');
  interceptEnforcementStatus(accountId, enforcementMock, '123');
  interceptCourtsByBusinessUnit(businessUnitId, courtsMock);

  setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

  return {
    courtsMock,
    expectedCaption,
  };
}

function mountChangeEnforcementCourtForm(headerMock: IOpalFinesAccountDefendantDetailsHeader): ISetupResult {
  const { courtsMock, expectedCaption } = buildCourtChangeContext(headerMock);
  const [accountNumber, partyName] = expectedCaption.split(' - ');

  mount(FinesAccEnfCourtChangeFormComponent, {
    providers: [
      provideRouter([]),
      UtilsService,
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            params: {},
            data: {},
          },
        },
      },
    ],
    componentProperties: {
      accountNumber,
      partyName,
      courtOptions: courtsMock.refData.map((court) => ({
        value: court.court_id,
        name: `${court.name} (${court.court_code})`,
      })),
    },
  });

  return {
    courtsMock,
    expectedCaption,
  };
}

function buildIndividualHeaderMock(): IOpalFinesAccountDefendantDetailsHeader {
  const headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
  headerMock.debtor_type = 'individual';

  return headerMock;
}

function buildParentGuardianHeaderMock(): IOpalFinesAccountDefendantDetailsHeader {
  const headerMock = structuredClone(DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK);
  headerMock.party_details.individual_details = structuredClone(
    DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK.party_details.individual_details,
  );
  headerMock.party_details.individual_details!.forenames = 'Robert';
  headerMock.party_details.individual_details!.surname = 'Thomson';

  return headerMock;
}

function buildCompanyHeaderMock(): IOpalFinesAccountDefendantDetailsHeader {
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

function commonSetup(): ISetupResult {
  return setupChangeEnforcementCourt(buildIndividualHeaderMock());
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

function assertLayout() {
  cy.get(ENF_COURT_CHANGE.title).should('have.class', 'govuk-!-margin-bottom-30');
  cy.get(ENF_COURT_CHANGE.buttonGroup).should('exist').and('have.class', 'govuk-button-group');
  cy.get(ENF_COURT_CHANGE.submitButton)
    .should('have.class', 'govuk-button')
    .and('have.class', 'govuk-!-margin-right-4');
}

function assertErrors() {
  cy.get(ENF_COURT_CHANGE.errorSummary).should('exist');
  cy.get(ENF_COURT_CHANGE.errorSummaryTitle).should('contain.text', ERROR_SUMMARY_TITLE);
  cy.get(ENF_COURT_CHANGE.errorSummaryList).should('contain.text', REQUIRED_ERROR);
  cy.get(ENF_COURT_CHANGE.fieldError).should('contain.text', REQUIRED_ERROR);
}

describe('Change Enforcement Court - Individual', { tags: ADULT_OR_YOUTH_TAGS }, () => {
  it(
    'AC1, AC1a, AC2a, AC2b, AC2c, AC2ci. Individual: navigates to the change enforcement court screen and displays the form',
    { tags: ['@JIRA-TEST-KEY:PO-4407'] },
    () => {
      // AC1, AC1a, AC2a, AC2b, AC2c, AC2ci
      const { courtsMock, expectedCaption } = commonSetup();

      navigateToChangeEnforcementCourt();

      assertNavigation(CHANGE_ENFORCEMENT_COURT_ROUTE);
      assertTitle();
      assertCaption(expectedCaption);
      assertContent();
      assertForm(courtsMock);
      assertLayout();
    },
  );

  it(
    'AC3a. Individual: shows validation errors when no enforcement court is selected',
    { tags: ['@JIRA-TEST-KEY:PO-4408'] },
    () => {
      mountChangeEnforcementCourtForm(buildIndividualHeaderMock());
      submitForm();

      assertErrors();
    },
  );
});

describe('Change Enforcement Court - Parent/Guardian', { tags: PARENT_GUARDIAN_TAGS }, () => {
  it(
    'AC1, AC1a, AC2a, AC2b, AC2c, AC2ci. Parent/Guardian: navigates to the change enforcement court screen and displays the form',
    { tags: ['@JIRA-TEST-KEY:PO-4409'] },
    () => {
      const { courtsMock, expectedCaption } = mountChangeEnforcementCourtForm(buildParentGuardianHeaderMock());
      assertTitle();
      assertCaption(expectedCaption);
      cy.get(ENF_COURT_CHANGE.headingWithCaption).should('exist');
      cy.get(ENF_COURT_CHANGE.form).should('exist');
      assertForm(courtsMock);
      assertLayout();
    },
  );

  it(
    'AC3a. Parent/Guardian: shows validation errors when no enforcement court is selected',
    { tags: ['@JIRA-TEST-KEY:PO-4410'] },
    () => {
      mountChangeEnforcementCourtForm(buildParentGuardianHeaderMock());
      submitForm();

      assertErrors();
    },
  );
});

describe('Change Enforcement Court - Company', { tags: COMPANY_TAGS }, () => {
  it(
    'AC1, AC1a, AC2a, AC2b, AC2c, AC2ci. Company: navigates to the change enforcement court screen and displays the form',
    { tags: ['@JIRA-TEST-KEY:PO-4411'] },
    () => {
      const { courtsMock, expectedCaption } = mountChangeEnforcementCourtForm(buildCompanyHeaderMock());
      assertTitle();
      assertCaption(expectedCaption);
      cy.get(ENF_COURT_CHANGE.headingWithCaption).should('exist');
      cy.get(ENF_COURT_CHANGE.form).should('exist');
      assertForm(courtsMock);
      assertLayout();
    },
  );

  it(
    'AC3a. Company: shows validation errors when no enforcement court is selected',
    { tags: ['@JIRA-TEST-KEY:PO-4412'] },
    () => {
      mountChangeEnforcementCourtForm(buildCompanyHeaderMock());
      submitForm();

      assertErrors();
    },
  );
});
