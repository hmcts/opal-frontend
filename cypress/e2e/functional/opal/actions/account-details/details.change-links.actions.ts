import { AccountParentOrGuardianDetailsLocators as PG } from '../../../../../shared/selectors/account-details/account.parent-guardian.details.locators';
import { AccountPaymentTermsDetailsLocators as PT } from '../../../../../shared/selectors/account-details/account.payment-terms.details.locators';
import { PAYMENT_TERMS_AMEND_ELEMENTS as A } from '../../../../../shared/selectors/account-enquiry/account.enquiry.payment-terms-amend.locators';
import { applyUniqPlaceholder } from '../../../../../support/utils/stringUtils';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { AccountDetailsNavActions } from './details.nav.actions';

const log = createScopedLogger('AccountDetailsChangeLinksActions');

type AmendPartyType = 'individual' | 'company' | 'parentGuardian';

/**
 * Actions for opening and asserting Account Enquiry Change-link journeys.
 */
export class AccountDetailsChangeLinksActions {
  private readonly navActions = new AccountDetailsNavActions();

  /**
   * Opens a Change link from the Defendant tab summary card with the given title.
   *
   * @param section - Visible summary card title to target.
   */
  openDefendantTabChangeLink(section: string): void {
    const resolvedSection = applyUniqPlaceholder(section);
    log('action', 'Opening Defendant tab section Change link', { section: resolvedSection });

    this.navActions.goToDefendantTab();
    cy.contains('app-fines-acc-defendant-details-defendant-tab .govuk-summary-card', resolvedSection)
      .should('be.visible')
      .within(() => {
        cy.contains('a', 'Change').should('be.visible').click();
      });
  }

  /**
   * Opens a Change link from the Parent or guardian tab summary card with the given title.
   *
   * @param section - Visible summary card title to target.
   */
  openParentGuardianTabChangeLink(section: string): void {
    const resolvedSection = applyUniqPlaceholder(section);
    log('action', 'Opening Parent or guardian tab section Change link', { section: resolvedSection });

    this.navActions.goToParentGuardianTab();

    const cardSelectorBySection: Record<string, string> = {
      'Parent or guardian details': PG.parentOrGuardian.card,
      'Contact details': PG.contact.card,
      'Employer details': PG.employer.card,
    };

    const cardSelector = cardSelectorBySection[resolvedSection];
    if (!cardSelector) {
      throw new Error(`Unsupported Parent or guardian section "${resolvedSection}"`);
    }

    cy.get(cardSelector, { timeout: 10_000 })
      .should('be.visible')
      .within(() => {
        cy.contains('a', 'Change').should('be.visible').click();
      });
  }

  /**
   * Asserts the amend route, fragment, heading, form, and target section.
   *
   * @param partyType - Amend route target.
   * @param fragment - Expected fragment inside the amend page.
   */
  assertOnAmendRouteWithFragment(partyType: AmendPartyType, fragment: string): void {
    const resolvedFragment = applyUniqPlaceholder(fragment);
    const resolvedPartyType = applyUniqPlaceholder(partyType);
    const expectedHeader =
      resolvedPartyType === 'company'
        ? 'Company details'
        : resolvedPartyType === 'parentGuardian'
          ? 'Parent or guardian details'
          : 'Defendant details';
    const expectedPathSegment = `/party/${resolvedPartyType}/amend`;

    log('assert', 'Asserting amend route and fragment', {
      partyType: resolvedPartyType,
      fragment: resolvedFragment,
      expectedHeader,
    });

    cy.location('pathname', { timeout: 10_000 }).should('include', expectedPathSegment);
    cy.location('hash', { timeout: 10_000 }).should('eq', `#${resolvedFragment}`);
    cy.get('main h1.govuk-heading-l', { timeout: 10_000 }).should('be.visible').and('contain.text', expectedHeader);
    cy.get('app-fines-acc-debtor-add-amend-form', { timeout: 10_000 }).should('be.visible');
    cy.get(`#${resolvedFragment}`, { timeout: 10_000 }).scrollIntoView().should('be.visible');
  }

  /**
   * Asserts there is exactly one Change link in the Payment terms panel and page.
   */
  assertSinglePaymentTermsChangeLink(): void {
    log('assert', 'Asserting Payment terms Change link is scoped to the panel');

    cy.get(PT.tabRoot, { timeout: 10_000 })
      .should('be.visible')
      .within(() => {
        cy.contains('a', 'Change').should('be.visible');
        cy.get('a')
          .filter((_, link) => link.textContent?.trim() === 'Change')
          .should('have.length', 1);
      });

    cy.get('main', { timeout: 10_000 })
      .find('a')
      .filter((_, link) => link.textContent?.trim() === 'Change')
      .should('have.length', 1);
  }

  /**
   * Asserts the Payment terms amend screen is displayed.
   */
  assertPaymentTermsAmendScreen(): void {
    log('assert', 'Asserting Payment terms amend screen is visible');

    cy.location('pathname', { timeout: 10_000 }).should('include', '/payment-terms/amend');
    cy.location('hash', { timeout: 10_000 }).should('eq', '#select-payment-terms');
    cy.get(A.form, { timeout: 10_000 }).should('be.visible');
    cy.get(A.pageHeading, { timeout: 10_000 }).should('contain.text', 'Payment terms');
  }
}
