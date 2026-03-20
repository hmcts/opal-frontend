@JIRA-LABEL:account-enquiry
Feature: Account Enquiries – Add Account Note
  As a caseworker
  I want to record and discard defendant account notes safely
  So that notes are captured without losing existing account context

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  Rule: Adult or youth defendant baseline
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                          | Submitted                                 |
        | account.defendant.forenames             | James                                     |
        | account.defendant.surname               | GrahamAddNoteSurname{uniq}                |
        | account.defendant.email_address_1       | James.GrahamAddNoteSurname{uniq}@test.com |
        | account.defendant.telephone_number_home | 02078259314                               |
        | account.account_type                    | Fine                                      |
        | account.prosecutor_case_reference       | PCR-AUTO-002                              |
        | account.collection_order_made           | false                                     |
        | account.collection_order_made_today     | false                                     |
        | account.payment_card_request            | false                                     |
        | account.defendant.dob                   | 2002-05-15                                |
      When I search for the account by last name "GrahamAddNoteSurname{uniq}" and open the latest result
      Then I should see the page header contains "Mr James GRAHAMADDNOTESURNAME{uniqUpper}"

    @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-KEY:POT-3080
    Scenario: Saving a defendant account note returns to account details
      When I record an account note "Valid test account note"
      Then I should see the header "Mr James GRAHAMADDNOTESURNAME{uniqUpper}" and the URL should contain "details"

    @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-KEY:POT-3081
    Scenario: Cancelling an empty account note keeps the defendant summary
      When I start an account note and cancel without saving
      Then I should see the header "Mr James GRAHAMADDNOTESURNAME{uniqUpper}" and the URL should contain "details"

    @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-KEY:POT-3082
    Scenario: Cancelling a populated account note discards the draft
      When I start an account note with "This is a test account note for validation" and cancel
      Then I should see the header containing text "Mr James GRAHAMADDNOTESURNAME{uniqUpper}"

    @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-KEY:POT-3083
    Scenario: Navigating back from a populated account note discards the draft
      When I start an account note with "This is a test account note for back button" and confirm browser back
      Then I should see the header "Mr James GRAHAMADDNOTESURNAME{uniqUpper}" and the URL should contain "details"

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

    @JIRA-KEY:POT-3084
    Scenario: Saving a company account note returns to account details
      When I record an account note "Valid test account note"
      Then the URL should contain "details"

    @JIRA-KEY:POT-3085
    Scenario: Cancelling an empty company account note keeps the summary
      When I start an account note and cancel without saving
      Then the URL should contain "details"

    @JIRA-KEY:POT-3086
    Scenario: Cancelling a populated company account note discards the draft
      When I start an account note with "This is a test account note for validation" and cancel
      Then I should see the header containing text "AccNote comp{uniqUpper}"

    @JIRA-KEY:POT-3087
    Scenario: Navigating back from a populated company account note discards the draft
      When I start an account note with "This is a test account note for back button" and confirm browser back
      Then I should see the header "AccNote comp{uniqUpper}" and the URL should contain "details"
