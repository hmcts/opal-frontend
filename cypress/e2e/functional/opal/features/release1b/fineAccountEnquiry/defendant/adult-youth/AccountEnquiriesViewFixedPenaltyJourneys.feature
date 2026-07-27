@JIRA-LABEL:account-enquiry
Feature: Defendant - Adult or youth - Account Enquiries - View Fixed Penalty - End-to-end journeys
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
      | first name        | Robert                               |
      | last name         | FixedPenaltyNV{uniq}                 |
      | ticket number     | FPR1BNV{uniqUpper}                   |
      | issuing authority | City of London Central Ticket Office |
      | time of offence   | 14:30                                |
      | place of offence  | Main Street, Metropolis              |
    When I search for the account by last name "FixedPenaltyNV{uniq}" and open the latest result
    Then I should see the account summary header contains "ROBERT FIXEDPENALTYNV{uniqUpper}"
    And I should see the account header summary values:
      | Account type         | Fixed Penalty      |
      | PCR or ticket number | FPR1BNV{uniqUpper} |
    And I should see the Fixed penalty tab
    When I go to the Fixed penalty section and the header is "Fixed Penalty details"
    Then I should see the fixed penalty details:
      | Issuing authority | City of London Central Ticket Office |
      | Ticket number     | FPR1BNV{uniqUpper}                   |
      | Time of offence   | 14:30                                |
      | Place of offence  | Main Street, Metropolis              |
    And I should not see the vehicle fixed penalty fields
