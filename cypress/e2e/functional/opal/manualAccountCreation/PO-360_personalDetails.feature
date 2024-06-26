Feature: verifying the personal details screen for adult or youth only defendant type

    Background:
        Given I am on the OPAL Frontend
        Then I see "Opal" in the header

        When I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        When I navigate to Manual Account Creation

        Then I see "Create account" as the caption on the page
        Then I see "Business unit and defendant type" on the page header
        And I enter "London South" into the business unit search box
        And I select adults and youth only
        Then I click on continue button

        Then I see "Create account" as the caption on the page
        Then I see "Account details" on the page header

        Then I see the "Defendant details" section heading
        And I see the "Personal details" link under the "Defendant details" section
        And I click on "Personal details" link
        Then I see "Personal details" on the page header

    # Scenario Outline: AC1-positive: Personal details page will be created with all fields
    #     When I enter data into title, first names and last name in  personal details screen
    #         | title       | Mr                             |
    #         | First names | John Smith Michael tp          |
    #         | Last name   | Astridge Lamsden Langley Treen |
    #     And I select add aliases check box

    #     And I enter alias1 details "<firstName>","<lastName>"
    #     And I click add another alias

    #     And I enter alias2 details "<firstName>","<lastName>"
    #     And I click add another alias

    #     And I enter alias3 details "<firstName>","<lastName>"
    #  And I click add another alias

    #     And I enter alias4 details "<firstName>","<lastName>"
    #     And I select add another alias

    #     And I enter alias5 details "<firstName>","<lastName>"

    #     And I enter date of birth from date picker
    #     And I enter National insurance number

    #     And I enter address line 1 "<addressLine1>"
    #     And I enter address line 2 "<addressLine2>"
    #     And I enter address line 3 "<addressLine3>"
    #     And I enter postcode

    #     And I enter make of the car
    #     And I enter registration number of the car

    #     Then I click return to account details


    #     Examples:
    #         | alias 1                        | alias 2                        | alias 3                        | alias 4                        | alias 5                        |
    #         | first name an last name alias1 | first name an last name alias1 | first name an last name alias1 | first name an last name alias1 | first name an last name alias1 |

    # Scenario Outline: AC1b-negative: user will not be able to add asteriks (*) address lines 1,2 & 3
    #     When I select title "Mr"
    #     When I enter data into first names and last name in personal details screen
    #         | firstName | John Smith Michael             |
    #         | lastName  | Astridge Lamsden Langley Treen |
    #     And I enter address line 1 "<addressLine1>"
    #     And I enter address line 2 "<addressLine2>"
    #     And I enter address line 3 "<addressLine3>"

    #     Then I click return to account details
    #     Then I verify the error message

    #     Examples:
    #         | addressLine1 | addressLine2 | addressLine3 |
    #         | 92 * Avenue  | test road *  | test* city   |

    # Scenario: AC2- negative: If a user does not enter any data into any field and selects the 'Return to account details' button
    #     Then I click return to account details
    #     Then I verify the error message

    # Scenario Outline: AC3- negative: If a user has not entered data into any mandatory fields (i.e. Title, First Names, Last Name & Address Line 1 fields) but has entered data into one or more other optional fields, then selecting the 'Return to account details' button
    #     And I enter address line 2 "<addressLine2>"
    #     And I enter address line 3 "<addressLine3>"

    #     Then I click return to account details
    #     Then I verify the error message
    #     Examples:
    #         | addressLine2 | addressLine3 |
    #         | test road    | London       |



    # Scenario: AC4- positive: If a user selects the 'Add Aliases' tick box
    # When I select add aliases check box
    # Then I verify "Alias 1" sub heading
    # Then I verify the text boxes "First names","Last name" under the sub heading

    # Scenario: AC5-positive: If a user selects 'Add another alias' for the first time
    #     When I select add aliases check box
    #     When I select add another alias
    #     Then I verify "Alias 2" sub heading
    #     Then I verify the text boxes "First names","Last name" below the sub heading
    #     #And I see "Remove" link below the "Last name" field
    #     And I see "Add another alias" button below the "Remove" link


    # Scenario: AC6-positive: If a user selects 'Add another alias' for the nth time (where N = 2, 3 or 4)
    #     When I select add aliases check box
    #     When I select add another alias
    #     # Then I verify "Alias 2" sub heading
    #     # Then I verify the text boxes "First names","Last name" under the sub heading
    #     And I see "Remove" link below the "Last name" field
    #     And I see "Add another alias" link below the "Remove" button

    #     Then I select add another alias
    #     Then I verify "Alias 3" sub heading
    #     Then I verify the text boxes "First names","Last name" under the sub heading
    #     And I see "Remove" link below the "Last name" field

    #     Then I select add another alias
    #     Then I verify "Alias 4" sub heading
    #     Then I verify the text boxes "First names","Last name" under the sub heading
    #     And I see "Remove" link below the "Last name" field

    #     Then I select add another alias
    #     Then I verify "Alias 5" sub heading
    #     Then I verify the text boxes "First names","Last name" under the sub heading
    #     And I see "Remove" link below the "Last name" field

    # Scenario: AC7a- positive: verifying the 'Remove' alias button work flow
    #     When I select add aliases check box
    #     When I select add another alias
    #     Then I verify "Alias 2" sub heading
    #     Then I verify the text boxes "First names","Last name" below the sub heading

    #     Then I select add another alias
    #     Then I verify "Alias 3" sub heading
    #     Then I verify the text boxes "First names","Last name" below the sub heading
    #     # And I see "Remove" link below the "Last name" field

    #     Then I select add another alias
    #     Then I verify "Alias 4" sub heading
    #     Then I verify the text boxes "First names","Last name" below the sub heading
    #     # And I see "Remove" link below the "Last name" field

    #     Then I select add another alias
    #     Then I verify "Alias 5" sub heading
    #     Then I verify the text boxes "First names","Last name" below the sub heading
    #     # And I see "Remove" link below the "Last name" field

    #     Then I select "Remove" button
    #     Then I cannot see "Alias 5" sub heading
    #     Then I verify "Alias 4" sub heading
    #     Then I verify the "First names" text box below the "Alias 4" sub heading
    #     Then I verify the "Last name" text box below the "Alias 4" sub heading and first names
    #     And I verify the "Remove" button below the "Alias 4"


    # Scenario Outline: AC8- positive: If the user unticks the 'Add aliases' tick box
    #     When I select add aliases check box
    # When I enter data into first names and last name in personal details screen
    #         | firstName | John Smith Michael             |
    #         | lastName  | Astridge Lamsden Langley Treen |

    #     Then I unselect aliases check box
    #     Then I cannot see "Alias 1" sub heading

    #     When I select add aliases check box
    #     Then I see "Alias 1" sub heading
    #     Then I verify "<firstNames>" and "<lastName>"" data
    #     Example:
    #         | firstNames            | lastName                       |
    #         | John Smith Michael VI | Astridge Lamsden Langley Green |

    # Scenario Outline: AC9 - negative: If a user is selecting a date of birth using the date picker
    #     When I select title "Mrs"
    #     When I enter data into first names and last name in personal details screen
    #         | firstName | John Smith Michael             |
    #         | lastName  | Astridge Lamsden Langley Treen |
    #     When I enter "<dateOfBirth>" into the Date of birth field
    #     And I enter address line 1 "<addressLine1>"

    #     Then I click return to account details
    #     Then I verify the error message
    # Example:
    #         | dateOfBirth |
    #         | 01/01/2500  |
    #         | 01/92       |

    # Scenario: AC10a- negative: User ticks Add aliases box but does not input any data into Alias 1
    #     When I select add aliases check box
    #     When I enter data into first names " " and last name " "
    #     Then I click return to account details
    #     Then I verify the error message "Enter first name(s) for alias 1" for first names
    #     And I verify the error message "Enter last name for alias 1 " for last name

    # Scenario: AC10ai- negative: User adds data into Alias 1 - First names, but does enter any data into last name
    #     When I select add aliases check box
    #     When I enter data into first names "Michael Kores" and last name " "
    #     Then I click return to account details
    #     Then I verify the error message "Enter last name for alias 1 " for last name

    # Scenario: AC10aii- negative: User adds data into Alias 1 - Last name, but does enter any data into First names
    #     When I select add aliases check box
    #     When I enter data into first names " " and last name "Guccio gucci "
    #     Then I click return to account details
    #     Then I verify the error message "Enter first name(s) for alias 1" for last name

    # Scenario: AC10b -negative: User does not add any data into either Alias 2 fields
    #     When I select add aliases check box
    #     When I select add another alias
    #     When I enter data into first names " " and last name " "
    #     Then I click return to account details
    #     Then I verify the error message "Enter first name(s) for alias 2" for first names
    #     And I verify the error message "Enter last name for alias 2" for last name

    # Scenario: AC10bi- negative: User adds data into Alias 2 - First names, but does enter any data into last name
    #     When I select add aliases check box
    #     When I select add another alias
    #     When I enter data into first names "Michael Kores" and last name " "
    #     Then I click return to account details
    #     Then I verify the error message "Enter last name for alias 2" for last name

    # Scenario: AC10bii- negative: User adds data into Alias 2 - Last name, but does enter any data into First names
    #     When I select add aliases check box
    #     When I select add another alias
    #     When I enter data into first names " " and last name "Guccio gucci "
    #     Then I click return to account details
    #     Then I verify the error message "Enter first name(s) for alias 2" for last name

    # Scenario: AC10c -negative: User does not add any data into either Alias 3 fields
    #     When I select add aliases check box
    #     When I enter data into first names " " and last name " "
    #     When I select add another alias
    #     When I select add another alias
    #     Then I click return to account details
    #     Then I verify the error message "Enter first name(s) for alias 3" for first names
    #     And I verify the error message "Enter last name for alias 3" for last name

    # Scenario: AC10ci- negative: User adds data into Alias 3 - First names, but does enter any data into last name
    #     When I select add aliases check box
    #     When I select add another alias
    #     When I select add another alias
    #     When I enter data into first names "Michael Kores" and last name " "
    #     Then I click return to account details
    #     Then I verify the error message "Enter last name for alias 3" for last name

    # Scenario: AC10cii- negative: User adds data into Alias 3 - Last name, but does enter any data into First names
    #     When I select add aliases check box
    #     When I select add another alias
    #     When I select add another alias
    #     When I enter data into first names " " and last name "Guccio gucci "
    #     Then I click return to account details
    #     Then I verify the error message "Enter first name(s) for alias 3" for last name

    # Scenario: AC10d -negative: User does not add any data into either Alias 4 fields
    #     When I select add aliases check box
    #     When I select add another alias
    #     When I select add another alias
    #     When I select add another alias
    #     When I enter data into first names " " and last name " "
    #     Then I click return to account details
    #     Then I verify the error message "Enter first name(s) for alias 4" for first names
    #     And I verify the error message "Enter last name for alias 4" for last name

    # Scenario: AC10di- negative: User adds data into Alias 4 - First names, but does enter any data into last name
    #     When I select add aliases check box
    #     When I select add another alias
    #     When I select add another alias
    #     When I select add another alias
    #     When I enter data into first names "Michael Kores" and last name " "
    #     Then I click return to account details
    #     Then I verify the error message "Enter last name for alias 4" for last name

    # Scenario: AC10dii- negative: User adds data into Alias 4 - Last name, but does enter any data into First names
    #     When I select add aliases check box
    #     When I select add another alias
    #     When I select add another alias
    #     When I select add another alias
    #     When I enter data into first names " " and last name "Guccio gucci "
    #     Then I click return to account details
    #     Then I verify the error message "Enter first name(s) for alias 4" for last name


    # Scenario: AC10e -negative: User does not add any data into either Alias 5 fields
    #     When I select add aliases check box
    #     When I select add another alias
    #     When I select add another alias
    #     When I select add another alias
    #     When I select add another alias
    #     When I enter data into first names " " and last name " "
    #     Then I click return to account details
    #     Then I verify the error message "Enter first name(s) for alias 5" for first names
    #     And I verify the error message "Enter last name for alias 5" for last name

    # Scenario: AC10ei- negative: User adds data into Alias 5 - First names, but does enter any data into last name
    #     When I select add aliases check box
    #     When I select add another alias
    #     When I select add another alias
    #     When I select add another alias
    #     When I select add another alias
    #     When I enter data into first names "Michael Kores" and last name " "
    #     Then I click return to account details
    #     Then I verify the error message "Enter last name for alias 5" for last name

    # Scenario: AC10eii- negative: User adds data into Alias 5 - Last name, but does enter any data into First names
    #     When I select add aliases check box
    #     When I select add another alias
    #     When I select add another alias
    #     When I select add another alias
    #     When I select add another alias
    #     When I enter data into first names " " and last name "Guccio gucci "
    #     Then I click return to account details
    #     Then I verify the error message "Enter first name(s) for alias 5" for last name

    # Scenario Outline: AC11- Negative: Scenarios for National Insurance number field validation
    #     When I enter incorrect National insurance number "<NInumber>"
    #     Then I click return to account details

    #     Then I see "Personal details" on the page header
    #     Then I verify the error messages "<errorMessage>" for defendant screens
    #     Examples:
    #         | NInumber      | errorMessage                                                                                          |
    #         | AB 12 34 45 6 | Enter a National Insurance number that is 2 letters, 6 numbers, then A, B, C or D, like QQ 12 34 56 C |
    #         | 1234GH6       | Enter a National Insurance number that is 2 letters, 6 numbers, then A, B, C or D, like QQ 12 34 56 C |
    #         | 1234567       | Enter a National Insurance number that is 2 letters, 6 numbers, then A, B, C or D, like QQ 12 34 56 C |
    #         | ABCFER        | Enter a National Insurance number that is 2 letters, 6 numbers, then A, B, C or D, like QQ 12 34 56 C |
    #         | ABCD1234      | Enter a National Insurance number that is 2 letters, 6 numbers, then A, B, C or D, like QQ 12 34 56 C |

    # Scenario: AC12- positive: When user amends all fields where validation fails (Mandatory fields)
    #     When I enter incorrect data into "<incorrectFirstNames>","<incorrectLastName>"
    #     And I enter incorrect address line 1 "<incorrectAddressLine1>"

    #     Then I click return to account details
    #     And I verify the error message
    #     Then I see "Personal details" on the page header

    #     Then I update title "<title>"
    #     And I update the first names "<firstNames>"
    #     And I update the last name "<lastName>"
    #     And I update address line 1 "<addressLine1>"
    #     Then I click return to account details
    #     Then I see "Account details" on the page header

    #     Then I click on "Personal details" link
    #     Then I see "Personal details" on the page header

    #     And I verify "<title>","<firstNames>","<lastName>" and "<addressLine1>" on contact details
    #     Examples:
    #         | incorrectAddressLine1 | title | firstNames | lastName    | title | addressLine1 | incorrectFirstNames                     | incorrectLastName                            |
    #         | test Road *12         | Mr    | Coca Cola  | Cola Family | Mr    | Pepsi Road   | Stuart Philips aarogyam Gucci Coach VII | Chicago bulls Burberry Redbull 2345 PizzaHut |


    Scenario: AC13-positive: When user enters data into mandatory fields only
        When I select title "Mrs"
        When I enter data into first names and last name in personal details screen
            | firstName | John Smith Michael             |
            | lastName  | Astridge Lamsden Langley Treen |
        And I enter address line 1 "<addressLine1>"

        Then I click return to account details
        Then I see "Create account" as the caption on the page
        Then I see "Account details" on the page header

        And I click on "Personal details" link
        Then I see "Personal details" on the page header
        And I verify "<title>","<firstNames>","<lastName>" and "<addressLine1>" on contact details

        When I select add aliases check box
        When I enter data into first names "Michael Kores" and last name "Gucci" in alias 
        When I select add aliases check box
        Then I click return to account details
        Then I see "Create account" as the caption on the page
        Then I see "Account details" on the page header

        And I click on "Personal details" link
        Then I see "Personal details" on the page header
        When I select add aliases check box
        Then I verify "<firstNames>" and "<lastName>" in alias 1
        And I verify "<title>","<firstNames>","<lastName>" and "<addressLine1>" on contact details

        Examples:
            | title | firstNames         | lastName                       | addressLine1        |
            | Mrs   | John Smith Michael | Astridge Lamsden Langley Treen | Alphine Colony Road |




# Scenario: AC14-negative: When user selects cancel button without entering any data into fields
#     When "Cancel" is clicked
#     Then I see "Create account" as the caption on the page
#     Then I see "Account details" on the page header















