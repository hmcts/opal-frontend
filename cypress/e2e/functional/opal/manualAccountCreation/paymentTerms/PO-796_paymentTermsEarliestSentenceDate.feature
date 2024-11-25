Feature: PO-796 Payment Terms - Date of collection order cannot be before earliest sentence date error message
  Scenario: AC1 - Earliest sentence date error message - Adult or youth only
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
    And I select title "Mrs" from dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "ADDR1" into the "Address line 1" field
    And I click the "Return to account details" button

    When I click on the "Offence details" link
    Then I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1

    And I click the "Review offence" button
    And I click the "Return to account details" button

    Then I see the status of "Offence details" is "Provided"
    And I click on the "Payment terms" link

    Then I see "Payment terms" on the page header
    And I select the "Yes" radio button under the "Has a collection order been made?" section

    When I enter a date 10 weeks into the past into the "Date of collection order" date field
    And I click the "Return to account details" button

    Then I see the error message "Date cannot be before the date of sentence" at the top of the page
    And I see the error message "Date cannot be before the date of sentence" above the "Date of collection order" date field

    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I click on the "Offence details" link
    And I click the "Remove" link for offence "TP11003"
    And I click the "Yes - remove offence and all impositions" button
    And I click the "Return to account details" button

    Then I click on the "Payment terms" link
    And I select the "Yes" radio button under the "Has a collection order been made?" section
    And I enter a date 15 weeks into the past into the "Date of collection order" date field
    And I select the "Pay in full" radio button
    And I enter a date 52 weeks into the future into the "Enter pay by date" date field

    When I click the "Return to account details" button
    Then I see the status of "Payment terms" is "Provided"

  Scenario: AC2 - Earliest sentence date error message - Adult or youth with parent or guardian to pay
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    Then I see "Account details" on the page header

    When I click on the "Offence details" link
    Then I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1

    And I click the "Review offence" button
    And I click the "Return to account details" button

    Then I see the status of "Offence details" is "Provided"
    And I click on the "Payment terms" link

    Then I see "Payment terms" on the page header
    And I select the "Yes" radio button under the "Has a collection order been made?" section

    When I enter a date 10 weeks into the past into the "Date of collection order" date field
    And I click the "Return to account details" button

    Then I see the error message "Date cannot be before the date of sentence" at the top of the page
    And I see the error message "Date cannot be before the date of sentence" above the "Date of collection order" date field

    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I click on the "Offence details" link
    And I click the "Remove" link for offence "TP11003"
    And I click the "Yes - remove offence and all impositions" button
    And I click the "Return to account details" button

    Then I click on the "Payment terms" link
    And I select the "Yes" radio button under the "Has a collection order been made?" section
    And I enter a date 15 weeks into the past into the "Date of collection order" date field
    And I select the "Pay in full" radio button
    And I enter a date 52 weeks into the future into the "Enter pay by date" date field

    When I click the "Return to account details" button
    Then I see the status of "Payment terms" is "Provided"


