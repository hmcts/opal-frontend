Feature: PO-367 create the account details for adult or youth with parent or guardian to pay defendant type

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box

    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

  Scenario: AC1-positive: verifying the account details page headings for adult or youth with parent or guardian to pay defendant type
    #Descoped by PO-426 --- When I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

  Scenario: AC2-positive: verifying the account details page where account being created and defendant type text
    #Descoped by PO-426 --- When I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    And I see the business unit is "West London"
    And I see the defendant type is "Adult or youth with parent or guardian to pay"

  #Not refactoring this, the screen following this link will be developed
  #Descoped
  # Scenario: AC3-positive: verify Court details section heading and sub-section link is not configured
  #   #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
  #   Then I see "Account details" on the page header
  #   Then I see "Court details" on the section heading
  #   When "Court details" is clicked, nothing happens
  #   Then I see "Account details" on the page header

  #Descoped
  # Scenario: AC4-positive: verify Defendant details section heading and sub-section links are not configured, except employer details
  #     #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
  #     Then I see "Account details" on the page header
  #     Then "Parent or guardian details" is clicked, nothing happens
  #     Then I click on the "Employer details" link
  #     Then I see "Employer details" on the page header
  #     Then "Back" is clicked
  #     Then I see "Account details" on the page header


  Scenario: AC5-positive: verify parent or guardian details section heading and sub-section links are not configured
    #Descoped by PO-426 --- When I see "Create account" as the caption on the page
    And I see "Account details" on the page header
    And I see "Defendant details" on the section heading
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header

    When I click on the "Cancel" link
    And I click on the "Contact details" link
    And I see "Parent or guardian contact details" on the page header
    And I click on the "Cancel" link
    Then I see "Account details" on the page header

#Not refactoring this, the screen following this link will be developed
#Descoped
# Scenario: AC6-positive: verify Offence and imposition details section heading and sub-section links are not configured
#   #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
#   Then I see "Account details" on the page header
#   Then I see "Defendant details" on the section heading
#   When "Offence details" is clicked, nothing happens
#   When "Payment terms" is clicked, nothing happens
#   Then I see "Account details" on the page header

# Scenario: AC7-positive: verify Check and submit Check account
#   When I see "Check and submit" on the section heading
#   #When I check text under Check and submit "Check that all required fields have been entered before you publish"
#   When "Check account" button is clicked, nothing happens
#   When "Cancel account creation" link is clicked, nothing happens

