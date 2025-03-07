Feature: PO-436 Additional elements of the Parent or Guardian details screen

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation
    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    And I see "Business unit and defendant type" on the page header

    When I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I click on the "Parent or guardian details" link
    Then I see "Parent or guardian details" on the page header

  Scenario: AC1a & AC2 - New address field and mandatory field validation

    When I enter "<pgNiNumber>" into the "National Insurance number" field
    And I enter "<pgAddress2>" into the "Address line 2" field
    And I enter "<pgAddress3>" into the "Address line 3" field
    And I click the "Return to account details" button
    # as per design changes updated this test on PO-569 - descoped this test
    # Then I see the error message "You must enter a full name" at the top of the page
    Then I see the error message "Enter parent or guardian's first name(s)" at the top of the page
    And I see the error message "Enter parent or guardian's last name" at the top of the page
    And I see the error message "Enter address line 1, typically the building and street" at the top of the page
    # And I see the error message "You must enter a full name" above the "Full name" field
    And I see the error message "Enter address line 1, typically the building and street" above the "Address line 1" field

    When I click on the "Cancel" link
    And I select OK on the pop up window
    And I click on the "Parent or guardian details" link
    And I enter "<pgNiNumber>" into the "National Insurance number" field
    And I enter "<pgAddress2>" into the "Address line 2" field
    And I enter "<pgAddress3>" into the "Address line 3" field
    And I click the "Add contact details" button
    # Then I see the error message "You must enter a full name" at the top of the page
    Then I see the error message "Enter parent or guardian's first name(s)" at the top of the page
    And I see the error message "Enter parent or guardian's last name" at the top of the page
    And I see the error message "Enter address line 1, typically the building and street" at the top of the page
    # And I see the error message "You must enter a full name" above the "Full name" field
    And I see the error message "Enter address line 1, typically the building and street" above the "Address line 1" field

    Examples:
      | pgFullName  | pgdob      | pgNiNumber | pgAddress1      | pgAddress2 | pgAddress3 | pgPostCode |
      | Darren Malt | 01/04/1980 | AB123456C  | 18 tester house | Avenue     | Langham    | AB12 4LH   |

  #Scenario: AC3 - Date picker cannot select future dates

  #Tested manually for now

  Scenario: AC4 - National insurance number validation
    # as per design changes updated this test on PO-569 - descoped this test
    # When I enter "<pgFullName>" into the "Full name" field
    When I enter "this is first names" into the "First names" field
    And I enter "checking Last name characters in p/g screen" into the "Last name" field
    And I enter "<pgAddress1>" into the "Address line 1" field
    And I enter "<incorrectNiNumberOne>" into the "National Insurance number" field
    And I click the "Return to account details" button
    Then I see the error message "Enter a National Insurance number in the format AANNNNNNA" at the top of the page
    And I see the error message "Enter a National Insurance number in the format AANNNNNNA" above the "National Insurance number" field

    When I click on the "Cancel" link
    And I select OK on the pop up window
    And I click on the "Parent or guardian details" link
    # When I enter "<pgFullName>" into the "Full name" field
    When I enter "this is first names" into the "First names" field
    And I enter "checking Last name characters in p/g screen" into the "Last name" field
    And I enter "<pgAddress1>" into the "Address line 1" field
    And I enter "<incorrectNiNumberTwo>" into the "National Insurance number" field
    And I click the "Add contact details" button
    Then I see the error message "Enter a National Insurance number in the format AANNNNNNA" at the top of the page
    And I see the error message "Enter a National Insurance number in the format AANNNNNNA" above the "National Insurance number" field

    Examples:
      | pgAddress1      | incorrectNiNumberOne | incorrectNiNumberTwo |
      | 18 tester house | AB123456             | AB1234567            |

  Scenario: AC5a - Happy path validation successful, return to account details, information retained

    # When I enter "<pgFullName>" into the "Full name" field
    When I enter "<pgfirstName>" into the "First names" field
    And I enter "<pgLastName>" into the "Last name" field
    And I enter "<pgdob>" into the Date of birth field
    And I enter "<pgNiNumber>" into the "National Insurance number" field
    And I enter "<pgAddress1>" into the "Address line 1" field
    And I enter "<pgAddress2>" into the "Address line 2" field
    And I enter "<pgAddress3>" into the "Address line 3" field
    And I enter "<pgPostCode>" into the "Postcode" field
    And I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Parent or guardian details" is "Provided"

    When I click on the "Parent or guardian details" link
    # Then I see "<pgFullName>" in the "Full name" field
    Then I see "<pgfirstName>" in the "First names" field
    Then I see "<pgLastName>" in the "Last name" field
    And I see "<pgdob>" in the Date of birth field
    And I see "<pgNiNumber>" in the "National Insurance number" field
    And I see "<pgAddress1>" in the "Address line 1" field
    And I see "<pgAddress2>" in the "Address line 2" field
    And I see "<pgAddress3>" in the "Address line 3" field
    And I see "<pgPostCode>" in the "Postcode" field

    Examples:
      | pgfirstName         | pgLastName                    | pgdob      | pgNiNumber | pgAddress1      | pgAddress2 | pgAddress3 | pgPostCode |
      | this is first names | checking Last name characters | 01/04/1980 | AB123456C  | 18 tester house | Avenue     | Langham    | AB12 4LH   |

  Scenario: AC5b - Happy path validation successful, add contact details, information retained

    # When I enter "<pgFullName>" into the "Full name" field
    When I enter "<pgfirstName>" into the "First names" field
    And I enter "<pgLastName>" into the "Last name" field
    And I enter "<pgdob>" into the Date of birth field
    And I enter "<pgNiNumber>" into the "National Insurance number" field
    And I enter "<pgAddress1>" into the "Address line 1" field
    And I enter "<pgAddress2>" into the "Address line 2" field
    And I enter "<pgAddress3>" into the "Address line 3" field
    And I enter "<pgPostCode>" into the "Postcode" field
    And I click the "Add contact details" button
    Then I see "Parent or guardian contact details" on the page header

    When I click on the "Cancel" link
    And I see the status of "Parent or guardian details" is "Provided"
    And I click on the "Parent or guardian details" link
    # Then I see "<pgFullName>" in the "Full name" field
    Then I see "<pgfirstName>" in the "First names" field
    Then I see "<pgLastName>" in the "Last name" field
    And I see "<pgdob>" in the Date of birth field
    And I see "<pgNiNumber>" in the "National Insurance number" field
    And I see "<pgAddress1>" in the "Address line 1" field
    And I see "<pgAddress2>" in the "Address line 2" field
    And I see "<pgAddress3>" in the "Address line 3" field
    And I see "<pgPostCode>" in the "Postcode" field

    Examples:
      | pgfirstName | pgLastName                    | pgdob      | pgNiNumber | pgAddress1      | pgAddress2 | pgAddress3 | pgPostCode |
      | Darren Malt | checking Last name characters | 01/04/1980 | AB123456C  | 18 tester house | Avenue     | Langham    | AB12 4LH   |

  Scenario: AC6 & AC7 - Cancel link behaviour

    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I see the status of "Parent or guardian details" is "Not provided"

    When I click on the "Parent or guardian details" link
    And I enter "<pgAddress1>" into the "Address line 1" field
    And I click on the "Cancel" link
    And I select OK on the pop up window
    Then I see "Account details" on the page header

    When I click on the "Parent or guardian details" link
    And I enter "<pgAddress1>" into the "Address line 1" field
    And I click Cancel, a window pops up and I click Cancel
    Then I see "Parent or guardian details" on the page header
    And I see "<pgAddress1>" in the "Address line 1" field

    Examples:
      | pgFullName  |
      | Darren Malt |
