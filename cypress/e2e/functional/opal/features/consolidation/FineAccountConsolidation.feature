@JIRA-LABEL:consolidation
Feature: Fines Account Consolidation
  Validate consolidation navigation from select business unit to account search.

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    Then I should be on the dashboard
    Then I open Consolidate accounts

  @JIRA-STORY:PO-2413 @JIRA-KEY:POT-3328
  Scenario: Consolidation account search for Individuals
    When I continue to the consolidation account search as an "Individual" defendant

    # AC1 - User is navigated to Search tab for Individuals after selecting BU and Individual
    Then I am on the consolidation Search tab for Individuals

    # AC8 - Switching tabs retains entered Search data
    And I enter the following consolidation search details:
      | account number            | 12345678   |
      | national insurance number | AB123456C  |
      | last name                 | Smith      |
      | first names               | John       |
      | date of birth             | 01/01/1990 |
      | address line 1            | 1 High St  |
      | postcode                  | SW1A 1AA   |
      | last name exact match     | true       |
      | first names exact match   | true       |
      | include aliases           | true       |
    And I switch consolidation tabs and return to Search
    Then the consolidation search details are retained:
      | account number            | 12345678   |
      | national insurance number | AB123456C  |
      | last name                 | Smith      |
      | first names               | John       |
      | date of birth             | 01/01/1990 |
      | address line 1            | 1 High St  |
      | postcode                  | SW1A 1AA   |
      | last name exact match     | true       |
      | first names exact match   | true       |
      | include aliases           | true       |
    Then I click Search on consolidation account search
    Then I see the consolidation search error page for "Individual"
    # AC3b All data previously entered on the Search page is retained when a user clicks back from the consolidation search error page
    When I go back from the consolidation search error page
    Then I am on the consolidation Search tab for Individuals
    And the consolidation search details are retained:
      | account number            | 12345678   |
      | national insurance number | AB123456C  |
      | last name                 | Smith      |
      | first names               | John       |
      | date of birth             | 01/01/1990 |
      | address line 1            | 1 High St  |
      | postcode                  | SW1A 1AA   |
      | last name exact match     | true       |
      | first names exact match   | true       |
      | include aliases           | true       |
    When I clear the consolidation search
    And I enter the following consolidation search details:
      | last name             | NoMatch |
      | last name exact match | true    |
    And I click Search on consolidation account search
    # AC2d - If no matching results are returned, Check your search is a hyperlink that returns the user to Search with all previously entered data retained
    Then I see the consolidation no matching results state
    When I click Check your search on consolidation no matching results
    Then I am on the consolidation Search tab for Individuals
    And the consolidation search details are retained:
      | last name             | NoMatch |
      | last name exact match | true    |

    And I click Search on consolidation account search
    Then I see the consolidation no matching results state
    # AC4 - A Back button will be displayed in the page header
    Then the consolidation page header back link is displayed
    # AC4a - Selecting Back will return the user to the Consolidate accounts Search tab with all previously entered search data retained
    When I click the consolidation page header back link
    Then I am on the consolidation Search tab for Individuals
    And the consolidation search details are retained:
      | last name             | NoMatchBack |
      | last name exact match | true        |

  @JIRA-STORY:PO-2413 @JIRA-KEY:POT-3328
  Scenario: Consolidation Successful account search for Individuals
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@hmcts.net":
      | Account_status                          | Submitted                           |
      | account.defendant.forenames             | Consolidation                       |
      | account.defendant.surname               | ResultLink{uniq}                    |
      | account.defendant.email_address_1       | consolidation.result{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078259314                         |
      | account.account_type                    | Fine                                |
      | account.prosecutor_case_reference       | CONS-RESULT-IND-{uniq}              |
      | account.collection_order_made           | false                               |
      | account.collection_order_made_today     | false                               |
      | account.payment_card_request            | false                               |
      | account.defendant.dob                   | 2002-05-15                          |
    When I open Consolidate accounts
    When I continue to the consolidation account search as an "Individual" defendant
    Then I am on the consolidation Search tab for Individuals
    And I enter the following consolidation search details:
      | last name             | ResultLink{uniq} |
      | last name exact match | true             |
    And I click Search on consolidation account search
    # AC1 - A user is navigated to the Results tab for Individuals when a valid search has been performed from the Search tab within the Consolidate accounts journey
    # AC1a - The Business unit row displays the Business Unit used in the search
    # AC1b - The Defendant type row displays Individual
    Then I am on the consolidation Results tab for Individuals
    # AC4 - The Account column displays the account number as a hyperlink. Selecting it will open the relevant FAE – At a glance page in a new tab
    And the created consolidation result account number is displayed as a hyperlink
    When I open the created consolidation result account in a new tab
    Then I should see the account header contains "Mr Consolidation RESULTLINK{uniqUpper}"

  @JIRA-STORY:PO-2413 @JIRA-KEY:POT-3328 @only
  Scenario: Consolidation search excludes zero balance accounts for Individuals
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@hmcts.net":
      | Account_status                               | Submitted                                 |
      | account.defendant.forenames                  | Zero                                      |
      | account.defendant.surname                    | ConsolidationZeroBalance{uniq}            |
      | account.defendant.email_address_1            | consolidation.zero.balance{uniq}@test.com |
      | account.defendant.telephone_number_home      | 02078259310                               |
      | account.account_type                         | Fine                                      |
      | account.prosecutor_case_reference            | CONS-ZERO-BAL-IND-A-{uniq}                |
      | account.collection_order_made                | false                                     |
      | account.collection_order_made_today          | false                                     |
      | account.payment_card_request                 | false                                     |
      | account.defendant.dob                        | 2001-05-15                                |
      | account.offences.0.impositions.0.amount_paid | 125                                       |
    And I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@hmcts.net":
      | Account_status                          | Submitted                                    |
      | account.defendant.forenames             | Visible                                      |
      | account.defendant.surname               | ConsolidationZeroBalance{uniq}               |
      | account.defendant.email_address_1       | consolidation.visible.balance{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078259311                                  |
      | account.account_type                    | Fine                                         |
      | account.prosecutor_case_reference       | CONS-ZERO-BAL-IND-B-{uniq}                   |
      | account.collection_order_made           | false                                        |
      | account.collection_order_made_today     | false                                        |
      | account.payment_card_request            | false                                        |
      | account.defendant.dob                   | 2002-05-15                                   |
    When I open Consolidate accounts
    And I continue to the consolidation account search as an "Individual" defendant
    Then I am on the consolidation Search tab for Individuals
    And I enter the following consolidation search details:
      | last name | ConsolidationZero |

    And I click Search on consolidation account search
    Then I am on the consolidation Results tab for Individuals
    And the created consolidation result account number is displayed as a hyperlink
    And the consolidation results exclude accounts with a balance of "£0.00"

  @JIRA-STORY:PO-2414 @JIRA-KEY:POT-3329
  Scenario: Consolidation account search for Companies
    When I continue to the consolidation account search as an "Company" defendant
    # AC1 - User is navigated to Search tab for Companies after selecting BU and Company
    Then I am on the consolidation Search tab for Companies

    # AC8 - Switching tabs retains entered Search data
    And I enter the following consolidation search details:
      | account number     | 12345678     |
      | company name       | Company Name |
      | address line 1     | 1 High St    |
      | postcode           | SW1A 1AA     |
      | Search exact match | true         |
      | include aliases    | true         |
    And I switch consolidation tabs and return to Search
    Then the consolidation search details are retained:
      | account number     | 12345678     |
      | company name       | Company Name |
      | address line 1     | 1 High St    |
      | postcode           | SW1A 1AA     |
      | Search exact match | true         |
      | include aliases    | true         |
    Then I click Search on consolidation account search
    Then I see the consolidation search error page for "Company"
    # AC3b All data previously entered on the Search page is retained when a user clicks back from the consolidation search error page
    When I go back from the consolidation search error page
    Then I am on the consolidation Search tab for Companies
    And the consolidation search details are retained:
      | account number     | 12345678     |
      | company name       | Company Name |
      | address line 1     | 1 High St    |
      | postcode           | SW1A 1AA     |
      | Search exact match | true         |
      | include aliases    | true         |
    When I clear the consolidation search
    And I enter the following consolidation search details:
      | company name       | No Match Co |
      | Search exact match | true        |
    And I click Search on consolidation account search
    # AC2d - If no matching results are returned, Check your search is a hyperlink that returns the user to Search with all previously entered data retained
    Then I see the consolidation no matching results state
    When I click Check your search on consolidation no matching results
    Then I am on the consolidation Search tab for Companies
    And the consolidation search details are retained:
      | company name       | No Match Co |
      | Search exact match | true        |
    And I click Search on consolidation account search
    Then I see the consolidation no matching results state
    # AC4 - A Back button will be displayed in the page header
    Then the consolidation page header back link is displayed
    # AC4a - Selecting Back will return the user to the Consolidate accounts Search tab with all previously entered search data retained
    When I click the consolidation page header back link
    Then I am on the consolidation Search tab for Companies
    And the consolidation search details are retained:
      | company name       | No Match Back Co |
      | Search exact match | true             |


  @JIRA-STORY:PO-2413 @JIRA-KEY:POT-3328
  Scenario: Consolidation Successful account search for Company
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@hmcts.net":
      | Account_status                    | Submitted                              |
      | account.defendant.company_name    | Consolidation Result Co {uniq}         |
      | account.defendant.email_address   | consolidation.result.co{uniq}@test.com |
      | account.defendant.post_code       | AB23 4RN                               |
      | account.prosecutor_case_reference | CONS-RESULT-COMP-{uniq}                |
      | account.account_type              | Fine                                   |
    When I open Consolidate accounts
    When I continue to the consolidation account search as an "Company" defendant
    Then I am on the consolidation Search tab for Companies
    And I enter the following consolidation search details:
      | company name       | Consolidation Result Co {uniq} |
      | Search exact match | true                           |
    And I click Search on consolidation account search
    # AC1 - A user is navigated to the Results tab for Companies when a valid search has been performed from the Search tab within the Consolidate accounts journey
    # AC1a - The Business unit row displays the Business Unit used in the search
    # AC1b - The Defendant type row displays Company
    Then I am on the consolidation Results tab for Companies
    # AC4 - The Account column displays the account number as a hyperlink. Selecting it will open the relevant FAE – At a glance page in a new tab
    And the created consolidation result account number is displayed as a hyperlink
    When I open the created consolidation result account in a new tab
    Then I should see the account header contains "Consolidation Result Co {uniqUpper}"
