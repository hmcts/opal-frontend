Feature:PO-369 Personal details screen for adult or youth for parent or guardian defendant type

    Background:
        Given I am on the OPAL Frontend
        Then I see "Opal" in the header

        When I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        When I navigate to Manual Account Creation

        Then I see "Create account" as the caption on the page
        Then I see "Business unit and defendant type" on the page header
        And I enter "London South" into the business unit search box
        When I select the "Adult or youth with parent or guardian to pay" radio button
        Then I click on continue button

        Then I see "Create account" as the caption on the page
        Then I see "Account details" on the page header

        Then I see the "Defendant details" section heading
        And I see the "Personal details" link under the "Defendant details" section
        And I click on "Personal details" link
        Then I see "Personal details" on the page header

    Scenario: AC1-positive: Personal details page will be created with all fields
        When I select title "Mr" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley Treen" into the "Last name" field

        When I select the "Add aliases" checkbox

        Then I set the "Alias 1", "First names" to "First names in alias"
        And I set the "Alias 1", "Last name" to "Last name in aliases"

        And I click the "Add another alias" button

        Then I set the "Alias 2", "First names" to "First names in alias"
        And I set the "Alias 2", "Last name" to "Last name in aliases"

        Then I see the "Remove" link below the "Alias 2", "Last name" input
        And I click the "Add another alias" button

        Then I set the "Alias 3", "First names" to "First names in alias"
        And I set the "Alias 3", "Last name" to "Last name in aliases"

        Then I see the "Remove" link below the "Alias 3", "Last name" input
        And I click the "Add another alias" button

        Then I set the "Alias 4", "First names" to "First names in alias"
        And I set the "Alias 4", "Last name" to "Last name in aliases"

        Then I see the "Remove" link below the "Alias 4", "Last name" input
        And I click the "Add another alias" button

        Then I set the "Alias 5", "First names" to "First names in alias"
        And I set the "Alias 5", "Last name" to "Last name in aliases"


        And I enter "10/10/2000" into the Date of birth field
        And I enter "QQ 12 34 56 C" into the "National Insurance number" field

        And I enter "12 test's road checking address1" into the "Address line 1" field
        And I enter "12 test road checking address2" into the "Address line 2" field
        And I enter "London city check" into the "Address line 3" field
        And I enter "AB12 7MH" into the "Postcode" field

        And I enter "Ambassdor Volkswagen" into the "Make of the car" field
        And I enter "AP28 AAR" into the "Registration number" field

        Then I click the "Return to account details" button

    Scenario Outline: AC1b & 1c-negative: user will not be able to add asteriks (*) address lines 1,2 & 3
        When I select title "Mr" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley Treen" into the "Last name" field
        And I enter "<addressLine1>" into the "Address line 1" field
        And I enter "<addressLine2>" into the "Address line 2" field
        And I enter "<addressLine3>" into the "Address line 3" field

        Then I click the "Return to account details" button
        Then I see the error message "The address line 1 must not contain special characters" at the top of the page
        Then I see the error message "The address line 1 must not contain special characters" at the top of the page
        Then I see the error message "The address line 1 must not contain special characters" at the top of the page
        Examples:
            | addressLine1 | addressLine2 | addressLine3 |
            | 92 * Avenue  | test road *  | test* city   |

    Scenario Outline: AC2- negative: If a user does not enter any data into any field and selects the 'Return to account details' or 'Add offence details' button
        Then I click the "<returnButton>" button
        Then I see the error message "Select a title" at the top of the page
        Then I see the error message "Enter defendant's first name(s)" at the top of the page
        Then I see the error message "Enter defendant's last name" at the top of the page
        Then I see the error message "Enter address line 1, typically the building and street" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario Outline: AC3- negative: If a user has not entered data into any mandatory fields (i.e. Title, First Names, Last Name & Address Line 1 fields) but has entered data into one or more other optional fields, then selecting the 'Return to account details' or 'Add offence details' button
        And I enter "<addressLine2>" into the "Address line 2" field
        And I enter "<addressLine3>" into the "Address line 3" field

        Then I click the "<returnButton>" button
        Then I see the error message "Select a title" at the top of the page
        Then I see the error message "Enter defendant's first name(s)" at the top of the page
        Then I see the error message "Enter defendant's last name" at the top of the page
        Then I see the error message "Enter address line 1, typically the building and street" at the top of the page
        Examples:
            | addressLine2 | addressLine3 | returnButton              |
            | test road    | London       | Return to account details |
            | test road    | London       | Add offence details       |

    Scenario: AC4- positive: If a user selects the 'Add Aliases' tick box
        When I select add aliases check box
        Then I verify "Alias 1" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading

    Scenario: AC5-positive: If a user selects 'Add another alias' for the first time
        When I select add aliases check box
        When I select add another alias
        Then I verify "Alias 2" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading
        Then I see the "Remove" link below the "Alias 2", "Last name" input
        #And I see "Add another alias" button below the "Remove" link "last name"
        And I see the "Remove" link below the "Alias 2", "Last name" input

    Scenario: AC6-positive: If a user selects 'Add another alias' for the nth time (where N = 2, 3 or 4)
        When I select add aliases check box
        Then I verify "Alias 1" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading
        And I click the "Add another alias" button

        Then I verify "Alias 2" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading
        Then I see the "Remove" link below the "Alias 2", "Last name" input
        #And I see "Add another alias" link below the "Remove" button

        And I click the "Add another alias" button
        Then I verify "Alias 3" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading
        Then I see the "Remove" link below the "Alias 3", "Last name" input


        And I click the "Add another alias" button
        Then I verify "Alias 4" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading
        Then I see the "Remove" link below the "Alias 4", "Last name" input


        And I click the "Add another alias" button
        Then I verify "Alias 5" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading
        Then I see the "Remove" link below the "Alias 5", "Last name" input

    Scenario: AC7- positive: verifying the 'Remove' alias button work flow
        When I select add aliases check box
        Then I verify "Alias 1" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading

        And I click the "Add another alias" button
        Then I verify "Alias 2" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading

        And I click the "Add another alias" button
        Then I verify "Alias 3" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading

        And I click the "Add another alias" button
        Then I verify "Alias 4" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading

        And I click the "Add another alias" button
        Then I verify "Alias 5" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading
        Then I set the "Alias 5", "First names" to "First names in alias"
        Then I set the "Alias 5", "First names" to "First names in alias"

        Then I select "Remove" button
        Then I no longer see "Alias 5" sub heading

        Then I verify "Alias 4" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading
        Then I set the "Alias 4", "First names" to "First names in alias"
        Then I set the "Alias 4", "First names" to "First names in alias"

        Then I select "Remove" button
        Then I no longer see "Alias 4" sub heading

        Then I verify "Alias 3" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading
        Then I set the "Alias 3", "First names" to "First names in alias"
        Then I set the "Alias 3", "First names" to "First names in alias"

        Then I select "Remove" button
        Then I no longer see "Alias 3" sub heading

        Then I verify "Alias 2" sub heading
        Then I verify the text boxes "First names","Last name" below the sub heading
        Then I set the "Alias 2", "First names" to "First names in alias"
        Then I set the "Alias 2", "First names" to "First names in alias"

        Then I select "Remove" button
        Then I no longer see "Alias 2" sub heading
        Then I verify "Alias 1" sub heading
        And I do not see the "Remove" link below the "Alias 1"


    Scenario: AC8- positive: If the user unticks the 'Add aliases' tick box
        When I select add aliases check box
        Then I set the "Alias 1", "First names" to "First names in alias"
        And I set the "Alias 1", "Last name" to "Last name in aliases"

        Then I unselect aliases check box
        Then I no longer see "Alias 1" sub heading

        When I select add aliases check box
        Then I see "Alias 1" sub heading

        Then I see "Alias 1", "First names" is set to ""
        Then I see "Alias 1", "Last name" is set to ""

    Scenario: AC9 - negative: If a user is selecting a date of birth using the date picker
        When I select title "Mrs" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        When I enter "01/01/2500" into the Date of birth field
        And I enter "120 Deuchar street" into the "Address line 1" field

        Then I click the "Return to account details" button
        Then I see the error message "Enter a valid date of birth in the past" at the top of the page

    Scenario: AC10a- negative: User ticks Add aliases box but does not input any data into Alias 1
        When I select title "Mr" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field

        When I select add aliases check box
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario: AC10ai- negative: User adds data into Alias 1 - First names, but does enter any data into last name
        When I select title "Mr" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        When I select add aliases check box
        Then I set the "Alias 1", "First names" to "Micheal Kores"
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        Then I click the "<returnButton>" button
        Then I see the error message "Enter last name for alias 1" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario: AC10aii- negative: User adds data into Alias 1 - Last name, but does enter any data into First names
        When I select title "Miss" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        When I select add aliases check box
        And I set the "Alias 1", "Last name" to "Guccio gucci "
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario: AC10b -negative: User does not add any data into either Alias 2 fields
        When I select title "Ms" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field

        When I select add aliases check box
        And I click the "Add another alias" button
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        Then I see the error message "Enter first name(s) for alias 2" at the top of the page
        And I see the error message "Enter last name for alias 2" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario: AC10bi- negative: User adds data into Alias 2 - First names, but does enter any data into last name
        When I select title "Miss" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        When I select add aliases check box
        And I click the "Add another alias" button
        Then I set the "Alias 2", "First names" to "Gucci Gucci "
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 2" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario: AC10bii- negative: User adds data into Alias 2 - Last name, but does enter any data into First names
        When I select title "Mr" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        When I select add aliases check box
        And I click the "Add another alias" button
        And I set the "Alias 2", "Last name" to "Holland and Barrates"
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        Then I see the error message "Enter first name(s) for alias 2" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |


    Scenario: AC10c -negative: User does not add any data into either Alias 3 fields
        When I select title "Mr" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        When I select add aliases check box
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        Then I see the error message "Enter first name(s) for alias 2" at the top of the page
        And I see the error message "Enter last name for alias 2" at the top of the page
        Then I see the error message "Enter first name(s) for alias 3" at the top of the page
        And I see the error message "Enter last name for alias 3" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario: AC10ci- negative: User adds data into Alias 3 - First names, but does enter any data into last name
        When I select title "Ms" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        When I select add aliases check box
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        And I set the "Alias 3", "First names" to "Holland and Barrates"
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        Then I see the error message "Enter first name(s) for alias 2" at the top of the page
        And I see the error message "Enter last name for alias 2" at the top of the page
        Then I see the error message "Enter last name for alias 3" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |


    Scenario Outline: AC10cii- negative: User adds data into Alias 3 - Last name, but does enter any data into First names
        When I select title "Miss" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        When I select add aliases check box
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        And I set the "Alias 3", "Last name" to "Holland and Barrates"
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        Then I see the error message "Enter first name(s) for alias 2" at the top of the page
        And I see the error message "Enter last name for alias 2" at the top of the page
        Then I see the error message "Enter first name(s) for alias 3" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario Outline: AC10d -negative: User does not add any data into either Alias 4 fields
        When I select title "Mrs" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        When I select add aliases check box
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        Then I see the error message "Enter first name(s) for alias 2" at the top of the page
        And I see the error message "Enter last name for alias 2" at the top of the page
        Then I see the error message "Enter first name(s) for alias 3" at the top of the page
        Then I see the error message "Enter first name(s) for alias 4" at the top of the page
        And I see the error message "Enter last name for alias 4" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario: AC10di- negative: User adds data into Alias 4 - First names, but does enter any data into last name
        When I select title "Mrs" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        When I select add aliases check box
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        Then I set the "Alias 4", "First names" to "Holland and Barrates"
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        Then I see the error message "Enter first name(s) for alias 2" at the top of the page
        And I see the error message "Enter last name for alias 2" at the top of the page
        Then I see the error message "Enter first name(s) for alias 3" at the top of the page
        And I see the error message "Enter last name for alias 3" at the top of the page
        Then I see the error message "Enter last name for alias 4" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario: AC10dii- negative: User adds data into Alias 4 - Last name, but does enter any data into First names
        When I select title "Mrs" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        When I select add aliases check box
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        Then I set the "Alias 4", "Last name" to "Holland and Barrates"
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        Then I see the error message "Enter first name(s) for alias 2" at the top of the page
        And I see the error message "Enter last name for alias 2" at the top of the page
        Then I see the error message "Enter first name(s) for alias 3" at the top of the page
        And I see the error message "Enter last name for alias 3" at the top of the page
        Then I see the error message "Enter first name(s) for alias 4" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |


    Scenario: AC10e -negative: User does not add any data into either Alias 5 fields
        When I select title "Mrs" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        When I select add aliases check box
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        Then I see the error message "Enter first name(s) for alias 2" at the top of the page
        And I see the error message "Enter last name for alias 2" at the top of the page
        Then I see the error message "Enter first name(s) for alias 3" at the top of the page
        And I see the error message "Enter last name for alias 3" at the top of the page
        Then I see the error message "Enter first name(s) for alias 4" at the top of the page
        And I see the error message "Enter last name for alias 4" at the top of the page
        Then I see the error message "Enter first name(s) for alias 5" at the top of the page
        And I see the error message "Enter last name for alias 5" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario: AC10ei- negative: User adds data into Alias 5 - First names, but does enter any data into last name
        When I select title "Mrs" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        When I select add aliases check box
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        Then I set the "Alias 5", "First names" to "Holland and Barrates"
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        Then I see the error message "Enter first name(s) for alias 2" at the top of the page
        And I see the error message "Enter last name for alias 2" at the top of the page
        Then I see the error message "Enter first name(s) for alias 3" at the top of the page
        And I see the error message "Enter last name for alias 3" at the top of the page
        Then I see the error message "Enter first name(s) for alias 4" at the top of the page
        And I see the error message "Enter last name for alias 4" at the top of the page
        And I see the error message "Enter last name for alias 5" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario: AC10eii- negative: User adds data into Alias 5 - Last name, but does enter any data into First names
        When I select title "Mrs" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        When I select add aliases check box
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        And I click the "Add another alias" button
        Then I set the "Alias 5", "Last name" to "Holland and Barrates"
        Then I click the "<returnButton>" button
        Then I see the error message "Enter first name(s) for alias 1" at the top of the page
        And I see the error message "Enter last name for alias 1" at the top of the page
        Then I see the error message "Enter first name(s) for alias 2" at the top of the page
        And I see the error message "Enter last name for alias 2" at the top of the page
        Then I see the error message "Enter first name(s) for alias 3" at the top of the page
        And I see the error message "Enter last name for alias 3" at the top of the page
        Then I see the error message "Enter first name(s) for alias 4" at the top of the page
        And I see the error message "Enter last name for alias 4" at the top of the page
        And I see the error message "Enter first name(s) for alias 5" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario Outline: AC11- Negative: Scenarios for National Insurance number field validation
        When I select title "Mrs" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "456 Lamburgh Street" into the "Address line 1" field
        When I enter "AB 12 34 45 6" into the "National Insurance number" field
        Then I click the "<returnButton>" button

        Then I see "Personal details" on the page header
        #NINO validation has lessen so the error message has changed
        #Then I see the error message "Enter a National Insurance number that is 2 letters, 6 numbers, then A, B, C or D, like QQ 12 34 56 C" at the top of the page
        Then I see the error message "Enter a National Insurance number in the format AANNNNNNA" at the top of the page
        Examples:
            | returnButton              |
            | Return to account details |
            | Add offence details       |

    Scenario: AC12- positive: When user amends all fields where validation fails (Mandatory fields) upon selecting "Return to account details"
        When I enter "Patricia Linda Barbara Amy Michael" into the "First names" field
        When I enter "Christina Kathy Ruby Melissa Langley" into the "Last name" field
        And I enter "test Road *12" into the "Address line 1" field

        Then I click the "Return to account details" button
        Then I see the error message "Select a title" at the top of the page
        Then I see the error message "The defendant's first name(s) must be 20 characters or fewer" at the top of the page
        Then I see the error message "The defendant's last name must be 30 characters or fewer" at the top of the page
        Then I see the error message "The address line 1 must not contain special characters" at the top of the page

        Then I see "Personal details" on the page header

        When I select title "<updateTitle>" from dropdown
        When I enter "<updateFirstnames>" into the "First names" field
        When I enter "<updateLastname>" into the "Last name" field
        And I enter "<updateAddressLine1>" into the "Address line 1" field

        Then I click the "Return to account details" button
        Then I see "Account details" on the page header

        Then I click on "Personal details" link
        Then I see "Personal details" on the page header

        Then I see "<updateFirstnames>" in the "First names" field
        Then I see "<updateLastname>" in the "Last name" field
        Then I see "<updateAddressLine1>" in the "Address line 1" field

        Examples:
            | updateTitle | updateFirstnames | updateLastname | updateAddressLine1 |
            | Mr          | Coca Cola        | Cola Family    | Pepsi Road         |


    Scenario: AC12a- positive: When user amends all fields where validation fails (Mandatory fields)upon selecting "Add offence details"
        When I enter "Patricia Linda Barbara Amy" into the "First names" field
        When I enter "Christina Kathy234 Ruby Melissa" into the "Last name" field
        And I enter "test Road *12" into the "Address line 1" field

        Then I click the "Return to account details" button
        Then I see the error message "Select a title" at the top of the page
        Then I see the error message "The defendant's first name(s) must be 20 characters or fewer" at the top of the page
        Then I see the error message "The defendant's last name must be 30 characters or fewer" at the top of the page
        Then I see the error message "The address line 1 must not contain special characters" at the top of the page

        Then I see "Personal details" on the page header

        When I select title "<updateTitle>" from dropdown
        When I enter "<updateFirstnames>" into the "First names" field
        When I enter "<updateLastname>" into the "Last name" field
        When I enter "<updateAddressLine1>" into the "Address line 1" field

        Then I click the "Add offence details" button
        Then I see "Offence details" on the page header
        Then I click the "Return to account details" button

        Then I click on "Personal details" link
        Then I see "Personal details" on the page header

        Then I see "<updateFirstnames>" in the "First names" field
        Then I see "<updateLastname>" in the "Last name" field
        Then I see "<updateAddressLine1>" in the "Address line 1" field
        Examples:
            | updateTitle | updateFirstnames | updateLastname | updateAddressLine1 |
            | Mr          | Coca Cola        | Cola Family    | Pepsi Road         |


    Scenario Outline: AC13-positive: When user enters data into mandatory fields only and selecting Return to account details button
        When I select title "Mrs" from dropdown
        When I enter "<firstNames>" into the "First names" field
        When I enter "<lastName>" into the "Last name" field
        And I enter "<addressLine1>" into the "Address line 1" field

        When I select add aliases check box
        Then I set the "Alias 1", "First names" to "<firstNames>"
        Then I set the "Alias 1", "Last name" to "<lastName>"

        Then I click the "<returnPageButton>" button
        Then I see "Create account" as the caption on the page
        Then I see "Account details" on the page header
        Then I verify the status of "Personal details" to "Provided"

        And I click on "Personal details" link
        Then I see "Personal details" on the page header
        Then I see "<firstNames>" in the "First names" field
        Then I see "<lastName>" in the "Last name" field
        Then I see "<addressLine1>" in the "Address line 1" field
        When I select add aliases check box
        Then I see data entered in "Alias 1","First names" and "<firstNames>"
        Then I see data entered in "Alias 1","Last name" and "<lastName>"

        Examples:
            | title | firstNames         | lastName                       | addressLine1        | returnPageButton          |
            | Mrs   | John Smith Michael | Astridge Lamsden Langley Treen | Alphine Colony Road | Return to account details |


    Scenario Outline: AC13a-positive: When user enters data into mandatory fields only and selecting Add offence details button
        When I select title "<title>" from dropdown
        When I enter "<firstNames>" into the "First names" field
        When I enter "<lastName>" into the "Last name" field
        And I enter "<addressLine1>" into the "Address line 1" field
        When I select add aliases check box
        Then I set the "Alias 1", "First names" to "<firstNames>"
        Then I set the "Alias 1", "Last name" to "<lastName>"

        Then I click the "Add offence details" button
        Then I see "Offence details" on the page header
        Then I click the "Return to account details" button
        Then I see "Account details" on the page header

        And I click on "Personal details" link
        Then I see "Personal details" on the page header
        Then I see "<firstNames>" in the "First names" field
        Then I see "<lastName>" in the "Last name" field
        Then I see "<addressLine1>" in the "Address line 1" field
        Then I see data entered in "Alias 1","First names" and "<firstNames>"
        Then I see data entered in "Alias 1","Last name" and "<lastName>"

        Examples:
            | title | firstNames         | lastName                       | addressLine1        |
            | Ms    | John Smith Michael | Astridge Lamsden Langley Treen | Alphine Colony Road |


    Scenario: AC14-negative: When user selects cancel button without entering any data into fields
        When "Cancel" is clicked
        Then I see "Create account" as the caption on the page
        Then I see "Account details" on the page header
        Then I verify the status of "Personal details" to "Not provided"

    Scenario: AC15a-negative: If a user selects the 'Cancel' button and the user has entered data into one or more fields, a warning message will be displayed and user selects 'OK'
        When I select title "Mrs" from dropdown
        When I enter "John Smith Michael" into the "First names" field
        When I enter "Astridge Lamsden Langley" into the "Last name" field
        And I enter "23 WarwickShire Road" into the "Address line 1" field

        When I click Cancel, a window pops up and I click Ok
        Then I see "Account details" on the page header

        And I click on "Personal details" link
        Then I see "Personal details" on the page header
        Then I see "" in the "First names" field
        Then I see "" in the "Last name" field
        Then I see "" in the "Address line 1" field

    Scenario Outline: AC15b-neagative: If a user selects the 'Cancel' button and the user has entered data into one or more fields, a warning message will be displayed and user selects 'Cancel'
        When I select title "Ms" from dropdown
        When I enter "<firstNames>" into the "First names" field
        When I enter "<lastName>" into the "Last name" field
        And I enter "<addressLine1>" into the "Address line 1" field

        When I click Cancel, a window pops up and I click Cancel
        Then I see "Personal details" on the page header

        Then I see "Personal details" on the page header
        #And I see "<title>" from dropdown
        Then I see "<firstNames>" in the "First names" field
        Then I see "<lastName>" in the "Last name" field
        Then I see "<addressLine1>" in the "Address line 1" field
        Examples:
            | title | firstNames         | lastName                       | addressLine1         |
            | Ms    | John Smith Michael | Astridge Lamsden Langley Treen | 23 WarwickShire Road |



