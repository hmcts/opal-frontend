@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Defendant - Company - Defendant account enforcement - Collection order Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts
  @R1B @JIRA-STORY:PO-1848 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5348
  Scenario: Check Change Collection Order status accessibility for a company account
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                                  | Submitted                               |
      | account.defendant.company_name                  | Collection Order Company{uniq}          |
      | account.defendant.email_address_1               | collection.order.company{uniq}@test.com |
      | account.defendant.post_code                     | AB23 4RN                                |
      | account.account_type                            | Fine                                    |
      | account.prosecutor_case_reference               | PCR-ENF-COMP-{uniqUpper}                |
      | account.collection_order_made                   | false                                   |
      | account.collection_order_made_today             | false                                   |
      | account.payment_card_request                    | false                                   |
      | account.payment_terms.enforcements[0].result_id | PRIS                                    |
    When I open the company account details for "Collection Order Company{uniq}"
    And I go to the Enforcement tab
    And I open the Change Collection Order status form
    Then I should see the Change Collection Order status page
    And I check the page for accessibility
