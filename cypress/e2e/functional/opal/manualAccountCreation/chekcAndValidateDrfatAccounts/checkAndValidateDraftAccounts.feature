Feature: Navigate and edit sections from task list of draft accounts

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard

    @PO-594
    Scenario: AC.1, AC.8ci user can approve the account from review account screen        #Given I create a "adultOrYouthOnly" draft account with the following details:
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


    @PO-594
    Scenario: AC.8ci, Ac.9 user can reject an account from review account screen
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

        #AC.9 user selects the 'Back' button, they will be returned to the 'Review Accounts - To Review' screen
        And I click the back button link

        And I click on the "Lincoln, Larry" link
        Then I see "Mr Larry LINCOLN" on the page header

        And I select the "Reject" radio button
        And I enter "Testing review history" into the "Enter reason for rejection" text field
        And I click on continue button
        And I see "Review accounts" on the page header

    @PO-594
    Scenario: AC.8d user can delete an account in review screen
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

        And I click on the "Delete account" link
        Then I see "Are you sure you want to delete this account?" on the page header

    @PO-969
    Scenario: AC.1 When user selecting reject radio button with providing reason and continues
        #Given I create a "adultOrYouthOnly" draft account with the following details:
        And I create a "adultOrYouthOnly" draft account with the following details:
            | Account_status                          | Submitted                |
            | account.defendant.forenames             | Harry                    |
            | account.defendant.surname               | Potter                   |
            | account.defendant.email_address_1       | harry.potter@outlook.com |
            | account.defendant.telephone_number_home | 02078219385              |

        Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
        Then I am on the dashboard

        Given I navigate to Check and Validate Draft Accounts
        And I see "Review accounts" on the page header

        And I click on the "Potter, Harry" link
        Then I see "Mr Harry POTTER" on the page header
        And the account status is "In review"

        And I select the "Reject" radio button
        And I enter "Testing review history" into the "Enter reason for rejection" text field
        And I click on continue button
        And I see "Review accounts" on the page header
        And I see "To review" on the status heading
        And I see green banner on the top of the page

        And I see success message on the banner "You have rejected Harry Potter's account"

        Then I click on the "Rejected" link
        And I click on the "Potter, Harry" link
        Then I see "Mr Harry POTTER" on the page header
        And the account status is "Rejected"














