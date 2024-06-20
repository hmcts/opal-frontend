Feature: tests for contact details page for all the defendant types (adult tor youth only, adult or youth with parent or guardian and company)

    Background:
        Given I am on the OPAL Frontend
        Then I see "Opal" in the header

        When I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        When I navigate to Manual Account Creation

        Then I see "Create account" as the caption on the page
        Then I see "Business unit and defendant type" on the page header
        When I select adults and youth only
        Then I click on continue button

        Then I see "Create account" as the caption on the page
        Then I see "Account details" on the page header

        Then I click on "Contact details" link
        Then I see "Contact details" on the page header

    Scenario Outline: AC1, AC3, AC4- positive: verifying all the fields with maximum mo.of characters
        When I enter primary email address "<primaryEmail>"
        When I enter secondary email address "<secondaryEmail>"
        When I enter mobile telephone number "<mobileTelephone>"
        When I enter home telephone number "<homeTelephone>"
        When I enter business telephone number "<businessTelephone>"

        Then I click save and return to tasks
        Then I see "Account details" on the page header

        Then I click on "Contact details" link
        Then I see "Contact details" on the page header

        Then I verify "<primaryEmail>","<secondaryEmail>","<mobileTelephone>","<homeTelephone>","<businessTelephone>" on contact details page
        Examples:
            | primaryEmail                                                                 | secondaryEmail                                                            | mobileTelephone           | homeTelephone | businessTelephone |
            | testing_primary-email_for_contact-details-adult-or-youth123@adultoryouth.com | testing_secondary-email_for_contact-details-adult-or-youth123@test123.com | 0 7 7 0 0 9 0 0  9  8   2 | 01632 960 001 | 07700 900 982     |

    Scenario: AC2- positive: verifying if user doesn't enter any values and selecting retun to account details
        Then I click save and return to tasks
        Then I see "Account details" on the page header

        Then I click on "Contact details" link
        Then I see "Contact details" on the page header

    Scenario: AC5-positive: when user enters primary & secondary email addresses in the correct format then user will be on Account details page
        When I enter primary email address "<primaryEmail>"
        When I enter secondary email address "<secondaryEmail>"
        When I enter home telephone number "<homeTelephone>"

        Then I click save and return to tasks
        Then I see "Account details" on the page header

        Then I click on "Contact details" link
        Then I see "Contact details" on the page header

        Then I verify "<primaryEmail>","<secondaryEmail>","<homeTelephone>" on contact details page
        Examples:
            | primaryEmail                | secondaryEmail            | homeTelephone        |
            | testing@test.com            | john.smith@gmail.com      | 07216876870          |
            | maggi_1234-Parleg@gmail.com | PARKERg234_milk@gmail.com | 0 1 1   12   3333 44 |


    Scenario Outline: :AC6-negative: When user enters email addresses in incorrect format then user will be on the Contact details page
        When I enter incorrect primary email address "<incorrectPrimaryEmail>"
        When I enter incorrect secondary email address "<incorrectSecondaryEmail>"

        Then I click save and return to tasks
        Then I see "Contact details" on the page header

        Then I verify the error message
        Then I see "Contact details" on the page header

        Examples:
            | incorrctPrimaryEmail          | incorrectSecondaryEmail                  |
            | maggi*1234.Parleg%$@gmail.com | milkbikis_milk- 4567:&234@rediffmail.com |

    Scenario Outline: :AC7-negative: When user enters telephone numbers in incorrect format then user will be on the Contact details page
        When I enter incorrect mobile telephone number "<incorrectMobileNumber>"
        When I enter incorrect home telephone number "<incorrectHomeTelephone>"
        When I enter incorrect business telephone number "<incorrectBusinessTelephone>"

        Then I click save and return to tasks
        Then I see "Contact details" on the page header

        Then I verify the error message
        Then I see "Contact details" on the page header

        Examples:
            | incorrectMobileNumber | incorrectHomeTelephone | incorrectBusinessTelephone               |
            | 12345678902*$         | 123+ 566 987           | 0123 456                        79  8 89 |

    Scenario Outline: AC8-negative: When user enters incorrect data into all fields and amends the data will be on account details page
        When I enter incorrect primary email address "<incorrectPrimaryEmail>"
        When I enter incorrect secondary email address "<incorrectSecondaryEmail>"
        When I enter incorrect mobile telephone number "<incorrectMobileNumber>"
        When I enter incorrect home telephone number "<incorrectHomeTelephone>"
        When I enter incorrect business telephone number "<incorrectBusinessTelephone>"

        Then I click save and return to tasks
        Then I see "Contact details" on the page header

        Then I verify the error message
        Then I see "Contact details" on the page header

        When I update primary email address "<primaryEmail>"
        When I update secondary email address "<secondaryEmail>"
        When I update mobile telephone number "<mobileTelephone>"
        When I update home telephone number "<homeTelephone>"
        When I update business telephone number "<businessTelephone>"

        Then I click save and return to tasks
        Then I see "Account details" on the page header

        Then I click on "Contact details" link
        Then I see "Contact details" on the page header

        Then I verify "<primaryEmail>","<secondaryEmail>","<mobileTelephone>","<homeTelephone>","<businessTelephone>" on contact details page

        Examples:
            | incorrectPrimaryEmail         | incorrectSecondaryEmail                  | incorrectMobileNumber | incorrectHomeTelephone | incorrectBusinessTelephone               | primaryEmail     | secondaryEmail       | homeTelephone | mobileTelephone | businessTelephone |
            | maggi*1234.Parleg%$@gmail.com | milkbikis_milk- 4567:&234@rediffmail.com | 12345678902*$         | 123+ 566 987           | 0123 456                        79  8 89 | testing@test.com | john.smith@gmail.com | 01669 345 678 | 01234 567 098   | 07216 876 870     |

    Scenario: AC9-negative: When user has not entered data into any fields and selecting cancel then user will be on Account details page
        Then "Cancel" is clicked
        Then I see "Account details" on the page header

    Scenario Outline: AC10a-negative: When user clicks on cancel after entering the data into field/fields then select ok on warning message
        When I enter primary email address "<primaryEmail>"
        When I enter home telephone number "<homeTelephone>"

        Then "Cancel" is clicked
        Then I select OK on the pop up window

        Then I see "Account details" on the page header
        Then I click on "Contact details" link
        Then I verify primary email, home telephone is empty
        Examples:
            | primaryEmail               | homeTelephone |
            | test.badami@rediffmail.com | 01568 987 567 |

    Scenario Outline: AC10b-negative: When user clicks on cancel after entering the data into field/fields then select cancel the warning message
        When I enter primary email address "<primaryEmail>"
        When I enter home telephone number "<homeTelephone>"

        Then "Cancel" is clicked
        Then I select cancel on the pop up window

        Then I see "Account details" on the page header
        Then I click on "Contact details" link
        Then I verify primary email, home telephone is empty
        Examples:
            | primaryEmail               | homeTelephone |
            | test.badami@rediffmail.com | 01568 987 567 |

