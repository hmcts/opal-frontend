import { mount } from 'cypress/angular';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesMacSubmitConfirmationComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-submit-confirmation/fines-mac-submit-confirmation.component';

describe('FinesMacSubmitConfirmation', () => {
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

  const setupComponent = () => {
    mount(FinesMacSubmitConfirmationComponent, {
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
      componentProperties: {},
    });
  };

  it('(AC.1,AC.2)should render the component and have all elements ', { tags: ['@PO-973', '@PO-660'] }, () => {
    setupComponent();

    cy.get('opal-lib-govuk-panel').should('contain', "You've submitted this account for review");
    cy.get('h2').should('contain', 'Next steps');
    cy.get('a').should('contain', 'Create a new account');
    cy.get('a').should('contain', 'See all accounts in review');
  });
});
