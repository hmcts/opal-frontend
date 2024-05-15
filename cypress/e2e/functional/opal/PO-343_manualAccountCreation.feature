Feature: PO-343 Manual Account Creation
  Scenario: The user can navigate to the manual account creation link on the dashboard is clicked
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    Then I am on the manual account creation test page

    And I click the Sign out link
