@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Defendant - Company - Add Account Note - View Defendant Account Details Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts
  @R1B @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5505
  Scenario: Check Add Account Note Accessibility with Axe-Core for Company Account
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted                   |
      | account.defendant.company_name      | AccNote comp{uniq}          |
      | account.defendant.email_address_1   | AAccNotecomp{uniq}@test.com |
      | account.defendant.post_code         | AB23 4RN                    |
      | account.account_type                | Fine                        |
      | account.prosecutor_case_reference   | PCR-AUTO-003                |
      | account.collection_order_made       | false                       |
      | account.collection_order_made_today | false                       |
      | account.payment_card_request        | false                       |
    When I open the company account details for "AccNote comp{uniq}"

    ## Check Accessibility on Add Account Note Page for Company
    When I open the Add account note screen and verify the header is Add account note
    Then I check the page for accessibility

    ## Check Accessibility with Form Data Entered for Company
    And I enter "Valid test account note for company accessibility testing" into the notes field and save the note
    Then I should see the header containing text "AccNote comp{uniqUpper}"
    And I check the page for accessibility
