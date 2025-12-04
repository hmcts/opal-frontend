Feature: Fixed Penalty Failed Account Validation (PO-1816)
    As a checker user
    I want to view and validate failed Fixed Penalty draft accounts
    So that I can ensure the Check and Validate journey works for Fixed Penalty accounts

    Background:
        Given I am logged in with email "opal-test@HMCTS.NET"
        And I clear all approved draft accounts

    @PO-1816
    Scenario: AC1 & AC1a - View Fixed Penalty accounts in Failed tab with correct data display
        # Create individual Fixed Penalty account with failed status using the failed payload
        Given I create a "failedAdultOrYouthOnly" draft account with the following details and set status "Publishing Pending":
            | Account_status              | failed |
            | account.defendant.forenames | Oliver |
            | account.defendant.surname   | GREEN  |

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
        And I see "GREEN, Oliver" is present in column "Defendant"
        # AC1aii - Verify Date of Birth - displayed as 'DD MMM YYYY' for individual defendants
        And I see "01 Nov 2004" is present in column "Date of birth"
        And I see "Today" is present in column "Date failed"
        # AC1aiii - Verify Account type - displayed as 'Fixed Penalty' for individual defendants
        And I see "Fixed Penalty" is present in column "Account type"
        And I see "Camberwell Green" is present in column "Business unit"
        And I see "opal-test" is present in column "Submitted by"

        When I click on the "GREEN, Oliver" link
        And I see "Mr Oliver GREEN" on the page header
        #PO-2463 Ensure the Back button navigates to the "Review Accounts" page under the "Failed" tab for fixed penalty defendant
        When "Back" is clicked
        And I see "Review accounts" on the page header


    @PO-1816
    Scenario: AC2 - Navigate to Failed draft account details screen for company defendant
        # Create company Fixed Penalty account with failed status using default payload (no failed company payload available)
        Given I create a "failedCompany" draft account with the following details and set status "Publishing Pending":
            | Account_status                 | Submitted                     |
            | account.defendant.company_name | Argent Oak Solutions Ltd comp |
            | account.account_type           | Fixed Penalty                 |

        And I am on the Opal Frontend and I sign in as "opal-test-10@HMCTS.NET"
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
        And I see "Argent Oak Solutions Ltd comp" is present in column "Defendant"
        # AC1aiii - Verify Date of Birth - blank for company defendants
        And I see "—" is present in column "Date of birth"

        And I see "Today" is present in column "Date failed"
        # AC1aiii - Verify Account type - displayed as 'Fixed Penalty' for individual defendants
        And I see "Fixed Penalty" is present in column "Account type"
        And I see "Camberwell Green" is present in column "Business unit"
        And I see "opal-test" is present in column "Submitted by"

        When I click on the "Argent Oak Solutions Ltd comp" link
        And I see "Argent Oak Solutions Ltd comp" on the page header
        #PO-2463 Ensure the Back button navigates to the "Review Accounts" page under the "Failed" tab for fixed penalty company defendant
        When "Back" is clicked
        And I see "Review accounts" on the page header



