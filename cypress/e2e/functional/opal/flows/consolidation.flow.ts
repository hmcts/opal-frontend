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

  /** Asserts consolidation account search lands on Search tab for Individuals. */
  public assertSearchTabForIndividuals(): void {
    log('flow', 'Asserting consolidation account search is on Search tab for Individuals');
    this.consolidation.assertOnSearchTabForIndividuals();
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
