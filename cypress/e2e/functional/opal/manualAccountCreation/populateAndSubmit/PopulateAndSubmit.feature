Feature: Manual account creation - Create Draft Account
    # Placeholder for refactored e2e tests

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
        Then I am on the dashboard

    Scenario: Verify capitalization is applied correctly on the "Check Account Details" page for Company Details
        Given I navigate to Manual Account Creation
        And I enter "West London" into the business unit search box
        And I select the "Fine" radio button
        And I select the "Company" radio button
        Then I click the "Continue" button

        # Court Details
        Then I click on the "Court details" link
        And I see "Court details" on the page header

        When I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box

        # Test For Capitalization in PCR @PO-1450
        When I enter "abcd1234a" into the "Prosecutor Case Reference (PCR)" field
        Then I see "ABCD1234A" in the "Prosecutor Case Reference (PCR)" field

        When I enter "bridport" into the "Enforcement court" search box

        Then I click the "Return to account details" button

        Then I see the status of "Court details" is "Provided"

        # Offence Details
        And I click on the "Offence details" link
        Then I see "Add an offence" on the page header
        And I see "Offence details" text on the page

        When I enter "HY35014" into the "Offence code" field
        And I enter a date 8 weeks into the past into the "Date of sentence" date field

        And I enter "Compensation (FCOMP)" into the "Result code" field for imposition 1
        And I enter "300" into the "Amount imposed" field for imposition 1
        And I enter "100" into the "Amount paid" field for imposition 1
        And I see "Add creditor" text on the page
        And I select the "Minor creditor" radio button
        When I click on the "Add minor creditor details" link for imposition 1
        Then I see "Minor creditor details" on the page header

        When I select the "Individual" radio button
        And I select "Mr" from the "Title" dropdown
        And I enter "FNAME" into the "First name" field

        # Test For Capitalization in Last Name @PO-1450
        When I enter "lname" into the "Last name" field
        Then I see "LNAME" in the "Last name" field

        And I enter "Addr1" into the "Address Line 1" field
        And I enter "Addr2" into the "Address Line 2" field
        And I enter "Addr3" into the "Address Line 3" field

        # Test Capitalization in Postcode @PO-1450
        When I enter "te1 1st" into the "Postcode" field
        Then I see "TE1 1ST" in the "Postcode" field


        Then I select the "I have BACS payment details" checkbox
        And I enter "F LNAME" into the "Name on the account" field
        And I enter "123456" into the "Sort code" field
        And I enter "12345678" into the "Account number" field

        # Test Capitalization in Payment Reference @PO-1450
        When I enter "ref" into the "Payment reference" field
        Then I see "REF" in the "Payment reference" field

        When I click the "Save" button
        Then I see "Add an offence" on the page header

        When I click the "Review offence" button
        Then I see "Offences and impositions" on the page header
        When I click the "Return to account details" button
        And I see the status of "Offence details" is "Provided"

        # Payment Terms
        When I click on the "Payment terms" link
        And I see "Payment terms" on the page header

        When I select the "Lump sum plus instalments" radio button
        And I enter "150" into the "Lump sum" payment field
        And I enter "300" into the "Instalment" payment field
        And I select the "Monthly" radio button
        And I enter a date 2 weeks into the future into the "Start date" date field

        When I select the "Hold enforcement on account (NOENF)" radio button
        And I enter "Reason" into the "Reason account is on NOENF" text field

        And I click the "Return to account details" button
        Then I see "Account details" on the page header
        Then I see the status of "Payment terms" is "Provided"

        # Company Details
        When I click on the "Company details" link
        # Test Capitalization in Company name @PO-1450
        When I enter "COMPANY NAME" into the "Company name" field
        Then I see "COMPANY NAME" in the "COMPANY NAME" field


        And I select the "Add company aliases" checkbox
        # Test Capitalization in Company Alias 1 @PO-1450
        When I set the "Alias 1", "Company name" to "Alias 1s"
        Then I see "Alias 1", "Company name" is set to "ALIAS 1S"

        And I click the "Add another alias" button

        # Test Capitalization in Company Alias 2 @PO-1450
        When I set the "Alias 2", "Company name" to "Alias 2s"
        Then I see "Alias 2", "Company name" is set to "ALIAS 2S"

        And I click the "Add another alias" button

        # Test Capitalization in Company Alias 3 @PO-1450
        When I set the "Alias 3", "Company name" to "Alias 3s"
        Then I see "Alias 3", "Company name" is set to "ALIAS 3S"

        And I click the "Add another alias" button

        # Test Capitalization in Company Alias 4 @PO-1450
        When I set the "Alias 4", "Company name" to "Alias 4s"
        Then I see "Alias 4", "Company name" is set to "ALIAS 4S"

        And I click the "Add another alias" button

        # Test Capitalization in Company Alias 5 @PO-1450
        When I set the "Alias 5", "Company name" to "Alias 5s"
        Then I see "Alias 5", "Company name" is set to "ALIAS 5S"

        And I enter "Addr1" into the "Address line 1" field
        And I enter "Addr2" into the "Address line 2" field
        And I enter "Addr3" into the "Address line 3" field

        # Test Capitalization in Postcode
        When I enter "te1 1st" into the "Postcode" field
        Then I see "TE1 1ST" in the "Postcode" field

        When I click the "Return to account details" button
        Then I see the status of "Company details" is "Provided"

        # Check Account
        When I see the "Check account" button
        Then I do not see "You cannot proceed until all required sections have been completed." text on the page

        When I click the "Check account" button
        Then I see "Check account details" on the page header

        Then I see the following in the "Court details" table:
            | Prosecutor Case Reference (PCR) | ABCD1234A |


        Then I see the following in the "Offence details" table:
            | Payment Reference | AB123456C |
            | Surname           | TE12 3ST  |
