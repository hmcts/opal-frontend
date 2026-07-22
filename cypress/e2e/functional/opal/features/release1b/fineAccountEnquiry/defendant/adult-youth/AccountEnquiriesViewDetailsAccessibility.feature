@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Defendant - Adult or youth - Account Enquiries - View Account Details Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-1593 @JIRA-STORY:PO-866 @JIRA-STORY:PO-1110 @JIRA-STORY:PO-1127 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5466
  Scenario: Check Account Details View Accessibility with Axe-Core for Individual Account
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
    When I search for the account by last name "AccDetailSurname{uniq}"
    ## Check Accessibility on Search Results Page
    Then I check the page for accessibility
    And I select the latest published account and verify the header is "Mr John ACCDETAILSURNAME{uniqUpper}"
    And I go to the Defendant details section and the header is "Defendant details"
    And I should see the convert to company account action
    ## Check Accessibility on Defendant Details Page
    Then I check the page for accessibility
    When I start converting the account to a company account
    Then I should see the convert to company confirmation screen for defendant "Mr John ACCDETAILSURNAME{uniqUpper}"
    And I check the page for accessibility

