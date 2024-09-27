Feature: PO-587 Implement additional fields for payment terms screen - Adult or youth with parent or guardian to pay
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
    And I select title "Mr" from dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "ADDR1" into the "Address line 1" field
    And I click the "Return to account details" button
    And I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

  Scenario: AC1, AC2, AC3 & AC4 - New fields

    When I select the "Pay in full" radio button
    And I see "For example, 31/01/2023" hint text above the "Enter pay by date" date picker
    And I enter a date 52 weeks into the past into the "Enter pay by date" date field
    Then I see "Pay by date is in the past" help text on the page
    And I see "You can continue with date in the past or change" help text on the page

    When I enter a date 200 weeks into the future into the "Enter pay by date" date field
    Then I see "Pay by date is more than 3 years in the future" help text on the page
    And I see "You can continue with date in the past or change" help text on the page

    When I select the "Instalments only" radio button
    And I enter "1000" into the "Instalment" payment field
    And I validate the "Weekly" radio button is not selected
    And I validate the "Fortnightly" radio button is not selected
    And I validate the "Monthly" radio button is not selected
    And I see "For example, 31/01/2023" hint text above the "Start date" date picker
    And I enter a date 52 weeks into the past into the "Start date" date field
    Then I see "Start date is in the past" help text on the page
    And I see "You can continue with date in the past or change" help text on the page

    When I enter a date 200 weeks into the future into the "Start date" date field
    Then I see "Start date is more than 3 years in the future" help text on the page
    And I see "You can continue with date in the past or change" help text on the page

    When I select the "Lump sum plus instalments" radio button
    And I enter "500" into the "Lump sum" payment field
    And I enter "1000" into the "Instalment" payment field
    And I validate the "Weekly" radio button is not selected
    And I validate the "Fortnightly" radio button is not selected
    And I validate the "Monthly" radio button is not selected
    And I see "For example, 31/01/2023" hint text above the "Start date" date picker
    And I enter a date 52 weeks into the past into the "Start date" date field
    Then I see "Start date is in the past" help text on the page
    And I see "You can continue with date in the past or change" help text on the page

    When I enter a date 200 weeks into the future into the "Start date" date field
    Then I see "Start date is more than 3 years in the future" help text on the page
    And I see "You can continue with date in the past or change" help text on the page

  Scenario: AC5 - Lump sum and instalment field behaviour

    When I select the "Instalments only" radio button
    And I enter "500.5" into the "Instalment" payment field
    And I select the "Weekly" radio button
    And I see "500.50" in the "Instalment" payment field

    When I select the "Lump sum plus instalments" radio button
    And I enter "100.1" into the "Lump sum" payment field
    And I enter "200.25" into the "Instalment" payment field
    Then I see "100.10" in the "Lump sum" payment field
    And I see "200.25" in the "Instalment" payment field

  Scenario: AC7, AC8, AC9, AC10, AC11, AC12, AC13 & AC14 - Error handling

    #AC7

    When I click the "Return to account details" button
    And I see the error message "Select payment terms" at the top of the page
    And I see the error message "Select payment terms" above the "Pay in full" radio button
    And I click the "Add account comments and notes" button
    Then I see the error message "Select payment terms" at the top of the page
    And I see the error message "Select payment terms" above the "Pay in full" radio button

    #AC8

    When I select the "Pay in full" radio button
    And I click the "Return to account details" button
    And I see the error message "Enter a pay by date" at the top of the page
    And I see the error message "Enter a pay by date" above the "Enter pay by date" date field
    And I click the "Add account comments and notes" button
    Then I see the error message "Enter a pay by date" at the top of the page
    And I see the error message "Enter a pay by date" above the "Enter pay by date" date field

    #AC9

    When I select the "Instalments only" radio button
    And I click the "Return to account details" button
    And I see the error message "Enter instalment amount" at the top of the page
    And I see the error message "Select frequency of payment" at the top of the page
    And I see the error message "Enter start date" at the top of the page
    And I see the error message "Enter instalment amount" above the "Instalment" payment field
    And I see the error message "Select frequency of payment" above the "Weekly" radio button
    And I see the error message "Enter start date" above the "Start date" date field
    And I click the "Add account comments and notes" button
    Then I see the error message "Enter instalment amount" at the top of the page
    And I see the error message "Select frequency of payment" at the top of the page
    And I see the error message "Enter start date" at the top of the page
    And I see the error message "Enter instalment amount" above the "Instalment" payment field
    And I see the error message "Select frequency of payment" above the "Weekly" radio button
    And I see the error message "Enter start date" above the "Start date" date field

    #AC10

    When I select the "Lump sum plus instalments" radio button
    And I click the "Return to account details" button
    And I see the error message "Enter lump sum" at the top of the page
    And I see the error message "Enter instalment amount" at the top of the page
    And I see the error message "Select frequency of payment" at the top of the page
    And I see the error message "Enter start date" at the top of the page
    And I see the error message "Enter lump sum" above the "Lump sum" payment field
    And I see the error message "Enter instalment amount" above the "Instalment" payment field
    And I see the error message "Select frequency of payment" above the "Weekly" radio button
    And I see the error message "Enter start date" above the "Start date" date field
    And I click the "Add account comments and notes" button
    Then I see the error message "Enter lump sum" at the top of the page
    And I see the error message "Enter instalment amount" at the top of the page
    And I see the error message "Select frequency of payment" at the top of the page
    And I see the error message "Enter start date" at the top of the page
    And I see the error message "Enter lump sum" above the "Lump sum" payment field
    And I see the error message "Enter instalment amount" above the "Instalment" payment field
    And I see the error message "Select frequency of payment" above the "Weekly" radio button
    And I see the error message "Enter start date" above the "Start date" date field

    #AC11

    When I select the "Pay in full" radio button
    And I enter "32/09/2025" into the "Enter pay by date" date field
    And I click the "Return to account details" button
    Then I see the error message "Enter a valid calendar date" at the top of the page
    And I see the error message "Enter a valid calendar date" above the "Enter pay by date" date field

    When I enter "13.09.2023" into the "Enter pay by date" date field
    And I click the "Return to account details" button
    Then I see the error message "Pay by date must be in the format DD/MM/YYYY" at the top of the page
    And I see the error message "Pay by date must be in the format DD/MM/YYYY" above the "Enter pay by date" date field

    #AC12

    When I select the "Instalments only" radio button
    And I enter "32/09/2025" into the "Start date" date field
    And I click the "Return to account details" button
    Then I see the error message "Enter a valid calendar date" at the top of the page
    And I see the error message "Enter a valid calendar date" above the "Start date" date field

    When I enter "13.09.2023" into the "Start date" date field
    And I click the "Return to account details" button
    Then I see the error message "Start date must be in the format DD/MM/YYYY" at the top of the page
    And I see the error message "Start date must be in the format DD/MM/YYYY" above the "Start date" date field

    When I select the "Lump sum plus instalments" radio button
    And I enter "32/09/2025" into the "Start date" date field
    And I click the "Return to account details" button
    Then I see the error message "Enter a valid calendar date" at the top of the page
    And I see the error message "Enter a valid calendar date" above the "Start date" date field

    When I enter "13.09.2023" into the "Start date" date field
    And I click the "Return to account details" button
    Then I see the error message "Start date must be in the format DD/MM/YYYY" at the top of the page
    And I see the error message "Start date must be in the format DD/MM/YYYY" above the "Start date" date field

    #AC13

    When I select the "Instalments only" radio button
    And I enter "100.125" into the "Instalment" payment field
    And I click the "Return to account details" button
    Then I see the error message "Enter valid instalment amount" at the top of the page
    And I see the error message "Enter valid instalment amount" above the "Instalment" payment field

    When I enter "10!" into the "Instalment" payment field
    And I click the "Return to account details" button
    Then I see the error message "Enter valid instalment amount" at the top of the page
    And I see the error message "Enter valid instalment amount" above the "Instalment" payment field

    #AC14

    When I select the "Lump sum plus instalments" radio button
    And I enter "200.555" into the "Lump sum" payment field
    And I enter "300.825" into the "Instalment" payment field
    And I click the "Return to account details" button
    Then I see the error message "Enter valid lump sum amount" at the top of the page
    Then I see the error message "Enter valid instalment amount" at the top of the page
    And I see the error message "Enter valid lump sum amount" above the "Lump sum" payment field
    And I see the error message "Enter valid instalment amount" above the "Instalment" payment field

    When I enter "20!" into the "Lump sum" payment field
    And I enter "30!" into the "Instalment" payment field
    And I click the "Return to account details" button
    Then I see the error message "Enter valid lump sum amount" at the top of the page
    And I see the error message "Enter valid instalment amount" at the top of the page
    And I see the error message "Enter valid lump sum amount" above the "Lump sum" payment field
    And I see the error message "Enter valid instalment amount" above the "Instalment" payment field

  Scenario: AC6 & AC15 - Validation passes, request payment card checkbox, return to account details

    When I select the "No" radio button under the "Has a collection order been made?" section
    And I select the "Pay in full" radio button
    And I enter a date 52 weeks into the future into the "Enter pay by date" date field
    And I select the "Request payment card" checkbox
    And I click the "Return to account details" button
    Then I see the status of "Payment terms" is "Provided"

    When I click on the "Payment terms" link
    Then I see "Payment terms" on the page header
    And I validate the "Pay in full" radio button is selected
    And I see a date 52 weeks into the future in the "Enter pay by date" date field
    And I validate the "Request payment card" checkbox is checked

  Scenario: AC6 & AC16 - Validation passes, request payment card checkbox, add account comments and notes

    When I select the "No" radio button under the "Has a collection order been made?" section
    And I select the "Lump sum plus instalments" radio button
    And I enter "150" into the "Lump sum" payment field
    And I enter "300" into the "Instalment" payment field
    And I select the "Monthly" radio button
    And I enter a date 52 weeks into the future into the "Start date" date field
    And I select the "Request payment card" checkbox
    And I click the "Return to account details" button
    Then I see the status of "Payment terms" is "Provided"

    When I click on the "Payment terms" link
    Then I see "Payment terms" on the page header
    And I see "150" in the "Lump sum" payment field
    And I see "300" in the "Instalment" payment field
    And I validate the "Monthly" radio button is selected
    And I see a date 52 weeks into the future in the "Start date" date field
    And I validate the "Request payment card" checkbox is checked

  Scenario: AC17 & AC18 - Cancel link behaviour

    #AC17

    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I see the status of "Payment terms" is "Not provided"

    #AC18a

    When I click on the "Payment terms" link
    And I see "Payment terms" on the page header
    And I select the "Instalments only" radio button
    And I enter "450" into the "Instalment" payment field
    And I select the "Request payment card" checkbox
    And I click Cancel, a window pops up and I click Ok
    Then I see "Account details" on the page header
    And I see the status of "Payment terms" is "Not provided"

    When I click on the "Payment terms" link
    Then I validate the "Instalments only" radio button is not selected
    And I validate the "Request payment card" checkbox is not checked

    #AC18b

    When I select the "Instalments only" radio button
    And I enter "450" into the "Instalment" payment field
    And I select the "Fortnightly" radio button
    And I select the "Request payment card" checkbox
    And I click the "Return to account details" button
    And I see the error message "Enter start date" at the top of the page
    And I see the error message "Enter start date" above the "Start date" date field
    And I click Cancel, a window pops up and I click Cancel
    Then I see "Payment terms" on the page header
    And I see "450" in the "Instalment" payment field
    And I validate the "Fortnightly" radio button is selected
    And I validate the "Request payment card" checkbox is checked
    And I see the error message "Enter start date" at the top of the page
    And I see the error message "Enter start date" above the "Start date" date field
