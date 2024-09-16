Feature: PO-358 Contact Details for adult or youth only
Descoped, superceeded by:
https://tools.hmcts.net/jira/browse/PO-370
https://tools.hmcts.net/jira/browse/PO-371
https://tools.hmcts.net/jira/browse/PO-419
# #This feature file needs tyding up / splitting appropriately for PO-358 & PO-419

# Background:
#   Given I am on the OPAL Frontend
#   Then I see "Opal" in the header

#   When I sign in as "opal-test@HMCTS.NET"
#   Then I am on the dashboard
#   When I navigate to Manual Account Creation

#   #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
#   Then I see "Business unit and defendant type" on the page header
#   And I enter "West London" into the business unit search box

#   When I select adults and youth only
#   Then I click on continue button

#   #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
#   Then I see "Account details" on the page header
#   Then I see the status of "Contact details" is "Not provided"

#   Then I click on the "Contact details" link
#   Then I see "Contact details" on the page header

# Scenario Outline: AC1(419 & 358), AC3, AC4(419 & 358)AC5(419)- positive: verifying all the fields with maximum mo.of characters in all fields and spaces in telephone numbers
#   When I enter "<primaryEmail>" into the "Primary email address" field
#   When I enter "<secondaryEmail>" into the "Secondary email address" field
#   When I enter "<mobileTelephone>" into the "Mobile telephone number" field
#   When I enter "<homeTelephone>" into the "Home telephone number" field
#   When I enter "<workTelephone>" into the "Work telephone number" field

#   # Due to changes in PO-360
#   #Then I click save and return to tasks
#   Then I click the "<returnPageButton>" button and see "<pageHeader>" on the page header
#   And I see the status of "Contact details" is "Provided"

#   Then I click on the "Contact details" link
#   Then I see "Contact details" on the page header

#   Then I see "<primaryEmail>" in the "Primary email address" field
#   Then I see "<secondaryEmail>" in the "Secondary email address" field
#   Then I see "<mobileTelephone>" in the "Mobile telephone number" field
#   Then I see "<homeTelephone>" in the "Home telephone number" field
#   Then I see "<workTelephone>" in the "Work telephone number" field

#   Examples:
#     | primaryEmail                                                                 | secondaryEmail                                                            | mobileTelephone                     | homeTelephone                       | workTelephone                       | returnPageButton          | pageHeader       |
#     | testing_primary-email_for_contact-details-adult-or-youth123@adultoryouth.com | testing_secondary-email_for_contact-details-adult-or-youth123@test123.com | 0  7  7  0  0  9   0  0    9  8   2 | 0  1  6  3   2  9   6   0   0  0  1 | 0  7  7  0   0   9  0   0   9  8  2 | Return to account details | Account details  |
#     | testing_primary-email_for_contact-details-adult-or-youth123@adultoryouth.com | testing_secondary-email_for_contact-details-adult-or-youth123@test123.com | 0  7  7  0  0  9   0  0    9  8   2 | 0  1  6  3   2  9   6   0   0  0  1 | 0  7  7  0   0   9  0   0   9  8  2 | Add employer details      | Employer details |

# Scenario: AC2- positive: verifying if user doesn't enter any values and selecting retun to account details/Add employer details button
#   #covering AC2 & AC3 in PO-419
#   # Due to changes in PO-360
#   #Then I click save and return to tasks
#   Then I click the "<retunPageButton>" button and see "<pageHeader>" on the page header

#   Then I click on the "Contact details" link
#   Then I see "Contact details" on the page header
#   Examples:
#     | retunPageButton           | pageHeader       |
#     | Return to account details | Account details  |
#     | Add employer details      | Employer details |

# Scenario: AC5(PO-358) AC6(PO-419)-positive: when user enters primary & secondary email addresses in the correct format then user will be on Account details page
#   When I enter "<primaryEmail>" into the "Primary email address" field
#   When I enter "<secondaryEmail>" into the "Secondary email address" field
#   When I enter "<homeTelephone>" into the "Home telephone number" field

#   # Due to changes in PO-360
#   #Then I click save and return to tasks
#   Then I click the "<retunPageButton>" button and see "<pageHeader>" on the page header
#   Then I see "Account details" on the page header

#   Then I click on the "Contact details" link
#   Then I see "Contact details" on the page header

#   Then I see "<primaryEmail>" in the "Primary email address" field
#   Then I see "<secondaryEmail>" in the "Secondary email address" field
#   Then I see "<homeTelephone>" in the "Home telephone number" field
#   Examples:
#     | primaryEmail                | secondaryEmail            | homeTelephone        | retunPageButton           | pageHeader       |
#     | testing@test.com            | john.smith@gmail.com      | 07216876870          | Return to account details | Account details  |
#     | maggi_1234-Parleg@gmail.com | PARKERg234_milk@gmail.com | 0 1 1   12   3333 44 | Add employer details      | Employer details |


# Scenario Outline: :AC6(358) AC7(419)-negative: When user enters email addresses in incorrect format then user will be on the Contact details page
#   When I enter "<primaryEmail>" into the "Primary email address" field
#   When I enter "<secondaryEmail>" into the "Secondary email address" field

#   # Due to changes in PO-360
#   #Then I click save and return to tasks
#   Then I click the "<returnPageButton>" button
#   Then I see "Contact details" on the page header

#   Then I see the error message "Enter primary email address in the correct format like, name@example.com" at the top of the page
#   Then I see the error message "Enter secondary email address in the correct format like, name@example.com" at the top of the page

#   Then I see "Contact details" on the page header

#   Examples:
#     | incorrectPrimaryEmail         | incorrectSecondaryEmail                  | returnPageButton          |
#     | maggi*1234.Parleg%$@gmail.com | milkbikis_milk- 4567:&234@rediffmail.com | Return to account details |
#     | maggi*1234.Parleg%$@gmail.com | milkbikis_milk- 4567:&234@rediffmail.com | Add employer details      |


# Scenario Outline: :AC7(358)AC8(PO-419)-negative: When user enters telephone numbers in incorrect format then user will be on the Contact details page
#   When I enter "<incorrectMobileNumber>" into the "Mobile telephone number" field
#   When I enter "<incorrectHomeTelephone>" into the "Home telephone number" field
#   When I enter "<incorrectWorkTelephone>" into the "Work telephone number" field

#   # Due to changes in PO-360
#   #Then I click save and return to tasks
#   Then I click the "<returnPageButton>" button
#   Then I see "Contact details" on the page header

#   Then I see the error message "Enter a home telephone number, like 01632 960 001" at the top of the page
#   Then I see the error message "Enter a work telephone number, like 01632 960 001 or 07700 900 982" at the top of the page
#   Then I see the error message "Enter a mobile telephone number, like 07700 900 982" at the top of the page
#   Then I see "Contact details" on the page header

#   Examples:
#     | incorrectMobileNumber | incorrectHomeTelephone | incorrectWorkTelephone                   | returnPageButton          |
#     | 12345678902*$         | 123+ 566 987           | 0123 456                        79  8 89 | Return to account details |
#     | 12345678902*$         | 123+ 566 987           | 0123 456                        79  8 89 | Add employer details      |

# Scenario Outline: AC8(358)AC9.C(419)-negative: When user enters incorrect data into all fields and amends the data will be on account details page
#   When I enter "<incorrectPrimaryEmail>" into the "Primary email address" field
#   When I enter "<incorrectSecondaryEmail>" into the "Secondary email address" field
#   When I enter "<incorrectMobileNumber>" into the "Mobile telephone number" field
#   When I enter "<incorrectHomeTelephone>" into the "Home telephone number" field
#   When I enter "<incorrectWorkTelephone>" into the "Work telephone number" field

#   # Due to changes in PO-360
#   #Then I click save and return to tasks
#   Then I click the "<returnPageButton>" button
#   Then I see "Contact details" on the page header

#   Then I see the error message "Enter primary email address in the correct format like, name@example.com" at the top of the page
#   Then I see the error message "Enter secondary email address in the correct format like, name@example.com" at the top of the page
#   Then I see the error message "Enter a home telephone number, like 01632 960 001" at the top of the page
#   Then I see the error message "Enter a work telephone number, like 01632 960 001 or 07700 900 982" at the top of the page
#   Then I see the error message "Enter a mobile telephone number, like 07700 900 982" at the top of the page
#   Then I see "Contact details" on the page header

#   When I enter "<updatePrimaryEmail>" into the "Primary email address" field
#   When I enter "<updateSecondaryEmail>" into the "Secondary email address" field
#   When I enter "<updateMobileTelephone>" into the "Mobile telephone number" field
#   When I enter "<updateHomeTelephone>" into the "Home telephone number" field
#   When I enter "<updateWorkTelephone>" into the "Work telephone number" field

#   # Due to changes in PO-360
#   #Then I click save and return to tasks
#   Then I click the "<returnPageButton>" button
#   Then I see "<pageHeader>" on the page header

#   Then I click on the "Contact details" link
#   Then I see "Contact details" on the page header

#   Then I see "<updatePrimaryEmail>" in the "Primary email address" field
#   Then I see "<updateSecondaryEmail>" in the "Secondary email address" field
#   Then I see "<updateMobileTelephone>" in the "Mobile telephone number" field
#   Then I see "<updateHomeTelephone>" in the "Home telephone number" field
#   Then I see "<updateWorkTelephone>" in the "Work telephone number" field

#   Examples:
#     | incorrectPrimaryEmail         | incorrectSecondaryEmail                  | incorrectMobileNumber | incorrectHomeTelephone | incorrectWorkTelephone                       | updatePrimaryEmail | updateSecondaryEmail | updateHomeTelephone | updateMobileTelephone | updateWorkTelephone | returnPageButton          | pageHeader      |
#     | maggi*1234.Parleg%$@gmail.com | milkbikis_milk- 4567:&234@rediffmail.com | 12345678902*$         | 123+ 566 987           | 0123     456                        79  8 89 | testing@test.com   | john.smith@gmail.com | 01669 345 678       | 01234 567 098         | 07216 876 870       | Return to account details | Account details |

# Scenario Outline: AC8(358)AC9.D(419)-negative: When user enters incorrect data into all fields and amends the data will be on account details page
#   When I enter "<incorrectPrimaryEmail>" into the "Primary email address" field
#   When I enter "<incorrectSecondaryEmail>" into the "Secondary email address" field
#   When I enter "<incorrectMobileNumber>" into the "Mobile telephone number" field
#   When I enter "<incorrectHomeTelephone>" into the "Home telephone number" field
#   When I enter "<incorrectWorkTelephone>" into the "Work telephone number" field

#   # Due to changes in PO-360
#   #Then I click save and return to tasks
#   Then I click the "<returnPageButton>" button
#   Then I see "Contact details" on the page header

#   Then I see the error message "Enter primary email address in the correct format like, name@example.com" at the top of the page
#   Then I see the error message "Enter secondary email address in the correct format like, name@example.com" at the top of the page
#   Then I see the error message "Enter a home telephone number, like 01632 960 001" at the top of the page
#   Then I see the error message "Enter a work telephone number, like 01632 960 001 or 07700 900 982" at the top of the page
#   Then I see the error message "Enter a mobile telephone number, like 07700 900 982" at the top of the page
#   Then I see "Contact details" on the page header

#   When I enter "<updatePrimaryEmail>" into the "Primary email address" field
#   When I enter "<updateSecondaryEmail>" into the "Secondary email address" field
#   When I enter "<updateMobileTelephone>" into the "Mobile telephone number" field
#   When I enter "<updateHomeTelephone>" into the "Home telephone number" field
#   When I enter "<updateWorkTelephone>" into the "Work telephone number" field

#   # Due to changes in PO-360
#   #Then I click save and return to tasks
#   Then I click the "<returnPageButton>" button
#   And I click on the "Cancel" link
#   Then I see "<pageHeader>" on the page header

#   Then I click on the "Contact details" link
#   Then I see "Contact details" on the page header

#   Then I see "<updatePrimaryEmail>" in the "Primary email address" field
#   Then I see "<updateSecondaryEmail>" in the "Secondary email address" field
#   Then I see "<updateMobileTelephone>" in the "Mobile telephone number" field
#   Then I see "<updateHomeTelephone>" in the "Home telephone number" field
#   Then I see "<updateWorkTelephone>" in the "Work telephone number" field

#   Examples:
#     | incorrectPrimaryEmail         | incorrectSecondaryEmail                  | incorrectMobileNumber | incorrectHomeTelephone | incorrectWorkTelephone                   | updatePrimaryEmail | updateSecondaryEmail | updateHomeTelephone | updateMobileTelephone | updateWorkTelephone | returnPageButton     | pageHeader      |
#     | maggi*1234.Parleg%$@gmail.com | milkbikis_milk- 4567:&234@rediffmail.com | 12345678902*$         | 123+ 566 987           | 0123 456                        79  8 89 | testing@test.com   | john.smith@gmail.com | 01669 345 678       | 01234 567 098         | 07216 876 870       | Add employer details | Account details |



# Scenario: AC9(358) AC10(419)-negative: When user has not entered data into any fields and selecting cancel then user will be on Account details page
#   Then "Cancel" is clicked
#   Then I see "Account details" on the page header

# Scenario Outline: AC10a(358)AC11a(419)-negative: When user clicks on cancel after entering the data into field/fields then select ok on warning message
#   When I enter "<primaryEmail>" into the "Primary email address" field
#   When I enter "<homeTelephone>" into the "Home telephone number" field

#   Then "Cancel" is clicked
#   Then I select OK on the pop up window

#   Then I see "Account details" on the page header
#   Then I click on the "Contact details" link
#   Then I see "" in the "Primary email address" field
#   Then I see "" in the "Home telephone number" field
#   Examples:
#     | primaryEmail               | homeTelephone |
#     | test.badami@rediffmail.com | 01568 987 567 |

# Scenario Outline: AC10b(358)AC11b(419)-negative: When user clicks on cancel after entering the data into field/fields then select cancel the warning message
#   When I enter "<primaryEmail>" into the "Primary email address" field
#   When I enter "<homeTelephone>" into the "Home telephone number" field

#   Then "Cancel" is clicked
#   Then I select cancel on the pop up window

#   Then I see "Account details" on the page header
#   Then I click on the "Contact details" link
#   Then I see "" in the "Primary email address" field
#   Then I see "" in the "Home telephone number" field
#   Examples:
#     | primaryEmail               | homeTelephone |
#     | test.badami@rediffmail.com | 01568 987 567 |

