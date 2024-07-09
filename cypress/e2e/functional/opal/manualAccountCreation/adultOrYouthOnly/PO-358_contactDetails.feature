Feature: PO-358 & PO-419 Contact Details for adult or youth only


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
    Then I see the status of "Contact details" as "Not provided"

    Then I click on "Contact details" link
    Then I see "Contact details" on the page header

  Scenario Outline: AC1(419 & 358), AC3, AC4(419 & 358)AC5(419)- positive: verifying all the fields with maximum mo.of characters in all fields and spaces in telephone numbers
    When I enter "<primaryEmail>" into "Primary Email Address"
    When I enter "<secondaryEmail>" into "Secondary Email Address"
    When I enter "<mobileTelephone>" into "Mobile telephone number"
    When I enter "<homeTelephone>" into "Home telephone number"
    When I enter "<workTelephone>" into "Work telephone number"

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "<returnPageButton>" button and see "<pageHeader>" on the page header
    And I see the status of "Contact details" as "Provided"

    Then I click on "Contact details" link
    Then I see "Contact details" on the page header

    Then I see "<primaryEmail>" value on "Primary Email Address" field
    Then I see "<secondaryEmail>" value on "Secondary Email Address" field
    Then I see "<mobileTelephone>" value on "Mobile telephone number" field
    Then I see "<homeTelephone>" value on "Home telephone number" field
    Then I see "<workTelephone>" value on "Work telephone number" field

    Examples:
      | primaryEmail                                                                 | secondaryEmail                                                            | mobileTelephone                     | homeTelephone                       | workTelephone                       | returnPageButton          | pageHeader       |
      | testing_primary-email_for_contact-details-adult-or-youth123@adultoryouth.com | testing_secondary-email_for_contact-details-adult-or-youth123@test123.com | 0  7  7  0  0  9   0  0    9  8   2 | 0  1  6  3   2  9   6   0   0  0  1 | 0  7  7  0   0   9  0   0   9  8  2 | Return to account details | Account details  |
      | testing_primary-email_for_contact-details-adult-or-youth123@adultoryouth.com | testing_secondary-email_for_contact-details-adult-or-youth123@test123.com | 0  7  7  0  0  9   0  0    9  8   2 | 0  1  6  3   2  9   6   0   0  0  1 | 0  7  7  0   0   9  0   0   9  8  2 | Add employer details      | Employer details |

  Scenario: AC2- positive: verifying if user doesn't enter any values and selecting retun to account details/Add employer details button
    #covering AC2 & AC3 in PO-419
    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "<retunPageButton>" button and see "<pageHeader>" on the page header

    Then I click on "Contact details" link
    Then I see "Contact details" on the page header
    Examples:
      | retunPageButton           | pageHeader       |
      | Return to account details | Account details  |
      | Add employer details      | Employer details |

  Scenario: AC5(PO-358) AC6(PO-419)-positive: when user enters primary & secondary email addresses in the correct format then user will be on Account details page
    When I enter "<primaryEmail>" into "Primary Email Address"
    When I enter "<secondaryEmail>" into "Secondary Email Address"
    When I enter "<homeTelephone>" into "Home telephone number"

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "<retunPageButton>" button and see "<pageHeader>" on the page header
    Then I see "Account details" on the page header

    Then I click on "Contact details" link
    Then I see "Contact details" on the page header

    Then I see "<primaryEmail>" value on "Primary Email Address" field
    Then I see "<secondaryEmail>" value on "Secondary Email Address" field
    Then I see "<homeTelephone>" value on "Home telephone number" field
    Examples:
      | primaryEmail                | secondaryEmail            | homeTelephone        | retunPageButton           | pageHeader       |
      | testing@test.com            | john.smith@gmail.com      | 07216876870          | Return to account details | Account details  |
      | maggi_1234-Parleg@gmail.com | PARKERg234_milk@gmail.com | 0 1 1   12   3333 44 | Add employer details      | Employer details |


  Scenario Outline: :AC6(358) AC7(419)-negative: When user enters email addresses in incorrect format then user will be on the Contact details page
    When I enter "<primaryEmail>" into "Primary Email Address"
    When I enter "<secondaryEmail>" into "Secondary Email Address"

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "<returnPageButton>" button
    Then I see "Contact details" on the page header

    Then I see the error message "Enter primary email address in the correct format like, name@example.com" at the top of the page
    Then I see the error message "Enter secondary email address in the correct format like, name@example.com" at the top of the page

    Then I see "Contact details" on the page header

    Examples:
      | incorrectPrimaryEmail         | incorrectSecondaryEmail                  | returnPageButton          |
      | maggi*1234.Parleg%$@gmail.com | milkbikis_milk- 4567:&234@rediffmail.com | Return to account details |
      | maggi*1234.Parleg%$@gmail.com | milkbikis_milk- 4567:&234@rediffmail.com | Add employer details      |


  Scenario Outline: :AC7(358)AC8(PO-419)-negative: When user enters telephone numbers in incorrect format then user will be on the Contact details page
    When I enter "<incorrectMobileNumber>" into "Mobile telephone number"
    When I enter "<incorrectHomeTelephone>" into "Home telephone number"
    When I enter "<incorrectWorkTelephone>" into "Work telephone number"

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "<returnPageButton>" button
    Then I see "Contact details" on the page header

    Then I see the error message "Enter a home telephone number, like 01632 960 001" at the top of the page
    Then I see the error message "Enter a work telephone number, like 01632 960 001 or 07700 900 982" at the top of the page
    Then I see the error message "Enter a mobile telephone number, like 07700 900 982" at the top of the page
    Then I see "Contact details" on the page header

    Examples:
      | incorrectMobileNumber | incorrectHomeTelephone | incorrectWorkTelephone                   | returnPageButton          |
      | 12345678902*$         | 123+ 566 987           | 0123 456                        79  8 89 | Return to account details |
      | 12345678902*$         | 123+ 566 987           | 0123 456                        79  8 89 | Add employer details      |

  Scenario Outline: AC8(358)AC9(419)-negative: When user enters incorrect data into all fields and amends the data will be on account details page
    When I enter "<incorrectPrimaryEmail>" into "Primary Email Address"
    When I enter "<incorrectSecondaryEmail>" into "Secondary Email Address"
    When I enter "<incorrectMobileNumber>" into "Mobile telephone number"
    When I enter "<incorrectHomeTelephone>" into "Home telephone number"
    When I enter "<incorrectWorkTelephone>" into "Work telephone number"

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "<returnPageButton>" button
    Then I see "Contact details" on the page header

    Then I see the error message "Enter primary email address in the correct format like, name@example.com" at the top of the page
    Then I see the error message "Enter secondary email address in the correct format like, name@example.com" at the top of the page
    Then I see the error message "Enter a home telephone number, like 01632 960 001" at the top of the page
    Then I see the error message "Enter a work telephone number, like 01632 960 001 or 07700 900 982" at the top of the page
    Then I see the error message "Enter a mobile telephone number, like 07700 900 982" at the top of the page
    Then I see "Contact details" on the page header

    When I enter "<updatePrimaryEmail>" into "Primary Email Address"
    When I enter "<updateSecondaryEmail>" into "Secondary Email Address"
    When I enter "<updateMobileTelephone>" into "Mobile telephone number"
    When I enter "<updateHomeTelephone>" into "Home telephone number"
    When I enter "<updateWorkTelephone>" into "Work telephone number"

    # Due to changes in PO-360
    #Then I click save and return to tasks
    Then I click the "<returnPageButton>" button and and see "<pageHeader>" on the page header

    Then I click on "Contact details" link
    Then I see "Contact details" on the page header

    Then I see "<updatePrimaryEmail>" value on "Primary Email Address" field
    Then I see "<updateSecondaryEmail>" value on "Secondary Email Address" field
    Then I see "<updateMobileTelephone>" value on "Mobile telephone number" field
    Then I see "<updateHomeTelephone>" value on "Home telephone number" field
    Then I see "<updateWorkTelephone>" value on "Work telephone number" field

    Examples:
      | incorrectPrimaryEmail         | incorrectSecondaryEmail                  | incorrectMobileNumber | incorrectHomeTelephone | incorrectWorkTelephone                       | updatePrimaryEmail | updateSecondaryEmail | updateHomeTelephone | updateMobileTelephone | updateWorkTelephone | returnPageButton          |
      | maggi*1234.Parleg%$@gmail.com | milkbikis_milk- 4567:&234@rediffmail.com | 12345678902*$         | 123+ 566 987           | 0123     456                        79  8 89 | testing@test.com   | john.smith@gmail.com | 01669 345 678       | 01234 567 098         | 07216 876 870       | Return to account details |
      | maggi*1234.Parleg%$@gmail.com | milkbikis_milk- 4567:&234@rediffmail.com | 12345678902*$         | 123+ 566 987           | 0123 456                        79  8 89     | testing@test.com   | john.smith@gmail.com | 01669 345 678       | 01234 567 098         | 07216 876 870       | Add employer details      |


  Scenario: AC9(358) AC10(419)-negative: When user has not entered data into any fields and selecting cancel then user will be on Account details page
    Then "Cancel" is clicked
    Then I see "Account details" on the page header

  Scenario Outline: AC10a(358)AC11a(419)-negative: When user clicks on cancel after entering the data into field/fields then select ok on warning message
    When I enter "<primaryEmail>" into "Primary Email Address"
    When I enter "<homeTelephone>" into "Home telephone number"

    Then "Cancel" is clicked
    Then I select OK on the pop up window

    Then I see "Account details" on the page header
    Then I click on "Contact details" link
    Then I see "" value on "Primary Email Address" field
    Then I see "" value on "Home telephone number" field
    Examples:
      | primaryEmail               | homeTelephone |
      | test.badami@rediffmail.com | 01568 987 567 |

  Scenario Outline: AC10b(358)AC11b(419)-negative: When user clicks on cancel after entering the data into field/fields then select cancel the warning message
    When I enter "<primaryEmail>" into "Primary Email Address"
    When I enter "<homeTelephone>" into "Home telephone number"

    Then "Cancel" is clicked
    Then I select cancel on the pop up window

    Then I see "Account details" on the page header
    Then I click on "Contact details" link
    Then I see "" value on "Primary Email Address" field
    Then I see "" value on "Home telephone number" field
    Examples:
      | primaryEmail               | homeTelephone |
      | test.badami@rediffmail.com | 01568 987 567 |

