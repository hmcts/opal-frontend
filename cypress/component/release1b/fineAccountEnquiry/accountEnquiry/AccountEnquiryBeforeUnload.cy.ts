import { Router } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../../CommonIntercepts/CommonUserState.mocks';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { MOCK_FINES_ACCOUNT_STATE } from 'src/app/flows/fines/fines-acc/mocks/fines-acc-state.mock';
import { AccountDetailsNotesLocators as L } from '../../../../shared/selectors/account-details/account.notes.details.locators';
import { DOM_ELEMENTS as Enforcement } from '../../../../shared/selectors/account-enquiry/account.enquiry.enforcement-action-select.locators';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { interceptAuthenticatedUser, interceptUserState } from '../../../CommonIntercepts/CommonIntercepts';
import { interceptAtAGlance, interceptDefendantHeader } from './intercept/defendantAccountIntercepts';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from './mocks/defendant_details_at_glance_mock';
import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as Header } from '../../../../shared/selectors/account-enquiry/account.enquiry.header.locators';

const buildTags = (...tags: string[]): string[] => [...tags, '@JIRA-LABEL:account-enquiry', '@R1B'];
const warning = 'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';

// Use the production routes, guards and resolvers; only their API responses are mocked.
const setupComponent = (targetPath = '/defendant/12345/note/add') => {
  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  const header = structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
  header.defendant_account_id = '12345';
  header.business_unit_summary.business_unit_id = '77';
  interceptDefendantHeader(12345, header, '1');
  interceptAtAGlance(12345, structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK), '1');
  setupAccountEnquiryComponent({
    accountId: '12345',
    fragments: undefined,
    targetPath,
    globalStoreFactory: () => {
      const store = new GlobalStore();
      store.setUserState(structuredClone(USER_STATE_MOCK_PERMISSION_BU77));
      return store;
    },
    finesAccountStoreFactory: () => {
      const store = new FinesAccountStore();
      store.setAccountState({ ...structuredClone(MOCK_FINES_ACCOUNT_STATE), account_id: 12345 });
      return store;
    },
  });
};

const expectUnloadPrevented = (prevented: boolean) =>
  cy.window().then((window) => {
    // Refresh and tab/window close share this event. Cypress cannot assert native dialog UI.
    const event = new Event('beforeunload', { cancelable: true });
    const allowed = window.dispatchEvent(event);
    expect(event.defaultPrevented, 'browser unload prevented').to.equal(prevented);
    expect(allowed, 'browser unload allowed').to.equal(!prevented);
  });

describe('Account enquiry browser unload protection', () => {
  it('keeps unload protection after an invalid submission', { tags: buildTags('@JIRA-DEFECT:PO-11122') }, () => {
    setupComponent();
    cy.get(L.fields.noteTextArea).type('Invalid @ note');
    cy.get(L.actions.saveNoteButton).click();
    cy.get(L.errorSummary).should('be.visible');
    expectUnloadPrevented(true);
  });

  it('allows browser unload after successfully saving the note', { tags: buildTags('@JIRA-DEFECT:PO-11122') }, () => {
    cy.intercept('POST', '**/opal-fines-service/notes', { statusCode: 200 }).as('saveNote');
    setupComponent();
    cy.get(L.fields.noteTextArea).type('Saved automation note');
    expectUnloadPrevented(true);
    cy.get(L.actions.saveNoteButton).click();
    cy.wait('@saveNote').its('request.body.activity_note.note_text').should('equal', 'Saved automation note');
    cy.get(L.componentRoot).should('not.exist');
    cy.get<Router>('@router').its('url').should('equal', '/defendant/12345/details');
    expectUnloadPrevented(false);
  });

  it(
    'protects edits when opening the note form from the account summary',
    { tags: buildTags('@JIRA-DEFECT:PO-11122') },
    () => {
      setupComponent('/defendant/12345/details');
      cy.get(Header.addNoteButton).click();
      cy.get(L.fields.noteTextArea).should('be.visible');
      expectUnloadPrevented(false);
      cy.get(L.fields.noteTextArea).type('Journey automation note');
      expectUnloadPrevented(true);
    },
  );

  it(
    'retains edits when in-app navigation is rejected and allows confirmed navigation',
    { tags: buildTags('@JIRA-DEFECT:PO-11122') },
    () => {
      setupComponent();
      cy.window().then((window) => {
        const confirm = cy.stub(window, 'confirm').as('leavePage');
        confirm.onFirstCall().returns(false);
        confirm.onSecondCall().returns(true);
      });
      cy.get(L.fields.noteTextArea).type('Unsaved automation note');
      cy.get(L.actions.cancelLink).click();
      cy.get('@leavePage').should('have.been.calledOnce').and('have.been.calledWithExactly', warning);
      cy.get(L.fields.noteTextArea).should('have.value', 'Unsaved automation note');
      expectUnloadPrevented(true);

      cy.get(L.actions.cancelLink).click();
      cy.get('@leavePage').should('have.been.calledTwice');
      cy.get(L.componentRoot).should('not.exist');
      cy.get<Router>('@router').its('url').should('equal', '/defendant/12345/details');
      expectUnloadPrevented(false);
    },
  );

  it('leaves an untouched form without an in-app warning', { tags: buildTags('@JIRA-DEFECT:PO-11122') }, () => {
    setupComponent();
    cy.get(L.fields.noteTextArea).should('have.value', '');
    expectUnloadPrevented(false);
    cy.window().then((window) => cy.stub(window, 'confirm').as('leavePage'));
    cy.get(L.actions.cancelLink).click();
    cy.get(L.componentRoot).should('not.exist');
    cy.get<Router>('@router').its('url').should('equal', '/defendant/12345/details');
    cy.get('@leavePage').should('not.have.been.called');
    expectUnloadPrevented(false);
  });

  [true, false].forEach((answer) => {
    it(
      `prevents browser unload after selecting ${answer ? 'Yes' : 'No'} to add an enforcement action`,
      { tags: buildTags('@JIRA-DEFECT:PO-11122') },
      () => {
        setupComponent('/defendant/12345/enforcement/action/add-new');
        expectUnloadPrevented(false);
        const radio = answer ? Enforcement.newEnforcementActionYesRadio : Enforcement.newEnforcementActionNoRadio;
        cy.get(radio).check();
        expectUnloadPrevented(true);
        cy.get(radio).should('be.checked');
      },
    );
  });
});
