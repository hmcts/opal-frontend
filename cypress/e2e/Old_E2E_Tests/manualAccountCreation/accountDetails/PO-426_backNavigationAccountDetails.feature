Feature:PO-426 Application and browser Back buttons on Account Details screen - clear all data entered during the MAC process
  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box

  Scenario Outline:AC1,2 - App back button - 'Ok' - data cleared
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the status of "Personal details" is "Not provided"
    And I click on the "Personal details" link
    And I see "Personal details" on the page header

    Then I select title "Mr" from dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "ADDR1" into the "Address line 1" field

    Then I click the "Return to account details" button
    And I see the status of "Personal details" is "Provided"

    When I click "Back", a window pops up and I click Ok

    Then I see "Business unit and defendant type" on the page header
    Then I see the value "West London" in the business unit search box
    And I validate the "Fine" radio button is not selected
    And I validate the "Fixed Penalty" radio button is not selected
    And I validate the "Conditional Caution" radio button is not selected

    When I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the status of "Personal details" is "Not provided"


  Scenario Outline:AC1,2 - App back button - 'Cancel' - data retained
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the status of "Personal details" is "Not provided"
    And I click on the "Personal details" link
    And I see "Personal details" on the page header

    Then I select title "Mr" from dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "ADDR1" into the "Address line 1" field

    Then I click the "Return to account details" button
    And I see the status of "Personal details" is "Provided"

    When I click "Back", a window pops up and I click Cancel

    Then I see the status of "Personal details" is "Provided"

  Scenario Outline:AC1,2 - Browser back button - 'Ok' - data cleared
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the status of "Personal details" is "Not provided"
    And I click on the "Personal details" link
    And I see "Personal details" on the page header

    Then I select title "Mr" from dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "ADDR1" into the "Address line 1" field

    Then I click the "Return to account details" button
    And I see the status of "Personal details" is "Provided"

    When I click the browser back button 3 times, a window pops up and I click Ok

    Then I see "Business unit and defendant type" on the page header
    Then I see the value "West London" in the business unit search box
    And I validate the "Fine" radio button is not selected
    And I validate the "Fixed Penalty" radio button is not selected
    And I validate the "Conditional Caution" radio button is not selected

    When I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the status of "Personal details" is "Not provided"


  Scenario Outline:AC1,2 - Browser back button - 'Cancel' - data retained
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the status of "Personal details" is "Not provided"
    And I click on the "Personal details" link
    And I see "Personal details" on the page header

    Then I select title "Mr" from dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "ADDR1" into the "Address line 1" field

    Then I click the "Return to account details" button
    And I see the status of "Personal details" is "Provided"

    When I go back in the browser
    Then I see "Personal details" on the page header

    And I go back in the browser
    Then I see "Account details" on the page header

    When I click the browser back button 1 times, a window pops up and I click Cancel

    Then I see the status of "Personal details" is "Provided"
