import { AccountEnquiryResultsLocators as R } from '../../shared/selectors/account-enquiry-results.locators';

/** Is the account link visible on the current results page? */
export function HasAccountLinkOnPage(accountNumber: string): Cypress.Chainable<boolean> {
  return cy.get('body', { timeout: 500 }).then(($b) => {
    const sel = R.linkByAccountNumber(accountNumber);
    return $b.find(sel).length > 0;
  });
}
