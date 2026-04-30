import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENF } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { DOM_ELEMENTS as REMOVE_ENF_OVERRIDE } from '../../../shared/selectors/account-enquiry/account.enquiry.enforcement-override-remove.locators';
import { setupAccountEnquiryComponent } from '../accountEnquiry/setup/SetupComponent';
import { IComponentProperties } from '../accountEnquiry/setup/setupComponent.interface';
import { signal } from '@angular/core';
import { mount } from 'cypress/angular';
import { DOM_ELEMENTS as VERSION_CONTROL } from '../../../shared/selectors/account-enquiry/account.enquiry.version-control.locators';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
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
} from '../accountEnquiry/mocks/defendant_details_mock';
import { ActivatedRoute, Router } from '@angular/router';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { IOpalFinesAccountDefendantDetailsHeader } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FinesAccEnfOverrideRemoveComponent } from 'src/app/flows/fines/fines-acc/fines-acc-enf-override-remove/fines-acc-enf-override-remove.component';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { FinesAccPayloadService } from 'src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { OpalFines } from 'src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';

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

const REMOVE_ENFORCEMENT_OVERRIDE_ROUTE = '../enforcement/override/remove';
const REMOVE_ENFORCEMENT_OVERRIDE_TITLE = 'Are you sure you want to remove this enforcement override?';
const EXISTING_OVERRIDE_TEXT = 'Application made for Benefit Deductions (ABDC)';

function buildIndividualHeaderMock(): IOpalFinesAccountDefendantDetailsHeader {
  const headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
  headerMock.debtor_type = 'individual';

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

function buildParentGuardianHeaderMock(): IOpalFinesAccountDefendantDetailsHeader {
  const headerMock = structuredClone(createParentGuardianHeaderMockWithName('Robert', 'Thomson'));
  headerMock.debtor_type = 'Parent/Guardian';

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

function buildRemovedEnforcementOverrideMock() {
  const enforcementMock = buildExistingEnforcementOverrideMock();

  enforcementMock.enforcement_override = null;

  return enforcementMock;
}

function registerRemoveEnforcementOverrideIntercepts(headerMock: IOpalFinesAccountDefendantDetailsHeader) {
  const enforcementMock = buildExistingEnforcementOverrideMock();
  const accountId = headerMock.defendant_account_party_id;

  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptDefendantHeader(accountId, headerMock, '123');
  interceptEnforcementStatus(accountId, enforcementMock, '123');
  interceptPatchDefendantAccount();

  return { accountId };
}

function setupRemoveEnforcementOverride(headerMock: IOpalFinesAccountDefendantDetailsHeader) {
  const { accountId } = registerRemoveEnforcementOverrideIntercepts(headerMock);

  setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });
  cy.get(ENF.enforcementOverrideValue).should('contain.text', 'Application made for Benefit Deductions (ABDC)');
  cy.get(ENF.removeEnforcementOverrideLink).should('contain.text', 'Remove').click();

  return { accountId };
}

function individualSetup() {
  return setupRemoveEnforcementOverride(buildIndividualHeaderMock());
}

function companySetup() {
  return setupRemoveEnforcementOverride(buildCompanyHeaderMock());
}

function parentGuardianSetup() {
  return setupRemoveEnforcementOverride(buildParentGuardianHeaderMock());
}

function assertRemoveScreenShell() {
  cy.get(ENF.headingWithCaption).should('exist');
  cy.get(REMOVE_ENF_OVERRIDE.title).should('contain.text', REMOVE_ENFORCEMENT_OVERRIDE_TITLE);
  cy.contains(REMOVE_ENF_OVERRIDE.overrideValue, EXISTING_OVERRIDE_TEXT).should('exist');
  cy.get(REMOVE_ENF_OVERRIDE.removeButton).should('contain.text', 'Yes - remove');
  cy.contains(REMOVE_ENF_OVERRIDE.cancelLink, /^No - cancel$/i).should('exist');
}

function mountRemoveEnforcementOverride(expectedCaption: string) {
  const [accountNumber, partyName] = expectedCaption.split(' - ');
  const navigateSpy = Cypress.sinon.stub();

  mount(FinesAccEnfOverrideRemoveComponent, {
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: {
              title: 'Remove enforcement override',
              enforcementStatus: buildExistingEnforcementOverrideMock(),
            },
          },
        },
      },
      {
        provide: Router,
        useValue: {
          navigate: navigateSpy,
        },
      },
      {
        provide: FinesAccountStore,
        useValue: {
          getAccountNumber: signal(accountNumber),
          party_name: signal(partyName),
          account_id: signal(1001),
          base_version: signal('1'),
          business_unit_id: signal('2002'),
          setSuccessMessage: Cypress.sinon.stub(),
        },
      },
      {
        provide: FinesAccPayloadService,
        useValue: {
          buildEnforcementOverrideFormPayload: Cypress.sinon.stub().returns({ enforcement_override: {} }),
        },
      },
      {
        provide: OpalFines,
        useValue: {
          patchDefendantAccount: Cypress.sinon.stub().returns(of({})),
        },
      },
    ],
  });

  return { navigateSpy };
}

describe(
  'Remove Enforcement Override - Individual',
  { tags: ['@JIRA-STORY:PO-1851', '@JIRA-EPIC:PO-1675', '@JIRA-LABEL:account-enquiry'] },
  () => {
    it(
      'AC1. Selecting Remove from the Enforcement tab navigates to the remove screen',
      { tags: [] },
      () => {
        const { accountId } = registerRemoveEnforcementOverrideIntercepts(buildIndividualHeaderMock());

        setupAccountEnquiryComponent({ ...COMPONENT_PROPERTIES, accountId });

        cy.get(ENF.enforcementOverrideValue).should('contain.text', 'Application made for Benefit Deductions (ABDC)');
        cy.get(ENF.removeEnforcementOverrideLink).should('exist').and('contain.text', 'Remove').click();

        cy.get('@routerNavigate').should('have.been.calledWithMatch', [REMOVE_ENFORCEMENT_OVERRIDE_ROUTE]);
        assertRemoveScreenShell();
      },
    );

    it(
      'AC1a, AC1b, AC1c. Should render the remove screen with the individual account identifier and override value',
      { tags: [] },
      () => {
        individualSetup();

        assertRemoveScreenShell();
        cy.get(ENF.headingWithCaption).should('contain.text', '177A - Mr Robert THOMSON');
      },
    );

    it(
      'AC2, AC2a, AC2b, AC2c. Yes - remove should clear the override, return to Enforcement and show a success banner',
      { tags: [] },
      () => {
        const { accountId } = individualSetup();
        const updatedEnforcementMock = buildRemovedEnforcementOverrideMock();

        interceptEnforcementStatus(accountId, updatedEnforcementMock, '124');

        cy.get(REMOVE_ENF_OVERRIDE.removeButton).click();

        cy.wait('@patchDefendantAccount').its('request.body.enforcement_override').should('deep.equal', {
          enforcement_override_result: null,
          enforcer: null,
          lja: null,
        });
        cy.wait('@getEnforcementStatus');

        cy.get(ENF.tabName).should('exist').and('contain.text', 'Enforcement');
        cy.get(VERSION_CONTROL.successBanner).should('exist');
        cy.get(VERSION_CONTROL.bannerText).should('contain.text', 'Enforcement override removed');
        cy.get(ENF.addEnforcementOverrideLink).should('exist');
        cy.get(ENF.enforcementOverride).should('not.exist');
      },
    );

    it(
      'AC3, AC3a. No - cancel should return to the Enforcement tab without removing the override',
      { tags: [] },
      () => {
        const { navigateSpy } = mountRemoveEnforcementOverride('177A - Mr Robert THOMSON');

        cy.contains(REMOVE_ENF_OVERRIDE.cancelLink, /^No - cancel$/i).click();

        cy.then(() => {
          expect(navigateSpy).to.have.been.calledOnce;
        });
      },
    );
  },
);

describe(
  'Remove Enforcement Override - Company',
  { tags: ['@JIRA-STORY:PO-1865', '@JIRA-EPIC:PO-1675', '@JIRA-LABEL:account-enquiry'] },
  () => {
    it(
      'AC1b. Should render the remove screen with the company account identifier',
      { tags: [] },
      () => {
        companySetup();

        assertRemoveScreenShell();
        cy.get(ENF.headingWithCaption).should('contain.text', '177A - Test Org Ltd');
      },
    );
  },
);

describe(
  'Remove Enforcement Override - Parent/Guardian',
  { tags: ['@JIRA-STORY:PO-1864', '@JIRA-EPIC:PO-1675', '@JIRA-LABEL:account-enquiry'] },
  () => {
    it(
      'AC1b. Should render the remove screen with the parent or guardian account identifier',
      { tags: [] },
      () => {
        parentGuardianSetup();

        assertRemoveScreenShell();
        cy.get(ENF.headingWithCaption).should('contain.text', '177A - Mr Robert THOMSON');
      },
    );
  },
);
