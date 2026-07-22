@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Defendant - Adult or youth - View Defendant Account Summary - Add Comments Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-777 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5571
  Scenario: Complete View Defendant Account Adult or Youth Summary and Comments functionality Accessibility
    # Create & publish an individual (adultOrYouthOnly) account then check accessibility
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

    #  Check Accessibility on Add Comments Page
    When I open the Comments page from the defendant summary and verify the page contents
    Then I check the page for accessibility and navigate back

    # Check Accessibility with Form Data Entered
    When I save the following comments and verify the account header is "Mr John ACCDETAILSURNAME{uniqUpper}":
      | field   | text         |
      | Comment | Comment Test |
      | Line 1  | Line1 Test   |
      | Line 2  | Line2 Test   |
      | Line 3  | Line3 Test   |
    Then I check the page for accessibility
