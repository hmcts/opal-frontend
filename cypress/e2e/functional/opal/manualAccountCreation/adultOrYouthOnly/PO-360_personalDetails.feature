Feature: PO-360 personal details screen for adult or youth only defendant type

  Background:
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "London South" into the business unit search box
    When I select the "Adult or youth only" radio button
    Then I click on continue button

    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

    Then I see the "Defendant details" section heading
    And I see the "Personal details" link under the "Defendant details" section
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header

  Scenario: AC1-positive: Personal details page will be created with all fields
    When I select title "Mr" from dropdown
    When I enter data into first names and last name in personal details screen
      | firstNames | John Smithy Michaele           |
      | lastName   | Astridge Lamsden Langley Treen |

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

    And I enter "12 test road checking address1" into the "Address line 1" field
    And I enter "12 test road checking address2" into the "Address line 2" field
    And I enter "London city chec" into the "Address line 3" field
    And I enter "AB12 7MH" into the "Postcode" field

    And I enter "Ambassdor Volkswagen" into the "Make of the car" field
    And I enter "AP28 AAR" into the "Registration number" field

    Then I click the "Return to account details" button


  Scenario Outline: AC1b-negative: user will not be able to add asteriks (*) address lines 1,2 & 3
    When I select title "Mr" from dropdown
    When I enter data into first names and last name in personal details screen
      | firstNames | John Smith Michael             |
      | lastName   | Astridge Lamsden Langley Treen |
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

  Scenario Outline: Negative: verifying firstnames,last names and Address lines 1,2 & 3 having more than max characters
    When I select title "Mrs" from dropdown
    When I enter data into first names and last name in personal details screen
      | firstNames | John Smith Michael Letter Count      |
      | lastName   | Astridge Lamsden Langley Green Count |
    And I enter "<addressLine1>" into the "Address line 1" field
    And I enter "<addressLine2>" into the "Address line 2" field
    And I enter "<addressLine3>" into the "Address line 3" field

    Then I click the "Return to account details" button
    Then I see the error message "The address line 1 must be 30 characters or fewer" at the top of the page
    Then I see the error message "The address line 2 must be 30 characters or fewe" at the top of the page
    Then I see the error message "The address line 3 must be 16 characters or fewer" at the top of the page
    Then I see the error message "The defendant's first name(s) must be 20 characters or fewer" at the top of the page
    Then I see the error message "The defendant's last name must be 30 characters or fewer" at the top of the page

    Examples:
      | addressLine1                    | addressLine2                            | addressLine3              |
      | 278 Maidenhead Road, Maidenhead | John's Road, Near by London City Circle | London And United Kingdom |

  Scenario: AC2- negative: If a user does not enter any data into any field and selects the 'Return to account details' button
    Then I click the "Return to account details" button
    Then I see the error message "Select a title" at the top of the page
    Then I see the error message "Enter defendant's first name(s)" at the top of the page
    Then I see the error message "Enter defendant's last name" at the top of the page
    Then I see the error message "Enter address line 1, typically the building and street" at the top of the page

  Scenario Outline: AC3- negative: If a user has not entered data into any mandatory fields (i.e. Title, First Names, Last Name & Address Line 1 fields) but has entered data into one or more other optional fields, then selecting the 'Return to account details' button
    And I enter "<addressLine2>" into the "Address line 2" field
    And I enter "<addressLine3>" into the "Address line 3" field

    Then I click the "Return to account details" button
    Then I see the error message "Select a title" at the top of the page
    Then I see the error message "Enter defendant's first name(s)" at the top of the page
    Then I see the error message "Enter defendant's last name" at the top of the page
    Then I see the error message "Enter address line 1, typically the building and street" at the top of the page
    Examples:
      | addressLine2 | addressLine3 |
      | test road    | London       |


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

  Scenario: AC6-positive: If a user selects 'Add another alias' for the nth time (where N = 2, 3 or 4)
    When I select add aliases check box
    Then I verify "Alias 1" sub heading
    Then I verify the text boxes "First names","Last name" below the sub heading
    And I click the "Add another alias" button

    Then I verify "Alias 2" sub heading
    Then I verify the text boxes "First names","Last name" below the sub heading
    Then I see the "Remove" link below the "Alias 2", "Last name" input

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

  Scenario: AC7a- positive: verifying the 'Remove' alias button work flow
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
  #And I do not see the "Remove" link below the "Alias1", "Last name" input

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


  Scenario Outline: AC9 - negative: If a user is selecting a date of birth using the date picker
    When I select title "Mrs" from dropdown
    When I enter data into first names and last name in personal details screen
      | firstNames | John Smith Michael             |
      | lastName   | Astridge Lamsden Langley Treen |
    When I enter "<dateOfBirth>" into the Date of birth field
    And I enter "120 Deuchar street" into the "Address line 1" field

    Then I click the "Return to account details" button
    Then I see the error message "<errorMessage>" at the top of the page
    Examples:
      | dateOfBirth | errorMessage                                 |
      | 01/01/2500  | Enter a valid date of birth in the past      |
      | 01/92       | Enter date of birth in the format DD/MM/YYYY |

  # Scenario: AC10a- negative: User ticks Add aliases box but does not input any data into Alias 1
  #   When I select title "Mr" from dropdown
  #   When I enter data into first names and last name in personal details screen
  #     | firstNames | John Smith Michael       |
  #     | lastName   | Astridge Lamsden Langley |

  #   When I select add aliases check box
  #   And I enter address line 1 "456 Lamburgh Street"
  #   Then I click the "Return to account details" button
  #   Then I see the error message "Enter first name(s) for alias 1" at the top of the page
  #   And I see the error message "Enter last name for alias 1" at the top of the page

  # Scenario: AC10ai- negative: User adds data into Alias 1 - First names, but does enter any data into last name
  #   When I select title "Mr" from dropdown
  #   When I enter data into first names and last name in personal details screen
  #     | firstNames | John Smith Michael       |
  #     | lastName   | Astridge Lamsden Langley |
  #   When I select add aliases check box
  #   Then I set the "Alias 1", "First names" to "Micheal Kores"
  #   And I enter address line 1 "456 Lamburgh Street"
  #   Then I click the "Return to account details" button
  #   Then I see the error message "Enter last name for alias 1" at the top of the page

  # Scenario: AC10aii- negative: User adds data into Alias 1 - Last name, but does enter any data into First names
  #   When I select title "Miss" from dropdown
  #   When I enter data into first names and last name in personal details screen
  #     | firstNames | John Smith       |
  #     | lastName   | Astridge Lamsden |
  #   When I select add aliases check box
  #   And I set the "Alias 1", "Last name" to "Guccio gucci "
  #   And I enter address line 1 "456 Lamburgh Street"
  #   Then I click the "Return to account details" button
  #   Then I see the error message "Enter first name(s) for alias 1" at the top of the page

  # Scenario: AC10b -negative: User does not add any data into either Alias 2 fields
  #   When I select title "Ms" from dropdown
  #   When I enter data into first names and last name in personal details screen
  #     | firstNames | John Smith       |
  #     | lastName   | Astridge Lamsden |

  #   When I select add aliases check box
  #   And I click the "Add another alias" button
  #   And I enter address line 1 "456 Lamburgh Street"
  #   Then I click the "Return to account details" button
  #   Then I see the error message "Enter first name(s) for alias 1" at the top of the page
  #   And I see the error message "Enter last name for alias 1" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 2" at the top of the page
  #   And I see the error message "Enter last name for alias 2" at the top of the page

  # Scenario: AC10bi- negative: User adds data into Alias 2 - First names, but does enter any data into last name
  #   When I select title "Miss" from dropdown
  #   When I enter data into first names and last name in personal details screen
  #     | firstNames | John Smith       |
  #     | lastName   | Astridge Lamsden |
  #   And I enter address line 1 "456 Lamburgh Street"
  #   When I select add aliases check box
  #   And I click the "Add another alias" button
  #   Then I set the "Alias 2", "First names" to "Gucci Gucci "
  #   Then I click the "Return to account details" button
  #   Then I see the error message "Enter first name(s) for alias 1" at the top of the page
  #   And I see the error message "Enter last name for alias 1" at the top of the page
  #   And I see the error message "Enter last name for alias 2" at the top of the page

  # Scenario: AC10bii- negative: User adds data into Alias 2 - Last name, but does enter any data into First names
  #   When I select title "Mr" from dropdown
  #   When I enter data into first names and last name in personal details screen
  #     | firstNames | John Smith |
  #     | lastName   | Astridge   |
  #   And I enter address line 1 "456 Lamburgh Street"
  #   When I select add aliases check box
  #   And I click the "Add another alias" button
  #   And I set the "Alias 2", "Last name" to "Holland and Barrates"
  #   Then I click the "Return to account details" button
  #   Then I see the error message "Enter first name(s) for alias 1" at the top of the page
  #   And I see the error message "Enter last name for alias 1" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 2" at the top of the page


  # Scenario: AC10c -negative: User does not add any data into either Alias 3 fields
  #   When I select title "Mr" from dropdown
  #   When I enter data into first names and last name in personal details screen
  #     | firstNames | John Smith |
  #     | lastName   | Astridge   |
  #   And I enter address line 1 "456 Lamburgh Street"
  #   When I select add aliases check box
  #   And I click the "Add another alias" button
  #   And I click the "Add another alias" button
  #   Then I click the "Return to account details" button
  #   Then I see the error message "Enter first name(s) for alias 1" at the top of the page
  #   And I see the error message "Enter last name for alias 1" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 2" at the top of the page
  #   And I see the error message "Enter last name for alias 2" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 3" at the top of the page
  #   And I see the error message "Enter last name for alias 3" at the top of the page

  # Scenario: AC10ci- negative: User adds data into Alias 3 - First names, but does enter any data into last name
  #   When I select title "Ms" from dropdown
  #   When I enter data into first names and last name in personal details screen
  #     | firstNames | John Smith       |
  #     | lastName   | Astridge Lamsden |
  #   And I enter address line 1 "456 Lamburgh Street"
  #   When I select add aliases check box
  #   And I click the "Add another alias" button
  #   And I click the "Add another alias" button
  #   And I set the "Alias 3", "First names" to "Holland and Barrates"
  #   Then I click the "Return to account details" button
  #   Then I see the error message "Enter first name(s) for alias 1" at the top of the page
  #   And I see the error message "Enter last name for alias 1" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 2" at the top of the page
  #   And I see the error message "Enter last name for alias 2" at the top of the page
  #   Then I see the error message "Enter last name for alias 3" at the top of the page


  # Scenario: AC10cii- negative: User adds data into Alias 3 - Last name, but does enter any data into First names
  #   When I select title "Miss" from dropdown
  #   When I enter data into first names and last name in personal details screen
  #     | firstNames | John Smith       |
  #     | lastName   | Astridge Lamsden |
  #   And I enter address line 1 "456 Lamburgh Street"
  #   When I select add aliases check box
  #   And I click the "Add another alias" button
  #   And I click the "Add another alias" button
  #   And I set the "Alias 3", "Last name" to "Holland and Barrates"
  #   Then I click the "Return to account details" button
  #   Then I see the error message "Enter first name(s) for alias 1" at the top of the page
  #   And I see the error message "Enter last name for alias 1" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 2" at the top of the page
  #   And I see the error message "Enter last name for alias 2" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 3" at the top of the page

  # Scenario: AC10d -negative: User does not add any data into either Alias 4 fields
  #   When I select title "Mrs" from dropdown
  #   When I enter data into first names and last name in personal details screen
  #     | firstNames | John Smith |
  #     | lastName   | Astridge   |
  #   And I enter address line 1 "456 Lamburgh Street"
  #   When I select add aliases check box
  #   And I click the "Add another alias" button
  #   And I click the "Add another alias" button
  #   And I click the "Add another alias" button
  #   Then I click the "Return to account details" button
  #   Then I see the error message "Enter first name(s) for alias 1" at the top of the page
  #   And I see the error message "Enter last name for alias 1" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 2" at the top of the page
  #   And I see the error message "Enter last name for alias 2" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 3" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 4" at the top of the page
  #   And I see the error message "Enter last name for alias 4" at the top of the page

  # Scenario: AC10di- negative: User adds data into Alias 4 - First names, but does enter any data into last name
  #   When I select title "Mrs" from dropdown
  #   When I enter data into first names and last name in personal details screen
  #     | firstNames | John Smith |
  #     | lastName   | Astridge   |
  #   And I enter address line 1 "456 Lamburgh Street"
  #   When I select add aliases check box
  #   And I click the "Add another alias" button
  #   And I click the "Add another alias" button
  #   And I click the "Add another alias" button
  #   Then I set the "Alias 4", "First names" to "Holland and Barrates"
  #   Then I click the "Return to account details" button
  #   Then I see the error message "Enter first name(s) for alias 1" at the top of the page
  #   And I see the error message "Enter last name for alias 1" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 2" at the top of the page
  #   And I see the error message "Enter last name for alias 2" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 3" at the top of the page
  #   And I see the error message "Enter last name for alias 3" at the top of the page
  #   Then I see the error message "Enter last name for alias 4" at the top of the page

  # Scenario: AC10dii- negative: User adds data into Alias 4 - Last name, but does enter any data into First names
  #   When I select title "Mrs" from dropdown
  #   When I enter data into first names and last name in personal details screen
  #     | firstNames | John Smith |
  #     | lastName   | Astridge   |
  #   And I enter address line 1 "456 Lamburgh Street"
  #   When I select add aliases check box
  #   And I click the "Add another alias" button
  #   And I click the "Add another alias" button
  #   And I click the "Add another alias" button
  #   Then I set the "Alias 4", "Last name" to "Holland and Barrates"
  #   Then I click the "Return to account details" button
  #   Then I see the error message "Enter first name(s) for alias 1" at the top of the page
  #   And I see the error message "Enter last name for alias 1" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 2" at the top of the page
  #   And I see the error message "Enter last name for alias 2" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 3" at the top of the page
  #   And I see the error message "Enter last name for alias 3" at the top of the page
  #   Then I see the error message "Enter first name(s) for alias 4" at the top of the page


  Scenario: AC10e -negative: User does not add any data into either Alias 5 fields
    When I select "Mrs" from the "Title" dropdown
    When I enter data into first names and last name in personal details screen
      | firstNames | John Smith |
      | lastName   | Astridge   |
    And I enter "456 Lamburgh Street" into the "Address line 1" field
    When I select add aliases check box
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    Then I click the "Return to account details" button
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

  Scenario: AC10ei- negative: User adds data into Alias 5 - First names, but does enter any data into last name
    When I select "Mrs" from the "Title" dropdown
    When I enter data into first names and last name in personal details screen
      | firstNames | John Smith |
      | lastName   | Astridge   |
    And I enter "456 Lamburgh Street" into the "Address line 1" field
    When I select add aliases check box
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    Then I set the "Alias 5", "First names" to "Holland and Barrates"
    Then I click the "Return to account details" button
    Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    And I see the error message "Enter last name for alias 1" at the top of the page
    Then I see the error message "Enter first name(s) for alias 2" at the top of the page
    And I see the error message "Enter last name for alias 2" at the top of the page
    Then I see the error message "Enter first name(s) for alias 3" at the top of the page
    And I see the error message "Enter last name for alias 3" at the top of the page
    Then I see the error message "Enter first name(s) for alias 4" at the top of the page
    And I see the error message "Enter last name for alias 4" at the top of the page
    And I see the error message "Enter last name for alias 5" at the top of the page

  Scenario: AC10eii- negative: User adds data into Alias 5 - Last name, but does enter any data into First names
    When I select "Mrs" from the "Title" dropdown
    When I enter data into first names and last name in personal details screen
      | firstNames | John Smith |
      | lastName   | Astridge   |
    And I enter "456 Lamburgh Street" into the "Address line 1" field
    When I select add aliases check box
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    Then I set the "Alias 5", "Last name" to "Holland and Barrates"
    Then I click the "Return to account details" button
    Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    And I see the error message "Enter last name for alias 1" at the top of the page
    Then I see the error message "Enter first name(s) for alias 2" at the top of the page
    And I see the error message "Enter last name for alias 2" at the top of the page
    Then I see the error message "Enter first name(s) for alias 3" at the top of the page
    And I see the error message "Enter last name for alias 3" at the top of the page
    Then I see the error message "Enter first name(s) for alias 4" at the top of the page
    And I see the error message "Enter last name for alias 4" at the top of the page
    And I see the error message "Enter first name(s) for alias 5" at the top of the page

  Scenario Outline: AC11- Negative: Scenarios for National Insurance number field validation
    When I select "Mrs" from the "Title" dropdown
    When I enter data into first names and last name in personal details screen
      | firstNames | John Smith |
      | lastName   | Astridge   |
    And I enter "456 Lamburgh Street" into the "Address line 1" field
    When I enter "<NInumber>" into the "National Insurance number" field
    Then I click the "Return to account details" button

    Then I see "Personal details" on the page header
    #NINO validation has lessen so the error message has changed
    #Then I see the error message "Enter a National Insurance number that is 2 letters, 6 numbers, then A, B, C or D, like QQ 12 34 56 C" at the top of the page
    Then I see the error message "Enter a National Insurance number in the format AANNNNNNA" at the top of the page
    Examples:
      | NInumber      |
      | AB 12 34 45 6 |
      | 1234GH6       |

  Scenario: AC12- positive: When user amends all fields where validation fails (Mandatory fields)
    When I enter data into first names and last name in personal details screen
      | firstNames | Stuart Philips aarogyam Gucci Coach VII      |
      | lastName   | Chicago bulls Burberry Redbull 2345 PizzaHut |
    And I enter "<incorrectAddressLine1>" into the "Address Line 1" field

    Then I click the "Return to account details" button
    Then I see the error message "Select a title" at the top of the page
    Then I see the error message "The defendant's first name(s) must be 20 characters or fewer" at the top of the page
    Then I see the error message "The defendant's last name must be 30 characters or fewer" at the top of the page
    Then I see the error message "The address line 1 must not contain special characters" at the top of the page

    Then I see "Personal details" on the page header

    Then I select "<title>" from the "Title" dropdown
    And I enter "<firstNames>" into the "First names" field
    And I enter "<lastName>" into the "Last name" field
    And I enter "<addressLine1>" into the "Address line 1" field
    Then I click the "Return to account details" button
    Then I see "Account details" on the page header

    Then I click on the "Personal details" link
    Then I see "Personal details" on the page header

    And I see "<title>" selected in the "Title" dropdown
    And I see "<firstNames>" in the "First names" field
    And I see "<lastName>" in the "Last name" field
    And I see "<addressLine1>" in the "Address line 1" field

    Examples:
      | incorrectAddressLine1 | title | firstNames | lastName    | title | addressLine1 |
      | test Road *12         | Mr    | Coca Cola  | Cola Family | Mr    | Pepsi Road   |


  Scenario Outline: AC13-positive: When user enters data into mandatory fields only
    When I select "Mrs" from the "Title" dropdown
    When I enter data into first names and last name in personal details screen
      | firstNames | John Smith Michael             |
      | lastName   | Astridge Lamsden Langley Treen |
    And I enter "<addressLine1>" into the "Address line 1" field

    Then I click the "Return to account details" button
    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

    And I click on the "Personal details" link
    Then I see "Personal details" on the page header

    And I see "<title>" selected in the "Title" dropdown
    And I see "<firstNames>" in the "First names" field
    And I see "<lastName>" in the "Last name" field
    And I see "<addressLine1>" in the "Address line 1" field

    When I select add aliases check box
    Then I set the "Alias 1", "First names" to "<firstNames>"
    Then I set the "Alias 1", "Last name" to "<lastName>"

    Then I click the "Return to account details" button
    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

    And I click on the "Personal details" link
    Then I see "Personal details" on the page header
    #When I select add aliases check box
    And I see "Alias 1", "First names" is set to "<firstNames>"
    And I see "Alias 1", "Last name" is set to "<lastName>"

    Examples:
      | title | firstNames         | lastName                       | addressLine1        |
      | Mrs   | John Smith Michael | Astridge Lamsden Langley Treen | Alphine Colony Road |



  Scenario: AC14-negative: When user selects cancel button without entering any data into fields
    When "Cancel" is clicked
    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

