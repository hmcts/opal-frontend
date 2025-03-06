import { mount } from 'cypress/angular';
import { FinesMacCreateAccountComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-create-account/fines-mac-create-account.component';
import { of } from 'rxjs';
import { OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-autocomplete-items.mock';
import { ActivatedRoute } from '@angular/router';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { DOM_ELEMENTS } from './constants/fines_mac_create_account_elements';
import { ERROR_MESSAGES } from './constants/fines_mac_create_account_errors';
import { provideHttpClient } from '@angular/common/http';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_CREATE_ACCOUNT_MOCK } from './mocks/fines_mac_create_account_mock';

describe('FinesMacCreateAccountComponent', () => {
  const setupComponent = (formSubmit: any) => {
    mount(FinesMacCreateAccountComponent, {
      providers: [
        OpalFines,
        provideHttpClient(),
        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(FINES_CREATE_ACCOUNT_MOCK);
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
        handleAccountDetailsSubmit: formSubmit,
        data$: of(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK),
      },
    });
  };

  beforeEach(() => {
    cy.intercept('GET', '**/opal-fines-service/business-units**', {
      statusCode: 200,
      body: OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK,
    });
  });

  it('should render the component', { tags: ['@PO-523'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('(AC.1)should render all elements on the page correctly and have correct text', { tags: ['@PO-523'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.createAccountCaption).should('exist');
    cy.get(DOM_ELEMENTS.heading).should('exist');

    cy.get(DOM_ELEMENTS.businessUnitHint).should('exist');
    cy.get(DOM_ELEMENTS.businessUnitInput).should('exist');
    cy.get(DOM_ELEMENTS.businessUnitLabel).should('exist');

    cy.get(DOM_ELEMENTS.accountTypeHeading).should('exist');
    cy.get(DOM_ELEMENTS.fineInput).should('exist');
    cy.get(DOM_ELEMENTS.fineLabel).should('exist');
    cy.get(DOM_ELEMENTS.fixedPenaltyInput).should('exist');
    cy.get(DOM_ELEMENTS.fixedPenaltyLabel).should('exist');
    cy.get(DOM_ELEMENTS.conditionalCautionInput).should('exist');
    cy.get(DOM_ELEMENTS.conditionalCautionLabel).should('exist');

    cy.get(DOM_ELEMENTS.createAccountCaption).should('contain', 'Create account');
    cy.get(DOM_ELEMENTS.heading).should('contain', 'Business unit and defendant type');

    cy.get(DOM_ELEMENTS.businessUnitHint).should('contain', 'Enter area where the account is to be created');
    cy.get(DOM_ELEMENTS.businessUnitLabel).should('contain', 'Business unit');

    cy.get(DOM_ELEMENTS.accountTypeHeading).should('contain', 'Account type');
    cy.get(DOM_ELEMENTS.fineLabel).should('contain', 'Fine');
    cy.get(DOM_ELEMENTS.fixedPenaltyLabel).should('contain', 'Fixed Penalty');
    cy.get(DOM_ELEMENTS.conditionalCautionLabel).should('contain', 'Conditional Caution');
    cy.get(DOM_ELEMENTS.ConditionalCautionHint).should('contain', 'Adult or youth only');
  });

  it(
    '(AC.1,AC.2)should render all elements for fine account type correctly and have correct text',
    { tags: ['@PO-523'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.fineInput).click();
      cy.get(DOM_ELEMENTS.defendantTypeTitle).should('exist');
      cy.get(DOM_ELEMENTS.defendantTypeHint).should('exist');
      cy.get(DOM_ELEMENTS.adultOrYouthInput).should('exist');
      cy.get(DOM_ELEMENTS.adultOrYouthLabel).should('exist');
      cy.get(DOM_ELEMENTS.parentOrGuardianToPayInput).should('exist');
      cy.get(DOM_ELEMENTS.parentOrGuardianToPayLabel).should('exist');
      cy.get(DOM_ELEMENTS.companyInput).should('exist');
      cy.get(DOM_ELEMENTS.companyLabel).should('exist');

      cy.get(DOM_ELEMENTS.defendantTypeTitle).should('contain', 'Defendant type');
      cy.get(DOM_ELEMENTS.defendantTypeHint).should('contain', "If sole trader, choose 'Adult or youth only'");
      cy.get(DOM_ELEMENTS.adultOrYouthLabel).should('contain', 'Adult or youth only');
      cy.get(DOM_ELEMENTS.parentOrGuardianToPayLabel).should(
        'contain',
        'Adult or youth with parent or guardian to pay',
      );
      cy.get(DOM_ELEMENTS.companyLabel).should('contain', 'Company');
    },
  );

  it(
    '(AC.1,AC.2) should render all elements for fixed penalty account type correctly and have correct text',
    { tags: ['@PO-523'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.fixedPenaltyInput).click();
      cy.get(DOM_ELEMENTS.defendantTypeTitle).should('exist');
      cy.get(DOM_ELEMENTS.FPdefendantTypeHint).should('exist');
      cy.get(DOM_ELEMENTS.FPAdultOrYouthInput).should('exist');
      cy.get(DOM_ELEMENTS.FPAdultOrYouthLabel).should('exist');
      cy.get(DOM_ELEMENTS.FPCompany).should('exist');
      cy.get(DOM_ELEMENTS.FPCompanyLabel).should('exist');
    },
  );

  it('(AC.4a)it should have validation if empty business unit but valid account type', { tags: ['@PO-523'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.fineInput).click();
    cy.get(DOM_ELEMENTS.continueButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ERROR_MESSAGES.businessUnit);
  });

  it(
    '(AC.4b)should have validation in place if empty account type but valid business unit',
    { tags: ['@PO-523']},
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.businessUnitInput).type('London Central & South East');
      cy.get(DOM_ELEMENTS.continueButton).click().click();

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', ERROR_MESSAGES.accountType);
    },
  );

  it('(AC.4d)should have validation if both business unit and account type are empty', { tags: ['@PO-523'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.continueButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ERROR_MESSAGES.businessUnit);
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', ERROR_MESSAGES.accountType);
  });

  it('(AC.2b)should check only 1 account type can be selected', { tags: ['@PO-523'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.fineInput).click();
    cy.get(DOM_ELEMENTS.fixedPenaltyInput).click();
    cy.get(DOM_ELEMENTS.fineInput).should('not.be.checked');
    cy.get(DOM_ELEMENTS.fixedPenaltyInput).should('be.checked');
  });

  it('(AC5)should pass validation if both business unit and account type are filled in', { tags: ['@PO-523'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    cy.get(DOM_ELEMENTS.businessUnitInput).type('London Central & South East');
    cy.get(DOM_ELEMENTS.fineInput).click().click();
    cy.get(DOM_ELEMENTS.adultOrYouthInput).click();
    cy.get(DOM_ELEMENTS.continueButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it(
    '(AC.4c)should check through each account type to ensure that error is given when a defendant type is not selected except conditional caution',
    { tags: ['@PO-523'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');

      setupComponent(mockFormSubmit);

      cy.get(DOM_ELEMENTS.businessUnitInput).type('London Central & South East');

      cy.get(DOM_ELEMENTS.fineInput).click().click();
      cy.get(DOM_ELEMENTS.continueButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Select a defendant type');

      cy.get(DOM_ELEMENTS.fixedPenaltyInput).click();
      cy.get(DOM_ELEMENTS.continueButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Select a defendant type');

      cy.get(DOM_ELEMENTS.conditionalCautionInput).click();
      cy.get(DOM_ELEMENTS.continueButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
      cy.get('@formSubmitSpy').should('have.been.calledOnce');
    },
  );
});
