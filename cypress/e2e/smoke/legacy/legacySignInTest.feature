Feature: Sign In Smoke Test - Legacy Mode
  Scenario: The user can sign in to and sign out of the application
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    Then I should see the service header containing text "Opal"

