Feature: PO-434 Employer details - Adult or Youth Only - 'Add offence details' button

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header

    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button
    Then I see "Account details" on the page header
    And I see the status of "Employer details" is "Not provided"

    Then I click on the "Employer details" link
    Then I see "Employer details" on the page header

  Scenario: AC1,2,3 - contact details - mandatory error messages - no data entered
    Given I enter "Addr2" into the "Address line 2" field

    When I click the "Add offence details" button

    Then I see "Employer details" on the page header

    And I see the error message "Enter employer name" at the top of the page
    And I see the error message "Enter employee reference or National Insurance number" at the top of the page
    And I see the error message "Enter employer address line 1, typically the building and street" at the top of the page

    And I see the error message "Enter employer name" above the "Employer name" field
    And I see the error message "Enter employee reference or National Insurance number" above the "Employee reference" field
    And I see the error message "Enter employer address line 1, typically the building and street" above the "Address line 1" field

  Scenario Outline: AC4,5,6,7 - contact details - error messages - format validation
    When I enter "<incorrectEmailOne>" into the "Employer email address" field
    And I enter "<incorrectPhone>" into the "Employer telephone" field
    And I enter "<incorrectAddr1>" into the "Address line 1" field
    And I enter "<incorrectAddr2>" into the "Address line 2" field
    And I enter "<incorrectAddr3>" into the "Address line 3" field
    And I enter "<incorrectAddr4>" into the "Address line 4" field
    And I enter "<incorrectAddr5>" into the "Address line 5" field

    When I click the "Add offence details" button

    Then I see "Employer details" on the page header

    Then I see the error message "Enter employer name" at the top of the page
    And I see the error message "Enter employee reference or National Insurance number" at the top of the page
    And I see the error message "Enter employer email address in the correct format like, name@example.com" at the top of the page
    And I see the error message "Enter employer telephone number in the correct format" at the top of the page
    And I see the error message "The employer address line 1 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 2 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 3 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 4 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 5 must not contain special characters" at the top of the page

    And I see the error message "Enter employer name" above the "Employer name" field
    And I see the error message "Enter employee reference or National Insurance number" above the "Employee reference" field
    And I see the error message "Enter employer email address in the correct format like, name@example.com" above the "Employer email address" field
    And I see the error message "Enter employer telephone number in the correct format" above the "Employer telephone" field
    And I see the error message "The employer address line 1 must not contain special characters" above the "Address line 1" field
    And I see the error message "The employer address line 2 must not contain special characters" above the "Address line 2" field
    And I see the error message "The employer address line 3 must not contain special characters" above the "Address line 3" field
    And I see the error message "The employer address line 4 must not contain special characters" above the "Address line 4" field
    And I see the error message "The employer address line 5 must not contain special characters" above the "Address line 5" field

    When I enter "<incorrectEmailTwo>" into the "Employer email address" field
    And I enter "<incorrectPhoneTwo>" into the "Employer telephone" field

    Then I see the error message "Enter employer name" at the top of the page
    And I see the error message "Enter employee reference or National Insurance number" at the top of the page
    And I see the error message "Enter employer email address in the correct format like, name@example.com" at the top of the page
    And I see the error message "Enter employer telephone number in the correct format" at the top of the page
    And I see the error message "The employer address line 1 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 2 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 3 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 4 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 5 must not contain special characters" at the top of the page

    And I see the error message "Enter employer name" above the "Employer name" field
    And I see the error message "Enter employee reference or National Insurance number" above the "Employee reference" field
    And I see the error message "Enter employer email address in the correct format like, name@example.com" above the "Employer email address" field
    And I see the error message "Enter employer telephone number in the correct format" above the "Employer telephone" field
    And I see the error message "The employer address line 1 must not contain special characters" above the "Address line 1" field
    And I see the error message "The employer address line 2 must not contain special characters" above the "Address line 2" field
    And I see the error message "The employer address line 3 must not contain special characters" above the "Address line 3" field
    And I see the error message "The employer address line 4 must not contain special characters" above the "Address line 4" field
    And I see the error message "The employer address line 5 must not contain special characters" above the "Address line 5" field

    When I enter "Employer 1" into the "Employer name" field
    And I enter "1234567890" into the "Employee reference" field
    And I enter "<correctEmail>" into the "Employer email address" field
    And I enter "<correctPhone>" into the "Employer telephone" field
    And I enter "<correctAddr1>" into the "Address line 1" field
    And I enter "<correctAddr2>" into the "Address line 2" field
    And I enter "<correctAddr3>" into the "Address line 3" field
    And I enter "<correctAddr4>" into the "Address line 4" field
    And I enter "<correctAddr5>" into the "Address line 5" field
    And I enter "TE12 3ST" into the "Postcode" field

    When I click the "Add offence details" button

    Then I see "Add an offence" on the page header
    And I click on the "Cancel" link

    Then I see the status of "Employer details" is "Provided"

    Then I click on the "Employer details" link
    Then I see "Employer details" on the page header

    And I see "Employer 1" in the "Employer name" field
    And I see "1234567890" in the "Employee reference" field
    And I see "<correctEmail>" in the "Employer email address" field
    And I see "<correctPhone>" in the "Employer telephone" field
    And I see "<correctAddr1>" in the "Address line 1" field
    And I see "<correctAddr2>" in the "Address line 2" field
    And I see "<correctAddr3>" in the "Address line 3" field
    And I see "<correctAddr4>" in the "Address line 4" field
    And I see "<correctAddr5>" in the "Address line 5" field
    And I see "TE12 3ST" in the "Postcode" field

    Examples:
      | incorrectEmailOne | incorrectEmailTwo | correctEmail   | incorrectPhone  | incorrectPhoneTwo | correctPhone  | incorrectAddr1 | correctAddr1 | incorrectAddr2 | correctAddr2 | incorrectAddr3 | correctAddr3 | incorrectAddr4 | correctAddr4 | incorrectAddr5 | correctAddr5 |
      | test@com          | test.com          | test@email.com | 123 123 123 123 | abc 123 abc       | 01234 567 890 | Addr*1         | Addr1        | Addr*2         | Addr2        | Addr*3         | Addr3        | Addr*4         | Addr4        | Addr*5         | Addr5        |

  Scenario: AC4,5,6,7 - contact details - error messages - length validation
    When I enter "Employer 1 testTestTestTestTestTest1" into the "Employer name" field
    And I enter "123456789012345678901" into the "Employee reference" field
    And I enter "employerEmailtesttesttesttesttesttesttesttesttesttesttesttesttest123@test.com" into the "Employer email address" field
    And I enter "Addr1testTestTestTestTestTest12" into the "Address line 1" field
    And I enter "Addr2testTestTestTestTestTest12" into the "Address line 2" field
    And I enter "Addr3testTestTestTestTestTest12" into the "Address line 3" field
    And I enter "Addr4testTestTestTestTestTest12" into the "Address line 4" field
    And I enter "Addr5testTestTestTestTestTest12" into the "Address line 5" field
    And I enter "TE12 3ST 1" into the "Postcode" field

    When I click the "Add offence details" button

    Then I see "Employer details" on the page header

    Then I see the error message "The employer name must be 35 characters or fewer" at the top of the page
    And I see the error message "The employee reference must be 20 characters or fewer" at the top of the page
    And I see the error message "The employer email address must be 76 characters or fewer" at the top of the page

    And I see the error message "The employer address line 1 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer address line 2 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer address line 3 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer address line 4 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer address line 5 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer postcode must be 8 characters or fewer" at the top of the page

    And I see the error message "The employer name must be 35 characters or fewer" above the "Employer name" field
    And I see the error message "The employee reference must be 20 characters or fewer" above the "Employee reference" field
    And I see the error message "The employer email address must be 76 characters or fewer" above the "Employer email address" field

    And I see the error message "The employer address line 1 must be 30 characters or fewer" above the "Address line 1" field
    And I see the error message "The employer address line 2 must be 30 characters or fewer" above the "Address line 2" field
    And I see the error message "The employer address line 3 must be 30 characters or fewer" above the "Address line 3" field
    And I see the error message "The employer address line 4 must be 30 characters or fewer" above the "Address line 4" field
    And I see the error message "The employer address line 5 must be 30 characters or fewer" above the "Address line 5" field
    And I see the error message "The employer postcode must be 8 characters or fewer" above the "Postcode" field

    When I enter "Employer 1 testTestTestTestTestTest" into the "Employer name" field
    And I enter "12345678901234567890" into the "Employee reference" field
    And I enter "employerEmailtesttesttesttesttesttesttesttesttesttesttesttesttest12@test.com" into the "Employer email address" field
    And I enter "Addr1testTestTestTestTestTest1" into the "Address line 1" field
    And I enter "Addr2testTestTestTestTestTest1" into the "Address line 2" field
    And I enter "Addr3testTestTestTestTestTest1" into the "Address line 3" field
    And I enter "Addr4testTestTestTestTestTest1" into the "Address line 4" field
    And I enter "Addr5testTestTestTestTestTest1" into the "Address line 5" field
    And I enter "TE12 3ST" into the "Postcode" field

    When I click the "Add offence details" button

    Then I see "Add an offence" on the page header
    And I click on the "Cancel" link

    Then I see the status of "Employer details" is "Provided"

    Then I click on the "Employer details" link
    Then I see "Employer details" on the page header

    And I see "Employer 1 testTestTestTestTestTest" in the "Employer name" field
    And I see "12345678901234567890" in the "Employee reference" field
    And I see "employerEmailtesttesttesttesttesttesttesttesttesttesttesttesttest12@test.com" in the "Employer email address" field
    And I see "Addr1testTestTestTestTestTest1" in the "Address line 1" field
    And I see "Addr2testTestTestTestTestTest1" in the "Address line 2" field
    And I see "Addr3testTestTestTestTestTest1" in the "Address line 3" field
    And I see "Addr4testTestTestTestTestTest1" in the "Address line 4" field
    And I see "Addr5testTestTestTestTestTest1" in the "Address line 5" field
    And I see "TE12 3ST" in the "Postcode" field


  Scenario: AC8 - employer details - 'Cancel' - no data entered
    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I see the status of "Employer details" is "Not provided"

  Scenario Outline: AC8a - employer details - 'Cancel' - data entered - 'OK' clicked
    When I enter "<employerName>" into the "Employer name" field
    And I enter "<employeeReference>" into the "Employee reference" field
    And I enter "<employerEmail>" into the "Employer email address" field
    And I enter "<addressLine1>" into the "Address line 1" field
    And I enter "<addressLine2>" into the "Address line 2" field
    And I enter "<addressLine3>" into the "Address line 3" field
    And I enter "<addressLine4>" into the "Address line 4" field
    And I enter "<addressLine5>" into the "Address line 5" field
    And I enter "<postcode>" into the "Postcode" field

    And I click Cancel, a window pops up and I click Ok
    Then I see "Account details" on the page header
    And I see the status of "Employer details" is "Not provided"

    When I click on the "Employer details" link
    Then I see "Employer details" on the page header

    And I see "" in the "Employer name" field
    And I see "" in the "Employee reference" field
    And I see "" in the "Employer email address" field
    And I see "" in the "Address line 1" field
    And I see "" in the "Address line 2" field
    And I see "" in the "Address line 3" field
    And I see "" in the "Address line 4" field
    And I see "" in the "Address line 5" field
    And I see "" in the "Postcode" field


    Examples:
      | employerName | employeeReference  | employerEmail | addressLine1 | addressLine2 | addressLine3 | addressLine4 | addressLine5 | postcode |
      | Employer 1   | employeeReference1 | test@test.com | Addr1        | Addr2        | Addr3        | Addr4        | Addr5        | TE12 3ST |

  Scenario Outline: AC8b - employer details - 'Cancel' - data entered - 'Cancel' clicked
    When I enter "<employerName>" into the "Employer name" field
    And I enter "<employeeReference>" into the "Employee reference" field
    And I enter "<employerEmail>" into the "Employer email address" field
    And I enter "<addressLine1>" into the "Address line 1" field
    And I enter "<addressLine2>" into the "Address line 2" field
    And I enter "<addressLine3>" into the "Address line 3" field
    And I enter "<addressLine4>" into the "Address line 4" field
    And I enter "<addressLine5>" into the "Address line 5" field
    And I enter "<postcode>" into the "Postcode" field

    And I click Cancel, a window pops up and I click Cancel
    Then I see "Employer details" on the page header

    And I see "<employerName>" in the "Employer name" field
    And I see "<employeeReference>" in the "Employee reference" field
    And I see "<employerEmail>" in the "Employer email address" field
    And I see "<addressLine1>" in the "Address line 1" field
    And I see "<addressLine2>" in the "Address line 2" field
    And I see "<addressLine3>" in the "Address line 3" field
    And I see "<addressLine4>" in the "Address line 4" field
    And I see "<addressLine5>" in the "Address line 5" field
    And I see "<postcode>" in the "Postcode" field

    Then I click the "Return to account details" button
    And I see the status of "Employer details" is "Provided"

    When I click on the "Employer details" link
    Then I see "Employer details" on the page header

    And I see "<employerName>" in the "Employer name" field
    And I see "<employeeReference>" in the "Employee reference" field
    And I see "<employerEmail>" in the "Employer email address" field
    And I see "<addressLine1>" in the "Address line 1" field
    And I see "<addressLine2>" in the "Address line 2" field
    And I see "<addressLine3>" in the "Address line 3" field
    And I see "<addressLine4>" in the "Address line 4" field
    And I see "<addressLine5>" in the "Address line 5" field
    And I see "<postcode>" in the "Postcode" field

    Examples:
      | employerName | employeeReference  | employerEmail | addressLine1 | addressLine2 | addressLine3 | addressLine4 | addressLine5 | postcode |
      | Employer 1   | employeeReference1 | test@test.com | Addr1        | Addr2        | Addr3        | Addr4        | Addr5        | TE12 3ST |

  Scenario: AC8 - negative test - employer details - 'Cancel' - data entered - 'Cancel' clicked
    When I enter "Employer 1 testTestTestTestTestTest1" into the "Employer name" field
    And I enter "123456789012345678901" into the "Employee reference" field
    And I enter "employerEmailtesttesttesttesttesttesttesttesttesttesttesttesttest123@test.com" into the "Employer email address" field
    And I enter "Addr1testTestTestTestTestTest12" into the "Address line 1" field
    And I enter "Addr2testTestTestTestTestTest12" into the "Address line 2" field
    And I enter "Addr3testTestTestTestTestTest12" into the "Address line 3" field
    And I enter "Addr4testTestTestTestTestTest12" into the "Address line 4" field
    And I enter "Addr5testTestTestTestTestTest12" into the "Address line 5" field
    And I enter "TE12 3ST 1" into the "Postcode" field

    When I click the "Add offence details" button

    Then I see "Employer details" on the page header

    And I click Cancel, a window pops up and I click Cancel
    Then I see "Employer details" on the page header

    Then I see the error message "The employer name must be 35 characters or fewer" at the top of the page
    And I see the error message "The employee reference must be 20 characters or fewer" at the top of the page
    And I see the error message "The employer email address must be 76 characters or fewer" at the top of the page

    And I see the error message "The employer address line 1 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer address line 2 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer address line 3 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer address line 4 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer address line 5 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer postcode must be 8 characters or fewer" at the top of the page

    And I see the error message "The employer name must be 35 characters or fewer" above the "Employer name" field
    And I see the error message "The employee reference must be 20 characters or fewer" above the "Employee reference" field
    And I see the error message "The employer email address must be 76 characters or fewer" above the "Employer email address" field

    And I see the error message "The employer address line 1 must be 30 characters or fewer" above the "Address line 1" field
    And I see the error message "The employer address line 2 must be 30 characters or fewer" above the "Address line 2" field
    And I see the error message "The employer address line 3 must be 30 characters or fewer" above the "Address line 3" field
    And I see the error message "The employer address line 4 must be 30 characters or fewer" above the "Address line 4" field
    And I see the error message "The employer address line 5 must be 30 characters or fewer" above the "Address line 5" field
    And I see the error message "The employer postcode must be 8 characters or fewer" above the "Postcode" field
