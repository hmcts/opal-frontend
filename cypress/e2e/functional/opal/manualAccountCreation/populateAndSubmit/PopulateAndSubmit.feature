Feature: Manual account creation - Create Draft Account
    # Placeholder for refactored e2e tests

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
        Then I am on the dashboard
        Given I navigate to Manual Account Creation
        And I enter "West London" into the business unit search box
        And I select the "Fine" radio button

    Scenario: Verify capitalization is applied to all relevant fields and displayed correctly on the "Check Account Details" page for adult or youth only
        And I select the "Adult or youth only" radio button
        Then I click the "Continue" button

        # Court Details
        Then I click on the "Court details" link
        And I see "Court details" on the page header

        When I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box

        # Test For Capitalization in PCR - PO-1448
        When I enter "abcd1234a" into the "Prosecutor Case Reference (PCR)" field
        Then I see "ABCD1234A" in the "Prosecutor Case Reference (PCR)" field

        When I enter "bridport" into the "Enforcement court" search box

        Then I click the "Return to account details" button

        Then I see the status of "Court details" is "Provided"

        # Personal Details
        Then I click on the "Personal details" link
        And I see "Personal details" on the page header

        When I select "Mr" from the "Title" dropdown
        And I enter "FNAME" into the "First names" field

        # Test For Capitalization in Last Name - PO-1448
        When I enter "lname" into the "Last name" field
        Then I see "LNAME" in the "Last name" field


        When I enter "Addr Line 1" into the "Address line 1" field
        And I enter "Addr Line 2" into the "Address line 2" field
        And I enter "Addr Line 3" into the "Address line 3" field

        # Test For Capitalization in Post Code - PO-1448
        When I enter "te1 1st" into the "Postcode" field
        Then I see "TE1 1ST" in the "Postcode" field

        When I enter "01/01/1990" into the Date of birth field
        And I enter "FORD FOCUS" into the "Make and model" field

        # Test For Capitalization in VRN - PO-1448
        When I enter "ab12 cde" into the "Registration number" field
        Then I see "AB12 CDE" in the "Registration number" field

        # Test For Capitalization in National Insurance Number - PO-1448
        When I enter "qq123456c" into the "National insurance number" field
        Then I see "QQ123456C" in the "National insurance number" field

        When I select the "Add aliases" checkbox
        And I set the "Alias 1", "First names" to "Alias 1 FNAME"

        # Test For Capitalization in Alias 1 Last Name - PO-1448
        When I set the "Alias 1", "Last name" to "Alias 1 lname"
        Then I see "Alias 1", "Last name" is set to "ALIAS 1 LNAME"

        And I click the "Add another alias" button
        And I set the "Alias 2", "First names" to "Alias 2 FNAME"

        # Test For Capitalization in Alias 2 Last Name - PO-1448
        When I set the "Alias 2", "Last name" to "Alias 2 lname"
        Then I see "Alias 2", "Last name" is set to "ALIAS 2 LNAME"

        And I click the "Add another alias" button
        And I set the "Alias 3", "First names" to "Alias 3 FNAME"

        # Test For Capitalization in Alias 3 Last Name - PO-1448
        And I set the "Alias 3", "Last name" to "Alias 3 lname"
        Then I see "Alias 3", "Last name" is set to "ALIAS 3 LNAME"

        And I click the "Add another alias" button
        And I set the "Alias 4", "First names" to "Alias 4 FNAME"

        # Test For Capitalization in Alias 4 Last Name - PO-1448
        And I set the "Alias 4", "Last name" to "Alias 4 lname"
        Then I see "Alias 4", "Last name" is set to "ALIAS 4 LNAME"

        And I click the "Add another alias" button
        And I set the "Alias 5", "First names" to "Alias 5 FNAME"

        # Test For Capitalization in Alias 5 Last Name - PO-1448
        And I set the "Alias 5", "Last name" to "Alias 5 lname"
        Then I see "Alias 5", "Last name" is set to "ALIAS 5 LNAME"


        And I click the "Return to account details" button

        Then I see the status of "Personal details" is "Provided"

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

        # Test For Capitalization in Last Name - PO-1448
        When I enter "lname" into the "Last name" field
        Then I see "LNAME" in the "Last name" field

        And I enter "Addr1" into the "Address Line 1" field
        And I enter "Addr2" into the "Address Line 2" field
        And I enter "Addr3" into the "Address Line 3" field

        # Test Capitalization in Postcode - PO-1448
        When I enter "te1 1st" into the "Postcode" field
        Then I see "TE1 1ST" in the "Postcode" field


        Then I select the "I have BACS payment details" checkbox
        And I enter "F LNAME" into the "Name on the account" field
        And I enter "123456" into the "Sort code" field
        And I enter "12345678" into the "Account number" field

        # Test Capitalization in Payment Reference - PO-1448
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

        # Employer Details
        When I click on the "Employer details" link
        And I see "Employer details" on the page header

        And I enter "Test Corp" into the "Employer name" field

        # Test Capitalization in Employee Reference - PO-1448
        When I enter "ab123456c" into the "Employee reference" field
        Then I see "AB123456C" in the "Employee reference" field

        And I enter "employer@example.com" into the "Employer email address" field
        And I enter "01234567890" into the "Employer telephone" field
        And I enter "Addr1" into the "Address line 1" field
        And I enter "Addr2" into the "Address line 2" field
        And I enter "Addr3" into the "Address line 3" field
        And I enter "Addr4" into the "Address line 4" field
        And I enter "Addr5" into the "Address line 5" field

        # Test Capitalization in Postcode - PO-1448
        When I enter "te12 3st" into the "Postcode" field
        Then I see "TE12 3ST" in the "Postcode" field
        When I enter "te12 3st" into the "Postcode" field
        Then I see "TE12 3ST" in the "Postcode" field


        And I click the "Return to account details" button

        Then I see the status of "Employer details" is "Provided"



        # Check Account
        And I see the "Check account" button
        And I do not see "You cannot proceed until all required sections have been completed." text on the page

        When I click the "Check account" button
        Then I see "Check account details" on the page header

        Then I see the following in the "Court details" table:
            | Prosecutor Case Reference (PCR) | ABCD1234A |

        Then I see the following in the "Personal details" table:
            | Last name                 | LNAME                                                                                                                                       |
            | Postcode                  | TE1 1ST                                                                                                                                     |
            | Registration number       | AB12 CDE                                                                                                                                    |
            | National Insurance number | QQ123456C                                                                                                                                   |
            | Alias                     | Alias 1 FNAME ALIAS 1 LNAME Alias 2 FNAME ALIAS 2 LNAME Alias 3 FNAME ALIAS 3 LNAME Alias 4 FNAME ALIAS 4 LNAME Alias 5 FNAME ALIAS 5 LNAME |

        Then I see the following in the "Employee details" table:
            | Employee Reference | AB123456C |
            | Postcode           | TE12 3ST  |

        Then I see the following in the "Offence details" table:
            | Payment Reference | AB123456C |
            | Surname           | TE12 3ST  |


        Then I see the following in the "Offence details" table:
            | Payment Reference | AB123456C |
            | Surname           | TE12 3ST  |

    Scenario: Verify capitalization is applied to all relevant fields and displayed correctly on the "Check Account Details" page for AYPG
        And I select the "Adult or youth with parent or guardian to pay" radio button
        And I click the "Continue" button

        # Court Details
        Then I click on the "Court details" link
        And I see "Court details" on the page header

        When I enter "Bedfordshire" into the "Sending area or Local Justice Area (LJA)" search box

        # Test For Capitalization in PCR - PO-1449 for PCR field
        When I enter "abcd1234a" into the "Prosecutor Case Reference (PCR)" field
        Then I see "ABCD1234A" in the "Prosecutor Case Reference (PCR)" field

        When I enter "ACTON (820)" into the "Enforcement court" search box

        Then I click the "Return to account details" button

        #Parent or Guardian details
        And I click on the "Parent or guardian details" link
        And I see "Parent or guardian details" on the page header

        And I enter "FNAME" into the "First names" field
        When I enter "1 Address Street" into the "Address line 1" field

        # Test For Capitalization in Last Name, Postcode & National Insurance Number - PO-1449
        When I enter "lname" into the "Last name" field
        Then I see "LNAME" in the "Last name" field

        When I enter "rg12 8eu" into the "Postcode" field
        Then I see "RG12 8EU" in the "Postcode" field

        When I enter "ab122398b" into the "National insurance number" field
        Then I see "AB122398B" in the "National insurance number" field

        When I select the "Add aliases" checkbox
        And I set the "Alias 1", "First names" to "Alias 1 FNAME"

        # Test For Capitalization in Alias 1 Last Name - PO-1449
        When I set the "Alias 1", "Last name" to "Alias 1 lname"
        Then I see "Alias 1", "Last name" is set to "ALIAS 1 LNAME"

        And I click the "Add another alias" button
        And I set the "Alias 2", "First names" to "Alias 2 FNAME"

        # Test For Capitalization in Alias 2 Last Name - PO-1449
        When I set the "Alias 2", "Last name" to "Alias 2 lname"
        Then I see "Alias 2", "Last name" is set to "ALIAS 2 LNAME"

        And I click the "Add another alias" button
        And I set the "Alias 3", "First names" to "Alias 3 FNAME"

        # Test For Capitalization in Alias 3 Last Name - PO-1449
        And I set the "Alias 3", "Last name" to "Alias 3 lname"
        Then I see "Alias 3", "Last name" is set to "ALIAS 3 LNAME"

        And I click the "Add another alias" button
        And I set the "Alias 4", "First names" to "Alias 4 FNAME"

        # Test For Capitalization in Alias 4 Last Name - PO-1449
        And I set the "Alias 4", "Last name" to "Alias 4 lname"
        Then I see "Alias 4", "Last name" is set to "ALIAS 4 LNAME"

        And I click the "Add another alias" button
        And I set the "Alias 5", "First names" to "Alias 5 FNAME"

        # Test For Capitalization in Alias 5 Last Name - PO-1449
        And I set the "Alias 5", "Last name" to "Alias 5 lname"
        Then I see "Alias 5", "Last name" is set to "ALIAS 5 LNAME"


        And I click the "Return to account details" button

        Then I see the status of "Parent or guardian details" is "Provided"

        #Employer details
        Then I click on the "Employer details" link
        Then I see "Employer details" on the page header

        When I enter "XYZ company" into the "Employer name" field
        When I enter "1 Address Street" into the "Address line 1" field

        # Test For Capitalization in Postcode & National Insurance Number - PO-1449
        When I enter "rg12 8eu" into the "Postcode" field
        Then I see "RG12 8EU" in the "Postcode" field

        When I enter "ab122398b" into the "National insurance number" field
        Then I see "AB122398B" in the "National insurance number" field

        And I click the "Return to account details" button

        Then I see the status of "Employer details" is "Provided"

        # Personal Details
        Then I click on the "Personal details" link
        And I see "Personal details" on the page header

        When I select "Miss" from the "Title" dropdown
        And I enter "FNAME" into the "First names" field
        When I enter "1 Address Street" into the "Address line 1" field

        # Test For Capitalization in Last Name, Postcode & National Insurance Number - PO-1449
        When I enter "lname" into the "Last name" field
        Then I see "LNAME" in the "Last name" field

        When I enter "rg12 8eu" into the "Postcode" field
        Then I see "RG12 8EU" in the "Postcode" field

        When I enter "ab122398b" into the "National insurance number" field
        Then I see "AB122398B" in the "National insurance number" field

        When I select the "Add aliases" checkbox
        And I set the "Alias 1", "First names" to "Alias 1 FNAME"

        # Test For Capitalization in Alias 1 Last Name - PO-1449
        When I set the "Alias 1", "Last name" to "Alias 1 lname"
        Then I see "Alias 1", "Last name" is set to "ALIAS 1 LNAME"

        And I click the "Add another alias" button
        And I set the "Alias 2", "First names" to "Alias 2 FNAME"

        # Test For Capitalization in Alias 2 Last Name - PO-1449
        When I set the "Alias 2", "Last name" to "Alias 2 lname"
        Then I see "Alias 2", "Last name" is set to "ALIAS 2 LNAME"

        And I click the "Add another alias" button
        And I set the "Alias 3", "First names" to "Alias 3 FNAME"

        # Test For Capitalization in Alias 3 Last Name - PO-1449
        And I set the "Alias 3", "Last name" to "Alias 3 lname"
        Then I see "Alias 3", "Last name" is set to "ALIAS 3 LNAME"

        And I click the "Add another alias" button
        And I set the "Alias 4", "First names" to "Alias 4 FNAME"

        # Test For Capitalization in Alias 4 Last Name - PO-1449
        And I set the "Alias 4", "Last name" to "Alias 4 lname"
        Then I see "Alias 4", "Last name" is set to "ALIAS 4 LNAME"

        And I click the "Add another alias" button
        And I set the "Alias 5", "First names" to "Alias 5 FNAME"

        # Test For Capitalization in Alias 5 Last Name - PO-1449
        And I set the "Alias 5", "Last name" to "Alias 5 lname"
        Then I see "Alias 5", "Last name" is set to "ALIAS 5 LNAME"


        And I click the "Return to account details" button

        Then I see the status of "Personal details" is "Provided"

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

        # Test For Capitalization in Last Name - PO-1449
        When I enter "lname" into the "Last name" field
        Then I see "LNAME" in the "Last name" field

        # Test Capitalization in Postcode - PO-1448
        When I enter "ne13 8ed" into the "Postcode" field
        Then I see "NE13 8ED" in the "Postcode" field

        Then I select the "I have BACS payment details" checkbox
        And I enter "F LNAME" into the "Name on the account" field
        And I enter "123456" into the "Sort code" field
        And I enter "12345678" into the "Account number" field

        # Test Capitalization in Payment Reference - PO-1449
        When I enter "ref123ab" into the "Payment reference" field
        Then I see "REF123AB" in the "Payment reference" field

        When I click the "Save" button
        Then I see "Add an offence" on the page header

        When I click the "Review offence" button
        Then I see "Offences and impositions" on the page header
        When I click the "Return to account details" button
        And I see the status of "Offence details" is "Provided"

        # Payment Terms
        When I click on the "Payment terms" link
        And I see "Payment terms" on the page header

        When I select the "No" radio button under the "Has a collection order been made?" section
        And I select the "Make collection order today" checkbox
        And I select the "Pay in full" radio button
        And I enter "01/04/2025" into the "Enter pay by date" date field

        And I click the "Return to account details" button
        Then I see "Account details" on the page header
        Then I see the status of "Payment terms" is "Provided"


        # Check Account
        And I see the "Check account" button
        And I do not see "You cannot proceed until all required sections have been completed." text on the page

        When I click the "Check account" button
        Then I see "Check account details" on the page header

        Then I see the following in the "Court details" table:
            | Prosecutor Case Reference (PCR) | ABCD1234A |

        Then I see the following in the "Parent or guardian details" table:
            | Last name                 | LNAME                                                                                                                                       |
            | Postcode                  | RG12 8EU                                                                                                                                    |
            | National Insurance number | AB122398B                                                                                                                                   |
            | Alias                     | Alias 1 FNAME ALIAS 1 LNAME Alias 2 FNAME ALIAS 2 LNAME Alias 3 FNAME ALIAS 3 LNAME Alias 4 FNAME ALIAS 4 LNAME Alias 5 FNAME ALIAS 5 LNAME |


        Then I see the following in the "Personal details" table:
            | Last name                 | LNAME                                                                                                                                       |
            | Postcode                  | RG12 8EU                                                                                                                                    |
            | National Insurance number | AB122398B                                                                                                                                   |
            | Alias                     | Alias 1 FNAME ALIAS 1 LNAME Alias 2 FNAME ALIAS 2 LNAME Alias 3 FNAME ALIAS 3 LNAME Alias 4 FNAME ALIAS 4 LNAME Alias 5 FNAME ALIAS 5 LNAME |

        Then I see the following in the "Employer details" table:
            | Employee Reference | AB122398B |
            | Postcode           | RG12 8EU  |

        Then I see the following in the "Offences and impositions" table:
            | Payment Reference | REF123AB |
            | Surname           | LNAME    |










