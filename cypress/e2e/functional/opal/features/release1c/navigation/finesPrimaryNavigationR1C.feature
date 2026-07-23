Feature: Fines primary navigation

  @JIRA-STORY:PO-2611 @JIRA-EPIC:PO-2627 @R1CFinancialMovements @JIRA-TEST-KEY:PO-5408
  Scenario: AC4a AC4b AC4c - Selecting the Finance top-level Fines area updates the active navigation item
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Finance"
    Then I am taken to the "Finance" Fines landing page

  @JIRA-STORY:PO-2611 @JIRA-EPIC:PO-2627 @R1CEnforcementOperationalReporting @JIRA-TEST-KEY:PO-5409
  Scenario: AC4a AC4b AC4c - Selecting the Reports top-level Fines area updates the active navigation item
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Reports"
    Then I am taken to the "Reports" Fines landing page

  @JIRA-STORY:PO-2611 @JIRA-EPIC:PO-2627 @R1CAdministration @JIRA-TEST-KEY:PO-5410
  Scenario: AC4a AC4b AC4c - Selecting the Administration top-level Fines area updates the active navigation item
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Administration"
    Then I am taken to the "Administration" Fines landing page
