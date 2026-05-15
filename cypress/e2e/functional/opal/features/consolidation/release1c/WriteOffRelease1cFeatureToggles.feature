@JIRA-LABEL:consolidation
Feature: Write Off Release 1C Feature Toggles

  @FeatureFlag @R1CWriteOffOff @JIRA-STORY:PO-3757 @JIRA-EPIC:PO-3685
  Scenario: Consolidate accounts is hidden from Accounts when release 1c write off is disabled
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Accounts"
    Then I am taken to the "Accounts" Fines landing page
    And I should not see the Consolidate accounts link on the Accounts dashboard

  @FeatureFlag @R1CWriteOffOff @JIRA-STORY:PO-3757 @JIRA-EPIC:PO-3685
  Scenario: Direct navigation to Consolidate accounts is blocked when release 1c write off is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Consolidate accounts page
    Then I should see an Access Denied page
    And I should see a "Back to dashboard" action
