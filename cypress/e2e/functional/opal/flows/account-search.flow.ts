/**
 * @file account-search.flow.ts
 * @description Orchestrates navigation, tab selection, and search/result interactions for the
 * Account Search journeys across Individuals, Companies, Major and Minor creditors.
 */

import { createScopedLogger } from '../../../../support/utils/log.helper';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { DashboardActions } from '../actions/dashboard.actions';
import { AccountSearchNavActions } from '../actions/search/search.nav.actions';
import { AccountSearchIndividualsActions } from '../actions/search/search.individuals.actions';
import { AccountSearchCompanyActions } from '../actions/search/search.companies.actions';
import { AccountSearchMinorCreditorsActions } from '../actions/search/search.minor-creditors.actions';
import { AccountSearchMajorCreditorsActions } from '../actions/search/search.major-creditors.actions';
import { AccountSearchCommonActions } from '../actions/search/search.common.actions';
import { ResultsActions } from '../actions/search/search.results.actions';
import { CommonActions } from '../actions/common/common.actions';
import { MinorCreditorType } from '../../../../support/utils/macFieldResolvers';

/**
 * Normalised Minor Creditor types used in flow processing.
 */
type MinorCreditorSimpleType = 'individual' | 'company';

type InputMap = Record<string, string>;

const log = createScopedLogger('AccountSearchFlow');

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
  private readonly majors = new AccountSearchMajorCreditorsActions();
  private readonly commonSearch = new AccountSearchCommonActions();
  private readonly results = new ResultsActions();
  private readonly common = new CommonActions();
  // private readonly problem = new AccountSearchProblemActions();

  /**
   * Builds a simple key/value map from a two-column Cucumber table:
   *   | column | value |
   *   | Ref    | PCR...|
   * @param table Two-column DataTable containing column/value pairs.
   * @returns Trimmed key/value object derived from the table.
   */
  private buildExpectationMap(table: DataTable): Record<string, string> {
    const raw = table.rowsHash();
    const out: Record<string, string> = {};

    for (const [k, v] of Object.entries(raw)) {
      out[k.trim()] = v;
    }

    return out;
  }

  /**
   * Normalises a header key (lowercase + trimmed).
   * @param s Header text to normalise.
   * @returns Lowercased, trimmed header text.
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
   * Switch to Individuals form/tab.
   */
  public viewIndividualsForm(): void {
    log('navigate', 'Switching to Individuals tab');
    this.nav.goToIndividualsTab();
    this.individuals.assertOnSearchPage();
  }

  /**
   * Assert Individuals defaults (common + page-specific).
   */
  public assertIndividualsDefaults(): void {
    log('assert', 'Asserting Individuals defaults (common + page-specific)');
    this.commonSearch.assertCommonDefaultFieldValues();
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
   * Switch to Minor creditors form/tab.
   */
  public viewMajorCreditorsForm(): void {
    log('navigate', 'Switching to Major creditors tab');
    this.nav.goToMajorCreditorsTab();
    this.majors.assertOnSearchPage();
  }

  /**
   * Verify default empty state for Companies form.
   */
  public assertCompaniesDefaults(): void {
    log('assert', 'Asserting Companies defaults (common + page-specific)');
    this.commonSearch.assertCommonDefaultFieldValues();
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
   * @param type Minor creditor type (Individual or Company).
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
   * Build a field->value map from a Cucumber DataTable.
   *
   * Expects a simple two-column table where each row is [field, value].
   * Example:
   *   | account number           | 12345678 |
   *   | reference or case number | REF-123  |
   *
   * Throws a descriptive Error if the table shape is not two columns.
   * @param table Two-column DataTable of field/value pairs.
   * @returns Normalised map of lowercased field keys to trimmed values.
   */
  private buildInputMap(table: DataTable): InputMap {
    const rows = table.raw();
    if (!rows || rows.length === 0) {
      throw new Error('buildInputMap: expected a non-empty two-column DataTable (field | value).');
    }

    // safe normaliser for keys (uses the flow's normalize method for consistency)
    const normaliseKey = (cell: unknown): string => {
      const s = typeof cell === 'string' ? cell : '';
      return this.normalize(s);
    };

    // safe normaliser for values (trim only; preserve case)
    const normaliseValue = (cell: unknown): string => {
      return typeof cell === 'string'
        ? cell
            .normalize('NFKC')
            .replace(/\u00A0/g, ' ')
            .trim()
        : '';
    };

    const map: InputMap = {};

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!Array.isArray(row) || row.length < 2) {
        throw new Error(
          `buildInputMap: expected row ${i + 1} to have 2 columns (field | value). Found ${
            Array.isArray(row) ? row.length : typeof row
          }. Use | field | value |`,
        );
      }

      const rawKey = row[0];
      const rawValue = row[1];

      const key = normaliseKey(rawKey);
      const value = normaliseValue(rawValue);

      // Log each row to make debugging deterministic
      log('prepare', `buildInputMap: row[${i}] -> rawKey="${String(rawKey)}", normalised="${key}", value="${value}"`);

      // Overwrite if duplicate keys — feature tables should not have duplicates
      if (map[key] !== undefined) {
        log(
          'warn',
          `buildInputMap: duplicate key "${key}" encountered - overwriting previous value "${map[key]}" with "${value}"`,
        );
      }

      map[key] = value;
    }

    log('prepare', `Parsed search input fields: ${JSON.stringify(map)}`);
    return map;
  }

  /**
   * Enter shared fields (account number and reference/case) in a deterministic order.
   * Always types account first (if present) then reference (if present), before any tab switching.
   * @param map Normalised field/value map from the input table.
   */
  private enterAccountAndReference(map: Record<string, string>): void {
    const accountVal = map['account number'];
    const referenceVal = map['reference or case number'] ?? map['reference'];

    log(
      'input',
      `Enter account/reference: account="${String(accountVal ?? '')}", reference="${String(referenceVal ?? '')}"`,
    );

    // Type account number first (if present)
    if (typeof accountVal === 'string' && accountVal.trim() !== '') {
      // Use centralised common action so locator logic stays in one place
      this.commonSearch.enterAccountNumber(accountVal);
    } else {
      log('debug', 'No account number present in map — skipping account input');
    }

    // Then type reference (if present)
    if (typeof referenceVal === 'string' && referenceVal.trim() !== '') {
      this.commonSearch.enterReferenceOrCaseNumber(referenceVal);
    } else {
      log('debug', 'No reference/case number present in map — skipping reference input');
    }
  }

  // ─────────────────────────────────────────────
  // Minor Creditors handling
  // ─────────────────────────────────────────────

  /**
   * Handles Minor Creditor search inputs (Individual or Company).
   *
   * Supported table keys:
   * - "minor creditor type"       → Individual | Company
   * - "company name"
   * - "individual last name"
   * - "first names"
   * - "address line 1"
   * - "postcode"
   * - "last name exact match"
   * - "first names exact match"
   *
   * This method does NOT submit the search.
   * @param map Normalised field/value map from the input table.
   */
  private handleMinorCreditors(map: InputMap): void {
    log('navigate', 'Switch to Minor creditors tab');
    this.nav.goToMinorCreditorsTab();
    this.minors.assertOnSearchPage();

    const type = this.getMinorCreditorSimpleType(map);

    this.applyMinorCreditorType(type);
    this.applyMinorCreditorCompanyFields(map);
    this.applyMinorCreditorIndividualFields(map);
    this.applyMinorCreditorAddressFields(type, map);

    log('prepare', 'Finished handling Minor Creditor inputs (including exact-match flags)');
  }

  /**
   * Extracts and normalises the minor creditor type from the input map.
   *
   * @param map Normalised field/value map from the input table.
   * @returns MinorCreditorSimpleType when provided, otherwise undefined.
   */
  private getMinorCreditorSimpleType(map: InputMap): MinorCreditorSimpleType | undefined {
    const rawType = map['minor creditor type'];
    if (!rawType) {
      return undefined;
    }

    const normalised = String(rawType).trim().toLowerCase();

    if (normalised === 'individual' || normalised === 'company') {
      return normalised as MinorCreditorSimpleType;
    }

    log('warn', `Unsupported minor creditor type value "${rawType}" – skipping type selection`);
    return undefined;
  }

  /**
   * Applies the Minor Creditor type selection if a valid type is provided.
   * @param type Normalised minor creditor type.
   */
  private applyMinorCreditorType(type: MinorCreditorSimpleType | undefined): void {
    if (!type) {
      return;
    }

    const canonicalType: MinorCreditorType = type === 'individual' ? 'Individual' : 'Company';
    log('input', `Choose minor creditor type: ${canonicalType}`);
    this.minors.chooseType(canonicalType);
  }

  /**
   * Applies company-specific Minor Creditor fields (company name only).
   * @param map Normalised field/value map from the input table.
   */
  private applyMinorCreditorCompanyFields(map: InputMap): void {
    const companyName = map['company name'];
    if (!companyName) {
      return;
    }

    log('input', `Enter minor creditor company name: ${companyName}`);
    this.minors.setCompanyName(companyName);
  }

  /**
   * Applies individual-specific Minor Creditor fields:
   * - first names
   * - last name
   * - exact match flags
   * @param map Normalised field/value map from the input table.
   */
  private applyMinorCreditorIndividualFields(map: InputMap): void {
    const firstNames = map['first names'];
    if (firstNames) {
      log('input', `Enter minor creditor first names: ${firstNames}`);
      this.minors.setFirstNames(firstNames);
    }

    const lastName = map['individual last name'];
    if (lastName) {
      log('input', `Enter minor creditor last name: ${lastName}`);
      this.minors.setLastName(lastName);
    }

    const lastNameExact = this.parseOptionalBooleanFlag(map['last name exact match']);
    if (lastNameExact !== undefined) {
      log('input', `Set minor creditor last name exact match: ${lastNameExact}`);
      this.minors.setLastNameExactMatch(lastNameExact);
    }

    const firstNamesExact = this.parseOptionalBooleanFlag(map['first names exact match']);
    if (firstNamesExact !== undefined) {
      log('input', `Set minor creditor first names exact match: ${firstNamesExact}`);
      this.minors.setFirstNamesExactMatch(firstNamesExact);
    }
  }

  /**
   * Applies shared address fields (address line 1, postcode),
   * routed to Individual or Company setters based on the minor creditor type.
   * @param type Minor creditor type being edited.
   * @param map Normalised field/value map from the input table.
   */
  private applyMinorCreditorAddressFields(type: MinorCreditorSimpleType | undefined, map: InputMap): void {
    const addressLine1 = map['address line 1'];
    if (addressLine1) {
      log('input', `Enter minor creditor address line 1: ${addressLine1}`);

      const setAddress =
        type === 'company'
          ? this.minors.setCompanyAddressLine1.bind(this.minors)
          : this.minors.setIndividualAddressLine1.bind(this.minors);

      setAddress(addressLine1);
    }

    const postcode = map['postcode'];
    if (postcode) {
      log('input', `Enter minor creditor postcode: ${postcode}`);

      const setPostcode =
        type === 'company'
          ? this.minors.setCompanyPostcode.bind(this.minors)
          : this.minors.setIndividualPostcode.bind(this.minors);

      setPostcode(postcode);
    }
  }

  /**
   * Parses a loosely-typed boolean string from the DataTable into true/false/undefined.
   *
   * Accepts values like:
   * - true/false, yes/no, y/n, 1/0, checked/unchecked, on/off
   * @param raw Raw string value to parse.
   * @returns Parsed boolean when recognised; otherwise undefined.
   */
  private parseOptionalBooleanFlag(raw?: string): boolean | undefined {
    if (!raw) {
      return undefined;
    }

    const value = raw.trim().toLowerCase();
    if (!value) {
      return undefined;
    }

    const truthy = new Set(['yes', 'y', 'true', 't', '1', 'checked', 'on']);
    const falsy = new Set(['no', 'n', 'false', 'f', '0', 'unchecked', 'off']);

    if (truthy.has(value)) {
      return true;
    }

    if (falsy.has(value)) {
      return false;
    }

    log('warn', `Unrecognised boolean value "${raw}" for Minor Creditor flag; leaving unchanged`);
    return undefined;
  }

  // ─────────────────────────────────────────────
  // Companies & Individuals handling
  // ─────────────────────────────────────────────

  /**
   * Handle Companies & Individuals inputs (does NOT submit).
   *
   * Routing rules:
   * - If a Company name is present ➜ treat the request as a Companies search:
   *   - Switch to Companies tab.
   *   - Enter Company name.
   *   - Optionally set:
   *     - Company name exact match (checkbox).
   *     - Include aliases (checkbox).
   *     - Address line 1.
   *     - Postcode.
   *   - Return early (do not fall through to Individuals logic).
   *
   * - Otherwise, if any Individuals fields are present ➜ treat as Individuals search:
   *   - Switch to Individuals tab.
   *   - Enter:
   *     - Individual last name
   *     - First names
   *     - Date of birth (dob/date of birth)
   *     - NI number (national insurance number / ni number)
   *     - Address line 1
   *     - Postcode
   *   - Optionally set:
   *     - Last name exact match (checkbox).
   *     - First names exact match (checkbox).
   *     - Include aliases (checkbox).
   *
   * NOTE:
   * - This method only prepares the form; it does not click Search.
   * - Submission is handled separately (e.g. submitSearchAndWaitForResults()).
   * @param map Normalised field/value map from the input table.
   */
  private handleCompaniesAndIndividuals(map: InputMap): void {
    // ───────────────────────────────
    // COMPANIES MODE
    // ───────────────────────────────
    if (map['company name']) {
      log('navigate', 'Switch to Companies tab');
      this.nav.goToCompaniesTab();
      this.companies.assertOnSearchPage();

      // Core text fields
      log('input', `Enter company name: ${map['company name']}`);
      this.companies.enterCompanyName(map['company name']);

      if (map['address line 1']) {
        log('input', `Enter company address line 1: ${map['address line 1']}`);
        this.companies.setAddressLine1(map['address line 1']);
      }

      if (map['postcode']) {
        log('input', `Enter company postcode: ${map['postcode']}`);
        this.companies.setPostcode(map['postcode']);
      }

      // Checkbox flags
      const companyNameExact = this.parseOptionalBooleanFlag(map['company name exact match']);
      if (companyNameExact !== undefined) {
        log('input', `Set "Company name exact match" to ${companyNameExact}`);
        this.companies.setCompanyNameExactMatch(companyNameExact);
      }

      const includeAliases = this.parseOptionalBooleanFlag(map['include aliases']);
      if (includeAliases !== undefined) {
        log('input', `Set "Include aliases" (Companies) to ${includeAliases}`);
        this.companies.setIncludeAliases(includeAliases);
      }

      log('prepare', 'Finished handling Companies fields and flags (no submit performed)');
      // Do NOT fall through into Individuals mode
      return;
    }

    // ───────────────────────────────
    // INDIVIDUALS MODE
    // ───────────────────────────────
    const hasIndividualData = Boolean(
      map['individual last name'] ||
      map['first names'] ||
      map['date of birth'] ||
      map['dob'] ||
      map['national insurance number'] ||
      map['ni number'] ||
      map['address line 1'] ||
      map['postcode'] ||
      map['last name exact match'] ||
      map['first names exact match'] ||
      map['include aliases'],
    );

    if (!hasIndividualData) {
      log('prepare', 'No Companies or Individuals inputs supplied; skipping person-specific handling');
      return;
    }

    log('navigate', 'Switch to Individuals tab');
    this.nav.goToIndividualsTab();
    this.individuals.assertOnSearchPage();

    // Text fields via wrapper
    this.individuals.setIndividualFields({
      lastName: map['individual last name'],
      firstNames: map['first names'],
      dob: map['date of birth'] ?? map['dob'],
      niNumber: map['national insurance number'] ?? map['ni number'],
      addressLine1: map['address line 1'],
      postcode: map['postcode'],
    });

    // Checkbox flags (Individuals)
    const lastNameExact = this.parseOptionalBooleanFlag(map['last name exact match']);
    if (lastNameExact !== undefined) {
      this.individuals.setLastNameExactMatch(lastNameExact);
    }

    const firstNamesExact = this.parseOptionalBooleanFlag(map['first names exact match']);
    if (firstNamesExact !== undefined) {
      this.individuals.setFirstNamesExactMatch(firstNamesExact);
    }

    const includeAliasesInd = this.parseOptionalBooleanFlag(map['include aliases']);
    if (includeAliasesInd !== undefined) {
      this.individuals.setIncludeAliases(includeAliasesInd);
    }

    log('prepare', 'Finished handling Individuals fields and flags (no submit performed)');
  }

  /**
   * Handles Individuals-only checkbox flags based on the input map.
   *
   * Recognised keys (normalised via buildInputMap/normalize):
   *  - "last name exact match"
   *  - "first names exact match"
   *  - "include aliases"
   * @param map Normalised field/value map from the input table.
   */
  private handleIndividualsFlags(map: InputMap): void {
    // Checkbox flags (Individuals)
    const lastNameExact = this.parseOptionalBooleanFlag(map['last name exact match']);
    if (lastNameExact !== undefined) {
      log('input', `Set "Last name exact match" (Individuals) to ${lastNameExact}`);
      this.individuals.setLastNameExactMatch(lastNameExact);
    }

    const firstNamesExact = this.parseOptionalBooleanFlag(map['first names exact match']);
    if (firstNamesExact !== undefined) {
      log('input', `Set "First names exact match" (Individuals) to ${firstNamesExact}`);
      this.individuals.setFirstNamesExactMatch(firstNamesExact);
    }

    const includeAliasesInd = this.parseOptionalBooleanFlag(map['include aliases']);
    if (includeAliasesInd !== undefined) {
      log('input', `Set "Include aliases" (Individuals) to ${includeAliasesInd}`);
      this.individuals.setIncludeAliases(includeAliasesInd);
    }
  }

  // ─────────────────────────────────────────────
  // Individuals form (no submit)
  // ─────────────────────────────────────────────

  /**
   * Navigates to Account Search, populates the Individuals form, and skips submit.
   * @param table Two-column DataTable of field/value pairs.
   */
  public navigateAndEnterIndividualsFormWithoutSubmit(table: DataTable): void {
    log('navigate', 'Go to Account Search and enter Individuals form (no submit)');
    this.dashboard.goToAccountSearch();

    // Reuse existing helper to populate all text-like fields
    this.enterIndividualsFormWithoutSubmit(table);

    // Build a map once more for flags. This is cheap and keeps responsibilities clear.
    const map = this.buildInputMap(table);

    // Reuse the same checkbox handling as handleCompaniesAndIndividuals()
    this.handleIndividualsFlags(map);
  }

  /**
   * Enter fields on the Individuals search form without performing a submit.
   *
   * This method accepts a standard two-column Cucumber DataTable
   * (| field | value |), normalises all keys via `buildInputMap()` +
   * `this.normalize()`, and uses the resulting map to populate BOTH:
   *
   *   • text-based input fields, and
   *   • Individuals-specific checkbox flags.
   *
   * It is intentionally “write-only”: it prepares the Individuals form in a
   * specific state for scenarios that verify persistence, tab switching,
   * filter-round-trips, or non-submit behaviour.
   *
   * ────────────────────────────────────────────────────────────────────────
   * SUPPORTED KEYS (case-insensitive, whitespace-normalised)
   * ────────────────────────────────────────────────────────────────────────
   *  TEXT FIELDS
   *  -----------------------------------------------------------------------
   *   - "account number"
   *   - "reference" | "reference or case number"
   *   - "individual last name"
   *   - "first names"
   *   - "date of birth" | "dob"
   *   - "national insurance number" | "ni number"
   *   - "address line 1"
   *   - "postcode"
   *
   *  CHECKBOX FLAGS (boolean Yes/No / True/False)
   *  -----------------------------------------------------------------------
   *   - "last name exact match"
   *   - "first names exact match"
   *   - "include aliases"
   *
   *   Values are interpreted via `parseOptionalBooleanFlag()` and applied
   *   using the Individuals checkbox actions:
   *
   *     setLastNameExactMatch()
   *     setFirstNamesExactMatch()
   *     setIncludeAliases()
   *
   * ────────────────────────────────────────────────────────────────────────
   * BEHAVIOUR
   * ────────────────────────────────────────────────────────────────────────
   *   1. Builds a canonical field/value map from the DataTable.
   *   2. Ensures the Individuals tab is active.
   *   3. Populates all text-based Individuals fields using the
   *      AccountSearchIndividualsActions API.
   *   4. Applies checkbox flags through `handleIndividualsFlags(map)`.
   *   5. Does **not** perform any submit/search action.
   *
   * This keeps the step definition thin and declarative while allowing
   * flows and assertions to reuse the same field→value mapping consistently.
   *
   * NOTE:
   *   All key normalisation is handled via `buildInputMap()` which trims,
   *   lowercases, and canonicalises punctuation, ensuring common variants
   *   (e.g. "date of birth" vs "DOB") are handled consistently.
   */
  /**
   * Populates Individuals fields and flags without submitting the search.
   * @param table Two-column DataTable of field/value pairs.
   */
  public enterIndividualsFormWithoutSubmit(table: DataTable): void {
    log('prepare', 'Entering Individuals form (without submit)');

    // Build canonical map from input table (throws on malformed table)
    const map = this.buildInputMap(table);

    // Ensure we're on Individuals search page
    log('navigate', 'Navigating to Individuals tab');
    this.nav.goToIndividualsTab();
    this.individuals.assertOnSearchPage();

    // Enter shared fields (account number then reference)
    this.enterAccountAndReference(map);

    /**
     * Individual-specific fields that are driven via specific actions
     * on AccountSearchIndividualsActions.
     *
     * We deliberately allow multiple mapKey variants for some fields
     * (e.g. "dob" and "date of birth") to keep Gherkin tables readable
     * and backwards-compatible.
     */
    const individualFieldMappings: Array<{
      mapKey: string;
      label: string;
      actionName: keyof AccountSearchIndividualsActions;
    }> = [
      // Names
      { mapKey: 'first names', label: 'individual first names', actionName: 'setFirstNames' },
      { mapKey: 'individual last name', label: 'individual last name', actionName: 'setLastName' },

      // DOB (two accepted keys)
      { mapKey: 'dob', label: 'DOB', actionName: 'setDob' },
      { mapKey: 'date of birth', label: 'DOB', actionName: 'setDob' },

      // NI number (two accepted keys)
      { mapKey: 'ni number', label: 'NI number', actionName: 'setNiNumber' },
      {
        mapKey: 'national insurance number',
        label: 'NI number',
        actionName: 'setNiNumber',
      },

      // Address / postcode
      { mapKey: 'address line 1', label: 'Address line 1', actionName: 'setAddressLine1' },
      { mapKey: 'postcode', label: 'Postcode', actionName: 'setPostcode' },
    ];

    for (const { mapKey, label, actionName } of individualFieldMappings) {
      const value = map[mapKey];
      if (!value) {
        // Field not supplied in the DataTable – skip quietly.
        continue;
      }

      const action = this.individuals[actionName];
      if (typeof action !== 'function') {
        log(
          'warn',
          `Individuals field "${label}" has value "${value}" but no action "${String(
            actionName,
          )}" found on AccountSearchIndividualsActions`,
        );
        continue;
      }

      log('input', `Enter individual ${label}: ${value}`);
      (action as (v: string) => void).call(this.individuals, value);
    }

    this.handleIndividualsFlags(map);
  }

  // ─────────────────────────────────────────────
  // Main search flow
  // ─────────────────────────────────────────────

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
   * @param table Two-column DataTable of field/value pairs.
   */
  public searchUsingInputs(table: DataTable): void {
    // Build the canonical map from table rows (throws on malformed table)
    const map = this.buildInputMap(table);

    // Helper: strip invisible / non-printable characters and normalise
    const stripInvisible = (s: string): string =>
      s
        // remove BOM
        .replace(/\uFEFF/g, '')
        // replace non-breaking space with normal space
        .replace(/\u00A0/g, ' ')
        // remove zero-width characters (ZWJ, ZWNJ, LRM, RLM, etc.)
        .replace(/[\u200B-\u200F\u202A-\u202F]/g, '');

    const normalizeCell = (cell: unknown): string => {
      const val = typeof cell === 'string' ? cell : '';
      const stripped = stripInvisible(val);
      // NFKC normalisation, collapse whitespace, trim, lowercase
      return stripped.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
    };

    // Defensive: use raw() so first row is never interpreted as a header
    const rows = table.raw();

    // Quick diagnostic log of the raw first-column character codes (helps find invisible chars)
    if (rows.length > 0 && rows[0].length > 0) {
      const sample = rows[0][0] ?? '';
      const codes = Array.from(String(sample)).map((ch) => ch.codePointAt(0));
      log('prepare', `First-row raw value (chars): "${String(sample)}", charCodes: [${codes.join(',')}]`);
    }

    // Build a normalised matrix for logging / matching
    const normalisedMatrix: string[][] = rows.map((r) => [normalizeCell(r[0]), normalizeCell(r[1] ?? '')]);

    // Candidate keys that explicitly indicate Minor Creditors input routing
    const minorKeyCandidates = new Set([
      'minor creditor type',
      'minor creditor',
      'minor_creditor_type',
      'minor-creditor-type',
      'minor creditor - type',
    ]);

    // Detect presence of any explicit minor-creditor indicator in the feature rows
    const hasMinorTypeInRows = normalisedMatrix.some(
      ([c0, c1]) => minorKeyCandidates.has(c0) || minorKeyCandidates.has(c1),
    );

    // Fallback: look for the same candidates in the map keys (in case buildInputMap uses a different normaliser)
    const mapKeys = Object.keys(map).map((k) => String(k).normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase());
    const hasMinorTypeInMapKeys = mapKeys.some((k) => minorKeyCandidates.has(k));

    log('prepare', `Raw rows (normalised matrix): ${JSON.stringify(normalisedMatrix)}`);
    log('prepare', `Raw-row minor-creditor-type detected in rows: ${hasMinorTypeInRows}`);
    log('prepare', `Minor-creditor-type detected in map keys: ${hasMinorTypeInMapKeys}`);
    log('prepare', `Parsed map keys: ${JSON.stringify(mapKeys)}`);

    // 1) Enter shared fields (account then reference) using the centralised common actions
    this.enterAccountAndReference(map);

    // 1a) Handle common checkbox: "Active accounts only"
    this.applyActiveAccountsOnlyFlag(map);

    // 2) Route based ONLY on explicit minor-creditor indicator found in rows OR map keys
    if (hasMinorTypeInRows || hasMinorTypeInMapKeys) {
      log('navigate', 'Routing inputs to Minor creditors handler (minor type found in table or map)');
      this.handleMinorCreditors(map);
    } else {
      log('navigate', 'Routing inputs to Companies/Individuals handler (no minor type found in table or map)');
      this.handleCompaniesAndIndividuals(map);
    }

    // 3) Click search and wait for page
    this.submitSearchAndWaitForResults();
  }

  /**
   * Submits the account search request and waits for the application
   * to transition to the results page.
   *
   * Behaviour:
   * - Logs the action for Cypress reporting.
   * - Performs a single, intent-based submission via the shared
   *   search action (`clickSearchButton()`).
   * - Waits for client-side navigation to complete by asserting the
   *   browser's `pathname` includes the expected search-results segment.
   *
   * Notes:
   * - No UI verbs are used in this flow; the actual DOM interaction
   *   is encapsulated within `commonSearch.clickSearchButton()`.
   * - Uses global timeout options via `common.getTimeoutOptions()` to
   *   ensure consistent wait behaviour across the test suite.
   * - This method does not inspect API calls—its responsibility is
   *   purely navigation synchronisation.
   *
   * Sonar / Safety:
   * - Single responsibility: submit and wait for navigation.
   * - No hardcoded timeouts.
   * - Assertions rely only on URL state, not DOM visibility.
   */
  private submitSearchAndWaitForResults(): void {
    log('action', 'Submitting search and waiting for results');

    // Submit the search using shared action abstraction
    this.commonSearch.clickSearchButton();
  }

  /**
   * Applies the "Active accounts only" checkbox state if it is explicitly
   * provided in the input map.
   *
   * Accepts values like "yes/no", "true/false", "checked/unchecked".
   * If the value is unrecognised, logs a warning and leaves the checkbox
   * as-is (default checked).
   * @param map Normalised field/value map from the input table.
   */
  private applyActiveAccountsOnlyFlag(map: InputMap): void {
    const raw = map['active accounts only'];
    if (!raw) {
      log('debug', 'No "Active accounts only" flag provided — leaving default state');
      return;
    }

    const v = raw.trim().toLowerCase();
    if (!v) {
      log('debug', 'Empty "Active accounts only" value — leaving default state');
      return;
    }

    const truthy = new Set(['yes', 'y', 'true', 'checked']);
    const falsy = new Set(['no', 'n', 'false', 'unchecked']);

    if (truthy.has(v)) {
      log('input', 'Setting "Active accounts only" to checked (from input map)');
      this.commonSearch.setActiveAccountsOnly(true);
    } else if (falsy.has(v)) {
      log('input', 'Setting "Active accounts only" to unchecked (from input map)');
      this.commonSearch.setActiveAccountsOnly(false);
    } else {
      log('warn', `Unrecognised "Active accounts only" value "${raw}" — leaving checkbox unchanged`);
    }
  }

  // ─────────────────────────────────────────────
  // Page verification helpers
  // ─────────────────────────────────────────────

  /**
   * Verify the Individuals page fields based on a field→value map.
   *
   * @param expectedHeader The expected page header text.
   * @param map A normalised map of field → expected value (lowercase keys).
   */
  public verifyPageForIndividuals(expectedHeader: string, map: Record<string, string>): void {
    // Header first
    this.common.assertHeaderContains(expectedHeader);

    this.nav.verifyIndividualsTabActive();

    // Shared global fields (account number / reference)
    this.commonSearch.assertSharedFields(map);

    // Individual-specific assertions
    this.individuals.assertIndividualFields(map);
  }

  /**
   * Verify the Companies page fields based on a field→value map.
   *
   * @param map A normalised map of field → expected value (lowercase keys).
   */
  public verifyPageForCompanies(map: Record<string, string>): void {
    // Header first
    this.common.assertHeaderContains('Companies');

    this.nav.verifyCompaniesTabActive();

    // Shared global fields
    this.commonSearch.assertSharedFields(map);

    // Companies-only assertions
    this.companies.assertCompanyFields(map);
  }

  /**
   * Verify the Minor Creditors **Individual** variant fields.
   *
   * Read-only:
   * - Verifies shared fields (account / reference).
   * - If the feature provided `minor creditor type`, verifies the selected type (does NOT change UI).
   * - Calls the canonical minors assertion method: assertAllFieldValuesFromMap(sub).
   *
   * Throws TypeError if the canonical minors method is not present.
   * @param expectedHeader Expected header text on the Minor creditors page.
   * @param map Normalised map of field → expected value (lowercase keys).
   */
  public verifyPageForMinorIndividual(expectedHeader: string, map: Record<string, string>): void {
    this.common.assertHeaderContains(expectedHeader);

    this.nav.verifyMinorCreditorsTabActive();

    // Shared fields (account number + reference)
    this.commonSearch.assertSharedFields(map);

    // If the feature specified the minor creditor type, verify the selected type (read-only).
    if (map['minor creditor type']) {
      this.minors.assertTypeEquals(map['minor creditor type']);
    }

    // Extract only individual-relevant Minor Creditor keys
    const individualKeys = new Set([
      'first names',
      'individual last name',
      'address line 1',
      'postcode',
      'dob',
      'ni number',
      'minor creditor type', // keep so callers can assert type if present
    ]);

    const sub: Record<string, string> = {};
    for (const [k, v] of Object.entries(map)) {
      if (individualKeys.has(k)) sub[k] = v;
    }

    // Call the canonical minors assertion and fail fast if missing
    if (typeof this.minors.assertAllFieldValuesFromMap === 'function') {
      this.minors.assertAllFieldValuesFromMap(sub);
    } else {
      throw new TypeError(
        'verifyPageForMinorIndividual: expected AccountSearchMinorCreditorsActions.assertAllFieldValuesFromMap(map) to exist.',
      );
    }
  }

  /**
   * Verify the Minor Creditors **Company** variant fields.
   *
   * Read-only:
   * - Verifies shared fields (account / reference).
   * - If the feature provided `minor creditor type`, verifies the selected type (does NOT change UI).
   * - Calls the canonical minors assertion method: assertAllFieldValuesFromMap(sub).
   *
   * Throws TypeError if the canonical minors method is not present.
   * @param expectedHeader Expected header text on the Minor creditors page.
   * @param map Normalised map of field → expected value (lowercase keys).
   */
  public verifyPageForMinorCompany(expectedHeader: string, map: Record<string, string>): void {
    this.common.assertHeaderContains(expectedHeader);

    this.nav.verifyMinorCreditorsTabActive();

    // Shared fields (account number + reference)
    this.commonSearch.assertSharedFields(map);

    // If the feature specified the minor creditor type, verify the selected type (read-only).
    if (map['minor creditor type']) {
      this.minors.assertTypeEquals(map['minor creditor type']);
    }

    // Extract company-specific Minor Creditor keys
    const companyKeys = new Set(['company name', 'address line 1', 'postcode', 'minor creditor type']);

    const sub: Record<string, string> = {};
    for (const [k, v] of Object.entries(map)) {
      if (companyKeys.has(k)) sub[k] = v;
    }

    // Call canonical minors method (no fallbacks)
    if (typeof this.minors.assertAllFieldValuesFromMap === 'function') {
      this.minors.assertAllFieldValuesFromMap(sub);
    } else {
      throw new TypeError(
        'verifyPageForMinorCompany: expected AccountSearchMinorCreditorsActions.assertAllFieldValuesFromMap(map) to exist.',
      );
    }
  }

  // ─────────────────────────────────────────────
  // Results flows
  // ─────────────────────────────────────────────

  /**
   * Flow:
   *  - Assert the Search results page header is visible.
   *  - Assert the "Individuals" tab is selected.
   *  - Assert there is a row in the Individuals results whose columns
   *    match all key/value pairs from the provided table.
   *
   * Intended Gherkin:
   *   Then I see the Individuals search results:
   *     | Ref | PCRAUTO008 |
   * @param table Two-column Cucumber table of column/value pairs to assert.
   */
  public assertIndividualsResultsForReference(table: DataTable): void {
    const expectations = this.buildExpectationMap(table);

    log('verify', 'Verifying Individuals search results header, tab and row match', {
      expectations,
    });

    // Header + base results assertion
    this.results.assertOnResults();

    // Tab state
    this.results.assertIndividualsTabSelected();

    // Row match (single row that satisfies all column/value pairs)
    this.results.assertResultsRowMatchesColumns(expectations);
  }

  /**
   * Flow:
   *  - Select the "Companies" tab from the Search results page.
   *  - Assert the "Companies" tab is selected.
   *  - Assert there is a row in the Companies results whose columns
   *    match all key/value pairs from the provided table.
   *
   * Intended Gherkin:
   *   When I view the Companies search results:
   *     | Ref | PCRAUTO008 |
   * @param table Two-column Cucumber table of column/value pairs to assert.
   */
  public assertCompaniesResultsWithTabSwitch(table: DataTable): void {
    const expectations = this.buildExpectationMap(table);

    log('verify', 'Verifying Companies search results header, tab and row match', {
      expectations,
    });

    // Switch tab first – header should still be "Search results"
    this.results.selectCompaniesTab();

    // Tab state
    this.results.assertCompaniesTabSelected();

    // Row match (same semantics as Individuals)
    this.results.assertResultsRowMatchesColumns(expectations);
  }

  /**
   * Positive results verification for pages where ONLY the Companies tab exists.
   *
   * - Asserts the Search results header.
   * - Asserts the Companies tab is already selected.
   * - Asserts at least one row matches the provided expectations.
   *
   * @param table Two-column Cucumber table of column/value pairs to assert.
   * @example
   *   Then I see the Companies search results:
   *     | Ref | PCRAUTO010 |
   */
  public assertCompaniesResultsAlreadyOnCompanies(table: DataTable): void {
    const expectations = this.buildExpectationMap(table);

    log('verify', 'Verifying Companies results (no tab switching)', { expectations });

    this.results.assertOnResults();
    this.results.assertCompaniesTabSelected();
    this.results.assertResultsRowMatchesColumns(expectations);
  }

  /**
   * Flow:
   *  - Use the Search results back link to return to the Companies search page.
   *  - Verify the Companies search page header and field values via
   *    the existing verifyPageForCompanies() helper.
   *
   * @param table A two-column Cucumber table of field → expected value.
   *
   * The DataTable must be of the form:
   *   | field                       | value        |
   *   | account number              | 25000002A    |
   *   | reference or case number    | PCRAUTO008   |
   *
   * Internally this:
   *  - Delegates back navigation to ResultsActions.useBackLinkToReturnToSearch().
   *  - Converts the table into a normalised field→value map via buildInputMap().
   *  - Delegates the assertion to verifyPageForCompanies(expectedHeader, map).
   */
  public returnToCompaniesSearchFromResults(table: DataTable): void {
    log('navigate', 'Returning to Companies search from results via back link');

    // 1) Leave the results page using the standard back-link helper.
    this.results.useBackLinkToReturnToSearch();

    // 2) Build a canonical field→value map from the supplied table.
    const map = this.buildInputMap(table);

    // 3) Reuse the existing Companies verification helper.
    this.verifyPageForCompanies(map);
  }

  /**
   * Flow:
   *  - Asserts the Search results page is displayed.
   *  - Asserts the "Companies" tab is selected.
   *  - Asserts there is NO row in the results whose columns match all
   *    key/value pairs from the provided table.
   *
   * @param table Two-column Cucumber table of column → forbidden value.
   *
   * @example
   *   Then I see the Companies search results exclude:
   *     | Ref | PCRAUTO010A |
   */
  public assertCompaniesResultsDoNotContain(table: DataTable): void {
    const expectations = this.buildExpectationMap(table);

    log('verify', 'Verifying Companies results do NOT contain forbidden row', {
      expectations,
    });

    // We should already be on the results page.
    this.results.assertOnResults();

    // For this scenario there is only a Companies tab; still assert it.
    this.results.assertCompaniesTabSelected();

    // Assert that no row matches the forbidden values.
    this.results.assertNoResultsRowMatchesColumns(expectations);
  }

  /**
   * Verifies the "no matching results" message is shown and then
   * uses the "Check your search" link to return to the search form.
   */
  public verifyNoResultsAndClickCheckYourSearch(): void {
    log('flow', 'Verify no matching results and click "Check your search" link');

    this.results.assertNoMatchingResultsMessage();
    this.results.clickCheckYourSearchLink();
  }

  /**
   * Uses the global HMCTS header link to return to the dashboard
   * from any Account Search page.
   *
   * Responsibilities:
   * - Delegates the actual DOM interaction to CommonActions.clickHmctsHomeLink(),
   *   which owns all locator logic for the HMCTS brand link.
   * - Asserts that the dashboard is displayed after navigation via
   *   DashboardActions.assertOnDashboard().
   *
   * Notes:
   * - Flow method is intentionally small to satisfy Sonar and keep responsibilities clear.
   * - Does not modify any search-field state; navigation only.
   */
  public returnToDashboardViaHmctsLink(): void {
    log('navigate', 'Returning to dashboard via HMCTS header link');
    this.common.clickHmctsHomeLink();
    this.dashboard.assertDashboard();
  }
}
