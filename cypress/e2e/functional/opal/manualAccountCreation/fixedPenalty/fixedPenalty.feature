Feature: Manual fixed penalty account creation - Create Draft Account

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
    Then I am on the dashboard
    Then I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fixed Penalty" radio button

  @PO-857 @PO-861 @PO-1796 @PO-1144
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
    And I enter "Oxford Street - London" into the "Place of offence" text field
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
    And I see "Riding a bicycle on a footpath (HY35014)" in the Offence code field

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

    # PO-861 AC3 - Delete Account button navigation also covers PO-1144 AC1, AC2, AC3
    When I click on the "Delete account" link
    Then I see "Are you sure you want to delete this account?" on the page header
    And I click on the "No - cancel" link

    Then I see "Check fixed penalty account details" on the page header

    # PO-1796 AC1
    When I click the "Submit for review" button and capture the created account number
    Then I see "You've submitted this account for review" text on the page

    # PO-1796 AC2
    When I go back in the browser
    Given I intercept the POST request for a draft account to ensure it returns a 400 error

    When I click the "Submit for review" button

    Then I should see the global error banner



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

  @PO-861 @PO-1796 @PO-1144
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

    # PO-861 AC3 - Delete Account button navigation also covers PO-1144 AC1, AC2, AC3 for Company Defendant
    When I click on the "Delete account" link
    Then I see "Are you sure you want to delete this account?" on the page header
    And I click on the "No - cancel" link
    Then I see "Check fixed penalty account details" on the page header

    # PO-1796 AC1
    When I click the "Submit for review" button and capture the created account number
    Then I see "You've submitted this account for review" text on the page

    # PO-1796 AC2
    When I go back in the browser
    Given I intercept the POST request for a draft account to ensure it returns a 400 error

    When I click the "Submit for review" button

    Then I should see the global error banner

  @only @PO-1809
  Scenario: Validate users amend and resubmit a rejected draft Fixed Penalty account

    And I clear the business unit search box
    And I enter "Camberwell green" into the business unit search box


    When I select the "Adult or youth only" radio button
    And I click the "Continue" button
    Then I see "Fixed Penalty details" on the page header

    # Fill in court details
    And I enter "Central London County Court (372)" into the Issuing Authority search box
    And I enter "Court 777 Camberwell CH09 (777)" into the Enforcement court search box

    # Fill in personal details
    When I select "Mr" from the "Title" dropdown
    And I enter "John" into the "First names" field
    And I enter "Smith" into the "Last name" field
    And I enter "01/01/1980" into the "Date of birth" date field
    And I enter "123 High Street" into the "Address line 1" field
    And I enter "SW1A 1AA" into the "Postcode" field

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
    And I click the "Review Account" button

    # Verify navigation to 'Check account details' screen
    Then I see "Check fixed penalty account details" on the page header
    When I click the "Submit for review" button and capture the created account number
    Then I see "You've submitted this account for review" text on the page

    # Sign out and sign in as a different user to review and reject the account
    And I click the Sign out link
    When I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
    Then I am on the dashboard
    Then I navigate to Check and Validate Draft Accounts
    And I see "Review accounts" on the page header
    And I click on the "SMITH, John" link
    Then I see "Mr John SMITH" on the page header
    And the account status is "In review"
    And I select the "Reject" radio button
    And I enter "Testing review history" into the "Enter reason for rejection" text field
    And I click on continue button
    And I see "Review accounts" on the page header

    # PO-1809 AC2 - 'Reason for rejection' screen displays Fixed Penalty Details data
    Then I see "You have rejected John SMITH's account." text on the page


    # Sign out and sign back in as a creator to amend and resubmit the rejected account
    When I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    And I navigate to Create and Manage Draft Accounts
    Then I click on the "Rejected" link

    # PO-1809 AC1 - Navigate to 'Reason for rejection' screen when selecting defendant name hyperlink
    And I click on the "SMITH, John" link


    # PO-1809 AC2a - Fixed Penalty Details form is pre-populated with existing data
    When I click on the "Change" link
    And I enter "HY80508" into the "Offence code" field
    And I enter "This is a test comment" into the "Add comment" text field

    # PO-1809 AC3 - Data persisted and navigate to 'Check Fixed Penalty Details' screen
    And I click the "Review Account" button
    Then I see "Check fixed penalty account details" on the page header

    # PO-1809 AC3a - 'Check Fixed Penalty Details' screen displays updated summary data
    Then I see "Appeal against the issue of a notice under section 165 of the Highways Act 1980 (HY80508)" in the Offence code field
    And I see "This is a test comment" in the Account comments and notes section
    When I click the "Submit for review" button
    Then I see "You have submitted John SMITH's account for review." text on the page


