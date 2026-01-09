/**
 * @file search-individuals.actions.ts
 * @description High-level actions for the “Search for an account” ➜ Individuals tab, including shared page assertions.
 * High-level actions for the “Search for an account” ➜ Individuals
 * Now includes shared search-page assertion logic.
 */

import { AccountSearchIndividualsLocators as L } from '../../../../../shared/selectors/account-search/account.search.individuals.locators';
import { AccountSearchCommonLocators as C } from '../../../../../shared/selectors/account-search/account.search.common.locators';
import { ResultsActions } from './search.results.actions';
import { CommonActions } from '../common/common.actions';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountSearchIndividualsActions');

/** Actions for the Individuals tab within Account Search. */
export class AccountSearchIndividualsActions {
  private readonly results = new ResultsActions();
  private readonly common = new CommonActions();

  // ──────────────────────────────
  // Navigation / page-level asserts
  // ──────────────────────────────

  /**
   * Assert the Search Individuals form is displayed and ready.
   *
   * Behaviour:
   *  - Verifies the URL pathname includes the search path.
   *  - Asserts the search form root is visible.
   *
   * @example
   *   searchIndividuals.assertOnSearchPage();
   */
  public assertOnSearchPage(): void {
    log('assert', 'Verifying Search for an Account page URL');
    cy.location('pathname', this.common.getTimeoutOptions()).should('include', '/fines/search-accounts/search');

    log('assert', 'Ensuring search form is visible');
    cy.get(L.searchFormRoot, this.common.getTimeoutOptions()).should('be.visible');

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
   * is done in other helpers when appropriate). Use this where the scenario wants to
   * assert there was no navigation away from the search page.
   */
  public assertRemainsOnSearchFormNoNavigation(): void {
    log('assert', 'Asserting we remain on the Search Individuals form (no navigation)');

    // 1) Path check. The canonical search path used elsewhere in the suite.
    cy.location('pathname', this.common.getTimeoutOptions()).should('include', '/fines/search-accounts/search');

    // 2) Ensure Individuals search form panel is visible
    if (!L.searchFormRoot) {
      // Fail fast if locator wiring breaks – easier to diagnose than a silent pass.
      throw new TypeError('assertRemainsOnSearchFormNoNavigation: Locator L.searchFormRoot is required but missing.');
    }

    cy.get(L.searchFormRoot, this.common.getTimeoutOptions()).should('be.visible');

    log('assert', 'Verified we remain on the Search Individuals form and the form root is visible');
  }

  /**
   * Verifies the Individuals form is the active/default form.
   *
   * @remarks
   * - Leverages existence/visibility of a field that only exists in the Individuals
   *   panel to infer that it is the active tab.
   * - Assumes the search button is present and enabled when the form is ready.
   */
  public assertDefaultIndividualsActive(): void {
    this.assertOnSearchPage();

    log('assert', 'Verifying Individuals form is active by default');
    // A field unique to Individuals form being visible is a strong signal it’s the active panel.
    cy.get(L.lastNameInput, this.common.getTimeoutOptions()).should('be.visible');

    // Optional: ensure the primary action is available
    cy.get(C.searchButton, this.common.getTimeoutOptions()).should('be.visible').and('not.be.disabled');
  }

  /**
   * Return whether the Individuals tab/panel is currently active (async check).
   * Use as: searchIndividuals.isActiveSync().then(active => { ... })
   * @returns Chainable resolving to `true` when Individuals tab is active.
   */
  public isActiveSync(): Cypress.Chainable<boolean> {
    return cy.get('body', this.common.getTimeoutOptions()).then(($b) => {
      const lastName = $b.find(L.lastNameInput);
      const active = lastName.length > 0;

      // Stash as alias to allow immediate branching in the same tick if needed
      cy.wrap(active, { log: false }).as('__indActive');
      return active;
    });
  }

  /**
   * Assert generic GOV.UK “There is a problem” page is shown.
   */
  public assertProblemPage(): void {
    log('assert', 'Asserting GOV.UK problem page');
    cy.contains('h1.govuk-heading-l', 'There is a problem', this.common.getTimeoutOptions()).should('be.visible');
  }

  // ──────────────────────────────
  // High-level search actions
  // ──────────────────────────────

  /**
   * Performs a search by last name and waits for results to load.
   *
   * @param lastName - The last name to search for.
   */
  public searchByLastName(lastName: string): void {
    log('action', `Submitting search by last name: "${lastName}"`);
    cy.get(L.lastNameInput, this.common.getTimeoutOptions()).clear().type(lastName);

    cy.get(C.searchButton, this.common.getTimeoutOptions()).should('be.enabled').click();

    log('assert', 'Verifying results are displayed');
    this.results.assertOnResults();
  }

  /**
   * Submits an empty Individuals search (no criteria) and verifies:
   * - no navigation occurred,
   * - the form remains visible,
   * - all inputs stay empty,
   * - all checkboxes remain unchecked.
   */
  public submitEmptySearch(): void {
    log('action', 'Submitting empty Individuals search (expect no navigation)');

    this.assertOnSearchPage();

    // Clear all text fields
    this.setIndividualFields({
      lastName: '',
      firstNames: '',
      dob: '',
      niNumber: '',
      addressLine1: '',
      postcode: '',
    });

    // Ensure all checkboxes explicitly unchecked
    this.setLastNameExactMatch(false);
    this.setFirstNamesExactMatch(false);
    this.setIncludeAliases(false);

    // Snapshot current path
    cy.location('pathname', this.common.getTimeoutOptions()).then((pathBefore) => {
      cy.get(C.searchButton, this.common.getTimeoutOptions()).should('be.visible').and('be.enabled').click();

      // Ensure no navigation occurred
      cy.location('pathname', this.common.getTimeoutOptions()).should('eq', pathBefore);

      // Ensure form is still visible
      cy.get(L.searchFormRoot, this.common.getTimeoutOptions()).should('be.visible');

      // Assert all text fields still blank
      this.assertAllFieldValues({
        lastName: '',
        firstNames: '',
        dob: '',
        niNumber: '',
        addressLine1: '',
        postcode: '',
      });

      // Assert checkboxes remain unchecked (if present)
      cy.get(L.lastNameExactMatchCheckbox, this.common.getTimeoutOptions()).should('not.be.checked');
      cy.get(L.firstNamesExactMatchCheckbox, this.common.getTimeoutOptions()).should('not.be.checked');

      if ((L as any).includeAliasesCheckbox) {
        cy.get((L as any).includeAliasesCheckbox, this.common.getTimeoutOptions()).should('not.be.checked');
      }
    });

    log('assert', 'Verified empty search caused no navigation and all fields/checkboxes remain empty/unchecked');
  }

  /**
   * Prepare Individuals form with sample values (for stateful switching tests).
   */
  public prepareIndividualsSample(): void {
    log('input', 'Preparing sample values in Individuals form');

    // Populate text fields using wrapper
    this.setIndividualFields({
      lastName: 'Smith',
      firstNames: 'John',
      dob: '01/01/1980',
      niNumber: 'QQ123456C',
      addressLine1: '10 Downing Street',
      postcode: 'SW1A 2AA',
    });

    // Now handle checkboxes using the dedicated actions
    this.setLastNameExactMatch(true);
    this.setFirstNamesExactMatch(true);

    // Include aliases may not exist on some variants
    cy.get('body').then(($body) => {
      if ((L as any).includeAliasesCheckbox && $body.find((L as any).includeAliasesCheckbox).length > 0) {
        this.setIncludeAliases(true);
      } else {
        log('debug', 'Include aliases checkbox not present on this variant – skipping');
      }
    });

    log('input', 'Completed preparing sample Individuals form');
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

    // Checkboxes should not be checked (if present)
    this.assertLastNameExactMatchChecked(false);
    this.assertFirstNamesExactMatchChecked(false);
    this.assertIncludeAliasesChecked(false);
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

  /**
   * Internal helper to set a text input value in a Cypress-safe way.
   * - Always clears the field first.
   * - Only calls cy.type(...) when the value is non-empty (Cypress disallows type('')).
   * - Asserts the final value.
   * @param selector - CSS selector for the target input.
   * @param rawValue - Raw value to type (empty clears the field).
   * @param description - Human-readable field description for logging.
   */
  private setInputValue(selector: string, rawValue: string, description: string): void {
    const value = String(rawValue ?? '').trim();
    log('input', `Set ${description} -> ${value}`);

    cy.get(selector, this.common.getTimeoutOptions()).should('be.visible').clear();

    if (value.length > 0) {
      cy.get(selector, this.common.getTimeoutOptions()).type(value).should('have.value', value);
    } else {
      cy.log('input', `${description} cleared with empty value`);
      cy.get(selector, this.common.getTimeoutOptions()).should('have.value', '');
    }
  }

  // ──────────────────────────────
  // Field-level setters (text inputs)
  // ──────────────────────────────

  /**
   * Sets the Last name field (without submitting).
   * @param lastName - Value to enter in the Last name field.
   */
  public setLastName(lastName: string): void {
    this.setInputValue(L.lastNameInput, lastName, 'Last name');
  }

  /**
   * Sets the First names field (without submitting).
   * @param firstNames - Value to enter in the First names field.
   */
  public setFirstNames(firstNames: string): void {
    this.setInputValue(L.firstNameInput, firstNames, 'First names');
  }

  /**
   * Sets the Date of birth field (without submitting).
   *
   * @param dob - value to type into the DOB input (e.g. "15/05/1980")
   */
  public setDob(dob: string): void {
    this.setInputValue(L.dobInput, dob, 'Date of birth');
  }

  /**
   * Sets the National Insurance number field (without submitting).
   *
   * @param niNumber - value to type into the NI input
   */
  public setNiNumber(niNumber: string): void {
    this.setInputValue(L.niNumberInput, niNumber, 'NI number');
  }

  /**
   * Sets the Address line 1 field (without submitting).
   *
   * @param addressLine1 - value to type into the addressLine1 input
   */
  public setAddressLine1(addressLine1: string): void {
    this.setInputValue(L.addressLine1Input, addressLine1, 'Address line 1');
  }

  /**
   * Sets the Postcode field (without submitting).
   *
   * @param postcode - value to type into the Postcode input
   */
  public setPostcode(postcode: string): void {
    this.setInputValue(L.postcodeInput, postcode, 'Postcode');
  }

  // ──────────────────────────────
  // Checkbox setters
  // ──────────────────────────────

  /**
   * Shared helper to set checkbox state safely.
   * @param selector - Checkbox selector.
   * @param enabled - Desired checked state.
   * @param description - Human-readable checkbox label for logging.
   */
  private setCheckboxState(selector: string, enabled: boolean, description: string): void {
    log('input', `Set ${description} checkbox -> ${enabled ? 'checked' : 'unchecked'}`);

    cy.get('body').then(($body) => {
      if ($body.find(selector).length === 0) {
        cy.log('locator', `${description} checkbox not present; skipping (${selector})`);
        return;
      }

      const chain = cy.get(selector, this.common.getTimeoutOptions()).should('exist');

      if (enabled) {
        chain.check({ force: true }).should('be.checked');
      } else {
        chain.uncheck({ force: true }).should('not.be.checked');
      }
    });
  }

  /**
   * Controls the "Last name exact match" checkbox.
   * @param enabled - Whether the checkbox should be checked.
   */
  public setLastNameExactMatch(enabled: boolean): void {
    this.setCheckboxState(L.lastNameExactMatchCheckbox, enabled, 'Last name exact match');
  }

  /**
   * Controls the "First names exact match" checkbox.
   * @param enabled - Whether the checkbox should be checked.
   */
  public setFirstNamesExactMatch(enabled: boolean): void {
    this.setCheckboxState(L.firstNamesExactMatchCheckbox, enabled, 'First names exact match');
  }

  /**
   * Controls the "Include aliases" checkbox.
   * @param enabled - Whether the checkbox should be checked.
   */
  public setIncludeAliases(enabled: boolean): void {
    this.setCheckboxState(L.includeAliasesCheckbox, enabled, 'Include aliases');
  }

  /**
   * Shared helper to assert checkbox checked/unchecked state safely.
   * @param selector - Checkbox selector.
   * @param expected - Expected checked state.
   * @param description - Human-readable checkbox label for logging.
   */
  private assertCheckboxState(selector: string, expected: boolean, description: string): void {
    log('assert', `Assert ${description} checkbox is ${expected ? 'checked' : 'not checked'}`);

    cy.get('body').then(($body) => {
      if ($body.find(selector).length === 0) {
        cy.log('locator', `${description} checkbox not present; skipping assertion (${selector})`);
        return;
      }

      const chain = cy.get(selector, this.common.getTimeoutOptions()).should('exist');

      if (expected) {
        chain.should('be.checked');
      } else {
        chain.should('not.be.checked');
      }
    });
  }

  /**
   * Asserts the "Last name exact match" checkbox checked state.
   * @param expected - Whether the checkbox should be checked.
   */
  public assertLastNameExactMatchChecked(expected: boolean): void {
    this.assertCheckboxState(L.lastNameExactMatchCheckbox, expected, 'Last name exact match');
  }

  /**
   * Asserts the "First names exact match" checkbox checked state.
   * @param expected - Whether the checkbox should be checked.
   */
  public assertFirstNamesExactMatchChecked(expected: boolean): void {
    this.assertCheckboxState(L.firstNamesExactMatchCheckbox, expected, 'First names exact match');
  }

  /**
   * Asserts the "Include aliases" checkbox checked state (if present).
   * Uses the main locator if available; otherwise falls back to historical selectors.
   * @param expected - Whether the checkbox should be checked.
   */
  public assertIncludeAliasesChecked(expected: boolean): void {
    cy.get('body').then(($body) => {
      const explicit = (L as any).includeAliasesCheckbox as string | undefined;
      const fallbacks = ['#include-aliases', 'input[name="includeAliases"]', '#includeAliases'];

      const selector =
        explicit && $body.find(explicit).length > 0 ? explicit : fallbacks.find((sel) => $body.find(sel).length > 0);

      if (!selector) {
        cy.log('locator', 'Include aliases checkbox not found; skipping assertion');
        return;
      }

      this.assertCheckboxState(selector, expected, 'Include aliases');
    });
  }

  // ──────────────────────────────
  // Wrapper setters (object-based)
  // ──────────────────────────────

  /**
   * Convenience method to set multiple Individuals fields in one call.
   * Any provided property will be written using the corresponding setter.
   * Undefined properties are ignored.
   * @param fields - Object of field values to set (undefined values are skipped).
   * @param fields.lastName - Optional last name.
   * @param fields.firstNames - Optional first names.
   * @param fields.dob - Optional DOB string.
   * @param fields.niNumber - Optional NI number.
   * @param fields.addressLine1 - Optional address line 1.
   * @param fields.postcode - Optional postcode.
   */
  public setIndividualFields(fields: {
    lastName?: string;
    firstNames?: string;
    dob?: string;
    niNumber?: string;
    addressLine1?: string;
    postcode?: string;
  }): void {
    const safe = (value?: string): string => (typeof value === 'string' ? value : '');

    log('input', `Set Individuals fields from object: ${JSON.stringify(fields)}`);

    if (fields.lastName !== undefined) {
      this.setLastName(safe(fields.lastName));
    }

    if (fields.firstNames !== undefined) {
      this.setFirstNames(safe(fields.firstNames));
    }

    if (fields.dob !== undefined) {
      this.setDob(safe(fields.dob));
    }

    if (fields.niNumber !== undefined) {
      this.setNiNumber(safe(fields.niNumber));
    }

    if (fields.addressLine1 !== undefined) {
      this.setAddressLine1(safe(fields.addressLine1));
    }

    if (fields.postcode !== undefined) {
      this.setPostcode(safe(fields.postcode));
    }

    log('input', 'Finished setting Individuals fields from wrapper');
  }

  // ──────────────────────────────
  // Field assertions
  // ──────────────────────────────

  /**
   * Asserts the Last name field equals the expected value.
   * @param expected - Expected Last name value.
   */
  public assertLastNameEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Last name equals "${expectedTrim}"`);
    cy.get(L.lastNameInput, this.common.getTimeoutOptions()).should('have.value', expectedTrim);
  }

  /**
   * Asserts the First names field equals the expected value.
   * @param expected - Expected First names value.
   */
  public assertFirstNamesEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting First names equals "${expectedTrim}"`);
    cy.get(L.firstNameInput, this.common.getTimeoutOptions()).should('have.value', expectedTrim);
  }

  /**
   * Asserts the Date of birth field equals the expected value.
   * @param expected - Expected DOB value.
   */
  public assertDobEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Date of birth equals "${expectedTrim}"`);
    cy.get(L.dobInput, this.common.getTimeoutOptions())
      .invoke('val')
      .then((val) => expect(String(val ?? '').trim()).to.eq(expectedTrim));
  }

  /**
   * Asserts the National Insurance Number field equals the expected value.
   * @param expected - Expected NI number.
   */
  public assertNiNumberEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting National Insurance number equals "${expectedTrim}"`);
    cy.get(L.niNumberInput, this.common.getTimeoutOptions()).should('have.value', expectedTrim);
  }

  /**
   * Asserts the Address Line 1 field equals the expected value.
   * @param expected - Expected address line 1.
   */
  public assertAddressLine1Equals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Address line 1 equals "${expectedTrim}"`);
    cy.get(L.addressLine1Input, this.common.getTimeoutOptions()).should('have.value', expectedTrim);
  }

  /**
   * Asserts the Postcode field equals the expected value.
   * @param expected - Expected postcode.
   */
  public assertPostcodeEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Postcode equals "${expectedTrim}"`);
    cy.get(L.postcodeInput, this.common.getTimeoutOptions()).should('have.value', expectedTrim);
  }

  /**
   * Combined convenience method for asserting all field values in one call.
   * Accepts an object containing one or more expected field values.
   * @param expected - Object of expected field values (unset properties are ignored).
   * @param expected.lastName - Expected last name.
   * @param expected.firstNames - Expected first names.
   * @param expected.dob - Expected DOB.
   * @param expected.niNumber - Expected NI number.
   * @param expected.addressLine1 - Expected address line 1.
   * @param expected.postcode - Expected postcode.
   */
  public assertAllFieldValues(expected: {
    lastName?: string;
    firstNames?: string;
    dob?: string;
    niNumber?: string;
    addressLine1?: string;
    postcode?: string;
  }): void {
    const map: Record<string, string> = {};

    if (expected.lastName !== undefined) {
      map['individual last name'] = expected.lastName;
    }
    if (expected.firstNames !== undefined) {
      map['first names'] = expected.firstNames;
    }
    if (expected.dob !== undefined) {
      map['date of birth'] = expected.dob;
    }
    if (expected.niNumber !== undefined) {
      map['national insurance number'] = expected.niNumber;
    }
    if (expected.addressLine1 !== undefined) {
      map['address line 1'] = expected.addressLine1;
    }
    if (expected.postcode !== undefined) {
      map['postcode'] = expected.postcode;
    }

    this.assertIndividualFields(map);
  }

  // ──────────────────────────────
  // Map-driven assertions
  // ──────────────────────────────

  /**
   * Parses a Yes/No style value from a DataTable into a boolean.
   * Returns undefined if the value is empty or unrecognised.
   * @param value - Raw value from the DataTable.
   * @returns `true`/`false` when recognised, otherwise `undefined`.
   */
  private parseBooleanFromTable(value: string): boolean | undefined {
    const normalised = String(value ?? '')
      .trim()
      .toLowerCase();

    if (!normalised) {
      return undefined;
    }

    if (normalised === 'yes' || normalised === 'y' || normalised === 'true') {
      return true;
    }

    if (normalised === 'no' || normalised === 'n' || normalised === 'false') {
      return false;
    }

    log('warn', `parseBooleanFromTable: unrecognised boolean value "${value}"`);
    return undefined;
  }

  /**
   * Field-level assertion registry for the Individuals search form.
   *
   * This getter returns a mapping of *canonicalised* DataTable keys to
   * assertion handlers. It is used by:
   *
   *   - `assertIndividualFields(map)` → loops over the DataTable entries
   *   - `assertByKey(key, value)`     → routes the assertion to the correct handler
   *
   * Keys are expected to be **normalised** using `buildInputMap()` +
   * `this.normalize()`, meaning:
   *
   *   - case-insensitive        ("First Names" → "first names")
   *   - whitespace normalised   ("  last name   " → "last name")
   *   - punctuation trimmed     ("last name exact match." → "last name exact match")
   *   - consistently lower-case
   *
   * The registry supports two categories of fields:
   *
   * ──────────────────────────────────────────────────────────────────────
   *  TEXT FIELDS
   * ──────────────────────────────────────────────────────────────────────
   * These use direct string equality assertions via dedicated actions:
   *
   *   - "individual last name"       → assertLastNameEquals()
   *   - "first names"                → assertFirstNamesEquals()
   *   - "date of birth", "dob"       → assertDobEquals()
   *   - "national insurance number",
   *     "ni number"                  → assertNiNumberEquals()
   *   - "address line 1"             → assertAddressLine1Equals()
   *   - "postcode"                   → assertPostcodeEquals()
   *
   * Multiple map keys may route to the same assertion (e.g. "dob" + "date of birth").
   *
   *
   * ──────────────────────────────────────────────────────────────────────
   *  CHECKBOX FIELDS
   * ──────────────────────────────────────────────────────────────────────
   * These interpret the DataTable value using `parseBooleanFromTable(value)`
   * ("Yes" / "No" / "True" / "False"), and route to checkbox-specific
   * assertion helpers:
   *
   *   - "last name exact match"    → assertLastNameExactMatchChecked()
   *   - "first names exact match"  → assertFirstNamesExactMatchChecked()
   *   - "include aliases"          → assertIncludeAliasesChecked()
   *
   * If a field is present in the DataTable but contains an unparseable value
   * (e.g. "maybe"), the assertion is skipped with a debug log.
   *
   *
   * ──────────────────────────────────────────────────────────────────────
   *  EXTENDING THE REGISTRY
   * ──────────────────────────────────────────────────────────────────────
   * To add a new Individuals field:
   *
   *   1. Add a new canonical key to this mapping (lowercase only).
   *   2. Implement a corresponding assertion method on
   *      `AccountSearchIndividualsActions` if needed.
   *   3. Ensure the value comes from `buildInputMap()` in the same normalised form.
   *
   * This ensures consistent, declarative assertions via the Gherkin table:
   *
   *   Then I see the "Search for an account" page for individuals with the following:
   *     | first names             | John   |
   *     | date of birth          | 01/01/1990 |
   *     | include aliases        | Yes    |
   *
   * All fields — text and checkbox — are asserted through this registry,
   * keeping the step definition thin and the behaviour fully data-driven.
   */

  /**
   * Registry mapping normalised Individuals field keys to assertion handlers.
   * @returns Mapping of field keys to labels and assertion actions.
   */
  private get fieldAssertions(): Record<
    string,
    {
      label: string;
      action: (value: string) => void;
    }
  > {
    return {
      // Text fields
      'individual last name': {
        label: 'individual last name',
        action: (v: string) => this.assertLastNameEquals(v),
      },
      'first names': {
        label: 'individual first names',
        action: (v: string) => this.assertFirstNamesEquals(v),
      },
      'date of birth': {
        label: 'date of birth',
        action: (v: string) => this.assertDobEquals(v),
      },
      dob: {
        label: 'date of birth',
        action: (v: string) => this.assertDobEquals(v),
      },
      'national insurance number': {
        label: 'national insurance number',
        action: (v: string) => this.assertNiNumberEquals(v),
      },
      'ni number': {
        label: 'national insurance number',
        action: (v: string) => this.assertNiNumberEquals(v),
      },
      'address line 1': {
        label: 'address line 1',
        action: (v: string) => this.assertAddressLine1Equals(v),
      },
      postcode: {
        label: 'postcode',
        action: (v: string) => this.assertPostcodeEquals(v),
      },

      // ────────────────────────────
      // Checkbox flags (Individuals)
      // ────────────────────────────
      'last name exact match': {
        label: 'last name exact match',
        action: (v: string) => {
          const expected = this.parseBooleanFromTable(v);
          if (expected === undefined) {
            log('debug', `Skipping "last name exact match" checkbox assert for value "${v}"`);
            return;
          }
          this.assertLastNameExactMatchChecked(expected);
        },
      },
      'first names exact match': {
        label: 'first names exact match',
        action: (v: string) => {
          const expected = this.parseBooleanFromTable(v);
          if (expected === undefined) {
            log('debug', `Skipping "first names exact match" checkbox assert for value "${v}"`);
            return;
          }
          this.assertFirstNamesExactMatchChecked(expected);
        },
      },
      'include aliases': {
        label: 'include aliases',
        action: (v: string) => {
          const expected = this.parseBooleanFromTable(v);
          if (expected === undefined) {
            log('debug', `Skipping "include aliases" checkbox assert for value "${v}"`);
            return;
          }
          this.assertIncludeAliasesChecked(expected);
        },
      },
    };
  }

  /**
   * Internal helper – assert a single key/value pair using fieldAssertions.
   * @param key - Normalised field key.
   * @param value - Raw value from the DataTable map.
   */
  private assertByKey(key: string, value: string): void {
    const cfg = this.fieldAssertions[key];
    if (!cfg) {
      log('debug', `No fieldAssertions mapping for key "${key}", skipping`);
      return;
    }

    const valueTrim = String(value ?? '').trim();
    log('assert', `Assert ${cfg.label} = "${valueTrim}"`);
    cfg.action(valueTrim);
  }

  /**
   * Assert fields present in the provided map using the `fieldAssertions` mapping.
   *
   * @param map Normalised key/value map (from Gherkin DataTable).
   */
  public assertIndividualFields(map: Record<string, string>): void {
    for (const [key, value] of Object.entries(map)) {
      if (value === undefined || value === null) {
        continue;
      }
      this.assertByKey(key, value);
    }
  }
}
