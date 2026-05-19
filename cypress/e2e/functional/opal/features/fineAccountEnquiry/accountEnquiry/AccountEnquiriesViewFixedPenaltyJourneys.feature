@JIRA-LABEL:account-enquiry
Feature: Account Enquiries - View Fixed Penalty - End-to-end journeys
  High-value end-to-end journeys for viewing Fixed Penalty account details.
  These scenarios cover opening a Fixed Penalty account from Account Search,
  confirming the Fixed penalty tab is available, and proving the correct tab version is shown,
  while leaving detailed field permutations and empty-state coverage to the component tests.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-994 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5300
  Scenario: Search for a non-vehicle fixed penalty account and view the fixed penalty details
    Given a published non-vehicle fixed penalty account exists:
      | first name        | Robert                  |
      | last name         | FixedPenaltyNV{uniq}    |
      | ticket number     | FPR1BNV{uniqUpper}      |
      | issuing authority | City of Metropolis      |
      | time of offence   | 14:30                   |
      | place of offence  | Main Street, Metropolis |
    When I search for the account by last name "FixedPenaltyNV{uniq}" and open the latest result
    Then I should see the account summary header contains "ROBERT FIXEDPENALTYNV{uniqUpper}"
    And I should see the account header summary values:
      | Account type         | Fixed Penalty      |
      | PCR or ticket number | FPR1BNV{uniqUpper} |
    And I should see the Fixed penalty tab
    When I go to the Fixed penalty section and the header is "Fixed Penalty details"
    Then I should see the fixed penalty details:
      | Issuing authority | City of Metropolis      |
      | Ticket number     | FPR1BNV{uniqUpper}      |
      | Time of offence   | 14:30                   |
      | Place of offence  | Main Street, Metropolis |
    And I should not see the vehicle fixed penalty fields

  @R1B @JIRA-STORY:PO-994 @JIRA-STORY:PO-1818 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5301
  Scenario: Search for a vehicle fixed penalty company account and view the vehicle-specific fixed penalty details
    Given a published vehicle fixed penalty company account exists:
      | company name                              | Fixed Penalty Co {uniq} |
      | ticket number                             | FPR1BVEH{uniqUpper}     |
      | issuing authority                         | City of Metropolis      |
      | registration number                       | XY21 ABC                |
      | driving licence                           | LIC-789012              |
      | notice to owner or hirer number (NTO/NTH) | NT-345678               |
      | date notice to owner was issued           | 01 May 2023             |
      | time of offence                           | 14:30                   |
      | place of offence                          | Main Street, Metropolis |
    When I open the company account details for "Fixed Penalty Co {uniq}"
    Then I should see the account header contains "Fixed Penalty Co {uniq}"
    And I should see the account header summary values:
      | Account type         | Fixed Penalty       |
      | PCR or ticket number | FPR1BVEH{uniqUpper} |
    And I should see the Fixed penalty tab
    When I go to the Fixed penalty section and the header is "Fixed Penalty details"
    Then I should see the fixed penalty details:
      | Issuing authority                         | City of Metropolis      |
      | Ticket number                             | FPR1BVEH{uniqUpper}     |
      | Registration number                       | XY21 ABC                |
      | Driving licence                           | LIC-789012              |
      | Notice to owner or hirer number (NTO/NTH) | NT-345678               |
      | Date notice to owner was issued           | 01 May 2023             |
      | Time of offence                           | 14:30                   |
      | Place of offence                          | Main Street, Metropolis |
