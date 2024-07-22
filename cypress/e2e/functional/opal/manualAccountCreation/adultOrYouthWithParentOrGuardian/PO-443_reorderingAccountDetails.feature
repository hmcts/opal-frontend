Feature: PO-443  Reordering of Account Details (task list) for Adult or Youth with Parent or Guardian to pay

  Background:
    Given I am on the OPAL Frontend
    And I see "Opal" in the header
    And I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation
    Then I see "Create account" as the caption on the page
    And I see "Business unit and defendant type" on the page header

    When I enter "London South" into the business unit search box
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click on continue button
    Then I see "Account details" on the page header

  Scenario: AC1 & AC2 - Heading, sub-heading, business unit and defendant type

    When I see "Create account" as the caption on the page
    And I see "Account details" on the page header
    And I see the business unit is "London South West"
    And I see the defendant type is "Adult or youth with parent or guardian to pay"

  Scenario: AC3 - Court details

    When I see the "Court details" section heading
    And I see the "Court details" link under the "Court details" section

  #Screen not configured yet, commenting out follow up until it is ready
  #And I click on the "Court details" link
  #Then I see "Court details" on the page header

  Scenario: AC4 - Parent of guardian details

    When I see the "Parent or guardian details" section heading
    And I see the "Parent or guardian details" link under the "Parent or guardian details" section
    And I see the "Contact details" link under the "Parent or guardian details" section
    And I see the "Employer details" link under the "Parent or guardian details" section
    And I click on the "Parent or guardian details" link
    Then I see "Parent or guardian details" on the page header

    When I click on the "Cancel" link
    And I click on the "Contact details" link
    Then I see "Contact details" on the page header

    When I click on the "Cancel" link
    And I click on the "Employer details" link
    Then I see "Employer details" on the page header

  Scenario: AC5 - Defendant details

    When I see the "Defendant details" section heading
    And I see the "Personal details" link under the "Defendant details" section
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header

  Scenario: AC6 - Offence and imposition details

    When I see the "Offence and imposition details" section heading
    And I see the "Offence details" link under the "Offence and imposition details" section
    And I see the "Payment terms" link under the "Offence and imposition details" section

  #Screens not configured yet, commenting out follow up until they are ready
  #And I click on the "Offence details" link
  #Then I see "Offence details" on the page header

  #When I click on the "Cancel" link
  #And I click on the "Payment terms" link
  #Then I see "Payment terms" on the page header

  Scenario: AC7 - Review and publish, cancel

    When I see the "Review and publish" section heading
    And I see the "Check that all required fields have been entered before you publish" text under the "Review and publish" section
    #And I click the "Review account" button, nothing happens
    And "Review account" button is clicked, nothing happens
#And I click Cancel, a window pops up and I click Cancel
#Then I see "Account details" on the page header

#When I click Cancel, a window pops up and I click OK
#Then I am on the dashboard

#Need to add step for clicking cancel, then cancelling popup.
#Need to add step for clicking cancel, clicking leave on popup and going to dashboard.
