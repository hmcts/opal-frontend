import { describe, expect, it } from 'vitest';
import { AccountEnquiryResultsLocators } from './account.enquiry.results.locators';

describe('AccountEnquiryResultsLocators', () => {
  it('should match account number links in both defendant and minor creditor result tables', () => {
    const selector = AccountEnquiryResultsLocators.linkByAccountNumber('25000001E');

    expect(selector).toContain('app-fines-sa-results-defendant-table-wrapper a.govuk-link:contains("25000001E")');
    expect(selector).toContain('app-fines-sa-results-minor-creditor-table-wrapper a.govuk-link:contains("25000001E")');
  });
});
