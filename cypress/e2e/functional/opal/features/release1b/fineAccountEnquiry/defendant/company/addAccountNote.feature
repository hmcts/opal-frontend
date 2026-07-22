@JIRA-LABEL:account-enquiry
Feature: Defendant - Company - Account Enquiries – Add Account Note
  As a caseworker
  I want to record and discard defendant account notes safely
  So that notes are captured without losing existing account context

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  Rule: Company account baseline

    Background:
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
      Then I should see the account header contains "AccNote comp{uniqUpper}"


    @R1B @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5510
    Scenario: Saving a company account note returns to account details
      When I record an account note "Valid test account note"
      Then the URL should contain "details"


    @R1B @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5511
    Scenario: Cancelling an empty company account note keeps the summary
      When I start an account note and cancel without saving
      Then the URL should contain "details"


    @R1B @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5512
    Scenario: Cancelling a populated company account note discards the draft
      When I start an account note with "This is a test account note for validation" and cancel
      Then I should see the header containing text "AccNote comp{uniqUpper}"


    @R1B @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5513
    Scenario: Navigating back from a populated company account note discards the draft
      When I start an account note with "This is a test account note for back button" and confirm browser back
      Then I should see the header "AccNote comp{uniqUpper}" and the URL should contain "details"
