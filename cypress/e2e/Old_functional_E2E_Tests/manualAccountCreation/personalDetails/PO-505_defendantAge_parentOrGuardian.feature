Feature: PO-505 Updates to Personal Details showing age of def & label name change, Adult or Youth with Parent or Guardian to pay

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    Then I see "Account details" on the page header

    Then I see the "Defendant details" section heading
    And I see the "Personal details" link under the "Defendant details" section
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header

  Scenario Outline: AC1, AC2 & AC4 - Updated Personal Details screen, enter youth age and return to account details to verify

    When I select title "Mr" from dropdown
    And I enter "Roger Elton" into the "First names" field
    And I enter "Ross" into the "Last name" field
    And I enter "54 Baltic House" into the "Address line 1" field
    And I enter a date of birth 17 years ago
    And I see "Youth" in the date of birth panel
    And I see age 17 in the date of birth panel
    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"

    When I click on the "Personal details" link
    And I see "Roger Elton" in the "First names" field
    And I see "Ross" in the "Last name" field
    And I see "Youth" in the date of birth panel
    And I see age 17 in the date of birth panel
    And I see "54 Baltic House" in the "Address line 1" field

  Scenario Outline: AC1, AC2 & AC4 - Updated Personal Details screen, enter youth age and add contact details to verify

    When I select title "Mr" from dropdown
    And I enter "Roger Elton" into the "First names" field
    And I enter "Ross" into the "Last name" field
    And I enter "54 Baltic House" into the "Address line 1" field
    And I enter a date of birth 17 years ago
    And I see "Youth" in the date of birth panel
    And I see age 17 in the date of birth panel
    And I click the "Add offence details" button
    And I see "Add an offence" on the page header
    And I click on the "Cancel" link
    Then I see the status of "Personal details" is "Provided"

    When I click on the "Personal details" link
    And I see "Roger Elton" in the "First names" field
    And I see "Ross" in the "Last name" field
    And I see "Youth" in the date of birth panel
    And I see age 17 in the date of birth panel
    And I see "54 Baltic House" in the "Address line 1" field

  Scenario Outline: AC1, AC3 & AC4 - Updated Personal Details screen, enter adult age and return to account details to verify

    When I select title "Mr" from dropdown
    And I enter "Clive Chester" into the "First names" field
    And I enter "Carman" into the "Last name" field
    And I enter "63 Clearwater House" into the "Address line 1" field
    And I enter a date of birth 18 years ago
    And I see "Adult" in the date of birth panel
    And I see age 18 in the date of birth panel
    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"

    When I click on the "Personal details" link
    And I see "Clive Chester" in the "First names" field
    And I see "Carman" in the "Last name" field
    And I see "Adult" in the date of birth panel
    And I see age 18 in the date of birth panel
    And I see "63 Clearwater House" in the "Address line 1" field

  Scenario Outline: AC1, AC2, AC4 & AC5 - Updated Personal Details screen, enter adult age and add contact details to verify

    When I select title "Mr" from dropdown
    And I enter "Clive Chester" into the "First names" field
    And I enter "Carman" into the "Last name" field
    And I enter "63 Clearwater House" into the "Address line 1" field
    And I enter a date of birth 18 years ago
    And I see "Adult" in the date of birth panel
    And I see age 18 in the date of birth panel
    And I click the "Add offence details" button
    And I see "Add an offence" on the page header
    And I click on the "Cancel" link
    Then I see the status of "Personal details" is "Provided"

    When I click on the "Personal details" link
    And I see "Clive Chester" in the "First names" field
    And I see "Carman" in the "Last name" field
    And I see "Adult" in the date of birth panel
    And I see age 18 in the date of birth panel
    And I see "63 Clearwater House" in the "Address line 1" field
