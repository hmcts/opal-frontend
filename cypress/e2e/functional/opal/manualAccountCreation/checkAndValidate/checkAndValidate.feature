Feature: PO-6 Navigate and edit sections from task list

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard

        Given I navigate to Create and Manage Draft Accounts


    @PO-6
    Scenario: AC8 - Navigate, edit and save data within account sections for a company account

        Given I intercept reference data for offence details
        Given I create a "company" draft account with the following details:
            | account_status | Rejected |
        When I update the last created draft account with status "Rejected"

        Then I click on the "Rejected" link
        Then I click on the "TEST Rejected" link

        And I see the "Check and submit" section heading
        And I see the status of "Court details" is "Provided"
        And I see the status of "Company details" is "Provided"
        And I see the status of "Contact details" is "Not provided"
        And I see the status of "Offence details" is "Provided"
        And I see the status of "Payment terms" is "Provided"
        And I see the status of "Account comments and notes" is "Not provided"

        # Court Details section
        When I click on the "Court details" link
        Then I see "Court details" on the page header
        When I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box
        When I enter "abcd1234a" into the "Prosecutor Case Reference (PCR)" field
        When I enter "Aram Court (100)" into the "Enforcement court" search box
        Then I see "ABCD1234A" in the "Prosecutor Case Reference (PCR)" field
        When I click the "Return to account details" button
        Then I see the "Check and submit" section heading
        And I see the status of "Court details" is "Provided"

        # Company Details section
        When I click on the "Company details" link
        Then I see "Company details" on the page header
        When I enter "TEST COMPANY LTD" into the "Company name" field
        And I select the "Add company aliases" checkbox
        And I set the "Alias 1", "Company name" to "ALIAS 1"
        And I select add another alias
        And I set the "Alias 2", "Company name" to "ALIAS 2"

        And I enter "Addr1" into the "Address line 1" field
        And I enter "Addr2" into the "Address line 2" field
        And I enter "Addr3" into the "Address line 3" field
        And I enter "TE1 1ST" into the "Postcode" field

        Then I see "TEST COMPANY LTD" in the "Company name" field
        Then I validate the "Add company aliases" checkbox is checked
        Then I see "Alias 1", "Company name" is set to "ALIAS 1"
        Then I see "Alias 2", "Company name" is set to "ALIAS 2"
        Then I see "Addr1" in the "Address line 1" field
        Then I see "Addr2" in the "Address line 2" field
        Then I see "Addr3" in the "Address line 3" field
        Then I see "TE1 1ST" in the "Postcode" field
        When I click the "Return to account details" button
        Then I see the "Check and submit" section heading
        And I see the status of "Company details" is "Provided"

        # Contact Details section
        When I click on the "Contact details" link
        Then I see "Defendant contact details" on the page header
        When I enter "P@EMAIL.COM" into the "Primary email address" field
        And I enter "S@EMAIL.COM" into the "Secondary email address" field
        And I enter "07123 456 789" into the "Mobile telephone number" field
        And I enter "07123 456 789" into the "Home telephone number" field
        And I enter "07123 456 789" into the "Work telephone number" field

        Then I see "P@EMAIL.COM" in the "Primary email address" field
        And I see "S@EMAIL.COM" in the "Secondary email address" field
        And I see "07123 456 789" in the "Mobile telephone number" field
        And I see "07123 456 789" in the "Home telephone number" field
        And I see "07123 456 789" in the "Work telephone number" field
        When I click the "Return to account details" button
        Then I see the "Check and submit" section heading
        And I see the status of "Contact details" is "Provided"

        # Offence Details section
        When I click on the "Offence details" link
        Then I see "Offences and impositions" on the page header
        And I should see the offence code "HY35014" displayed
        And I should see the offence title "Test Offence" displayed
        And I should see the creditor name "Test Creditor" displayed
        And I should see the imposition "Compensation" displayed
        And I should see the amount imposed "122" displayed
        And I should see the amount paid "10" displayed
        And I should see the balance remaining "112" displayed
        When I click the "Return to account details" button
        Then I see the "Check and submit" section heading
        And I see the status of "Offence details" is "Provided"

        # Payment Terms section
        When I click on the "Payment terms" link
        And I see "Payment terms" on the page header
        And I select the "Lump sum plus instalments" radio button
        And I enter "150" into the "Lump sum" payment field
        And I enter "50" into the "Instalment" payment field
        And I select the "Monthly" radio button
        And I enter a date 2 weeks into the future into the "Start date" date field
        When I click the "Return to account details" button
        Then I see "Account details" on the page header
        Then I see the status of "Payment terms" is "Provided"

        # Account Comments and Notes section
        When I click on the "Account comments and notes" link
        Then I see "Account comments and notes" on the page header
        And I enter "This is a test comment for the account" into the "Add a comment" field
        When I click the "Return to account details" button
        Then I see the "Check and submit" section heading
        And I see the status of "Account comments and notes" is "Provided"

        # Final check and verification
        When I click the "Check account" button
        Then I see "Check account details" on the page header

        Then I see the following in the "Court details" table:
        Then I see the following in the "Company details" table:
        Then I see the following in the "Contact details" table:
        Then I see the following in the "Offence details" table:
        Then I see the following in the "Payment terms" table:
        Then I see the following in the "Account comments and notes" table:


