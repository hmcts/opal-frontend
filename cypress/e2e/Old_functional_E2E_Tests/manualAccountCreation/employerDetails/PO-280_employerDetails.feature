Feature: PO-280 Employer details page for defendant accounts for Adult or Youth Only configuration

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    #new feature implemented on Po-346 so deactivating this step
    #Then I see "Account details" on the page header

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header

    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button
    Then I see "Account details" on the page header
    Then I click on the "Employer details" link
    Then I see "Employer details" on the page header

  #AC7
  Scenario Outline:AC7- positive: verifying the employer details page when user enters all the details then save and return to tasks

    When I enter "<employerName>" into the "Employer name" field
    And I enter "<employeeNino>" into the "Employee reference" field
    And I enter "<employerEmail>" into the "Employer email address" field
    And I enter "<employerTelephone>" into the "Employer telephone" field
    And I enter "<employerAddress1>" into the "Address line 1" field
    And I enter "<employerAddress2>" into the "Address line 2" field
    And I enter "<employerAddress3>" into the "Address line 3" field
    And I enter "<employerAddress4>" into the "Address line 4" field
    And I enter "<employerAddress5>" into the "Address line 5" field
    And I enter "<employerPostCode>" into the "Postcode" field

    #Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    #The page header changed according to PO-366
    #Then I see "Create account" on the page header
    Then I see "Account details" on the page header
    When I click on the "Employer details" link
    Then I see "Employer details" on the page header

    And I see "<employerName>" in the "Employer name" field
    And I see "<employeeNino>" in the "Employee reference" field
    And I see "<employerEmail>" in the "Employer email address" field
    And I see "<employerTelephone>" in the "Employer telephone" field
    And I see "<employerAddress1>" in the "Address line 1" field
    And I see "<employerAddress2>" in the "Address line 2" field
    And I see "<employerAddress3>" in the "Address line 3" field
    And I see "<employerAddress4>" in the "Address line 4" field
    And I see "<employerAddress5>" in the "Address line 5" field
    And I see "<employerPostCode>" in the "Postcode" field

    Examples:
      | employerName | employeeNino | employerEmail | employerTelephone | employerAddress1 | employerAddress2 | employerAddress3 | employerAddress4 | employerAddress5 | employerPostCode |
      | Steve Mach7  | AB123456     | test@test.com | 01234567890       | 12 test road     | Avenue           | Slough           | Burnham          | London           | AB12 4BM         |
  #AC5

  Scenario Outline: AC5:verifying the error messages when user enters incorrect format and character limit

    When I enter "<incorrectEmployerName>" into the "Employer name" field
    And I enter "<incorrectEmpNino>" into the "Employee reference" field
    And I enter "<incorrectEmail>" into the "Employer email address" field
    And I enter "<incorrectTelephone>" into the "Employer telephone" field
    And I enter "<incorrectAddressLine1>" into the "Address line 1" field
    And I enter "<incorrectAddressLine2>" into the "Address line 2" field
    And I enter "<incorrectAddressLine3>" into the "Address line 3" field
    And I enter "<incorrectAddressLine4>" into the "Address line 4" field
    And I enter "<incorrectAddressLine5>" into the "Address line 5" field
    And I enter "<incorrectPostCode>" into the "Postcode" field

    #Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see the error message "The employer name must be 35 characters or fewer" at the top of the page
    Then I see the error message "The employee reference must be 20 characters or fewer" at the top of the page
    Then I see the error message "The employer address line 1 must be 30 characters or fewer" at the top of the page
    Then I see the error message "The employer email address must be 76 characters or fewer" at the top of the page
    And I see the error message "Enter employer telephone number in the correct format" at the top of the page
    And I see the error message "The employer address line 2 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer address line 3 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer address line 4 must be 30 characters or fewer" at the top of the page
    And I see the error message "The employer address line 5 must be 30 characters or fewer" at the top of the page
    # Due to changes in PO-360
    #Then I click save and return to tasks
    #Then I click the "Return to account details" button

    Then I see "Employer details" on the page header

    Examples:
      | incorrectEmployerName                                         | incorrectEmpNino                 | incorrectEmail                                                                                                                           | incorrectTelephone     | incorrectAddressLine1                                 | incorrectAddressLine2                                 | incorrectAddressLine3                                 | incorrectAddressLine4                                 | incorrectAddressLine5                                 | incorrectPostCode |
      | This is an employer journey where he enters the details @1234 | AB123NM12OK9JJOLENU8KK0BUUEDDMKk | testingwithmorethan76characterstestingwithmorethan76characterstestingwithmorethan76characterstestingwithmorethan76characters@testing.com | 1234567890123456789012 | This is a test for address line 1 in employer details | This is a test for address line 2 in employer details | This is a test for address line 3 in employer details | This is a test for address line 4 in employer details | This is a test for address line 5 in employer details | 12acsd34mn45      |

  Scenario Outline: AC1c, AC4 & AC5:verifying the error messages when user enters incorrect format, special characters

    When I enter "<incorrectEmployerName>" into the "Employer name" field
    And I enter "<incorrectEmpNino>" into the "Employee reference" field
    And I enter "<incorrectEmail>" into the "Employer email address" field
    And I enter "<incorrectTelephone>" into the "Employer telephone" field
    And I enter "<incorrectAddressLine1>" into the "Address line 1" field
    And I enter "<incorrectAddressLine2>" into the "Address line 2" field
    And I enter "<incorrectAddressLine3>" into the "Address line 3" field
    And I enter "<incorrectAddressLine4>" into the "Address line 4" field
    And I enter "<incorrectAddressLine5>" into the "Address line 5" field
    And I enter "<incorrectPostCode>" into the "Postcode" field
    And I click the "Return to account details" button


    Then I see the error message "Enter employer email address in the correct format like, name@example.com" at the top of the page
    And I see the error message "Enter employer telephone number in the correct format" at the top of the page
    And I see the error message "The employer address line 1 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 2 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 3 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 4 must not contain special characters" at the top of the page
    And I see the error message "The employer address line 5 must not contain special characters" at the top of the page

    And I see the error message "Enter employer email address in the correct format like, name@example.com" above the "Employer email address" field
    And I see the error message "Enter employer telephone number in the correct format" above the "Employer telephone" field
    And I see the error message "The employer address line 1 must not contain special characters" above the "Address line 1" field
    And I see the error message "The employer address line 2 must not contain special characters" above the "Address line 2" field
    And I see the error message "The employer address line 3 must not contain special characters" above the "Address line 3" field
    And I see the error message "The employer address line 4 must not contain special characters" above the "Address line 4" field
    And I see the error message "The employer address line 5 must not contain special characters" above the "Address line 5" field

    #Note: Ongoing discussions about Employer name, Employee reference and Postcode

    Examples:
      | incorrectEmployerName             | incorrectEmpNino | incorrectEmail | incorrectTelephone | incorrectAddressLine1 | incorrectAddressLine2 | incorrectAddressLine3 | incorrectAddressLine4 | incorrectAddressLine5 | incorrectPostCode |
      | John Maddy & co., Limited company | XNJ#5567         | test-test-com  | 0123 456 789#      | 12* test road         | Avenue_test*          | Avenue_test*          | Avenue_test*          | Avenue_test*          | AB124BM#          |

  #AC3, AC1b
  Scenario Outline:AC3, 1b-unhappy: verifying the employer details page when user not enters all the mandatory fields where filling the details on optional fields then save and return to tasks

    And I enter "<employerEmail>" into the "Employer email address" field
    And I enter "<employerTelephone>" into the "Employer telephone" field
    And I enter "<employerAddress2>" into the "Address line 2" field
    And I enter "<employerAddress3>" into the "Address line 3" field
    And I enter "<employerAddress4>" into the "Address line 4" field
    And I enter "<employerAddress5>" into the "Address line 5" field
    And I enter "<employerPostCode>" into the "Postcode" field

    #Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button

    Then I see the error message "Enter employer name" at the top of the page
    And I see the error message "Enter employee reference or National Insurance number" at the top of the page
    And I see the error message "Enter employer address line 1, typically the building and street" at the top of the page
    And I see the error message "Enter employer name" above the "Employer name" field
    And I see the error message "Enter employee reference or National Insurance number" above the "Employee reference" field
    And I see the error message "Enter employer address line 1, typically the building and street" above the "Address line 1" field

    And I see "Employer details" on the page header

    Examples:
      | employerEmail | employerTelephone | employerAddress2 | employerAddress3 | employerAddress4 | employerAddress5    | employerPostCode |
      | test@test.com | 0123 456 7890     | Avenue           | WhiltleyBay      | Tyne and Wear    | Newcastle Upon Tyne | AB12 4BM         |


  #AC9
  Scenario Outline: AC9-negative: verifying if user selects the 'Back' button and the user has entered data into one or more fields, a warning message will be displayed

    When I enter "<employerName>" into the "Employer name" field
    And I enter "<employerPostCode>" into the "Postcode" field
    And I click on the "Cancel" link

    And I select OK on the pop up window
    #The page header changed according to PO-366
    #Then I see "Create account" on the page header
    Then I see "Account details" on the page header
    Then I click on the "Employer details" link
    Then I see "" in the "Employer name" field
    Then I see "" in the "Postcode" field
    Examples:
      | employerName    | employerPostcode |
      | testWindowPopUP | AB12 7HN         |

  # Scenario Outline: AC9b- negative: verifying if user selects the 'Back' button and the user has entered data into one or more fields, a warning message will be displayed
  #     When I enter employer name "<employerName>"
  #     When I enter incorrect employer address line 2 "<incorrectAddressLine2>"
  #     Then "Back" is clicked

  #     Then I select cancel on the pop up window
  #     Then I see "Employer details" on the page header
  #     Examples:
  #         | employerName    | incorrectAddressLine2 |
  #         | testWindowPopUP | Test Road *           |

  #AC6
  Scenario Outline:AC6-Unhappy: Verifying  If a user amends all fields where validation failures occurred and all validation is adhered to,

    And I enter "<employerName>" into the "Employer name" field
    And I enter "<employeeNino>" into the "Employee reference" field
    And I enter "<employerAddress1>" into the "Address line 1" field
    When I enter "<incorrectEmail>" into the "Employer email address" field
    And I enter "<incorrectTelephone>" into the "Employer telephone" field
    And I enter "<incorrectAddressLine2>" into the "Address line 2" field
    And I enter "<incorrectAddressLine3>" into the "Address line 3" field
    And I enter "<incorrectAddressLine4>" into the "Address line 4" field
    And I enter "<incorrectAddressLine5>" into the "Address line 5" field

    #Then upon selecting the 'Save and return to tasks' button
    #Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see the error message "Enter employer email address in the correct format like, name@example.com" at the top of the page
    Then I see the error message "Enter employer telephone number in the correct format" at the top of the page
    Then I see the error message "The employer address line 2 must be 30 characters or fewer" at the top of the page
    Then I see the error message "The employer address line 3 must not contain special characters" at the top of the page
    Then I see the error message "The employer address line 4 must not contain special characters" at the top of the page
    Then I see the error message "The employer address line 5 must not contain special characters" at the top of the page

    And I enter "<employerEmail>" into the "Employer email address" field
    And I enter "<employerTelephone>" into the "Employer telephone" field

    And I enter "<employerAddress2>" into the "Address line 2" field
    And I enter "<employerAddress3>" into the "Address line 3" field
    And I enter "<employerAddress4>" into the "Address line 4" field
    And I enter "<employerAddress5>" into the "Address line 5" field
    And I enter "<employerPostCode>" into the "Postcode" field

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    #The page header changed according to PO-366
    #Then I see "Create account" on the page header
    Then I see "Account details" on the page header

    Then I click on the "Employer details" link
    Then I see "Employer details" on the page header
    And I see "<employerName>" in the "Employer name" field
    And I see "<employeeNino>" in the "Employee reference" field
    And I see "<employerEmail>" in the "Employer email address" field
    And I see "<employerTelephone>" in the "Employer telephone" field
    And I see "<employerAddress1>" in the "Address line 1" field
    And I see "<employerAddress2>" in the "Address line 2" field
    And I see "<employerAddress3>" in the "Address line 3" field
    And I see "<employerAddress4>" in the "Address line 4" field
    And I see "<employerAddress5>" in the "Address line 5" field
    And I see "<employerPostCode>" in the "Postcode" field

    Examples:
      | incorrectEmail | incorrectTelephone | incorrectAddressLine2                                | incorrectAddressLine3 | incorrectAddressLine4 | incorrectAddressLine5 | employerEmail    | employerTelephone | employerAddress2  | employerAddress3 | employerAddress4 | employerAddress5 | employerName | employeeNino | employerAddress1 | employerPostCode |
      | test-test-com  | 1234567            | This is a test for address line  in employer details | 14 test road *        | avenue*               | test*                 | testing@test.com | 07534567856       | 12 Duechar Street | avenue           | whitleybay       | tyne and wear    | Test1        | AB123456     | 12               | SL7 1NH          |

  #AC2
  Scenario: Ac2- Unahappy: verifying the error messages when user saves employer details without entering the values

    #Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see the error message "Enter employer name" at the top of the page
    Then I see the error message "Enter employee reference or National Insurance number" at the top of the page
    Then I see the error message "Enter employer address line 1, typically the building and street" at the top of the page
    Then I see "Employer details" on the page header

  #AC8
  Scenario: AC8 - Unhappy: verifying If a user selects the 'Back' button and the user has not entered data into any fields

    When I click on the "Cancel" link
    Then I see "Account details" on the page header

