@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Defendant - Parent or guardian to pay - Defendant account enforcement - Collection order Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts
  @R1B @JIRA-STORY:PO-1848 @JIRA-STORY:PO-1860 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5347
  Scenario: Check Change Collection Order status accessibility for an account with parent or guardian details
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
    And I go to the Enforcement tab
    And I open the Change Collection Order status form
    Then I should see the Change Collection Order status page
    And I check the page for accessibility
