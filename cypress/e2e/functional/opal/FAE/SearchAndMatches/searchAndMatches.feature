Feature: Account Search and Matches

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard
        When I navigate to Search For An Account

    @PO-705
    Scenario: AC7. Tab switching clears data on the Individuals tab
        When I enter "Smith" into the "Last name" field
        And I select the last name exact match checkbox
        And I enter "John" into the "First names" field
        And I select the first names exact match checkbox
        And I select the "Include aliases" checkbox
        And I enter "15/05/1980" into the Date of birth field
        And I enter "AB123456C" into the "National Insurance number" field
        And I enter "123 Test Street" into the "Address line 1" field
        And I enter "SW1A 1AA" into the "Postcode" field

        # Verify all data is entered correctly
        Then I see "Smith" in the "Last name" field
        And I see "John" in the "First names" field
        And I see "15/05/1980" in the Date of birth field
        And I see "AB123456C" in the "National Insurance number" field
        And I see "123 Test Street" in the "Address line 1" field
        And I see "SW1A 1AA" in the "Postcode" field

        # Switch to another tab and back
        When I click on the "Companies" link
        And I click on the "Individuals" link

        # Verify all fields are cleared
        Then I see "" in the "Last name" field
        And I see "" in the "First names" field
        And I see "" in the Date of birth field
        And I see "" in the "National Insurance number" field
        And I see "" in the "Address line 1" field
        And I see "" in the "Postcode" field
        And I verify the last name exact match checkbox is not checked
        And I verify the first names exact match checkbox is not checked
        And I validate the "Include aliases" checkbox is not checked

        # Verify "Active accounts only" checkbox remains checked as default
        And I validate the "Active accounts only" checkbox is checked

    @PO-705
    Scenario: AC6. Error navigation when searching with multiple section data
        # AC6. Error when all 3 sections contain data (Account number, Reference number, Individual field)
        When I enter "12345678" into the "Account number" field
        And I enter "REF-123" into the "Reference or case number" field
        And I enter "Smith" into the "Last name" field

        # Submit the search form
        And I click the "Search" button

        # Verify error screen is displayed
        Then I see "There is a problem" on the page header
        Then I see "Reference data and account information cannot be entered together when searching for an account. Search using either:" text on the page
        And I see "account number" text on the page
        And I see "reference or case number" text on the page
        And I see "selected tab" text on the page

        # AC6ia. Back button returns to search screen with data intact
        When I click on the "Go back" link

        # Verify we are back on search page with data preserved
        Then I see "Search for an account" on the page header
        And I see "12345678" in the "Account number" field
        And I see "REF-123" in the "Reference or case number" field
        And I see "Smith" in the "Last name" field

        # Clear all fields for next test
        When I click on the "Companies" link
        And I click on the "Individuals" link

        # AC6a. Error when 2 out of 3 sections contain data - Case 1: Account number + Reference
        When I enter "12345678" into the "Account number" field
        And I enter "REF-123" into the "Reference or case number" field

        # Submit the search form
        And I click the "Search" button

        # Verify error screen is displayed
        Then I see "There is a problem" on the page header

        # Go back and clear fields for next test
        When I click on the "Go back" link
        And I click on the "Companies" link
        And I click on the "Individuals" link

        # AC6a. Error when 2 out of 3 sections contain data - Case 2: Account number + Individual
        When I enter "12345678" into the "Account number" field
        And I enter "Smith" into the "Last name" field

        # Submit the search form
        And I click the "Search" button

        # Verify error screen is displayed
        Then I see "There is a problem" on the page header

        # Go back and clear fields for next test
        When I click on the "Go back" link
        And I click on the "Companies" link
        And I click on the "Individuals" link

        # AC6a. Error when 2 out of 3 sections contain data - Case 3: Reference + Individual
        When I enter "REF-123" into the "Reference or case number" field
        And I enter "Smith" into the "Last name" field

        # Submit the search form
        And I click the "Search" button

        # Verify error screen is displayed
        Then I see "There is a problem" on the page header

        # Test going back from error screen
        When I click on the "Go back" link

        # Verify we're back on search page with data still populated
        Then I see "Search for an account" on the page header
        And I see "12345678" in the "Account number" field
        And I see "REF-123" in the "Reference or case number" field
        And I see "Smith" in the "Last name" field

    @PO-705
    Scenario: AC8. Route guard prevents accidental navigation away from search screen with data
        # Enter data into the search form fields
        When I enter "12345678" into the "Account number" field
        And I enter "Smith" into the "Last name" field

        # Verify data was entered correctly
        Then I see "12345678" in the "Account number" field
        And I see "Smith" in the "Last name" field

        # Try to navigate away using browser back button and confirm alert
        When I click the browser back button, a window pops up and I click Ok

        # Verify we've navigated away and the data is lost
        Then I am on the dashboard

        # Go back to the search page
        When I navigate to Search For An Account

        # Enter data again
        When I enter "REF-123" into the "Reference or case number" field
        And I enter "John" into the "First names" field

        # Verify data was entered correctly
        Then I see "REF-123" in the "Reference or case number" field
        And I see "John" in the "First names" field

        # Try to navigate away but cancel the confirmation
        When I click the browser back button, a window pops up and I click Cancel

        # Verify we're still on the search page with data preserved
        Then I see "Search for an account" on the page header
        And I see "REF-123" in the "Reference or case number" field
        And I see "John" in the "First names" field
