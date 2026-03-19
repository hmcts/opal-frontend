import { mount } from 'cypress/angular';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesMacDeleteAccountConfirmationComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-delete-account-confirmation/fines-mac-delete-account-confirmation.component';

const MANUAL_ACCOUNT_CREATION_JIRA_LABEL = '@JIRA-LABEL:manual-account-creation';

const buildTags = (...tags: string[]) => [...tags, MANUAL_ACCOUNT_CREATION_JIRA_LABEL];

describe('FinesMacDeleteAccountConfirmation', () => {
  let mockFinesService = {
    finesMacState: { ...FINES_MAC_STATE_MOCK },
  };

  afterEach(() => {
    cy.then(() => {
      mockFinesService.finesMacState.accountCommentsNotes.formData = {
        fm_account_comments_notes_comments: '',
        fm_account_comments_notes_notes: '',
        fm_account_comments_notes_system_notes: '',
      };
    });
  });

  const setupComponent = () => {
    mount(FinesMacDeleteAccountConfirmationComponent, {
      providers: [
        { provide: OpalFines, useValue: mockFinesService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'draftAccountId' ? '42' : null),
              },
              parent: {
                snapshot: {
                  url: [{ path: 'manual-account-creation' }],
                },
              },
            },
          },
        },
      ],
      componentProperties: {},
    });
  };

  it(
    '(AC.2)should render the component and have all elements ',
    { tags: buildTags('@JIRA-STORY:PO-518', '@JIRA-KEY:POT-4137') },
    () => {
      setupComponent();

      cy.get('h1').should('contain', 'Are you sure you want to delete this account?');
      cy.get('button[id = "confirmDeletion"]').should('contain', 'Yes - delete');
      cy.get('a').should('contain', 'No - cancel');
    },
  );
});
