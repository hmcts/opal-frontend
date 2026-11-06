@JIRA-LABEL:manual-account-creation
@ManualAccountCreation @CourtDetails
Feature: Court and prosecutor reference data requests
  Verifies that each account journey requests the correct reference data.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    When I open Manual Account Creation
    And I monitor local justice areas requests
    And I monitor prosecutor requests

  # AC2, AC3, AC4, AC6
  @JIRA-EPIC:PO-2750 @R1A @JIRA-STORY:PO-2761 @JIRA-TEST-KEY:PO-5383
  Scenario: Fine + New requests only LJA (PSA) and CRWCRT local justice areas
    When I create a "New" manual "Fine" account for business unit "West London" with defendant type "Adult or youth only"
    And I access the "Court details" task
    Then the latest local justice areas request should include lja types:
      | LJA    |
      | CRWCRT |
    And the latest local justice areas request should not include lja types:
      | SJCRT  |
      | SCSCRT |
      | NICRT  |

  # AC2, AC3, AC4, AC6
  @JIRA-EPIC:PO-2750 @R1A @JIRA-STORY:PO-2761 @JIRA-TEST-KEY:PO-5384
  Scenario: Fine + Transfer in requests only LJA (PSA) and CRWCRT local justice areas
    When I create a "Transfer in" manual "Fine" account for business unit "West London" with defendant type "Adult or youth only"
    And I access the "Court details" task
    Then the latest local justice areas request should include lja types:
      | LJA    |
      | CRWCRT |
    And the latest local justice areas request should not include lja types:
      | SJCRT  |
      | SCSCRT |
      | NICRT  |

  # PO-10693 AC1a, AC1c
  @JIRA-EPIC:PO-2750 @R1A @JIRA-STORY:PO-2761 @JIRA-DEFECT:PO-10693 @JIRA-TEST-KEY:PO-5385
  Scenario: Conditional Caution + New requests prosecutors without requesting local justice areas
    When I create a "New" manual "Conditional Caution" account for business unit "West London" with defendant type "Adult or youth only"
    And I access the "Court details" task
    Then a prosecutor request should be made
    And no local justice area requests should be made

  # PO-10693 AC2a, AC2c
  @JIRA-EPIC:PO-2750 @R1A @JIRA-STORY:PO-2761 @JIRA-DEFECT:PO-10693 @JIRA-TEST-KEY:PO-5386
  Scenario: Fixed Penalty + New requests prosecutors without requesting local justice areas
    When I create a "New" manual "Fixed Penalty" account for business unit "West London" with defendant type "Adult or youth only"
    Then I should see the header containing text "Fixed Penalty details"
    And a prosecutor request should be made
    And no local justice area requests should be made

  # PO-10693 AC2a, AC2c
  @JIRA-EPIC:PO-2750 @R1A @JIRA-STORY:PO-2761 @JIRA-DEFECT:PO-10693 @JIRA-TEST-KEY:PO-5387
  Scenario: Fixed Penalty + Transfer in requests prosecutors without requesting local justice areas
    When I create a "Transfer in" manual "Fixed Penalty" account for business unit "West London" with defendant type "Adult or youth only"
    Then I should see the header containing text "Fixed Penalty details"
    And a prosecutor request should be made
    And no local justice area requests should be made
