Feature: PO-719 Route Guard Redirects
  Scenario 1 covers testing of bug PO-695

  Scenario: Route Guard Redirects - reloading page
    Given I am on the OPAL Frontend
    When I sign in as "opal-test@hmcts.net"
    And I navigate to Manual Account Creation
    Then I see "Business unit and defendant type" on the page header
    And I enter "London South" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    Then I see "Account details" on the page header

    When I reload the page
    Then I see "Business unit and defendant type" on the page header

  Scenario: Route Guard Redirects - navigating to URL
    Given I am on the OPAL Frontend
    When I sign in as "opal-test@hmcts.net"
    And I navigate to Manual Account Creation
    Then I see "Business unit and defendant type" on the page header
    And I enter "London South" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    Then I see "Account details" on the page header

    When I navigate to "/fines/manual-account-creation/court-details" URL
    Then I see "Business unit and defendant type" on the page header
