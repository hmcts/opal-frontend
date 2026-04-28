@JIRA-LABEL:primary-nav-and-dashboards
Feature: Fines primary navigation visibility through journeys

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"

@JIRA-EPIC:PO-2627
  @JIRA-STORY:PO-3722 @JIRA-KEY:POT-7695
  Scenario: Starting a draft account journey from Accounts hides the primary navigation
    When I open Create and Manage Draft Accounts
    And I click the Create account button on Create and Manage Draft Accounts
    Then I should see the header containing text "Do you want to create a new account or transfer in?"
    And I do not see the Fines primary navigation

    When I choose "New" and continue to create account page
    Then I should see the header containing text "Create account"
    And I do not see the Fines primary navigation

@JIRA-EPIC:PO-2627
  @JIRA-STORY:PO-3722 @JIRA-KEY:POT-7696
  Scenario: Search-led account note journeys hide the primary navigation until the user returns to browse mode
    Given I clear all approved accounts
    And I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                              | Submitted                  |
      | account.defendant.forenames                 | Journey                    |
      | account.defendant.surname                   | PrimaryNav{uniq}           |
      | account.defendant.email_address_1           | nav.journey{uniq}@test.com |
      | account.defendant.telephone_number_home     | 02078250091                |
      | account.defendant.national_insurance_number | AB123456D                  |
      | account.defendant.address_line_1            | 1 Navigation Street        |
      | account.defendant.post_code                 | AB1 2EF                    |
      | account.account_type                        | Fine                       |
      | account.prosecutor_case_reference           | PCRNAVJOURNEY{uniqUpper}   |
      | account.collection_order_made               | false                      |
      | account.collection_order_made_today         | false                      |
      | account.payment_card_request                | false                      |
      | account.defendant.dob                       | 2001-05-15                 |
    When I start the Add account note journey for "PrimaryNav{uniq}"
    Then I should see the header containing text "Add account note"
    And I do not see the Fines primary navigation

    When I complete the Add account note journey with note "Primary navigation journey note"
    Then I should see the account summary header contains "PRIMARYNAV{uniqUpper}"
    And I see the Fines primary navigation

@JIRA-EPIC:PO-2627
  @JIRA-STORY:PO-3722 @JIRA-KEY:POT-7697
  Scenario: Canceling a Search-led account note journey shows the primary navigation again
    Given I clear all approved accounts
    And I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                              | Submitted                 |
      | account.defendant.forenames                 | Journey                   |
      | account.defendant.surname                   | PrimaryNavCancel{uniq}    |
      | account.defendant.email_address_1           | nav.cancel{uniq}@test.com |
      | account.defendant.telephone_number_home     | 02078250092               |
      | account.defendant.national_insurance_number | AB123456E                 |
      | account.defendant.address_line_1            | 2 Navigation Street       |
      | account.defendant.post_code                 | AB1 2EG                   |
      | account.account_type                        | Fine                      |
      | account.prosecutor_case_reference           | PCRNAVCANCEL{uniqUpper}   |
      | account.collection_order_made               | false                     |
      | account.collection_order_made_today         | false                     |
      | account.payment_card_request                | false                     |
      | account.defendant.dob                       | 2001-05-15                |
    When I start the Add account note journey for "PrimaryNavCancel{uniq}"
    Then I should see the header containing text "Add account note"
    And I do not see the Fines primary navigation

    When I cancel the Add account note journey
    Then I should see the account summary header contains "PRIMARYNAVCANCEL{uniqUpper}"
    And I see the Fines primary navigation

