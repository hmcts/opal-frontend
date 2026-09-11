@JIRA-LABEL:account-enquiry
Feature: Minor Creditor Search And Matches Journeys
  High-value end-to-end journeys for Search and Matches.
  These scenarios cover the core business flows for finding and reviewing
  minor creditor matching results, including the legacy-data scaffold path,
  while leaving detailed field validation and request-shape coverage to the existing feature files.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1BDrop2UatTechJCDE @JIRA-STORY:PO-715 @JIRA-STORY:PO-706 @JIRA-STORY:PO-708 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5292
  Scenario: Search for a minor creditor account and review the matching results
    Given a published account exists with an individual minor creditor:
      | prosecutor case reference | PCRJRNYMIN{uniqUpper} |
      | first name                | Mina                  |
      | last name                 | JourneyMinor{uniq}    |
      | address line 1            | 1 High Street         |
      | postcode                  | MC1 1AA               |
    And I am on the Account Search page - Individuals form displayed by default
    When I view the Minor creditors search form
    And I search using the following inputs:
      | minor creditor type  | Individual         |
      | individual last name | JourneyMinor{uniq} |
      | first names          | Mina               |
      | address line 1       | 1 High Street      |
      | postcode             | MC1 1AA            |
    Then I see the Search results page
    And I see the Minor creditors search results:
      | Name           | JourneyMinor{uniq}, Mina |
      | Address line 1 | 1 High Street            |

  @R1BDrop2 @JIRA-DEFECT:PO-9149 @JIRA-EPIC:PO-2821
  Scenario: Open the defendant linked from a minor creditor search result
    Given a published account exists with an individual minor creditor:
      | prosecutor case reference | PCRMINDEFLINK{uniqUpper} |
      | first name                | Mina                     |
      | last name                 | DefendantLink{uniq}      |
      | address line 1            | 1 High Street            |
      | postcode                  | MC1 1AA                  |
    And I am on the Account Search page - Individuals form displayed by default
    When I view the Minor creditors search form
    And I search using the following inputs:
      | minor creditor type  | Individual          |
      | individual last name | DefendantLink{uniq} |
      | first names          | Mina                |
      | address line 1       | 1 High Street       |
      | postcode             | MC1 1AA             |
    Then I see the Search results page
    When I open the defendant linked from the latest minor creditor search result
    Then I should see the account header contains "Minor Creditor Seed DefendantLink{uniqUpper}"


  @R1BDrop2UatTechJCDE @JIRA-STORY:PO-715 @JIRA-STORY:PO-706 @JIRA-STORY:PO-708 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5293
  Scenario: Search for a company minor creditor account and review the matching results
    Given a published account exists with a company minor creditor:
      | prosecutor case reference | PCRJRNYMINCO{uniqUpper} |
      | company name              | Journey Minor Co {uniq} |
      | address line 1            | 2 High Street           |
      | postcode                  | MC1 1AB                 |
    And I am on the Account Search page - Individuals form displayed by default
    When I view the Minor creditors search form
    And I search using the following inputs:
      | minor creditor type | Company                 |
      | company name        | Journey Minor Co {uniq} |
      | address line 1      | 2 High Street           |
      | postcode            | MC1 1AB                 |
    Then I see the Search results page
    And I see the Minor creditors search results:
      | Name           | Journey Minor Co {uniq} |
      | Address line 1 | 2 High Street           |

  # Legacy-data scenarios are scaffolds.
  # Replace the LEGACY_* placeholders with real seeded data values before executing them.

  @LegacyData @JIRA-STORY:PO-715 @JIRA-STORY:PO-706 @JIRA-STORY:PO-708 @JIRA-EPIC:PO-704
  # Minimum data set required: one individual minor creditor with last name LEGACY_MINOR_CREDITOR_LAST_NAME, display name LEGACY_MINOR_CREDITOR_NAME, and address line 1 LEGACY_MINOR_CREDITOR_ADDRESS_LINE_1.
  Scenario: Search for a minor creditor account from legacy data and review the matching results
    Given I am on the Account Search page - Individuals form displayed by default
    When I view the Minor creditors search form
    And I search using the following inputs:
      | minor creditor type  | Individual                             |
      | individual last name | <LEGACY_MINOR_CREDITOR_LAST_NAME>      |
      | address line 1       | <LEGACY_MINOR_CREDITOR_ADDRESS_LINE_1> |
    Then I see the Search results page
    And I see the Minor creditors search results:
      | Name           | <LEGACY_MINOR_CREDITOR_NAME>           |
      | Address line 1 | <LEGACY_MINOR_CREDITOR_ADDRESS_LINE_1> |
    @R1BDrop2UatTechJCDE @JIRA-TEST-KEY:PO-10327
    Examples:
      | LEGACY_MINOR_CREDITOR_LAST_NAME | LEGACY_MINOR_CREDITOR_NAME | LEGACY_MINOR_CREDITOR_ADDRESS_LINE_1 |
      | MinCredAccUniB                  | placeholder                | Unique MinCred CT                    |
    @R1BDrop2UatTechPreprod
    Examples:
      | LEGACY_MINOR_CREDITOR_LAST_NAME | LEGACY_MINOR_CREDITOR_NAME | LEGACY_MINOR_CREDITOR_ADDRESS_LINE_1 |
      | placeholder                     | placeholder                | placeholder                          |
