import { mount } from 'cypress/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FinesMacCreateAccountFormComponent } from 'src/app/flows/fines/fines-mac/fines-mac-create-account/fines-mac-create-account-form/fines-mac-create-account-form.component';

describe('FinesMacCreateAccountFormComponent', () => {
  const ACCOUNT_CREATION_TEXT = 'The account will be created in Business Unit 1';
  const PAGE_HEADING = 'Business unit and defendant type';
  const SELECTORS = {
    heading: 'h1',
    autocomplete: '#fm_create_account_business_unit_id-autocomplete',
    submitButton: 'button#submitForm',
    cancelLink: 'app-govuk-cancel-link a.govuk-link.button-link',
    errorSummary: '.govuk-error-summary',
    errorList: '.govuk-error-summary__list',
  };
  const BUTTON_TEXT = {
    continue: 'Continue',
    cancel: 'Cancel',
  };
  const ACCOUNT_TYPE_TEST_CASES = [
    { id: 'fine', fieldset: '#fm_create_account_fine_defendant_type' },
    { id: 'fixedPenalty', fieldset: '#fm_create_account_fixed_penalty_defendant_type' },
    { id: 'conditionalCaution', hint: '#conditionalCaution-item-hint', hintText: 'Adult or youth only' },
  ];
  const ERROR_MESSAGES = {
    businessUnit: 'Enter a business unit',
    accountType: 'Select an account type',
    defendantType: 'Select a defendant type',
  };

  const setupComponent = (autoCompleteItems: { value: string; name: string }[] = []) => {
    mount(FinesMacCreateAccountFormComponent, {
      imports: [ReactiveFormsModule],
      providers: [
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
        autoCompleteItems,
      },
    });
  };

  it('should render the form with singular business unit', () => {
    setupComponent([{ value: '1', name: 'Business Unit 1' }]);

    // Verify page heading
    cy.get(SELECTORS.heading).should('contain', PAGE_HEADING);

    // Verify the paragraph is displayed with the correct text
    cy.get('p').should('exist').and('contain', ACCOUNT_CREATION_TEXT);

    // Ensure the autocomplete component is not rendered
    cy.get(SELECTORS.autocomplete).should('not.exist');

    // Verify account type radio buttons
    ACCOUNT_TYPE_TEST_CASES.forEach(({ id }) => {
      cy.get(`input[type="radio"]#${id}`).should('exist');
    });

    // Verify submit and cancel buttons
    cy.get(SELECTORS.submitButton).should('exist').and('contain', BUTTON_TEXT.continue);
    cy.get(SELECTORS.cancelLink).should('exist').and('contain', BUTTON_TEXT.cancel);
  });

  it('should render the form with multiple business units', () => {
    setupComponent([
      { value: '1', name: 'Business Unit 1' },
      { value: '2', name: 'Business Unit 2' },
    ]);

    // Verify page heading
    cy.get(SELECTORS.heading).should('contain', PAGE_HEADING);

    // Verify business unit autocomplete input
    cy.get(SELECTORS.autocomplete).should('exist');

    // Interact with autocomplete
    cy.get(SELECTORS.autocomplete).type('Business Unit 1');
    cy.get('ul li').first().click();
    cy.get(SELECTORS.autocomplete).should('have.value', 'Business Unit 1');

    // Verify account type radio buttons
    ACCOUNT_TYPE_TEST_CASES.forEach(({ id }) => {
      cy.get(`input[type="radio"]#${id}`).should('exist');
    });

    // Verify submit and cancel buttons
    cy.get(SELECTORS.submitButton).should('exist').and('contain', BUTTON_TEXT.continue);
    cy.get(SELECTORS.cancelLink).should('exist').and('contain', BUTTON_TEXT.cancel);
  });

  it('should validate accessibility attributes', () => {
    setupComponent([
      { value: '1', name: 'Business Unit 1' },
      { value: '2', name: 'Business Unit 2' },
    ]);

    cy.get(SELECTORS.submitButton).click();

    // Verify the outer error summary container exists
    cy.get(SELECTORS.errorSummary).should('exist');

    // Verify the inner role="alert" container
    cy.get(`${SELECTORS.errorSummary} div[role="alert"]`).should('exist');

    // Verify the error summary title
    cy.get('.govuk-error-summary__title').should('contain', 'There is a problem');
  });

  it('should simulate partial inputs and navigation', () => {
    setupComponent([
      { value: '1', name: 'Business Unit 1' },
      { value: '2', name: 'Business Unit 2' },
    ]);

    // Interact with partial input
    cy.get(SELECTORS.autocomplete).type('Bus').blur();

    // Navigate between account types
    ACCOUNT_TYPE_TEST_CASES.forEach(({ id }) => {
      cy.get(`input[type="radio"]#${id}`).check();
    });

    // Ensure partial input persists
    cy.get(SELECTORS.autocomplete).should('have.value', 'Bus');
  });

  it('should validate form performance', () => {
    setupComponent();

    const startTime = performance.now();

    // Submit form
    cy.get(SELECTORS.submitButton).click();

    // Verify error messages
    cy.get(SELECTORS.errorSummary).should('exist');

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Check performance threshold
    expect(duration).to.be.lessThan(2000); // Adjust threshold as needed
  });

  it('should handle rapid account type switching correctly', () => {
    setupComponent();

    cy.get('input[type="radio"]#fine').check();
    cy.get('input[type="radio"]#fixedPenalty').check();
    cy.get('#fm_create_account_fine_defendant_type').should('not.exist');
    cy.get('#fm_create_account_fixed_penalty_defendant_type').should('exist');
  });

  it('should handle whitespace-only inputs correctly', () => {
    setupComponent([
      { value: '1', name: 'Business Unit 1' },
      { value: '2', name: 'Business Unit 2' },
    ]);

    // Verify no errors initially
    cy.get(SELECTORS.errorSummary).should('not.exist');

    // Submit form with whitespace-only input
    cy.get(SELECTORS.autocomplete).type('   ').blur();
    cy.get(SELECTORS.submitButton).click();

    // Verify error message
    cy.get(SELECTORS.errorSummary).should('exist');
    cy.get(SELECTORS.errorList).should('contain', ERROR_MESSAGES.businessUnit);
  });

  it('should display error messages for invalid form submission', () => {
    setupComponent();

    // Verify no error messages initially
    cy.get(SELECTORS.errorSummary).should('not.exist');

    // Submit the form without selecting values
    cy.get(SELECTORS.submitButton).click();

    // Verify error messages are displayed
    cy.get(SELECTORS.errorSummary).should('exist');
    cy.get(SELECTORS.errorList)
      .should('exist')
      .within(() => {
        cy.get('li').eq(0).should('contain', ERROR_MESSAGES.businessUnit);
        cy.get('li').eq(1).should('contain', ERROR_MESSAGES.accountType);
      });

    // Select a fine account type
    cy.get('input[type="radio"]#fine').check();

    // Submit the form without selecting business unit or defendant type
    cy.get(SELECTORS.submitButton).click();

    // Verify error messages are displayed
    cy.get(SELECTORS.errorSummary).should('exist');
    cy.get(SELECTORS.errorList)
      .should('exist')
      .within(() => {
        cy.get('li').eq(0).should('contain', ERROR_MESSAGES.businessUnit);
        cy.get('li').eq(1).should('contain', ERROR_MESSAGES.defendantType);
      });
  });
});
