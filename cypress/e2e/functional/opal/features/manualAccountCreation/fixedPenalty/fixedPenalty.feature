Feature: Manual fixed penalty account creation - Create Draft Account

  Rule: Adult or youth fixed penalty review
    Background:
      Given I am logged in with email "opal-test@hmcts.net"
      When I start a fixed penalty account for business unit "West London", defendant type "Adult or youth only" and originator type "New"
      And I complete fixed penalty details:
        | Section          | Field                  | Value                                 |
        | Court details    | Issuing Authority      | West London Magistrates' Court (2578) |
        | Court details    | Enforcement court      | Aram Court (123)                      |
        | Personal details | Title                  | Mr                                    |
        | Personal details | First names            | John                                  |
        | Personal details | Last name              | Smith{uniq}                           |
        | Personal details | Date of birth          | 01/01/1980                            |
        | Personal details | Address line 1         | 123 High Street                       |
        | Personal details | Postcode               | SW1A 1AA                              |
        | Offence details  | Notice number          | FPN1234                               |
        | Offence details  | Offence type           | Vehicle                               |
        | Offence details  | Date of offence        | 01/01/2023                            |
        | Offence details  | Offence code           | HY35014                               |
        | Offence details  | Time of offence        | 14:30                                 |
        | Offence details  | Place of offence       | Oxford Street - London                |
        | Offence details  | Amount imposed         | 150                                   |
        | Vehicle details  | Registration number    | AB12CDE                               |
        | Vehicle details  | Driving licence number | SMITH010123JS9AB                      |
      And I review the fixed penalty account

    @PO-857 @PO-861
    Scenario: Review shows fixed penalty details for adult or youth
      Then the fixed penalty review "Court details" summary is:
        | Label             | Value                                 |
        | Issuing Authority | West London Magistrates' Court (2578) |
        | Enforcement court | Aram Court (123)                      |
      And the fixed penalty review "Personal details" summary is:
        | Label         | Value           |
        | Title         | Mr              |
        | First names   | John            |
        | Last name     | Smith{uniq}     |
        | Date of birth | 01/01/1980      |
        | Address       | 123 High Street |
      And the fixed penalty review "Offence details" summary is:
        | Label            | Value                                    |
        | Notice Number    | FPN1234                                  |
        | Offence Type     | Vehicle                                  |
        | Offence code     | Riding a bicycle on a footpath (HY35014) |
        | Time of offence  | 14:30                                    |
        | Place of offence | Oxford Street - London                   |
        | Amount imposed   | £150.00                                  |

    @PO-861
    Scenario: Change links reopen adult or youth fixed penalty sections
      When I change the fixed penalty sections from review:
        | Section                             |
        | Issuing authority and court details |
        | Personal details                    |
        | Offence details                     |
        | Account comments and notes          |
      Then I should see the header containing text "Check fixed penalty account details"

    @PO-861
    Scenario: Back link returns to fixed penalty details
      When I return to fixed penalty details from review
      Then I should see the header containing text "Fixed Penalty details"

    @PO-861 @PO-1144
    Scenario: Delete account prompt can be cancelled for adult or youth
      When I request fixed penalty account deletion
      Then I should see the header containing text "Are you sure you want to delete this account?"
      When I cancel fixed penalty account deletion
      Then I should see the header containing text "Check fixed penalty account details"

    @PO-1796
    Scenario: Submit adult or youth fixed penalty for review
      When I submit the fixed penalty account for review and capture the draft account id
      Then I see the following text on the page "You've submitted this account for review"

    @PO-1796
    Scenario: Submission failure shows global error for adult or youth
      When I stub fixed penalty submission as failing with status 400
      And I submit the fixed penalty account for review
      Then I see the fixed penalty global error banner

  Rule: Fixed penalty cancel behaviour
    @PO-857
    Scenario: Cancel without entering details returns to start
      Given I am logged in with email "opal-test@hmcts.net"
      When I start a fixed penalty account for business unit "West London", defendant type "Adult or youth only" and originator type "New"
      And I cancel fixed penalty details choosing "Ok"
      Then I should see the header containing text "Create account"

    @PO-857
    Scenario: Cancel after entering details returns to start
      Given I am logged in with email "opal-test@hmcts.net"
      When I start a fixed penalty account for business unit "West London", defendant type "Adult or youth only" and originator type "New"
      And I complete fixed penalty details:
        | Section          | Field       | Value |
        | Personal details | Title       | Mr    |
        | Personal details | First names | John  |
      And I cancel fixed penalty details choosing "Ok"
      Then I should see the header containing text "Create account"

    @PO-857
    Scenario: Cancel after entering details keeps data on page
      Given I am logged in with email "opal-test@hmcts.net"
      When I start a fixed penalty account for business unit "West London", defendant type "Adult or youth only" and originator type "New"
      And I complete fixed penalty details:
        | Section          | Field       | Value |
        | Personal details | Title       | Mr    |
        | Personal details | First names | John  |
      And I cancel fixed penalty details choosing "Cancel"
      Then the fixed penalty details fields are:
        | Field       | Value |
        | Title       | Mr    |
        | First names | John  |

    @PO-857
    Scenario: Validation error persists after dismissing cancel warning
      Given I am logged in with email "opal-test@hmcts.net"
      When I start a fixed penalty account for business unit "West London", defendant type "Adult or youth only" and originator type "New"
      And I complete fixed penalty details:
        | Section          | Field                  | Value                        |
        | Court details    | Issuing Authority      | Lowestoft County Court (256) |
        | Court details    | Enforcement court      | Aram Court (123)             |
        | Personal details | Title                  | Mr                           |
        | Personal details | First names            | John                         |
        | Personal details | Last name              | Smith                        |
        | Personal details | Date of birth          | 01/01/2080                   |
        | Personal details | Address line 1         | 123 High Street              |
        | Personal details | Postcode               | SW1A 1AA                     |
        | Offence details  | Notice number          | FPN1234                      |
        | Offence details  | Offence type           | Vehicle                      |
        | Offence details  | Date of offence        | 01/01/2023                   |
        | Offence details  | Offence code           | HY35014                      |
        | Offence details  | Time of offence        | 14:30                        |
        | Offence details  | Place of offence       | Oxford Street - London       |
        | Offence details  | Amount imposed         | 150                          |
        | Vehicle details  | Registration number    | AB12CDE                      |
        | Vehicle details  | Driving licence number | SMITH010123JS9AB             |
      And I attempt to review the fixed penalty account
      Then I see a fixed penalty error "Enter a valid date of birth in the past" for "Date of birth"
      When I cancel fixed penalty details choosing "Cancel"
      Then I see a fixed penalty error "Enter a valid date of birth in the past" for "Date of birth"

  Rule: Fixed penalty route guard when navigating back
    @PO-857
    Scenario: Back navigation confirms leaving fixed penalty details
      Given I am logged in with email "opal-test@hmcts.net"
      When I start a fixed penalty account for business unit "West London", defendant type "Adult or youth only" and originator type "New"
      And I complete fixed penalty details:
        | Section          | Field          | Value |
        | Personal details | Title          | Mr    |
        | Personal details | First names    | John  |
        | Offence details  | Amount imposed | 150   |
      And I navigate back from fixed penalty details choosing "Ok"
      Then I should see the header containing text "Create account"

    @PO-857
    Scenario: Back navigation can be cancelled to stay on fixed penalty details
      Given I am logged in with email "opal-test@hmcts.net"
      When I start a fixed penalty account for business unit "West London", defendant type "Adult or youth only" and originator type "New"
      And I complete fixed penalty details:
        | Section          | Field          | Value |
        | Personal details | Title          | Mr    |
        | Personal details | First names    | John  |
        | Offence details  | Amount imposed | 150   |
      And I navigate back from fixed penalty details choosing "Cancel"
      Then the fixed penalty details fields are:
        | Field          | Value |
        | Title          | Mr    |
        | First names    | John  |
        | Amount imposed | 150   |

  Rule: Company fixed penalty review
    Background:
      Given I am logged in with email "opal-test@hmcts.net"
      When I start a fixed penalty account for business unit "West London", defendant type "Company" and originator type "New"
      And I complete fixed penalty details:
        | Section         | Field                  | Value                         |
        | Court details   | Issuing Authority      | undefined (052)               |
        | Court details   | Enforcement court      | Johns Maintenance Court (249) |
        | Company details | Company name           | Example Corp Ltd {uniq}       |
        | Company details | Address line 1         | 123 Business Park             |
        | Company details | Address line 2         | Commerce Way                  |
        | Company details | Postcode               | EC1A 1BB                      |
        | Offence details | Notice number          | CORP2025                      |
        | Offence details | Offence type           | Vehicle                       |
        | Offence details | Date of offence        | 05/07/2025                    |
        | Offence details | Offence code           | HY35014                       |
        | Offence details | Time of offence        | 10:15                         |
        | Offence details | Place of offence       | London Borough of Westminster |
        | Offence details | Amount imposed         | 500                           |
        | Vehicle details | Registration number    | CP12COR                       |
        | Vehicle details | Driving licence number | SMITH010123JS9AB              |
      And I review the fixed penalty account

    @PO-861
    Scenario: Review shows fixed penalty details for company
      Then the fixed penalty review "Court details" summary is:
        | Label             | Value                         |
        | Issuing Authority | undefined (052)               |
        | Enforcement court | Johns Maintenance Court (249) |
      And the fixed penalty review "Company details" summary is:
        | Label        | Value                   |
        | Company name | Example Corp Ltd {uniq} |
        | Address      | 123 Business Park       |
      And the fixed penalty review "Offence details" summary is:
        | Label            | Value                                    |
        | Notice Number    | CORP2025                                 |
        | Offence Type     | Vehicle                                  |
        | Offence code     | Riding a bicycle on a footpath (HY35014) |
        | Time of offence  | 10:15                                    |
        | Place of offence | London Borough of Westminster            |
        | Amount imposed   | £500.00                                  |
      And the fixed penalty review "Account comments and notes" summary is:
        | Label        | Value        |
        | Comment      | Not provided |
        | Account note | Not provided |

    @PO-861
    Scenario: Change links reopen company fixed penalty sections
      When I change the fixed penalty sections from review:
        | Section                             |
        | Issuing authority and court details |
        | Company details                     |
        | Offence details                     |
        | Account comments and notes          |
      Then I should see the header containing text "Check fixed penalty account details"

    @PO-861
    Scenario: Company back link returns to fixed penalty details
      When I return to fixed penalty details from review
      Then I should see the header containing text "Fixed Penalty details"

    @PO-861 @PO-1144
    Scenario: Delete account prompt can be cancelled for company
      When I request fixed penalty account deletion
      Then I should see the header containing text "Are you sure you want to delete this account?"
      When I cancel fixed penalty account deletion
      Then I should see the header containing text "Check fixed penalty account details"

    @PO-1796
    Scenario: Submit company fixed penalty for review
      When I submit the fixed penalty account for review and capture the draft account id
      Then I see the following text on the page "You've submitted this account for review"

    @PO-1796
    Scenario: Submission failure shows global error for company
      When I stub fixed penalty submission as failing with status 400
      And I submit the fixed penalty account for review
      Then I see the fixed penalty global error banner

    @PO-1800
    Scenario: Input user can view Fixed Penalty accounts in Create and Manage Draft Accounts
      Given I am logged in with email "opal-test@hmcts.net"
      And I stub fixed penalty draft account listings
      When I open Create and Manage Draft Accounts
      And I view the "In review" tab on the Create and Manage Draft Accounts page
      Then I see "Fixed Penalty" in the account type column on the draft table
      When I view the "Rejected" tab on the Create and Manage Draft Accounts page
      Then I see "Fixed Penalty" in the account type column on the draft table
      When I view the "Approved" tab on the Create and Manage Draft Accounts page
      Then I see "Fixed Penalty" in the account type column on the draft table
      When I view the "Deleted" tab on the Create and Manage Draft Accounts page
      Then I see "Fixed Penalty" in the account type column on the draft table


    @PO-1800
    Scenario: Checker user can view Fixed Penalty accounts in Check and Validate Draft Accounts
      Given I am logged in with email "opal-test-4@hmcts.net"
      And I stub fixed penalty draft account listings
      When I open Check and Validate Draft Accounts
      And I view the "To review" tab on the Check and Validate page
      Then I see "Fixed Penalty" in the account type column on the draft table
      When I view the "Rejected" tab on the Check and Validate page
      Then I see "Fixed Penalty" in the account type column on the draft table
      When I view the "Deleted" tab on the Check and Validate page
      Then I see "Fixed Penalty" in the account type column on the draft table
      When I view the "Failed" tab on the Check and Validate page
      Then I see "Fixed Penalty" in the account type column on the draft table
