@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Defendant - Company - Account Enquiries - View Account Details Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-967 @JIRA-STORY:PO-1111 @JIRA-STORY:PO-1128 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5467
  Scenario: Check Account Details View Accessibility with Axe-Core for Company Account
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted                    |
      | account.defendant.company_name      | Accdetail comp{uniq}         |
      | account.defendant.email_address_1   | Accdetailcomp{uniq}@test.com |
      | account.defendant.post_code         | AB23 4RN                     |
      | account.account_type                | Fine                         |
      | account.prosecutor_case_reference   | PCR-AUTO-003                 |
      | account.collection_order_made       | false                        |
      | account.collection_order_made_today | false                        |
      | account.payment_card_request        | false                        |
    When I search for the account by company name "Accdetail comp{uniq}"
    # Check Accessibility on Company Search Results Page
    Then I check the page for accessibility
    # Check Accessibility on Company Defendant Details Page
    And I select the latest published account and verify the header is "Accdetail comp{uniqUpper}"
    And I go to the Defendant details section and the header is "Company details"
    And I should see the convert to individual account action
    And I should not see the convert to company account text
    Then I check the page for accessibility
    When I start converting the account to an individual account
    Then I should see the convert to individual confirmation screen for company "Accdetail comp{uniq}"
    And I check the page for accessibility


