Feature: PO-343 Manual Account Creation
  Scenario: The user can navigate to the manual account creation link on the dashboard is clicked
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    Then I see "Account details" on the page header

    And I click the Sign out link

  #PO-274 #PO-279
  Scenario: Account Details screen for the Manual Account Creation process and Create account screen for an Adult & Youth only defendant type

    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation
    Then I see "Account details" on the page header
    And I navigate back to "Dashboard" page
    Then I navigate to Manual Account Creation
    Then I see "Account details" on the page header
    Then I click continue to Create Account page
    Then I see "Create account" on the page header
    And I verify the links on the page 
    |Court Details|
    |Personal details|
    |Employer details|
    |Additional defendant details|
    |OffenceDetails|
    |Payment terms|
    Then I navigate back to "Account details" page
    And I click continue to Create Account page


    And I click the Sign out link