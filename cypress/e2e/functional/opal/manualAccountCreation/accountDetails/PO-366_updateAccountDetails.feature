Feature: PO-366 updating the account details page to manage the account creation process
  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box

    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

  Scenario: AC1-positive: verifying the account details page headings for adult or youth only defendant type
    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    And I see "Account details" on the page header

  Scenario: AC2-positive: verifying the account details page where account being created and defendant type text
    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    And I see "Account details" on the page header
    And I see the business unit is "West London"
    And I see the defendant type is "Adult or youth only"

  #Descoped
  # Scenario: AC3-positive: verify Court details section heading and sub-section link is not configured
  #   #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
  #   Then I see "Account details" on the page header
  #   Then I see "Court details" on the section heading
  #   When "Court details" is clicked, nothing happens

  #Not refactoring this, the screen following this link will be developed

  Scenario: AC4-positive: verify Defendant details section heading and sub-section links are not configured, except employer details
    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    And I see "Account details" on the page header
    And I see "Defendant details" on the section heading
    #De-scoped by PO-360
    #When "Personal details" is clicked, nothing happens
    When I click on the "Contact details" link
    And I see "Defendant contact details" on the page header
    And I click on the "Cancel" link
    And I click on the "Employer details" link
    Then I see "Employer details" on the page header

#Not refactoring this, the screen following this link will be developed
#Descoped
# Scenario: AC5-positive: verify Offences and imposition details section heading and sub-section links are not configured
#   #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
#   Then I see "Account details" on the page header
#   Then I see "Offence and imposition details" on the section heading
#   When "Offence details" is clicked, nothing happens
#   When "Payment terms" is clicked, nothing happens

# Scenario: AC6-positive: verify Check and submit Check account
#   When I see "Check and submit" on the section heading
#   #When I check text under Check and submit "Check that all required fields have been entered before you publish"
#   When "Check account" button is clicked, nothing happens
#   When "Cancel account creation" link is clicked, nothing happens
