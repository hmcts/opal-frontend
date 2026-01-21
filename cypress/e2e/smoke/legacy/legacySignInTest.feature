Feature: Sign In Smoke Test - Legacy Mode
  Scenario: The user can sign in to and sign out of the application
    Given I am logged in with email "opal-test@HMCTS.NET"
    Then I should see the header containing text "Opal"

##Legacy mode currently not available

##When I sign in
##And The sign out link should be visible

##When I click the Sign out link
##Then I see "Sign in" on the sign in page
