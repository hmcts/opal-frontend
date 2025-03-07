import { mount } from 'cypress/angular';
import { FinesMacAccountCommentsNotesComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-account-comments-notes/fines-mac-account-comments-notes.component';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { DOM_ELEMENTS } from './constants/fines-mac-account-notes-and-comments-elements';
import { IFinesMacState } from 'src/app/flows/fines/fines-mac/interfaces/fines-mac-state.interface';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_COMMENT_AND_NOTES_AY_MANDATORY_COMPLETED_MOCK } from './mocks/fines_mac_account_comments_and_notes_AY_mandatory_completed_mock';
import { FINES_COMMENT_AND_NOTES_AY_MANDATORY_MISSING_MOCK } from './mocks/fines_mac_account_comments_and_notes_AY_mandatory_missing_mock';
import { FINES_COMMENT_AND_NOTES_PG_MANDATORY_COMPLETED_MOCK } from './mocks/fines_mac_account_comments_and_notes_PG_mandatory_completed_mock';
import { FINES_COMMENT_AND_NOTES_COMP_MANDATORY_COMPLETED_MOCK } from './mocks/fines_mac_account_comments_and_notes_COMP_mandatory_completed_mock';
import { FINES_COMMENT_AND_NOTES_COMP_MANDATORY_MISSING_MOCK } from './mocks/fines_mac_account_comments_and_notes_COMP_mandatory_missing_mock';
import { FINES_COMMENT_AND_NOTES_PG_MANDATORY_MISSING_MOCK } from './mocks/fines_mac_account_comments_and_notes_PG_mandatory_missing_mock';

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
            parent: {
              snapshot: {
                url: [{ path: 'manual-account-creation' }],
              },
            },
          },
        },
      ],
      componentProperties: {
        handleAccountCommentsNoteSubmit: formSubmit,
        defendantType: defendantTypeMock,
      },
    });
  };

  afterEach(() => {
    cy.then(() => {
      // mockFinesService.finesMacState.accountCommentsNotes.formData = {
      //   fm_account_comments_notes_comments: '',
      //   fm_account_comments_notes_notes: '',
      // };
    });
  });

  it('should render the component', () => {
    setupComponent(null, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('(AC.1) should load all elements on the screen correctly', { tags: ['@PO-272', '@PO-469'] }, () => {
    setupComponent(null, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);

    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Account comments and notes');
    cy.get(DOM_ELEMENTS.commentLabel).should('contain', 'Add comment');
    cy.get(DOM_ELEMENTS.commentHint).should(
      'contain',
      'For example, a warning, which will appear on the account summary',
    );
    cy.get(DOM_ELEMENTS.commentInput).should('exist');
    cy.get(DOM_ELEMENTS.noteLabel).should('contain', 'Add account notes');
    cy.get(DOM_ELEMENTS.noteHint).should(
      'contain',
      'You can view notes in account history after the account is published',
    );
    cy.get(DOM_ELEMENTS.noteInput).should('exist');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Return to account details');
    cy.get(DOM_ELEMENTS.cancelLink).should('exist');
  });

  it('(AC.2) should have character limits for account comments', { tags: ['@PO-272', '@PO-469'] }, () => {
    setupComponent(null, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);

    cy.get(DOM_ELEMENTS.commentInput).should('have.attr', 'maxlength', '30');
    cy.get(DOM_ELEMENTS.commentInput).clear().type('a'.repeat(30), { delay: 0 });
    cy.get(DOM_ELEMENTS.commentInput).should('have.value', 'a'.repeat(30));
    cy.get(DOM_ELEMENTS.commentCharHint).should('contain', 'You have 0 characters remaining');

    cy.get(DOM_ELEMENTS.commentInput).clear().type('a'.repeat(31), { delay: 0 });
    cy.get(DOM_ELEMENTS.commentInput).should('have.value', 'a'.repeat(30));
    cy.get(DOM_ELEMENTS.commentCharHint).should('contain', 'You have 0 characters remaining');

    cy.get(DOM_ELEMENTS.commentInput).clear().type('a'.repeat(29), { delay: 0 });
    cy.get(DOM_ELEMENTS.commentInput).should('have.value', 'a'.repeat(29));
    cy.get(DOM_ELEMENTS.commentCharHint).should('contain', 'You have 1 character remaining');
  });

  it('(AC.3) should have character limits for account notes', { tags: ['@PO-272', '@PO-469'] }, () => {
    setupComponent(null, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);

    cy.get(DOM_ELEMENTS.noteInput).should('have.attr', 'maxlength', '1000');
    cy.get(DOM_ELEMENTS.noteInput).clear().type('a'.repeat(1000), { delay: 0 });
    cy.get(DOM_ELEMENTS.noteInput).should('have.value', 'a'.repeat(1000));
    cy.get(DOM_ELEMENTS.noteCharHint).should('contain', 'You have 0 characters remaining');

    cy.get(DOM_ELEMENTS.noteInput).clear().type('a'.repeat(1001), { delay: 0 });
    cy.get(DOM_ELEMENTS.noteInput).should('have.value', 'a'.repeat(1000));
    cy.get(DOM_ELEMENTS.noteCharHint).should('contain', 'You have 0 characters remaining');

    cy.get(DOM_ELEMENTS.noteInput).clear().type('a'.repeat(999), { delay: 0 });
    cy.get(DOM_ELEMENTS.noteInput).should('have.value', 'a'.repeat(999));
    cy.get(DOM_ELEMENTS.noteCharHint).should('contain', 'You have 1 character remaining');
  });

  it('(AC.1) should allow users to fill in data and submit with no errors', { tags: ['@PO-272', '@PO-469'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('.errorSummary').should('not.exist');
    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('(AC.1) should allow users to submit without entering data', { tags: ['@PO-272', '@PO-469'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('.errorSummary').should('not.exist');
    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it(
    '(AC.8) should display the grey navigation button only when mandatory sections of the MAC process are populated - Adult or youth only',
    { tags: ['@PO-272', '@PO-469'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_COMMENT_AND_NOTES_AY_MANDATORY_COMPLETED_MOCK);

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.reviewAndSubmitButton).should('exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');
    },
  );
  it(
    '(AC.8) should display the grey navigation button only when mandatory sections of the MAC process are populated - Parent or guardian',
    { tags: ['@PO-344', '@PO-499'] },
    () => {
      setupComponent(null, 'parentOrGuardianToPay', FINES_COMMENT_AND_NOTES_PG_MANDATORY_COMPLETED_MOCK);

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.reviewAndSubmitButton).should('exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');
    },
  );
  it(
    '(AC.8) should display the grey navigation button only when mandatory sections of the MAC process are populated - Company',
    { tags: ['@PO-345', '@PO-500'] },
    () => {
      setupComponent(null, 'company', FINES_COMMENT_AND_NOTES_COMP_MANDATORY_COMPLETED_MOCK);

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.reviewAndSubmitButton).should('exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');
    },
  );
  it(
    '(AC.8) should not display the grey navigation button when mandatory sections of the MAC process are missing - Adult or youth only',
    { tags: ['@PO-272', '@PO-469'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_COMMENT_AND_NOTES_AY_MANDATORY_MISSING_MOCK);

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.reviewAndSubmitButton).should('not.exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');
    },
  );
  it(
    '(AC.8) should not display the grey navigation button when mandatory sections of the MAC process are missing - Parent or guardian',
    { tags: ['@PO-272', '@PO-469'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_COMMENT_AND_NOTES_PG_MANDATORY_MISSING_MOCK);

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.reviewAndSubmitButton).should('not.exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');
    },
  );
  it(
    '(AC.8) should not display the grey navigation button when mandatory sections of the MAC process are missing - Company',
    { tags: ['@PO-272', '@PO-469'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_COMMENT_AND_NOTES_COMP_MANDATORY_MISSING_MOCK);

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.reviewAndSubmitButton).should('not.exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');
    },
  );

  it('(AC.1) should update character count hint for account comments', { tags: ['@PO-545', '@PO-773'] }, () => {
    setupComponent(null, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);
    cy.get(DOM_ELEMENTS.commentInput).clear().type('a'.repeat(1), { delay: 0 });
    cy.get(DOM_ELEMENTS.commentCharHint).should('contain', 'You have 29 characters remaining');

    cy.get(DOM_ELEMENTS.commentInput).clear().type('a'.repeat(10), { delay: 0 });
    cy.get(DOM_ELEMENTS.commentCharHint).should('contain', 'You have 20 characters remaining');
  });
  it('(AC.1) should update character count hint for account notes', { tags: ['@PO-545', '@PO-773'] }, () => {
    setupComponent(null, 'adultOrYouthOnly', FINES_MAC_STATE_MOCK);
    cy.get(DOM_ELEMENTS.noteInput).clear().type('a'.repeat(1), { delay: 0 });
    cy.get(DOM_ELEMENTS.noteCharHint).should('contain', 'You have 999 characters remaining');

    cy.get(DOM_ELEMENTS.noteInput).clear().type('a'.repeat(100), { delay: 0 });
    cy.get(DOM_ELEMENTS.noteCharHint).should('contain', 'You have 900 characters remaining');
  });
});
