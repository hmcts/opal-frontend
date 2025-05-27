Feature: Accessibility Tests for Check and Validate Screens
    # This feature file ensures that all screens in the Check and Validate flow meet accessibility standards using Axe-Core.

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard

    Scenario: Draft Account List, Account Details, and Check and Validate Sections - Axe Core
        Then I check accessibility

        # Draft Account List screen - Axe Core
        Given I navigate to Create and Manage Draft Accounts
        # Then I check accessibility

        # Create a draft account with rejected status for testing
        Given I create a "company" draft account with the following details:
            | account.defendant.company_name | TEST Accessibility-Check |
        When I update the last created draft account with status "Rejected"
        Then I click on the "Rejected" link
        Then I click on the "TEST Accessibility-Check" link

        # Account Details screen - Axe Core
        And I see the "Check and submit" section heading
        Then I check accessibility

        # Court Details section - Axe Core
        When I click on the "Court details" link
        Then I see "Court details" on the page header
        Then I check accessibility

        When I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box
        When I enter "abcd1234a" into the "Prosecutor Case Reference (PCR)" field
        When I enter "Aram Court (100)" into the "Enforcement court" search box
        When I click the "Return to account details" button

        # Company Details section - Axe Core
        When I click on the "Company details" link
        Then I see "Company details" on the page header
        Then I check accessibility

        When I enter "TEST COMPANY LTD" into the "Company name" field
        And I select the "Add company aliases" checkbox
        And I set the "Alias 1", "Company name" to "ALIAS 1"
        And I enter "Addr1" into the "Address line 1" field
        And I enter "Addr2" into the "Address line 2" field
        And I enter "Addr3" into the "Address line 3" field
        And I enter "TE1 1ST" into the "Postcode" field
        Then I click the "Return to account details" button

        # Contact Details section - Axe Core
        When I click on the "Contact details" link
        Then I see "Defendant contact details" on the page header
        Then I check accessibility

        When I enter "P@EMAIL.COM" into the "Primary email address" field
        And I enter "S@EMAIL.COM" into the "Secondary email address" field
        And I enter "07123 456 789" into the "Mobile telephone number" field
        And I enter "07123 456 789" into the "Home telephone number" field
        And I enter "07123 456 789" into the "Work telephone number" field
        Then I click the "Return to account details" button

        # Offence Details section - Axe Core
        When I click on the "Offence details" link
        Then I see "Offences and impositions" on the page header
        Then I check accessibility

        When I click on the "Change" link
        Then I see "Add an offence" on the page header
        Then I check accessibility

        When I enter "HY35014" into the "Offence code" field
        And I enter a date 8 weeks into the past into the "Date of sentence" date field
        When I click the "Review offence" button
        When I click the "Return to account details" button

        # Payment Terms section - Axe Core
        When I click on the "Payment terms" link
        And I see "Payment terms" on the page header
        Then I check accessibility

        When I select the "No" radio button under the "Has a collection order been made?" section
        And I select the "Make collection order today" checkbox
        And I select the "Lump sum plus instalments" radio button
        And I enter "150" into the "Lump sum" payment field
        And I enter "300" into the "Instalment" payment field
        And I select the "Monthly" radio button
        And I enter a date 2 weeks into the future into the "Start date" date field
        Then I click the "Return to account details" button

        # Account Comments and Notes section - Axe Core
        When I click on the "Account comments and notes" link
        Then I see "Account comments and notes" on the page header
        Then I check accessibility

        When I enter "This is a test comment for accessibility testing" into the "Account notes" text area
        Then I click the "Return to account details" button

        # Check Account screen - Axe Core
        And I see the "Check account" button
        When I click the "Check account" button
        Then I see "Check account details" on the page header
        Then I check accessibility

        # Submit for review screen - Axe Core
        When I click the "Submit for review" button and capture the created account number
        Then I see "You've submitted this account for review" text on the page
        Then I check accessibility