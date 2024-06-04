Feature: Verifying Employer details page for defendant accounts

    Background:
        Given I am on the OPAL Frontend
        Then I see "Opal" in the header

        When I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard

        When I navigate to Manual Account Creation
        Then I see "Account details" on the page header
        And I click continue to Create Account page

        Then I see "Create account" on the page header
        Then I click on "Employer details" link

    Scenario Outline: verifying the employer details page where user enters all the details without saving

        When I enter employer name "<employerName>"
        Then I enter employee reference number or nino "<employerNino>"
        Then I enter employer email address "<employerEmail>"
        Then I enter employer telephone number "<employerTelephone>"

        Then I enter employer address line1 "<employerAddress1>"
        Then I enter employer address line2 "<employerAddress2>"
        Then I enter employer postcode "<employerPostCode>"

        When "Back" is clicked
        Then I see "Create account" on the page header
        When I click on "Employer details" link
        Then I verify employer name, employer reference, employer address is empty
        Examples:
            | employerName                      | employerNino | employerEmail | employerTelephone | employerAddress1 | employerAddress2 | employerPostCode |
            | This is an employer journey 12345 | AB123456     | test@test.com | 01234567890       | 12 test road     | Avenue           | AB12 4BM         |



    Scenario Outline: verifying the employer details page when user enters all the details then save and return to tasks
        When I enter employer name "<employerName>"
        Then I enter employee reference number or nino "<employeeNino>"
        Then I enter employer email address "<employerEmail>"
        Then I enter employer telephone number "<employerTelephone>"

        Then I enter employer address line1 "<employerAddress1>"
        Then I enter employer address line2 "<employerAddress2>"
        Then I enter employer postcode "<employerPostCode>"

        Then I click save and return to tasks
        Then I see "Create account" on the page header
        When I click on "Employer details" link
        Then I verify "<employerName>", "<employeeNino>", "<employerAddress1>" values saved
        Examples:
            | employerName                      | employeeNino | employerEmail | employerTelephone | employerAddress1 | employerAddress2 | employerPostCode |
            | This is an employer journey 12345 | AB123456     | test@test.com | 01234567890       | 12 test road     | Avenue           | AB12 4BM         |


    Scenario Outline: verifying the error messages when user enters incorrect format
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
        Then I click save and return to tasks
        Then I verify the error message

        Examples:
            | incorrectEmployerName                                         | incorrectEmpNino                 | incorrectEmail                                                                                                                           | incorrectTelephone     | incorrectAddressLine1                                 | incorrectAddressLine2                                 | incorrectAddressLine3                                 | incorrectAddressLine4                                 | incorrectAddressLine5                                 | incorrectPostCode |
            | This is an employer journey where he enters the details @1234 | AB123NM12OK9JJOLENU8KK0BUUEDDMKk | test-test-com                                                                                                                            | 1234567890123456789012 | This is a test for address line 1 in employer details | This is a test for address line 2 in employer details | This is a test for address line 3 in employer details | This is a test for address line 4 in employer details | This is a test for address line 5 in employer details | 12acsd34mn45      |
            | This is an employer journey where he enters the details @1234 | AB123NM12OK9JJOLENU8KK0BUUEDDMKk | testingwithmorethan76characterstestingwithmorethan76characterstestingwithmorethan76characterstestingwithmorethan76characters@testing.com | 1234567890123456789012 | 12* test road                                         | Avenue_test*                                          | Avenue_test*                                          | Avenue_test*                                          | Avenue_test*                                          | 12acsd34mn45      |
    Scenario: verifying the error messages when user saves employer details without entering the values
        When I click save and return to tasks
        Then I verify the error message












