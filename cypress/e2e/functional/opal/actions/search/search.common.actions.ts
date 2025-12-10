// e2e/functional/opal/actions/search/search.common.actions.ts
/**
 * @fileoverview Actions for fields shared across ALL Account Search tabs:
 * - Account number
 * - Reference or case number
 * - Active accounts only (checkbox)
 * - Submit (Search)
 *
 * Keeps steps small, reusable, and intent-driven.
 */

import { createScopedLogger, logSync } from '../../../../../support/utils/log.helper';
import { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { AccountSearchIndividualsActions } from './search.individuals.actions';
import { AccountSearchCompanyActions } from './search.companies.actions';
import { AccountSearchMinorCreditorsActions } from './search.minor-creditors.actions';
import { CommonActions } from '../common/common.actions';
import { AccountSearchCommonLocators as C } from '../../../../../shared/selectors/account-search/account.search.common.locators';
import { parseToIsoDate } from '../../../../../support/utils/dateUtils';

type Entity = 'individual' | 'company' | 'minorCreditor';
const log = createScopedLogger('AccountSearchCommonActions');

/**
 * Mapping between high-level Gherkin parameter keys and the underlying
 * request body properties for each account search type.
 *
 * Keys in the first level (e.g. "defendant", "minor creditor") correspond
 * to the `accountType` used in feature steps.
 *
 * Keys in the inner record (e.g. "accountNumber", "businessUnitIds") match
 * the column names used in the Gherkin data tables. Each entry maps a
 * human-readable key to the underlying request field name, and optionally
 * flags whether the field lives at the top level of the request body
 * (`topLevel: true`) or inside the account entity object.
 *
 * This allows feature files to remain stable even if the underlying API
 * payload shape changes, by only updating this mapping.
 */

type AccountSearchFieldMapping = {
  key: string;
  topLevel?: boolean;
  containerKey?: string; // e.g. "reference_number"
};

const ACCOUNT_SEARCH_MAPPINGS: Record<string, Record<string, AccountSearchFieldMapping>> = {
  defendant: {
    // --- defendant entity fields (under body.defendant or body.<entityKey>) ---
    address_line_1: { key: 'address_line_1' },
    birth_date: { key: 'birth_date' },
    exact_match_forenames: { key: 'exact_match_forenames' },
    organisation_name: { key: 'organisation_name' },
    exact_match_surname: { key: 'exact_match_surname' },
    include_aliases: { key: 'include_aliases' },
    national_insurance_number: { key: 'national_insurance_number' },
    exact_match_organisation_name: { key: 'exact_match_organisation_name' },
    surname: { key: 'surname' },
    forenames: { key: 'forenames' },
    postcode: { key: 'postcode' },

    // --- top-level flags ---
    active_accounts_only: { key: 'active_accounts_only', topLevel: true },
    business_unit_ids: { key: 'business_unit_ids', topLevel: true },

    // --- reference_number.* container ---
    account_number: {
      key: 'account_number',
      containerKey: 'reference_number',
    },
    organisation: {
      key: 'organisation',
      containerKey: 'reference_number',
    },
    prosecutor_case_reference: {
      key: 'prosecutor_case_reference',
      containerKey: 'reference_number',
    },

    // --- scenario-level top-level field ---
    defendant: { key: 'defendant', topLevel: true },
  },

  'minor creditor': {
    // --- top-level ---
    active_accounts_only: { key: 'active_accounts_only', topLevel: true },
    account_number: { key: 'account_number', topLevel: true },
    business_unit_ids: { key: 'business_unit_ids', topLevel: true },
    creditor: { key: 'creditor', topLevel: true },

    // --- creditor entity fields (nested under body.creditor) ---
    organisation: { key: 'organisation' },
    organisation_name: { key: 'organisation_name' },
    exact_match_organisation_name: { key: 'exact_match_organisation_name' },
    surname: { key: 'surname' },
    forenames: { key: 'forenames' },
    exact_match_forenames: { key: 'exact_match_forenames' },
    exact_match_surname: { key: 'exact_match_surname' },
    address_line_1: { key: 'address_line_1' },
    postcode: { key: 'postcode' },
  },
};

// Maps human-readable Gherkin keys to API field names for defendant search.
export const DEFENDANT_GHERKIN_TO_API_KEY: Record<string, string> = {
  // COMPANY SEARCH MAPPINGS
  companyNameExact: 'exact_match_organisation_name',
  includeAliases: 'include_aliases',
  addressLine1: 'address_line_1',
  postcode: 'postcode',

  // INDIVIDUAL SEARCH MAPPINGS
  lastName: 'surname',
  lastNameExact: 'exact_match_surname',
  firstNames: 'forenames',
  firstNamesExact: 'exact_match_forenames',
  dateOfBirth: 'birth_date',
  nationalInsuranceNumber: 'national_insurance_number',
};

// Resolves the Cypress alias + entity key based on account type.
export const resolveAliasAndEntityKey = (type: string): { alias: string; entityKey: string } => {
  if (type === 'defendant') {
    return {
      alias: '@getDefendantAccounts',
      entityKey: 'defendant',
    };
  }

  return {
    alias: '@getMinorCreditorAccounts',
    entityKey: 'creditor',
  };
};

// Chooses where to read a field from: top-level body, nested container, or entity.
export const resolveContainer = (
  body: Record<string, unknown>,
  entity: Record<string, unknown>,
  mapping: AccountSearchFieldMapping,
): Record<string, unknown> => {
  if (mapping.topLevel) {
    return body;
  }

  if (mapping.containerKey) {
    const container = body[mapping.containerKey] as Record<string, unknown> | undefined;
    return container ?? {};
  }

  return entity;
};

// Translates the Gherkin key into the API key via alias mapping.
export const translateGherkinKey = (type: string, gherkinKey: string): string => {
  if (type === 'defendant') {
    return DEFENDANT_GHERKIN_TO_API_KEY[gherkinKey] ?? gherkinKey;
  }
  return gherkinKey;
};

// Performs the actual assertion logic with special cases (null, arrays, dates).
export const assertParamValue = (
  gherkinKey: string,
  mapping: AccountSearchFieldMapping,
  container: Record<string, unknown>,
  expectedRaw: string,
  context: { type: string; alias: string },
): void => {
  const actualValue = container[mapping.key];
  const expectedValue = expectedRaw === 'null' ? null : expectedRaw;

  const label = `[AccountSearch] ${context.type} (${context.alias}) field "${gherkinKey}" [apiKey="${mapping.key}"]`;

  if (expectedValue === null) {
    expect(actualValue ?? null, `${label} – expected null`).to.be.null;
    return;
  }

  if (Array.isArray(actualValue)) {
    let parsedExpected: unknown;
    try {
      parsedExpected = JSON.parse(expectedRaw);
    } catch (error) {
      throw new Error(`Failed to parse JSON array for "${gherkinKey}": "${expectedRaw}". ${String(error)}`);
    }

    expect(actualValue, `${label} – array mismatch`).to.deep.equal(parsedExpected);
    return;
  }

  if (mapping.key === 'birth_date') {
    const normalizedActual = parseToIsoDate(actualValue, `${gherkinKey}/actual`);
    const normalizedExpected = parseToIsoDate(expectedValue, `${gherkinKey}/expected`);
    expect(normalizedActual, `${label} – date mismatch`).to.equal(normalizedExpected);
    return;
  }

  expect(String(actualValue), `${label} – scalar mismatch`).to.equal(String(expectedValue));
};

export class AccountSearchCommonActions {
  private readonly minorActions = new AccountSearchMinorCreditorsActions();
  private readonly commonActions = new CommonActions();

  /**
   * Assert the page header contains the expected text.
   * Keeps locator details here so flows remain locator-free.
   *
   * @param expectedHeader - expected header text (case-sensitive substring match)
   */
  public assertHeaderContains(expectedHeader: string): void {
    // Use your central locator constants here (C.root used previously).
    // If you have a dedicated header locator in a locators file, switch to that.
    cy.get(C.root, { timeout: 10_000 })
      .find('h1.govuk-heading-l')
      .should('be.visible')
      .and('contain.text', expectedHeader);
  }

  /**
   * Types into the global Account number field.
   *
   * @param value - Account number to enter (e.g. "12345678A").
   */
  public enterAccountNumber(value: string): void {
    log('input', `Entering Account number`);
    cy.get(C.accountNumberInput, { timeout: 10_000 })
      .should('be.visible')
      .clear()
      .type(value)
      .should('have.value', value);
  }

  /**
   * Types into the global Reference or case number field.
   *
   * @param value - Reference or case number to enter (e.g. "CASE-001").
   */
  public enterReferenceOrCaseNumber(value: string): void {
    log('input', `Entering Reference or case number`);
    cy.get(C.referenceOrCaseNumberInput, { timeout: 10_000 })
      .should('be.visible')
      .clear()
      .type(value)
      .should('have.value', value);
  }

  /**
   * Verifies BOTH or EITHER shared fields (account number & reference/case) in one assertion.
   * Only asserts a field if an expected value is provided.
   *
   * @param expected.accountNumber - Expected value for Account number (optional).
   * @param expected.referenceOrCaseNumber - Expected value for Reference or case number (optional).
   */
  public assertSharedFieldValues(expected: { accountNumber?: string; referenceOrCaseNumber?: string }): void {
    log('assert', 'Asserting shared field values');

    if (expected.accountNumber !== undefined) {
      cy.get(C.accountNumberInput, { timeout: 10_000 }).should('be.visible').and('have.value', expected.accountNumber);
    }

    if (expected.referenceOrCaseNumber !== undefined) {
      cy.get(C.referenceOrCaseNumberInput, { timeout: 10_000 })
        .should('be.visible')
        .and('have.value', expected.referenceOrCaseNumber);
    }
  }

  /**
   * Assert shared search result fields such as account number and reference.
   * Builds the expected values from a normalised key/value map (from Gherkin DataTable)
   * and delegates to assertSharedFieldValues.
   *
   * If only account number is present in the map, only account is asserted; reference is optional.
   *
   * @param map A normalised key/value map built from the Gherkin DataTable.
   */
  public assertSharedFields(map: Record<string, string>): void {
    const hasAccount = map['account number'] !== undefined;
    const hasReference = map['reference or case number'] !== undefined || map['reference'] !== undefined;

    if (!hasAccount && !hasReference) return;

    const expectedAccount = hasAccount ? (map['account number'] ?? '') : undefined;
    const expectedReference = hasReference ? (map['reference or case number'] ?? map['reference'] ?? '') : undefined;

    log(
      'assert',
      `Assert shared fields: account="${expectedAccount ?? '<not asserted>'}", reference="${expectedReference ?? '<not asserted>'}"`,
    );

    // delegate to the low-level assertion helper; only provided fields get asserted
    this.assertSharedFieldValues({
      accountNumber: expectedAccount,
      referenceOrCaseNumber: expectedReference,
    });
  }

  /**
   * Checks or unchecks the global "Active accounts only" checkbox.
   *
   * @param checked - true to check, false to uncheck.
   */
  public setActiveAccountsOnly(checked: boolean): void {
    cy.log(`[INPUT] Setting "Active accounts only" to ${checked ? 'checked' : 'unchecked'}`);

    cy.get(C.activeAccountsOnlyCheckbox, { timeout: 10_000 })
      .should('exist')
      .then(($el) => {
        const isChecked = $el.prop?.('checked') ?? false;

        // Click only when a state change is needed
        if (isChecked !== checked) {
          cy.wrap($el).click({ force: true });
        }
      });

    cy.get(C.activeAccountsOnlyCheckbox).should(checked ? 'be.checked' : 'not.be.checked');
  }

  /**
   * Click the Search button.
   */
  public clickSearchButton(): void {
    log('action', 'Clicking Search');

    cy.get('#submitForm', this.commonActions.getTimeoutOptions())
      .should('be.visible')
      .and('be.enabled')
      .click({ force: true });
  }

  /**
   * Submits an empty search for the given entity type and performs standard asserts.
   * Delegates to each entity's actions which are responsible for the page-specific assertions.
   *
   * @param entity - 'individual' | 'company' | 'minorCreditor'
   */
  public submitEmpty(entity: Entity): void {
    log('action', `Submitting empty search for entity: ${entity}`);
    cy.log(`flow: accountSearchEmpty -> submitting empty search for [${entity}]`);

    switch (entity) {
      case 'individual': {
        // instantiate the Individuals actions class and delegate
        const individualActions = new AccountSearchIndividualsActions();
        individualActions.submitEmptySearch();
        cy.log('flow: accountSearchEmpty -> individual submitEmptySearch completed');
        return;
      }

      case 'company': {
        const companyActions = new AccountSearchCompanyActions();
        companyActions.submitEmptySearch();
        cy.log('flow: accountSearchEmpty -> company submitEmptySearch completed');
        return;
      }

      case 'minorCreditor': {
        if (typeof this.minorActions.submitEmptySearch === 'function') {
          this.minorActions.submitEmptySearch();
          cy.log('flow: accountSearchEmpty -> minorCreditor submitEmptySearch completed');
          return;
        }
      }
    }
  }
  /**
   * Asserts the common Account Search defaults:
   * - Account number is blank
   * - Reference or case number is blank
   * - Active accounts only is checked
   */
  public assertCommonDefaultFieldValues(): void {
    log('assert', 'Asserting common Account Search default field values');

    cy.get(C.accountNumberInput, { timeout: 10_000 }).should('exist').and('have.value', '');

    cy.get(C.referenceOrCaseNumberInput, { timeout: 10_000 }).should('exist').and('have.value', '');

    cy.get(C.activeAccountsOnlyCheckbox, { timeout: 10_000 }).should('exist').and('be.checked');

    log('done', 'Common default field values asserted');
  }

  /**
   * Escape a string for literal RegExp matching.
   */
  private escapeForRegex(value: string): string {
    const rawClass = String.raw`[.*+?^\${}()|[\]\\]`;
    const specialChars = new RegExp(rawClass, 'g');
    const replacement = String.raw`\$&`;
    return value.replaceAll(specialChars, replacement);
  }

  /**
   * Assert validation text appears in either the GOV.UK error summary or on the page.
   */
  public assertValidationMessageContains(expectedText: string): void {
    log('assert', `Asserting validation message contains: "${expectedText}"`);

    const escaped = this.escapeForRegex(expectedText);
    const re = new RegExp(escaped, 'i');

    cy.get('body', this.commonActions.getTimeoutOptions()).then(($body) => {
      const hasSummary = $body.find('.govuk-error-summary').length > 0;

      if (hasSummary) {
        cy.get('.govuk-error-summary', this.commonActions.getTimeoutOptions())
          .should('be.visible')
          .invoke('text')
          .then((summaryText) => {
            if (!re.test(summaryText)) {
              cy.wrap(summaryText).should('contain', expectedText);
            }
          });

        log('assert', 'Found and verified the message in the error summary');
        return;
      }

      cy.contains(re, this.commonActions.getTimeoutOptions()).should('be.visible');
      log('assert', 'Found and verified the message on the page (fallback)');
    });
  }

  /**
   * Sets up Cypress network intercepts for account search API calls.
   *
   * Behaviour:
   * - For "reference" and "account number":
   *   - Configures live intercepts for both defendant and minor creditor search
   *     endpoints without stubbing the response.
   *   - Logs each intercepted request and response using the shared `log` helper
   *   - Aliases:
   *     - `@getDefendantAccounts` for defendant search
   *     - `@getMinorCreditorAccounts` for minor creditor search
   *
   * - For "defendant" and "minor creditor":
   *   - Configures a POST intercept for the relevant endpoint that returns
   *     a canned response body.
   *   - Logs that the intercept has been configured using the "prepare" scope.
   *   - Aliases:
   *     - `@getDefendantAccounts` for defendant accounts
   *     - `@getMinorCreditorAccounts` for minor creditor accounts
   *
   * These aliases are later consumed by `interceptedSearchAccountAPIContains`
   * to wait on and assert the outgoing request payload.
   *
   * @param accountType -
   *   The account type being searched on. Expected values:
   *   - "reference"
   *   - "account number"
   *   - "defendant"
   *   - "minor creditor"
   *
   * @throws Error
   *   If an unknown `accountType` is provided.
   */
  public interceptAccountSearch(accountType: string): void {
    let urlPattern: string;
    let aliasName: string;
    let mockResponse: Record<string, unknown> = {};

    switch (accountType) {
      case 'reference':
      case 'account number': {
        let defCount = 0;

        cy.intercept('POST', '**/opal-fines-service/defendant-accounts/search', (req) => {
          req.reply((res) => {
            defCount += 1;

            logSync('debug', `Captured defendant account search (#${defCount})`, {
              status: res.statusCode,
              request: req.body,
              response: res.body,
            });
          });
        }).as('getDefendantAccounts');

        cy.intercept('POST', '**/opal-fines-service/minor-creditor-accounts/search', (req) => {
          req.reply((res) => {
            logSync('debug', 'Captured minor creditor account search', {
              status: res.statusCode,
              request: req.body,
              response: res.body,
            });
          });
        }).as('getMinorCreditorAccounts');

        return;
      }

      case 'defendant':
        urlPattern = '**/opal-fines-service/defendant-accounts/search';
        aliasName = 'getDefendantAccounts';
        mockResponse = {};
        break;

      case 'minor creditor':
        urlPattern = '**/opal-fines-service/minor-creditor-accounts/search';
        aliasName = 'getMinorCreditorAccounts';
        mockResponse = { minorCreditorType: null };
        break;

      default:
        throw new Error(`Unknown account type: ${accountType}`);
    }

    // This is outside of a callback → can use full log()
    log('prepare', `Setting up intercept for ${accountType} account search`, {
      alias: aliasName,
      urlPattern,
    });

    cy.intercept('POST', urlPattern, (req) => {
      req.reply({
        statusCode: 200,
        body: mockResponse,
      });
    }).as(aliasName);
  }

  /**
   * Validates the parameters sent in an intercepted account search API request
   * against the expected values provided in a Gherkin data table.
   *
   * Behaviour:
   * - Resolves the appropriate mapping definition from `ACCOUNT_SEARCH_MAPPINGS`
   *   based on the `accountType`, and derives:
   *   - The Cypress alias to wait on:
   *     - `@getDefendantAccounts` for "defendant"
   *     - `@getMinorCreditorAccounts` for "minor creditor"
   *   - The root property of the entity within the request body:
   *     - "defendant" or "creditor"
   *
   * - Waits for the configured alias, then:
   *   - Logs the validation step using the shared `log` helper under
   *     the "verify" scope.
   *
   * - For each row in the data table:
   *   - Uses the table key (column 1) to look up the corresponding
   *     request property (and level) via `ACCOUNT_SEARCH_MAPPINGS`.
   *   - Reads the actual value from either:
   *     - The top-level request body (when `topLevel: true`), or
   *     - The nested entity object (e.g. `body.defendant`, `body.creditor`).
   *
   *   - Comparison rules:
   *     - If the expected value is the string `"null"`, the assertion expects
   *       the actual value to be `null` (or `undefined`, normalised).
   *     - If the actual value is an array, the expected value is parsed as JSON
   *       and compared using deep equality.
   *     - Otherwise, both actual and expected values are stringified and compared
   *       using simple equality.
   *
   * This allows scenarios to describe expected API parameters in a readable way,
   * without binding directly to low-level request field names or structure.
   *
   * @param accountType -
   *   The account type whose request should be validated, matching the
   *   Gherkin step argument. Expected values:
   *   - "defendant"
   *   - "minor creditor"
   *
   * @param table -
   *   The Cucumber `DataTable` containing expected parameters. Column 1 is the
   *   logical parameter name (e.g. "accountNumber", "businessUnitIds"), which
   *   must exist as a key in `ACCOUNT_SEARCH_MAPPINGS[accountType]`. Column 2
   *   is the expected value as a string.
   *
   * @throws Error
   *   - If `accountType` is not supported by `ACCOUNT_SEARCH_MAPPINGS`.
   *   - If any table key does not have a corresponding mapping entry.
   *   - If an expected array value cannot be parsed as valid JSON.
   */
  /**
   * Validates the parameters sent in an intercepted account search API request
   * against the expected values provided in a Gherkin data table.
   *
   * See detailed behaviour description in the original JSDoc.
   */
  public interceptedSearchAccountAPIContains(accountType: string, table: DataTable): void {
    const expectedParams: Record<string, string> = table.rowsHash();
    const type = accountType.toLowerCase();

    const mappings = ACCOUNT_SEARCH_MAPPINGS[type];
    if (!mappings) {
      throw new Error(`Unknown account type in validation: ${accountType}`);
    }

    const { alias, entityKey } = resolveAliasAndEntityKey(type);

    cy.wait(alias).then((interception) => {
      const body = interception.request.body as Record<string, unknown>;
      const entity = (body[entityKey] as Record<string, unknown>) ?? {};

      // Always visible — even on test failure
      logSync('debug', `RAW DEFENDANT REQUEST BODY: ${JSON.stringify(body, null, 2)}`);

      // Expandable structured debugging
      logSync('debug', 'Defendant API request body captured', {
        requestBody: body,
        entityKey,
        entity,
      });

      // Also visible in browser DevTools
      console.log('RAW DEFENDANT REQUEST BODY:', body);

      for (const [gherkinKey, expectedRaw] of Object.entries(expectedParams)) {
        const translatedKey = translateGherkinKey(type, gherkinKey);
        const mapping = mappings[translatedKey];

        if (!mapping) {
          throw new Error(`No mapping found for feature key: ${gherkinKey} (translated: ${translatedKey})`);
        }

        const container = resolveContainer(body, entity, mapping);
        assertParamValue(gherkinKey, mapping, container, expectedRaw, {
          type,
          alias,
        });
      }
    });
  }

  /**
   * Opens the "Filter by business unit" page by clicking the
   * "Change" link in the Account details summary list.
   */
  public openBusinessUnitFilter(): void {
    log('navigate', 'Opening "Filter by business unit" change link from Account Search');

    cy.get(C.businessUnitFilterChangeLink, this.commonActions.getTimeoutOptions())
      .should('be.visible')
      .and('contain.text', 'Change')
      .click();
  }
}
