Feature: PO-368 employer details page for Adult or youth with parent or guardian to pay

  Background:
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "London South" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

    Then I click on the "Employer details" link
    Then I see "Employer details" on the page header

  Scenario Outline: AC1a,AC1b- positive: user enters data in the all fields including space in telephone number
    When I enter employer name "<employerName>"
    Then I enter employee reference number or nino "<employeeNino>"
    Then I enter employer email address "<employerEmail>"
    Then I enter employer telephone number "<employerTelephone>"

    Then I enter employer address line1 "<employerAddress1>"
    Then I enter employer address line2 "<employerAddress2>"
    Then I enter employer address line3 "<employerAddress3>"
    Then I enter employer address line4 "<employerAddress4>"
    Then I enter employer address line5 "<employerAddress5>"
    Then I enter employer postcode "<employerPostCode>"

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Account details" on the page header
    When I click on the "Employer details" link
    Then I see "Employer details" on the page header
    Then I verify "<employerName>","<employeeNino>","<employerEmail>","<employerTelephone>","<employerAddress1>","<employerAddress2>","<employerAddress3>","<employerAddress4>","<employerAddress5>","<employerPostCode>" values saved


    Examples:
      | employerName                        | employeeNino         | employerEmail                                                                | employerTelephone | employerAddress1               | employerAddress2               | employerAddress3               | employerAddress4               | employerAddress5               | employerPostCode |
      | Steve Max5 testing employer details | AB1234NUT987MNHIJLOP | CheckingEmployersDetailsforAdultOrParentOrGuardianDefendantType1234@test.com | 07528 828441      | checkingAddressEmployerDetails | checkingAddressEmployerDetails | checkingAddressEmployerDetails | checkingAddressEmployerDetails | checkingAddressEmployerDetails | AB12 4BM         |

  Scenario Outline: AC1c- positive: user enters data in to all fields where address line contains * (astric)
    When I enter employer name "<employerName>"
    Then I enter employee reference number or nino "<employeeNino>"
    Then I enter employer email address "<employerEmail>"
    Then I enter employer telephone number "<employerTelephone>"

    Then I enter employer address line1 "<employerAddress1>"
    Then I enter employer address line2 "<employerAddress2>"
    Then I enter employer address line3 "<employerAddress3>"
    Then I enter employer address line4 "<employerAddress4>"
    Then I enter employer address line5 "<employerAddress5>"
    Then I enter employer postcode "<employerPostCode>"

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I verify the error message

    Examples:
      | employerName                        | employeeNino         | employerEmail             | employerTelephone | employerAddress1 | employerAddress2  | employerAddress3  | employerAddress4   | employerAddress5   | employerPostCode |
      | Steve Max5 testing employer details | AB1234NUT987MNHIJLOP | CheeckEmpDetails@test.com | 07528 828441      | checkingAddress* | checkingAddress2* | checkingAddress3* | checkingAddress* 4 | checkingAddress5 * | AB12 4BM         |

  Scenario:AC2- negative: verifying the error messages when user saves employer details without entering the values
    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I verify the error message
    Then I see "Employer details" on the page header

  Scenario Outline:AC3- negative: verifying the employer details page when user not enters all the mandatory fields where filling the details on optional fields then save and return to tasks for parent or guardian
    Then I enter employer email address "<employerEmail>"
    Then I enter employer telephone number "<employerTelephone>"

    Then I enter employer address line2 "<employerAddress2>"
    Then I enter employer address line3 "<employerAddress3>"
    When I enter employer address line4 "<employerAddress4>"
    When I enter employer address line5 "<employerAddress5>"
    Then I enter employer postcode "<employerPostCode>"
    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button

    Then I verify the error message
    Then I see "Employer details" on the page header

    Examples:
      | employerEmail | employerTelephone | employerAddress2 | employerAddress3 | employerAddress4 | employerAddress5    | employerPostCode |
      | test@test.com | 01234567890       | Avenue           | WhiltleyBay      | Tyne and Wear    | Newcastle Upon Tyne | AB12 4BM         |



  Scenario Outline:AC4- negative: verifying the error messages when user enters email in incorrect format
    When I enter incorrect employer name "<employername>"
    When I enter incorrect employee reference number of nino "<employeeNino>"
    Then I enter employer email address "<incorrectEmail>"
    Then I enter employer telephone number "<employerTelephone>"

    Then I enter employer address line1 "<employerAddress1>"
    Then I enter employer address line2 "<employerAddress2>"
    Then I enter employer address line3 "<employerAddress3>"
    Then I enter employer address line4 "<employerAddress4>"
    Then I enter employer address line5 "<employerAddress5>"
    Then I enter employer postcode "<employerPostCode>"

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I verify the error message
    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I verify the error message
    Then I see "Employer details" on the page header

    Examples:
      | employerName | employeeNino | incorrectEmail   | employerTelephone | employerAddress1 | employerAddress2 | employerAddress3 | employerAddress4 | employerAddress5 | employerPostCode |
      | Steve Mach7  | AB123456     | testing.com@test | 01234567890       | 12 test road     | Avenue           | Slough           | Burnham          | London           | AB12 4BM         |

  Scenario Outline:AC5- negative: verifying the error messages when user enters telephone in incorrect format
    When I enter incorrect employer name "<employerName>"
    When I enter incorrect employee reference number of nino "<employeeNino>"
    Then I enter employer email address "<employerEmail>"
    Then I enter employer telephone number "<incorrectTelephone>"

    Then I enter employer address line1 "<employerAddress1>"
    Then I enter employer address line2 "<employerAddress2>"
    Then I enter employer address line3 "<employerAddress3>"
    Then I enter employer address line4 "<employerAddress4>"
    Then I enter employer address line5 "<employerAddress5>"
    Then I enter employer postcode "<employerPostCode>"

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I verify the error message
    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I verify the error message
    Then I see "Employer details" on the page header

    Examples:
      | employerName | employeeNino | employerEmail | incorrectTelephone          | employerAddress1 | employerAddress2 | employerAddress3 | employerAddress4 | employerAddress5 | employerPostCode |
      | Steve Mach7  | AB123456     | test@test.com | 012345678901234568907654767 | 12 test road     | Avenue           | Slough           | Burnham          | London           | AB12 4BM         |
      | Steve Mach7  | AB123456     | test@test.com | 01234                       | 12 test road     | Avenue           | Slough           | Burnham          | London           | AB12 4BM         |
      | Steve Mach7  | AB123456     | test@test.com | 01234AB34Hnm8*              | 12 test road     | Avenue           | Slough           | Burnham          | London           | AB12 4BM         |

  Scenario Outline: AC6-positive: Verifying If a user amends all fields where validation failures occurred and all validation is adhered to,
    #then upon selecting the 'Save and return to tasks' button
    Then I enter employer email address "<incorrectEmail>"
    When I enter incorrect employer telephone number "<incorrectTelephone>"

    When I enter incorrect employer address line 2 "<incorrectAddressLine2>"
    When I enter incorrect employer address line 3 "<incorrectAddressLine3>"
    When I enter incorrect employer address line 4 "<incorrectAddressLine4>"
    When I enter incorrect employer address line 5 "<incorrectAddressLine5>"
    When I enter incorrect employer postcode "<incorrectPostCode>"
    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I verify the error message

    Then I update employer name "<employerName>"
    Then I update employee reference number or nino "<employeeNino>"
    Then I update employer email address "<employerEmail>"
    Then I update employer telephone number "<employerTelephone>"
    Then I update employer address line1 "<employerAddress1>"
    Then I update employer address line2 "<employerAddress2>"
    Then I update employer address line3 "<employerAddress3>"
    Then I update employer address line4 "<employerAddress4>"
    Then I update employer address line5 "<employerAddress5>"
    Then I update employer postcode "<employerPostCode>"

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Account details" on the page header

    Then I click on the "Employer details" link
    Then I see "Employer details" on the page header

    Then I verify "<employerName>","<employeeNino>","<employerEmail>","<employerTelephone>","<employerAddress1>","<employerAddress2>","<employerAddress3>","<employerAddress4>","<employerAddress5>","<employerPostCode>" values saved

    Examples:
      | incorrectEmail | incorrectTelephone | incorrectAddressLine2                                | incorrectAddressLine3 | incorrectAddressLine4 | incorrectAddressLine5 | employerEmail    | employerTelephone | employerAddress2  | employerAddress3 | employerAddress4 | employerAddress5 | employerName | employeeNino | employerAddress1 | employerPostCode |
      | test-test-com  | 1234567            | This is a test for address line  in employer details | 14 test road *        | avenue*               | test*                 | testing@test.com | 07534567856       | 12 Duechar Street | avenue           | whitleybay       | tyne and wear    | Test1        | AB123456     | 12               | SL7 1NH          |


  Scenario Outline: AC7- positive: user enters data in the all fields including space in telephone number
    When I enter employer name "<employerName>"
    Then I enter employee reference number or nino "<employeeNino>"
    Then I enter employer email address "<employerEmail>"
    Then I enter employer telephone number "<employerTelephone>"

    Then I enter employer address line1 "<employerAddress1>"
    Then I enter employer address line2 "<employerAddress2>"
    Then I enter employer address line3 "<employerAddress3>"
    Then I enter employer address line4 "<employerAddress4>"
    Then I enter employer address line5 "<employerAddress5>"
    Then I enter employer postcode "<employerPostCode>"

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Account details" on the page header
    When I click on the "Employer details" link
    Then I see "Employer details" on the page header
    Then I verify "<employerName>","<employeeNino>","<employerEmail>","<employerTelephone>","<employerAddress1>","<employerAddress2>","<employerAddress3>","<employerAddress4>","<employerAddress5>","<employerPostCode>" values saved


    Examples:
      | employerName                        | employeeNino         | employerEmail                                                                | employerTelephone | employerAddress1               | employerAddress2               | employerAddress3               | employerAddress4               | employerAddress5               | employerPostCode |
      | Steve Max5 testing employer details | AB1234NUT987MNHIJLOP | CheckingEmployersDetailsforAdultOrParentOrGuardianDefendantType1234@test.com | 07528 828441      | checkingAddressEmployerDetails | checkingAddressEmployerDetails | checkingAddressEmployerDetails | checkingAddressEmployerDetails | checkingAddressEmployerDetails | AB12 4BM         |

  Scenario:AC8-negative: verifying If a user selects the 'Back' button and the user has not entered data into any fields
    When "Cancel" is clicked
    Then I see "Account details" on the page header

  Scenario Outline: AC9a-negative: verifying if user selects the 'Back' button and the user has entered data into one or more fields, a warning message will be displayed
    When I enter employer name "<employerName>"
    When I enter employer postcode "<employerPostcode>"
    Then "Cancel" is clicked

    Then I select OK on the pop up window
    Then I see "Account details" on the page header
    Then I click on the "Employer details" link
    Then I verify employer name, employer postcode is empty
    Examples:
      | employerName    | employerPostcode |
      | testWindowPopUP | AB12 7HN         |
