Feature: PO-502 Updates to Personal Details showing age of def & label name change, Adult or Youth only

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see "Account details" on the page header

    Then I see the "Defendant details" section heading
    And I see the "Personal details" link under the "Defendant details" section
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header

  Scenario Outline: AC1, AC2, AC4 & AC5 - Updated Personal Details screen, enter youth age and return to account details to verify

    When I select title "Mr" from dropdown
    And I enter "Byron Laird" into the "First names" field
    And I enter "Shelton" into the "Last name" field
    And I enter "36 Baxter House" into the "Address line 1" field
    And I enter a date of birth 15 years ago
    And I see "Youth" in the date of birth panel
    And I see age 15 in the date of birth panel
    And I see "" in the "Make and model" field
    And I see "" in the "Registration number" field
    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"

    When I click on the "Personal details" link
    And I see "Byron Laird" in the "First names" field
    And I see "Shelton" in the "Last name" field
    And I see "Youth" in the date of birth panel
    And I see age 15 in the date of birth panel
    And I see "36 Baxter House" in the "Address line 1" field

  Scenario Outline: AC1, AC2, AC4 & AC5 - Updated Personal Details screen, enter youth age and add contact details to verify

    When I select title "Mr" from dropdown
    And I enter "Byron Laird" into the "First names" field
    And I enter "Shelton" into the "Last name" field
    And I enter "36 Baxter House" into the "Address line 1" field
    And I enter a date of birth 15 years ago
    And I see "Youth" in the date of birth panel
    And I see age 15 in the date of birth panel
    And I see "" in the "Make and model" field
    And I see "" in the "Registration number" field
    And I click the "Add contact details" button
    And I see "Defendant contact details" on the page header
    And I click on the "Cancel" link
    Then I see the status of "Personal details" is "Provided"

    When I click on the "Personal details" link
    And I see "Byron Laird" in the "First names" field
    And I see "Shelton" in the "Last name" field
    And I see "Youth" in the date of birth panel
    And I see age 15 in the date of birth panel
    And I see "36 Baxter House" in the "Address line 1" field

  Scenario Outline: AC1, AC3, AC4 & AC5 - Updated Personal Details screen, enter adult age and return to account details to verify

    When I select title "Mr" from dropdown
    And I enter "Leslie Mason" into the "First names" field
    And I enter "Green" into the "Last name" field
    And I enter "45 Eccles House" into the "Address line 1" field
    And I enter a date of birth 30 years ago
    And I see "Adult" in the date of birth panel
    And I see age 30 in the date of birth panel
    And I see "" in the "Make and model" field
    And I see "" in the "Registration number" field
    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"

    When I click on the "Personal details" link
    And I see "Leslie Mason" in the "First names" field
    And I see "Green" in the "Last name" field
    And I see "Adult" in the date of birth panel
    And I see age 30 in the date of birth panel
    And I see "45 Eccles House" in the "Address line 1" field

  Scenario Outline: AC1, AC2, AC4 & AC5 - Updated Personal Details screen, enter adult age and add contact details to verify

    When I select title "Mr" from dropdown
    And I enter "Leslie Mason" into the "First names" field
    And I enter "Green" into the "Last name" field
    And I enter "45 Eccles House" into the "Address line 1" field
    And I enter a date of birth 30 years ago
    And I see "Adult" in the date of birth panel
    And I see age 30 in the date of birth panel
    And I see "" in the "Make and model" field
    And I see "" in the "Registration number" field
    And I click the "Add contact details" button
    And I see "Defendant contact details" on the page header
    And I click on the "Cancel" link
    Then I see the status of "Personal details" is "Provided"

    When I click on the "Personal details" link
    And I see "Leslie Mason" in the "First names" field
    And I see "Green" in the "Last name" field
    And I see "Adult" in the date of birth panel
    And I see age 30 in the date of birth panel
    And I see "45 Eccles House" in the "Address line 1" field
