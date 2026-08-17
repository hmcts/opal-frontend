@JIRA-LABEL:account-enquiry
@JIRA-STORY:PO-777
Feature: Adult Youth View Defendant Account Summary

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  Rule: Adult or youth account summary comments
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                          | Submitted                            |
        | account.defendant.forenames             | John                                 |
        | account.defendant.surname               | AccDetailSurname{uniq}               |
        | account.defendant.email_address_1       | John.AccDetailSurname{uniq}@test.com |
        | account.defendant.telephone_number_home | 02078259314                          |
        | account.account_type                    | Fine                                 |
        | account.prosecutor_case_reference       | PCR-AUTO-002                         |
        | account.collection_order_made           | false                                |
        | account.collection_order_made_today     | false                                |
        | account.payment_card_request            | false                                |
        | account.defendant.dob                   | 2002-05-15                           |
      And I search for the account by last name "AccDetailSurname{uniq}" and verify the page header is "Mr John ACCDETAILSURNAME{uniqUpper}"

    @JIRA-EPIC:PO-812 @R1B @JIRA-STORY:PO-777 @JIRA-TEST-KEY:PO-5475
    Scenario: Opening comments and cancelling returns to the account summary
      When I open the Comments page from the defendant summary and verify the page contents
      And I cancel with confirmation on the Comments page
      Then I should see the account summary header contains "Mr John ACCDETAILSURNAME{uniqUpper}"

    @JIRA-EPIC:PO-812 @R1B @JIRA-STORY:PO-777 @JIRA-TEST-KEY:PO-10041
    Scenario: Staying on the comments route guard keeps the user on the flow until they confirm leaving
      When I verify route guard behaviour when cancelling comments with "Comment Test"
      Then I should see the account summary header contains "Mr John ACCDETAILSURNAME{uniqUpper}"

    @JIRA-EPIC:PO-812 @R1B @JIRA-STORY:PO-777 @JIRA-TEST-KEY:PO-10042
    Scenario: Saving comments updates the account summary and comments form values
      When I save the following comments and verify the account header is "Mr John ACCDETAILSURNAME{uniqUpper}":
        | field   | text         |
        | Comment | Comment Test |
        | Line 1  | Line1 Test   |
        | Line 2  | Line2 Test   |
        | Line 3  | Line3 Test   |
      Then Verify updated comments display in Comments section:
        | Comment | Comment Test |
        | Line 1  | Line1 Test   |
        | Line 2  | Line2 Test   |
        | Line 3  | Line3 Test   |
      And I should see the following values on the Comments form:
        | Comment | Comment Test |
        | Line 1  | Line1 Test   |
        | Line 2  | Line2 Test   |
        | Line 3  | Line3 Test   |
