Feature: PO-358_Contact Details for adult or youth only


  Background:
    Given I am on the OPAL Frontend
    Then I see "Opal" in the header

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "London South" into the business unit search box

    When I select adults and youth only
    Then I click on continue button

    Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

    Then I click on "Contact details" link
    Then I see "Contact details" on the page header

  Scenario Outline: AC1, AC3, AC4- positive: verifying all the fields with maximum mo.of characters
    When I enter "<primaryEmail>" into the "Primary Email Address" field
    When I enter "<secondaryEmail>" into the "Secondary Email Address" field
    When I enter "<mobileTelephone>" into the "Mobile telephone number" field
    When I enter "<homeTelephone>" into the "Home telephone number" field
    When I enter "<businessTelephone>" into the "Business telephone number" field

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Account details" on the page header

    Then I click on "Contact details" link
    Then I see "Contact details" on the page header

    Then I see "<primaryEmail>" in the "Primary Email Address" field
    Then I see "<secondaryEmail>" in the "Secondary Email Address" field
    Then I see "<mobileTelephone>" in the "Mobile telephone number" field
    Then I see "<homeTelephone>" in the "Home telephone number" field
    Then I see "<businessTelephone>" in the "Business telephone number" field

    Examples:
      | primaryEmail                                                                 | secondaryEmail                                                            | mobileTelephone           | homeTelephone | businessTelephone |
      | testing_primary-email_for_contact-details-adult-or-youth123@adultoryouth.com | testing_secondary-email_for_contact-details-adult-or-youth123@test123.com | 0 7 7 0 0 9 0 0  9  8   2 | 01632 960 001 | 07700 900 982     |

  Scenario: AC2- positive: verifying if user doesn't enter any values and selecting retun to account details
    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Account details" on the page header

    Then I click on "Contact details" link
    Then I see "Contact details" on the page header

  Scenario: AC5-positive: when user enters primary & secondary email addresses in the correct format then user will be on Account details page
    When  I enter "<primaryEmail>" into the "Primary Email Address" field
    When I enter "<secondaryEmail>" into the "Secondary Email Address" field
    When I enter "<homeTelephone>" into the "Home telephone number" field

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Account details" on the page header

    Then I click on "Contact details" link
    Then I see "Contact details" on the page header

    Then I see "<primaryEmail>" in the "Primary Email Address" field
    Then I see "<secondaryEmail>" in the "Secondary Email Address" field
    Then I see "<homeTelephone>" in the "Home telephone number" field

    Examples:
      | primaryEmail                | secondaryEmail            | homeTelephone        |
      | testing@test.com            | john.smith@gmail.com      | 07216876870          |
      | maggi_1234-Parleg@gmail.com | PARKERg234_milk@gmail.com | 0 1 1   12   3333 44 |


  Scenario Outline: :AC6-negative: When user enters email addresses in incorrect format then user will be on the Contact details page
    When I enter "<incorrectPrimaryEmail>" into the "Primary Email Address" field
    When I enter "<incorrectSecondaryEmail>" into the "Secondary Email Address" field

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Contact details" on the page header

    Then I see the error message "Enter primary email address in the correct format like, name@example.com" at the top of the page
    Then I see the error message "Enter secondary email address in the correct format like, name@example.com" at the top of the page
    Then I see "Contact details" on the page header

    Examples:
      | incorrctPrimaryEmail          | incorrectSecondaryEmail                  |
      | maggi*1234.Parleg%$@gmail.com | milkbikis_milk- 4567:&234@rediffmail.com |

  Scenario Outline: :AC7-negative: When user enters telephone numbers in incorrect format then user will be on the Contact details page
    When I enter "<incorrectMobileNumber>" into the "Mobile telephone number" field
    When I enter "<incorrectHomeTelephone>" into the "Home telephone number" field
    When I enter "<incorrectBusinessTelephone>" into the "Business telephone number" field

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Contact details" on the page header

    #Then I verify the error message
    Then I see the error message "Enter a home telephone number, like 01632 960 001" at the top of the page
    Then I see the error message "Enter a business telephone number, like 01632 960 001 or 07700 900 982" at the top of the page
    Then I see the error message "Enter a mobile telephone number, like 07700 900 982" at the top of the page
    Then I see "Contact details" on the page header

    Examples:
      | incorrectMobileNumber | incorrectHomeTelephone | incorrectBusinessTelephone               |
      | 12345678902*$         | 123+ 566 987           | 0123 456                        79  8 89 |

  Scenario Outline: AC8-negative: When user enters incorrect data into all fields and amends the data will be on account details page
    When I enter "<incorrectPrimaryEmail>" into the "Primary Email Address" field
    When I enter "<incorrectSecondaryEmail>" into the "Secondary Email Address" field
    When I enter "<incorrectMobileNumber>" into the "Mobile telephone number" field
    When I enter "<incorrectHomeTelephone>" into the "Home telephone number" field
    When I enter "<incorrectBusinessTelephone>" into the "Business telephone number" field

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Contact details" on the page header

    #Then I verify the error message
    Then I see the error message "Enter primary email address in the correct format like, name@example.com" at the top of the page
    Then I see the error message "Enter secondary email address in the correct format like, name@example.com" at the top of the page
    Then I see the error message "Enter a home telephone number, like 01632 960 001" at the top of the page
    Then I see the error message "Enter a business telephone number, like 01632 960 001 or 07700 900 982" at the top of the page
    Then I see the error message "Enter a mobile telephone number, like 07700 900 982" at the top of the page
    Then I see "Contact details" on the page header

    When I enter "<updatePrimaryEmail>" into the "Primary Email Address" field
    When I enter "<updateSecondaryEmail>" into the "Secondary Email Address" field
    When I enter "<updateMobileNumber>" into the "Mobile telephone number" field
    When I enter "<updateHomeTelephone>" into the "Home telephone number" field
    When I enter "<updateBusinessTelephone>" into the "Business telephone number" field


    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "Return to account details" button
    Then I see "Account details" on the page header

    Then I click on "Contact details" link
    Then I see "Contact details" on the page header

    Then I see "<updatePrimaryEmail>" in the "Primary Email Address" field
    Then I see "<updateSecondaryEmail>" in the "Secondary Email Address" field
    Then I see "<updateHomeTelephone>" in the "Home telephone number" field
    Then I see "<updateMobileNumber>" in the "Mobile telephone number" field
    Then I see "<updateBusinessTelephone>" in the "Business telephone number" field
    Examples:
      | incorrectPrimaryEmail         | incorrectSecondaryEmail                  | incorrectMobileNumber | incorrectHomeTelephone | incorrectBusinessTelephone               | updatePrimaryEmail | updateSecondaryEmail | updateHomeTelephone | updateMobileNumber | updateBusinessTelephone |
      | maggi*1234.Parleg%$@gmail.com | milkbikis_milk- 4567:&234@rediffmail.com | 12345678902*$         | 123+ 566 987           | 0123 456                        79  8 89 | testing@test.com   | john.smith@gmail.com | 01669 345 678       | 01234 567 098      | 07216 876 870           |

  Scenario: AC9-negative: When user has not entered data into any fields and selecting cancel then user will be on Account details page
    Then "Cancel" is clicked
    Then I see "Account details" on the page header

  Scenario Outline: AC10a-negative: When user clicks on cancel after entering the data into field/fields then select ok on warning message
    When I enter "<primaryEmail>" into the "Primary Email Address" field
    When I enter "<homeTelephone>" into the "Home telephone number" field

    Then "Cancel" is clicked
    Then I select OK on the pop up window

    Then I see "Account details" on the page header
    Then I click on "Contact details" link
    Then I see "" in the "Primary Email Address" field
    Then I see "" in the "Home telephone number" field
    Examples:
      | primaryEmail               | homeTelephone |
      | test.badami@rediffmail.com | 01568 987 567 |

  Scenario Outline: AC10b-negative: When user clicks on cancel after entering the data into field/fields then select cancel the warning message
    When I enter "<primaryEmail>" into the "Primary Email Address" field
    When I enter "<homeTelephone>" into the "Home telephone number" field

    Then "Cancel" is clicked
    Then I select cancel on the pop up window

    Then I see "Account details" on the page header
    Then I click on "Contact details" link

    Then I see "" in the "Primary Email Address" field
    Then I see "" in the "Home telephone number" field
    Examples:
      | primaryEmail               | homeTelephone |
      | test.badami@rediffmail.com | 01568 987 567 |

