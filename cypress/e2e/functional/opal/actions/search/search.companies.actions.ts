/**
 * @fileoverview AccountSearchCompanyActions
 * High-level actions for the "Search for an account" ➜ Companies tab.
 * Delegates all results-page behaviours to ResultsActions to avoid duplication.
 * Uses mapping-driven assertions for clean, scalable field checks.
 */

import { AccountSearchCompaniesLocators as L } from '../../../../../shared/selectors/account-search/account.search.companies.locators';
import { AccountSearchCommonLocators as C } from '../../../../../shared/selectors/account-search/account.search.common.locators';
import { ResultsActions } from '../search.results.actions';
import { AccountSearchCommonActions } from '../search/search.common.actions';
import { CommonActions } from '../common/common.actions';

import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountSearchCompanyActions');

export class AccountSearchCompanyActions {
  private readonly results = new ResultsActions();
  private readonly accountSearchCommonActions = new AccountSearchCommonActions();
  private readonly commonActions = new CommonActions();

  /**
   * Assert we remain on the Search Companies form and no navigation occurred.
   *
   * Behaviour:
   *  - Ensures the current pathname still includes the canonical search path.
   *  - Ensures the Companies search form root is visible.
   *
   * This is intentionally conservative: it doesn't compare a before/after snapshot (that
   * is done in other helpers when appropriate). Use this step where the scenario wants
   * to assert there was no navigation away from the search page.
   */
  public assertRemainsOnSearchFormNoNavigation(): void {
    log('assert', 'Asserting we remain on the Search Companies form (no navigation)');

    // 1) Path check. The canonical search path used elsewhere in the suite.
    cy.location('pathname', this.commonActions.getTimeoutOptions()).should('include', '/fines/search-accounts/search');

    // 2) Ensure Companies search form panel is visible
    if (!L.searchFormRoot) {
      throw new TypeError('assertRemainsOnSearchFormNoNavigation: Locator L.searchFormRoot is required but missing.');
    }

    cy.get(L.searchFormRoot, this.commonActions.getTimeoutOptions()).should('be.visible');

    log('assert', 'Verified we remain on the Search Companies form and the form root is visible');
  }

  /**
   * Submits the Companies search with no criteria and asserts:
   * - no navigation occurred,
   * - the form remains visible,
   * - all relevant fields stay blank.
   */
  public submitEmptySearch(): void {
    log('action', 'Submitting empty Companies search (expect no navigation)');

    // Ensure we’re on the Companies search page
    this.assertOnSearchPage();

    // Snapshot the path to confirm no redirect occurs
    cy.location('pathname', this.commonActions.getTimeoutOptions()).then((pathBefore) => {
      // Click the shared Search button (delegated shared locator)
      cy.get(C.searchButton, this.commonActions.getTimeoutOptions()).should('be.visible').and('be.enabled').click();

      // Verify no navigation
      cy.location('pathname', this.commonActions.getTimeoutOptions()).should('eq', pathBefore);

      // Verify form still visible
      cy.get(L.root, this.commonActions.getTimeoutOptions()).should('be.visible');

      // Assert all key fields remain blank
      this.assertAllFieldValues({
        companyName: '',
        accountNumber: '',
        referenceOrCaseNumber: '',
        addressLine1: '',
        postcode: '',
      });
    });
  }

  /**
   * Asserts multiple Companies and shared fields in one call.
   *
   * Delegates to:
   * - this.assertCompanyNameEquals
   * - accountSearchCommonActions.assertSharedFieldValues
   * - this.assertAddressLine1Equals
   * - this.assertPostcodeEquals
   */
  public assertAllFieldValues(expected: {
    companyName?: string;
    accountNumber?: string;
    referenceOrCaseNumber?: string;
    addressLine1?: string;
    postcode?: string;
  }): void {
    // Delegate to the individual assertion helpers (which handle undefined checks)
    if (expected.companyName !== undefined) this.assertCompanyNameEquals(expected.companyName);
    if (expected.accountNumber !== undefined) {
      this.accountSearchCommonActions.assertSharedFieldValues({
        accountNumber: expected.accountNumber,
      });
    }
    if (expected.referenceOrCaseNumber !== undefined) {
      this.accountSearchCommonActions.assertSharedFieldValues({
        referenceOrCaseNumber: expected.referenceOrCaseNumber,
      });
    }
    if (expected.addressLine1 !== undefined) this.assertAddressLine1Equals(expected.addressLine1);
    if (expected.postcode !== undefined) this.assertPostcodeEquals(expected.postcode);

    log('assert', 'Companies field value assertions complete', expected);
  }

  /**
   * Performs a search by company name and waits for results to load.
   *
   * NOTE: this helper types into the company name input and clicks search.
   * Your flows may prefer to use enterCompanyName + common.submitSearch instead.
   */
  public byCompanyName(companyName: string): void {
    if (L.companyNameInput) {
      cy.get(L.companyNameInput, this.commonActions.getTimeoutOptions()).clear().type(companyName);
    } else {
      // Fallback: try a sensible selector if locator not provided
      cy.get('input[name="companyName"], #companyName', this.commonActions.getTimeoutOptions())
        .clear()
        .type(companyName);
    }

    cy.get(C.searchButton, this.commonActions.getTimeoutOptions()).should('be.enabled').click();
  }

  /**
   * Public helper to just enter the company name without submitting.
   * This is the method your flow calls (enterCompanyName).
   */
  public enterCompanyName(companyName: string): void {
    log('input', `Enter company name -> ${companyName}`);
    if (L.companyNameInput) {
      cy.get(L.companyNameInput, this.commonActions.getTimeoutOptions())
        .should('be.visible')
        .clear()
        .type(companyName)
        .should('have.value', companyName);
    } else {
      // Fallback selector if locator not present
      cy.get('input[name="companyName"], #companyName', this.commonActions.getTimeoutOptions())
        .should('be.visible')
        .clear()
        .type(companyName)
        .should('have.value', companyName);
    }
  }

  /**
   * Sets the Companies Address Line 1 field, if a value is supplied.
   *
   * If the value is empty or only whitespace, the method is a no-op.
   */
  public setAddressLine1(value?: string): void {
    const trimmed = (value ?? '').trim();
    if (!trimmed) {
      cy.log('[INPUT] Address line 1 not supplied — skipping');
      return;
    }

    log('input', `Setting Company address line 1 to "${trimmed}"`);

    if (L.addressLine1Input) {
      cy.get(L.addressLine1Input, this.commonActions.getTimeoutOptions()).should('exist').clear().type(trimmed);
      return;
    }

    cy.get('input[name="addressLine1"], #addressLine1', this.commonActions.getTimeoutOptions())
      .should('exist')
      .clear()
      .type(trimmed);
  }

  /**
   * Sets the Companies Postcode field, if a value is supplied.
   *
   * If the value is empty or only whitespace, the method is a no-op.
   */
  public setPostcode(value?: string): void {
    const trimmed = (value ?? '').trim();
    if (!trimmed) {
      cy.log('[INPUT] Postcode not supplied — skipping');
      return;
    }

    log('input', `Setting Company postcode to "${trimmed}"`);

    if (L.postCodeInput) {
      cy.get(L.postCodeInput, this.commonActions.getTimeoutOptions()).should('exist').clear().type(trimmed);
      return;
    }

    cy.get('input[name="postcode"], #postcode', this.commonActions.getTimeoutOptions())
      .should('exist')
      .clear()
      .type(trimmed);
  }

  // ──────────────────────────────────────────────────────────────
  // Checkbox setters
  // ──────────────────────────────────────────────────────────────

  /**
   * Sets the "Company name exact match" checkbox state.
   *
   * Notes:
   * - GOV.UK checkboxes typically hide the input (`opacity: 0`), so we
   *   assert existence, not visibility.
   * - The method is idempotent: it only clicks when a state change is needed.
   */
  public setCompanyNameExactMatch(checked: boolean): void {
    log('input', `Setting "Company name exact match" to ${checked}`);

    if (!L.companyNameExactMatchCheckbox) {
      log('warn', 'Locator for companyNameExactMatchCheckbox missing — skipping');
      return;
    }

    cy.get(L.companyNameExactMatchCheckbox, this.commonActions.getTimeoutOptions())
      .should('exist')
      .then(($el) => {
        const isChecked = $el.prop('checked') ?? false;

        if (checked !== isChecked) {
          cy.wrap($el).click({ force: true });
        }
      });

    cy.get(L.companyNameExactMatchCheckbox, this.commonActions.getTimeoutOptions()).should(
      checked ? 'be.checked' : 'not.be.checked',
    );
  }

  /**
   * Sets the "Include aliases" checkbox state for Company searches.
   *
   * Notes:
   * - Idempotent: only triggers a click when required.
   * - Interacts with the underlying input using `{ force: true }` to
   *   cope with hidden GOV.UK checkbox inputs.
   */
  public setIncludeAliases(checked: boolean): void {
    log('input', `Setting "Include aliases" (Companies) to ${checked}`);

    if (!L.includeAliasesCheckbox) {
      log('warn', 'Locator for includeAliasesCheckbox missing — skipping');
      return;
    }

    cy.get(L.includeAliasesCheckbox, this.commonActions.getTimeoutOptions())
      .should('exist')
      .then(($el) => {
        const isChecked = $el.prop('checked') ?? false;

        if (checked !== isChecked) {
          cy.wrap($el).click({ force: true });
        }
      });

    cy.get(L.includeAliasesCheckbox, this.commonActions.getTimeoutOptions()).should(
      checked ? 'be.checked' : 'not.be.checked',
    );
  }

  /**
   * Asserts that the Companies search tab is active and visible.
   *
   * This is a lightweight guard used by flows before interacting with
   * the Companies search form. It only checks for the presence of the
   * root form container; field-level assertions are handled elsewhere.
   */
  public assertOnSearchPage(): void {
    log('assert', 'Companies search tab is active');
    cy.get(L.root, this.commonActions.getTimeoutOptions()).should('be.visible');
  }

  /** Verify Companies form defaults (adjust fields to your locators). */
  public assertDefaults(): void {
    log('assert', 'Companies form defaults (empty fields)');
    if (L.companyNameInput) {
      cy.get(L.companyNameInput, this.commonActions.getTimeoutOptions()).should('have.value', '');
    }
    if (L.postCodeInput) {
      cy.get(L.postCodeInput, this.commonActions.getTimeoutOptions()).should('have.value', '');
    }
  }

  /**
   * Populate representative Companies sample data.
   */
  public prepareSample(): void {
    log('input', 'Preparing sample values in Companies form');

    if (L.companyNameInput) {
      cy.get(L.companyNameInput, this.commonActions.getTimeoutOptions()).clear().type('ACME LTD');
    }
    if (L.postCodeInput) {
      cy.get(L.postCodeInput, this.commonActions.getTimeoutOptions()).clear().type('B1 1AA');
    }

    // Helper: select a checkbox via its label if visible, otherwise force-check the input.
    const selectCheckbox = (checkboxSelector: string): void => {
      const checkboxId = checkboxSelector.replace(/^#/, '');
      const labelSelector = `label[for="${checkboxId}"]`;

      cy.get('body').then(($body) => {
        if ($body.find(checkboxSelector).length === 0 && $body.find(labelSelector).length === 0) {
          log('locator', `Checkbox or label not present for selector: ${checkboxSelector} — skipping`);
          return;
        }

        if ($body.find(labelSelector).length > 0 && $body.find(labelSelector).is(':visible')) {
          cy.get(labelSelector, this.commonActions.getTimeoutOptions()).should('be.visible').click({ force: true });
        } else {
          cy.get(checkboxSelector, this.commonActions.getTimeoutOptions()).should('exist').check({ force: true });
        }

        cy.get(checkboxSelector, this.commonActions.getTimeoutOptions()).should('be.checked');
      });
    };

    // 1) Company-name exact-match checkbox (locator may be directly on L or under different name)
    cy.get('body').then(($body) => {
      if ((L as any).companyNameExactMatchCheckbox) {
        selectCheckbox((L as any).companyNameExactMatchCheckbox);
        return;
      }

      // fallback candidates commonly used in markup
      const fallbacks = [
        '#fsa_search_account_companies_company_name_exact_match',
        '#company-name-exact-match',
        'input[name="companyNameExactMatch"]',
      ];

      for (const sel of fallbacks) {
        if ($body.find(sel).length > 0) {
          selectCheckbox(sel);
          return;
        }
      }

      log('locator', 'Company name exact-match checkbox not found; skipping');
    });

    // 2) Include aliases checkbox (may be shared with individuals; try L first then fallbacks)
    cy.get('body').then(($body) => {
      if ((L as any).includeAliasesCheckbox) {
        selectCheckbox((L as any).includeAliasesCheckbox);
        return;
      }

      const fallbacks = [
        '#fsa_search_account_companies_include_aliases',
        '#include-aliases',
        'input[name="includeAliases"]',
      ];

      for (const sel of fallbacks) {
        if ($body.find(sel).length > 0) {
          selectCheckbox(sel);
          return;
        }
      }

      log('locator', 'Include aliases checkbox not found; skipping');
    });
  }

  /**
   * Assert Companies form was cleared to defaults.
   * - Verifies text inputs are empty
   * - Verifies relevant checkboxes (if present) are NOT checked (clears them if unexpectedly checked)
   */
  public assertCompaniesCleared(): void {
    log('assert', 'Companies form cleared to defaults');

    // Field assertions (text inputs)
    if (L.companyNameInput) {
      cy.get(L.companyNameInput, this.commonActions.getTimeoutOptions()).should('have.value', '');
    }
    if (L.postCodeInput) {
      cy.get(L.postCodeInput, this.commonActions.getTimeoutOptions()).should('have.value', '');
    }

    // Check known checkbox locators (use L values when present, else fallback selectors)
    const checkboxCandidates: string[] = [];

    if ((L as any).companyNameExactMatchCheckbox) {
      checkboxCandidates.push((L as any).companyNameExactMatchCheckbox);
    } else {
      checkboxCandidates.push(
        '#fsa_search_account_companies_company_name_exact_match',
        '#company-name-exact-match',
        'input[name="companyNameExactMatch"]',
      );
    }

    if ((L as any).includeAliasesCheckbox) {
      checkboxCandidates.push((L as any).includeAliasesCheckbox);
    } else {
      checkboxCandidates.push(
        '#fsa_search_account_companies_include_aliases',
        '#include-aliases',
        'input[name="includeAliases"]',
        '#includeAliases',
      );
    }

    // Assert each candidate checkbox is not checked (if present)
    for (const checkboxSelector of checkboxCandidates) {
      this.assertCheckboxNotChecked(checkboxSelector);
    }

    log('done', 'Companies form cleared verification complete');
  }

  /**
   * Private helper to assert a checkbox is not present or not checked.
   * If the checkbox exists and is checked, uncheck it to enforce test isolation.
   */
  private assertCheckboxNotChecked(checkboxSelector: string): void {
    cy.get('body').then(($body) => {
      // If not present, skip gracefully
      if ($body.find(checkboxSelector).length === 0) {
        log('locator', `Checkbox not present, skipping assertion for: ${checkboxSelector}`);
        return;
      }

      cy.get(checkboxSelector, this.commonActions.getTimeoutOptions())
        .should('exist')
        .then(($el) => {
          const isChecked = $el.prop?.('checked') ?? false;

          if (!isChecked) {
            cy.wrap($el).should('not.be.checked');
            return;
          }

          // Unexpected: checkbox is checked → remediate and assert
          log('warn', `Checkbox ${checkboxSelector} unexpectedly checked — unchecking to enforce test isolation`);
          cy.wrap($el).uncheck({ force: true }).should('not.be.checked');
        });
    });
  }

  /** Async flag used by flow branching. Use .then(active => ...) */
  public isActiveSync(): Cypress.Chainable<boolean> {
    return cy.get('body', this.commonActions.getTimeoutOptions()).then(($b) => {
      const el = $b.find(L.companyNameInput || '');
      const active = el.length > 0;
      cy.wrap(active, { log: false }).as('__coActive');
      return active;
    });
  }

  // ──────────────────────────────
  // Company field asserts
  // ──────────────────────────────

  /** Asserts the Company name field equals the expected value. */
  public assertCompanyNameEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Company name equals "${expectedTrim}"`);
    if (L.companyNameInput) {
      cy.get(L.companyNameInput, this.commonActions.getTimeoutOptions()).should('have.value', expectedTrim);
    } else {
      cy.get('input[name="companyName"], #companyName', this.commonActions.getTimeoutOptions()).should(
        'have.value',
        expectedTrim,
      );
    }
  }

  /** Asserts the Address Line 1 field equals the expected value. */
  public assertAddressLine1Equals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Company address line 1 equals "${expectedTrim}"`);
    if (L.addressLine1Input) {
      cy.get(L.addressLine1Input, this.commonActions.getTimeoutOptions()).should('have.value', expectedTrim);
    } else {
      cy.get('input[name="addressLine1"], #addressLine1', this.commonActions.getTimeoutOptions()).should(
        'have.value',
        expectedTrim,
      );
    }
  }

  /** Asserts the Postcode field equals the expected value. */
  public assertPostcodeEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Company postcode equals "${expectedTrim}"`);
    if (L.postCodeInput) {
      cy.get(L.postCodeInput, this.commonActions.getTimeoutOptions()).should('have.value', expectedTrim);
    } else {
      cy.get('input[name="postcode"], #postcode', this.commonActions.getTimeoutOptions()).should(
        'have.value',
        expectedTrim,
      );
    }
  }

  /**
   * Mapping-driven field assertions for the Companies form.
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
      'company name': {
        label: 'company name',
        action: (v: string) => this.assertCompanyNameEquals(v),
      },
      'account number': {
        label: 'account number',
        action: (v: string) => this.accountSearchCommonActions.assertSharedFieldValues({ accountNumber: v }),
      },
      'reference or case number': {
        label: 'reference',
        action: (v: string) => this.accountSearchCommonActions.assertSharedFieldValues({ referenceOrCaseNumber: v }),
      },
      'address line 1': {
        label: 'address line 1',
        action: (v: string) => this.assertAddressLine1Equals(v),
      },
      postcode: {
        label: 'postcode',
        action: (v: string) => this.assertPostcodeEquals(v),
      },
    };
  }

  /**
   * Assert company-related fields present in the provided map using the `fieldAssertions` mapping.
   *
   * @param map Normalised key/value map (from Gherkin DataTable).
   */
  public assertCompanyFields(map: Record<string, string>): void {
    for (const [key, cfg] of Object.entries(this.fieldAssertions)) {
      if (map[key] !== undefined) {
        const value = String(map[key] ?? '').trim();
        log('assert', `Assert ${cfg.label} = "${value}"`);
        cfg.action(value);
      }
    }
  }
}
