import { mount } from 'cypress/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FinesAccCommentsAddComponent } from '../../../../../src/app/flows/fines/fines-acc/fines-acc-comments-add/fines-acc-comments-add.component';
import { FinesAccountStore } from '../../../../../src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { FinesAccPayloadService } from '../../../../../src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { AccountCommentsAddLocators } from '../../../../shared/selectors/account-details/account.comments.details.locators';
import {
  ADD_COMMENTS_FORM_STATE_MOCK,
  MOCK_ACCOUNT_STATE,
  ADD_COMMENTS_FORM_STATE_MAX_LENGTH_MOCK,
  ADD_COMMENTS_FORM_STATE_ALPHANUMERIC_MOCK,
  ADD_COMMENTS_FORM_STATE_EXCEEDS_LIMITS_MOCK,
  ADD_COMMENTS_FORM_STATE_NON_ALPHANUMERIC_MOCK,
  ADD_COMMENTS_FORM_STATE_MIXED_ERROR_MOCK,
} from './mocks/add_comments_mock';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];
const CommentFields = AccountCommentsAddLocators.fields;
const CommentErrors = AccountCommentsAddLocators.errors;
const CommentCharacterCounts = AccountCommentsAddLocators.characterCounts;
const CommentActions = AccountCommentsAddLocators.actions;

describe('FinesAccCommentsAddComponent', () => {
  const setupComponent = (prefilledData = ADD_COMMENTS_FORM_STATE_MOCK, formSubmit: any = null) => {
    const patchDefendantAccountStub = cy.stub().as('patchDefendantAccount').returns(of(undefined));
    const accountState = structuredClone(MOCK_ACCOUNT_STATE);

    mount(FinesAccCommentsAddComponent, {
      providers: [
        {
          provide: OpalFines,
          useValue: {
            patchDefendantAccount: patchDefendantAccountStub,
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: cy.stub().as('routerNavigate'),
          },
        },
        {
          provide: FinesAccountStore,
          useFactory: () => {
            const store = new FinesAccountStore();
            store.setAccountState(accountState);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                commentsFormData: prefilledData,
              },
            },
          },
        },
        FinesAccPayloadService,
        UtilsService,
      ],
    }).then(({ component }) => {
      if (formSubmit) {
        const original = component.handleAddNoteSubmit.bind(component);
        component.handleAddNoteSubmit = (form: any) => {
          formSubmit(form);
          original(form);
        };
      }
    });
  };

  it(
    'should display the comments form with all required fields',
    { tags: [...buildTags('@JIRA-STORY:PO-777'), '@JIRA-KEY:POT-7137'] },
    () => {
      setupComponent();

      cy.get(AccountCommentsAddLocators.form).should('exist');
      cy.get(CommentFields.comment).should('exist');
      cy.get(CommentFields.line1).should('exist');
      cy.get(CommentFields.line2).should('exist');
      cy.get(CommentFields.line3).should('exist');

      cy.get(CommentFields.comment).should('have.value', '');
      cy.get(CommentFields.line1).should('have.value', '');
      cy.get(CommentFields.line2).should('have.value', '');
      cy.get(CommentFields.line3).should('have.value', '');

      cy.get(CommentActions.saveButton).should('exist');
      cy.get(CommentActions.cancelLink).should('exist');
    },
  );

  it(
    'should enforce field length limits according to specifications (AC2a)',
    { tags: [...buildTags('@JIRA-STORY:PO-777'), '@JIRA-KEY:POT-7138'] },
    () => {
      setupComponent(ADD_COMMENTS_FORM_STATE_MAX_LENGTH_MOCK);

      cy.get(CommentFields.comment).should('have.value', 'A'.repeat(30));

      cy.get(CommentFields.line1).should('have.value', 'B'.repeat(76));
      cy.get(CommentFields.line2).should('have.value', 'C'.repeat(76));
      cy.get(CommentFields.line3).should('have.value', 'D'.repeat(76));
    },
  );

  it(
    'should accept alphanumeric characters in all fields (AC2a)',
    { tags: [...buildTags('@JIRA-STORY:PO-777'), '@JIRA-KEY:POT-7139'] },
    () => {
      setupComponent(ADD_COMMENTS_FORM_STATE_ALPHANUMERIC_MOCK);

      cy.get(CommentFields.comment).should('have.value', 'Test123');
      cy.get(CommentFields.line1).should('have.value', 'ABC123');
      cy.get(CommentFields.line2).should('have.value', 'ABC123');
      cy.get(CommentFields.line3).should('have.value', 'ABC123');
    },
  );

  it(
    'should handle character count and allow clearing fields without errors (AC3, AC3a, AC2a)',
    { tags: [...buildTags('@JIRA-STORY:PO-777'), '@JIRA-KEY:POT-7140'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');

      // AC3: Test character count displays correctly at maximum limits (0 remaining)
      setupComponent(ADD_COMMENTS_FORM_STATE_MAX_LENGTH_MOCK, mockFormSubmit);

      cy.get(CommentFields.comment).should('have.value', 'A'.repeat(30));
      cy.get(CommentCharacterCounts.comment).should('contain', 'You have 0 characters remaining');

      cy.get(CommentFields.line1).should('have.value', 'B'.repeat(76));
      cy.get(CommentCharacterCounts.line1).should('contain', 'You have 0 characters remaining');

      cy.get(CommentFields.line2).should('have.value', 'C'.repeat(76));
      cy.get(CommentCharacterCounts.line2).should('contain', 'You have 0 characters remaining');

      cy.get(CommentFields.line3).should('have.value', 'D'.repeat(76));
      cy.get(CommentCharacterCounts.line3).should('contain', 'You have 0 characters remaining');

      // AC3a: Test clearing all fields and verify no errors occur
      cy.get(CommentFields.comment).clear();
      cy.get(CommentFields.line1).clear();
      cy.get(CommentFields.line2).clear();
      cy.get(CommentFields.line3).clear();

      cy.get(CommentFields.comment).should('have.value', '');
      cy.get(CommentFields.line1).should('have.value', '');
      cy.get(CommentFields.line2).should('have.value', '');
      cy.get(CommentFields.line3).should('have.value', '');

      cy.get(CommentCharacterCounts.comment).should('contain', 'You have 30 characters remaining');
      cy.get(CommentCharacterCounts.line1).should('contain', 'You have 76 characters remaining');
      cy.get(CommentCharacterCounts.line2).should('contain', 'You have 76 characters remaining');
      cy.get(CommentCharacterCounts.line3).should('contain', 'You have 76 characters remaining');

      // AC2a: Should verify all fields are optional
      cy.get(CommentActions.saveButton).should('not.be.disabled');
      cy.get(CommentActions.saveButton).click();

      cy.get('@formSubmitSpy').should('have.been.calledOnce');
    },
  );

  it(
    'should display error messages for non-alphanumeric characters (AC4a)',
    { tags: [...buildTags('@JIRA-STORY:PO-777'), '@JIRA-KEY:POT-7141'] },
    () => {
      setupComponent(ADD_COMMENTS_FORM_STATE_NON_ALPHANUMERIC_MOCK);

      cy.get(CommentFields.comment).should('have.value', '<Test>');
      cy.get(CommentFields.line1).should('have.value', '<Test>');
      cy.get(CommentFields.line2).should('have.value', '<Test>');
      cy.get(CommentFields.line3).should('have.value', '<Test>');

      cy.get(CommentActions.saveButton).click();

      cy.get(AccountCommentsAddLocators.errorSummary).should('exist');

      cy.get(CommentErrors.comment)
        .should('exist')
        .and('be.visible')
        .and(
          'contain',
          'Account comment must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
        );

      cy.get(CommentErrors.line1)
        .should('exist')
        .and('be.visible')
        .and(
          'contain',
          'Free text 1 must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
        );

      cy.get(CommentErrors.line2)
        .should('exist')
        .and('be.visible')
        .and(
          'contain',
          'Free text 2 must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
        );

      cy.get(CommentErrors.line3)
        .should('exist')
        .and('be.visible')
        .and(
          'contain',
          'Free text 3 must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
        );
    },
  );

  it(
    'should display error messages for exceeding character limits (AC4b)',
    { tags: [...buildTags('@JIRA-STORY:PO-777'), '@JIRA-KEY:POT-7142'] },
    () => {
      setupComponent(ADD_COMMENTS_FORM_STATE_EXCEEDS_LIMITS_MOCK);

      cy.get(CommentFields.comment).should('have.value', 'A'.repeat(31));
      cy.get(CommentFields.line1).should('have.value', 'B'.repeat(77));
      cy.get(CommentFields.line2).should('have.value', 'C'.repeat(77));
      cy.get(CommentFields.line3).should('have.value', 'D'.repeat(77));

      cy.get(CommentActions.saveButton).click();

      cy.get(AccountCommentsAddLocators.errorSummary).should('exist');

      cy.get(CommentErrors.comment)
        .should('exist')
        .and('be.visible')
        .and('contain', 'Account note must be 30 characters or fewer');

      cy.get(CommentErrors.line1)
        .should('exist')
        .and('be.visible')
        .and('contain', 'Free text 1 must be 76 characters or fewer');

      cy.get(CommentErrors.line2)
        .should('exist')
        .and('be.visible')
        .and('contain', 'Free text 2 must be 76 characters or fewer');

      cy.get(CommentErrors.line3)
        .should('exist')
        .and('be.visible')
        .and('contain', 'Free text 3 must be 76 characters or fewer');
    },
  );

  it(
    'should clear error messages when Save comment button is clicked with valid data (AC5bi)',
    { tags: [...buildTags('@JIRA-STORY:PO-777'), '@JIRA-KEY:POT-7143'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');
      // Start with mixed error state to demonstrate error clearing workflow
      setupComponent(ADD_COMMENTS_FORM_STATE_MIXED_ERROR_MOCK, mockFormSubmit);

      // Verify we have the mixed error data loaded
      cy.get(CommentFields.comment).should('have.value', 'A'.repeat(31));
      cy.get(CommentFields.line1).should('have.value', 'B'.repeat(77));
      cy.get(CommentFields.line2).should('have.value', '<Invalid>');
      cy.get(CommentFields.line3).should('have.value', 'C'.repeat(77));

      // Trigger validation errors
      cy.get(CommentActions.saveButton).click();
      cy.get(AccountCommentsAddLocators.errorSummary).should('exist');
      cy.get(CommentErrors.comment).should('exist');

      // Now clear the fields and enter valid data
      cy.get(CommentFields.comment).clear().type('Valid comment', { delay: 0 });
      cy.get(CommentFields.line1).clear().type('Valid free text 1', { delay: 0 });
      cy.get(CommentFields.line2).clear().type('Valid free text 2', { delay: 0 });
      cy.get(CommentFields.line3).clear().type('Valid free text 3', { delay: 0 });

      // Submit with valid data
      cy.get(CommentActions.saveButton).click();
      cy.get('@formSubmitSpy').should('have.been.calledOnce');
      // Verify error messages are cleared
      cy.get(AccountCommentsAddLocators.errorSummary).should('not.exist');
      cy.get(CommentErrors.comment).should('not.exist');
      cy.get(CommentErrors.line1).should('not.exist');
      cy.get(CommentErrors.line2).should('not.exist');
      cy.get(CommentErrors.line3).should('not.exist');
    },
  );

  it(
    'should handle various form submission scenarios with valid data (AC5, AC2a, AC5d)',
    { tags: [...buildTags('@JIRA-STORY:PO-777'), '@JIRA-KEY:POT-7144'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');
      setupComponent(ADD_COMMENTS_FORM_STATE_MOCK, mockFormSubmit);

      // Verify initial empty state
      cy.get(CommentFields.comment).should('have.value', '');
      cy.get(CommentFields.line1).should('have.value', '');
      cy.get(CommentFields.line2).should('have.value', '');
      cy.get(CommentFields.line3).should('have.value', '');

      // AC5d: Verify the fields appear in the correct order in the DOM
      cy.get(CommentFields.line1).should('exist');
      cy.get(CommentFields.line2).should('exist');
      cy.get(CommentFields.line3).should('exist');

      // Verify the order by checking their relative positions
      cy.get(CommentFields.line1).then(($field1) => {
        cy.get(CommentFields.line2).then(($field2) => {
          cy.get(CommentFields.line3).then(($field3) => {
            const field1Top = $field1[0].getBoundingClientRect().top;
            const field2Top = $field2[0].getBoundingClientRect().top;
            const field3Top = $field3[0].getBoundingClientRect().top;

            expect(field1Top).to.be.lessThan(field2Top);
            expect(field2Top).to.be.lessThan(field3Top);
          });
        });
      });

      // AC2a: Test that all fields are optional - submit with empty form
      cy.get(CommentActions.saveButton).should('not.be.disabled');
      cy.get(CommentActions.saveButton).click();
      cy.get('@formSubmitSpy').should('have.been.calledOnce');
    },
  );

  it(
    'should allow saving when user has not made amendments (AC8)',
    { tags: [...buildTags('@JIRA-STORY:PO-777'), '@JIRA-KEY:POT-7145'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');
      // Start with pre-filled data to simulate existing comments
      setupComponent(ADD_COMMENTS_FORM_STATE_ALPHANUMERIC_MOCK, mockFormSubmit);

      // Verify data is pre-filled
      cy.get(CommentFields.comment).should('have.value', 'Test123');
      cy.get(CommentFields.line1).should('have.value', 'ABC123');

      // Don't make any changes - just click Save comment button
      cy.get(CommentActions.saveButton).should('not.be.disabled');
      cy.get(CommentActions.saveButton).click();

      // Verify form submission was triggered even without changes (AC8a - API call will be made)
      cy.get('@formSubmitSpy').should('have.been.calledOnce');
    },
  );
});
