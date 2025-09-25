Feature: Add Account Note - View Defendant Account Details
    # This feature file contains tests for adding an account note in the View Defendant Account Details section #

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        When I navigate to View Defendant Account Details

    @PO-771
    Scenario: (AC.1) Navigate to Add account note screen
        Then I see "Ms Anna GRAHAM" on the page header
        When I click the "Add account note" button
        Then I see "Add account note" on the page header

        #(AC3a)
        And I see "You have 1000 characters remaining" on the page

        #(AC2a, AC2b) Character counter functionality during typing
        And The text area should have a 1000 character limit
        Then I enter "This is a test account note for validation" into the "notes" text field
        Then I see "You have 958 characters remaining" on the page

        #Note: For AC3a, AC3ai, AC3aii the maximum character limit is 1000. So, entering 1000 characters should show 0 characters remaining.more than 1000 characters doesn't allow to type.
        #(AC3a, AC3ai, AC3aii) Maximum character limit
        When I enter 1000 character into the "notes" text field
        Then I see "You have 0 characters remaining" on the page

        #(AC3b, AC3bi,AC3bii) invalid data
        Then I enter "Test @#$%^&*()" into the "notes" text field
        When I click the "Save note" button
        Then I see "Add account note" on the page header
        And I see the error message "Account note must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)"

        #(AC3c, AC3ci,AC3cii) No data entered
        When I clear the "notes" text field
        And I click the "Save note" button
        #verify you're on the same page with the same header
        Then I see "Add account note" on the page header
        And I see the error message "Add account note or click cancel to return"
        And I see "You have 1000 characters remaining" on the page

        #(AC4) valid data
        And I enter "Valid test account note" into the "notes" text field
        And I click the "Save note" button
        Then I see "Ms Anna GRAHAM" on the page header
        And I see the URL contains "details"

        #(AC5) Cancel button without entering data
        When I click the "Add account note" button
        Then I see "Add account note" on the page header
        Then I click on the "Cancel" link
        Then I see "Ms Anna GRAHAM" on the page header
        And I see the URL contains "details"

        #(AC5a) Cancel button after entering data
        When I click the "Add account note" button
        Then I see "Add account note" on the page header
        Then I enter "This is a test account note for validation" into the "notes" text field
        Then I click on the "Cancel" link
        Then I verify "WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes." a window pops up and I click Ok
        Then I see "Ms Anna GRAHAM" on the page header

        #(AC5b) Browser back button after entering data
        When I click the "Add account note" button
        Then I see "Add account note" on the page header
        Then I enter "This is a test account note for back button" into the "notes" text field
        And I click the browser back button, a window pops up and I click Ok
        Then I see "Ms Anna GRAHAM" on the page header
        And I see the URL contains "details"


