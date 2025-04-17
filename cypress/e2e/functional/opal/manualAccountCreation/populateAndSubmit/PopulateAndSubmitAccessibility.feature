Feature: Accessibility Tests for Populate and Submit Screens
    # This feature file ensures that all screens that can't be covered elsewhere in the Populate and Submit flow meet accessibility standards using Axe-Core.

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
        Then I am on the dashboard

    Scenario: Pages Not Covered - Axe Core
        Then I check accessibility

        #Scenario: Manual Account Creation - Axe Core
        Given I navigate to Manual Account Creation
        And I enter "West London" into the business unit search box
        And I select the "Fine" radio button
        And I select the "Adult or youth only" radio button
        Then I check accessibility

        # Scenario: Account Details - Axe Core
        Then I click the "Continue" button
        Then I check accessibility

        # Scenario: Check Account - Axe Core
        # Court Details
        Then I click on the "Court details" link
        And I see "Court details" on the page header

        When I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box
        And I enter "1234" into the "Prosecutor Case Reference (PCR)" field
        And I enter "bridport" into the "Enforcement court" search box

        Then I click the "Return to account details" button

        Then I see the status of "Court details" is "Provided"

        # Personal Details
        Then I click on the "Personal details" link
        And I see "Personal details" on the page header

        When I select "Mr" from the "Title" dropdown
        And I enter "FNAME" into the "First names" field
        And I enter "LNAME" into the "Last name" field
        And I enter "Addr Line 1" into the "Address line 1" field
        And I enter "Addr Line 2" into the "Address line 2" field
        And I enter "Addr Line 3" into the "Address line 3" field
        And I enter "TE1 1ST" into the "Postcode" field
        And I enter "01/01/1990" into the Date of birth field
        And I enter "FORD FOCUS" into the "Make and model" field
        And I enter "AB12 CDE" into the "Registration number" field
        And I click the "Return to account details" button

        Then I see the status of "Personal details" is "Provided"

        # Offence Details
        And I click on the "Offence details" link
        Then I see "Add an offence" on the page header
        And I see "Offence details" text on the page

        When I enter "HY35014" into the "Offence code" field
        And I enter a date 8 weeks into the past into the "Date of sentence" date field

        And I enter "Costs (FCOST)" into the "Result code" field for imposition 1
        And I enter "500" into the "Amount imposed" field for imposition 1
        And I enter "250" into the "Amount paid" field for imposition 1
        And I select the "Minor creditor" radio button for imposition 1

        When I click on the "Add minor creditor details" link for imposition 1
        Then I see "Minor creditor details" on the page header
        And I select the "Company" radio button
        And I enter "CNAME" into the "Company" field
        Then I click the "Save" button

        When I click the "Review offence" button
        Then I see "Offences and impositions" on the page header
        When I click the "Return to account details" button
        And I see the status of "Offence details" is "Provided"

        # Payment Terms
        When I click on the "Payment terms" link
        And I see "Payment terms" on the page header

        When I select the "No" radio button under the "Has a collection order been made?" section
        And I select the "Make collection order today" checkbox
        And I select the "Lump sum plus instalments" radio button
        And I enter "150" into the "Lump sum" payment field
        And I enter "300" into the "Instalment" payment field
        And I select the "Monthly" radio button
        And I enter a date 2 weeks into the future into the "Start date" date field
        And I select the "Request payment card" checkbox

        And I select the "There are days in default" checkbox
        And I enter a date 1 weeks into the past into the "Date days in default were imposed" date field
        And I enter "100" into the days in default input field

        Then I select the "Add enforcement action" radio button
        And I select the "Hold enforcement on account (NOENF)" radio button
        And I enter "Reason" into the "Reason account is on NOENF" text field

        And I click the "Return to account details" button
        Then I see "Account details" on the page header
        Then I see the status of "Payment terms" is "Provided"

        # Check Account
        And I see the "Check account" button
        And I do not see "You cannot proceed until all required sections have been completed." text on the page

        When I click the "Check account" button
        Then I see "Check account details" on the page header
        Then I check accessibility

# Scenario: Submit for review - Axe Core
# When I click the "Submit for review" button and capture the created account number
# Then I see "You've submitted this account for review" text on the page
# Then I check accessibility


