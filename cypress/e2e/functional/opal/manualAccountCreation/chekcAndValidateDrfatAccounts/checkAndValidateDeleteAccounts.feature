Feature: Navigate and edit sections from task list of draft accounts

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard

    @PO-594
    Scenario: AC.1, AC.8ci, AC.8d, Ac.9 view the details of an account in review account screen
        Given I create a "adultOrYouthOnly" draft account with the following details:
            | account.defendant.forenames | ToReview-PO-594-adultOrYouth |
            | account.defendant.surname   | TEST                         |


        Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
        Then I am on the dashboard

        Given I navigate to Check and Validate Draft Accounts
        When I update the last created draft account with status "Deleted"

        Then I click on the "Deleted" link

        Then I click on the "TEST ToReview-PO-594-adultOrYouth" link
        And I see "Mr ToReview-PO-594-adultOrYouth TEST" on the page header
        And I see the "Review history" section heading

        And I select the "approve" radio button
        And I click on continue button
        And I see "To review" on the page header

        Then I click on the "TEST ToReview-PO-594-adultOrYouth" link
        And I see "Mr ToReview-PO-594-adultOrYouth TEST" on the page header

        And I select the "delete" radio button
        And I enter "Testing review history" into the "Enter reason for rejection" text field
        And I click on continue button
        And I see "To review" on the page header

        Then I click on the "TEST ToReview-PO-594-adultOrYouth" link
        And I click on the "Delete account" link
        Then I see "Reason for deletion" on the page header
        And I click the back button









