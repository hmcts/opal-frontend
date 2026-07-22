@JIRA-LABEL:account-enquiry
Feature: Defendant - Adult or youth - Account Enquiries – Add Account Note
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


    @R1B @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5506
    Scenario: Saving a defendant account note returns to account details
      When I record an account note "Valid test account note"
      Then I should see the header "Mr James GRAHAMADDNOTESURNAME{uniqUpper}" and the URL should contain "details"


    @R1B @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5507
    Scenario: Cancelling an empty account note keeps the defendant summary
      When I start an account note and cancel without saving
      Then I should see the header "Mr James GRAHAMADDNOTESURNAME{uniqUpper}" and the URL should contain "details"


    @R1B @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5508
    Scenario: Cancelling a populated account note discards the draft
      When I start an account note with "This is a test account note for validation" and cancel
      Then I should see the header containing text "Mr James GRAHAMADDNOTESURNAME{uniqUpper}"


    @R1B @JIRA-STORY:PO-771 @JIRA-STORY:PO-807 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5509
    Scenario: Navigating back from a populated account note discards the draft
      When I start an account note with "This is a test account note for back button" and confirm browser back
      Then I should see the header "Mr James GRAHAMADDNOTESURNAME{uniqUpper}" and the URL should contain "details"

