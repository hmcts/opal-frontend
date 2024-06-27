Feature: Verifying Employer details page for defendant accounts

  Background:
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    #new feature implemented on Po-346 so deactivating this step
    #Then I see "Account details" on the page header

    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header

    And I enter "London South" into the business unit search box
    When I select adults and youth only
    Then I click on continue button
    Then I see "Account details" on the page header
    Then I click on "Employer details" link
    Then I see "Employer details" on the page header

  #AC7
  Scenario Outline:AC7- positive: verifying the employer details page when user enters all the details then save and return to tasks
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

    #'Save and return to tasks' button is descoped
    #Then I click save and return to tasks
    Then I click return to account details
    #The page header changed according to PO-366
    #Then I see "Create account" on the page header
    Then I see "Account details" on the page header
    When I click on "Employer details" link
    Then I see "Employer details" on the page header
    Then I verify "<employerName>","<employeeNino>","<employerEmail>","<employerTelephone>","<employerAddress1>","<employerAddress2>","<employerAddress3>","<employerAddress4>","<employerAddress5>","<employerPostCode>" values saved
    Examples:
      | employerName | employeeNino | employerEmail | employerTelephone | employerAddress1 | employerAddress2 | employerAddress3 | employerAddress4 | employerAddress5 | employerPostCode |
      | Steve Mach7  | AB123456     | test@test.com | 01234567890       | 12 test road     | Avenue           | Slough           | Burnham          | London           | AB12 4BM         |
  #AC4, #AC1b, #AC1c, #AC5

  Scenario Outline: AC1c,1b,4 & 5:verifying the error messages when user enters incorrect format
    When I enter incorrect employer name "<incorrectEmployerName>"
    When I enter incorrect employee reference number of nino "<incorrectEmpNino>"
    When I enter incorrect employer email address "<incorrectEmail>"
    When I enter incorrect employer telephone number "<incorrectTelephone>"
    When I enter incorrect employer address line 1 "<incorrectAddressLine1>"
    When I enter incorrect employer address line 2 "<incorrectAddressLine2>"
    When I enter incorrect employer address line 3 "<incorrectAddressLine3>"
    When I enter incorrect employer address line 4 "<incorrectAddressLine4>"
    When I enter incorrect employer address line 5 "<incorrectAddressLine5>"
    When I enter incorrect employer postcode "<incorrectPostCode>"

    #'Save and return to tasks' button is descoped
    #Then I click save and return to tasks
    Then I click return to account details
    Then I verify the error message
    #When I click save and return to tasks
    Then I verify the error message
    Then I see "Employer details" on the page header

    Examples:
      | incorrectEmployerName                                         | incorrectEmpNino                 | incorrectEmail                                                                                                                           | incorrectTelephone     | incorrectAddressLine1                                 | incorrectAddressLine2                                 | incorrectAddressLine3                                 | incorrectAddressLine4                                 | incorrectAddressLine5                                 | incorrectPostCode |
      | This is an employer journey where he enters the details @1234 | AB123NM12OK9JJOLENU8KK0BUUEDDMKk | test-test-com                                                                                                                            | 1234567890123456789012 | This is a test for address line 1 in employer details | This is a test for address line 2 in employer details | This is a test for address line 3 in employer details | This is a test for address line 4 in employer details | This is a test for address line 5 in employer details | 12acsd34mn45      |
      | John Maddy & co                                               | AB123NM12OK9JJOLENU8KK0BUUEDDMKk | testingwithmorethan76characterstestingwithmorethan76characterstestingwithmorethan76characterstestingwithmorethan76characters@testing.com | 1234                   | 12* test road                                         | Avenue_test*                                          | Avenue_test*                                          | Avenue_test*                                          | Avenue_test*                                          | 12acsd34mn45      |
      | This is an employer journey where he enters the details @1234 | XNJ#5567                         | test@testcom                                                                                                                             | 0123 456 789           | test road*                                            | test road*                                            | test road*                                            | test road*                                            | test road*                                            | 12acsd34mn45      |
      | This is an employer journey                                   | AB123NM12                        | testtest.com                                                                                                                             | 12evr45mni3            | test road number\34                                   | Alpha-Road Street                                     | test road # 7                                         | test road                                             | test road                                             | 12acsd            |

  #AC3
  Scenario Outline:AC3-unhappy: verifying the employer details page when user not enters all the mandatory fields where filling the details on optional fields then save and return to tasks
    Then I enter employer email address "<employerEmail>"
    Then I enter employer telephone number "<employerTelephone>"

    Then I enter employer address line2 "<employerAddress2>"
    Then I enter employer address line3 "<employerAddress3>"
    When I enter employer address line4 "<employerAddress4>"
    When I enter employer address line5 "<employerAddress5>"
    Then I enter employer postcode "<employerPostCode>"
    #'Save and return to tasks' button is descoped
    #Then I click save and return to tasks
    Then I click return to account details

    Then I verify the error message
    Then I see "Employer details" on the page header

    Examples:
      | employerEmail | employerTelephone | employerAddress2 | employerAddress3 | employerAddress4 | employerAddress5    | employerPostCode |
      | test@test.com | 01234567890       | Avenue           | WhiltleyBay      | Tyne and Wear    | Newcastle Upon Tyne | AB12 4BM         |


  #AC9
  Scenario Outline: AC9-negative: verifying if user selects the 'Back' button and the user has entered data into one or more fields, a warning message will be displayed
    When I enter employer name "<employerName>"
    When I enter employer postcode "<employerPostcode>"
    Then "Cancel" is clicked

    Then I select OK on the pop up window
    #The page header changed according to PO-366
    #Then I see "Create account" on the page header
    Then I see "Account details" on the page header
    Then I click on "Employer details" link
    Then I verify employer name, employer postcode is empty
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
    #then upon selecting the 'Save and return to tasks' button
    When I enter incorrect employer email address "<incorrectEmail>"
    When I enter incorrect employer telephone number "<incorrectTelephone>"
    When I enter incorrect employer address line 2 "<incorrectAddressLine2>"
    When I enter incorrect employer address line 3 "<incorrectAddressLine3>"
    When I enter incorrect employer address line 4 "<incorrectAddressLine4>"
    When I enter incorrect employer address line 5 "<incorrectAddressLine5>"
    #'Save and return to tasks' button is descoped
    #Then I click save and return to tasks
    Then I click return to account details
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

    #'Save and return to tasks' button is descoped
    #Then I click save and return to tasks
    Then I click return to account details
    #The page header changed according to PO-366
    #Then I see "Create account" on the page header
    Then I see "Account details" on the page header

    Then I click on "Employer details" link
    Then I see "Employer details" on the page header

    Then I verify "<employerName>","<employeeNino>","<employerEmail>","<employerTelephone>","<employerAddress1>","<employerAddress2>","<employerAddress3>","<employerAddress4>","<employerAddress5>","<employerPostCode>" values saved

    Examples:
      | incorrectEmail | incorrectTelephone | incorrectAddressLine2                                | incorrectAddressLine3 | incorrectAddressLine4 | incorrectAddressLine5 | employerEmail    | employerTelephone | employerAddress2  | employerAddress3 | employerAddress4 | employerAddress5 | employerName | employeeNino | employerAddress1 | employerPostCode |
      | test-test-com  | 1234567            | This is a test for address line  in employer details | 14 test road *        | avenue*               | test*                 | testing@test.com | 07534567856       | 12 Duechar Street | avenue           | whitleybay       | tyne and wear    | Test1        | AB123456     | 12               | SL7 1NH          |

  #AC2
  Scenario: Ac2- Unahappy: verifying the error messages when user saves employer details without entering the values
    #'Save and return to tasks' button is descoped
    #When I click save and return to tasks
    Then I click return to account details
    Then I verify the error message
    Then I see "Employer details" on the page header

  #AC8
  Scenario: AC8 - Unhappy: verifying If a user selects the 'Back' button and the user has not entered data into any fields
    When "Cancel" is clicked
    Then I see "Account details" on the page header



