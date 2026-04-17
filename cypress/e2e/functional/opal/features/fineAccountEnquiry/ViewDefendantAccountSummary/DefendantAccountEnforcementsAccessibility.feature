@JIRA-LABEL:account-enquiry
@JIRA-STORY:PO-2322
Feature: Defendant account enforcement - Collection order Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @JIRA-KEY:POT-5225
  Scenario: Check Change Collection Order status accessibility for an adult or youth account
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                                  | Submitted                             |
      | account.defendant.forenames                     | Pearl                                 |
      | account.defendant.surname                       | CollectionOrderAdult{uniq}            |
      | account.defendant.email_address_1               | Pearl.collection.order{uniq}@test.com |
      | account.defendant.telephone_number_home         | 02078250021                           |
      | account.account_type                            | Fine                                  |
      | account.prosecutor_case_reference               | PCR-ENF-ADULT-{uniqUpper}             |
      | account.collection_order_made                   | false                                 |
      | account.collection_order_made_today             | false                                 |
      | account.payment_card_request                    | false                                 |
      | account.defendant.dob                           | 2001-05-15                            |
      | account.payment_terms.enforcements[0].result_id | PRIS                                  |
    When I search for the account by last name "CollectionOrderAdult{uniq}" and open the latest result
    And I go to the Enforcement tab
    And I open the Change Collection Order status form
    Then I should see the Change Collection Order status page
    And I check the page for accessibility

  @JIRA-KEY:POT-5226
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

  @JIRA-KEY:POT-5227
  Scenario: Check Change Collection Order status accessibility for a company account
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                                  | Submitted                               |
      | account.defendant.company_name                  | Collection Order Company{uniq}          |
      | account.defendant.email_address_1               | collection.order.company{uniq}@test.com |
      | account.defendant.post_code                     | AB23 4RN                                |
      | account.account_type                            | Fine                                    |
      | account.prosecutor_case_reference               | PCR-ENF-COMP-{uniqUpper}                |
      | account.collection_order_made                   | false                                   |
      | account.collection_order_made_today             | false                                   |
      | account.payment_card_request                    | false                                   |
      | account.payment_terms.enforcements[0].result_id | PRIS                                    |
    When I open the company account details for "Collection Order Company{uniq}"
    And I go to the Enforcement tab
    And I open the Change Collection Order status form
    Then I should see the Change Collection Order status page
    And I check the page for accessibility
