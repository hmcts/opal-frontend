Feature: Navigate and edit sections from task list of draft accounts

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard

    #Given I navigate to Check and Validate Draft Accounts


    @PO-594
    Scenario: view the details of an account in review account screen
        Given I create a "adultOrYouthOnly" draft account with the following details:
            | account.defendant.surname   | TEST                         |
            | account.defendant.forenames | ToReview-PO-594-adultOrYouth |

        Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
        Then I am on the dashboard

        Given I navigate to Check and Validate Draft Accounts
        When I update the last created draft account with status "Deleted"

        Then I click on the "Deleted" link

        Then I click on the "TEST ToReview-PO-594-adultOrYouth" link
        And I see "Mr ToReview-PO-594-adultOrYouth TEST" on the page header
        And I see the "Review history" section heading

        And the account status is "In review"




