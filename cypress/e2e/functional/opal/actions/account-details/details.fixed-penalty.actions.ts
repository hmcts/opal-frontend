/**
 * @file details.fixed-penalty.actions.ts
 * @description Actions and assertions for the Fixed penalty section on Account Details.
 */
import { AccountFixedPenaltyDetailsLocators as L } from '../../../../../shared/selectors/account-details/account.fixed-penalty.details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('AccountDetailsFixedPenaltyActions');

/** Actions and assertions for the Fixed penalty tab on Account Details. */
export class AccountDetailsFixedPenaltyActions {
  private readonly common = new CommonActions();

  /**
   * Asserts the Fixed penalty section header contains expected text.
   *
   * @param expected Expected header text.
   */
  public assertSectionHeader(expected: string): void {
    cy.get(L.fixedPenaltyTabHeader.title, { timeout: 10_000 })
      .should('be.visible')
      .invoke('text')
      .then((t) => expect(t.trim().toLowerCase()).to.contain(expected.trim().toLowerCase()));
  }

  /**
   * Asserts the Fixed penalty detail values shown on the tab.
   *
   * @param expected - Map of detail labels to expected visible values.
   */
  public assertDetails(expected: Record<string, string>): void {
    const fieldSelectors: Record<string, string> = {
      'issuing authority': L.fields.issuingAuthority,
      'ticket number': L.fields.ticketNumber,
      'registration number': L.fields.registrationNumber,
      'driving licence': L.fields.drivingLicence,
      'notice to owner or hirer number (nto/nth)': L.fields.noticeNumber,
      'date notice to owner was issued': L.fields.issuedDate,
      'time of offence': L.fields.timeOfOffence,
      'place of offence': L.fields.placeOfOffence,
    };

    cy.get(L.fixedPenaltyTabRoot, this.common.getTimeoutOptions()).should('be.visible');

    Object.entries(expected).forEach(([label, value]) => {
      const normalizedLabel = label.trim().toLowerCase();
      const selector = fieldSelectors[normalizedLabel];

      if (!selector) {
        throw new Error(
          `Unsupported fixed penalty detail label "${label}". Supported labels: ${Object.keys(fieldSelectors).join(', ')}`,
        );
      }

      log('assert', 'Asserting fixed penalty detail value', { label, value });

      cy.get(selector, this.common.getTimeoutOptions())
        .should('be.visible')
        .invoke('text')
        .then((text) => expect(this.normalize(text)).to.contain(this.normalize(value)));
    });
  }

  /**
   * Asserts the vehicle-only fixed-penalty fields are not rendered.
   */
  public assertVehicleFieldsNotPresent(): void {
    log('assert', 'Asserting vehicle-only fixed penalty fields are absent');

    cy.get(L.fixedPenaltyTabRoot, this.common.getTimeoutOptions()).should('be.visible');
    cy.get(L.fields.registrationNumber, { timeout: 2000 }).should('not.exist');
    cy.get(L.fields.drivingLicence, { timeout: 2000 }).should('not.exist');
    cy.get(L.fields.noticeNumber, { timeout: 2000 }).should('not.exist');
    cy.get(L.fields.issuedDate, { timeout: 2000 }).should('not.exist');
  }

  /**
   * Normalizes whitespace for consistent text comparisons.
   *
   * @param value - Raw text value to normalize.
   * @returns Normalized string with collapsed whitespace.
   */
  private normalize(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }
}
