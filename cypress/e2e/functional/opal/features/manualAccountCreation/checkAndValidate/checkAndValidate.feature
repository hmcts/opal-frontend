Feature: Navigate and edit sections from task list

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I open Create and Manage Draft Accounts

  @PO-640 @PO-618
  Scenario: View all rejected accounts navigation
    Given I create a "company" draft account with the following details and set status "Rejected":
      | account.defendant.company_name | TEST Rejected-PO-640-company |

    When I view the "Rejected" tab on the Create and Manage Draft Accounts page
    And I view all rejected draft accounts
    Then I should see the header containing text "All rejected accounts"

    When I return to the rejected accounts tab
    Then I should see the header containing text "Create accounts"

  @PO-640 @PO-618
  Scenario: Rejected company account can be edited and resubmitted
    Given I create a "company" draft account with the following details and set status "Rejected":
      | account.defendant.company_name | TEST Rejected-PO-640-company |

    When I view the "Rejected" tab on the Create and Manage Draft Accounts page
    And I open the draft account for defendant "TEST Rejected-PO-640-company"
    Then I should see the header containing text "TEST Rejected-PO-640-company"

    And I complete manual account creation with the following fields and defaults for account header "TEST Rejected-PO-640-company":
      | Section                    | Field                                    | Value                     |
      | Court details              | Sending area or Local Justice Area (LJA) | Avon                      |
      | Court details              | Prosecutor Case Reference (PCR)          | abcd1234a                 |
      | Court details              | Enforcement court                        | ATCM Test (828)           |
      | Company details            | Company name                             | TEST COMPANY LTD          |
      | Company details            | Address line 1                           | Addr1                     |
      | Company details            | Address line 2                           | Addr2                     |
      | Company details            | Address line 3                           | Addr3                     |
      | Company details            | Postcode                                 | TE1 1ST                   |
      | Company details            | Alias 1                                  | ALIAS 1                   |
      | Company details            | Alias 2                                  | ALIAS 2                   |
      | Contact details            | Primary email address                    | P@EMAIL.COM               |
      | Contact details            | Secondary email address                  | S@EMAIL.COM               |
      | Contact details            | Mobile telephone number                  | 07123 456 789             |
      | Contact details            | Home telephone number                    | 07123 456 789             |
      | Contact details            | Work telephone number                    | 07123 456 789             |
      | Payment terms              | Payment term                             | Lump sum plus instalments |
      | Payment terms              | Lump sum amount                          | 150                       |
      | Payment terms              | Instalment amount                        | 50                        |
      | Payment terms              | Payment frequency                        | Monthly                   |
      | Payment terms              | Start date                               | 2 weeks in the future     |
      | Account comments and notes | Comment                                  | This is a test comment    |
      | Account comments and notes | Note                                     |                           |

    Then the task statuses for account header "TEST COMPANY LTD" are:
      | Court details              | Provided |
      | Company details            | Provided |
      | Contact details            | Provided |
      | Payment terms              | Provided |
      | Account comments and notes | Provided |

    When I check the manual account details for account header "TEST COMPANY LTD"
    Then I see the manual review "Court details" summary:
      | Sending area or Local Justice Area (LJA) | Avon & Somerset Magistrates' Court (1450) |
      | Prosecutor Case Reference (PCR)          | ABCD1234A                                 |
      | Enforcement court                        | ATCM Test (828)                           |
    And I see the manual review "Company details" summary:
      | Company name | TEST COMPANY LTD             |
      | Address      | Addr1  Addr2  Addr3  TE1 1ST |
      | Aliases      | ALIAS 1  ALIAS 2             |
    And I see the manual review "Contact details" summary:
      | Primary email address   | P@EMAIL.COM   |
      | Secondary email address | S@EMAIL.COM   |
      | Mobile telephone number | 07123 456 789 |
      | Home telephone number   | 07123 456 789 |
      | Work telephone number   | 07123 456 789 |
    And the manual review offence table contains:
      | imposition | creditor                 | amountImposed | amountPaid | balanceRemaining |
      | Costs      | TFL2 ATCM Testing (TFL2) | 122           | 10         | 112              |
    And I see the manual review "Payment terms" summary:
      | Payment terms | Lump sum plus instalments |
      | Lump sum      | £150                      |
      | Instalment    | £50                       |
      | Frequency     | Monthly                   |
    And I see the manual review "Account comments and notes" summary:
      | Comment | This is a test comment |

    When I submit the manual account for review
    Then I should see the header containing text "Create accounts"

  @PO-640
  Scenario: Rejected adult or youth account can be edited and resubmitted
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Rejected":
      | account.defendant.surname   | TEST                             |
      | account.defendant.forenames | Rejected-PO-640-AdultOrYouthOnly |

    When I view the "Rejected" tab on the Create and Manage Draft Accounts page
    And I open the draft account for defendant "TEST, Rejected-PO-640-AdultOrYouthOnly"
    Then I should see the header containing text "Mr Rejected-PO-640-AdultOrYouthOnly TEST"

    When I complete manual account creation with the following fields and defaults for account header "Mr Rejected-PO-640-AdultOrYouthOnly TEST":
      | Section                    | Field                                    | Value                               |
      | Court details              | Sending area or Local Justice Area (LJA) | Avon                                |
      | Court details              | Prosecutor Case Reference (PCR)          | abcd1234a                           |
      | Court details              | Enforcement court                        | ATCM Test (828)                     |
      | Personal details           | Title                                    | Mr                                  |
      | Personal details           | First names                              | FNAME                               |
      | Personal details           | Last name                                | lname                               |
      | Personal details           | Address line 1                           | Addr1                               |
      | Personal details           | Postcode                                 | te1 1st                             |
      | Personal details           | Date of birth                            | 01/01/1990                          |
      | Personal details           | Make and model                           | FORD FOCUS                          |
      | Personal details           | Registration number                      | ab12 cde                            |
      | Personal details           | National insurance number                | qq123456c                           |
      | Contact details            | Primary email address                    | P@EMAIL.COM                         |
      | Contact details            | Secondary email address                  | S@EMAIL.COM                         |
      | Contact details            | Mobile telephone number                  | 07123 456 789                       |
      | Contact details            | Home telephone number                    | 07123 456 789                       |
      | Contact details            | Work telephone number                    | 07123 456 789                       |
      | Employer details           | Employer name                            | Test Corp                           |
      | Employer details           | Employee reference                       | ab123456c                           |
      | Employer details           | Employer email address                   | employer@example.com                |
      | Employer details           | Employer telephone                       | 01234567890                         |
      | Employer details           | Address line 1                           | Addr1                               |
      | Employer details           | Address line 2                           | Addr2                               |
      | Employer details           | Address line 3                           | Addr3                               |
      | Employer details           | Postcode                                 | te12 3st                            |
      | Payment terms              | Collection order                         | No                                  |
      | Payment terms              | Make collection order today              | true                                |
      | Payment terms              | Payment term                             | Lump sum plus instalments           |
      | Payment terms              | Lump sum amount                          | 150                                 |
      | Payment terms              | Instalment amount                        | 50                                  |
      | Payment terms              | Payment frequency                        | Monthly                             |
      | Payment terms              | Start date                               | 2 weeks in the future               |
      | Payment terms              | Request payment card                     | Yes                                 |
      | Payment terms              | There are days in default                | Yes                                 |
      | Payment terms              | Date days in default were imposed        | 1 weeks in the past                 |
      | Payment terms              | Default days                             | 100                                 |
      | Payment terms              | Add enforcement action                   | Yes                                 |
      | Payment terms              | Enforcement action option                | Hold enforcement on account (NOENF) |
      | Payment terms              | Enforcement reason                       | Reason                              |
      | Account comments and notes | Comment                                  | This is a test comment              |
      | Account comments and notes | Note                                     |                                     |

    When I check the manual account details for account header "FNAME LNAME"
    Then I see the manual review "Court details" summary:
      | Sending area or Local Justice Area (LJA) | Avon & Somerset Magistrates' Court (1450) |
      | Prosecutor Case Reference (PCR)          | ABCD1234A                                 |
      | Enforcement court                        | ATCM Test (828)                           |
    And I see the manual review "Defendant details" summary:
      | Title                     | Mr                      |
      | First names               | FNAME                   |
      | Last name                 | LNAME                   |
      | Address                   | Addr1  TE1 1ST          |
      | Date of birth             | 01 January 1990 (Adult) |
      | Vehicle make and model    | FORD FOCUS              |
      | National Insurance number | QQ 12 34 56 C           |
      | Registration number       | AB12 CDE                |
    And I see the manual review "Contact details" summary:
      | Primary email address   | P@EMAIL.COM   |
      | Secondary email address | S@EMAIL.COM   |
      | Mobile telephone number | 07123 456 789 |
      | Home telephone number   | 07123 456 789 |
      | Work telephone number   | 07123 456 789 |
    And the manual review offence table contains:
      | imposition | creditor                 | amountImposed | amountPaid | balanceRemaining |
      | Costs      | TFL2 ATCM Testing (TFL2) | 125           | 10         | 115              |
    And I see the manual review "Payment terms" summary:
      | Has a collection order been made? | No                                  |
      | Make collection order today       | Yes                                 |
      | Payment terms                     | Lump sum plus instalments           |
      | Lump sum                          | £150                                |
      | Instalment                        | £50                                 |
      | Frequency                         | Monthly                             |
      | Request payment card              | Yes                                 |
      | Days in default                   | 100 days                            |
      | Enforcement action                | Hold enforcement on account (NOENF) |
      | Reason account is on NOENF        | Reason                              |
    And I see the manual review "Employer details" summary:
      | Employer name          | Test Corp                     |
      | Employee reference     | AB123456C                     |
      | Employer email address | employer@example.com          |
      | Employer telephone     | 01234567890                   |
      | Employer address       | Addr1  Addr2  Addr3  TE12 3ST |
    And I see the manual review "Account comments and notes" summary:
      | Comment | This is a test comment |

    When I submit the manual account for review
    Then I should see the header containing text "Create accounts"

  @PO-640
  Scenario: Rejected parent or guardian to pay account can be edited and resubmitted
    Given I create a "pgToPay" draft account with the following details and set status "Rejected":
      | account.defendant.surname   | TEST                    |
      | account.defendant.forenames | Rejected-PO-640-pgToPay |

    When I view the "Rejected" tab on the Create and Manage Draft Accounts page
    And I open the draft account for defendant "TEST, Rejected-PO-640-pgToPay"
    Then I should see the header containing text "Miss Rejected-PO-640-pgToPay TEST"

    When I complete manual account creation with the following fields and defaults for account header "Miss Rejected-PO-640-pgToPay TEST":
      | Section                    | Field                                    | Value                     |
      | Court details              | Sending area or Local Justice Area (LJA) | Avon                      |
      | Court details              | Prosecutor Case Reference (PCR)          | abcd1234a                 |
      | Court details              | Enforcement court                        | Aram Court (123)          |
      | Personal details           | Title                                    | Miss                      |
      | Personal details           | First names                              | fname                     |
      | Personal details           | Last name                                | lname                     |
      | Personal details           | Address line 1                           | Addr1                     |
      | Personal details           | Postcode                                 | rg12 8eu                  |
      | Personal details           | Date of birth                            | 01/01/2010                |
      | Personal details           | National insurance number                | AB122398B                 |
      | Parent or guardian         | First names                              | parent fname              |
      | Parent or guardian         | Last name                                | parent lname              |
      | Parent or guardian         | Date of birth                            | 01/01/1980                |
      | Parent or guardian         | National Insurance number                | QW123456C                 |
      | Parent or guardian         | Address line 1                           | Addr1                     |
      | Parent or guardian         | Address line 2                           | Addr2                     |
      | Parent or guardian         | Address line 3                           | Addr3                     |
      | Parent or guardian         | Postcode                                 | AB12 3CD                  |
      | Parent or guardian         | Vehicle make                             | Ford Focus                |
      | Parent or guardian         | Registration number                      | AB12 CDE                  |
      | Parent or guardian         | addAliases                               | true                      |
      | Parent or guardian         | alias1.firstNames                        | alias fname               |
      | Parent or guardian         | alias1.lastName                          | alias lname               |
      | Contact details            | Primary email address                    | P@EMAIL.COM               |
      | Contact details            | Secondary email address                  | S@EMAIL.COM               |
      | Contact details            | Mobile telephone number                  | 07123 456 789             |
      | Contact details            | Home telephone number                    | 07123 456 789             |
      | Contact details            | Work telephone number                    | 07123 456 789             |
      | Employer details           | Employer name                            | XYZ Company               |
      | Employer details           | Employee reference                       | ab123456c                 |
      | Employer details           | Employer email address                   | employer@example.com      |
      | Employer details           | Employer telephone                       | 01234567890               |
      | Employer details           | Address line 1                           | Employer Addr1            |
      | Employer details           | Address line 2                           | Employer Addr2            |
      | Employer details           | Address line 3                           | Employer Addr3            |
      | Employer details           | Postcode                                 | TE12 3ST                  |
      | Payment terms              | Payment term                             | Lump sum plus instalments |
      | Payment terms              | Lump sum amount                          | 150                       |
      | Payment terms              | Instalment amount                        | 50                        |
      | Payment terms              | Payment frequency                        | Monthly                   |
      | Payment terms              | Start date                               | 2 weeks in the future     |
      | Account comments and notes | Comment                                  | This is a test comment    |
      | Account comments and notes | Note                                     |                           |

    When I check the manual account details for account header "fname lname"
    Then I see the manual review "Court details" summary:
      | Sending area or Local Justice Area (LJA) | Avon & Somerset Magistrates' Court (1450) |
      | Prosecutor Case Reference (PCR)          | ABCD1234A                                 |
      | Enforcement court                        | Aram Court (123)                          |
    And I see the manual review "Defendant details" summary:
      | Title                     | Miss                    |
      | First names               | fname                   |
      | Last name                 | LNAME                   |
      | Address                   | Addr1  RG12 8EU         |
      | Date of birth             | 01 January 2010 (Youth) |
      | National Insurance number | AB 12 23 98 B           |
    And I see the manual review "Parent or guardian details" summary:
      | Forenames                 | parent fname                  |
      | Surname                   | PARENT LNAME                  |
      | Aliases                   | alias fname ALIAS LNAME       |
      | Date of birth             | 01 January 1980               |
      | National Insurance number | QW 12 34 56 C                 |
      | Address                   | Addr1  Addr2  Addr3  AB12 3CD |
      | Vehicle make and model    | Ford Focus                    |
      | Registration number       | AB12 CDE                      |
    And I see the manual review "Contact details" summary:
      | Primary email address   | P@EMAIL.COM   |
      | Secondary email address | S@EMAIL.COM   |
      | Mobile telephone number | 07123 456 789 |
      | Home telephone number   | 07123 456 789 |
      | Work telephone number   | 07123 456 789 |
    And the manual review offence table contains:
      | Imposition   | Creditor       | Amount imposed | Amount paid | Balance remaining |
      | Compensation | Mr FNAME LNAME | 300            | 100         | 200               |
    And I see the manual review "Payment terms" summary:
      | Payment terms | Lump sum plus instalments |
      | Lump sum      | £150                      |
      | Instalment    | £50                       |
      | Frequency     | Monthly                   |
    And I see the manual review "Employer details" summary:
      | Employer name          | XYZ Company                                              |
      | Employee reference     | AB123456C                                                |
      | Employer email address | employer@example.com                                     |
      | Employer telephone     | 01234567890                                              |
      | Employer address       | Employer Addr1  Employer Addr2  Employer Addr3  TE12 3ST |
    And I see the manual review "Account comments and notes" summary:
      | Comment | This is a test comment |

    When I submit the manual account for review
    Then I should see the header containing text "Create accounts"

  @PO-640
  Scenario: Back navigation confirms before leaving a rejected account
    Given I create a "company" draft account with the following details and set status "Rejected":
      | account.defendant.company_name | TEST Rejected-PO-640-BackButton |

    When I view the "Rejected" tab on the Create and Manage Draft Accounts page
    And I open the draft account for defendant "TEST Rejected-PO-640-BackButton"
    Then I should see the header containing text "TEST Rejected-PO-640-BackButton"

    When I view the "Court details" task for "TEST Rejected-PO-640-BackButton"
    And I complete manual court details:
      | Prosecutor Case Reference (PCR) | Updated PCR |
    When I return to account details

    When I go back to Create and Manage Draft Accounts
    Then I should see the header containing text "Create accounts"

    When I view the "Rejected" tab on the Create and Manage Draft Accounts page
    And I open the draft account for defendant "TEST Rejected-PO-640-BackButton"
    Then I should see the header containing text "TEST Rejected-PO-640-BackButton"

    When I view the "Court details " task for "TEST Rejected-PO-640-BackButton"
    And I complete manual court details:
      | Prosecutor Case Reference (PCR) | Another PCR Update |
    When I return to account details

    When I go back to Create and Manage Draft Accounts
    Then I should see the header containing text "Create accounts"

  @PO-607
  Scenario: Approved tab lists recent accounts
    Given I create a "company" approved account with the following details:
      | account_snapshot.defendant_name | TEST New Company Ltd |
    And I create a "adultOrYouthOnly" approved account with the following details:
      | account_snapshot.defendant_name | Smith, James |

    When I view the "Approved" tab on the Create and Manage Draft Accounts page
    Then I should see the header containing text "Create accounts"
    Then the manual draft table row 1 has values:
      | Account       | FP123456             |
      | Defendant     | TEST New Company Ltd |
      | Date of birth | -                    |
      | Approved      | days ago             |
      | Account type  | Fixed Penalty        |
      | Business unit | Business Unit B      |
    And the manual draft table row 2 has values:
      | Account       | FINE123456      |
      | Defendant     | Smith, James    |
      | Date of birth | 15 May 1990     |
      | Approved      | days ago        |
      | Account type  | Fine            |
      | Business unit | Business Unit A |

  @PO-1804
  Scenario: Fixed penalty individual accounts are accessible from In Review drafts
    Given I create a "fixedPenalty" draft account with the following details and set status "In review":
      | account.defendant.forenames | FakeFixed |
      | account.defendant.surname   | FAKELAST  |

    When I view the "In Review" tab on the Create and Manage Draft Accounts page
    When I open the draft account in row containing "FAKELAST, FakeFixed" in the manual draft column "Defendant"
    Then I should see the header containing text "Mr FakeFixed FAKELAST"

  @PO-1804
  Scenario: Fixed penalty company accounts are accessible from In Review drafts
    Given I create a "fixedPenaltyCompany" draft account with the following details and set status "In review":
      | account.defendant.company_name | TestFixedPenaltyCompany |

    When I view the "In Review" tab on the Create and Manage Draft Accounts page
    When I open the draft account in row containing "TestFixedPenaltyCompany" in the manual draft column "Defendant"
    Then I should see the header containing text "TestFixedPenaltyCompany"
