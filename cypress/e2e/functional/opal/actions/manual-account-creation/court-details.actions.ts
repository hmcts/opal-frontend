/**
 * @fileoverview Actions for Manual Account Creation - Court details task.
 * Covers LJA/PCR/enforcement court entry, nested navigation, cancel handling, and assertions.
 */
import { ManualCourtDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/court-details.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

export type ManualCourtFieldKey = 'lja' | 'pcr' | 'enforcementCourt';

/**
 * Actions for the Manual Account Creation Court details page.
 *
 * Encapsulates single interactions so steps remain thin and reusable.
 */
export class ManualCourtDetailsActions {
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();

  /**
   * Asserts we are on the Court details page before interacting.
   */
  assertOnCourtDetailsPage(expectedHeader: string = 'Court details'): void {
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/court-details');
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Completes the Court details form using provided field values.
   */
  fillCourtDetails(payload: Partial<Record<ManualCourtFieldKey, string>>): void {
    const entries = Object.entries(payload ?? {}).filter(([, value]) => value !== undefined);
    log('type', 'Filling court details', { payload: { ...payload }, fields: entries.map(([field]) => field) });

    if (!entries.length) {
      log('warn', 'fillCourtDetails called without any values; skipping input');
      return;
    }

    if (payload.lja !== undefined) {
      this.setLja(payload.lja);
    }
    if (payload.pcr !== undefined) {
      this.setPcr(payload.pcr);
    }
    if (payload.enforcementCourt !== undefined) {
      this.setEnforcementCourt(payload.enforcementCourt);
    }
  }

  /**
   * Sets a single Court details field by key.
   */
  setFieldValue(field: ManualCourtFieldKey, value: string): void {
    log('type', 'Setting Court details field', { field, value });
    switch (field) {
      case 'lja':
        this.setLja(value);
        break;
      case 'pcr':
        this.setPcr(value);
        break;
      case 'enforcementCourt':
        this.setEnforcementCourt(value);
        break;
      default:
        throw new Error(`Unknown court details field: ${field}`);
    }
  }

  /**
   * Asserts the value of a Court details field.
   */
  assertFieldValue(field: ManualCourtFieldKey, expected: string): void {
    cy.get(this.getSelector(field), this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * Clicks the nested flow CTA (e.g., Add personal details).
   */
  clickNestedFlowButton(expectedText?: string): void {
    log('navigate', 'Clicking nested flow button from Court details', { expectedText });
    const options = this.common.getTimeoutOptions();
    const matcher = expectedText ? new RegExp(expectedText, 'i') : undefined;

    const button = matcher ? cy.contains(L.nestedFlowButton, matcher, options) : cy.get(L.nestedFlowButton, options);

    button.should('exist').scrollIntoView().click({ force: true });
  }

  /**
   * Handles Cancel on Court details with a specified choice.
   */
  cancelAndChoose(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    const accept = /ok|leave/i.test(choice);
    log('cancel', 'Cancelling court details edit', { choice, accept });
    this.common.confirmNextUnsavedChanges(accept);

    cy.get(L.cancelLink, this.common.getTimeoutOptions()).should('exist').scrollIntoView().click({ force: true });
  }

  /**
   * Types into the LJA autocomplete and selects the first suggestion.
   */
  private setLja(lja: string): void {
    log('type', 'Setting LJA', { lja });
    this.typeAutocomplete(L.ljaInput, L.ljaListbox, lja, 'LJA');
  }

  /**
   * Enters the PCR text input value.
   */
  private setPcr(pcr: string): void {
    log('type', 'Setting PCR', { pcr });
    this.typeIntoField(L.pcrInput, pcr, 'PCR');
  }

  /**
   * Types into the enforcement court autocomplete and selects the first suggestion.
   */
  private setEnforcementCourt(enforcementCourt: string): void {
    log('type', 'Setting enforcement court', { enforcementCourt });
    this.typeAutocomplete(L.enforcementCourtInput, L.enforcementCourtListbox, enforcementCourt, 'Enforcement court');
  }

  /**
   * Clears and types into a text field, asserting the resulting value.
   */
  private typeIntoField(selector: string, value: string, label: string): void {
    const input = cy.get(selector, this.common.getTimeoutOptions()).should('exist');
    input.scrollIntoView().clear({ force: true });

    if (value === '') {
      input.should('have.value', '');
      return;
    }

    input.type(value, { delay: 0, force: true }).should('have.value', value);
  }

  /**
   * Handles autocomplete inputs by typing, waiting for the listbox, and selecting the first option.
   */
  private typeAutocomplete(inputSelector: string, listboxSelector: string, value: string, label: string): void {
    const input = cy.get(inputSelector, this.common.getTimeoutOptions()).should('exist');
    input.scrollIntoView().clear({ force: true });

    if (value === '') {
      log('clear', `${label} autocomplete cleared`);
      input.should('have.value', '');
      return;
    }

    input.type(value, { delay: 0, force: true }).should('have.value', value);
    cy.get(listboxSelector, this.common.getTimeoutOptions()).should('exist');
    cy.get(inputSelector).type('{downarrow}{enter}', { force: true });
    cy.get(inputSelector, this.common.getTimeoutOptions()).should('not.have.value', '');
  }

  /**
   * Resolves a logical field key to its selector.
   */
  private getSelector(field: ManualCourtFieldKey): string {
    switch (field) {
      case 'lja':
        return L.ljaInput;
      case 'pcr':
        return L.pcrInput;
      case 'enforcementCourt':
        return L.enforcementCourtInput;
      default:
        throw new Error(`Unknown court details field: ${field as string}`);
    }
  }
}
