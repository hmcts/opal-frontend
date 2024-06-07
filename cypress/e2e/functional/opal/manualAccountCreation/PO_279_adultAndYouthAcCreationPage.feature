Feature: PO-279 Manual account creation, Adult and Youth account creation page
  Scenario: Business unit above 'Create Account' heading
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    Then I see "Account details" on the page header
    And I click continue to Create Account page

    Then I see "Create account" on the page header
    And I see "Cambridgeshire" above "Create account"

    And I click the Sign out link

  Scenario: Only employer details has configured hyperlink
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    Then I see "Account details" on the page header
    And I click continue to Create Account page

    When "Court details" is clicked, nothing happens
    When "Personal details" is clicked, nothing happens
    When "Additional defendant details" is clicked, nothing happens
    When "Offence details" is clicked, nothing happens
    When "Payment terms" is clicked, nothing happens

    When "Employer details" is clicked
    Then I see "Employer details" on the page header

    And I click the Sign out link


  Scenario: Review account and delete account elements are not configured (do nothing)
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    Then I see "Account details" on the page header

    When I click continue to Create Account page
    Then I see "Create account" on the page header


    When The button "Review account" is clicked, nothing happens
    When "Delete account" is clicked, nothing happens

    And I click the Sign out link

  Scenario: The back button returns the user to the previous screen
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    Then I see "Account details" on the page header
    And I click continue to Create Account page
    Then I see "Create account" on the page header

    When "Back" is clicked
    Then I see "Account details" on the page header

    And I click the Sign out link




