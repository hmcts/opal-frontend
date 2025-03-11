Feature: PO-371 Contact Details for company
  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box

    And I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    And I see "Account details" on the page header
    And I see the status of "Contact details" is "Not provided"

    When I click on the "Contact details" link
    Then I see "Defendant contact details" on the page header

  Scenario Outline: AC1,3,4,5,6 - contact details - 'Return to account details' Happy path
    When I enter "<primaryEmail>" into the "Primary email address" field
    And I enter "<secondaryEmail>" into the "Secondary email address" field
    And I enter "<mobileTelephone>" into the "Mobile telephone number" field
    And I enter "<homeTelephone>" into the "Home telephone number" field
    And I enter "<workTelephone>" into the "Work telephone number" field

    When I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Contact details" is "Provided"

    Then I click on the "Contact details" link
    And I see "Defendant contact details" on the page header

    And I see "<primaryEmail>" in the "Primary email address" field
    And I see "<secondaryEmail>" in the "Secondary email address" field
    And I see "<mobileTelephone>" in the "Mobile telephone number" field
    And I see "<homeTelephone>" in the "Home telephone number" field
    And I see "<workTelephone>" in the "Work telephone number" field

    Examples:
      | primaryEmail          | secondaryEmail          | mobileTelephone | homeTelephone | workTelephone  |
      | primaryEmail@test.com | secondaryEmail@test.com | 07 700 900 982  | 01632 960 001 | 07 700 900 982 |

  Scenario Outline: AC1,3,4,5,6 - contact details - 'Add offence details' Happy path
    When I enter "<primaryEmail>" into the "Primary email address" field
    And I enter "<secondaryEmail>" into the "Secondary email address" field
    And I enter "<mobileTelephone>" into the "Mobile telephone number" field
    And I enter "<homeTelephone>" into the "Home telephone number" field
    And I enter "<workTelephone>" into the "Work telephone number" field

    When I click the "Add offence details" button
    Then I see "Add an offence" on the page header

    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I see the status of "Contact details" is "Provided"

    Then I click on the "Contact details" link
    And I see "Defendant contact details" on the page header

    And I see "<primaryEmail>" in the "Primary email address" field
    And I see "<secondaryEmail>" in the "Secondary email address" field
    And I see "<mobileTelephone>" in the "Mobile telephone number" field
    And I see "<homeTelephone>" in the "Home telephone number" field
    And I see "<workTelephone>" in the "Work telephone number" field

    Examples:
      | primaryEmail          | secondaryEmail          | mobileTelephone | homeTelephone | workTelephone  |
      | primaryEmail@test.com | secondaryEmail@test.com | 07 700 900 982  | 01632 960 001 | 07 700 900 982 |

  Scenario: AC2 - contact details - 'Return to account details' Happy path - No data entered
    And I see "" in the "Primary email address" field
    And I see "" in the "Secondary email address" field
    And I see "" in the "Mobile telephone number" field
    And I see "" in the "Home telephone number" field
    And I see "" in the "Work telephone number" field

    When I click the "Add offence details" button
    Then I see "Add an offence" on the page header

    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I see the status of "Contact details" is "Not provided"

  Scenario: AC2 - contact details - 'Add offence details' Happy path - No data entered
    And I see "" in the "Primary email address" field
    And I see "" in the "Secondary email address" field
    And I see "" in the "Mobile telephone number" field
    And I see "" in the "Home telephone number" field
    And I see "" in the "Work telephone number" field

    When I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Contact details" is "Not provided"

  Scenario Outline: AC7,8,9 - Negative test contact details - validation - 'Return to account details'
    When I enter "<incorrectPrimaryEmail>" into the "Primary email address" field
    And I enter "<incorrectSecondaryEmail>" into the "Secondary email address" field
    And I enter "<incorrectMobileNumber>" into the "Mobile telephone number" field
    And I enter "<incorrectHomeTelephone>" into the "Home telephone number" field
    And I enter "<incorrectWorkTelephone>" into the "Work telephone number" field

    When I click the "Return to account details" button

    Then I see the error message "The primary email address must be 76 characters or fewer" at the top of the page
    And I see the error message "Enter secondary email address in the correct format like, name@example.com" at the top of the page
    And I see the error message "Enter a home telephone number, like 01632 960 001" at the top of the page
    And I see the error message "Enter a work telephone number, like 01632 960 001 or 07700 900 982" at the top of the page
    And I see the error message "Enter a mobile telephone number, like 07700 900 982" at the top of the page

    And I see the error message "The primary email address must be 76 characters or fewer" above the "Primary email address" field
    And I see the error message "Enter secondary email address in the correct format like, name@example.com" above the "Secondary email address" field
    And I see the error message "Enter a home telephone number, like 01632 960 001" above the "Home telephone number" field
    And I see the error message "Enter a work telephone number, like 01632 960 001 or 07700 900 982" above the "Work telephone number" field
    And I see the error message "Enter a mobile telephone number, like 07700 900 982" above the "Mobile telephone number" field

    When I enter "<correctPrimaryEmail>" into the "Primary email address" field
    And I enter "<correctSecondaryEmail>" into the "Secondary email address" field
    And I enter "<correctMobileTelephone>" into the "Mobile telephone number" field
    And I enter "<correctHomeTelephone>" into the "Home telephone number" field
    And I enter "<correctWorkTelephone>" into the "Work telephone number" field

    And I click the "Return to account details" button

    Then I see "Account details" on the page header
    And I see the status of "Contact details" is "Provided"
    Then I click on the "Contact details" link
    And I see "<correctPrimaryEmail>" in the "Primary email address" field
    And I see "<correctSecondaryEmail>" in the "Secondary email address" field
    And I see "<correctMobileTelephone>" in the "Mobile telephone number" field
    And I see "<correctHomeTelephone>" in the "Home telephone number" field
    And I see "<correctWorkTelephone>" in the "Work telephone number" field

    Examples:
      | correctPrimaryEmail                                                          | correctSecondaryEmail   | correctMobileTelephone | correctHomeTelephone | correctWorkTelephone | incorrectPrimaryEmail                                                         | incorrectSecondaryEmail | incorrectMobileTelephone | incorrectHomeTelephone | incorrectWorkTelephone |
      | primaryEmailtesttesttesttesttesttesttesttesttesttesttesttesttest123@test.com | secondaryEmail@test.com | 07 700 900 982         | 01632 960 001        | 07 700 900 982       | primaryEmailtesttesttesttesttesttesttesttesttesttesttesttesttest1234@test.com | secondaryEmailtest.com  | 07 700 900 abc           | 01632 960 abc          | 07 700 900 abc 123     |

  Scenario Outline: AC7,8,9 - Negative test contact details - validation - 'Add offence details'
    When I enter "<incorrectPrimaryEmail>" into the "Primary email address" field
    And I enter "<incorrectSecondaryEmail>" into the "Secondary email address" field
    And I enter "<incorrectMobileNumber>" into the "Mobile telephone number" field
    And I enter "<incorrectHomeTelephone>" into the "Home telephone number" field
    And I enter "<incorrectWorkTelephone>" into the "Work telephone number" field

    When I click the "Add offence details" button

    Then I see the error message "The primary email address must be 76 characters or fewer" at the top of the page
    And I see the error message "Enter secondary email address in the correct format like, name@example.com" at the top of the page
    And I see the error message "Enter a home telephone number, like 01632 960 001" at the top of the page
    And I see the error message "Enter a work telephone number, like 01632 960 001 or 07700 900 982" at the top of the page
    And I see the error message "Enter a mobile telephone number, like 07700 900 982" at the top of the page

    And I see the error message "The primary email address must be 76 characters or fewer" above the "Primary email address" field
    And I see the error message "Enter secondary email address in the correct format like, name@example.com" above the "Secondary email address" field
    And I see the error message "Enter a home telephone number, like 01632 960 001" above the "Home telephone number" field
    And I see the error message "Enter a work telephone number, like 01632 960 001 or 07700 900 982" above the "Work telephone number" field
    And I see the error message "Enter a mobile telephone number, like 07700 900 982" above the "Mobile telephone number" field

    When I enter "<correctPrimaryEmail>" into the "Primary email address" field
    And I enter "<correctSecondaryEmail>" into the "Secondary email address" field
    And I enter "<correctMobileTelephone>" into the "Mobile telephone number" field
    And I enter "<correctHomeTelephone>" into the "Home telephone number" field
    And I enter "<correctWorkTelephone>" into the "Work telephone number" field

    When I click the "Add offence details" button
    Then I see "Add an offence" on the page header

    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I see the status of "Contact details" is "Provided"

    Examples:
      | correctPrimaryEmail                                                          | correctSecondaryEmail   | correctMobileTelephone | correctHomeTelephone | correctWorkTelephone | incorrectPrimaryEmail                                                         | incorrectSecondaryEmail | incorrectMobileTelephone | incorrectHomeTelephone | incorrectWorkTelephone |
      | primaryEmailtesttesttesttesttesttesttesttesttesttesttesttesttest123@test.com | secondaryEmail@test.com | 07 700 900 982         | 01632 960 001        | 07 700 900 982       | primaryEmailtesttesttesttesttesttesttesttesttesttesttesttesttest1234@test.com | secondaryEmailtest.com  | 07 700 900 abc           | 01632 960 abc          | 07 700 900 abc 123     |

  Scenario: AC10 - contact details - 'Cancel' - no data entered
    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I see the status of "Contact details" is "Not provided"

  Scenario Outline: AC11 - contact details - 'Cancel' - data entered - 'OK' clicked
    When I enter "<primaryEmail>" into the "Primary email address" field
    And I enter "<secondaryEmail>" into the "Secondary email address" field
    And I enter "<mobileTelephone>" into the "Mobile telephone number" field
    And I enter "<homeTelephone>" into the "Home telephone number" field
    And I enter "<workTelephone>" into the "Work telephone number" field

    And I click Cancel, a window pops up and I click Ok
    Then I see "Account details" on the page header
    And I see the status of "Contact details" is "Not provided"

    When I click on the "Contact details" link
    Then I see "Defendant contact details" on the page header
    And I see "" in the "Primary email address" field
    And I see "" in the "Secondary email address" field
    And I see "" in the "Mobile telephone number" field
    And I see "" in the "Home telephone number" field
    And I see "" in the "Work telephone number" field


    Examples:
      | primaryEmail          | secondaryEmail          | mobileTelephone | homeTelephone | workTelephone  |
      | primaryEmail@test.com | secondaryEmail@test.com | 07 700 900 982  | 01632 960 001 | 07 700 900 982 |

  Scenario Outline: AC11 - contact details - 'Cancel' - data entered - 'Cancel' clicked
    When I enter "<primaryEmail>" into the "Primary email address" field
    And I enter "<secondaryEmail>" into the "Secondary email address" field
    And I enter "<mobileTelephone>" into the "Mobile telephone number" field
    And I enter "<homeTelephone>" into the "Home telephone number" field
    And I enter "<workTelephone>" into the "Work telephone number" field

    And I click Cancel, a window pops up and I click Cancel
    Then I see "Defendant contact details" on the page header

    And I see "<primaryEmail>" in the "Primary email address" field
    And I see "<secondaryEmail>" in the "Secondary email address" field
    And I see "<mobileTelephone>" in the "Mobile telephone number" field
    And I see "<homeTelephone>" in the "Home telephone number" field
    And I see "<workTelephone>" in the "Work telephone number" field

    Examples:
      | primaryEmail          | secondaryEmail          | mobileTelephone | homeTelephone | workTelephone  |
      | primaryEmail@test.com | secondaryEmail@test.com | 07 700 900 982  | 01632 960 001 | 07 700 900 982 |

  Scenario Outline: AC11 - negative test - contact details - 'Cancel' - data entered - 'Cancel' clicked
    When I enter "<primaryEmail>" into the "Primary email address" field
    And I enter "<secondaryEmail>" into the "Secondary email address" field
    And I enter "<mobileTelephone>" into the "Mobile telephone number" field
    And I enter "<homeTelephone>" into the "Home telephone number" field
    And I enter "<workTelephone>" into the "Work telephone number" field

    When I click the "Return to account details" button
    And I click Cancel, a window pops up and I click Cancel
    Then I see "Defendant contact details" on the page header

    Then I see the error message "Enter primary email address in the correct format like, name@example.com" at the top of the page
    And I see the error message "Enter a mobile telephone number, like 07700 900 982" at the top of the page

    And I see the error message "Enter primary email address in the correct format like, name@example.com" above the "Primary email address" field
    And I see the error message "Enter a mobile telephone number, like 07700 900 982" above the "Mobile telephone number" field


    And I see "<primaryEmail>" in the "Primary email address" field
    And I see "<secondaryEmail>" in the "Secondary email address" field
    And I see "<mobileTelephone>" in the "Mobile telephone number" field
    And I see "<homeTelephone>" in the "Home telephone number" field
    And I see "<workTelephone>" in the "Work telephone number" field

    Then I see the error message "Enter primary email address in the correct format like, name@example.com" at the top of the page
    And I see the error message "Enter a mobile telephone number, like 07700 900 982" at the top of the page

    And I see the error message "Enter primary email address in the correct format like, name@example.com" above the "Primary email address" field
    And I see the error message "Enter a mobile telephone number, like 07700 900 982" above the "Mobile telephone number" field


    Examples:
      | primaryEmail         | secondaryEmail          | mobileTelephone | homeTelephone | workTelephone  |
      | primaryEmailtest.com | secondaryEmail@test.com | 07 700 900 abc  | 01632 960 001 | 07 700 900 982 |
