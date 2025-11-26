/**
 * @fileoverview AccountSearchMinorCreditorsActions
 *
 * Minor Creditors search page actions.
 *
 * - Mapping-driven assertions for Individual & Company fields.
 * - No shared account/reference assertions (delegated to AccountSearchCommonActions).
 * - Uses locator-file entries exclusively (no fallback selectors).
 * - Setters / company asserts throw TypeError when required locators are missing.
 * - Individual asserts feature-detect and skip if the individual inputs are not present in DOM.
 */

import { log } from '../../../../../support/utils/log.helper';
import { AccountSearchCommonLocators as C } from '../../../../../shared/selectors/account-search/account.search.common.locators';
import { AccountSearchMinorCreditorsLocators as L } from '../../../../../shared/selectors/account-search/account.search.minor-creditors.locators';
import { CommonActions } from '../common.actions';

export type MinorCreditorType = 'Individual' | 'Company' | 'individual' | 'company';
type SimpleType = 'individual' | 'company';

export class AccountSearchMinorCreditorsActions {
  private readonly commonActions = new CommonActions();

  /**
   * Normalise a MinorCreditorType value into the simple lower-case union.
   *
   * @param type Raw type (capitalised or lower-case).
   * @returns 'individual' | 'company'
   */
  private normalizeType(type: MinorCreditorType | SimpleType): SimpleType {
    if (type === 'individual' || type === 'company') return type;
    const normalized = String(type).trim().toLowerCase();
    if (normalized === 'individual' || normalized === 'company') return normalized as SimpleType;
    throw new TypeError(`normalizeType: unsupported MinorCreditorType value "${type}"`);
  }

  /**
   * Assert the Minor Creditor First Names field equals expected value.
   * Feature-detects presence in DOM and skips assertion if not found.
   *
   * @param expected expected string
   */
  public assertFirstNamesEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Assert minor creditor first names = "${expectedTrim}"`);

    const sel = L.individual.firstNamesInput;
    if (!sel) {
      // Locator missing — skip, as individual inputs may not be present depending on selected type.
      cy.log('locator', 'assertFirstNamesEquals: locator L.individual.firstNamesInput missing — skipping assertion');
      return;
    }

    cy.get('body', this.commonActions.getTimeoutOptions()).then(($body) => {
      if ($body.find(sel).length === 0) {
        cy.log('locator', `firstNames input selector "${sel}" not present in DOM; skipping assertion`);
        return;
      }
      cy.get(sel, this.commonActions.getTimeoutOptions()).should('be.visible').and('have.value', expectedTrim);
    });
  }

  /**
   * Assert the Minor Creditor Last Name field equals expected value.
   * Feature-detects presence in DOM and skips assertion if not found.
   *
   * @param expected expected string
   */
  public assertLastNameEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Assert minor creditor last name = "${expectedTrim}"`);

    const sel = L.individual.lastNameInput;
    if (!sel) {
      cy.log('locator', 'assertLastNameEquals: locator L.individual.lastNameInput missing — skipping assertion');
      return;
    }

    cy.get('body', this.commonActions.getTimeoutOptions()).then(($body) => {
      if ($body.find(sel).length === 0) {
        cy.log('locator', `lastName input selector "${sel}" not present in DOM; skipping assertion`);
        return;
      }
      cy.get(sel, this.commonActions.getTimeoutOptions()).should('be.visible').and('have.value', expectedTrim);
    });
  }

  /**
   * Assert the Minor Creditor Company Name field equals expected value.
   * Requires locator-file entry L.company.companyNameInput; throws TypeError if missing.
   *
   * @param expected expected string
   */
  public assertCompanyNameEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Minor Creditor company name equals "${expectedTrim}"`);

    const sel = L.company.companyNameInput;
    if (!sel) {
      throw new TypeError('assertCompanyNameEquals: Locator L.company.companyNameInput is required but missing.');
    }

    cy.get(sel, this.commonActions.getTimeoutOptions()).should('be.visible').and('have.value', expectedTrim);
  }

  /**
   * Assert the Minor Creditor Company Address Line 1 equals expected value.
   * Requires locator-file entry L.company.addressLine1Input; throws TypeError if missing.
   *
   * @param expected expected string
   */
  public assertCompanyAddressLine1Equals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Minor Creditor company address line 1 equals "${expectedTrim}"`);

    const sel = L.company.companyAddressLine1Input;
    if (!sel) {
      throw new TypeError(
        'assertCompanyAddressLine1Equals: Locator L.company.addressLine1Input is required but missing.',
      );
    }

    cy.get(sel, this.commonActions.getTimeoutOptions()).should('be.visible').and('have.value', expectedTrim);
  }

  /**
   * Assert the Minor Creditor Company Postcode equals expected value.
   * Requires locator-file entry L.company.postcodeInput; throws TypeError if missing.
   *
   * @param expected expected string
   */
  public assertCompanyPostcodeEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Minor Creditor company postcode equals "${expectedTrim}"`);

    const sel = L.company.companyPostcodeInput;
    if (!sel) {
      throw new TypeError('assertCompanyPostcodeEquals: Locator L.company.postcodeInput is required but missing.');
    }

    cy.get(sel, this.commonActions.getTimeoutOptions()).should('be.visible').and('have.value', expectedTrim);
  }

  /**
   * Generic: Assert address line 1 for either Individual or Company.
   *
   * @param expected expected string
   */
  public assertAddressLine1Equals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Minor Creditor address line 1 equals "${expectedTrim}"`);

    const indSel = L.individual.addressLine1Input;
    const coSel = L.company.companyAddressLine1Input;

    cy.get('body', this.commonActions.getTimeoutOptions()).then(($body) => {
      if (indSel && $body.find(indSel).length > 0) {
        cy.get(indSel, this.commonActions.getTimeoutOptions()).should('be.visible').and('have.value', expectedTrim);
        return;
      }

      if (coSel && $body.find(coSel).length > 0) {
        cy.get(coSel, this.commonActions.getTimeoutOptions()).should('be.visible').and('have.value', expectedTrim);
        return;
      }

      cy.log(
        'locator',
        'assertAddressLine1Equals: no locator-present element found for individual or company; skipping assertion',
      );
    });
  }

  /**
   * Generic: Assert postcode for either Individual or Company.
   *
   * Uses locator file entries only and skips if none present in DOM.
   *
   * @param expected expected string
   */
  public assertPostcodeEquals(expected: string): void {
    const expectedTrim = String(expected ?? '').trim();
    log('assert', `Asserting Minor Creditor postcode equals "${expectedTrim}"`);

    const indSel = L.individual.postcodeInput;
    const coSel = L.company.companyPostcodeInput;

    cy.get('body', this.commonActions.getTimeoutOptions()).then(($body) => {
      if (indSel && $body.find(indSel).length > 0) {
        cy.get(indSel, this.commonActions.getTimeoutOptions()).should('be.visible').and('have.value', expectedTrim);
        return;
      }

      if (coSel && $body.find(coSel).length > 0) {
        cy.get(coSel, this.commonActions.getTimeoutOptions()).should('be.visible').and('have.value', expectedTrim);
        return;
      }

      cy.log(
        'locator',
        'assertPostcodeEquals: no locator-present element found for individual or company; skipping assertion',
      );
    });
  }

  /**
   * Setters - use locator-file selectors only. Throw TypeError if required locator missing.
   */

  public setFirstNames(value: string): void {
    log('action', `Setting First names to "${value}"`);
    const sel = L.individual.firstNamesInput;
    if (!sel) {
      throw new TypeError('setFirstNames: Locator L.individual.firstNamesInput is required but missing.');
    }
    cy.get(sel, this.commonActions.getTimeoutOptions()).clear().type(value);
  }

  public setLastName(value: string): void {
    log('action', `Setting Last name to "${value}"`);
    const sel = L.individual.lastNameInput;
    if (!sel) {
      throw new TypeError('setLastName: Locator L.individual.lastNameInput is required but missing.');
    }
    cy.get(sel, this.commonActions.getTimeoutOptions()).clear().type(value);
  }

  public setIndividualAddressLine1(value: string): void {
    log('action', `Setting Individual Address line 1 to "${value}"`);
    const sel = L.individual.addressLine1Input;
    if (!sel) {
      throw new TypeError('setIndividualAddressLine1: Locator L.individual.addressLine1Input is required but missing.');
    }
    cy.get(sel, this.commonActions.getTimeoutOptions()).clear().type(value);
  }

  public setIndividualPostcode(value: string): void {
    log('action', `Setting Individual Postcode to "${value}"`);
    const sel = L.individual.postcodeInput;
    if (!sel) {
      throw new TypeError('setIndividualPostcode: Locator L.individual.postcodeInput is required but missing.');
    }
    cy.get(sel, this.commonActions.getTimeoutOptions()).clear().type(value);
  }

  public setCompanyName(value: string): void {
    log('action', `Setting Company name to "${value}"`);
    const sel = L.company.companyNameInput;
    if (!sel) {
      throw new TypeError('setCompanyName: Locator L.company.companyNameInput is required but missing.');
    }
    cy.get(sel, this.commonActions.getTimeoutOptions()).clear().type(value);
  }

  public setCompanyAddressLine1(value: string): void {
    log('action', `Setting Company Address line 1 to "${value}"`);
    const sel = L.company.companyAddressLine1Input;
    if (!sel) {
      throw new TypeError('setCompanyAddressLine1: Locator L.company.addressLine1Input is required but missing.');
    }
    cy.get(sel, this.commonActions.getTimeoutOptions()).clear().type(value);
  }

  public setCompanyPostcode(value: string): void {
    log('action', `Setting Company Postcode to "${value}"`);
    const sel = L.company.companyPostcodeInput;
    if (!sel) {
      throw new TypeError('setCompanyPostcode: Locator L.company.postcodeInput is required but missing.');
    }
    cy.get(sel, this.commonActions.getTimeoutOptions()).clear().type(value);
  }

  /**
   * Sets the "Last name exact match" checkbox for Minor Creditor Individuals.
   *
   * Requires locator-file entry L.individual.lastNameExactMatchCheckbox.
   * Uses GOV.UK pattern-safe interaction (no visibility assertion on the input itself).
   */
  public setLastNameExactMatch(checked: boolean): void {
    log('action', `Setting Minor Creditor last name exact match to ${checked}`);

    const sel = L.individual.lastNameExactMatchCheckbox;
    if (!sel) {
      throw new TypeError(
        'setLastNameExactMatch: Locator L.individual.lastNameExactMatchCheckbox is required but missing.',
      );
    }

    cy.get(sel, this.commonActions.getTimeoutOptions())
      .should('exist')
      .then(($el) => {
        const isChecked = $el.prop('checked') ?? false;
        if (isChecked !== checked) {
          cy.wrap($el).click({ force: true });
        }
      });

    cy.get(sel, this.commonActions.getTimeoutOptions()).should(checked ? 'be.checked' : 'not.be.checked');
  }

  /**
   * Sets the "First names exact match" checkbox for Minor Creditor Individuals.
   *
   * Requires locator-file entry L.individual.firstNamesExactMatchCheckbox.
   */
  public setFirstNamesExactMatch(checked: boolean): void {
    log('action', `Setting Minor Creditor first names exact match to ${checked}`);

    const sel = L.individual.firstNamesExactMatchCheckbox;
    if (!sel) {
      throw new TypeError(
        'setFirstNamesExactMatch: Locator L.individual.firstNamesExactMatchCheckbox is required but missing.',
      );
    }

    cy.get(sel, this.commonActions.getTimeoutOptions())
      .should('exist')
      .then(($el) => {
        const isChecked = $el.prop('checked') ?? false;
        if (isChecked !== checked) {
          cy.wrap($el).click({ force: true });
        }
      });

    cy.get(sel, this.commonActions.getTimeoutOptions()).should(checked ? 'be.checked' : 'not.be.checked');
  }

  /**
   * Ensure the Minor Creditors panel root exists.
   */
  public assertOnSearchPage(): void {
    const sel = L.panel?.root;
    if (!sel) throw new TypeError('assertOnSearchPage: Locator L.panel.root is required but missing.');
    cy.get(sel, this.commonActions.getTimeoutOptions()).should('be.visible');
  }

  /**
   * Mapping-driven field assertions for Minor Creditors.
   * (Shared account/reference assertions intentionally omitted.)
   */
  private get fieldAssertions(): Record<
    string,
    {
      label: string;
      action: (v: string) => void;
    }
  > {
    return {
      'first names': { label: 'minor creditor first names', action: (v: string) => this.assertFirstNamesEquals(v) },
      'individual last name': {
        label: 'minor creditor last name',
        action: (v: string) => this.assertLastNameEquals(v),
      },
      'company name': { label: 'minor creditor company name', action: (v: string) => this.assertCompanyNameEquals(v) },
      'address line 1': {
        label: 'minor creditor address line 1',
        action: (v: string) => this.assertAddressLine1Equals(v),
      },
      postcode: { label: 'minor creditor postcode', action: (v: string) => this.assertPostcodeEquals(v) },
    };
  }

  /**
   * Assert minor-creditor related fields from a normalised map.
   *
   * No UI changes here — assertions only read/feature-detect the DOM and skip if the
   * relevant elements are not present. Any required radio selection should be done
   * by the flow before calling this method.
   */
  public assertAllFieldValuesFromMap(map: Record<string, string>): void {
    for (const [key, cfg] of Object.entries(this.fieldAssertions)) {
      if (map[key] !== undefined) {
        const value = String(map[key] ?? '').trim();
        log('assert', `Assert ${cfg.label} = "${value}"`);
        cfg.action(value);
      }
    }
  }

  /**
   * Assert that the Minor creditors sub-form is cleared to defaults (empty values OR radios unselected).
   *
   * Behaviour:
   * - If a radio fieldset is present in DOM, assert both Individual & Company radios exist and are NOT checked.
   * - Additionally, for any visible individual/company inputs found in DOM, assert they have empty values.
   * - Does NOT click/change the UI (keeps assertions read-only).
   */
  public assertCleared(): void {
    log('assert', 'Asserting Minor creditors form cleared to defaults');

    const fieldsetSelector = L.type?.fieldset;
    const individualRadioSel = L.type?.individualRadio;
    const companyRadioSel = L.type?.companyRadio;

    // 1) If a radio fieldset exists in DOM, assert radios are present and not checked.
    cy.get('body', this.commonActions.getTimeoutOptions()).then(($body) => {
      const hasFieldsetInDom = Boolean(fieldsetSelector && $body.find(fieldsetSelector).length > 0);

      if (hasFieldsetInDom) {
        // sanity checks — if locators absent in L, surface a TypeError so missing locators are fixed quickly
        if (!individualRadioSel || !companyRadioSel) {
          throw new TypeError(
            'assertCleared: radio fieldset present but individual/company radio locators are missing.',
          );
        }

        log('assert', 'Fieldset present — asserting radios are not selected');
        cy.get(individualRadioSel, this.commonActions.getTimeoutOptions()).should('exist').and('not.be.checked');
        cy.get(companyRadioSel, this.commonActions.getTimeoutOptions()).should('exist').and('not.be.checked');
      } else {
        log('assert', 'No radio fieldset present in DOM — falling back to visible-input emptiness checks');
      }

      // 2) For any visible individual inputs, assert they are empty.
      const maybeAssertVisibleEmpty = (sel?: string, label?: string) => {
        if (!sel) {
          // locator not present in file — skip with log (individual/company inputs may be optional)
          cy.log('locator', `assertCleared: locator for ${label ?? 'field'} missing in L — skipping presence check`);
          return;
        }

        if ($body.find(sel).length > 0) {
          cy.get(sel, this.commonActions.getTimeoutOptions()).should('be.visible').and('have.value', '');
          log('assert', `Asserted visible ${label ?? sel} is empty`);
        } else {
          // element not in DOM — that's fine for cleared state
          cy.log('locator', `assertCleared: ${label ?? sel} not present in DOM; skipping emptiness assertion`);
        }
      };

      // Individual inputs (may be conditional)
      maybeAssertVisibleEmpty(L.individual.firstNamesInput, 'minor creditor first names');
      maybeAssertVisibleEmpty(L.individual.lastNameInput, 'minor creditor last name');
      maybeAssertVisibleEmpty(L.individual.addressLine1Input, 'minor creditor address line 1');
      maybeAssertVisibleEmpty(L.individual.postcodeInput, 'minor creditor postcode');

      // Company inputs (may be conditional)
      maybeAssertVisibleEmpty(L.company.companyNameInput, 'minor creditor company name');
      maybeAssertVisibleEmpty(L.company.companyAddressLine1Input, 'minor creditor company address line 1');
      maybeAssertVisibleEmpty(L.company.companyPostcodeInput, 'minor creditor postcode');

      log('assert', 'Minor creditors cleared assertions complete');
    });
  }

  /**
   * Submit an empty Minor Creditors search using the shared search button.
   */
  public submitEmptySearch(): void {
    log('action', 'Submitting empty Minor Creditors search');
    this.assertOnSearchPage();
    const sel = C.searchButton;
    if (!sel) throw new TypeError('submitEmptySearch: Locator C.searchButton is required but missing.');
    cy.get(sel, this.commonActions.getTimeoutOptions()).should('be.visible').and('be.enabled').click();
  }

  /**
   * Assert type controls are not selected (radios or select fallback).
   */
  public assertTypeControlsNotSelected(): void {
    log('assert', 'Verifying Minor Creditor type controls are not selected');

    cy.get('body', this.commonActions.getTimeoutOptions()).then(($body) => {
      const fieldsetSelector = L.type?.fieldset;
      const selectSelector = L.type?.selectFallback;

      const fieldsetExists = fieldsetSelector ? $body.find(fieldsetSelector).length > 0 : false;
      const selectExists = selectSelector ? $body.find(selectSelector).length > 0 : false;

      if (fieldsetExists) {
        if (!L.type?.individualRadio || !L.type?.companyRadio) {
          throw new TypeError(
            'assertTypeControlsNotSelected: individual/company radio locators are required but missing.',
          );
        }
        cy.get(L.type.individualRadio, this.commonActions.getTimeoutOptions()).should('exist').and('not.be.checked');
        cy.get(L.type.companyRadio, this.commonActions.getTimeoutOptions()).should('exist').and('not.be.checked');
        cy.log('assert', 'Both Individual and Company radios are not selected');
      } else if (selectExists) {
        if (!L.type?.selectFallback) {
          throw new TypeError('assertTypeControlsNotSelected: type.selectFallback locator is required but missing.');
        }
        cy.get(L.type.selectFallback, this.commonActions.getTimeoutOptions())
          .should('exist')
          .and(($sel) => {
            const val = ($sel.val() ?? '').toString();
            if (val === 'individual' || val === 'company') {
              throw new Error(`Expected select not to have chosen value but found "${val}"`);
            }
          });
        cy.log('assert', 'Type select has no chosen value');
      } else {
        throw new Error('assertTypeControlsNotSelected: No type controls found (radios or select).');
      }
    });
  }

  /**
   * Choose the Minor Creditor type (Individual or Company).
   *
   * NOTE: This implementation is **fallback-free** — it requires the radio fieldset
   * to be present (or the method will throw). This keeps behavior explicit and
   * surfaces missing locators quickly.
   */
  public chooseType(type: MinorCreditorType | SimpleType): void {
    const simple = this.normalizeType(type);
    log('action', `Choosing Minor Creditor type: ${simple}`);

    cy.get('body', this.commonActions.getTimeoutOptions()).then(($body) => {
      const fieldsetSelector = L.type?.fieldset;
      const hasFieldset = Boolean(fieldsetSelector && $body.find(fieldsetSelector).length > 0);

      if (!hasFieldset) {
        throw new TypeError('chooseType: radio fieldset not found. Locator L.type.fieldset is required.');
      }

      this.chooseTypeUsingFieldset(simple, $body);
    });
  }

  /**
   * Handle choosing the type when a radio fieldset is present.
   * - Clicks the label if visible (user-like) otherwise checks the input.
   * - Asserts the radio is checked and that the conditional content is visible.
   *
   * Throws TypeError for any missing required locators.
   */
  private chooseTypeUsingFieldset(simple: SimpleType, $body: JQuery<HTMLElement>): void {
    // sanity checks for required locators
    if (!L.type?.individualRadio || !L.type?.companyRadio) {
      throw new TypeError('chooseType: individual/company radio locators are required but missing.');
    }

    const radioSelector = simple === 'individual' ? L.type.individualRadio : L.type.companyRadio;
    const radioId = radioSelector.replace(/^#/, '');
    const labelSelector = `label[for="${radioId}"]`;

    // Prefer clicking the visible label; fallback to checking the input
    if ($body.find(labelSelector).length > 0 && $body.find(labelSelector).is(':visible')) {
      cy.get(labelSelector, this.commonActions.getTimeoutOptions()).should('be.visible').click({ force: true });
    } else {
      cy.get(radioSelector, this.commonActions.getTimeoutOptions()).should('exist').check({ force: true });
    }

    // Assert input is checked
    cy.get(radioSelector, this.commonActions.getTimeoutOptions()).should('be.checked');

    // Ensure conditional content is visible (validates the switch)
    if (simple === 'individual') {
      if (!L.type?.individualConditional) {
        throw new TypeError('chooseType: L.type.individualConditional locator is required but missing.');
      }
      cy.get(L.type.individualConditional, this.commonActions.getTimeoutOptions()).should('be.visible');
    } else {
      if (!L.panel?.root) throw new TypeError('chooseType: L.panel.root locator is required but missing.');
      cy.get(L.panel.root, this.commonActions.getTimeoutOptions()).should('be.visible');
    }
  }

  /**
   * Prepare sample values for the specified MinorCreditorType.
   */
  public prepareSample(type: MinorCreditorType): void {
    log('action', `Preparing Minor creditors sample values for ${type}`);

    switch (String(type).toLowerCase()) {
      case 'individual':
        this.chooseType('individual');
        this.setFirstNames('FirstName');
        this.setLastName('LastName');
        this.setIndividualAddressLine1('123 Test Street');
        this.setIndividualPostcode('SW1A 1AA');
        break;

      case 'company':
        this.chooseType('company');
        this.setCompanyName('CompanyOne');
        this.setCompanyAddressLine1('123 Test Street');
        this.setCompanyPostcode('SW1A 1AA');
        break;

      default:
        throw new TypeError(`Unsupported MinorCreditorType: ${String(type)}`);
    }

    log('assert', `Applied Minor creditors sample for ${type}`);
  }

  /**
   * Clear individual/company fields when present.
   */
  public clearAllFields(): void {
    log('action', 'Clearing all Minor creditors fields');

    if (L.individual.firstNamesInput)
      cy.get(L.individual.firstNamesInput, this.commonActions.getTimeoutOptions()).then(
        ($el) => $el.length && cy.wrap($el).clear(),
      );
    if (L.individual.lastNameInput)
      cy.get(L.individual.lastNameInput, this.commonActions.getTimeoutOptions()).then(
        ($el) => $el.length && cy.wrap($el).clear(),
      );
    if (L.individual.addressLine1Input)
      cy.get(L.individual.addressLine1Input, this.commonActions.getTimeoutOptions()).then(
        ($el) => $el.length && cy.wrap($el).clear(),
      );
    if (L.individual.postcodeInput)
      cy.get(L.individual.postcodeInput, this.commonActions.getTimeoutOptions()).then(
        ($el) => $el.length && cy.wrap($el).clear(),
      );

    if (L.company.companyNameInput)
      cy.get(L.company.companyNameInput, this.commonActions.getTimeoutOptions()).then(
        ($el) => $el.length && cy.wrap($el).clear(),
      );
    if (L.company.companyAddressLine1Input)
      cy.get(L.company.companyAddressLine1Input as any, this.commonActions.getTimeoutOptions()).then(
        ($el) => $el.length && cy.wrap($el).clear(),
      );
    if (L.company.companyPostcodeInput)
      cy.get(L.company.companyPostcodeInput, this.commonActions.getTimeoutOptions()).then(
        ($el) => $el.length && cy.wrap($el).clear(),
      );

    log('assert', 'Minor creditors fields cleared');
  }

  /**
   * Assert the selected Minor Creditor type (Individual | Company).
   */
  public assertTypeEquals(expectedRaw: string): void {
    log('assert', `Asserting Minor Creditor type equals "${expectedRaw}"`);

    const normal = String(expectedRaw ?? '')
      .trim()
      .toLowerCase();
    let expected: MinorCreditorType;
    if (normal === 'individual') expected = 'Individual';
    else if (normal === 'company') expected = 'Company';
    else
      throw new TypeError(`assertTypeEquals: unexpected value "${expectedRaw}". Expected "Individual" or "Company".`);

    const panelSel = L.panel?.root;
    if (!panelSel) throw new TypeError('assertTypeEquals: Locator L.panel.root is required but missing.');

    cy.get(panelSel, this.commonActions.getTimeoutOptions()).within(() => {
      if (expected === 'Individual') {
        if (!L.type?.individualRadio)
          throw new TypeError('assertTypeEquals: Locator L.type.individualRadio is missing.');
        cy.get(L.type.individualRadio, this.commonActions.getTimeoutOptions()).should('exist').and('be.checked');
      } else {
        if (!L.type?.companyRadio) throw new TypeError('assertTypeEquals: Locator L.type.companyRadio is missing.');
        cy.get(L.type.companyRadio, this.commonActions.getTimeoutOptions()).should('exist').and('be.checked');
      }
    });
  }

  /**
   * Return whether the Minor Creditors panel is active (async).
   */
  public isActiveSync(): Cypress.Chainable<boolean> {
    return cy.get('body', this.commonActions.getTimeoutOptions()).then(($b) => {
      const exists = !!(L.panel?.root && $b.find(L.panel.root).length > 0);
      cy.wrap(exists, { log: false }).as('__mcActive');
      return exists;
    });
  }
}

export const searchMinorCreditorsActions = () => new AccountSearchMinorCreditorsActions();
