import { Router } from '@angular/router';
import { FinesConStore } from 'src/app/flows/fines/fines-con/stores/fines-con.store';
import { SelectBusinessUnitLocators as Select } from '../../../../shared/selectors/consolidation/SelectBusinessUnit.locators';
import { AccountSearchLocators as Search } from '../../../../shared/selectors/consolidation/AccountSearch.locators';
import { setupConsolidationJourneyComponent } from './setup/SetupJourneyComponent';

const buildTags = (...tags: string[]): string[] => [
  ...tags,
  '@JIRA-EPIC:PO-8248',
  '@JIRA-LABEL:consolidation',
  '@R1CWriteOff',
];
const warning = 'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';

const expectUnloadPrevented = (prevented: boolean) =>
  cy.window().then((window) => {
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented, 'browser unload prevented').to.equal(prevented);
  });

describe('Consolidation journey browser unload protection', () => {
  it(
    'does not warn solely because a single business unit was automatically selected',
    { tags: buildTags('@JIRA-DEFECT:PO-11122') },
    () => {
      setupConsolidationJourneyComponent(1);
      cy.get(Select.singleBusinessUnitMessage).should('contain.text', 'Historical Debt');
      cy.get<InstanceType<typeof FinesConStore>>('@finesConStore').then((store) => {
        expect(store.getBusinessUnitId()).to.equal(61);
        expect(store.stateChanges()).to.be.false;
      });
      expectUnloadPrevented(false);
    },
  );

  it(
    'protects edits to the real business-unit form and preserves them when navigation is rejected',
    { tags: buildTags('@JIRA-DEFECT:PO-11122') },
    () => {
      setupConsolidationJourneyComponent();
      cy.get(Select.businessUnitInput).should('have.value', '');
      expectUnloadPrevented(false);
      cy.get(Select.businessUnitInput).type('Historical');
      cy.get(Select.businessUnitAutoComplete).contains('li', 'Historical Debt').click();
      cy.get(Select.individualInput).check();
      expectUnloadPrevented(true);

      cy.window().then((window) => cy.stub(window, 'confirm').as('leavePage').returns(false));
      cy.get<Router>('@consolidationRouter')
        .then((router) => router.navigateByUrl('/dashboard'))
        .should('equal', false);
      cy.get('@leavePage').should('have.been.calledOnce').and('have.been.calledWithExactly', warning);
      cy.get(Select.businessUnitInput).should('have.value', 'Historical Debt');
      cy.get(Select.individualInput).should('be.checked');
      expectUnloadPrevented(true);
    },
  );

  ['individual', 'company'].forEach((defendantType) => {
    it(
      `keeps journey protection after continuing to ${defendantType} account search`,
      { tags: buildTags('@JIRA-DEFECT:PO-11122') },
      () => {
        setupConsolidationJourneyComponent(1);
        // Individual is preselected. Change the choice so both variants exercise a user edit.
        if (defendantType === 'individual') {
          cy.get(Select.companyInput).check();
        }
        cy.get(defendantType === 'individual' ? Select.individualInput : Select.companyInput).check();
        expectUnloadPrevented(true);
        cy.get(Select.continueButton).click();
        cy.get(Search.businessUnitValue).should('contain.text', 'Historical Debt');
        const searchInput = defendantType === 'individual' ? Search.lastNameInput : Search.companyNameInput;
        cy.get(searchInput).should('be.visible').and('have.value', '');
        cy.get<Router>('@consolidationRouter').its('url').should('include', '/consolidation/consolidate-accounts');
        cy.get<InstanceType<typeof FinesConStore>>('@finesConStore').then((store) => {
          expect(store.stateChanges(), 'progress retained across pages').to.be.true;
          expect(store.unsavedChanges(), 'search has not been edited').to.be.false;
        });
        // No dirty form remains in the outlet: store-held progress must still protect the journey.
        expectUnloadPrevented(true);
        cy.get(searchInput).type('Automation');
        cy.get<InstanceType<typeof FinesConStore>>('@finesConStore').should((store) => {
          expect(store.unsavedChanges(), 'search edits tracked as unsaved changes').to.be.true;
        });
        expectUnloadPrevented(true);
      },
    );
  });
});
