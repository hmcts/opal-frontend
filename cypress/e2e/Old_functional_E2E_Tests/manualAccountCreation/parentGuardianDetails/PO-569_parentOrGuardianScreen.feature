
Feature: PO-569 PO-652 PO_678 Updates to Parent or guardian details screen

  #Cancel link steps adding in this feature to save execution time (stpes added on AC6)


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

    Then I click on the "Parent or guardian details" link
    Then I see "Parent or guardian details" on the page header

  Scenario Outline: AC1, AC9, AC10- positive: veirfy first names & last name, address line 3 , vechicle details with maximum char limit
    When I enter "this is first names" into the "First names" field
    And I enter "checking Last name characters " into the "Last name" field

    And I enter "NE32 3QJ" into the "Address line 3" field
    And I enter "Vauchall Bently" into the "Make and model" field
    And I enter "AP17 BGR" into the "Registration number" field
    Then I click the "Return to account details" button

  Scenario: AC3, AC4, AC5- positive: If a user selects the 'Add Aliases' tick box and If a user selects 'Add another alias' for the first time and nth time so
    When I select the "Add aliases" checkbox
    Then I see the "Alias 1" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading

    When I select add another alias
    Then I see the "Alias 2" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading
    Then I see the "Remove" link below the "Alias 2", "Last name" input

    And I click the "Add another alias" button
    Then I see the "Alias 3" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading
    Then I see the "Remove" link below the "Alias 3", "Last name" input

    And I click the "Add another alias" button
    Then I see the "Alias 4" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading
    Then I see the "Remove" link below the "Alias 4", "Last name" input

    And I click the "Add another alias" button
    Then I see the "Alias 5" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading
    Then I see the "Remove" link below the "Alias 5", "Last name" input

  Scenario: AC6- positive: verifying the 'Remove' alias button work flow
    When I select the "Add aliases" checkbox
    Then I see the "Alias 1" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading

    And I click the "Add another alias" button
    Then I see the "Alias 2" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading

    And I click the "Add another alias" button
    Then I see the "Alias 3" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading

    And I click the "Add another alias" button
    Then I see the "Alias 4" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading

    And I click the "Add another alias" button
    Then I see the "Alias 5" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading
    Then I set the "Alias 5", "First names" to "First names in alias"
    Then I set the "Alias 5", "First names" to "First names in alias"

    Then I select "Remove" button
    Then I no longer see "Alias 5" sub heading

    Then I see the "Alias 4" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading
    Then I set the "Alias 4", "First names" to "First names in alias"
    Then I set the "Alias 4", "First names" to "First names in alias"

    Then I select "Remove" button
    Then I no longer see "Alias 4" sub heading

    Then I see the "Alias 3" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading
    Then I set the "Alias 3", "First names" to "First names in alias"
    Then I set the "Alias 3", "First names" to "First names in alias"

    Then I select "Remove" button
    Then I no longer see "Alias 3" sub heading

    Then I see the "Alias 2" sub heading in aliases
    Then I verify the text boxes "First names","Last name" below the sub heading
    Then I set the "Alias 2", "First names" to "First names in alias"
    Then I set the "Alias 2", "First names" to "First names in alias"

    Then I select "Remove" button
    Then I no longer see "Alias 2" sub heading
    Then I see the "Alias 1" sub heading in aliases

    #verifying cancel button which is developed on PO-652
    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I see "Account details" on the page header

  Scenario: AC7- positive: If the user unticks the 'Add aliases' tick box
    When I select the "Add aliases" checkbox
    Then I set the "Alias 1", "First names" to "First names in alias"
    And I set the "Alias 1", "Last name" to "Last name in aliases"

    Then I unselect the "Add aliases" checkbox
    Then I no longer see "Alias 1" sub heading

    When I select the "Add aliases" checkbox
    Then I see the "Alias 1" sub heading in aliases

    Then I see "Alias 1", "First names" is set to ""
    Then I see "Alias 1", "Last name" is set to ""

  Scenario: AC8a- negative: User ticks Add aliases box but does not input any data into Alias last name
    When I enter "this is first names" into the "First names" field
    And I enter "checking Last name characters " into the "Last name" field
    And I enter "15 test road" into the "Address line 1" field

    When I select the "Add aliases" checkbox
    Then I set the "Alias 1", "First names" to "Micheal Kores"
    And I click the "Add another alias" button
    Then I set the "Alias 2", "First names" to "Gucci Gucci "
    And I click the "Add another alias" button
    And I set the "Alias 3", "First names" to "Holland and Barrates"
    And I click the "Add another alias" button
    Then I set the "Alias 4", "First names" to "Holland and Barrates"
    And I click the "Add another alias" button
    Then I set the "Alias 5", "First names" to "Holland and Barrates"

    Then I click the "Return to account details" button

    And I see the error message "Enter last name for alias 1" at the top of the page
    And I see the error message "Enter last name for alias 2" at the top of the page
    Then I see the error message "Enter last name for alias 3" at the top of the page
    Then I see the error message "Enter last name for alias 4" at the top of the page
    And I see the error message "Enter last name for alias 5" at the top of the page

  Scenario: AC8b- negative: User ticks Add aliases box but does not input any data into Alias first names
    When I enter "this is first names" into the "First names" field
    And I enter "checking Last name characters " into the "Last name" field
    And I enter "15 test road" into the "Address line 1" field

    When I select the "Add aliases" checkbox
    Then I set the "Alias 1", "Last name" to "Micheal Kores"
    And I click the "Add another alias" button
    Then I set the "Alias 2", "Last name" to "Gucci Gucci "
    And I click the "Add another alias" button
    And I set the "Alias 3", "Last name" to "Holland and Barrates"
    And I click the "Add another alias" button
    Then I set the "Alias 4", "Last name" to "Holland and Barrates"
    And I click the "Add another alias" button
    Then I set the "Alias 5", "Last name" to "Holland and Barrates"

    Then I click the "Return to account details" button

    And I see the error message "Enter first name(s) for alias 1" at the top of the page
    And I see the error message "Enter first name(s) for alias 2" at the top of the page
    Then I see the error message "Enter first name(s) for alias 3" at the top of the page
    Then I see the error message "Enter first name(s) for alias 4" at the top of the page
    And I see the error message "Enter first name(s) for alias 5" at the top of the page


  Scenario: AC8c,AC2- negative: User ticks Add aliases box but does not input any data into any fields
    When I select the "Add aliases" checkbox
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button

    When I click the "<returnButton>" button

    Then I see the error message "Enter parent or guardian's first name(s)" at the top of the page
    And I see the error message "Enter parent or guardian's last name" at the top of the page
    And I see the error message "Enter address line 1, typically the building and street" at the top of the page

    And I see the error message "Enter last name for alias 1" at the top of the page
    And I see the error message "Enter last name for alias 2" at the top of the page
    Then I see the error message "Enter last name for alias 3" at the top of the page
    Then I see the error message "Enter last name for alias 4" at the top of the page
    And I see the error message "Enter last name for alias 5" at the top of the page
    And I see the error message "Enter first name(s) for alias 1" at the top of the page
    And I see the error message "Enter first name(s) for alias 2" at the top of the page
    Then I see the error message "Enter first name(s) for alias 3" at the top of the page
    Then I see the error message "Enter first name(s) for alias 4" at the top of the page
    And I see the error message "Enter first name(s) for alias 5" at the top of the page

    Examples:
      | returnButton              |
      | Return to account details |
      | Add contact details       |

  Scenario: negative: Verifying all the fields with more than maximum length
    When I enter "this is to verify first names" into the "First names" field
    And I enter "checking Last name characters in the field" into the "Last name" field

    When I select the "Add aliases" checkbox
    Then I set the "Alias 1", "First names" to "Checking Alias1 first names"
    Then I set the "Alias 1", "Last name" to "Checking alias1 maximum characters in last name"
    And I click the "Add another alias" button
    Then I set the "Alias 2", "First names" to "Checking Alias2 first names"
    Then I set the "Alias 2", "Last name" to "Checking alias2 maximum characters in last name"
    And I click the "Add another alias" button
    Then I set the "Alias 3", "First names" to "Checking Alias3 first names"
    Then I set the "Alias 3", "Last name" to "Checking alias3 maximum characters in last name"
    And I click the "Add another alias" button
    Then I set the "Alias 4", "First names" to "Checking Alias4 first names"
    Then I set the "Alias 4", "Last name" to "Checking alias4 maximum characters in last name"
    And I click the "Add another alias" button
    Then I set the "Alias 5", "First names" to "Checking Alias5 first names"
    Then I set the "Alias 5", "Last name" to "Checking alias5 maximum characters in last name"

    And I enter "12 Test road Newcastle Upon Tyne" into the "Address line 1" field
    And I enter "address line 2 Newcastle Upon tyne" into the "Address line 2" field
    And I enter "NE32 3QJ Newcastle Upon Tyne" into the "Address line 3" field
    Then I click the "Return to account details" button

    Then I see the error message "The parent or guardian's first name(s) must be 20 characters or fewer" at the top of the page
    And I see the error message "The parent or guardian's last name must be 30 characters or fewer" at the top of the page
    And I see the error message "The first name(s) must be 20 characters or fewer for alias 1" at the top of the page
    And I see the error message "The last name must be 30 characters or fewer for alias 1" at the top of the page
    And I see the error message "The first name(s) must be 20 characters or fewer for alias 2" at the top of the page
    And I see the error message "The last name must be 30 characters or fewer for alias 2" at the top of the page
    And I see the error message "The first name(s) must be 20 characters or fewer for alias 3" at the top of the page
    And I see the error message "The last name must be 30 characters or fewer for alias 3" at the top of the page
    And I see the error message "The first name(s) must be 20 characters or fewer for alias 4" at the top of the page
    And I see the error message "The last name must be 30 characters or fewer for alias 4" at the top of the page
    And I see the error message "The first name(s) must be 20 characters or fewer for alias 5" at the top of the page
    And I see the error message "The last name must be 30 characters or fewer for alias 5" at the top of the page
    And I see the error message "The address line 1 must be 25 characters or fewer" at the top of the page
    And I see the error message "The address line 2 must be 25 characters or fewer" at the top of the page
    And I see the error message "The address line 3 must be 13 characters or fewer" at the top of the page

  #PO-678 AC's
  Scenario: AC1, AC2,AC3 - positive: verifying sub headings and maximum characters of address line 1 & 2
    When I see "Include their middle names" under the "First names" field
    When I enter "this is first names" into the "First names" field
    And I enter "checking Last name characters" into the "Last name" field
    And I enter "address line 1 Newcastle" into the "Address line 1" field
    And I enter "address line 2 Newcastle" into the "Address line 2" field

    And I see "Parent or guardian address" above the "Address line 1" field
    And I see "Parent or guardian vehicle details" above the "Make and model" field
    Then I click the "Return to account details" button



