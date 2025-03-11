Feature: PO-343 Manual Account Creation
  Scenario: The user can navigate to the manual account creation when the link on the dashboard is clicked
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    #new feature implemented on Po-346 so deactivating this step
    #Then I see "Account details" on the page header

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header

    And I click the Sign out link
