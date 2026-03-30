import { mount } from 'cypress/angular';
import { FinesMacAccountCommentsNotesComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-account-comments-notes/fines-mac-account-comments-notes.component';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { MacAccountCommentsNotesLocators as L } from '../../../shared/selectors/manual-account-creation/mac.account-comments-notes.locators';
import { IFinesMacState } from 'src/app/flows/fines/fines-mac/interfaces/fines-mac-state.interface';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_COMMENT_AND_NOTES_AY_MANDATORY_COMPLETED_MOCK } from './mocks/fines_mac_account_comments_and_notes_AY_mandatory_completed_mock';
import { FINES_COMMENT_AND_NOTES_AY_MANDATORY_MISSING_MOCK } from './mocks/fines_mac_account_comments_and_notes_AY_mandatory_missing_mock';
import { FINES_COMMENT_AND_NOTES_PG_MANDATORY_COMPLETED_MOCK } from './mocks/fines_mac_account_comments_and_notes_PG_mandatory_completed_mock';
import { FINES_COMMENT_AND_NOTES_COMP_MANDATORY_COMPLETED_MOCK } from './mocks/fines_mac_account_comments_and_notes_COMP_mandatory_completed_mock';
import { FINES_COMMENT_AND_NOTES_COMP_MANDATORY_MISSING_MOCK } from './mocks/fines_mac_account_comments_and_notes_COMP_mandatory_missing_mock';
import { FINES_COMMENT_AND_NOTES_PG_MANDATORY_MISSING_MOCK } from './mocks/fines_mac_account_comments_and_notes_PG_mandatory_missing_mock';
import { of } from 'rxjs';

const MANUAL_ACCOUNT_CREATION_JIRA_LABEL = '@JIRA-LABEL:manual-account-creation';

const buildTags = (...tags: string[]) => [...tags, MANUAL_ACCOUNT_CREATION_JIRA_LABEL];

describe('FinesMacAccountCommentsAndNotesComponent', () => {
  const setupComponent = (formSubmit: any, defendantTypeMock: string = '', finesMacStateMock: IFinesMacState) => {
    mount(FinesMacAccountCommentsNotesComponent, {
      providers: [
        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(finesMacStateMock);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
      componentProperties: {
        defendantType: defendantTypeMock,
      },
    }).then(({ fixture }) => {
      if (!formSubmit) return;

      const comp: any = fixture.componentInstance as any;

      // Preferred: subscribe to the child's EventEmitter output via the instance
      // If the parent exposes the child instance, subscribe directly; otherwise override method after mount:
      if (typeof comp.handleAccountCommentsNoteSubmit === 'function') {
        comp.handleAccountCommentsNoteSubmit = formSubmit as any;
      }

      fixture.detectChanges();
    });
  };

  it(
    'should render the component',
    { tags: buildTags('@JIRA-STORY:PO-272', '@JIRA-STORY:PO-469', '@JIRA-KEY:POT-4026') },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);

      cy.get(L.componentRoot).should('exist');
    },
  );

  it(
    '(AC.1) should load all elements on the screen correctly',
    { tags: buildTags('@JIRA-STORY:PO-272', '@JIRA-STORY:PO-469', '@JIRA-KEY:POT-4027') },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);

      cy.get(L.pageHeader).should('contain', 'Account comments and notes');
      cy.get(L.commentLabel).should('contain', 'Add comment');
      cy.get(L.commentHint).should('contain', 'For example, a warning, which will appear on the account summary');
      cy.get(L.commentInput).should('exist');
      cy.get(L.noteLabel).should('contain', 'Add account notes');
      cy.get(L.noteHint).should('contain', 'You can view notes in account history after the account is published');
      cy.get(L.noteInput).should('exist');

      cy.get(L.returnToAccountDetailsButton).should('contain', 'Return to account details');
      cy.get(L.cancelLink).should('exist');
    },
  );

  it(
    '(AC.2) should have character limits for account comments',
    { tags: buildTags('@JIRA-STORY:PO-272', '@JIRA-STORY:PO-469', '@JIRA-KEY:POT-4028') },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);

      cy.get(L.commentInput).should('have.attr', 'maxlength', '30');
      cy.get(L.commentInput).clear().type('a'.repeat(30), { delay: 0 });
      cy.get(L.commentInput).should('have.value', 'a'.repeat(30));
      cy.get(L.commentCharHint).should('contain', 'You have 0 characters remaining');

      cy.get(L.commentInput).clear().type('a'.repeat(31), { delay: 0 });
      cy.get(L.commentInput).should('have.value', 'a'.repeat(30));
      cy.get(L.commentCharHint).should('contain', 'You have 0 characters remaining');

      cy.get(L.commentInput).clear().type('a'.repeat(29), { delay: 0 });
      cy.get(L.commentInput).should('have.value', 'a'.repeat(29));
      cy.get(L.commentCharHint).should('contain', 'You have 1 character remaining');
    },
  );

  it(
    '(AC.3) should have character limits for account notes',
    { tags: buildTags('@JIRA-STORY:PO-272', '@JIRA-STORY:PO-469', '@JIRA-KEY:POT-4029') },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);

      cy.get(L.noteInput).should('have.attr', 'maxlength', '1000');
      cy.get(L.noteInput).clear().type('a'.repeat(1000), { delay: 0 });
      cy.get(L.noteInput).should('have.value', 'a'.repeat(1000));
      cy.get(L.noteCharHint).should('contain', 'You have 0 characters remaining');

      cy.get(L.noteInput).clear().type('a'.repeat(1001), { delay: 0 });
      cy.get(L.noteInput).should('have.value', 'a'.repeat(1000));
      cy.get(L.noteCharHint).should('contain', 'You have 0 characters remaining');

      cy.get(L.noteInput).clear().type('a'.repeat(999), { delay: 0 });
      cy.get(L.noteInput).should('have.value', 'a'.repeat(999));
      cy.get(L.noteCharHint).should('contain', 'You have 1 character remaining');
    },
  );

  it(
    '(AC.1) should allow users to fill in data and submit with no errors',
    { tags: buildTags('@JIRA-STORY:PO-272', '@JIRA-STORY:PO-469', '@JIRA-KEY:POT-4030') },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      setupComponent(formSubmitSpy, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);

      cy.get(L.returnToAccountDetailsButton).first().click();

      cy.get('.errorSummary').should('not.exist');
      cy.wrap(formSubmitSpy).should('have.been.calledOnce');
    },
  );

  it(
    '(AC.1) should allow users to submit without entering data',
    { tags: buildTags('@JIRA-STORY:PO-272', '@JIRA-STORY:PO-469', '@JIRA-KEY:POT-4031') },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      setupComponent(formSubmitSpy, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);

      cy.get(L.returnToAccountDetailsButton).first().click();

      cy.get('.errorSummary').should('not.exist');
      cy.wrap(formSubmitSpy).should('have.been.calledOnce');
    },
  );

  it(
    '(AC.8) should display the grey navigation button only when mandatory sections of the MAC process are populated - Adult or youth only',
    { tags: buildTags('@JIRA-STORY:PO-272', '@JIRA-STORY:PO-469', '@JIRA-KEY:POT-4032') },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_COMMENT_AND_NOTES_AY_MANDATORY_COMPLETED_MOCK);

      cy.get(L.returnToAccountDetailsButton).should('exist');
      cy.get(L.cancelLink).should('exist');

      cy.get(L.returnToAccountDetailsButton).should('exist');
      cy.get(L.reviewAndSubmitButton).should('exist');
      cy.get(L.cancelLink).should('exist');
    },
  );
  it(
    '(AC.8) should display the grey navigation button only when mandatory sections of the MAC process are populated - Parent or guardian',
    { tags: buildTags('@JIRA-STORY:PO-344', '@JIRA-STORY:PO-499', '@JIRA-KEY:POT-4033') },
    () => {
      setupComponent(null, 'pgToPay', FINES_COMMENT_AND_NOTES_PG_MANDATORY_COMPLETED_MOCK);

      cy.get(L.returnToAccountDetailsButton).should('exist');
      cy.get(L.cancelLink).should('exist');

      cy.get(L.returnToAccountDetailsButton).should('exist');
      cy.get(L.reviewAndSubmitButton).should('exist');
      cy.get(L.cancelLink).should('exist');
    },
  );
  it(
    '(AC.8) should display the grey navigation button only when mandatory sections of the MAC process are populated - Company',
    { tags: buildTags('@JIRA-STORY:PO-345', '@JIRA-STORY:PO-500', '@JIRA-KEY:POT-4034') },
    () => {
      setupComponent(null, 'company', FINES_COMMENT_AND_NOTES_COMP_MANDATORY_COMPLETED_MOCK);

      cy.get(L.returnToAccountDetailsButton).should('exist');
      cy.get(L.cancelLink).should('exist');

      cy.get(L.returnToAccountDetailsButton).should('exist');
      cy.get(L.reviewAndSubmitButton).should('exist');
      cy.get(L.cancelLink).should('exist');
    },
  );
  it(
    '(AC.8) should not display the grey navigation button when mandatory sections of the MAC process are missing - Adult or youth only',
    { tags: buildTags('@JIRA-STORY:PO-272', '@JIRA-STORY:PO-469', '@JIRA-KEY:POT-4035') },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_COMMENT_AND_NOTES_AY_MANDATORY_MISSING_MOCK);

      cy.get(L.returnToAccountDetailsButton).should('exist');
      cy.get(L.cancelLink).should('exist');

      cy.get(L.returnToAccountDetailsButton).should('exist');
      cy.get(L.reviewAndSubmitButton).should('not.exist');
      cy.get(L.cancelLink).should('exist');
    },
  );
  it(
    '(AC.8) should not display the grey navigation button when mandatory sections of the MAC process are missing - Parent or guardian',
    { tags: buildTags('@JIRA-STORY:PO-272', '@JIRA-STORY:PO-469', '@JIRA-KEY:POT-4036') },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_COMMENT_AND_NOTES_PG_MANDATORY_MISSING_MOCK);

      cy.get(L.returnToAccountDetailsButton).should('exist');
      cy.get(L.cancelLink).should('exist');

      cy.get(L.returnToAccountDetailsButton).should('exist');
      cy.get(L.reviewAndSubmitButton).should('not.exist');
      cy.get(L.cancelLink).should('exist');
    },
  );
  it(
    '(AC.8) should not display the grey navigation button when mandatory sections of the MAC process are missing - Company',
    { tags: buildTags('@JIRA-STORY:PO-272', '@JIRA-STORY:PO-469', '@JIRA-KEY:POT-4037') },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_COMMENT_AND_NOTES_COMP_MANDATORY_MISSING_MOCK);

      cy.get(L.returnToAccountDetailsButton).should('exist');
      cy.get(L.cancelLink).should('exist');

      cy.get(L.returnToAccountDetailsButton).should('exist');
      cy.get(L.reviewAndSubmitButton).should('not.exist');
      cy.get(L.cancelLink).should('exist');
    },
  );

  it(
    '(AC.1) should update character count hint for account comments',
    { tags: buildTags('@JIRA-STORY:PO-545', '@JIRA-STORY:PO-773', '@JIRA-KEY:POT-4038') },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);
      cy.get(L.commentInput).clear().type('a'.repeat(1), { delay: 0 });
      cy.get(L.commentCharHint).should('contain', 'You have 29 characters remaining');

      cy.get(L.commentInput).clear().type('a'.repeat(10), { delay: 0 });
      cy.get(L.commentCharHint).should('contain', 'You have 20 characters remaining');
    },
  );
  it(
    '(AC.1) should update character count hint for account notes',
    { tags: buildTags('@JIRA-STORY:PO-545', '@JIRA-STORY:PO-773', '@JIRA-KEY:POT-4039') },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);
      cy.get(L.noteInput).clear().type('a'.repeat(1), { delay: 0 });
      cy.get(L.noteCharHint).should('contain', 'You have 999 characters remaining');

      cy.get(L.noteInput).clear().type('a'.repeat(100), { delay: 0 });
      cy.get(L.noteCharHint).should('contain', 'You have 900 characters remaining');
    },
  );
});
