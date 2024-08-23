Feature: PO-615 - manual account creation - unauthorised user presented with access denied screen
  #AC2 covered in multiple other tests
  Scenario:AC1,3 - Unauthorised user presented with access denied screen
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test-2@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    Then I see an access denied error
    And The error message is "You do not have the appropriate permissions to access this page."
    And There is a button to go back to the dashboard
