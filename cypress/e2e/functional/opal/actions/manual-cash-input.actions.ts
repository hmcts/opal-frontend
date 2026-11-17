import { FinanceLocators, ManualCashInputLocators } from '../../../../shared/selectors/finance.locators';
import { createScopedLogger } from '../../../../support/utils/log.helper';

const log = createScopedLogger('ManualCashInputActions');
const TILLS_ENDPOINT = '/opal-fines-service/tills';
const BUSINESS_UNITS_ENDPOINT = '/opal-fines-service/business-units';
const COURT_FEES_ENDPOINT = '/opal-fines-service/court-fees';
const COURT_FEE_OPTION = 'CF001 - Application (£12.50)';
const FIRST_TILL_ID = 1001;
const UNSAVED_CHANGES_WARNING =
  'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';
const MANUAL_CASH_INPUT_TILLS_RESPONSE = {
  tills: [
    {
      till_id: 1001,
      till_number: 9002,
      payments_count: 3,
      amount: 125.5,
      business_unit_name: 'Camden and Islington',
      processed_by: 'Alex Smith',
      date_processed: '2026-01-10T13:30:00.000Z',
    },
    {
      till_id: 1002,
      till_number: 9001,
      payments_count: 1,
      amount: 10,
      business_unit_name: 'Westminster - North',
      processed_by: 'Sam Jones',
      date_processed: '2026-01-09T09:05:00.000Z',
    },
  ],
};

const MANUAL_CASH_INPUT_BUSINESS_UNITS_RESPONSE = {
  count: 3,
  refData: [
    { business_unit_id: 3, business_unit_name: 'Westminster - North' },
    { business_unit_id: 1, business_unit_name: 'Alpha Court' },
    { business_unit_id: 2, business_unit_name: 'Camden and Islington' },
  ],
};

type BusinessUnitsResponse = typeof MANUAL_CASH_INPUT_BUSINESS_UNITS_RESPONSE;

const assertTrimmedText = (selector: string, expectedText: string): void => {
  cy.get(selector)
    .invoke('text')
    .then((text) => expect(text.trim()).to.equal(expectedText));
};

/** Cypress actions for the Manual Cash Input create-till journey. */
export class ManualCashInputActions {
  /** Opens Manual Cash Input with a deterministic empty till list. */
  public openCreateAndAllocate(): void {
    log('action', 'Opening Manual Cash Input create and allocate');
    cy.intercept({ method: 'GET', pathname: TILLS_ENDPOINT }, { tills: [] }).as('manualCashInputTills');
    cy.get(FinanceLocators.manualCashInputLink).should('be.visible').click();
    cy.wait('@manualCashInputTills').its('response.statusCode').should('eq', 200);
    cy.contains('h1', 'Manual cash input').should('be.visible');
  }

  /** Opens Manual Cash Input with deterministic outstanding tills for table and route-guard coverage. */
  public openCreateAndAllocateWithOutstandingTills(): void {
    log('action', 'Opening Manual Cash Input with outstanding tills');
    cy.intercept({ method: 'GET', pathname: TILLS_ENDPOINT }, MANUAL_CASH_INPUT_TILLS_RESPONSE).as(
      'manualCashInputTills',
    );
    cy.get(FinanceLocators.manualCashInputLink).should('be.visible').click();
    cy.wait('@manualCashInputTills').its('response.statusCode').should('eq', 200);
    cy.contains('h1', 'Manual cash input').should('be.visible');
  }

  /** Selects a till and declines the native unsaved-changes warning raised by Back. */
  public selectTillAndDeclineBackNavigation(): void {
    this.respondToBackNavigation(false);
  }

  /** Selects a till and accepts the native unsaved-changes warning raised by Back. */
  public selectTillAndAcceptBackNavigation(): void {
    this.respondToBackNavigation(true);
  }

  /** Confirms that declining the warning preserves the till selection. */
  public assertSelectionIsRetained(): void {
    cy.contains('h1', 'Manual cash input').should('be.visible');
    cy.get(ManualCashInputLocators.tillCheckbox(FIRST_TILL_ID)).should('be.checked');
    cy.get(ManualCashInputLocators.selectedCount)
      .invoke('text')
      .then((text) => expect(text.replace(/\s+/g, ' ').trim()).to.equal('1 of 2 selected'));
  }

  /** Confirms that accepting the warning returns the user to the Finance landing page. */
  public assertFinanceLandingPageIsDisplayed(): void {
    cy.contains('h1', 'Finance').should('be.visible');
  }

  /** Sorts the table and reloads the browser page. */
  public sortTillsAndRefresh(): void {
    log('action', 'Sorting Manual Cash Input tills then refreshing the page');

    // Default date ordering is 9002 then 9001; sorting Till number must reverse the rendered row order.
    cy.get(ManualCashInputLocators.tillNumberCells).then(($cells) =>
      expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal(['9002', '9001']),
    );
    cy.contains(ManualCashInputLocators.tableHeadings, 'Till number').find('button').click();
    cy.contains(ManualCashInputLocators.tableHeadings, 'Till number').should('have.attr', 'aria-sort', 'ascending');
    cy.get(ManualCashInputLocators.tillNumberCells).then(($cells) =>
      expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal(['9001', '9002']),
    );

    cy.reload();
    cy.wait('@manualCashInputTills').its('response.statusCode').should('eq', 200);
    cy.contains('h1', 'Manual cash input').should('be.visible');
  }

  /** Confirms that no table column remains sorted after a browser refresh. */
  public assertTillSortingIsReset(): void {
    cy.contains(ManualCashInputLocators.tableHeadings, 'Till number').should('have.attr', 'aria-sort', 'none');
  }

  /**
   * Starts the Create Till journey with a deterministic permission-scoped business-unit response.
   * @param businessUnits - Permission-scoped business units returned by the resolver endpoint.
   */
  public startCreateTill(businessUnits: BusinessUnitsResponse = MANUAL_CASH_INPUT_BUSINESS_UNITS_RESPONSE): void {
    log('action', 'Starting Manual Cash Input Create Till');
    cy.intercept(
      {
        method: 'GET',
        pathname: BUSINESS_UNITS_ENDPOINT,
        query: { permission: 'PROCESS_AND_ALLOCATE_PAYMENTS' },
      },
      businessUnits,
    ).as('manualCashInputBusinessUnits');
    cy.get(ManualCashInputLocators.createTillButton).should('be.visible').click();
    cy.wait('@manualCashInputBusinessUnits').its('response.statusCode').should('eq', 200);
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/select-bu');
    cy.contains('h1', 'Create till').should('be.visible');
  }

  /** Starts the Create Till journey for a user with exactly one permitted business unit. */
  public startCreateTillWithOneBusinessUnit(): void {
    this.startCreateTill({ count: 1, refData: [MANUAL_CASH_INPUT_BUSINESS_UNITS_RESPONSE.refData[1]] });
  }

  /** Verifies that the autocomplete lists permitted business units alphabetically. */
  public assertBusinessUnitsAreAlphabetical(): void {
    cy.get(ManualCashInputLocators.businessUnitInput).should('be.visible').click();
    cy.get(ManualCashInputLocators.businessUnitAutocomplete)
      .find('li')
      .then(($items) =>
        expect([...$items].map((item) => item.textContent?.trim())).to.deep.equal([
          'Alpha Court',
          'Camden and Islington',
          'Westminster - North',
        ]),
      );
  }

  /**
   * Selects a business unit from the autocomplete.
   * @param businessUnit - Name of the business unit to select.
   */
  public selectBusinessUnit(businessUnit: string): void {
    cy.get(ManualCashInputLocators.businessUnitInput).click();
    cy.get(ManualCashInputLocators.businessUnitAutocomplete).contains('li', businessUnit).click();
  }

  /** Continues with the previously selected business unit. */
  public continueWithSelectedBusinessUnit(): void {
    cy.get(ManualCashInputLocators.continueButton).click();
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/details');
  }

  /** Verifies that Continue reports the required business-unit error without navigating. */
  public continueWithoutBusinessUnit(): void {
    cy.get(ManualCashInputLocators.continueButton).click();
    cy.get(ManualCashInputLocators.errorSummary).should('contain.text', 'Select business unit');
    cy.get(ManualCashInputLocators.businessUnitError).should('contain.text', 'Select business unit');
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/select-bu');
  }

  /** Verifies that one permitted business unit is read-only and automatically used on Continue. */
  public continueWithReadOnlyBusinessUnit(): void {
    cy.get(ManualCashInputLocators.businessUnitInput).should('not.exist');
    cy.get(ManualCashInputLocators.singleBusinessUnitSummary).should('contain.text', 'Alpha Court');
    cy.get(ManualCashInputLocators.continueButton).click();
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/details');
    cy.get(ManualCashInputLocators.tillDetails).should('contain.text', 'Alpha Court');
  }

  /**
   * Verifies the selected business unit and empty-till guidance on Till Details.
   * @param businessUnit - Name of the selected business unit.
   */
  public assertEmptyTillDetails(businessUnit: string): void {
    cy.get(ManualCashInputLocators.tillDetails)
      .find('h1')
      .invoke('text')
      .then((text) => expect(text.trim()).to.equal('Till details'));
    assertTrimmedText(ManualCashInputLocators.tillDetailsBusinessUnitKey, 'Business unit');
    assertTrimmedText(ManualCashInputLocators.tillDetailsBusinessUnitValue, businessUnit);
    cy.get(ManualCashInputLocators.tillDetails)
      .contains('h2', 'Payments')
      .should('have.text', 'Payments')
      .next('p')
      .invoke('text')
      .then((text) => expect(text.trim()).to.equal('There are no payments'));
    cy.get(ManualCashInputLocators.tillDetails)
      .contains('h2', 'Create till')
      .should('have.text', 'Create till')
      .next('p')
      .invoke('text')
      .then((text) => expect(text.trim()).to.equal('You must add at least 1 payment to the till.'));
  }

  /** Opens Payment Category from Till Details. */
  public addPayment(): void {
    cy.get(ManualCashInputLocators.addPaymentButton).should('contain.text', 'Add payment').click();
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/payment-category');
  }

  /** Selects a payment category and continues from Payment Category.
   * @param category - Payment category value to select.
   */
  public continueWithPaymentCategory(category: 'criminal' | 'courtFee' | 'suspense'): void {
    if (category === 'courtFee') {
      cy.intercept(
        { method: 'GET', pathname: COURT_FEES_ENDPOINT, query: { business_unit_id: '2' } },
        {
          court_fees: [
            { court_fee_id: 101, court_fee_code: 'CF001', description: 'Application', amount: 12.5 },
            { court_fee_id: 102, court_fee_code: 'CF002', description: 'Issue', amount: 0.1 },
          ],
        },
      ).as('manualCashInputCourtFees');
    }
    cy.get(`input[name="paymentCategory"][value="${category}"]`).check({ force: true });
    cy.get(ManualCashInputLocators.continueButton).click();
    if (category === 'courtFee') {
      cy.wait('@manualCashInputCourtFees').its('response.statusCode').should('eq', 200);
    }
  }

  /** Confirms the Criminal journey opens Search for an Account. */
  public assertSearchForAccountIsDisplayed(): void {
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/payment/category/criminal/search');
    cy.get(ManualCashInputLocators.searchAccount.heading).should('have.text', 'Search for an account');
  }

  /** Confirms the selected business unit is displayed on Search for an Account. */
  public assertSearchForAccountBusinessUnitIsDisplayed(): void {
    cy.get(ManualCashInputLocators.searchAccount.businessUnit).should('have.text', 'Camden and Islington');
  }

  /** Confirms the quick and advanced search fields on Search for an Account. */
  public assertSearchForAccountFieldsAreDisplayed(): void {
    const search = ManualCashInputLocators.searchAccount;
    cy.contains('h2', 'Quick search').should('be.visible');
    cy.contains('h2', 'Advanced search').should('be.visible');
    cy.get(search.accountNumber).should('be.visible');
    cy.get(search.individualsTab).should('be.visible').and('have.attr', 'aria-selected', 'true');
    cy.get(search.companiesTab).should('be.visible').and('have.attr', 'aria-selected', 'false');
    cy.get(search.lastName).should('be.visible');
    cy.get(search.lastNameExactMatchLabel).should('be.visible');
    cy.get(search.lastNameExactMatch).should('not.be.checked');
    cy.get(search.firstNames).should('be.visible');
    cy.get(search.firstNamesExactMatchLabel).should('be.visible');
    cy.get(search.firstNamesExactMatch).should('not.be.checked');
    cy.get(search.individualAliasesLabel).should('be.visible');
    cy.get(search.individualAliases).should('not.be.checked');
    cy.get(search.searchButton).should('be.visible').and('contain.text', 'Search');
    cy.get(search.cancelLink).should('be.visible').and('contain.text', 'Cancel');

    cy.get(search.companiesTab).click();
    cy.get(search.companyName).should('be.visible');
    cy.get(search.companyNameExactMatchLabel).should('be.visible');
    cy.get(search.companyNameExactMatch).should('not.be.checked');
    cy.get(search.companyAliasesLabel).should('be.visible');
    cy.get(search.companyAliases).should('not.be.checked');
    cy.get(search.lastName).should('not.exist');
    cy.get(search.firstNames).should('not.exist');
    cy.get(search.individualAliases).should('not.exist');
  }

  /** Confirms that the selected category opens its details destination.
   * @param category - Payment category whose details destination should be displayed.
   */
  public assertPaymentCategoryDetailsAreDisplayed(category: 'courtFee' | 'suspense'): void {
    const destinations = {
      courtFee: { pathname: '/fines/manual-cash-input/create/till/court-fee-details', heading: 'Court fee' },
      suspense: { pathname: '/fines/manual-cash-input/create/till/suspense-details', heading: 'Suspense details' },
    } as const;
    const destination = destinations[category];

    cy.location('pathname').should('eq', destination.pathname);
    cy.contains('h1', destination.heading).should('be.visible');
  }

  /**
   * Submits a Court Fee payment with the specified amount and item count.
   * @param amount - Amount paid for the court fee.
   * @param numberOfItems - Number of court fee items paid for.
   */
  public submitCourtFeePayment(amount: string, numberOfItems: string): void {
    cy.get(ManualCashInputLocators.courtFeeCodeInput).type('CF001');
    cy.get(ManualCashInputLocators.courtFeeCodeSuggestions).contains('li', COURT_FEE_OPTION).click();
    cy.get(ManualCashInputLocators.courtFeeAmountInput).type(amount);
    cy.get(ManualCashInputLocators.courtFeeNumberOfItemsInput).type(numberOfItems);
    cy.get(ManualCashInputLocators.courtFeeDetailsPage).find(ManualCashInputLocators.continueButton).click();
  }

  /** Confirms an exact payment opens the temporary Court Fee Payment Details screen. */
  public assertCourtFeePaymentDetailsIsDisplayed(): void {
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/court-fee-payment-details');
    cy.contains('h1', 'Payment details – court fee').should('be.visible');
  }

  /** Confirms an overpayment or underpayment opens its temporary confirmation screen. */
  public assertCourtFeeOverUnderpaymentIsDisplayed(): void {
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/over-underpayment-confirmation');
    cy.contains('h1', 'Overpayment/underpayment confirmation').should('be.visible');
  }

  /** Confirms an out-of-scope payment category leaves the user on Payment Category. */
  public assertPaymentCategoryIsDisplayed(): void {
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/payment-category');
    cy.contains('h1', 'Payment category').should('be.visible');
  }

  /** Submits Payment Category without choosing an option. */
  public continueWithoutPaymentCategory(): void {
    cy.get(ManualCashInputLocators.continueButton).click();
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/payment-category');
  }

  /** Verifies the required payment-category messages and their summary link focus. */
  public assertPaymentCategoryValidation(): void {
    cy.get(ManualCashInputLocators.errorSummary).should('contain.text', 'Select payment category');
    cy.get(ManualCashInputLocators.errorSummary)
      .find('.govuk-error-summary__title')
      .should('have.text', 'There is a problem');
    cy.get(ManualCashInputLocators.errorMessage).should('contain.text', 'Select payment category');
    cy.get(ManualCashInputLocators.errorSummary).find('.govuk-error-summary__list a').click();
    cy.focused().should('have.id', 'paymentCategory');
  }

  /** Cancels Payment Category and returns to Till Details. */
  public cancelPaymentCategory(): void {
    cy.get(ManualCashInputLocators.cancelLink).should('contain.text', 'Cancel').click();
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/details');
  }

  /** Opens Delete Till from Till Details. */
  public deleteTill(): void {
    cy.get(ManualCashInputLocators.deleteTillLink).should('contain.text', 'Delete till').click();
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create/till/cancel');
  }

  /** Cancels the business-unit screen without a selection or a leave-page warning. */
  public cancelWithoutBusinessUnit(): void {
    cy.get(ManualCashInputLocators.cancelLink).click();
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create-allocate');
  }

  /** Declines the leave-page warning after selecting a business unit and verifies that it is retained. */
  public selectBusinessUnitAndDeclineCancel(): void {
    cy.get(ManualCashInputLocators.businessUnitInput).click();
    cy.get(ManualCashInputLocators.businessUnitAutocomplete).contains('li', 'Camden and Islington').click();
    cy.once('window:confirm', (message) => {
      expect(String(message).replace(/\s+/g, ' ').trim()).to.equal(UNSAVED_CHANGES_WARNING);
      return false;
    });
    cy.get(ManualCashInputLocators.cancelLink).click();
    cy.get(ManualCashInputLocators.businessUnitInput).should('have.value', 'Camden and Islington');
  }

  /** Accepts the leave-page warning after selecting a business unit and returns to Manual Cash Input. */
  public acceptCancelAfterBusinessUnitSelection(): void {
    cy.once('window:confirm', (message) => {
      expect(String(message).replace(/\s+/g, ' ').trim()).to.equal(UNSAVED_CHANGES_WARNING);
      return true;
    });
    cy.get(ManualCashInputLocators.cancelLink).click();
    cy.location('pathname').should('eq', '/fines/manual-cash-input/create-allocate');
  }

  /**
   * Drives the Back link through the browser-native confirmation dialog.
   * @param acceptLeave Whether to accept the warning and leave the screen.
   */
  private respondToBackNavigation(acceptLeave: boolean): void {
    let confirmationWasRaised = false;

    log('action', 'Responding to Manual Cash Input unsaved-changes warning', { acceptLeave });
    cy.once('window:confirm', (message) => {
      confirmationWasRaised = true;
      expect(String(message).replace(/\s+/g, ' ').trim()).to.equal(UNSAVED_CHANGES_WARNING);
      return acceptLeave;
    });

    cy.get(ManualCashInputLocators.tillCheckbox(FIRST_TILL_ID)).check({ force: true });
    cy.get(ManualCashInputLocators.backLink).should('be.visible').click();
    cy.then(() => expect(confirmationWasRaised, 'native unsaved-changes warning').to.be.true);
  }
}
