@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Defendant - Parent or guardian to pay - View Defendant Account Summary - Add Comments Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-777 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5573
  Scenario: Check View Defendant Parent Guardian Account Summary and Comments Accessibility with Axe-Core
    # Create & publish a pgToPay account then check accessibility
    Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                          | Submitted                             |
      | account.defendant.forenames             | Michael                               |
      | account.defendant.surname               | ParentGuardianSurname{uniq}           |
      | account.defendant.email_address_1       | Michael.ParentGuardian{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078259318                           |
      | account.account_type                    | Fine                                  |
      | account.prosecutor_case_reference       | PCR-AUTO-007                          |
      | account.collection_order_made           | false                                 |
      | account.collection_order_made_today     | false                                 |
      | account.payment_card_request            | false                                 |
      | account.defendant.dob                   | 2010-05-15                            |
    When I search for the account by last name "ParentGuardianSurname{uniq}" and verify the page header is "Miss Michael PARENTGUARDIANSURNAME{uniqUpper}"

    # Check Accessibility on Add Comments Page for Parent Guardian Account
    When I open the Comments page from the defendant summary and verify the page contents
    Then I check the page for accessibility and navigate back

    # Check Accessibility with Parent Guardian Form Data Entered
    When I save the following comments and verify the account header is "Miss Michael PARENTGUARDIANSURNAME{uniqUpper}":
      | field   | text                    |
      | Comment | Parent Guardian Comment |
      | Line 1  | Parent Guardian Line1   |
      | Line 2  | Parent Guardian Line2   |
      | Line 3  | Parent Guardian Line3   |


    # Check accessibility with populated comments
    Then I check the page for accessibility
