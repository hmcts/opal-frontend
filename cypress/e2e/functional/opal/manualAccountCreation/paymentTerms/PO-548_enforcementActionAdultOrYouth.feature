Feature: PO-548 Enforcement action fields to Payment Terms (Adult or youth only)


  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"

    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button
    Then I see "Account details" on the page header

    When I click on the "Personal details" link
    And I see "Personal details" on the page header
    And I select title "Mr" from dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "ADDR1" into the "Address line 1" field
    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"
    And I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

  Scenario: AC1, AC2 & AC3- positive: If a user ticks the 'Add enforcement action' field, 2 radio buttons will be displayed and labelled as follows
    And I select the "Yes" radio button under the "Has a collection order been made?" section
    And I enter "20/05/2024" into the "Date of collection order" date field

    Then I select the "Pay in full" radio button
    And I enter a date 1 weeks into the future into the "Enter pay by date" date field

    And I select the "Request payment card" checkbox
    When I select the "There are days in default" checkbox

    When I enter "30" into the days in default input field
    And I enter a date 1 weeks into the past into the "Date days in default were imposed" date field

    When I select the "Add enforcement action" checkbox
    Then I validate the "Defendant is in custody (PRIS)" radio button is not selected
    Then I validate the "Hold enforcement on account (NOENF)" radio button is not selected

    Then I select the "Defendant is in custody (PRIS)" radio button
    And I see "Earliest release date (EDR)" under the "Defendant is in custody (PRIS)" radio button
    And I see "Prison and prison number" under the "Defendant is in custody (PRIS)" radio button
    And I enter "05/11/2024" into the "Earliest release date (EDR)" date field

    And I see "Held as enforcement comment" text under the "Prison and prison number" field
    And I enter "Adding" into the "Prison and prison number" text field
    And the characters remaining counter should show 22 after entering 6 characters into the "Prison and prison number" input field

    Then I select the "Hold enforcement on account (NOENF)" radio button

    And I see "Reason account is on NOENF" under the "Hold enforcement on account (NOENF)" radio button
    And I enter "Adding" into the "Reason account is on NOENF" text field
    Then the character remaining should show 22 for the "Reason account is on NOENF" input field

    And I click the "Return to account details" button
    Then I see "Account details" on the page header
    Then I see the status of "Payment terms" is "Provided"


  Scenario: AC4- negative: If a user has selected the 'Add enforcement action' checkbox but has not selected either radio buttons
    When I select the "Add enforcement action" checkbox
    Then I click the "Return to account details" button

    Then I see the error message "Select reason for enforcement action" at the top of the page

  Scenario Outline: AC5a -If a user selected 'Defendant is in custody (PRIS)' but has entered a date in the 'Earliest release date (EDR)' field that does not adhere to validation like 31/02/2023 or 9.3.23)
    When I select the "Add enforcement action" checkbox
    Then I select the "Defendant is in custody (PRIS)" radio button

    Then I enter "<date>" into the "Earliest release date (EDR)" date field

    And I click the "Return to account details" button
    Then I see the error message "Enter a valid calendar date" at the top of the page

    And I click the "Add account comments and notes" button
    Then I see the error message "Enter a valid calendar date" at the top of the page
    And I see "Payment terms" on the page header

    Examples:
      | date       |
      | 31/02/2023 |


  Scenario: AC5b -If a user selected 'Defendant is in custody (PRIS)' but has entered a date in the 'Earliest release date (EDR)' field that does not adhere to validation like 31/02/2023 or 9.3.23)
    When I select the "Add enforcement action" checkbox
    Then I select the "Defendant is in custody (PRIS)" radio button

    Then I enter "<date>" into the "Earliest release date (EDR)" date field
    And I click the "Return to account details" button

    Then I see the error message "Date must be in the format DD/MM/YYYY" at the top of the page

    Then I enter "<date>" into the "Earliest release date (EDR)" date field
    And I click the "Add account comments and notes" button

    Then I see the error message "Date must be in the format DD/MM/YYYY" at the top of the page
    And I see "Payment terms" on the page header

    Examples:
      | date         |
      | 01-02-196709 |


  Scenario Outline: AC6 -If a user selected 'Defendant is in custody (PRIS)' but has entered a date in the 'Earliest release date (EDR)' field that does not adhere to validation like 31/02/2023 or 9.3.23)
    When I select the "Add enforcement action" checkbox
    Then I select the "Defendant is in custody (PRIS)" radio button

    Then I enter "<date>" into the "Earliest release date (EDR)" date field

    And I click the "Return to account details" button
    Then I see the error message "Date must be in the future" at the top of the page

    And I click the "Add account comments and notes" button
    Then I see the error message "Date must be in the future" at the top of the page
    And I see "Payment terms" on the page header

    Examples:
      | date       |
      | 20/04/2024 |


  Scenario: AC7- negative: If a user selected 'Hold enforcement on account (NOENF)' and does not enter a value for 'Reason account is on NOENF' and clicks either the 'Return to account details' or 'Add account comments and notes' buttons
    When I select the "Add enforcement action" checkbox
    When I select the "Hold enforcement on account (NOENF)" radio button

    And I click the "Return to account details" button
    Then I see the error message "Enter a reason" at the top of the page

    And I click the "Add account comments and notes" button
    Then I see the error message "Enter a reason" at the top of the page
    And I see "Payment terms" on the page header

  Scenario: AC8 -negative: If a user has ticked the 'Hold enforcement on account (NOENF)' checkbox and enters one or more characters that are not permitted* into the 'Reason account is on NOENF' free text field
    When I select the "Add enforcement action" checkbox
    When I select the "Hold enforcement on account (NOENF)" radio button

    And I enter "Adding * and $123" into the "Reason account is on NOENF" text field
    Then the character remaining should show 11 for the "Reason account is on NOENF" input field

    And I click the "Return to account details" button
    Then I see the error message "Reason must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes" at the top of the page

    And I enter "Adding * and $123" into the "Reason account is on NOENF" text field
    Then the character remaining should show 11 for the "Reason account is on NOENF" input field

    And I click the "Add account comments and notes" button
    Then I see the error message "Reason must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes" at the top of the page
    And I see "Payment terms" on the page header
