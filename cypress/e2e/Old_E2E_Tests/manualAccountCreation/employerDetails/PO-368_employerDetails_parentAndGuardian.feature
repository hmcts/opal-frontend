Feature: PO-368 employer details page for Adult or youth with parent or guardian to pay

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

    Then I click on the "Employer details" link
    Then I see "Employer details" on the page header

  Scenario Outline: AC1a,AC1b- positive: user enters data in the all fields including space in telephone number
    When I enter "<employerName>" into the "Employer name" field
    Then I enter "<employeeNino>" into the "Employee reference" field
    Then I enter "<employerEmail>" into the "Employer email address" field
    Then I enter "<employerTelephone>" into the "Employer telephone" field

    Then I enter "<employerAddress1>" into the "Address line 1" field
    Then I enter "<employerAddress2>" into the "Address line 2" field
    Then I enter "<employerAddress3>" into the "Address line 3" field
    Then I enter "<employerAddress4>" into the "Address line 4" field
    Then I enter "<employerAddress5>" into the "Address line 5" field
    Then I enter "<employerPostCode>" into the "Postcode" field

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Account details" on the page header
    When I click on the "Employer details" link
    Then I see "Employer details" on the page header

    Then I see "<employerName>" in the "Employer name" field
    Then I see "<employeeNino>" in the "Employee reference" field
    Then I see "<employerEmail>" in the "Employer email address" field
    Then I see "<employerTelephone>" in the "Employer telephone" field

    Then I see "<employerAddress1>" in the "Address line 1" field
    Then I see "<employerAddress2>" in the "Address line 2" field
    Then I see "<employerAddress3>" in the "Address line 3" field
    Then I see "<employerAddress4>" in the "Address line 4" field
    Then I see "<employerAddress5>" in the "Address line 5" field
    Then I see "<employerPostCode>" in the "Postcode" field

    Examples:
      | employerName                        | employeeNino         | employerEmail                                                                | employerTelephone | employerAddress1               | employerAddress2               | employerAddress3               | employerAddress4               | employerAddress5               | employerPostCode |
      | Steve Max5 testing employer details | AB1234NUT987MNHIJLOP | CheckingEmployersDetailsforAdultOrParentOrGuardianDefendantType1234@test.com | 07528 828441      | checkingAddressEmployerDetails | checkingAddressEmployerDetails | checkingAddressEmployerDetails | checkingAddressEmployerDetails | checkingAddressEmployerDetails | AB12 4BM         |

  Scenario Outline: AC1c- positive: user enters data in to all fields where address line contains * (astric)
    When I enter "<employerName>" into the "Employer name" field
    Then I enter "<employeeNino>" into the "Employee reference" field
    Then I enter "<employerEmail>" into the "Employer email address" field
    Then I enter "<employerTelephone>" into the "Employer telephone" field

    Then I enter "<employerAddress1>" into the "Address line 1" field
    Then I enter "<employerAddress2>" into the "Address line 2" field
    Then I enter "<employerAddress3>" into the "Address line 3" field
    Then I enter "<employerAddress4>" into the "Address line 4" field
    Then I enter "<employerAddress5>" into the "Address line 5" field
    Then I enter "<employerPostCode>" into the "Postcode" field

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see the error message "The employer address line 1 must not contain special characters" at the top of the page
    Then I see the error message "The employer address line 2 must not contain special characters" at the top of the page
    Then I see the error message "The employer address line 3 must not contain special characters" at the top of the page
    Then I see the error message "The employer address line 4 must not contain special characters" at the top of the page
    Then I see the error message "The employer address line 5 must not contain special characters" at the top of the page

    Examples:
      | employerName                        | employeeNino         | employerEmail             | employerTelephone | employerAddress1 | employerAddress2  | employerAddress3  | employerAddress4   | employerAddress5   | employerPostCode |
      | Steve Max5 testing employer details | AB1234NUT987MNHIJLOP | CheeckEmpDetails@test.com | 07528 828441      | checkingAddress* | checkingAddress2* | checkingAddress3* | checkingAddress* 4 | checkingAddress5 * | AB12 4BM         |

  Scenario:AC2- negative: verifying the error messages when user saves employer details without entering the values
    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see the error message "Enter employer name" at the top of the page
    Then I see the error message "Enter employee reference or National Insurance number" at the top of the page
    Then I see the error message "Enter employer address line 1, typically the building and street" at the top of the page
    Then I see "Employer details" on the page header

  Scenario Outline:AC3- negative: verifying the employer details page when user not enters all the mandatory fields where filling the details on optional fields then save and return to tasks for parent or guardian
    Then I enter "<employerEmail>" into the "Employer email address" field
    Then I enter "<employerTelephone>" into the "Employer telephone" field

    Then I enter "<employerAddress2>" into the "Address line 2" field
    Then I enter "<employerAddress3>" into the "Address line 3" field
    Then I enter "<employerAddress4>" into the "Address line 4" field
    Then I enter "<employerAddress5>" into the "Address line 5" field
    Then I enter "<employerPostCode>" into the "Postcode" field
    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button

    Then I see the error message "Enter employer name" at the top of the page
    Then I see the error message "Enter employee reference or National Insurance number" at the top of the page
    Then I see the error message "Enter employer address line 1, typically the building and street" at the top of the page
    Then I see "Employer details" on the page header

    Examples:
      | employerEmail | employerTelephone | employerAddress2 | employerAddress3 | employerAddress4 | employerAddress5    | employerPostCode |
      | test@test.com | 01234567890       | Avenue           | WhiltleyBay      | Tyne and Wear    | Newcastle Upon Tyne | AB12 4BM         |



  Scenario Outline:AC4- negative: verifying the error messages when user enters email in incorrect format
    When I enter "<employerName>" into the "Employer name" field
    Then I enter "<employeeNino>" into the "Employee reference" field
    Then I enter "<incorrectEmail>" into the "Employer email address" field
    Then I enter "<employerTelephone>" into the "Employer telephone" field

    Then I enter "<employerAddress1>" into the "Address line 1" field
    Then I enter "<employerAddress2>" into the "Address line 2" field
    Then I enter "<employerAddress3>" into the "Address line 3" field
    Then I enter "<employerAddress4>" into the "Address line 4" field
    Then I enter "<employerAddress5>" into the "Address line 5" field
    Then I enter "<employerPostCode>" into the "Postcode" field

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see the error message "Enter employer email address in the correct format like, name@example.com" at the top of the page

    Then I see "Employer details" on the page header

    Examples:
      | employerName | employeeNino | incorrectEmail   | employerTelephone | employerAddress1 | employerAddress2 | employerAddress3 | employerAddress4 | employerAddress5 | employerPostCode |
      | Steve Mach7  | AB123456     | testing.com@test | 01234567890       | 12 test road     | Avenue           | Slough           | Burnham          | London           | AB12 4BM         |

  Scenario Outline:AC5- negative: verifying the error messages when user enters telephone in incorrect format
    When I enter "<employerName>" into the "Employer name" field
    Then I enter "<employeeNino>" into the "Employee reference" field
    Then I enter "<employerEmail>" into the "Employer email address" field
    Then I enter "<incorrectTelephone>" into the "Employer telephone" field

    Then I enter "<employerAddress1>" into the "Address line 1" field
    Then I enter "<employerAddress2>" into the "Address line 2" field
    Then I enter "<employerAddress3>" into the "Address line 3" field
    Then I enter "<employerAddress4>" into the "Address line 4" field
    Then I enter "<employerAddress5>" into the "Address line 5" field
    Then I enter "<employerPostCode>" into the "Postcode" field

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see the error message "Enter employer telephone number in the correct format" at the top of the page

    Examples:
      | employerName | employeeNino | employerEmail | incorrectTelephone          | employerAddress1 | employerAddress2 | employerAddress3 | employerAddress4 | employerAddress5 | employerPostCode |
      | Steve Mach7  | AB123456     | test@test.com | 012345678901234568907654767 | 12 test road     | Avenue           | Slough           | Burnham          | London           | AB12 4BM         |
      | Steve Mach7  | AB123456     | test@test.com | 01234                       | 12 test road     | Avenue           | Slough           | Burnham          | London           | AB12 4BM         |
      | Steve Mach7  | AB123456     | test@test.com | 01234AB34Hnm8*              | 12 test road     | Avenue           | Slough           | Burnham          | London           | AB12 4BM         |

  Scenario Outline: AC6-positive: Verifying If a user amends all fields where validation failures occurred and all validation is adhered to,
    #then upon selecting the 'Save and return to tasks' button
    Then I enter "<incorrectEmail>" into the "Employer email address" field
    Then I enter "<incorrectTelephone>" into the "Employer telephone" field

    Then I enter "<incorrectAddressLine2>" into the "Address line 2" field
    Then I enter "<incorrectAddressLine3>" into the "Address line 3" field
    Then I enter "<incorrectAddressLine4>" into the "Address line 4" field
    Then I enter "<incorrectAddressLine5>" into the "Address line 5" field
    Then I enter "<incorrectPostcode>" into the "Postcode" field
    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button

    Then I see the error message "Enter employer name" at the top of the page
    And I see the error message "Enter employee reference or National Insurance number" at the top of the page
    And I see the error message "Enter employer email address in the correct format like, name@example.com" at the top of the page
    And I see the error message "Enter employer telephone number in the correct format" at the top of the page
    And I see the error message "Enter employer address line 1, typically the building and street" at the top of the page
    And I see the error message "The employer address line 2 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer address line 3 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 4 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 5 must not contain special characters" at the top of the page
    And I see the error message "The employer postcode must be 8 characters or fewer" at the top of the page

    When I enter "<employerName>" into the "Employer name" field
    Then I enter "<employeeNino>" into the "Employee reference" field
    Then I enter "<employerEmail>" into the "Employer email address" field
    Then I enter "<employerTelephone>" into the "Employer telephone" field

    Then I enter "<employerAddress1>" into the "Address line 1" field
    Then I enter "<employerAddress2>" into the "Address line 2" field
    Then I enter "<employerAddress3>" into the "Address line 3" field
    Then I enter "<employerAddress4>" into the "Address line 4" field
    Then I enter "<employerAddress5>" into the "Address line 5" field
    Then I enter "<employerPostCode>" into the "Postcode" field

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Account details" on the page header

    Then I click on the "Employer details" link
    Then I see "Employer details" on the page header

    Then I see "<employerName>" in the "Employer name" field
    Then I see "<employeeNino>" in the "Employee reference" field
    Then I see "<employerEmail>" in the "Employer email address" field
    Then I see "<employerTelephone>" in the "Employer telephone" field

    Then I see "<employerAddress1>" in the "Address line 1" field
    Then I see "<employerAddress2>" in the "Address line 2" field
    Then I see "<employerAddress3>" in the "Address line 3" field
    Then I see "<employerAddress4>" in the "Address line 4" field
    Then I see "<employerAddress5>" in the "Address line 5" field
    Then I see "<employerPostCode>" in the "Postcode" field

    Examples:
      | incorrectEmail | incorrectTelephone | incorrectAddressLine2                                | incorrectAddressLine3 | incorrectAddressLine4 | incorrectAddressLine5 | employerEmail    | employerTelephone | employerAddress2  | employerAddress3 | employerAddress4 | employerAddress5 | employerName | employeeNino | employerAddress1 | employerPostCode |
      | test-test-com  | 1234567            | This is a test for address line  in employer details | 14 test road *        | avenue*               | test*                 | testing@test.com | 07534567856       | 12 Duechar Street | avenue           | whitleybay       | tyne and wear    | Test1        | AB123456     | 12               | SL7 1NH          |


  Scenario Outline: AC7- positive: user enters data in the all fields including space in telephone number
    When I enter "<employerName>" into the "Employer name" field
    Then I enter "<employeeNino>" into the "Employee reference" field
    Then I enter "<employerEmail>" into the "Employer email address" field
    Then I enter "<employerTelephone>" into the "Employer telephone" field

    Then I enter "<employerAddress1>" into the "Address line 1" field
    Then I enter "<employerAddress2>" into the "Address line 2" field
    Then I enter "<employerAddress3>" into the "Address line 3" field
    Then I enter "<employerAddress4>" into the "Address line 4" field
    Then I enter "<employerAddress5>" into the "Address line 5" field
    Then I enter "<employerPostCode>" into the "Postcode" field

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Account details" on the page header
    When I click on the "Employer details" link
    Then I see "Employer details" on the page header

    Then I see "<employerName>" in the "Employer name" field
    Then I see "<employeeNino>" in the "Employee reference" field
    Then I see "<employerEmail>" in the "Employer email address" field
    Then I see "<employerTelephone>" in the "Employer telephone" field

    Then I see "<employerAddress1>" in the "Address line 1" field
    Then I see "<employerAddress2>" in the "Address line 2" field
    Then I see "<employerAddress3>" in the "Address line 3" field
    Then I see "<employerAddress4>" in the "Address line 4" field
    Then I see "<employerAddress5>" in the "Address line 5" field
    Then I see "<employerPostCode>" in the "Postcode" field

    Examples:
      | employerName                        | employeeNino         | employerEmail                                                                | employerTelephone | employerAddress1               | employerAddress2               | employerAddress3               | employerAddress4               | employerAddress5               | employerPostCode |
      | Steve Max5 testing employer details | AB1234NUT987MNHIJLOP | CheckingEmployersDetailsforAdultOrParentOrGuardianDefendantType1234@test.com | 07528 828441      | checkingAddressEmployerDetails | checkingAddressEmployerDetails | checkingAddressEmployerDetails | checkingAddressEmployerDetails | checkingAddressEmployerDetails | AB12 4BM         |

  Scenario:AC8-negative: verifying If a user selects the 'Back' button and the user has not entered data into any fields
    When "Cancel" is clicked
    Then I see "Account details" on the page header

  Scenario Outline: AC9a-negative: verifying if user selects the 'Back' button and the user has entered data into one or more fields, a warning message will be displayed
    When I enter "<employerName>" into the "Employer name" field
    When I enter "<employerPostcode>" into the "Postcode" field
    Then "Cancel" is clicked

    Then I select OK on the pop up window
    Then I see "Account details" on the page header
    Then I click on the "Employer details" link

    Then I see "" in the "Employer name" field
    And I see "" in the "Postcode" field
    Examples:
      | employerName    | employerPostcode |
      | testWindowPopUP | AB12 7HN         |
