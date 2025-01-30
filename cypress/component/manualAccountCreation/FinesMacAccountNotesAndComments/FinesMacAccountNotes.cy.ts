import { mount } from 'cypress/angular';
import { FinesMacAccountCommentsNotesComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-account-comments-notes/fines-mac-account-comments-notes.component';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { DOM_ELEMENTS } from './constants/fines-mac-account-notes-and-comments-elements';

describe('FinesMacAccountNotesAndCommentsComponent', () => {
  let mockFinesService = {
    finesMacState: { ...FINES_MAC_STATE_MOCK },
  };

  const setupComponent = (formSubmit: any, defendantTypeMock: string = '') => {
    mount(FinesMacAccountCommentsNotesComponent, {
      providers: [
        { provide: OpalFines, useValue: mockFinesService },
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
      mockFinesService.finesMacState.accountCommentsNotes.formData = {
        fm_account_comments_notes_comments: '',
        fm_account_comments_notes_notes: '',
      };
    });
  });
  

  it('should render the component', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('should load all elements on the screen correctly', () => {
    setupComponent(null);

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

  it('should show allow users to fill in data and submit successfully', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    mockFinesService.finesMacState.accountCommentsNotes.formData = {
      fm_account_comments_notes_comments: 'Comments',
      fm_account_comments_notes_notes: 'important notes',
    };

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should allow users to submit without typing anything', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should update character count hint for comments and notes', () => {
    setupComponent(null);
    mockFinesService.finesMacState.accountCommentsNotes.formData = {
      fm_account_comments_notes_comments: 'Comments',
      fm_account_comments_notes_notes: 'important notes',
    };

    cy.get(DOM_ELEMENTS.commentCharHint).should('contain', 'You have 22 characters remaining');
    cy.get(DOM_ELEMENTS.noteCharHint).should('contain', 'You have 985 characters remaining');
  });
});
