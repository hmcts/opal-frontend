Feature: PO-362 Company task list screen

  Feature Description
  https://tools.hmcts.net/jira/browse/PO-362
  User Story:
  As an enforcement officer
  I want the Account details screen created for a Company defendant type,
  So that I can manage the account creation process for a defendant who is a Company.
  NOTE:
  AC3.a will be Descoped
  AC5.a will be Descoped
  AC5.b will be Descoped
  AC6.ci will be Descoped
  AC6.di will be Descoped


  Scenario: AC1 Task list is created with correct heading
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header

    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button

    Then I see "Account details" on the page header
  #Descoped by PO-426 --- And I see "Create account" above "Account details"

  Scenario: AC2 Business unit and Defendant type are displayed correctly
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button

    Then I see the business unit is "West London"
    And I see the defendant type is "Company"

  Scenario: AC3 company task list court details section
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button

    Then I see the "Court details" section heading
    And I see the "Court details" link under the "Court details" section
  #Then "Court details" is clicked, nothing happens

  Scenario: AC4.a company task list defendant details section
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button

    Then I see the "Court details" section heading
    And I see the "Company details" link under the "Defendant details" section

  ##When "Company details" is clicked
  ##Then I see "Company details" on the page header

  Scenario: AC4.b company task list defendant details section
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button

    Then I see the "Defendant details" section heading
    And I see the "Contact details" link under the "Defendant details" section

    When "Contact details" is clicked
    Then I see "Defendant contact details" on the page header

  Scenario: AC5.a company task list Offence and Imposition details section
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button

    Then I see the "Offence and imposition details" section heading
    And I see the "Offence details" link under the "Offence and imposition details" section
  # Then "Offence details" is clicked, nothing happens

  Scenario: AC5.b company task list Offence and imposition details section
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button

    Then I see the "Offence and imposition details" section heading
# due to new design descoping this step, implemented on PO-530
#And I see the "Payment terms" link under the "Offence and imposition details" section
# Then "Payment terms" is clicked, nothing happens


#DESCOPED by PO-549
# Scenario: AC6a.b company task list Check and submit section
#   Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#   Then I am on the dashboard

#   When I navigate to Manual Account Creation

#   And I enter "West London" into the business unit search box
#   And I select the "Fine" radio button
#   And I select the "Company" radio button
#   And I click the "Continue" button

#   Then I see the "Check and submit" section heading
#   And I see the "Check that all required fields have been entered before you publish" text under the "Check and submit" section
#   And I see the "Check account" button under the "Check and submit" section

# Descoped
# Scenario: AC6.c company task list Check account button
#   Given I am on the OPAL Frontend
#   Then I see "Opal" in the header

#   When I sign in as "opal-test@hmcts.net"
#   Then I am on the dashboard

#   When I navigate to Manual Account Creation

#   And I enter "West London" into the business unit search box
#   When I select company
#   And I click on continue button

#   Then I see "Account details" on the page header
#   When The button "Check account" is clicked, nothing happens


# Descoped
# Scenario: AC6.d company task list cancel account creation link
#   Given I am on the OPAL Frontend
#   Then I see "Opal" in the header

#   When I sign in as "opal-test@hmcts.net"
#   Then I am on the dashboard

#   When I navigate to Manual Account Creation

#   When I select company
#   And I click on continue button

#   When "Cancel account creation" is clicked, nothing happens


#De-scoped by PO-426
# Scenario: AC7 company task list no back button or link
#   Given I am on the OPAL Frontend
#   Then I see "Opal" in the header

#   When I sign in as "opal-test@hmcts.net"
#   Then I am on the dashboard

#   When I navigate to Manual Account Creation

#   And I enter "West London" into the business unit search box
#   And I select the "Fine" radio button
#   And I select the "Company" radio button
#   And I click the "Continue" button

#   Then I do not see a back button or back link
