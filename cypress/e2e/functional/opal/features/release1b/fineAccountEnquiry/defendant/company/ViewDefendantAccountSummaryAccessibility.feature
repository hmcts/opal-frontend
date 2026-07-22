@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Defendant - Company - View Defendant Account Summary - Add Comments Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-777 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5572
  Scenario: Check View Defendant Company Account Summary and Comments Accessibility with Axe-Core
    # Create & publish a company account then check accessibility
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
    When I open the company account details for "Accdetail comp{uniq}"

    # Check Accessibility on Add Comments Page for Company
    When I open the Comments page from the defendant summary and verify the page contents
    Then I check the page for accessibility and navigate back

    # Check Accessibility with Company Form Data Entered
    When I save the following comments and verify the account header is "Accdetail comp{uniq}":
      | field   | text            |
      | Comment | Company Comment |
      | Line 1  | Company Line1   |
      | Line 2  | Company Line2   |
      | Line 3  | Company Line3   |
    Then I check the page for accessibility
