Feature: PO-151 authentication sign out
  Scenario: check the session token is destroyed
    Given I am on the OPAL Frontend
    Then I see "OPAL Frontend" in the header
    When I sign in
    And The sign out link should be visible

    When I click the Sign out link
    Then I see "Sign in" on the sign in page

    When I attempt to get back to the account enquiry search screen by changing the url
    Then I see "Sign in" on the sign in page

    When I attempt to get back to the account enquiry matches screen by changing the url
    Then I see "Sign in" on the sign in page

