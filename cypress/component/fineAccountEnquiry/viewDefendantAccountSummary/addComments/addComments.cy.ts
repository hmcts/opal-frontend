import { mount } from 'cypress/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

import { FinesAccCommentsAddComponent } from '../../../../../src/app/flows/fines/fines-acc/fines-acc-comments-add/fines-acc-comments-add.component';
import { FinesAccountStore } from '../../../../../src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { FinesAccPayloadService } from '../../../../../src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

import { DOM_ELEMENTS } from './constants/add_comments_elements';
import { 
  ADD_COMMENTS_FORM_STATE_MOCK, 
  MOCK_ACCOUNT_STATE,
  ADD_COMMENTS_FORM_STATE_MAX_LENGTH_MOCK,
  ADD_COMMENTS_FORM_STATE_ALPHANUMERIC_MOCK,
  ADD_COMMENTS_FORM_STATE_EXCEEDS_LIMITS_MOCK,
  ADD_COMMENTS_FORM_STATE_NON_ALPHANUMERIC_MOCK,
  ADD_COMMENTS_FORM_STATE_MIXED_ERROR_MOCK
} from './mocks/add_comments_mock';

describe('FinesAccCommentsAddComponent', () => {
  const setupComponent = (prefilledData = ADD_COMMENTS_FORM_STATE_MOCK, formSubmit: any = null) => {
    mount(FinesAccCommentsAddComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        {
          provide: FinesAccountStore,
          useFactory: () => {
            const store = new FinesAccountStore();
            store.setAccountState(MOCK_ACCOUNT_STATE);
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
      componentProperties: {
        handleAddNoteSubmit: formSubmit,
      },
    });
  };

  it('should display the comments form with all required fields', { tags: ['@PO-777'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.form).should('exist');
    cy.get(DOM_ELEMENTS.commentField).should('exist');
    cy.get(DOM_ELEMENTS.freeText1Field).should('exist');
    cy.get(DOM_ELEMENTS.freeText2Field).should('exist');
    cy.get(DOM_ELEMENTS.freeText3Field).should('exist');

    cy.get(DOM_ELEMENTS.commentField).should('have.value', '');
    cy.get(DOM_ELEMENTS.freeText1Field).should('have.value', '');
    cy.get(DOM_ELEMENTS.freeText2Field).should('have.value', '');
    cy.get(DOM_ELEMENTS.freeText3Field).should('have.value', '');

    cy.get(DOM_ELEMENTS.submitButton).should('exist');
    cy.get(DOM_ELEMENTS.cancelButton).should('exist');
  });

  it('should enforce field length limits according to specifications (AC2a)', { tags: ['@PO-777'] }, () => {
    setupComponent(ADD_COMMENTS_FORM_STATE_MAX_LENGTH_MOCK);

    cy.get(DOM_ELEMENTS.commentField).should('have.value', 'A'.repeat(30));


    cy.get(DOM_ELEMENTS.freeText1Field).should('have.value', 'B'.repeat(76));
    cy.get(DOM_ELEMENTS.freeText2Field).should('have.value', 'C'.repeat(76));
    cy.get(DOM_ELEMENTS.freeText3Field).should('have.value', 'D'.repeat(76));
  });

  it('should accept alphanumeric characters in all fields (AC2a)', { tags: ['@PO-777'] }, () => {
    setupComponent(ADD_COMMENTS_FORM_STATE_ALPHANUMERIC_MOCK);

    cy.get(DOM_ELEMENTS.commentField).should('have.value', 'Test123');
    cy.get(DOM_ELEMENTS.freeText1Field).should('have.value', 'ABC123');
    cy.get(DOM_ELEMENTS.freeText2Field).should('have.value', 'ABC123');
    cy.get(DOM_ELEMENTS.freeText3Field).should('have.value', 'ABC123');
  });


  it('should handle character count and allow clearing fields without errors (AC3, AC3a, AC2a)', { tags: ['@PO-777'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    
    // AC3: Test character count displays correctly at maximum limits (0 remaining)
    setupComponent(ADD_COMMENTS_FORM_STATE_MAX_LENGTH_MOCK, mockFormSubmit);

    cy.get(DOM_ELEMENTS.commentField).should('have.value', 'A'.repeat(30));
    cy.get(DOM_ELEMENTS.commentCharacterCount).should('contain', 'You have 0 characters remaining');

    cy.get(DOM_ELEMENTS.freeText1Field).should('have.value', 'B'.repeat(76));
    cy.get(DOM_ELEMENTS.freeText1CharacterCount).should('contain', 'You have 0 characters remaining');

    cy.get(DOM_ELEMENTS.freeText2Field).should('have.value', 'C'.repeat(76));
    cy.get(DOM_ELEMENTS.freeText2CharacterCount).should('contain', 'You have 0 characters remaining');

    cy.get(DOM_ELEMENTS.freeText3Field).should('have.value', 'D'.repeat(76));
    cy.get(DOM_ELEMENTS.freeText3CharacterCount).should('contain', 'You have 0 characters remaining');

    // AC3a: Test clearing all fields and verify no errors occur
    cy.get(DOM_ELEMENTS.commentField).clear();
    cy.get(DOM_ELEMENTS.freeText1Field).clear();
    cy.get(DOM_ELEMENTS.freeText2Field).clear();
    cy.get(DOM_ELEMENTS.freeText3Field).clear();

    cy.get(DOM_ELEMENTS.commentField).should('have.value', '');
    cy.get(DOM_ELEMENTS.freeText1Field).should('have.value', '');
    cy.get(DOM_ELEMENTS.freeText2Field).should('have.value', '');
    cy.get(DOM_ELEMENTS.freeText3Field).should('have.value', '');

    cy.get(DOM_ELEMENTS.commentCharacterCount).should('contain', 'You have 30 characters remaining');
    cy.get(DOM_ELEMENTS.freeText1CharacterCount).should('contain', 'You have 76 characters remaining');
    cy.get(DOM_ELEMENTS.freeText2CharacterCount).should('contain', 'You have 76 characters remaining');
    cy.get(DOM_ELEMENTS.freeText3CharacterCount).should('contain', 'You have 76 characters remaining');


    // AC2a: Should verify all fields are optional
    cy.get(DOM_ELEMENTS.submitButton).should('not.be.disabled');
    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should display error messages for non-alphanumeric characters (AC4a)', { tags: ['@PO-777'] }, () => {
    setupComponent(ADD_COMMENTS_FORM_STATE_NON_ALPHANUMERIC_MOCK);

    cy.get(DOM_ELEMENTS.commentField).should('have.value', '<Test>');
    cy.get(DOM_ELEMENTS.freeText1Field).should('have.value', '<Test>');
    cy.get(DOM_ELEMENTS.freeText2Field).should('have.value', '<Test>');
    cy.get(DOM_ELEMENTS.freeText3Field).should('have.value', '<Test>');

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');

    cy.get(DOM_ELEMENTS.commentError)
      .should('exist')
      .and('be.visible')
      .and('contain', 'Account comment must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)');

    cy.get(DOM_ELEMENTS.freeText1Error)
      .should('exist')
      .and('be.visible')
      .and('contain', 'Free text 1 must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)');

    cy.get(DOM_ELEMENTS.freeText2Error)
      .should('exist')
      .and('be.visible')
      .and('contain', 'Free text 2 must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)');

    cy.get(DOM_ELEMENTS.freeText3Error)
      .should('exist')
      .and('be.visible')
      .and('contain', 'Free text 3 must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)');
  });

  it('should display error messages for exceeding character limits (AC4b)', { tags: ['@PO-777'] }, () => {
    setupComponent(ADD_COMMENTS_FORM_STATE_EXCEEDS_LIMITS_MOCK);

    cy.get(DOM_ELEMENTS.commentField).should('have.value', 'A'.repeat(31)); 
    cy.get(DOM_ELEMENTS.freeText1Field).should('have.value', 'B'.repeat(77)); 
    cy.get(DOM_ELEMENTS.freeText2Field).should('have.value', 'C'.repeat(77)); 
    cy.get(DOM_ELEMENTS.freeText3Field).should('have.value', 'D'.repeat(77)); 

    cy.get(DOM_ELEMENTS.submitButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');

    cy.get(DOM_ELEMENTS.commentError)
      .should('exist')
      .and('be.visible')
      .and('contain', 'Account note must be 30 characters or fewer');

    cy.get(DOM_ELEMENTS.freeText1Error)
      .should('exist')
      .and('be.visible')
      .and('contain', 'Free text 1 must be 76 characters or fewer');

    cy.get(DOM_ELEMENTS.freeText2Error)
      .should('exist')
      .and('be.visible')
      .and('contain', 'Free text 2 must be 76 characters or fewer');

    cy.get(DOM_ELEMENTS.freeText3Error)
      .should('exist')
      .and('be.visible')
      .and('contain', 'Free text 3 must be 76 characters or fewer');
  });

  it('should clear error messages when Save comment button is clicked with valid data (AC5bi)', { tags: ['@PO-777'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    // Start with mixed error state to demonstrate error clearing workflow
    setupComponent(ADD_COMMENTS_FORM_STATE_MIXED_ERROR_MOCK, mockFormSubmit);

    // Verify we have the mixed error data loaded
    cy.get(DOM_ELEMENTS.commentField).should('have.value', 'A'.repeat(31));
    cy.get(DOM_ELEMENTS.freeText1Field).should('have.value', 'B'.repeat(77));
    cy.get(DOM_ELEMENTS.freeText2Field).should('have.value', '<Invalid>');
    cy.get(DOM_ELEMENTS.freeText3Field).should('have.value', 'C'.repeat(77));

    // Trigger validation errors
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.commentError).should('exist');

    // Now clear the fields and enter valid data
    cy.get(DOM_ELEMENTS.commentField).clear().type('Valid comment', { delay: 0 });
    cy.get(DOM_ELEMENTS.freeText1Field).clear().type('Valid free text 1', { delay: 0 });
    cy.get(DOM_ELEMENTS.freeText2Field).clear().type('Valid free text 2', { delay: 0 });
    cy.get(DOM_ELEMENTS.freeText3Field).clear().type('Valid free text 3', { delay: 0 });

    // Submit with valid data
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get('@formSubmitSpy').should('have.been.calledOnce');
    // Verify error messages are cleared
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
    cy.get(DOM_ELEMENTS.commentError).should('not.exist');
    cy.get(DOM_ELEMENTS.freeText1Error).should('not.exist');
    cy.get(DOM_ELEMENTS.freeText2Error).should('not.exist');
    cy.get(DOM_ELEMENTS.freeText3Error).should('not.exist');
  });

  it('should handle various form submission scenarios with valid data (AC5, AC2a, AC5d)', { tags: ['@PO-777'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(ADD_COMMENTS_FORM_STATE_MOCK, mockFormSubmit);

    // Verify initial empty state
    cy.get(DOM_ELEMENTS.commentField).should('have.value', '');
    cy.get(DOM_ELEMENTS.freeText1Field).should('have.value', '');
    cy.get(DOM_ELEMENTS.freeText2Field).should('have.value', '');
    cy.get(DOM_ELEMENTS.freeText3Field).should('have.value', '');

    // AC5d: Verify the fields appear in the correct order in the DOM
    cy.get(DOM_ELEMENTS.freeText1Field).should('exist');
    cy.get(DOM_ELEMENTS.freeText2Field).should('exist');
    cy.get(DOM_ELEMENTS.freeText3Field).should('exist');

    // Verify the order by checking their relative positions
    cy.get(DOM_ELEMENTS.freeText1Field).then($field1 => {
      cy.get(DOM_ELEMENTS.freeText2Field).then($field2 => {
        cy.get(DOM_ELEMENTS.freeText3Field).then($field3 => {
          const field1Top = $field1[0].getBoundingClientRect().top;
          const field2Top = $field2[0].getBoundingClientRect().top;
          const field3Top = $field3[0].getBoundingClientRect().top;

          expect(field1Top).to.be.lessThan(field2Top);
          expect(field2Top).to.be.lessThan(field3Top);
        });
      });
    });

    // AC2a: Test that all fields are optional - submit with empty form
    cy.get(DOM_ELEMENTS.submitButton).should('not.be.disabled');
    cy.get(DOM_ELEMENTS.submitButton).click();
    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should allow saving when user has not made amendments (AC8)', { tags: ['@PO-777'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    // Start with pre-filled data to simulate existing comments
    setupComponent(ADD_COMMENTS_FORM_STATE_ALPHANUMERIC_MOCK, mockFormSubmit);

    // Verify data is pre-filled
    cy.get(DOM_ELEMENTS.commentField).should('have.value', 'Test123');
    cy.get(DOM_ELEMENTS.freeText1Field).should('have.value', 'ABC123');

    // Don't make any changes - just click Save comment button
    cy.get(DOM_ELEMENTS.submitButton).should('not.be.disabled');
    cy.get(DOM_ELEMENTS.submitButton).click();

    // Verify form submission was triggered even without changes (AC8a - API call will be made)
    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});