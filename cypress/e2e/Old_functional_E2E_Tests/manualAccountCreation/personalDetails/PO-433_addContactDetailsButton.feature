Feature: PO-433 Add contact details button on Personal details screen for Adult or youth only

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

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

    Then I see the "Defendant details" section heading
    And I see the "Personal details" link under the "Defendant details" section
    Then I see the status of "Personal details" is "Not provided"
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header

  Scenario: AC1-positive: A grey 'Add contact details' button will be introduced onto the Personal Details screen
    When "Add contact details" is verified as grey


  Scenario: AC2-negative: When user enters nothing on mandatory fields(title, firstNames, lastName & addressline1) and selecting add contact details button
    When I click the "Add contact details" button

    Then I see the error message "Select a title" at the top of the page
    Then I see the error message "Enter defendant's first name(s)" at the top of the page
    Then I see the error message "Enter defendant's last name" at the top of the page
    Then I see the error message "Enter address line 1, typically the building and street" at the top of the page

  Scenario:AC3-negative: If a user has not entered data into any mandatory fields but has entered data into one or more other optional fields, then selecting the 'Add contact details' button
    And I enter "AB12 7MH" into the "Postcode" field
    And I enter "Test's road, London" into the "Address line 2" field
    When I click the "Add contact details" button

    Then I see the error message "Select a title" at the top of the page
    Then I see the error message "Enter defendant's first name(s)" at the top of the page
    Then I see the error message "Enter defendant's last name" at the top of the page
    Then I see the error message "Enter address line 1, typically the building and street" at the top of the page

    # Scenario: AC4a-negative: When user ticks 'Add aliases' checkbox and not entered data into first names &last name in alias 1
    #     When I select title "Mr" from dropdown
    #     When I enter data into first names and last name in personal details screen
    #         | firstNames | John Smith Michael       |
    #         | lastName   | Astridge Lamsden Langley |
    #     When I select the "Add aliases" checkbox
    #     And I enter address line 1 "456 Lamburgh Street"

    #     Then I click the "Add contact details" button
    #     Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    #     Then I see the error message "Enter last name for alias 1" at the top of the page


    # Scenario: AC4ai-negative: When user ticks 'Add aliases' checkbox and not entered data into first names in alias 1
    #     When I select title "Miss" from dropdown
    #     When I enter data into first names and last name in personal details screen
    #         | firstNames | John Smith Michael       |
    #         | lastName   | Astridge Lamsden Langley |
    #     When I select the "Add aliases" checkbox
    #     Then I set the "Alias 1", "First names" to "Micheal Kores"
    #     And I enter address line 1 "456 Lamburgh Street"

    #     Then I click the "Add contact details" button
    #     Then I see the error message "Enter last name for alias 1" at the top of the page

    # Scenario: AC4aii-negative: When user ticks 'Add aliases' checkbox and not entered data into last name in alias 1
    #     When I select title "Mr" from dropdown
    #     When I enter data into first names and last name in personal details screen
    #         | firstNames | John Smith Michael       |
    #         | lastName   | Astridge Lamsden Langley |
    #     When I select the "Add aliases" checkbox
    #     Then I set the "Alias 1", "Last name" to "Micheal Kores"
    #     And I enter address line 1 "456 Lamburgh Street"

    #     Then I click the "Add contact details" button
    #     Then I see the error message "Enter first name(s) for alias 1" at the top of the page

    # Scenario: AC4b-negative: When user ticks 'Add aliases' checkbox and not entered data into first names & last name in alias 2
    #     When I select title "Mrs" from dropdown
    #     When I enter data into first names and last name in personal details screen
    #         | firstNames | John Smith Michael       |
    #         | lastName   | Astridge Lamsden Langley |
    #     When I select the "Add aliases" checkbox
    #     And I click the "Add another alias" button
    #     And I enter address line 1 "456 Lamburgh Street"

    #     Then I click the "Add contact details" button
    #     Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 1" at the top of the page
    #     Then I see the error message "Enter first name(s) for alias 2" at the top of the page
    #     And I see the error message "Enter last name for alias 2" at the top of the page

    # Scenario: AC4bi-negative: When user ticks 'Add aliases' checkbox and not entered data into first names in alias 2
    #     When I select title "Mr" from dropdown
    #     When I enter data into first names and last name in personal details screen
    #         | firstNames | John Smith Michael       |
    #         | lastName   | Astridge Lamsden Langley |
    #     When I select the "Add aliases" checkbox
    #     And I click the "Add another alias" button
    #     Then I set the "Alias 2", "First names" to "Micheal Kores"
    #     And I enter address line 1 "456 Lamburgh Street"

    #     Then I click the "Add contact details" button
    #     Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 1" at the top of the page
    #     Then I see the error message "Enter last name for alias 2" at the top of the page

    # Scenario: AC4bii-negative: When user ticks 'Add aliases' checkbox and not entered data into last name in alias 2
    #     When I select title "Miss" from dropdown
    #     When I enter data into first names and last name in personal details screen
    #         | firstNames | John Smith Michael       |
    #         | lastName   | Astridge Lamsden Langley |
    #     When I select the "Add aliases" checkbox
    #     And I click the "Add another alias" button
    #     Then I set the "Alias 2", "Last name" to "Micheal Kores"
    #     And I enter address line 1 "456 Lamburgh Street"

    #     Then I click the "Add contact details" button
    #     Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 1" at the top of the page
    #     And I see the error message "Enter first name(s) for alias 2" at the top of the page

    # Scenario: AC4c-negative: When user ticks 'Add aliases' checkbox and not entered data into first names & last name in alias 3
    #     When I select title "Miss" from dropdown
    #     When I enter data into first names and last name in personal details screen
    #         | firstNames | John Smith Michael       |
    #         | lastName   | Astridge Lamsden Langley |
    #     When I select the "Add aliases" checkbox
    #     And I click the "Add another alias" button
    #     And I click the "Add another alias" button
    #     And I enter address line 1 "456 Lamburgh Street"

    #     Then I click the "Add contact details" button

    #     Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 2" at the top of the page
    #     Then I see the error message "Enter first name(s) for alias 2" at the top of the page
    #     Then I see the error message "Enter first name(s) for alias 3" at the top of the page
    #     And I see the error message "Enter last name for alias 3" at the top of the page

    # Scenario: AC4ci-negative: When user ticks 'Add aliases' checkbox and not entered data into last name in alias 3
    #     When I select title "Mrs" from dropdown
    #     When I enter data into first names and last name in personal details screen
    #         | firstNames | John Smith Michael       |
    #         | lastName   | Astridge Lamsden Langley |
    #     When I select the "Add aliases" checkbox
    #     And I click the "Add another alias" button
    #     And I click the "Add another alias" button
    #     And I enter address line 1 "456 Lamburgh Street"

    #     Then I set the "Alias 3", "First names" to "Micheal Kores"
    #     Then I click the "Add contact details" button

    #     Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 2" at the top of the page
    #     Then I see the error message "Enter first name(s) for alias 2" at the top of the page
    #     And I see the error message "Enter last name for alias 3" at the top of the page

    # Scenario: AC4cii-negative: When user ticks 'Add aliases' checkbox and not entered data into first names in alias 3
    #     When I select title "Mrs" from dropdown
    #     When I enter data into first names and last name in personal details screen
    #         | firstNames | John Smith Michael       |
    #         | lastName   | Astridge Lamsden Langley |
    #     When I select the "Add aliases" checkbox
    #     And I click the "Add another alias" button
    #     And I click the "Add another alias" button
    #     And I enter address line 1 "456 Lamburgh Street"

    #     Then I set the "Alias 3", "Last name" to "Micheal Kores"
    #     Then I click the "Add contact details" button

    #     Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 2" at the top of the page
    #     Then I see the error message "Enter first name(s) for alias 2" at the top of the page
    #     And I see the error message "Enter first name(s) for alias 3" at the top of the page

    # Scenario: AC4d-negative: When user ticks 'Add aliases' checkbox and not entered data into first names and last name in alias 4
    #     When I select title "Mrs" from dropdown
    #     When I enter data into first names and last name in personal details screen
    #         | firstNames | John Smith Michael       |
    #         | lastName   | Astridge Lamsden Langley |
    #     When I select the "Add aliases" checkbox
    #     And I click the "Add another alias" button
    #     And I click the "Add another alias" button
    #     And I click the "Add another alias" button
    #     And I enter address line 1 "456 Lamburgh Street"

    #     Then I click the "Add contact details" button

    #     Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 2" at the top of the page
    #     Then I see the error message "Enter first name(s) for alias 2" at the top of the page
    #     And I see the error message "Enter first name(s) for alias 3" at the top of the page
    #     And I see the error message "Enter last name for alias 3" at the top of the page
    #     And I see the error message "Enter first name(s) for alias 4" at the top of the page
    #     And I see the error message "Enter last name for alias 4" at the top of the page

    # Scenario: AC4di-negative: When user ticks 'Add aliases' checkbox and not entered data into last name in alias 4
    #     When I select title "Mrs" from dropdown
    #     When I enter data into first names and last name in personal details screen
    #         | firstNames | John Smith Michael       |
    #         | lastName   | Astridge Lamsden Langley |
    #     When I select the "Add aliases" checkbox
    #     And I click the "Add another alias" button
    #     And I click the "Add another alias" button
    #     And I click the "Add another alias" button
    #     And I enter address line 1 "456 Lamburgh Street"

    #     Then I set the "Alias 4", "First names" to "Micheal Kores"
    #     Then I click the "Add contact details" button

    #     Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 1" at the top of the page
    #     And I see the error message "Enter last name for alias 2" at the top of the page
    #     Then I see the error message "Enter first name(s) for alias 2" at the top of the page
    #     And I see the error message "Enter first name(s) for alias 3" at the top of the page
    #     And I see the error message "Enter last name for alias 3" at the top of the page
    #     And I see the error message "Enter last name for alias 4" at the top of the page

    # Scenario: AC4dii-negative: When user ticks 'Add aliases' checkbox and not entered data into first names in alias 4
    When I select title "Mrs" from dropdown
    When I enter "John Smith Michael" into the "First names" field
    When I enter "Astridge Lamsden Langley" into the "Last name" field
    When I select the "Add aliases" checkbox
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I enter "456 Lamburgh Street" into the "Address line 1" field

    Then I set the "Alias 4", "Last name" to "Micheal Kores"
    Then I click the "Add contact details" button


    Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    And I see the error message "Enter last name for alias 1" at the top of the page
    And I see the error message "Enter last name for alias 2" at the top of the page
    Then I see the error message "Enter first name(s) for alias 2" at the top of the page
    And I see the error message "Enter first name(s) for alias 3" at the top of the page
    And I see the error message "Enter last name for alias 3" at the top of the page
    And I see the error message "Enter first name(s) for alias 4" at the top of the page

  Scenario: AC4e-negative: When user ticks 'Add aliases' checkbox and not entered data into first names and last name in alias 5
    When I select title "Ms" from dropdown
    When I enter "John Smith Michael" into the "First names" field
    When I enter "Astridge Lamsden Langley" into the "Last name" field
    When I select the "Add aliases" checkbox
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I enter "456 Lamburgh Street" into the "Address line 1" field

    Then I click the "Add contact details" button

    Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    And I see the error message "Enter last name for alias 1" at the top of the page
    And I see the error message "Enter last name for alias 2" at the top of the page
    Then I see the error message "Enter first name(s) for alias 2" at the top of the page
    And I see the error message "Enter first name(s) for alias 3" at the top of the page
    And I see the error message "Enter last name for alias 3" at the top of the page
    And I see the error message "Enter first name(s) for alias 4" at the top of the page
    And I see the error message "Enter last name for alias 4" at the top of the page
    And I see the error message "Enter first name(s) for alias 5" at the top of the page
    And I see the error message "Enter last name for alias 5" at the top of the page

  Scenario: AC4ei-negative: When user ticks 'Add aliases' checkbox and not entered data into last name in alias 5
    When I select title "Mrs" from dropdown
    When I enter "John Smith Michael" into the "First names" field
    When I enter "Astridge Lamsden Langley" into the "Last name" field
    When I select the "Add aliases" checkbox
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I enter "456 Lamburgh Street" into the "Address line 1" field

    Then I set the "Alias 5", "First names" to "Micheal Kores"
    Then I click the "Add contact details" button

    Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    And I see the error message "Enter last name for alias 1" at the top of the page
    And I see the error message "Enter last name for alias 2" at the top of the page
    Then I see the error message "Enter first name(s) for alias 2" at the top of the page
    And I see the error message "Enter first name(s) for alias 3" at the top of the page
    And I see the error message "Enter last name for alias 3" at the top of the page
    And I see the error message "Enter first name(s) for alias 4" at the top of the page
    And I see the error message "Enter last name for alias 4" at the top of the page
    And I see the error message "Enter last name for alias 5" at the top of the page

  Scenario: AC4eii-negative: When user ticks 'Add aliases' checkbox and not entered data into first names in alias 5
    When I select title "Mrs" from dropdown
    When I enter "John Smith Michael" into the "First names" field
    When I enter "Astridge Lamsden Langley" into the "Last name" field
    When I select the "Add aliases" checkbox
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I enter "456 Lamburgh Street" into the "Address line 1" field

    Then I set the "Alias 5", "Last name" to "Micheal Kores"
    Then I click the "Add contact details" button

    Then I see the error message "Enter first name(s) for alias 1" at the top of the page
    And I see the error message "Enter last name for alias 1" at the top of the page
    And I see the error message "Enter last name for alias 2" at the top of the page
    Then I see the error message "Enter first name(s) for alias 2" at the top of the page
    And I see the error message "Enter first name(s) for alias 3" at the top of the page
    And I see the error message "Enter last name for alias 3" at the top of the page
    And I see the error message "Enter first name(s) for alias 4" at the top of the page
    And I see the error message "Enter last name for alias 4" at the top of the page
    And I see the error message "Enter first name(s) for alias 5" at the top of the page

  Scenario Outline: AC5- Negative: Scenarios for National Insurance number field validation
    When I select title "Mrs" from dropdown
    When I enter "John Smith Michael" into the "First names" field
    When I enter "Astridge Lamsden Langley" into the "Last name" field
    And I enter "456 Lamburgh Street" into the "Address line 1" field
    When I enter "<incorrectNInumber>" into the "National Insurance number" field
    Then I click the "Add contact details" button

    Then I see "Personal details" on the page header
    Then I see the error message "Enter a National Insurance number in the format AANNNNNNA" at the top of the page
    Examples:
      | incorrectNInumber |
      | AB 12 34 45 6     |
      | 1234GH6           |
      | 1234567           |
      | ABCFER            |
      | ABCD1234          |

  Scenario Outline: AC6- positive: When user amends all fields where validation fails (Mandatory fields)
    When I enter "Stuart Philips aarogyam Gucci Coach VII" into the "First names" field
    When I enter "Chicago bulls Burberry Redbull 2345 PizzaHut" into the "Last name" field
    And I enter "test Road *12" into the "Address line 1" field

    Then I click the "Add contact details" button
    Then I see the error message "Select a title" at the top of the page
    Then I see the error message "The defendant's first name(s) must be 20 characters or fewer" at the top of the page
    Then I see the error message "The defendant's last name must be 30 characters or fewer" at the top of the page
    Then I see the error message "The address line 1 must not contain special characters" at the top of the page

    Then I see "Personal details" on the page header

    Then I select title "<title>" from dropdown
    And I enter "<updateFirstnames>" into the "First names" field
    And I enter "<updateLastname>" into the "Last name" field
    And I enter "<updateAddressline1>" into the "Address line 1" field

    Then I click the "Add contact details" button
    Then I see "Defendant contact details" on the page header
    And I click the "Return to account details" button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

    Then I see the status of "Personal details" is "Provided"

    Then I click on the "Personal details" link
    Then I see "Personal details" on the page header

    Then I see "<updateFirstnames>" in the "First names" field
    Then I see "<updateLastname>" in the "Last name" field
    Then I see "<updateAddressline1>" in the "Address line 1" field

    Examples:
      | title | updateFirstnames | updateLastname | updateAddressline1 |
      | Mr    | Coca Cola        | Cola Family    | Pepsi Road         |

  Scenario:AC7-positive: If a user has entered data into all mandatory fields and all validation is passed, then upon selecting the 'Add contact details' button
    When I select title "Mrs" from dropdown
    When I enter "Mary William VII" into the "First names" field
    When I enter "Chicago" into the "Last name" field
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

    And I enter "12 test's road" into the "Address line 1" field
    And I enter "London Road" into the "Address line 2" field
    And I enter "London city" into the "Address line 3" field
    And I enter "AB12 7MH" into the "Postcode" field

    And I enter "Ambassdor Volkswagen" into the "Make and model" field
    And I enter "AP28 AAR" into the "Registration number" field

    When I select the "Add aliases" checkbox

    Then I click the "Add contact details" button
    Then I see "Defendant contact details" on the page header

    And I click the "Return to account details" button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

    Then I see the status of "Personal details" is "Provided"

    Then I click on the "Personal details" link
    Then I see "Personal details" on the page header

    Then I see "Mary William VII" in the "First names" field
    Then I see "Chicago" in the "Last name" field
    Then I see "QQ 12 34 56 C" in the "National Insurance number" field
    Then I see "AB12 7MH" in the "Postcode" field
    Then I see "12 test's road" in the "Address line 1" field
    Then I see "London Road" in the "Address line 2" field
    Then I see "London city" in the "Address line 3" field
    Then I see "Ambassdor Volkswagen" in the "Make and model" field
    Then I see "AP28 AAR" in the "Registration number" field

    When I select the "Add aliases" checkbox

    Then I see "Alias 1", "First names" is set to ""
    Then I see "Alias 1", "Last name" is set to ""

    And I click the "Add another alias" button

    Then I see "Alias 2", "First names" is set to ""
    Then I see "Alias 2", "First names" is set to ""

    And I click the "Add another alias" button

    Then I see "Alias 3", "First names" is set to ""
    Then I see "Alias 3", "First names" is set to ""

    And I click the "Add another alias" button

    Then I see "Alias 4", "First names" is set to ""
    Then I see "Alias 4", "First names" is set to ""

    And I click the "Add another alias" button

    Then I see "Alias 5", "First names" is set to ""
    Then I see "Alias 5", "First names" is set to ""


  Scenario: AC8-negative: When user has selected the 'Cancel' button and has not entered any data, the status remain as 'Not Provided'
    When "Cancel" is clicked
    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    Then I see the status of "Personal details" is "Not provided"

  Scenario: AC8a-negative: When user has selected the 'Cancel' button and has entered data into some fields, then selects 'Ok' on the warning message
    When I select title "Ms" from dropdown
    When I enter "John Smith Michael" into the "First names" field
    When I enter "Astridge Lamsden Langley Treen" into the "Last name" field
    Then I click Cancel, a window pops up and I click Ok

  Scenario: AC8b-negative: When user has selected the 'Cancel' button and has entered data into some fields, then selects 'Ok' on the warning message
    When I select title "Ms" from dropdown
    When I enter "John Smith Michael" into the "First names" field
    When I enter "Astridge Lamsden Langley Treen" into the "Last name" field
    And I enter "12 test's road" into the "Address line 1" field

    Then I click the "Return to account details" button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

    Then I see the status of "Personal details" is "Provided"

    And I click on the "Personal details" link
    Then I see "Personal details" on the page header

    When "Cancel" is clicked
    Then I see the status of "Personal details" is "Provided"

  Scenario: AC9-positive: If the user unticks the 'Add aliases' tick box, after entering data in one or more fields
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

    When I select the "Add aliases" checkbox
    When I select the "Add aliases" checkbox

    Then I see "Alias 1", "First names" is set to ""
    Then I see "Alias 1", "Last name" is set to ""
