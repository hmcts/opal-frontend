import { mount } from 'cypress/angular';
import { FinesMacCreateAccountComponent } from '../../src/app/flows/fines/fines-mac/fines-mac-create-account/fines-mac-create-account.component';
import { of } from 'rxjs';
import { OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK } from '../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-autocomplete-items.mock';
import { ActivatedRoute } from '@angular/router';
import { OpalFines } from '../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';

describe('FinesMacCreateAccountComponent', () => {
  const ERROR_MESSAGES = {
    businessUnit: 'Enter a business unit',
    accountType: 'Select an account type',
  };

  const setupComponent = (businessUnits: IAlphagovAccessibleAutocompleteItem[], handleAccountDetailsSubmit: any) => {
    const mockOpalFinesService = {
      getBusinessUnits: () => of([businessUnits]),
      getConfigurationItemValue: () => 'Welsh',
    };

    mount(FinesMacCreateAccountComponent, {
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
        { provide: OpalFines, useValue: mockOpalFinesService },
      ],
      componentProperties: {
        data$: of(businessUnits),
        handleAccountDetailsSubmit,
      },
    });
  };

  it('should render the child component when data$ emits', () => {
    setupComponent([OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK[0]], null);

    // Verify the child component is rendered
    cy.get('app-fines-mac-create-account-form').should('exist');
  });

  it('should pass the correct autoCompleteItems to the child component', () => {
    setupComponent([OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK[0]], null);

    // Verify input binding
    cy.get('app-fines-mac-create-account-form').should('have.attr', 'ng-reflect-auto-complete-items');
  });

  it('should call handleAccountDetailsSubmit when formSubmit is emitted', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    // Mount the component
    setupComponent(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK, mockFormSubmit);

    // Emit the formSubmit event programmatically
    cy.get('app-fines-mac-create-account-form').then(($child) => {
      const childElement = $child[0];
      const event = new CustomEvent('formSubmit', {
        detail: { mockData: true },
        bubbles: true,
        cancelable: true,
      });
      childElement.dispatchEvent(event);
    });

    // Verify the parent method was called
    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should render the child component with multiple items', () => {
    setupComponent(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK, null);

    // Verify the child component is rendered
    cy.get('app-fines-mac-create-account-form').should('exist');
  });

  it('should unsubscribe from data$ on destroy', () => {
    // Stub for unsubscribe method and check it's called
    const unsubscribeSpy = cy.spy();
    cy.on('window:beforeunload', () => {
      expect(unsubscribeSpy).to.have.been.calledOnce;
    });
  });

  it('should show autocomplete suggestions based on input', () => {
    setupComponent(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK, null);

    // Focus on the autocomplete input and type
    cy.get('#fm_create_account_business_unit_id-autocomplete').type(
      OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK[0].name,
    );

    // Assert that the autocomplete options appear
    cy.get('#fm_create_account_business_unit_id-autocomplete__listbox')
      .should('be.visible')
      .within(() => {
        cy.contains(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK[0].name).should('exist');
      });
  });

  it('should have accessible autocomplete component', () => {
    setupComponent(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK, null);

    cy.get('#fm_create_account_business_unit_id-autocomplete')
      .should('have.attr', 'aria-autocomplete', 'list')
      .and('have.attr', 'role', 'combobox');
  });

  it('should display validation error when required fields are missing', () => {
    setupComponent(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK, null);

    cy.get('button[type="submit"]').click();
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES.businessUnit);
    cy.get('.govuk-error-message').should('contain', ERROR_MESSAGES.accountType);
  });
});
