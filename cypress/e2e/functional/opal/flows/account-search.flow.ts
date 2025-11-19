// e2e/functional/opal/flows/account-search.flow.ts

import { log } from '../../../../support/utils/log.helper';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { DashboardActions } from '../actions/dashboard.actions';
import { AccountSearchNavActions } from '../actions/search/search.nav.actions';
import { AccountSearchIndividualsActions } from '../actions/search/search.individuals.actions';
import { AccountSearchCompanyActions } from '../actions/search/search.companies.actions';
import { AccountSearchMinorCreditorsActions } from '../actions/search/search.minor-creditors.actions';
import { AccountSearchCommonActions } from '../actions/search/search.common.actions';

type MinorCreditorType = 'Individual' | 'Company';
type InputMap = Record<string, string>;

/**
 * AccountSearchFlow
 *
 * Encapsulates interactions for Account Search flows (Individuals, Companies, Minor creditors).
 * - Uses action classes (already present in repo) for UI interactions.
 * - Single public API for table-driven search: searchUsingInputs(table)
 * - All logging uses shared `log()` helper for consistent output.
 */
export class AccountSearchFlow {
  private readonly dashboard = new DashboardActions();
  private readonly nav = new AccountSearchNavActions();
  private readonly individuals = new AccountSearchIndividualsActions();
  private readonly companies = new AccountSearchCompanyActions();
  private readonly minors = new AccountSearchMinorCreditorsActions();
  private readonly common = new AccountSearchCommonActions();

  /**
   * Normalises a header key (lowercase + trimmed).
   */
  private normalize(s: string): string {
    return s.trim().toLowerCase();
  }

  /**
   * Navigate from dashboard and verify the Individuals form is active by default.
   */
  public navigateAndVerifySearchFromDashboard(): void {
    log('navigate', 'Go to Account Search from dashboard');
    this.dashboard.goToAccountSearch();

    log('assert', 'Verify Individuals form is active by default');
    this.individuals.assertDefaultIndividualsActive();
  }

  /**
   * Switch to Companies form/tab.
   */
  public viewCompaniesForm(): void {
    log('navigate', 'Switching to Companies tab');
    this.nav.goToCompaniesTab();
    this.companies.assertOnSearchPage();
  }

  /**
   * Assert Individuals defaults (common + page-specific).
   */
  public assertIndividualsDefaults(): void {
    log('assert', 'Asserting Individuals defaults (common + page-specific)');
    this.common.assertCommonDefaultFieldValues();
    this.individuals.assertDefaults();
  }

  /**
   * Switch to Minor creditors form/tab.
   */
  public viewMinorCreditorsForm(): void {
    log('navigate', 'Switching to Minor creditors tab');
    this.nav.goToMinorCreditorsTab();
    this.minors.assertOnSearchPage();
    this.minors.assertTypeControlsNotSelected();
  }

  /**
   * Verify default empty state for Companies form.
   */
  public assertCompaniesDefaults(): void {
    log('assert', 'Asserting Companies defaults (common + page-specific)');
    this.common.assertCommonDefaultFieldValues();
    this.companies.assertDefaults();
  }

  /**
   * Switch away from Individuals and back, to test reset behaviour.
   */
  public switchAwayAndBackToIndividuals(): void {
    log('navigate', 'Switch away from Individuals, then back');
    this.nav.goToCompaniesTab();
    this.nav.goToIndividualsTab();
    this.individuals.assertOnSearchPage();
  }

  /**
   * Prepare Companies form with sample values (for stateful switching tests).
   */
  public prepareCompaniesSample(): void {
    log('prepare', 'Companies form sample values');
    this.viewCompaniesForm();
    this.companies.prepareSample();
  }

  /**
   * Switch away from Companies and back, to test reset behaviour.
   */
  public switchAwayAndBackToCompanies(): void {
    log('navigate', 'Switch away from Companies, then back');
    this.nav.goToIndividualsTab();
    this.nav.goToCompaniesTab();
    this.companies.assertOnSearchPage();
  }

  /**
   * Prepare Minor creditors form with sample values by type.
   */
  public prepareMinorCreditorsSample(type: MinorCreditorType): void {
    log('prepare', `Minor creditors form sample values for ${type}`);
    this.viewMinorCreditorsForm();
    this.minors.prepareSample(type);
  }

  /**
   * Switch away from Minor creditors and back, to test reset behaviour.
   */
  public switchAwayAndBackToMinorCreditors(): void {
    log('navigate', 'Switch away from Minor creditors, then back');
    this.nav.goToIndividualsTab();
    this.nav.goToMinorCreditorsTab();
    this.minors.assertOnSearchPage();
  }

  /**
   * Assert Minor creditors form was cleared to defaults.
   */
  public assertMinorCreditorsCleared(): void {
    log('assert', 'Minor creditors form cleared to defaults');
    this.minors.assertCleared();
  }

  /**
   * Assert cross-section validation message appears.
   */
  public assertCrossSectionValidationMessage(): void {
    log('assert', 'Cross-section validation message');
    this.individuals.assertCrossSectionValidationMessage(); // colocate here; message is shared pattern
  }

  /**
   * Assert the GOV.UK error page “There is a problem” is shown with an appropriate message.
   */
  public assertProblemPageDisplayed(): void {
    log('assert', 'Problem page is displayed');
    this.individuals.assertProblemPage(); // reuse Individuals assertions (shared pattern)
  }

  /**
   * Build a field->value map from a Cucumber DataTable.
   *
   * Expects a simple two-column table where each row is [field, value].
   * Example:
   *   | account number           | 12345678 |
   *   | reference or case number | REF-123  |
   *
   * Throws a descriptive Error if the table shape is not two columns.
   */
  private buildInputMap(table: DataTable): InputMap {
    const norm = (s?: string) => String(s ?? '').trim();
    const rows = table.rows();

    if (!rows || rows.length === 0) {
      throw new Error('buildInputMap: expected a non-empty two-column DataTable (field | value).');
    }

    const map: InputMap = {};

    for (const [idx, row] of rows.entries()) {
      if (!row || row.length < 2) {
        throw new Error(
          `buildInputMap: expected row ${idx + 1} to have 2 columns (field | value). ` +
            `Found ${Array.isArray(row) ? row.length : typeof row}. ` +
            `Use the per-line shape: | field | value |`,
        );
      }

      const rawKey = row[0];
      const rawValue = row[1];

      // Use your existing normaliser so keys remain consistent across the codebase
      const key = this.normalize(rawKey);
      map[key] = norm(rawValue);
    }

    return map;
  }

  /**
   * Enter account number and reference/case if provided.
   * These are global fields present on all tabs.
   */
  private enterAccountAndReference(map: InputMap): void {
    if (map['account number']) {
      log('input', `Enter account number: ${map['account number']}`);
      this.common.enterAccountNumber(map['account number']);
    }

    const ref = map['reference or case number'] || map['reference'];
    if (ref) {
      log('input', `Enter reference/case number: ${ref}`);
      this.common.enterReferenceOrCaseNumber(ref);
    }
  }

  /**
   * Handle Minor creditors inputs (does NOT submit).
   *
   * - Chooses the creditor type when provided.
   * - Sets company / first names / last name when provided.
   */
  private handleMinorCreditors(map: InputMap): void {
    log('navigate', 'Switch to Minor creditors tab');
    this.nav.goToMinorCreditorsTab();

    const creditorType = map['minor creditor type'] as MinorCreditorType | undefined;
    if (creditorType) {
      log('input', `Choose minor creditor type: ${creditorType}`);
      this.minors.chooseType(creditorType);
    }

    if (map['company name']) {
      log('input', `Enter minor creditor company name: ${map['company name']}`);
      this.minors.setCompanyName(map['company name']);
    }

    if (map['first names']) {
      log('input', `Enter minor creditor first names: ${map['first names']}`);
      this.minors.setFirstNames(map['first names']);
    }

    if (map['individual last name']) {
      log('input', `Enter minor creditor last name: ${map['individual last name']}`);
      this.minors.setLastName(map['individual last name']);
    }
  }

  /**
   * Handle Companies & Individuals inputs (does NOT submit).
   *
   * - If company name present: switch to Companies tab and enter it.
   * - If individual fields present: switch to Individuals tab and enter them.
   */
  private handleCompaniesAndIndividuals(map: InputMap): void {
    if (map['company name']) {
      log('navigate', 'Switch to Companies tab');
      this.nav.goToCompaniesTab();

      log('input', `Enter company name: ${map['company name']}`);
      this.companies.enterCompanyName(map['company name']);
    }

    const hasIndividualData = Boolean(map['individual last name'] || map['first names']);
    if (hasIndividualData) {
      log('navigate', 'Switch to Individuals tab');
      this.nav.goToIndividualsTab();

      if (map['first names']) {
        log('input', `Enter individual first names: ${map['first names']}`);
        this.individuals.setFirstNames(map['first names']);
      }

      if (map['individual last name']) {
        log('input', `Enter individual last name: ${map['individual last name']}`);
        this.individuals.setLastName(map['individual last name']);
      }
    }
  }

  /**
   * Public API used by the step definition:
   *   searchFlow().searchUsingInputs(table)
   *
   * Parses a simple two-column DataTable (one field per line), performs the appropriate
   * tab interactions, then submits the search. Always performs a single final submit.
   *
   * Expected DataTable shape (required):
   *   | field                    | value     |
   *   | account number           | 12345678  |
   *   | reference or case number | REF-123   |
   *   | individual last name     | Smith     |
   *
   * This intentionally does NOT support wide-form tables (header + single value row).
   * Throwing early on the wrong shape keeps tests explicit and prevents key/value swaps.
   */
  public searchUsingInputs(table: DataTable): void {
    const map = this.buildInputMap(table);

    log('prepare', `Parsed search input fields: ${JSON.stringify(map)}`);

    // 1) Enter shared fields
    this.enterAccountAndReference(map);

    // 2) Route based on presence of "minor creditor type"
    if (map['minor creditor type'] || map['minor creditor']) {
      this.handleMinorCreditors(map);
    } else {
      this.handleCompaniesAndIndividuals(map);
    }

    // 3) Single final submit
    log('action', 'Submit search');
    this.common.submitSearch();
  }
  /**
   * Verify the Individuals page fields based on a field→value map.
   *
   * @param expectedHeader The expected page header text.
   * @param map A normalised map of field → expected value (lowercase keys).
   */
  public verifyPageForIndividuals(expectedHeader: string, map: Record<string, string>): void {
    // Header first
    this.common.assertHeaderContains(expectedHeader);

    // Shared global fields (account number / reference)
    this.common.assertSharedFields(map);

    // Individual-specific assertions
    this.individuals.assertIndividualFields(map);
  }

  /**
   * Verify the Companies page fields based on a field→value map.
   *
   * @param expectedHeader The expected page header text.
   * @param map A normalised map of field → expected value (lowercase keys).
   */
  public verifyPageForCompanies(expectedHeader: string, map: Record<string, string>): void {
    // Header first
    this.common.assertHeaderContains(expectedHeader);

    // Shared global fields
    this.common.assertSharedFields(map);

    // Companies-only assertions
    this.companies.assertCompanyFields(map);
  }

  /**
   * Verify the Minor Creditors **Individual** variant fields.
   *
   * Only the individual-specific subset of keys is passed into the minors actions.
   *
   * @param expectedHeader The expected page header text.
   * @param map A normalised map of field → expected value (lowercase keys).
   */
  public verifyPageForMinorIndividual(expectedHeader: string, map: Record<string, string>): void {
    this.common.assertHeaderContains(expectedHeader);

    // Shared fields (account number + reference)
    this.common.assertSharedFields(map);

    // Extract only individual-relevant Minor Creditor keys
    const individualKeys = new Set([
      'first names',
      'individual last name',
      'address line 1',
      'postcode',
      'dob',
      'ni number',
      'minor creditor type', // always include if present
    ]);

    const sub: Record<string, string> = {};
    for (const [k, v] of Object.entries(map)) {
      if (individualKeys.has(k)) sub[k] = v;
    }

    // Call the canonical minors assertion
    if (typeof (this.minors as any).assertAllFieldValuesFromMap === 'function') {
      (this.minors as any).assertAllFieldValuesFromMap(sub);
    } else {
      (this.minors as any).assertAllFieldValues(sub); // fallback
    }
  }

  /**
   * Verify the Minor Creditors **Company** variant fields.
   *
   * Only the company-specific subset of keys is passed to minors.
   *
   * @param expectedHeader The expected page header text.
   * @param map A normalised map of field → expected value (lowercase keys).
   */
  public verifyPageForMinorCompany(expectedHeader: string, map: Record<string, string>): void {
    this.common.assertHeaderContains(expectedHeader);

    // Shared fields (account number + reference)
    this.common.assertSharedFields(map);

    // Extract company-specific Minor Creditor keys
    const companyKeys = new Set([
      'company name',
      'address line 1',
      'postcode',
      'minor creditor type', // always include if present
    ]);

    const sub: Record<string, string> = {};
    for (const [k, v] of Object.entries(map)) {
      if (companyKeys.has(k)) sub[k] = v;
    }

    // Call canonical minors method
    if (typeof (this.minors as any).assertAllFieldValuesFromMap === 'function') {
      (this.minors as any).assertAllFieldValuesFromMap(sub);
    } else {
      (this.minors as any).assertAllFieldValues(sub);
    }
  }
}
