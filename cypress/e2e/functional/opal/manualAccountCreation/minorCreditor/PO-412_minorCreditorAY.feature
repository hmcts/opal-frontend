Feature: PO-412 - Minor Creditor - Adult or Youth

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page

  Scenario: AC1 - Minor creditor option only available for FCOMP and FCOST
    And I enter "Compensation (FCOMP)" into the "Result code" field for imposition 1
    And I enter "2" into the "Amount imposed" field for imposition 1
    Then I see the "Minor creditor" radio button

    When I clear the "Result code" field for imposition 1
    And I clear the "Amount imposed" field for imposition 1

    And I enter "Costs (FCOST)" into the "Result code" field for imposition 1
    And I enter "2" into the "Amount imposed" field for imposition 1
    Then I see the "Minor creditor" radio button

    When I clear the "Result code" field for imposition 1
    And I clear the "Amount imposed" field for imposition 1

    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "2" into the "Amount imposed" field for imposition 1
    Then I do not see the "Minor creditor" radio button

    When I clear the "Result code" field for imposition 1
    And I clear the "Amount imposed" field for imposition 1

    And I enter "Victim Surcharge (FVS)" into the "Result code" field for imposition 1
    And I enter "2" into the "Amount imposed" field for imposition 1
    Then I do not see the "Minor creditor" radio button

    When I clear the "Result code" field for imposition 1
    And I clear the "Amount imposed" field for imposition 1

    And I enter "Crown prosecution costs (FCPC)" into the "Result code" field for imposition 1
    And I enter "2" into the "Amount imposed" field for imposition 1
    Then I do not see the "Minor creditor" radio button

    When I clear the "Result code" field for imposition 1
    And I clear the "Amount imposed" field for imposition 1

    And I enter "Criminal courts charge (FCC)" into the "Result code" field for imposition 1
    And I enter "20" into the "Amount imposed" field for imposition 1
    Then I do not see the "Minor creditor" radio button

    When I clear the "Result code" field for imposition 1
    And I clear the "Amount imposed" field for imposition 1

    And I enter "Vehicle excise duty (FVEBD)" into the "Result code" field for imposition 1
    And I enter "2" into the "Amount imposed" field for imposition 1
    Then I do not see the "Minor creditor" radio button

    When I clear the "Result code" field for imposition 1
    And I clear the "Amount imposed" field for imposition 1

    And I enter "Forfeited recognizance (FFR)" into the "Result code" field for imposition 1
    And I enter "2" into the "Amount imposed" field for imposition 1
    Then I do not see the "Minor creditor" radio button

  Scenario: AC2,3,4,5,6,10 - Precence of fields and conditional fields
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 1
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link
    Then I see "Minor creditor details" on the page header

    Then I validate the "Individual" radio button is not selected
    And I validate the "Company" radio button is not selected

    And I see "" in the "Address Line 1" field
    And I see "" in the "Address Line 2" field
    And I see "" in the "Address Line 3" field
    And I see "" in the "Postcode" field

    And I validate the "I have BACS payment details" checkbox is not checked

    When I select the "Individual" radio button
    Then I see there is no selected option in the "Title" dropdown
    And I see "" in the "First name" field
    And I see "" in the "Last name" field

    When I select the "Company" radio button
    Then I see "" in the "Company name" field

    When I select the "I have BACS payment details" checkbox
    Then I see "" in the "Name on the account" field
    And I see "" in the "Sort code" field
    And I see "" in the "Account number" field
    And I see "" in the "Payment reference" field

    When I enter "COMPANY NAME" into the "Company name" field
    And I select the "Individual" radio button
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field

    When I select the "Company" radio button
    Then I see "" in the "Company name" field

    When I select the "Individual" radio button
    Then I see there is no selected option in the "Title" dropdown
    And I see "" in the "First name" field
    And I see "" in the "Last name" field

    When I select the "I have BACS payment details" checkbox
    And I enter "FNAME LNAME" into the "Name on the account" field
    And I enter "12-34-56" into the "Sort code" field
    And I enter "12345678" into the "Account number" field
    And I enter "REF" into the "Payment reference" field

    When I unselect the "I have BACS payment details" checkbox
    And I select the "I have BACS payment details" checkbox
    Then I see "" in the "Name on the account" field
    And I see "" in the "Sort code" field
    And I see "" in the "Account number" field
    And I see "" in the "Payment reference" field


  @only
  Scenario: AC7,8,9 - Field validation and error messages
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 1
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link
    Then I see "Minor creditor details" on the page header

    When I click the "Save" button
    Then I see the error message "Select whether minor creditor is an individual or company" at the top of the page
    And I see the error message "Select whether minor creditor is an individual or company" above the "Individual" radio button
    And I see the error message "Select whether minor creditor is an individual or company" above the "Company" radio button

    When I select the "Individual" radio button
    When I click the "Save" button
    #And I see the error message "Enter minor creditor’s last name" at the top of the page
    #And I see the error message "Enter minor creditor’s last name" above the "Last name" field

    When I select the "Company" radio button
    When I click the "Save" button
    Then I see the error message "Enter company name" at the top of the page

    When I select the "I have BACS payment details" checkbox
    When I click the "Save" button

    Then I see the error message "Enter name on the account" at the top of the page
    And I see the error message "Enter name on the account" above the "Name on the account" field

    And I see the error message "Enter sort code" at the top of the page
    And I see the error message "Enter sort code" above the "Sort code" field

    And I see the error message "Enter account number" at the top of the page
    And I see the error message "Enter account number" above the "Account number" field

    And I see the error message "Enter payment reference" at the top of the page
    And I see the error message "Enter payment reference" above the "Payment reference" field


