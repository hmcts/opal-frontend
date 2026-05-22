import { signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mount } from 'cypress/angular';
import { of } from 'rxjs';
import { DOM_ELEMENTS as REMOVE_PARENT_GUARDIAN } from '../../../shared/selectors/account-enquiry/account.enquiry.remove-parent-guardian.locators';
import {
  REMOVE_PARENT_GUARDIAN_ACCOUNT_ID,
  REMOVE_PARENT_GUARDIAN_ACCOUNT_NUMBER,
  REMOVE_PARENT_GUARDIAN_COMPANY_ACCOUNT_IDENTIFIER,
  REMOVE_PARENT_GUARDIAN_COMPANY_PARTY_NAME,
  REMOVE_PARENT_GUARDIAN_INDIVIDUAL_ACCOUNT_IDENTIFIER,
  REMOVE_PARENT_GUARDIAN_INDIVIDUAL_PARTY_NAME,
  REMOVE_PARENT_GUARDIAN_PARTY_ID,
  REMOVE_PARENT_GUARDIAN_TITLE,
} from './mocks/removeParentGuardian.mock';
import { FinesAccRemoveNonPayingPgComponent } from 'src/app/flows/fines/fines-acc/fines-acc-remove-non-paying-pg/fines-acc-remove-non-paying-pg.component';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { OpalFines } from 'src/app/flows/fines/services/opal-fines-service/opal-fines.service';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const STORY_TAG = '@JIRA-STORY:PO-1878';
const EPIC_TAG = '@JIRA-EPIC:PO-1875';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

const mountRemoveParentGuardianComponent = (partyName: string) => {
  const navigateSpy = Cypress.sinon.stub();

  mount(FinesAccRemoveNonPayingPgComponent, {
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: {
              title: REMOVE_PARENT_GUARDIAN_TITLE,
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
          getAccountNumber: signal(REMOVE_PARENT_GUARDIAN_ACCOUNT_NUMBER),
          party_name: signal(partyName),
          account_id: signal(Number(REMOVE_PARENT_GUARDIAN_ACCOUNT_ID)),
          pg_party_id: signal(REMOVE_PARENT_GUARDIAN_PARTY_ID),
          base_version: signal('1'),
          business_unit_id: signal('77'),
          setSuccessMessage: Cypress.sinon.stub(),
        },
      },
      {
        provide: OpalFines,
        useValue: {
          clearAccountDetailsCache: Cypress.sinon.stub(),
          deleteDefendantAccountParty: Cypress.sinon.stub().returns(of({})),
        },
      },
    ],
  });

  return { navigateSpy };
};

const assertRemoveParentGuardianScreen = (expectedIdentifier: string) => {
  cy.get(REMOVE_PARENT_GUARDIAN.headingWithCaption).should('contain.text', expectedIdentifier);
  cy.get(REMOVE_PARENT_GUARDIAN.title).should('contain.text', REMOVE_PARENT_GUARDIAN_TITLE);
  cy.get(REMOVE_PARENT_GUARDIAN.removeButton).should('be.visible').and('contain.text', 'Yes - remove');
  cy.contains(REMOVE_PARENT_GUARDIAN.cancelLink, /^No - cancel$/i).should('be.visible');
};

describe('Account Enquiry Remove Parent or Guardian', () => {
  it('AC1a, AC1b. should display the remove screen title and individual account identifier', { tags: buildTags(STORY_TAG, EPIC_TAG) }, () => {
      mountRemoveParentGuardianComponent(REMOVE_PARENT_GUARDIAN_INDIVIDUAL_PARTY_NAME);

      assertRemoveParentGuardianScreen(REMOVE_PARENT_GUARDIAN_INDIVIDUAL_ACCOUNT_IDENTIFIER);
    });

  it('AC1b. should display the company account identifier in the correct format', { tags: buildTags(STORY_TAG, EPIC_TAG) }, () => {
      mountRemoveParentGuardianComponent(REMOVE_PARENT_GUARDIAN_COMPANY_PARTY_NAME);

      assertRemoveParentGuardianScreen(REMOVE_PARENT_GUARDIAN_COMPANY_ACCOUNT_IDENTIFIER);
    });
});
