Feature: Navigate and edit sections from task list of draft accounts

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard

    @PO-594
    Scenario: view the details of an account in review account screen
        #Given I create a "adultOrYouthOnly" draft account with the following details:
        And I create a "adultOrYouthOnly" draft account with the following details:
            | Account_status                          | Submitted                 |
            | account.defendant.forenames             | Larry                     |
            | account.defendant.surname               | Lincoln                   |
            | account.defendant.email_address_1       | larry.lincoln@outlook.com |
            | account.defendant.telephone_number_home | 02078219385               |

        Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
        Then I am on the dashboard

        Given I navigate to Check and Validate Draft Accounts
        And I see "Review accounts" on the page header

        And I click on the "Lincoln, Larry" link

        Then I see "Mr Larry LINCOLN" on the page header
        And the account status is "In review"
        #And I see the "Review history" section heading

        And I select the "Approve" radio button
        And I click on continue button
        And I see "Review accounts" on the page header

        And I click on the "Lincoln, Larry" link
        Then I see "Mr Larry LINCOLN" on the page header

        #AC.9 user selects the 'Back' button, they will be returned to the 'Review Accounts - To Review' screen
        And I click the back button link

        And I click on the "Lincoln, Larry" link
        Then I see "Mr Larry LINCOLN" on the page header

        And I select the "Reject" radio button
        And I enter "Testing review history" into the "Enter reason for rejection" text field
        And I click on continue button
        And I see "Review accounts" on the page header


        And I click on the "Lincoln, Larry" link
        And I click on the "Delete account" link
        Then I see "Are you sure you want to delete this account?" on the page header

    @PO-597
    Scenario: As a user I can delete the account with reason entered
        And I create a "adultOrYouthOnly" draft account with the following details:
            | Account_status                          | Submitted              |
            | account.defendant.forenames             | Peter                  |
            | account.defendant.surname               | Barn                   |
            | account.defendant.email_address_1       | peter.barn@outlook.com |
            | account.defendant.telephone_number_home | 02078219334            |

        Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
        Then I am on the dashboard

        Given I navigate to Check and Validate Draft Accounts
        And I see "Review accounts" on the page header

        And I see "To review" tab on the page header

        And I click on the "Barn, Peter" link
        Then I see "Mr Peter BARN" on the page header
        And I click on the "Delete account" link

        Then I see "Are you sure you want to delete this account?" on the page header
        And I enter "test reason" into the "Reason" text field
        When I click the "Yes - delete" button

        And I see "Review accounts" on the page header
        And I see "To review" on the status heading

        Then I see green banner on the top of the page
    #this step covered in PO-969, waiting to be merged
    #And I see success message on the banner "You have deleted Peter Barn account"

    @PO-597
    Scenario: As a user I can Cancel deleting the account
        And I create a "adultOrYouthOnly" draft account with the following details:
            | Account_status                          | Submitted              |
            | account.defendant.forenames             | Peter                  |
            | account.defendant.surname               | Barn                   |
            | account.defendant.email_address_1       | peter.barn@outlook.com |
            | account.defendant.telephone_number_home | 02078219334            |

        Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
        Then I am on the dashboard

        Given I navigate to Check and Validate Draft Accounts
        And I see "Review accounts" on the page header

        And I see "To review" tab on the page header

        And I click on the "Barn, Peter" link
        Then I see "Mr Peter BARN" on the page header
        And I click on the "Delete account" link

        Then I see "Are you sure you want to delete this account?" on the page header
        And I click on the "No - cancel" link
        And I see "Mr Peter BARN" on the page header

        And I click on the "Delete account" link
        Then I see "Are you sure you want to delete this account?" on the page header
        And I enter "test reason" into the "Reason" text field
        And I click on the "No - cancel" link

        Then I select cancel on the pop up window
        Then I see "Are you sure you want to delete this account?" on the page header

        #And I click on the "No - cancel" link
        And  I click "No - cancel", a window pops up and I click Ok
        # And I select OK on the pop up window
        And I see "Mr Peter BARN" on the page header


















