import { mount } from 'cypress/angular';
import { FinesMacCreateAccountComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-create-account/fines-mac-create-account.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { MacCreateAccountLocators as L } from '../../../../cypress/shared/selectors/manual-account-creation/mac.create-account.locators';
import { ERROR_MESSAGES } from './constants/fines_mac_create_account_errors';
import { provideHttpClient } from '@angular/common/http';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_CREATE_ACCOUNT_MOCK } from './mocks/fines_mac_create_account_mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FINES_ACCOUNT_TYPES } from 'src/app/flows/fines/constants/fines-account-types.constant';

describe('FinesMacCreateAccountComponent', () => {
  let buinessUnitMock = structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
  let accountMock = structuredClone(FINES_CREATE_ACCOUNT_MOCK);
  const setupComponent = (formSubmit?: any) => {
    return mount(FinesMacCreateAccountComponent, {
      providers: [
        OpalFines,
        provideHttpClient(),
        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(accountMock);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
            snapshot: {
              data: {
                businessUnits: buinessUnitMock,
              },
            },
          },
        },
      ],
      componentProperties: {},
    }).then(({ fixture }) => {
      if (!formSubmit) {
        return;
      }

      const comp: any = fixture.componentInstance as any;

      if (comp?.handleAccountDetailsSubmit?.subscribe) {
        comp.handleAccountDetailsSubmit.subscribe((...args: any[]) => (formSubmit as any)(...args));
      } else if (typeof comp?.handleAccountDetailsSubmit === 'function') {
        comp.handleAccountDetailsSubmit = formSubmit;
      }

      fixture.detectChanges();
    });
  };

  afterEach(() => {
    accountMock = structuredClone(FINES_CREATE_ACCOUNT_MOCK);
    buinessUnitMock = structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
  });

  it('should render the component', { tags: ['@PO-523'] }, () => {
    setupComponent(null);

    cy.get(L.app).should('exist');
  });

  it('(AC.1)should render all elements on the page correctly and have correct text', { tags: ['@PO-523'] }, () => {
    setupComponent(null);

    cy.get(L.heading).should('exist');
    cy.get(L.heading).should('exist');

    cy.get(L.businessUnitHint).should('exist');
    cy.get(L.businessUnitInput).should('exist');
    cy.get(L.businessUnitLabel).should('exist');

    cy.get(L.accountTypeHeading).should('exist');
    cy.get(L.fineInput).should('exist');
    cy.get(L.fineLabel).should('exist');
    cy.get(L.fixedPenaltyInput).should('exist');
    cy.get(L.fixedPenaltyLabel).should('exist');
    cy.get(L.conditionalCautionInput).should('exist');
    cy.get(L.conditionalCautionLabel).should('exist');

    cy.get(L.heading).should('contain', 'Create account');
    cy.get(L.heading).should('contain', 'Create account');

    cy.get(L.businessUnitHint).should('contain', 'Enter area where the account is to be created');
    cy.get(L.businessUnitLabel).should('contain', 'Business unit');

    cy.get(L.accountTypeHeading).should('contain', 'Account type');
    cy.get(L.fineLabel).should('contain', FINES_ACCOUNT_TYPES.Fine);
    cy.get(L.fixedPenaltyLabel).should('contain', FINES_ACCOUNT_TYPES['Fixed Penalty']);
    cy.get(L.conditionalCautionLabel).should('contain', FINES_ACCOUNT_TYPES['Conditional Caution']);
    cy.get(L.ConditionalCautionHint).should('contain', 'Adult or youth only');
  });

  it(
    '(AC.2c)should render all elements for fine account type correctly and have correct text',
    { tags: ['@PO-2766'] },
    () => {
      accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

      setupComponent(null);

      cy.get(L.fineInput).click();
      cy.get(L.defendantTypeTitle).should('exist');
      cy.get(L.defendantTypeHint).should('exist');
      cy.get(L.adultOrYouthInput).should('exist');
      cy.get(L.adultOrYouthLabel).should('exist');
      cy.get(L.parentOrGuardianToPayInput).should('exist');
      cy.get(L.parentOrGuardianToPayLabel).should('exist');
      cy.get(L.companyInput).should('exist');
      cy.get(L.companyLabel).should('exist');

      cy.get(L.defendantTypeTitle).should('contain', 'Defendant type');
      cy.get(L.defendantTypeHint).should('contain', "If sole trader, choose 'Adult or youth only'");
      cy.get(L.adultOrYouthLabel).should('contain', 'Adult or youth only');
      cy.get(L.parentOrGuardianToPayLabel).should('contain', 'Adult or youth with parent or guardian to pay');
      cy.get(L.companyLabel).should('contain', 'Company');
    },
  );

  it(
    '(AC2c) should render all elements for fixed penalty account type correctly and have correct text',
    { tags: ['@PO-2766'] },
    () => {
      accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

      setupComponent(null);

      cy.get(L.fixedPenaltyInput).click();
      cy.get(L.defendantTypeTitle).should('exist');
      cy.get(L.FPdefendantTypeHint).should('exist');
      cy.get(L.FPAdultOrYouthInput).should('exist');
      cy.get(L.FPAdultOrYouthLabel).should('exist');
      cy.get(L.FPCompany).should('exist');
      cy.get(L.FPCompanyLabel).should('exist');
    },
  );

  it('(AC.3) should have validation if empty business unit but valid account type', { tags: ['@PO-2766'] }, () => {
    accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

    setupComponent(null);

    cy.get(L.fineInput).click();
    cy.get(L.continueButton).click();
    cy.get(L.errorSummary).should('contain', ERROR_MESSAGES.businessUnit);
  });

  it(
    '(AC.3) should have validation in place if empty account type but valid business unit',
    { tags: ['@PO-2766'] },
    () => {
      accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

      setupComponent(null);

      cy.get(L.businessUnitInput).type('Lo');
      cy.get(L.businessUnitAutoComplete).find('li').first().click();
      cy.get(L.continueButton).click();

      cy.get(L.errorSummary).should('contain', ERROR_MESSAGES.accountType);
    },
  );

  it('(AC.3) should have validation if both business unit and account type are empty', { tags: ['@PO-2766'] }, () => {
    setupComponent(null);

    cy.get(L.continueButton).click();
    cy.get(L.errorSummary).should('contain', ERROR_MESSAGES.businessUnit).should('contain', ERROR_MESSAGES.accountType);
  });

  it('(AC.3) should check only 1 account type can be selected', { tags: ['@PO-2766'] }, () => {
    accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

    setupComponent(null);

    cy.get(L.fineInput).click();
    cy.get(L.fixedPenaltyInput).click();
    cy.get(L.fineInput).should('not.be.checked');
    cy.get(L.fixedPenaltyInput).should('be.checked');
  });

  it(
    '(AC3) should pass validation if both business unit and account type are filled in',
    { tags: ['@PO-2766'] },
    () => {
      accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

      const formSubmitSpy = Cypress.sinon.spy();
      setupComponent(formSubmitSpy);

      cy.get(L.businessUnitInput).type('Lo');
      cy.get(L.businessUnitAutoComplete).find('li').first().click();
      cy.get(L.fineInput).click();
      cy.get(L.adultOrYouthInput).click();
      cy.get(L.continueButton).click();
      cy.get(L.errorSummary).should('not.exist');

      cy.wrap(formSubmitSpy).should('have.been.calledOnce');
    },
  );

  it(
    '(AC.4c)should check through each account type to ensure that error is given when a defendant type is not selected except conditional caution',
    { tags: ['@PO-523'] },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      setupComponent(formSubmitSpy);

      cy.get(L.businessUnitInput).type('Lo');
      cy.get(L.businessUnitAutoComplete).find('li').first().click();
      cy.get(L.fineInput).click();
      cy.get(L.continueButton).click();
      cy.get(L.errorSummary).should('contain', 'Select a defendant type');

      cy.get(L.fixedPenaltyInput).click();
      cy.get(L.continueButton).click();
      cy.get(L.errorSummary).should('contain', 'Select a defendant type');

      cy.get(L.conditionalCautionInput).click();
      cy.get(L.continueButton).click();
      cy.get(L.errorSummary).should('not.exist');
      cy.wrap(formSubmitSpy).should('have.been.calledOnce');
    },
  );
  it('Should be accessible with forward keyboard navigation', { tags: ['@PO-2715'] }, () => {
    setupComponent(null);

    // Ensure the page is loaded
    cy.get(L.pageHeader).should('contain', 'Create account');
    cy.get(L.businessUnit.input).should('be.visible');

    // Start from the top of the page
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.get(L.backLink).should('have.focus');

    //Move to Business unit container
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.get(L.businessUnit.container).should('have.focus');

    // Move to business unit input
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.get(L.businessUnit.input).should('have.focus');
    // Move to account type radio buttons
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.get(L.accountType.fine).should('have.focus');

    // Navigate through account type radio buttons
    cy.press(Cypress.Keyboard.Keys.DOWN);
    cy.get(L.accountType.fixedPenalty).should('have.focus');
    cy.press(Cypress.Keyboard.Keys.DOWN);
    cy.get(L.accountType.conditionalCaution).should('have.focus');

    // Loop back to first account type
    cy.press(Cypress.Keyboard.Keys.DOWN);
    cy.get(L.accountType.fine).should('have.focus');
    // Select fine account type to reveal defendant type options
    // Move through defendant type radio buttons
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.get(L.defendantType.adultOrYouth).should('have.focus');
    cy.press(Cypress.Keyboard.Keys.DOWN);
    cy.get(L.defendantType.parentOrGuardianToPay).should('have.focus');

    cy.press(Cypress.Keyboard.Keys.DOWN);
    cy.get(L.defendantType.company).should('have.focus');

    cy.press(Cypress.Keyboard.Keys.DOWN);
    cy.get(L.defendantType.adultOrYouth).should('have.focus');

    // Move to continue button
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.get(L.continueButton).should('have.focus');
    // Cypress cannot yet handle SHIFT+TAB keypresses for reverse tabbing
  });

  // Section of tests below cover 'Transfer in' account creation page
  it(
    '(AC2,2a,2b)should render all elements on the page correctly and have correct text',
    { tags: ['@PO-2766'] },
    () => {
      accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

      setupComponent(null);

      cy.get(L.heading).should('exist');

      cy.get(L.businessUnitHint).should('exist');
      cy.get(L.businessUnitInput).should('exist');
      cy.get(L.businessUnitLabel).should('exist');

      cy.get(L.accountTypeHeading).should('exist');
      cy.get(L.fineInput).should('exist');
      cy.get(L.fineLabel).should('exist');
      cy.get(L.fixedPenaltyInput).should('exist');
      cy.get(L.fixedPenaltyLabel).should('exist');

      cy.get(L.heading).should('contain', 'Transfer in');

      cy.get(L.businessUnitHint).should('contain', 'Enter area where the account is to be created');
      cy.get(L.businessUnitLabel).should('contain', 'Business unit');

      cy.get(L.accountTypeHeading).should('contain', 'Account type');
      cy.get(L.fineLabel).should('contain', FINES_ACCOUNT_TYPES.Fine);
      cy.get(L.fixedPenaltyLabel).should('contain', FINES_ACCOUNT_TYPES['Fixed Penalty']);
    },
  );

  it(
    '(AC.2c)should render all elements for fine account type correctly and have correct text',
    { tags: ['@PO-2766'] },
    () => {
      accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

      setupComponent(null);

      cy.get(L.fineInput).click();
      cy.get(L.defendantTypeTitle).should('exist');
      cy.get(L.defendantTypeHint).should('exist');
      cy.get(L.adultOrYouthInput).should('exist');
      cy.get(L.adultOrYouthLabel).should('exist');
      cy.get(L.parentOrGuardianToPayInput).should('exist');
      cy.get(L.parentOrGuardianToPayLabel).should('exist');
      cy.get(L.companyInput).should('exist');
      cy.get(L.companyLabel).should('exist');

      cy.get(L.defendantTypeTitle).should('contain', 'Defendant type');
      cy.get(L.defendantTypeHint).should('contain', "If sole trader, choose 'Adult or youth only'");
      cy.get(L.adultOrYouthLabel).should('contain', 'Adult or youth only');
      cy.get(L.parentOrGuardianToPayLabel).should('contain', 'Adult or youth with parent or guardian to pay');
      cy.get(L.companyLabel).should('contain', 'Company');
    },
  );

  it(
    '(AC2c) should render all elements for fixed penalty account type correctly and have correct text',
    { tags: ['@PO-2766'] },
    () => {
      accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

      setupComponent(null);

      cy.get(L.fixedPenaltyInput).click();
      cy.get(L.defendantTypeTitle).should('exist');
      cy.get(L.FPdefendantTypeHint).should('exist');
      cy.get(L.FPAdultOrYouthInput).should('exist');
      cy.get(L.FPAdultOrYouthLabel).should('exist');
      cy.get(L.FPCompany).should('exist');
      cy.get(L.FPCompanyLabel).should('exist');
    },
  );

  it('(AC.3) should have validation if empty business unit but valid account type', { tags: ['@PO-2766'] }, () => {
    accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

    setupComponent(null);

    cy.get(L.fineInput).click();
    cy.get(L.continueButton).click();
    cy.get(L.errorSummary).should('contain', ERROR_MESSAGES.businessUnit);
  });

  it(
    '(AC.3) should have validation in place if empty account type but valid business unit',
    { tags: ['@PO-2766'] },
    () => {
      accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

      setupComponent(null);

      cy.get(L.businessUnitInput).type('Lo');
      cy.get(L.businessUnitAutoComplete).find('li').first().click();
      cy.get(L.continueButton).click();

      cy.get(L.errorSummary).should('contain', ERROR_MESSAGES.accountType);
    },
  );

  it('(AC.3) should have validation if both business unit and account type are empty', { tags: ['@PO-2766'] }, () => {
    setupComponent(null);

    cy.get(L.continueButton).click();
    cy.get(L.errorSummary).should('contain', ERROR_MESSAGES.businessUnit).should('contain', ERROR_MESSAGES.accountType);
  });

  it('(AC.3) should check only 1 account type can be selected', { tags: ['@PO-2766'] }, () => {
    accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

    setupComponent(null);

    cy.get(L.fineInput).click();
    cy.get(L.fixedPenaltyInput).click();
    cy.get(L.fineInput).should('not.be.checked');
    cy.get(L.fixedPenaltyInput).should('be.checked');
  });

  it(
    '(AC3) should pass validation if both business unit and account type are filled in',
    { tags: ['@PO-2766'] },
    () => {
      accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';

      const formSubmitSpy = Cypress.sinon.spy();
      setupComponent(formSubmitSpy);

      cy.get(L.businessUnitInput).type('Lo');
      cy.get(L.businessUnitAutoComplete).find('li').first().click();
      cy.get(L.fineInput).click();
      cy.get(L.adultOrYouthInput).click();
      cy.get(L.continueButton).click();
      cy.get(L.errorSummary).should('not.exist');

      cy.wrap(formSubmitSpy).should('have.been.calledOnce');
    },
  );

  it.only('(AC4) should auto select a single business unit', { tags: ['@PO-2766'] }, () => {
    accountMock.originatorType.formData.fm_originator_type_originator_type = 'TFO';
    buinessUnitMock.refData = buinessUnitMock.refData.slice(0, 1);
    buinessUnitMock.count = buinessUnitMock.refData.length;

    setupComponent(buinessUnitMock);

    cy.get(L.businessUnitDefault).should('have.text', `The account will be created in Historical Debt`);
    cy.get(L.businessUnitInput).should('not.exist');
  });
});
