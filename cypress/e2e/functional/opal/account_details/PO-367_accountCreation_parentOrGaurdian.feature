Feature: create the account details for adult or youth with parent or guardian to pay defendant type

  Background:
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    When I select parent or guardian to pay
    Then I click on continue button

  Scenario: AC1-positive: verifying the account details page headings for adult or youth with parent or guardian to pay defendant type
    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

  Scenario: AC2-positive: verifying the account details page where account being created and defendant type text
    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    Then should display business unit account I selected from Business unit and defendant type page
    And I see the defendant type is "Adult or youth with parent or guardian to pay"


  Scenario: AC3-positive: verify Court details section heading and sub-section link is not configured
    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    Then I see "Court details" on the section heading
    When "Court details" is clicked, nothing happens
    Then I see "Account details" on the page header

  Scenario: AC4-positive: verify Defendant details section heading and sub-section links are not configured, except employer details
    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    Then "Parent or guardian details" is clicked, nothing happens
    Then I click on "Employer details" link
    Then I see "Employer details" on the page header
    Then "Back" is clicked
    Then I see "Account details" on the page header


  Scenario: AC5-positive: verify parent or guardian details section heading and sub-section links are not configured
    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    Then I see "Defendant details" on the section heading
    When "Personal details" is clicked, nothing happens
    When I click on "Contact details" link
    Then I see "Contact details" on the page header
    Then I click cancel on Contact details page
    Then I see "Account details" on the page header

  Scenario: AC6-positive: verify Offence and imposition details section heading and sub-section links are not configured
    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    Then I see "Defendant details" on the section heading
    When "Offence details" is clicked, nothing happens
    When "Payment terms" is clicked, nothing happens
    Then I see "Account details" on the page header

  Scenario: AC7-positive: verify review and publish Review account
    When I see "Review and publish" on the section heading
    #When I check text under review and publish "Check that all required fields have been entered before you publish"
    When "Review account" button is clicked, nothing happens
    When "Cancel account creation" link is clicked, nothing happens

