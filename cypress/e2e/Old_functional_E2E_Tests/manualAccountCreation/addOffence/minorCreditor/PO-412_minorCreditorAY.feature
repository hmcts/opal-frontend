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

    Then I enter "FNAME LNAME" into the "Name on the account" field
    And I enter "12-34-56" into the "Sort code" field
    And I enter "12345678" into the "Account number" field
    And I enter "REF" into the "Payment reference" field

    When I unselect the "I have BACS payment details" checkbox
    And I select the "I have BACS payment details" checkbox
    Then I see "" in the "Name on the account" field
    And I see "" in the "Sort code" field
    And I see "" in the "Account number" field
    And I see "" in the "Payment reference" field

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
    And I see the error message "Enter minor creditor's last name" at the top of the page
    And I see the error message "Enter minor creditor's last name" above the "Last name" field

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

    And I unselect the "I have BACS payment details" checkbox

    ## Tests for too many characters in fields
    Then I select the "Individual" radio button
    And I enter 21 alphanumeric characters into the "First name" field
    And I enter 31 alphanumeric characters into the "Last name" field

    And I enter 31 alphanumeric characters into the "Address Line 1" field
    And I enter 31 alphanumeric characters into the "Address Line 2" field
    And I enter 17 alphanumeric characters into the "Address Line 3" field
    And I enter 9 alphanumeric characters into the "Postcode" field

    Then I click the "Save" button
    Then I see the error message "The minor creditor's first name(s) must be 20 characters or fewer" at the top of the page
    And I see the error message "The minor creditor's first name(s) must be 20 characters or fewer" above the "First name" field

    And I see the error message "The minor creditor's last name must be 30 characters or fewer" at the top of the page
    And I see the error message "The minor creditor's last name must be 30 characters or fewer" above the "Last name" field

    And I see the error message "The address line 1 must be 30 characters or fewer" at the top of the page
    And I see the error message "The address line 1 must be 30 characters or fewer" above the "Address line 1" field

    And I see the error message "The address line 2 must be 30 characters or fewer" at the top of the page
    And I see the error message "The address line 2 must be 30 characters or fewer" above the "Address line 2" field

    And I see the error message "The address line 3 must be 16 characters or fewer" at the top of the page
    And I see the error message "The address line 3 must be 16 characters or fewer" above the "Address line 3" field

    And I see the error message "The postcode must be 8 characters or fewer" at the top of the page
    And I see the error message "The postcode must be 8 characters or fewer" above the "Postcode" field

    Then I select the "Company" radio button
    And I enter 51 alphanumeric characters into the "Company name" field

    Then I click the "Save" button
    Then I see the error message "The company name must be 50 characters or fewer" at the top of the page

    Then I select the "I have BACS payment details" checkbox
    And I enter 19 alphanumeric characters into the "Name on the account" field
    And I enter 7 alphanumeric characters into the "Sort code" field
    And I enter 9 alphanumeric characters into the "Account number" field
    And I enter 19 alphanumeric characters into the "Payment reference" field

    Then I click the "Save" button
    Then I see the error message "Name on the account must be 18 characters or fewer" at the top of the page
    And I see the error message "Name on the account must be 18 characters or fewer" above the "Name on the account" field

    And I see the error message "Sort code must be 6 characters or fewer" at the top of the page
    And I see the error message "Sort code must be 6 characters or fewer" above the "Sort code" field

    And I see the error message "Account number must be 8 characters or fewer" at the top of the page
    And I see the error message "Account number must be 8 characters or fewer" above the "Account number" field

    And I see the error message "Payment reference must be 18 characters or fewer" at the top of the page
    And I see the error message "Payment reference must be 18 characters or fewer" above the "Payment reference" field

    ## Tests for special characters in fields
    When I select the "Individual" radio button
    Then I enter "FNAME?" into the "First name" field
    And I enter "LNAME?" into the "Last name" field
    And I enter "Addr1?" into the "Address line 1" field
    And I enter "Addr2?" into the "Address line 2" field
    And I enter "Addr3?" into the "Address line 3" field
    And I enter "Post?" into the "Postcode" field

    Then I click the "Save" button
    Then I see the error message "The minor creditor's first name(s) must only contain alphabetical text" at the top of the page
    And I see the error message "The minor creditor's first name(s) must only contain alphabetical text" above the "First name" field

    And I see the error message "The minor creditor's last name must only contain alphabetical text" at the top of the page
    And I see the error message "The minor creditor's last name must only contain alphabetical text" above the "Last name" field
    ###
    # And I see the error message "The address line 1 must only contain alphanumeric text" at the top of the page
    # And I see the error message "The address line 1 must only contain alphanumeric text" above the "Address line 1" field

    # And I see the error message "The address line 2 must only contain alphanumeric text" at the top of the page
    # And I see the error message "The address line 2 must only contain alphanumeric text" above the "Address line 2" field

    # And I see the error message "The address line 3 must only contain alphanumeric text" at the top of the page
    # And I see the error message "The address line 3 must only contain alphanumeric text" above the "Address line 3" field

    # And I see the error message "The postcode must only contain alphanumeric text" at the top of the page
    # And I see the error message "The postcode must only contain alphanumeric text" above the "Postcode" field
    ###
    Then I select the "Company" radio button
    And I enter "COMPANY?" into the "Company name" field

    Then I click the "Save" button
    Then I see the error message "The company name must only contain alphabetical text" at the top of the page
    And I see the error message "The company name must only contain alphabetical text" above the "Company name" field

    And I enter "FNAME?" into the "Name on the account" field
    And I enter "SORT?" into the "Sort code" field
    And I enter "ACC?" into the "Account number" field
    And I enter "REF?" into the "Payment reference" field

    Then I click the "Save" button
    Then I see the error message "Name on account must only contain letters" at the top of the page
    And I see the error message "Name on account must only contain letters" above the "Name on the account" field

    And I see the error message "Sort code must only contain numbers" at the top of the page
    And I see the error message "Sort code must only contain numbers" above the "Sort code" field

    And I see the error message "Account number must only contain numbers" at the top of the page
    And I see the error message "Account number must only contain numbers" above the "Account number" field

    And I see the error message "Payment reference must only contain letters" at the top of the page
    And I see the error message "Payment reference must only contain letters" above the "Payment reference" field

  Scenario: AC11 - Happy path and summary table - Individual
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 1
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link for imposition 1
    Then I see "Minor creditor details" on the page header

    Then I validate the "Individual" radio button is not selected

    When I select the "Individual" radio button
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1
    Then I see the following Minor creditor details for imposition 1:
      | Minor creditor | FNAME LNAME  |
      | Address        | Not provided |
      | Payment method | Not provided |

  Scenario: AC11 - Happy path and summary table - Company
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 1
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link for imposition 1
    Then I see "Minor creditor details" on the page header

    Then I validate the "Company" radio button is not selected

    When I select the "Company" radio button
    And I enter "COMPANY NAME" into the "Company name" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1
    Then I see the following Minor creditor details for imposition 1:
      | Minor creditor | COMPANY NAME |
      | Address        | Not provided |
      | Payment method | Not provided |

  Scenario: AC11 - Happy path - All fields
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 1
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link for imposition 1
    Then I see "Minor creditor details" on the page header

    When I select the "Individual" radio button
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr1" into the "Address Line 1" field
    And I enter "Addr2" into the "Address Line 2" field
    And I enter "Addr3" into the "Address Line 3" field
    And I enter "TE12 3ST" into the "Postcode" field

    Then I select the "I have BACS payment details" checkbox
    And I enter "F LNAME" into the "Name on the account" field
    And I enter "123456" into the "Sort code" field
    And I enter "12345678" into the "Account number" field
    And I enter "REF" into the "Payment reference" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1
    Then I see the following Minor creditor details for imposition 1:
      | Minor creditor    | FNAME LNAME             |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |


  Scenario: AC12 - Cancel link
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 1
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link for imposition 1
    Then I see "Minor creditor details" on the page header

    When I select the "Individual" radio button
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr1" into the "Address Line 1" field
    And I enter "Addr2" into the "Address Line 2" field
    And I enter "Addr3" into the "Address Line 3" field
    And I enter "TE12 3ST" into the "Postcode" field

    Then I select the "I have BACS payment details" checkbox
    And I enter "F LNAME" into the "Name on the account" field
    And I enter "123456" into the "Sort code" field
    And I enter "12345678" into the "Account number" field
    And I enter "REF" into the "Payment reference" field

    When I click Cancel, a window pops up and I click Ok
    Then I see "Add an offence" on the page header
    And I see "Compensation (FCOMP)" in the "Result code" field for imposition 1
    And I validate the "Minor creditor" radio button is selected

    When I click on the "Add minor creditor details" link for imposition 1
    Then I see "Minor creditor details" on the page header
    And I validate the "Individual" radio button is not selected
    And I validate the "Company" radio button is not selected
    And I see "" in the "Address Line 1" field
    And I see "" in the "Address Line 2" field
    And I see "" in the "Address Line 3" field
    And I see "" in the "Postcode" field
    And I validate the "I have BACS payment details" checkbox is not checked

    When I select the "Individual" radio button
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr1" into the "Address Line 1" field
    And I enter "Addr2" into the "Address Line 2" field
    And I enter "Addr3" into the "Address Line 3" field
    And I enter "TE12 3ST" into the "Postcode" field

    Then I select the "I have BACS payment details" checkbox
    And I enter "F LNAME" into the "Name on the account" field
    And I enter "123456" into the "Sort code" field
    And I enter "12345678" into the "Account number" field
    And I enter "REF" into the "Payment reference" field

    When I click Cancel, a window pops up and I click Cancel
    Then I see "Minor creditor details" on the page header
    And I see "FNAME" in the "First name" field
    And I see "LNAME" in the "Last name" field
    And I see "Addr1" in the "Address Line 1" field
    And I see "Addr2" in the "Address Line 2" field
    And I see "Addr3" in the "Address Line 3" field
    And I see "TE12 3ST" in the "Postcode" field
    And I see "F LNAME" in the "Name on the account" field
    And I see "123456" in the "Sort code" field
    And I see "12345678" in the "Account number" field
    And I see "REF" in the "Payment reference" field
