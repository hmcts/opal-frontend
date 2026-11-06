@JIRA-LABEL:navigation
Feature: Finance Landing Page
  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"

  @JIRA-STORY:PO-3480 @JIRA-EPIC:PO-2439 @R1CFinancialMovements
  Scenario: Manual cash input is available to an authorised user from the Finance landing page
    # AC1: Finance displays the Manual cash input link.
    # AC1a: the authenticated test user has Process and allocate payments permission.
    # AC1b: the Cash section is displayed with the Manual cash input link.
    When I select the Fines primary navigation item "Finance"
    Then I am taken to the "Finance" Fines landing page
    And I see the following text on the page "Cash"
    And I see the following text on the page "Manual cash input"

  @JIRA-STORY:PO-8691 @JIRA-EPIC:PO-2439 @R1CBankingInterfaces
  Scenario: Banking interface links are available to an authorised Finance user
    # AC1, AC5a and AC6: the authorised user sees the section, all three links and same-tab links.
    When I select the Fines primary navigation item "Finance"
    Then I am taken to the "Finance" Fines landing page
    And I see the External banking interfaces section and its available links

  @JIRA-STORY:PO-8691 @JIRA-EPIC:PO-2439 @R1CBankingInterfaces
  Scenario Outline: An authorised user can navigate to each banking interface journey
    # AC2, AC3, AC4 and AC6: each visible link opens its intended same-tab destination.
    When I select the Fines primary navigation item "Finance"
    Then I am taken to the "Finance" Fines landing page
    When I open the Finance banking interface link "<link>"
    Then I see the following text on the page "<placeholder>"

    Examples:
      | link                         | placeholder                    |
      | Inbound files                | Placeholder for Inbound Files  |
      | Outbound files               | Placeholder for Outbound Files |
      | Upload variant banking files | Placeholder for File Upload    |
