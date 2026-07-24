@JIRA-LABEL:consolidation
Feature: Write Off Release 1C Feature Toggles

  @R1CWriteOff @JIRA-STORY:PO-3757 @JIRA-EPIC:PO-3685 @JIRA-TEST-KEY:PO-7563
  Scenario: Consolidate accounts is available through direct navigation when release 1c write off is enabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Consolidate accounts page
    Then I should see the header containing text "Consolidate accounts"

  @R1CWriteOffOff @JIRA-STORY:PO-3757 @JIRA-EPIC:PO-3685 @JIRA-TEST-KEY:PO-8015
  Scenario: Consolidate accounts entry point is hidden from the Accounts dashboard when release 1c write off is disabled
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Accounts"
    Then I am taken to the "Accounts" Fines landing page
    And I should not see the Consolidate accounts link on the Accounts dashboard

  @R1CWriteOffOff @JIRA-STORY:PO-3757 @JIRA-EPIC:PO-3685 @JIRA-TEST-KEY:PO-8016
  Scenario: Consolidate accounts is unavailable through direct navigation when release 1c write off is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Consolidate accounts page
    Then I should see an Access Denied page
    And I should see a "Back to dashboard" action

  @R1CWriteOffOff @JIRA-STORY:PO-3720 @JIRA-STORY:PO-3757 @JIRA-EPIC:PO-3685 @JIRA-TEST-KEY:PO-8020
  Scenario: Impositions write off actions are hidden when release 1c write off is disabled
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And a published adult or youth defendant account exists:
      | first name                | Morgan                     |
      | last name                 | Release1BImpositions{uniq} |
      | prosecutor case reference | PCRR1BIMP{uniqUpper}       |
      | date of birth             | 1998-08-24                 |
    And I am on the Account Search page - Individuals form displayed by default
    When I search for the last created account by account number
    And I open the latest matching result from the search results
    And I go to the Impositions tab
    Then I should return to the Impositions tab
    And I should not see the button with text "Adjust"
    And I should not see the button with text "Reverse"
    And I should not see the button with text "Write off"
    And I should not see the button with text "Reverse write off"
