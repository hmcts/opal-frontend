Feature: PO-686 - Minor Creditor Edit - Adult or Youth
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

  Scenario: AC1,2,3,4 - Minor Creditor Edit - Individual
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 1
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link for imposition 1
    Then I see "Minor creditor details" on the page header

    Then I validate the "Individual" radio button is not selected

    When I select the "Individual" radio button
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field

    Then I enter "ADDR1" into the "Address line 1" field
    And I enter "ADDR2" into the "Address line 2" field
    And I enter "ADDR3" into the "Address line 3" field
    And I enter "TE12 3ST" into the "Postcode" field

    Then I select the "I have BACS payment details" checkbox
    And I enter "MR F LNAME" into the "Name on the account" field
    And I enter "123456" into the "Sort code" field
    And I enter "12345678" into the "Account number" field
    And I enter "Payment Ref" into the "Payment reference" field

    Then I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1
    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor      | FNAME LNAME             |
      | Address             | ADDR1ADDR2ADDR3TE12 3ST |
      | Payment method      | BACS                    |
      | Name on the account | MR F LNAME              |
      | Sort code           | 12-34-56                |
      | Account number      | 12345678                |
      | Payment reference   | Payment Ref             |

    When I click on the "Change" link for imposition 1
    Then I see "Minor creditor details" on the page header

    Then I validate the "Individual" radio button is selected
    And I see "Mr" selected in the "Title" dropdown
    And I see "FNAME" in the "First name" field
    And I see "LNAME" in the "Last name" field

    And I see "ADDR1" in the "Address line 1" field
    And I see "ADDR2" in the "Address line 2" field
    And I see "ADDR3" in the "Address line 3" field
    And I see "TE12 3ST" in the "Postcode" field

    And I validate the "I have BACS payment details" checkbox is checked
    And I see "MR F LNAME" in the "Name on the account" field
    And I see "123456" in the "Sort code" field
    And I see "12345678" in the "Account number" field
    And I see "Payment Ref" in the "Payment reference" field

    When I select the "Company" radio button
    Then I select the "Individual" radio button
    And I click the "Save" button

    Then I see the error message "Enter minor creditor's last name" at the top of the page
    And I see the error message "Enter minor creditor's last name" above the "Last name" field

    Then I select the "Company" radio button
    And I click the "Save" button

    Then I see the error message "Enter company name" at the top of the page
    And I see the error message "Enter company name" above the "Company name" field

    Then I enter "CNAME" into the "Company name" field

    And I enter "CADDR1" into the "Address line 1" field
    And I enter "CADDR2" into the "Address line 2" field
    And I enter "CADDR3" into the "Address line 3" field
    And I enter "TE12 3ST" into the "Postcode" field

    And I clear the "Name on the account" field
    And I clear the "Sort code" field
    And I clear the "Account number" field
    And I clear the "Payment reference" field

    When I click the "Save" button

    Then I see the error message "Enter name on the account" at the top of the page
    Then I see the error message "Enter name on the account" above the "Name on the account" field

    Then I see the error message "Enter sort code" at the top of the page
    Then I see the error message "Enter sort code" above the "Sort code" field

    Then I see the error message "Enter account number" at the top of the page
    Then I see the error message "Enter account number" above the "Account number" field

    Then I see the error message "Enter payment reference" at the top of the page
    Then I see the error message "Enter payment reference" above the "Payment reference" field

    Then I enter "CNAME" into the "Name on the account" field
    And I enter "654321" into the "Sort code" field
    And I enter "87654321" into the "Account number" field
    And I enter "Company Ref" into the "Payment reference" field

    When I click the "Save" button

    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1
    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor      | CNAME                      |
      | Address             | CADDR1CADDR2CADDR3TE12 3ST |
      | Payment method      | BACS                       |
      | Name on the account | CNAME                      |
      | Sort code           | 65-43-21                   |
      | Account number      | 87654321                   |
      | Payment reference   | Company Ref                |

    When I click on the "Change" link for imposition 1
    Then I see "Minor creditor details" on the page header

    Then I validate the "Company" radio button is selected
    And I see "CNAME" in the "Company name" field
    And I enter "CNAME LTD" into the "Company name" field

    When I click Cancel, a window pops up and I click Ok
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1
    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor      | CNAME                      |
      | Address             | CADDR1CADDR2CADDR3TE12 3ST |
      | Payment method      | BACS                       |
      | Name on the account | CNAME                      |
      | Sort code           | 65-43-21                   |
      | Account number      | 87654321                   |
      | Payment reference   | Company Ref                |

    When I click on the "Change" link for imposition 1
    Then I see "Minor creditor details" on the page header

    Then I validate the "Company" radio button is selected
    And I see "CNAME" in the "Company name" field
    And I enter "CNAME LTD" into the "Company name" field

    When I click Cancel, a window pops up and I click Cancel
    Then I see "Minor creditor details" on the page header

    Then I validate the "Company" radio button is selected
    And I see "CNAME LTD" in the "Company name" field
    And I see "CADDR1" in the "Address line 1" field
    And I see "CADDR2" in the "Address line 2" field
    And I see "CADDR3" in the "Address line 3" field
    And I see "TE12 3ST" in the "Postcode" field

    And I validate the "I have BACS payment details" checkbox is checked
    And I see "CNAME" in the "Name on the account" field
    And I see "654321" in the "Sort code" field
    And I see "87654321" in the "Account number" field
    And I see "Company Ref" in the "Payment reference" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1
    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor      | CNAME LTD                  |
      | Address             | CADDR1CADDR2CADDR3TE12 3ST |
      | Payment method      | BACS                       |
      | Name on the account | CNAME                      |
      | Sort code           | 65-43-21                   |
      | Account number      | 87654321                   |
      | Payment reference   | Company Ref                |


    ### below is to test for issue found in development - no assosicated ticket
    When I click the "Add another imposition" button
    And I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 2
    And I select the "Minor creditor" radio button for imposition 2
    And I click on the "Add minor creditor details" link for imposition 2
    Then I see "Minor creditor details" on the page header

    Then I validate the "Individual" radio button is not selected
    And I validate the "Company" radio button is not selected

    And I see "" in the "Address line 1" field
    And I validate the "I have BACS payment details" checkbox is not checked

    When I click on the "Cancel" link
    Then I see the "Add minor creditor details" link for imposition 2
