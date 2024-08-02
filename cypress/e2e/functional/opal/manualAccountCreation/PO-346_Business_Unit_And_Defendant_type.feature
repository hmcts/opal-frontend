Feature: PO-346 business unit and defendant type Users associated to one and only one BU
  #this feature file is messy and needs sorting out removing overlap with other tests

  Background:
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test-3@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

  #AC1
  Scenario: AC-01 positive: verifying the page heading for Business unit and defendant type screen
    When I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header

  #AC2
  Scenario: AC-02 positive: If a user is only associated to one BU, then the following view 1 will displayed
    When I see "The account will be created in Hertfordshire" message on the business unit

  #AC3
  Scenario: AC-03 positive: verify defendant type header and radio buttons
    When I select the "Fine" radio button
    And I see the heading under the fine radio button is "Defendant type"
    #Below line needs step rework to pass (repeat for all scenarios)
    #And I see "If sole trader, choose 'Adult or youth only'" on the defendant type header
    And I validate the "Adult or youth only" radio button is not selected
    And I validate the "Adult or youth with parent or guardian to pay" radio button is not selected
    And I validate the "Company" radio button is not selected

  #AC4, #AC5
  #For AC5, AC6, AC7 verifying Create account page until PO-366 implemented
  #Scenario: AC-04 negative: verify if user select Continue button without selecting any radio button options
  Scenario: AC-05 negative: verify if user resolves the error and selecting adults and youth only then continues to the next page
    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    When I select the "Fine" radio button
    And I see the heading under the fine radio button is "Defendant type"
    #Then I see "If sole trader, choose 'Adult or youth only'" on the defendant type header
    And I click the "Continue" button
    Then I see the error message "Select a defendant type" at the top of the page

    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    #as per the new design process in PO-366 this step is descoped

    #Then I see "Create account" on the page header

    Then I see "Account details" on the page header
  #The below 2 steps de-scoped on PO-366
  #When "Back" is clicked
  #Then I verify if adults and youth only checked

  #AC6
  Scenario: AC-06 negative: verify if user resolves the error and selecting parent or guardian to pay then continues to the next page
    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    When I select the "Fine" radio button
    And I see the heading under the fine radio button is "Defendant type"
    #Then I see "If sole trader, choose 'Adult or youth only'" on the defendant type header
    And I click the "Continue" button
    Then I see the error message "Select a defendant type" at the top of the page

    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    #as per the new design process in PO-366 this step is descoped
    
    #Then I see "Create account" on the page header

    Then I see "Account details" on the page header
  #The below 2 steps de-scoped on PO-366
  #When "Back" is clicked
  #Then I verify if parent or guardian to pay checked

  #AC7
  Scenario: AC-07 negative: verify if user resolves the error and selecting company then continues to the next page
    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    When I select the "Fine" radio button
    And I see the heading under the fine radio button is "Defendant type"
    #Then I see "If sole trader, choose 'Adult or youth only'" on the defendant type header
    And I click the "Continue" button
    Then I see the error message "Select a defendant type" at the top of the page

    And I select the "Company" radio button
    And I click the "Continue" button

    #as per the new design process in PO-366 this step is descoped

    #Then I see "Create account" on the page header

    Then I see "Account details" on the page header
  #as per the new design process in PO-366 this step is descoped

  #When "Back" is clicked
  #Then I verify company radio button checked

  #AC8

  Scenario: AC-08 positive: When user navigating to Business unit and defendant type screen and selecting adults and youth only then continue
    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    When I select the "Fine" radio button
    And I see the heading under the fine radio button is "Defendant type"
    #Then I see "If sole trader, choose 'Adult or youth only'" on the defendant type header
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    #as per the new design process in PO-366 this step is descoped

    #Then I see "Create account" on the page header

    Then I see "Account details" on the page header

  #AC9

  Scenario: AC-09 positive: When user navigating to Business unit and defendant type screen and selecting parent or guardian to pay then continue
    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    When I select the "Fine" radio button
    And I see the heading under the fine radio button is "Defendant type"
    #Then I see "If sole trader, choose 'Adult or youth only'" on the defendant type header
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    #as per the new design process in PO-366 this step is descoped
    #Then I see "Create account" on the page header
    Then I see "Account details" on the page header

  #AC10
  Scenario: AC-10 positive: When user navigating to Business unit and defendant type screen and selecting company then continue
    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    When I select the "Fine" radio button
    And I see the heading under the fine radio button is "Defendant type"
    #Then I see "If sole trader, choose 'Adult or youth only'" on the defendant type header
    And I select the "Company" radio button
    And I click the "Continue" button
    #as per the new design process in PO-366 this step is descoped
    #Then I see "Create account" on the page header
    Then I see "Account details" on the page header

  #AC1
  Scenario: AC-11-negative: When user selects cancel button without selecting defendant type
    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    When I select the "Fine" radio button
    And I see the heading under the fine radio button is "Defendant type"
    #Then I see "If sole trader, choose 'Adult or youth only'" on the defendant type header
    Then I click on cancel
    Then I am on the dashboard

  # #AC1 #AC2 #ACa

  Scenario:AC-12a-negative: When user selects cancel button and user has selected defendant type
    When I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    When I select the "Fine" radio button
    And I see the heading under the fine radio button is "Defendant type"
    #Then I see "If sole trader, choose 'Adult or youth only'" on the defendant type header

    And I select the "Adult or youth only" radio button
    Then I click on cancel
    Then I select OK on the pop up window
    Then I am on the dashboard

# Scenario: AC12b & AC12bi-negative: When user selects cancel button and user has selected defendant type
#     When I see "Create account" as the caption on the page
#     Then I see "Business unit and defendant type" on the page header
#     When I see "Defendant type" section on the page
#     Then I see "If sole trader, choose 'Adult or youth only'" on the defendant type header

#     When I select adults and youth only
#     Then I click on cancel
#     Then I select cancel on the pop up window
#     Then I see "Business unit and defendant type" on the page header
