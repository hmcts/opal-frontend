/**
 * @file consolidation.flow.ts
 * @description High-level Consolidation flow methods used by Cucumber steps.
 */

import { createScopedLogger } from '../../../../support/utils/log.helper';
import { ConsolidationActions, ConsolidationDefendantType } from '../actions/consolidation/consolidation.actions';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';

const log = createScopedLogger('ConsolidationFlow');

/** Flow wrapper for the Consolidation journey. */
export class ConsolidationFlow {
  private readonly consolidation = new ConsolidationActions();

  /**
   * Converts a two-column Cucumber table into a key/value hash.
   * @param table - Data table with rows in "field | value" format.
   * @returns Key/value lookup for downstream action methods.
   */
  private tableToHash(table: DataTable): Record<string, string> {
    return table.rowsHash();
  }

  /**
   * Completes select-business-unit inputs and continues to account search.
   * @param defendantType - "Individual" or "Company"
   */
  public continueToConsolidationAccountSearch(defendantType: ConsolidationDefendantType): void {
    log('flow', 'Continuing from select business unit to consolidation account search', { defendantType });
    this.consolidation.selectBusinessUnitIfRequired();
    this.consolidation.selectDefendantType(defendantType);
    this.consolidation.continueFromSelectBusinessUnit();
  }

  /**
   * Completes a click of search on consolidate accounts
   */
  public clickConsolidationSearch(): void {
    log('flow', 'Clicking Search on consolidation account search');
    this.consolidation.clickSearch();
  }

  /** Clears the consolidation account-search form. */
  public clearConsolidationSearch(): void {
    log('flow', 'Clearing consolidation account-search form');
    this.consolidation.clearSearch();
  }

  /** Asserts consolidation account search lands on Search tab for Individuals. */
  public assertSearchTabForIndividuals(): void {
    log('flow', 'Asserting consolidation account search is on Search tab for Individuals');
    this.consolidation.assertOnSearchTabForIndividuals();
  }

  /** Asserts consolidation account search lands on Search tab for Companies. */
  public assertSearchTabForCompanies(): void {
    log('flow', 'Asserting consolidation account search is on Search tab for Companies');
    this.consolidation.assertOnSearchTabForCompanies();
  }

  /** Asserts the page-header back link is displayed on the consolidation shell. */
  public assertBackLinkIsDisplayed(): void {
    log('flow', 'Asserting consolidation page-header back link is displayed');
    this.consolidation.assertBackLinkIsDisplayed();
  }

  /** Clicks the page-header back link on the consolidation shell. */
  public clickBackLink(): void {
    log('flow', 'Clicking consolidation page-header back link');
    this.consolidation.clickBackLink();
  }

  /** Opens the consolidation Results tab. */
  public openResultsTab(): void {
    log('flow', 'Opening consolidation Results tab');
    this.consolidation.openResultsTab();
  }

  /** Asserts consolidation account search lands on the Results tab. */
  public assertResultsTab(): void {
    log('flow', 'Asserting consolidation account search is on the Results tab');
    this.consolidation.assertOnResultsTab();
  }

  /** Asserts consolidation account search lands on the Results tab for Individuals with the correct summary values. */
  public assertResultsTabForIndividuals(): void {
    log('flow', 'Asserting consolidation account search is on the Results tab for Individuals');
    this.consolidation.assertOnResultsTabForDefendantType('Individual');
  }

  /** Asserts consolidation account search lands on the Results tab for Companies with the correct summary values. */
  public assertResultsTabForCompanies(): void {
    log('flow', 'Asserting consolidation account search is on the Results tab for Companies');
    this.consolidation.assertOnResultsTabForDefendantType('Company');
  }

  /** Asserts the created account number is rendered as a hyperlink in consolidation results. */
  public assertCreatedAccountLinkIsDisplayed(): void {
    log('flow', 'Asserting created consolidation result account is displayed as a hyperlink');
    this.consolidation.assertCreatedAccountLinkIsDisplayed();
  }

  /** Asserts the consolidation no matching results state is displayed. */
  public assertNoMatchingResultsState(): void {
    log('flow', 'Asserting consolidation no matching results state');
    this.consolidation.assertNoMatchingResultsState();
  }

  /**
   * Asserts the consolidation results do not contain the supplied balance.
   * @param balance - Forbidden rendered balance value.
   */
  public assertResultsExcludeBalance(balance: string): void {
    log('flow', 'Asserting consolidation results exclude balance', { balance });
    this.consolidation.assertResultsExcludeBalance(balance);
  }

  /** Clicks the Check your search hyperlink from the consolidation no matching results state. */
  public clickCheckYourSearchFromNoMatchingResults(): void {
    log('flow', 'Clicking Check your search from consolidation no matching results state');
    this.consolidation.clickCheckYourSearchFromNoMatchingResults();
  }

  /** Opens the created consolidation result account and verifies the new-tab FAE details navigation. */
  public openCreatedAccountFromResultsInNewTab(): void {
    log('flow', 'Opening created consolidation result account in a new tab');
    this.consolidation.openCreatedAccountFromResultsInNewTab();
  }

  /**
   * Asserts the consolidation search error page for the given defendant type.
   * @param defendantType - "Individual" or "Company"
   */
  public assertSearchErrorPage(defendantType: ConsolidationDefendantType): void {
    log('flow', 'Asserting consolidation search error page', { defendantType });
    this.consolidation.assertSearchErrorPage(defendantType);
  }

  /** Clicks the back link on the consolidation search error page. */
  public goBackFromSearchError(): void {
    log('flow', 'Going back from consolidation search error page');
    this.consolidation.goBackFromSearchError();
  }

  /**
   * Enters consolidation account-search details from a two-column data table.
   * @param table - Data table in key/value form.
   */
  public enterConsolidationSearchDetails(table: DataTable): void {
    const details = this.tableToHash(table);
    log('flow', 'Entering consolidation account-search details', { details });
    this.consolidation.enterSearchDetails(details);
  }

  /** Switches away from Search and back again to verify tab retention behaviour. */
  public switchTabsAndReturnToSearch(): void {
    log('flow', 'Switching consolidation tabs and returning to Search');
    this.consolidation.switchTabsAndReturnToSearch();
  }

  /**
   * Asserts consolidation account-search details match expected table values.
   * @param table - Data table in key/value form.
   */
  public assertConsolidationSearchDetails(table: DataTable): void {
    const details = this.tableToHash(table);
    log('flow', 'Asserting retained consolidation account-search details', { details });
    this.consolidation.assertSearchDetails(details);
  }
}
