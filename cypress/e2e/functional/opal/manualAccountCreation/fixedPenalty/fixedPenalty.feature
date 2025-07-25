Feature: Manual fixed penalty account creation - Create Draft Account

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
        Then I am on the dashboard
        Then I navigate to Manual Account Creation
        And I enter "West London" into the business unit search box
        And I select the "Fixed Penalty" radio button

    @PO-857 @PO-861
    Scenario: Submit valid details for a fixed penalty draft account
        # PO-857 AC24 - Create a fixed penalty draft account for the Adult or youth only defendant type
        When I select the "Adult or youth only" radio button
        And I click the "Continue" button
        Then I see "Fixed Penalty details" on the page header

        # Fill in personal details
        When I select "Mr" from the "Title" dropdown
        And I enter "John" into the "First names" field
        And I enter "Smith" into the "Last name" field
        And I enter "01/01/1980" into the "Date of birth" date field
        And I enter "123 High Street" into the "Address line 1" field
        And I enter "SW1A 1AA" into the "Postcode" field

        # Fill in court details
        And I enter "Lowestoft County Court (256)" into the Issuing Authority search box
        And I enter "Aram Court (123)" into the Enforcement court search box

        # Fill in fixed penalty details
        And I enter "FPN1234" into the "Notice number" field
        And I enter "01/01/2023" into the "Date of offence" date field
        And I enter "HY35014" into the "Offence code" field
        And I enter "14:30" into the "Time of offence" field
        And I enter "Oxford Street, London" into the "Place of offence" text field
        And I enter "150" into the Amount imposed field

        # Select vehicle type and fill related fields
        And I select the "Vehicle" radio button
        And I enter "AB12CDE" into the "Registration number" field
        And I enter "SMITH010123JS9AB" into the "Driving licence number" field

        When I click the "Review Account" button

        # PO-861 AC1 - Check navigation to 'Check account details' screen
        Then I see "Check fixed penalty account details" on the page header

        # Verify the presence of key sections
        Then I see "Issuing authority and court details" text on the page
        And I see "Personal details" text on the page
        And I see "Offence Details" text on the page

        # PO-861 AC2c - Verify 'Change' buttons functionality
        # Test 'Change' for court details
        When I click the change link for the "Issuing authority and court details" section
        Then I see "Fixed Penalty details" on the page header

        When I click the "Review Account" button
        Then I see "Check fixed penalty account details" on the page header

        # Test 'Change' for personal details
        When I click the change link for the "Personal details" section
        Then I see "Fixed Penalty details" on the page header

        When I click the "Review Account" button
        Then I see "Check fixed penalty account details" on the page header

        # Test 'Change' for offence details
        When I click the change link for the "Offence Details" section
        Then I see "Fixed Penalty details" on the page header

        When I click the "Review Account" button
        Then I see "Check fixed penalty account details" on the page header

        # Test 'Change' for account comments and notes
        When I click the change link for the "Account comments and notes" section
        Then I see "Fixed Penalty details" on the page header

        When I click the "Review Account" button
        Then I see "Check fixed penalty account details" on the page header

        # PO-861 AC4 - Back button navigation
        When I click on the "Back" link
        Then I see "Fixed Penalty details" on the page header

        When I click the "Review Account" button
        Then I see "Check fixed penalty account details" on the page header

        # PO-861 AC3 - Delete Account button navigation
        When I click on the "Delete account" link
        Then I see "Are you sure you want to delete this account?" on the page header


    @PO-857
    Scenario: Cancel button behavior for the Fixed Penalty Details screen

        # PO-857 AC25 - Cancel navigates to Create Account when no data is entered
        When I select the "Adult or youth only" radio button
        And I click the "Continue" button
        Then I see "Fixed Penalty details" on the page header

        When I click on the "Cancel" link
        Then I see "Business unit and defendant type" on the page header

        # PO-857 AC25a/AC25ai - Warning message shows when data is entered, selecting OK navigates to Create Account screen
        When I select the "Fixed Penalty" radio button
        And I select the "Adult or youth only" radio button
        And I click the "Continue" button
        Then I see "Fixed Penalty details" on the page header

        When I select "Mr" from the "Title" dropdown
        And I enter "John" into the "First names" field

        When I click "Cancel", a window pops up and I click Ok

        Then I see "Business unit and defendant type" on the page header

        # PO-857 AC25aii - Warning message shows when data is entered, selecting Cancel keeps user on the page
        When I select the "Fixed Penalty" radio button
        And I select the "Adult or youth only" radio button
        And I click the "Continue" button
        Then I see "Fixed Penalty details" on the page header

        When I select "Mr" from the "Title" dropdown
        And I enter "John" into the "First names" field

        When I click "Cancel", a window pops up and I click Cancel

        Then I see "Fixed Penalty details" on the page header
        And I see "Mr" selected in the "Title" dropdown
        And I see "John" in the "First names" field

        # PO-857 AC25aiii - Validation errors persist when dismissing Cancel warning
        When I enter "01/01/2080" into the "Date of birth" date field
        And I click the "Review Account" button

        Then I see the error message "Enter a valid date of birth in the past" above the "Date of birth" field

        When I click "Cancel", a window pops up and I click Cancel

        Then I see "Fixed Penalty details" on the page header
        And I see the error message "Enter a valid date of birth in the past" above the "Date of birth" field

    @PO-857
    Scenario: Route guard behavior when using browser back button
        # PO-857 AC26 - Route guard appears when using back button with entered data
        When I select the "Adult or youth only" radio button
        And I click the "Continue" button
        Then I see "Fixed Penalty details" on the page header

        When I select "Mr" from the "Title" dropdown
        And I enter "John" into the "First names" field
        And I enter "150" into the Amount imposed field

        When I click the browser back button, a window pops up and I click Ok
        Then I see "Business unit and defendant type" on the page header

        When I select the "Fixed Penalty" radio button
        Then I select the "Adult or youth only" radio button
        And I click the "Continue" button
        Then I see "Fixed Penalty details" on the page header

        When I select "Mr" from the "Title" dropdown
        And I enter "John" into the "First names" field
        And I enter "150" into the Amount imposed field

        When I click the browser back button, a window pops up and I click Cancel
        Then I see "Fixed Penalty details" on the page header
        And I see "Mr" selected in the "Title" dropdown
        And I see "John" in the "First names" field
        And I see "150" in the Amount imposed field

    @PO-861
    Scenario: Submit valid details for a company defendant type fixed penalty draft account
        # Create a fixed penalty draft account for company defendant type
        When I select the "Company" radio button
        And I click the "Continue" button
        Then I see "Fixed Penalty details" on the page header

        # Fill in company details
        When I enter "Example Corporation Ltd" into the "Company name" field
        And I enter "123 Business Park" into the "Address line 1" field
        And I enter "Commerce Way" into the "Address line 2" field
        And I enter "EC1A 1BB" into the "Postcode" field

        # Fill in court details
        And I enter "Central London County Court (372)" into the Issuing Authority search box
        And I enter "Johns Maintenance Court (249)" into the Enforcement court search box

        # Fill in fixed penalty details
        And I enter "HY35014" into the "Offence code" field
        And I enter "10:15" into the "Time of offence" field
        And I enter "London Borough of Westminster" into the "Place of offence" text field
        And I enter "500" into the Amount imposed field
        And I enter "CP12COR" into the "Registration number" field
        And I enter "SMITH010123JS9AB" into the "Driving licence number" field
        And I enter "CORP2025" into the "Notice number" field
        And I enter "05/07/2025" into the "Date of offence" date field

        # Submit the form
        When I click the "Review Account" button
        # Verify navigation to 'Check account details' screen
        Then I see "Check fixed penalty account details" on the page header

        # Verify the presence of key sections
        Then I see "Issuing authority and court details" text on the page
        And I see "Company details" text on the page
        And I see "Offence Details" text on the page
        And I see "Account comments and notes" text on the page

        # PO-861 AC2c - Test 'Change' buttons functionality for all sections
        # Test 'Change' for court details
        When I click the change link for the "Issuing authority and court details" section
        Then I see "Fixed Penalty details" on the page header
        When I click the "Review Account" button
        Then I see "Check fixed penalty account details" on the page header

        # Test 'Change' for company details
        When I click the change link for the "Company details" section
        Then I see "Fixed Penalty details" on the page header
        When I click the "Review Account" button
        Then I see "Check fixed penalty account details" on the page header

        # Test 'Change' for offence details
        When I click the change link for the "Offence Details" section
        Then I see "Fixed Penalty details" on the page header
        When I click the "Review Account" button
        Then I see "Check fixed penalty account details" on the page header

        # Test 'Change' for account comments and notes
        When I click the change link for the "Account comments and notes" section
        Then I see "Fixed Penalty details" on the page header
        When I click the "Review Account" button
        Then I see "Check fixed penalty account details" on the page header

        # PO-861 AC4 - Back button navigation
        When I click on the "Back" link
        Then I see "Fixed Penalty details" on the page header
        When I click the "Review Account" button
        Then I see "Check fixed penalty account details" on the page header

        # PO-861 AC3 - Delete Account button navigation
        When I click on the "Delete account" link
        Then I see "Are you sure you want to delete this account?" on the page header

