Feature: PO-649 Collection Order fields to Payment Terms screen (Adult or youth with parent or guardian to pay)

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    Then I see "Account details" on the page header
    When I click on the "Personal details" link
    And I see "Personal details" on the page header
    And I select title "Mrs" from dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "ADDR1" into the "Address line 1" field

  Scenario Outline: AC-1a, AC-2 positive: the 'Has a collection order been made?' field should be presented only if the defendant is an Adult

    And I enter "<dateOfBirth>" into the Date of birth field
    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"
    And I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

    And I select the "Yes" radio button under the "Has a collection order been made?" section
    And I see "For example, 31/01/2023" hint text above the "Date of collection order" date picker
    And I enter "20/05/2024" into the "Date of collection order" date field
    When I select the "Pay in full" radio button
    And I see "For example, 31/01/2023" hint text above the "Enter pay by date" date picker
    And I enter a date 52 weeks into the future into the "Enter pay by date" date field

    Examples:
      | dateOfBirth |
      | 20/03/2000  |

  Scenario Outline: AC-1a, AC-3 positive: the 'Has a collection order been made?' field should be presented only, if the defendant is an Adult

    And I enter "20/03/2000" into the Date of birth field
    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"
    And I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

    And I select the "No" radio button under the "Has a collection order been made?" section
    And I select the "Make collection order today" checkbox
    When I select the "Pay in full" radio button
    And I see "For example, 31/01/2023" hint text above the "Enter pay by date" date picker
    And I enter a date 52 weeks into the future into the "Enter pay by date" date field

  Scenario Outline: AC4 -negative: If the user has not selected a value for the 'Has a collection order been made?' field and clicks either the 'Return to account details' or 'Add account comments and notes' buttons

    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"
    And I click on the "Payment terms" link
    Then I see "Payment terms" on the page header
    When I click the "Return to account details" button
    Then I see the error message "Select whether there was a collection order" at the top of the page
    When I click the "Add account comments and notes" button
    Then I see the error message "Select whether there was a collection order" at the top of the page

  Scenario Outline: AC5 -negative: If the user has not selected a value for the 'Has a collection order been made?' field and clicks either the 'Return to account details' or 'Add account comments and notes' buttons

    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"
    And I click on the "Payment terms" link

    And I select the "Yes" radio button under the "Has a collection order been made?" section
    Then I see "Payment terms" on the page header
    When I click the "Return to account details" button
    Then I see the error message "Enter date collection order made" at the top of the page
    When I click the "Add account comments and notes" button
    Then I see the error message "Enter date collection order made" at the top of the page

  Scenario: AC6a -negative: If the user has selected "Yes" for 'Has a collection order been made?' and enters a date that doesn't adhere to validation

    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"
    And I click on the "Payment terms" link

    And I select the "Yes" radio button under the "Has a collection order been made?" section
    And I see "For example, 31/01/2023" hint text above the "Date of collection order" date picker
    And I enter "20.05.2024" into the "Date of collection order" date field
    And I click the "Return to account details" button

    Then I see the error message "Date must be in the format DD/MM/YYYY" at the top of the page

  Scenario: AC6b -negative: If the user has selected "Yes" for 'Has a collection order been made?' and enters a date that doesn't adhere to validation

    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"
    And I click on the "Payment terms" link

    And I select the "Yes" radio button under the "Has a collection order been made?" section
    And I see "For example, 31/01/2023" hint text above the "Date of collection order" date picker
    And I enter "30/02/2022" into the "Date of collection order" date field
    And I click the "Return to account details" button

    Then I see the error message "Enter a valid calendar date" at the top of the page

  Scenario: AC6c -negative: If the user has selected "Yes" for 'Has a collection order been made?' and enters a date that doesn't adhere to validation

    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"
    And I click on the "Payment terms" link

    And I select the "Yes" radio button under the "Has a collection order been made?" section
    And I see "For example, 31/01/2023" hint text above the "Date of collection order" date picker
    And I enter a date 104 weeks into the future into the "Date of collection order" date field
    And I click the "Return to account details" button

    Then I see the error message "Date cannot be in the future" at the top of the page

#This scenario has descoped, New change request
# Scenario: AC6d -negative: If the user has selected "Yes" for 'Has a collection order been made?' and enters a date that doesn't adhere to validation

#   And I click the "Return to account details" button
#   Then I see the status of "Personal details" is "Provided"
#   And I click on the "Payment terms" link

#   And I select the "Yes" radio button under the "Has a collection order been made?" section
#   And I see "For example, 31/01/2023" hint text above the "Date of collection order" date picker
#   And I enter "01/02/1988" into the "Date of collection order" date field
#   And I click the "Return to account details" button

#   Then I see the error message "Date cannot be 2003 or earlier" at the top of the page
