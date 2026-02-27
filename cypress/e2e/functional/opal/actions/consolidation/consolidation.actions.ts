/**
 * @file consolidation.actions.ts
 * @description Cypress actions and assertions for the Consolidation journey.
 */

import { SelectBusinessUnitLocators } from '../../../../../shared/selectors/consolidation/SelectBusinessUnit.locators';
import { AccountSearchLocators } from '../../../../../shared/selectors/consolidation/AccountSearch.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('ConsolidationActions');

export type ConsolidationDefendantType = 'Individual' | 'Company';
type SearchDetails = Record<string, string>;

/** Actions and assertions for the Consolidation flow screens. */
export class ConsolidationActions {
  private readonly textFieldSelectorMap: Record<string, string> = {
    'account number': AccountSearchLocators.accountNumberInput,
    'national insurance number': AccountSearchLocators.nationalInsuranceNumberInput,
    'last name': AccountSearchLocators.lastNameInput,
    'first names': AccountSearchLocators.firstNamesInput,
    'date of birth': AccountSearchLocators.dateOfBirthInput,
    'address line 1': AccountSearchLocators.addressLine1Input,
    postcode: AccountSearchLocators.postCodeInput,
  };

  private readonly checkboxSelectorMap: Record<string, string> = {
    'last name exact match': AccountSearchLocators.lastNameExactMatchCheckbox,
    'first names exact match': AccountSearchLocators.firstNamesExactMatchCheckbox,
    'include aliases': AccountSearchLocators.includeAliasesCheckbox,
  };

  /**
   * Normalizes supported checkbox text values to booleans.
   * @param value - Raw value from feature table (e.g. true/false, yes/no).
   * @returns Parsed boolean for checkbox assertions/interactions.
   */
  private parseCheckboxValue(value: string): boolean {
    const normalised = String(value).trim().toLowerCase();
    if (['true', 'yes'].includes(normalised)) return true;
    if (['false', 'no'].includes(normalised)) return false;
    throw new Error(`Unsupported checkbox value "${value}". Use true/false (or yes/no).`);
  }

  /**
   * Selects a business unit when the selector is present.
   * If a single business unit is auto-selected, verifies the informational message instead.
   */
  public selectBusinessUnitIfRequired(): void {
    cy.get('body').then(($body) => {
      if ($body.find(SelectBusinessUnitLocators.businessUnitInput).length === 0) {
        log('info', 'Business unit input not shown; using auto-selected single business unit');
        cy.get(SelectBusinessUnitLocators.singleBusinessUnitMessage, { timeout: 10_000 }).should('be.visible');
        return;
      }

      log('select', 'Selecting first available business unit from autocomplete');
      cy.get(SelectBusinessUnitLocators.businessUnitInput, { timeout: 10_000 }).should('be.visible').click();
      cy.get(SelectBusinessUnitLocators.businessUnitAutoComplete, { timeout: 10_000 })
        .should('be.visible')
        .find('li')
        .first()
        .click();
    });
  }

  /**
   * Selects the requested defendant type radio option.
   * @param defendantType - "Individual" or "Company"
   */
  public selectDefendantType(defendantType: ConsolidationDefendantType): void {
    log('select', `Selecting defendant type: ${defendantType}`);

    if (defendantType === 'Individual') {
      cy.get(SelectBusinessUnitLocators.individualInput).check({ force: true });
      return;
    }

    cy.get(SelectBusinessUnitLocators.companyInput).check({ force: true });
  }

  /** Clicks Continue on the Select Business Unit screen. */
  public continueFromSelectBusinessUnit(): void {
    log('click', 'Clicking Continue on consolidation select business unit page');
    cy.get(SelectBusinessUnitLocators.continueButton, { timeout: 10_000 }).should('be.visible').click();
  }

  /** Asserts the user is on Consolidation account search for Individuals, Search tab active. */
  public assertOnSearchTabForIndividuals(): void {
    log('assert', 'Verifying user is on consolidation Search tab for Individuals');

    cy.location('pathname', { timeout: 10_000 }).should('include', '/fines/consolidation/consolidate-accounts');
    cy.get(AccountSearchLocators.searchTabLink, { timeout: 10_000 }).should('have.attr', 'aria-current', 'page');
    cy.get(AccountSearchLocators.defendantTypeValue).should('contain', 'Individual');
    cy.get(AccountSearchLocators.accountNumberInput).should('be.visible');
  }

  /**
   * Populates fields on the consolidation Search tab from key/value details.
   * @param details - Search details keyed by user-facing field labels.
   */
  public enterSearchDetails(details: SearchDetails): void {
    log('input', 'Entering consolidation search details', { details });

    Object.entries(details).forEach(([rawKey, value]) => {
      const key = rawKey.trim().toLowerCase();

      if (this.textFieldSelectorMap[key]) {
        const selector = this.textFieldSelectorMap[key];
        cy.get(selector).clear().type(value);
        return;
      }

      if (this.checkboxSelectorMap[key]) {
        const selector = this.checkboxSelectorMap[key];
        const shouldCheck = this.parseCheckboxValue(value);
        if (shouldCheck) {
          cy.get(selector).check({ force: true });
        } else {
          cy.get(selector).uncheck({ force: true });
        }
        return;
      }

      throw new Error(`Unsupported consolidation search field "${rawKey}".`);
    });
  }

  /** Switches Search -> Results -> For consolidation -> Search. */
  public switchTabsAndReturnToSearch(): void {
    log('navigate', 'Switching from Search to Results');
    cy.get(AccountSearchLocators.resultsTab).click();
    cy.get(AccountSearchLocators.accountNumberInput).should('not.exist');

    log('navigate', 'Switching from Results to For consolidation');
    cy.get(AccountSearchLocators.forConsolidationTab).click();
    cy.get(AccountSearchLocators.accountNumberInput).should('not.exist');

    log('navigate', 'Returning to Search tab');
    cy.get(AccountSearchLocators.searchTab).click();
    cy.get(AccountSearchLocators.accountNumberInput).should('be.visible');
  }

  /**
   * Asserts Search tab fields/checkboxes match expected values.
   * @param details - Expected values keyed by user-facing field labels.
   */
  public assertSearchDetails(details: SearchDetails): void {
    log('assert', 'Asserting consolidation search details', { details });

    Object.entries(details).forEach(([rawKey, value]) => {
      const key = rawKey.trim().toLowerCase();

      if (this.textFieldSelectorMap[key]) {
        const selector = this.textFieldSelectorMap[key];
        cy.get(selector).should('have.value', value);
        return;
      }

      if (this.checkboxSelectorMap[key]) {
        const selector = this.checkboxSelectorMap[key];
        const shouldCheck = this.parseCheckboxValue(value);
        if (shouldCheck) {
          cy.get(selector).should('be.checked');
        } else {
          cy.get(selector).should('not.be.checked');
        }
        return;
      }

      throw new Error(`Unsupported consolidation search field "${rawKey}".`);
    });
  }
}
