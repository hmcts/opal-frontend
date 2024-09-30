Feature: PO-151 authentication sign out
  Scenario: check the session token is destroyed
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And The sign out link should be visible

    When I click the Sign out link
    Then I see "Sign in" on the sign in page

    When I attempt to get back to the dashboard by changing the url
    Then I see "Sign in" on the sign in page

    When I attempt to get back to the manual account creation, create account screen by changing the url
    Then I see "Sign in" on the sign in page

