Feature: PO-6 Navigate and edit sections from task list

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard

        Given I navigate to Create and Manage Draft Accounts

    @PO-640
    Scenario: AC8 - Navigate, edit and save data within account sections


        Given I create a "company" draft account with the following details:
            | account.defendant.company_name | TEST Rejected-PO-640 |
        When I update the last created draft account with status "Rejected"

        Then I click on the "Rejected" link
        Then I click on the "TEST Rejected-PO-640" link

        And I see "TEST Rejected-PO-640" on the page header
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

        # Test cancel functionality with unsaved changes - temporarily disabled
        # When I click on the "Court details" link
        # Then I see "Court details" on the page header
        # When I enter "Test" into the "Prosecutor Case Reference (PCR)" field
        # And I click on the "Cancel" link
        # Then I see "You have unsaved changes" text on the page
        # When I click the "Continue without saving" button
        # Then I see the "Check and submit" section heading

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

        # Test cancel functionality with unsaved changes - temporarily disabled
        # When I click on the "Company details" link
        # Then I see "Company details" on the page header
        # When I enter "CHANGED COMPANY LTD" into the "Company name" field
        # And I click on the "Cancel" link
        # Then I see "You have unsaved changes" text on the page
        # When I click the "Continue without saving" button
        # Then I see the "Check and submit" section heading

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

        # Test cancel functionality for Contact Details - temporarily disabled
        # When I click on the "Contact details" link
        # Then I see "Contact details" on the page header
        # When I enter "12345678901" into the "Phone number" field
        # And I click on the "Cancel" link
        # Then I see "You have unsaved changes" text on the page
        # When I click the "Continue without saving" button
        # Then I see the "Check and submit" section heading

        # Offence Details section
        When I click on the "Offence details" link
        Then I see "Offences and impositions" on the page header

        When I click on the "Change" link

        When I enter "HY35014" into the "Offence code" field
        And I enter a date 8 weeks into the past into the "Date of sentence" date field

        When I click the "Review offence" button
        When I click the "Return to account details" button
        Then I see the "Check and submit" section heading
        Then I see the status of "Offence details" is "Provided"

        # Test cancel functionality for Offence Details - temporarily disabled
        # When I click on the "Offence details" link
        # Then I see "Offence details" on the page header
        # When I enter "Test Date" into the "Date Offence" field
        # And I click on the "Cancel" link
        # Then I see "You have unsaved changes" text on the page
        # When I click the "Continue without saving" button
        # Then I see the "Check and submit" section heading

        # Payment Terms section
        When I click on the "Payment terms" link
        And I see "Payment terms" on the page header
        And I select the "Lump sum plus instalments" radio button
        And I enter "150" into the "Lump sum" payment field
        And I enter "50" into the "Instalment" payment field
        And I select the "Monthly" radio button
        And I enter a date 2 weeks into the future into the "Start date" date field
        When I click the "Return to account details" button
        Then I see the status of "Payment terms" is "Provided"

        # Test cancel functionality for Payment Terms - temporarily disabled
        # When I click on the "Payment terms" link
        # Then I see "Payment terms" on the page header
        # When I select "Collection Order" from the "Payment type" dropdown
        # And I click on the "Cancel" link
        # Then I see "You have unsaved changes" text on the page
        # When I click the "Continue without saving" button
        # Then I see the "Check and submit" section heading

        # Account Comments and Notes section
        When I click on the "Account comments and notes" link
        Then I see "Account comments and notes" on the page header
        And I enter "This is a test comment" into the "Add comment" text field
        When I click the "Return to account details" button
        Then I see the "Check and submit" section heading
        And I see the status of "Account comments and notes" is "Provided"

        # Test cancel functionality for Account Comments - temporarily disabled
        # When I click on the "Account comments and notes" link
        # Then I see "Account comments and notes" on the page header
        # When I enter "Test comment" into the "Comments" field
        # And I click on the "Cancel" link
        # Then I see "You have unsaved changes" text on the page
        # When I click the "Continue without saving" button
        # Then I see the "Check and submit" section heading

        # Final check and verification
        When I click the "Check account" button
        Then I see "Check account details" on the page header

        Then I see the following in the "Court details" table:
            | Sending area or Local Justice Area (LJA) | Avon & Somerset Magistrates' Court (1450) |
            | Prosecutor Case Reference (PCR)          | ABCD1234A                                 |
            | Enforcement court                        | Aram Court (100)                          |

        Then I see the following in the "Company details" table:
            | Company name | TEST COMPANY LTD             |
            | Address      | Addr1  Addr2  Addr3  TE1 1ST |
            | Aliases      | ALIAS 1  ALIAS 2             |

        Then I see the following in the "Contact details" table:
            | Primary email address   | P@EMAIL.COM   |
            | Secondary email address | S@EMAIL.COM   |
            | Mobile telephone number | 07123 456 789 |
            | Home telephone number   | 07123 456 789 |
            | Work telephone number   | 07123 456 789 |

        Then I see the following details for imposition 1 in the Offences and impositions table:
            | imposition       | Compensation                    |
            | creditor         | Crown Prosecution Service (DPP) |
            | amountImposed    | 122                             |
            | amountPaid       | 10                              |
            | balanceRemaining | 112                             |

        Then I see the following in the "Payment terms" table:
            | Payment terms | Lump sum plus instalments |
            | Lump sum      | £150                      |
            | Instalment    | £50                       |
            | Frequency     | Monthly                   |

        Then I see the following in the "Account comments and notes" table:
            | Comment | This is a test comment |


        When I click the "Submit for review" button on Rejected Account
        Then I see "Account submitted" on the page header
    @PO-657
    Scenario: AC.8, AC.9 & AC.10 View account details of rejected account, A/Y only

        And I remove all draft accounts
        And I create a "adultOrYouthOnly" draft account with the following details:
            | Account_status              | Rejected |
            | account.defendant.forenames | FNAME    |
            | account.defendant.surname   | LNAME    |
        And I update the last created draft account with status "Rejected"
        And I click on the "Rejected" link
        And I click on the "LNAME, FNAME" link
        Then I see "Mr FNAME LNAME" on the page header

        #Test back link

        When I click the "Check account" button
        And I see "Check account details" on the page header
        And I click on the "Back" link
        Then I see "Mr FNAME LNAME" on the page header
        And I see "Test reason" text on the page

        When I click the "Check account" button
        And I click on the "Change" link in the "Court details" table
        Then I see "Mr FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Personal details" table
        Then I see "Mr FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Contact details" table
        Then I see "Mr FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Employer details" table
        Then I see "Mr FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Offences and impositions" table
        Then I see "Mr FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Payment terms" table
        Then I see "Mr FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Account comments and notes" table
        Then I see "Mr FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click the "Submit for review" button

    @PO-657
    Scenario: AC.8, AC.9 & AC.10 View account details of rejected account, A/Y with parent/guardian to pay

        And I remove all draft accounts
        And I create a "parentOrGuardianToPay" draft account with the following details:
            | Account_status | Rejected |
        And I update the last created draft account with status "Rejected"
        And I click on the "Rejected" link
        And I click on the "LNAME, FNAME" link
        Then I see "Miss FNAME LNAME" on the page header

        #Test back link

        When I click the "Check account" button
        And I see "Check account details" on the page header
        And I click on the "Back" link
        Then I see "Miss FNAME LNAME" on the page header
        And I see "Test reason" text on the page

        When I click the "Check account" button
        And I click on the "Change" link in the "Court details" table
        Then I see "Miss FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Parent or guardian details" table
        Then I see "Miss FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Contact details" table
        Then I see "Miss FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Employer details" table
        Then I see "Miss FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Defendant details" table
        Then I see "Miss FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Offences and impositions" table
        Then I see "Miss FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Payment terms" table
        Then I see "Miss FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Account comments and notes" table
        Then I see "Miss FNAME LNAME" on the page header

        When I click the "Check account" button
        And I click the "Submit for review" button

    @PO-657
    Scenario: AC.8, AC.9 & AC.10 View account details of rejected account, Company

        And I remove all draft accounts
        And I create a "company" draft account with the following details:
            | Account_status | Rejected |
        And I update the last created draft account with status "Rejected"
        And I click on the "Rejected" link
        And I click on the "TEST Rejected" link
        Then I see "TEST Rejected" on the page header
        And the account status is "Rejected"

        #Test back link

        When I click the "Check account" button
        And I see "Check account details" on the page header
        And I click on the "Back" link
        Then I see "TEST Rejected" on the page header
        And I see "Test reason" text on the page

        When I click the "Check account" button
        And I click on the "Change" link in the "Court details" table
        Then I see "TEST Rejected" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Company details" table
        Then I see "TEST Rejected" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Contact details" table
        Then I see "TEST Rejected" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Offences and impositions" table
        Then I see "TEST Rejected" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Payment terms" table
        Then I see "TEST Rejected" on the page header

        When I click the "Check account" button
        And I click on the "Change" link in the "Account comments and notes" table
        Then I see "TEST Rejected" on the page header

        When I click the "Check account" button
        And I click the "Submit for review" button

    @PO-610
    Scenario: View the details of an account in review

        And I remove all draft accounts
        And I create a "adultOrYouthOnly" draft account with the following details:
            | Account_status                          | Submitted                 |
            | account.defendant.forenames             | Larry                     |
            | account.defendant.surname               | Lincoln                   |
            | account.defendant.email_address_1       | larry.lincoln@outlook.com |
            | account.defendant.telephone_number_home | 02078219385               |
        And I reload the page
        And I click on the "Lincoln, Larry" link
        Then I see "Mr Larry LINCOLN" on the page header
        And the account status is "In review"
        And I see the following in the "Court details" table:
            | Sending area or Local Justice Area (LJA) | Aberdeen JP Court (9251) |

        And I see the following in the "Personal details" table:
            | First name | Larry   |
            | Last name  | Lincoln |
            | Address    | Street  |

        And I see the following in the "Contact details" table:
            | Primary email address   | larry.lincoln@outlook.com |
            | Secondary email address | —                         |
            | Home telephone number   | 02078219385               |

        And I see the following in the "Employer details" table:
            | Employer name | — |

        And I see the following in the "Payment terms" table:
            | Payment terms | Pay in full |
            | Pay by date   | 30 May 2025 |

        And I see the following in the "Account comments and notes" table:
            | Comment      | — |
            | Account note | — |
