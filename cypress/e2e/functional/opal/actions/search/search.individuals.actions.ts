/**
 * @fileoverview search-individuals.actions.ts
 * High-level actions for the “Search for an account” ➜ Individuals
 * Now includes shared search-page assertion logic.
 */

import { AccountSearchIndividualsLocators as L } from '../../../../../shared/selectors/account-search/account.search.individuals.locators';
import { AccountSearchCommonLocators as C } from '../../../../../shared/selectors/account-search/account.search.common.locators';
import { ResultsActions } from '../search.results.actions';
import { log } from '../../../../../support/utils/log.helper';

export class AccountSearchIndividualsActions {
  private readonly results = new ResultsActions();
  private readonly TIMEOUT = 10_000;

  private getTimeoutOptions() {
    return { timeout: this.TIMEOUT };
  }

  /**
   * Asserts that the user is on the “Search for an Account” page.
   * Steps:
   *  1. Verifies the current URL includes `/fines/search-accounts/search`.
   *  2. Ensures the search form root component is visible.
   *
   * @example
   *   searchIndividuals.assertOnSearchPage();
   */
  public assertOnSearchPage(): void {
    log('assert', 'Verifying Search for an Account page URL');
    cy.location('pathname', this.getTimeoutOptions()).should('include', '/fines/search-accounts/search');

    log('assert', 'Ensuring search form is visible');
    cy.get(L.searchFormRoot, this.getTimeoutOptions()).should('be.visible');

    log('action', 'Search for an Account page is ready');
  }

  /**
   * Assert we remain on the Search Individuals form and no navigation occurred.
   *
   * Behaviour:
   *  - Ensures the current pathname still includes the canonical search path.
   *  - Ensures the Individuals search form root is visible.
   *
   * This is intentionally conservative: it doesn't compare a before/after snapshot (that
   * is done in other helpers when appropriate). Use this step where the scenario wants
   * to assert there was no navigation away from the search page.
   */
  public assertRemainsOnSearchFormNoNavigation(): void {
    log('assert', 'Asserting we remain on the Search Individuals form (no navigation)');

    // 1) Path check. The canonical search path used elsewhere in the suite.
    cy.location('pathname', this.getTimeoutOptions()).should('include', '/fines/search-accounts/search');

    // 2) Ensure Individuals search form panel is visible

    if (!L.searchFormRoot) {
      throw new TypeError('assertRemainsOnSearchFormNoNavigation: Locator L.searchFormRoot is required but missing.');
    }

    cy.get(L.searchFormRoot, this.getTimeoutOptions()).should('be.visible');

    log('assert', 'Verified we remain on the Search Individuals form and the form root is visible');
  }

  /**
   * Verifies the Individuals form is the active/default form.
   *
   * @remarks
   * - Leverages existing, stable inputs that are specific to the Individuals form.
   * - Avoids brittle tab-class assertions; focuses on form presence/readiness.
   *
   * @example
   *   searchIndividuals.assertDefaultIndividualsActive();
   */
  public assertDefaultIndividualsActive(): void {
    this.assertOnSearchPage();

    log('assert', 'Verifying Individuals form is active by default');
    // A field unique to Individuals form being visible is a strong signal it’s the active panel.
    cy.get(L.lastNameInput, this.getTimeoutOptions()).should('be.visible');

    // Optional: ensure the primary action is available
    cy.get(C.searchButton, this.getTimeoutOptions()).should('be.visible').and('not.be.disabled');
  }

  /**
   * Performs a search by last name and waits for results to load.
   *
   * @param lastName - The last name to search for.
   */
  public byLastName(lastName: string): void {
    log('action', `Submitting search by last name: "${lastName}"`);
    cy.get(L.lastNameInput, this.getTimeoutOptions()).clear().type(lastName);

    cy.get(C.searchButton, this.getTimeoutOptions()).should('be.enabled').click();

    log('assert', 'Verifying results are displayed');
    this.results.assertOnResults();
  }

  // ──────────────────────────────
  // Field assertions
  // ──────────────────────────────

  /** Asserts the Last name field equals the expected value. */
  public assertLastNameEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Last name equals "${expectedTrim}"`);
    cy.get(L.lastNameInput, this.getTimeoutOptions()).should('have.value', expectedTrim);
  }

  /** Asserts the First names field equals the expected value. */
  public assertFirstNamesEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting First names equals "${expectedTrim}"`);
    cy.get(L.firstNameInput, this.getTimeoutOptions()).should('have.value', expectedTrim);
  }

  /** Asserts the Date of birth field equals the expected value. */
  public assertDobEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Date of birth equals "${expectedTrim}"`);
    cy.get(L.dobInput, this.getTimeoutOptions())
      .invoke('val')
      .then((val) => expect(String(val ?? '').trim()).to.eq(expectedTrim));
  }

  /** Asserts the National Insurance Number field equals the expected value. */
  public assertNiNumberEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting National Insurance number equals "${expectedTrim}"`);
    cy.get(L.niNumberInput, this.getTimeoutOptions()).should('have.value', expectedTrim);
  }

  /** Asserts the Address Line 1 field equals the expected value. */
  public assertAddressLine1Equals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Address line 1 equals "${expectedTrim}"`);
    cy.get(L.addressLine1Input, this.getTimeoutOptions()).should('have.value', expectedTrim);
  }

  /** Asserts the Postcode field equals the expected value. */
  public assertPostcodeEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Postcode equals "${expectedTrim}"`);
    cy.get(L.postcodeInput, this.getTimeoutOptions()).should('have.value', expectedTrim);
  }

  /**
   * Combined convenience method for asserting all field values in one call.
   * Accepts an object containing one or more expected field values.
   */
  public assertAllFieldValues(expected: {
    lastName?: string;
    firstNames?: string;
    dob?: string;
    niNumber?: string;
    addressLine1?: string;
    postcode?: string;
  }): void {
    if (expected.lastName !== undefined) this.assertLastNameEquals(expected.lastName);
    if (expected.firstNames !== undefined) this.assertFirstNamesEquals(expected.firstNames);
    if (expected.dob !== undefined) this.assertDobEquals(expected.dob);
    if (expected.niNumber !== undefined) this.assertNiNumberEquals(expected.niNumber);
    if (expected.addressLine1 !== undefined) this.assertAddressLine1Equals(expected.addressLine1);
    if (expected.postcode !== undefined) this.assertPostcodeEquals(expected.postcode);
  }

  /**
   * Asserts that the Individuals form shows default (empty) values.
   * Keeps assertions centralised so step definitions stay thin.
   */
  public assertDefaults(): void {
    log('assert', 'Asserting Individuals form defaults');

    this.assertAllFieldValues({
      lastName: '',
      firstNames: '',
      dob: '',
      niNumber: '',
      addressLine1: '',
      postcode: '',
    });
  }

  // ──────────────────────────────
  // Empty submit behaviour
  // ──────────────────────────────

  /**
   * Submits an empty Individuals search and asserts:
   * - no navigation occurred,
   * - the form remains visible,
   * - all inputs stay empty.
   */
  public submitEmptySearch(): void {
    log('action', 'Submitting empty Individuals search (expect no navigation)');

    // Ensure we’re on the search page
    this.assertOnSearchPage();

    // Snapshot current path to confirm no navigation occurs
    cy.location('pathname', this.getTimeoutOptions()).then((pathBefore) => {
      // Submit with no input
      cy.get(C.searchButton, this.getTimeoutOptions()).should('be.visible').and('be.enabled').click();

      // Path should remain unchanged
      cy.location('pathname', this.getTimeoutOptions()).should('eq', pathBefore);

      // Form still visible
      cy.get(L.searchFormRoot, this.getTimeoutOptions()).should('be.visible');

      // Assert all key fields remain blank
      this.assertAllFieldValues({
        lastName: '',
        firstNames: '',
        dob: '',
        niNumber: '',
        addressLine1: '',
        postcode: '',
      });
    });

    log('assert', 'Verified empty search caused no navigation and all fields remain blank');
  }

  /**
   * Prepare Individuals form with sample values (for stateful switching tests).
   */
  public prepareIndividualsSample(): void {
    log('input', 'Preparing sample values in Individuals form');

    cy.get(L.lastNameInput, this.getTimeoutOptions()).clear().type('Smith');
    cy.get(L.firstNameInput, this.getTimeoutOptions()).clear().type('John');
    cy.get(L.dobInput, this.getTimeoutOptions()).clear().type('01/01/1980');
    cy.get(L.niNumberInput, this.getTimeoutOptions()).clear().type('QQ123456C');
    cy.get(L.addressLine1Input, this.getTimeoutOptions()).clear().type('10 Downing Street');
    cy.get(L.postcodeInput, this.getTimeoutOptions()).clear().type('SW1A 2AA');

    const selectCheckbox = (checkboxSelector: string): void => {
      const checkboxId = checkboxSelector.replace(/^#/, '');
      const labelSelector = `label[for="${checkboxId}"]`;

      cy.get('body').then(($body) => {
        if ($body.find(checkboxSelector).length === 0 && $body.find(labelSelector).length === 0) {
          cy.log('locator', `Checkbox or label not present for selector: ${checkboxSelector} — skipping`);
          return;
        }

        if ($body.find(labelSelector).length > 0 && $body.find(labelSelector).is(':visible')) {
          cy.get(labelSelector, this.getTimeoutOptions()).should('be.visible').click({ force: true });
        } else {
          cy.get(checkboxSelector, this.getTimeoutOptions()).should('exist').check({ force: true });
        }

        cy.get(checkboxSelector, this.getTimeoutOptions()).should('be.checked');
      });
    };

    // Select the checkboxes if present
    selectCheckbox(L.lastNameExactMatchCheckbox);
    selectCheckbox(L.firstNamesExactMatchCheckbox);

    // Include Aliases — locator may vary, so use safe probing
    cy.get('body').then(($body) => {
      if ((L as any).includeAliasesCheckbox) {
        selectCheckbox((L as any).includeAliasesCheckbox);
        return;
      }

      const fallbacks = ['#include-aliases', 'input[name="includeAliases"]', '#includeAliases'];

      for (const sel of fallbacks) {
        if ($body.find(sel).length > 0) {
          selectCheckbox(sel);
          return;
        }
      }

      cy.log('locator', 'Include aliases checkbox not found; skipping');
    });
  }

  /**
   * Assert Individuals form was cleared to defaults.
   * - Verifies text inputs are empty
   * - Verifies relevant checkboxes (if present) are NOT checked
   */
  public assertIndividualsCleared(): void {
    log('assert', 'Individuals form cleared to defaults');

    // Text fields
    this.assertAllFieldValues({
      lastName: '',
      firstNames: '',
      dob: '',
      niNumber: '',
      addressLine1: '',
      postcode: '',
    });

    const assertCheckboxNotChecked = (checkboxSelector: string): void => {
      cy.get('body').then(($body) => {
        if ($body.find(checkboxSelector).length === 0) {
          cy.log('locator', `Checkbox not present, skipping assertion for: ${checkboxSelector}`);
          return;
        }
        cy.get(checkboxSelector, this.getTimeoutOptions()).should('exist').and('not.be.checked');
      });
    };

    assertCheckboxNotChecked(L.lastNameExactMatchCheckbox);
    assertCheckboxNotChecked(L.firstNamesExactMatchCheckbox);

    cy.get('body').then(($body) => {
      if ((L as any).includeAliasesCheckbox) {
        assertCheckboxNotChecked((L as any).includeAliasesCheckbox);
        return;
      }

      const fallbacks = ['#include-aliases', 'input[name="includeAliases"]', '#includeAliases'];

      for (const sel of fallbacks) {
        if ($body.find(sel).length > 0) {
          assertCheckboxNotChecked(sel);
          return;
        }
      }

      cy.log('locator', 'Include aliases checkbox not found; skipping not-checked assertion');
    });
  }

  /**
   * Return whether the Individuals tab/panel is currently active (async check).
   * Use as: searchIndividuals.isActiveSync().then(active => { ... })
   */
  public isActiveSync(): Cypress.Chainable<boolean> {
    return cy.get('body', this.getTimeoutOptions()).then(($b) => {
      const lastName = $b.find(L.lastNameInput);
      const active = lastName.length > 0;
      // stash as alias to allow immediate branching in the same tick if needed
      cy.wrap(active, { log: false }).as('__indActive');
      return active;
    });
  }

  /**
   * Assert cross-section validation message (reused by flow).
   * Adjust selector/text to your exact error UI.
   */
  public assertCrossSectionValidationMessage(): void {
    log('assert', 'Cross-section validation message is visible');
    cy.contains('.govuk-error-summary, .govuk-error-message', /Search using either/i, this.getTimeoutOptions()).should(
      'be.visible',
    );
  }

  /**
   * Assert generic GOV.UK “There is a problem” page is shown.
   */
  public assertProblemPage(): void {
    log('assert', 'Asserting GOV.UK problem page');
    cy.contains('h1.govuk-heading-l', 'There is a problem', this.getTimeoutOptions()).should('be.visible');
  }

  /**
   * Sets the First names field (without submitting).
   *
   * @param firstNames - value to type into the First names input
   */
  public setFirstNames(firstNames: string): void {
    log('input', `Set First names -> ${firstNames}`);
    if (L.firstNameInput) {
      cy.get(L.firstNameInput, this.getTimeoutOptions())
        .should('be.visible')
        .clear()
        .type(firstNames)
        .should('have.value', firstNames);
    } else {
      // fallback selector if locator missing
      cy.get('input[name="firstNames"], #firstNames', this.getTimeoutOptions())
        .should('be.visible')
        .clear()
        .type(firstNames)
        .should('have.value', firstNames);
    }
  }

  /**
   * Sets the Last name field (without submitting).
   *
   * @param lastName - value to type into the Last name input
   */
  public setLastName(lastName: string): void {
    log('input', `Set Last name -> ${lastName}`);
    if (L.lastNameInput) {
      cy.get(L.lastNameInput, this.getTimeoutOptions())
        .should('be.visible')
        .clear()
        .type(lastName)
        .should('have.value', lastName);
    } else {
      // fallback selector if locator missing
      cy.get('input[name="lastName"], #lastName', this.getTimeoutOptions())
        .should('be.visible')
        .clear()
        .type(lastName)
        .should('have.value', lastName);
    }
  }

  /**
   * Mapping-driven field assertions for the Individuals form.
   * Add new entries here to assert more fields from the DataTable map.
   */
  private get fieldAssertions(): Record<
    string,
    {
      label: string;
      action: (value: string) => void;
    }
  > {
    return {
      'individual last name': {
        label: 'individual last name',
        action: (v: string) => this.assertLastNameEquals(v),
      },
      'first names': {
        label: 'individual first names',
        action: (v: string) => this.assertFirstNamesEquals(v),
      },
      // Extend easily:
      // 'dob': { label: 'date of birth', action: (v: string) => this.assertDobEquals(v) },
      // 'ni number': { label: 'national insurance number', action: (v: string) => this.assertNiNumberEquals(v) },
      // etc.
    };
  }

  /**
   * Assert fields present in the provided map using the `fieldAssertions` mapping.
   *
   * @param map Normalised key/value map (from Gherkin DataTable).
   */
  public assertIndividualFields(map: Record<string, string>): void {
    for (const [key, cfg] of Object.entries(this.fieldAssertions)) {
      if (map[key] !== undefined) {
        const value = String(map[key] ?? '').trim();
        log('assert', `Assert ${cfg.label} = "${value}"`);
        cfg.action(value);
      }
    }
  }
}
