Feature: Fixed Penalty Failed Account Validation (PO-1816)
    As a checker user
    I want to view and validate failed Fixed Penalty draft accounts
    So that I can ensure the Check and Validate journey works for Fixed Penalty accounts

    Background:
        Given I am logged in with email "opal-test@HMCTS.NET"
        And I clear all approved draft accounts

    @PO-1816 @only
    Scenario: AC1 & AC1a - View Fixed Penalty accounts in Failed tab with correct data display
        # Create individual Fixed Penalty account with failed status using the failed payload
        Given I create a "failedAdultOrYouthOnly" draft account with the following details and set status "Publishing Pending":
            | Account_status                          | Submitted              |
            | account.defendant.forenames             | Micheal                |
            | account.defendant.surname               | FOLLY                  |
            | account.defendant.email_address_1       | micheas.folly@test.com |
            | account.defendant.telephone_number_home | 02078259314            |
            | account.account_type                    | Fixed Penalty          |
            | account.defendant.dob                   | 2002-05-15             |

        Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
        Then I am on the dashboard
        Given I navigate to Check and Validate Draft Accounts
        And I see "Review accounts" on the page header

        # # Navigate to Failed tab
        And I navigate to the "Failed" tab
        Then I see a table with the headings:
            | Defendant     |
            | Date of birth |
            | Created       |
            | Account type  |
            | Business unit |
            | Submitted by  |

        # AC1ai - Verify defendant name format: <LAST NAME>, <forenames> for individual defendants
        And I see "FOLLY, Micheal" is present in column "Defendant"
        # AC1aii - Verify Date of Birth - displayed as 'DD MMM YYYY' for individual defendants
        And I see "15 May 2002" is present in column "Date of birth"
        #AC1aiii -
        And I see "Fixed Penalty" is present in column "Account type"
        And I see "Camberwell Green" is present in column "Business unit"
        And I see "opal-test" is present in column "Submitted by"

        When I click on the "FOLLY, Micheal" link
        Then I verify all Fixed Penalty Failed account summary sections and values are displayed in order


    @PO-1816
    Scenario: AC2 - Navigate to Failed draft account details screen for individual defendant
        # Create individual Fixed Penalty account with failed status using the failed payload
        Given I create a failed "adultOrYouthOnly" draft account with the following details and set status "Publishing Failed":
            | Account_status                          | Submitted                      |
            | account.defendant.forenames             | John                           |
            | account.defendant.surname               | AccDetailSurname               |
            | account.defendant.email_address_1       | John.AccDetailSurname@test.com |
            | account.defendant.telephone_number_home | 02078259314                    |
            | account.account_type                    | Fixed Penalty                  |
            | account.defendant.dob                   | 2002-05-15                     |
            | account.defendant.title                 | Mr                             |
            | account.defendant.address_line_1        | Street                         |

        # Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
        # Then I am on the dashboard
        # Given I navigate to Check and Validate Draft Accounts
        # And I navigate to the "Failed" tab

        # Click on defendant name hyperlink to navigate to failed draft account details
        # When I click on the "SMITHFAILED, James" link

        # # AC2a - Verify error banner message
        # Then I see "There was a problem publishing this account. Please contact your line manager." text on the page

        # # AC2b - Verify defendant name in bold format: <LAST NAME>, <forenames>
        # Then I see "Mr James SMITHFAILED" text on the page

        # # AC2c - Verify red status label 'Failed'
        # Then I see "Failed" text on the page

        # AC2d - Verify Review History section
        Then I see "Review history" text on the page
        And I see "Submitted by opal-test" text on the page
        And I see "21 May 2025" text on the page
        And I see "Publishing Failed by L077JG" text on the page
        And I see "21 November 2025" text on the page

        # AC2e - Verify data summary tables are displayed
        # Business unit section
        Then I see "Business unit" text on the page
        And I see "Camberwell Green" text on the page

        # Account type section
        And I see "Account type" text on the page
        And I see "Fixed Penalty" text on the page

        # Defendant type section
        And I see "Defendant type" text on the page
        And I see "Adult or youth only" text on the page

        # Issuing authority and court details section
        And I see "Issuing authority and court details" text on the page
        And I see "Issuing Authority" text on the page
        And I see "Aberdeen JP Court (9251)" text on the page
        And I see "Enforcement court" text on the page
        And I see "Court 777 Camberwell CH09 (777)" text on the page

        # Personal details section
        And I see "Personal details" text on the page
        And I see "Title" text on the page
        And I see "Mr" text on the page
        And I see "First names" text on the page
        And I see "James" text on the page
        And I see "Last name" text on the page
        And I see "SMITHFAILED" text on the page
        And I see "Date of birth" text on the page
        And I see "15 May 2002 (Adult)" text on the page
        And I see "Address" text on the page
        And I see "Street" text on the page

        # Offence Details section
        And I see "Offence Details" text on the page
        And I see "Notice Number" text on the page
        And I see "Offence Type" text on the page
        And I see "Vehicle" text on the page
        And I see "Registration number" text on the page
        And I see "Driving licence number" text on the page
        And I see "Notice to hirer or owner number (NTH/NTH)" text on the page
        And I see "Date notice to owner was issued" text on the page
        And I see "Date of offence" text on the page
        And I see "Offence code" text on the page
        And I see "Time of offence" text on the page
        And I see "Place of offence" text on the page
        And I see "Amount imposed" text on the page

        # Account comments and notes section
        And I see "Account comments and notes" text on the page
        And I see "Comment" text on the page
        And I see "Account note" text on the page



    @PO-1816
    Scenario: AC2 - Navigate to Failed draft account details screen for company defendant
        # Create company Fixed Penalty account with failed status using default payload (no failed company payload available)
        Given I create a "company" draft account with the following details and set status "Publishing Failed":
            | Account_status                          | Submitted                      |
            | account.defendant.company_name          | TEST Fixed-Penalty-Company-Ltd |
            | account.defendant.email_address_1       | company@test.com               |
            | account.defendant.telephone_number_home | 02078259314                    |
            | account.account_type                    | Fixed Penalty                  |
            | account.defendant.address_line_1        | Company Street                 |

        Given I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
        Then I am on the dashboard
        Given I navigate to Check and Validate Draft Accounts
        And I navigate to the "Failed" tab

        # Click on company name hyperlink to navigate to failed draft account details
        When I click on the "TEST Fixed-Penalty-Company-Ltd" link

        # AC2a - Verify error banner message
        Then I see "There was a problem publishing this account. Please contact your line manager." text on the page

        # AC2b - Verify company name in bold format: <company name>
        Then I see "TEST Fixed-Penalty-Company-Ltd" text on the page

        # AC2c - Verify red status label 'Failed'
        Then I see "Failed" text on the page

        # AC2d - Verify Review History section
        Then I see "Review history" text on the page
        And I see "Submitted by opal-test" text on the page
        And I see "Publishing Failed by L077JG" text on the page

        # AC2e - Verify data summary tables are displayed for company
        Then I see "Business unit" text on the page
        And I see "Camberwell Green" text on the page
        And I see "Account type" text on the page
        And I see "Fixed Penalty" text on the page
        And I see "Defendant type" text on the page
        And I see "Company" text on the page



