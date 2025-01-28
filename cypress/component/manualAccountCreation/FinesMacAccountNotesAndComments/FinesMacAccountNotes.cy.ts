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

  afterEach(() => {
    cy.then(() => {
      mockFinesService.finesMacState.accountCommentsNotes.formData = {
        fm_account_comments_notes_comments: '',
        fm_account_comments_notes_notes: '',
      };
    });
  });

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

  it('should render the component', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['app']).should('exist');
  });

  it('should show allow users to fill in data and submit successfully', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    mockFinesService.finesMacState.accountCommentsNotes.formData = {
      fm_account_comments_notes_comments: 'Comments',
      fm_account_comments_notes_notes: 'important notes',
    };

    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should allow users to submit without typing anything', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get(DOM_ELEMENTS['submitButton']).first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});
