Feature: Navigate and edit sections from task list

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Create and Manage Draft Accounts

  @PO-640 @PO-618
  Scenario: AC8, AC9 - Navigate, edit and save data within account sections

    # Create a company account with rejected status for testing
    Given I create a "company" draft account with the following details:
      | account.defendant.company_name | TEST Rejected-PO-640-company |
    When I update the last created draft account with status "Rejected"

    Then I click on the "Rejected" link

    ### PO-618 AC1 - All rejected accounts navigation test ###
    When I click on the "view all rejected accounts" link
    Then I see "All rejected accounts" on the page header
    When I click on the "Back" link
    Then I see "Create accounts" on the page header

    ### Continue Rest of Test ###
    Then I click on the "TEST Rejected-PO-640-company" link

    And I see "TEST Rejected-PO-640" on the page header
    And I see the "Check and submit" section heading
    And I see the status of "Court details" is "Provided"
    And I see the status of "Company details" is "Provided"
    And I see the status of "Contact details" is "Provided"
    And I see the status of "Offence details" is "Provided"
    And I see the status of "Payment terms" is "Provided"
    And I see the status of "Account comments and notes" is "Not provided"

    # Court Details section
    When I click on the "Court details" link
    Then I see "Court details" on the page header
    When I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box
    When I enter "abcd1234a" into the "Prosecutor Case Reference (PCR)" field
    When I enter "ATCM Test (828)" into the "Enforcement court" search box
    Then I see "ABCD1234A" in the "Prosecutor Case Reference (PCR)" field
    When I click the "Return to account details" button
    Then I see the "Check and submit" section heading
    And I see the status of "Court details" is "Provided"

    # Test cancel functionality with unsaved changes for Court Details
    When I click on the "Court details" link
    Then I see "Court details" on the page header
    When I enter "Test" into the "Prosecutor Case Reference (PCR)" field
    Then I click Cancel, a window pops up and I click Ok
    Then I see the "Check and submit" section heading


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

    # Test cancel functionality with unsaved changes for Company Details
    When I click on the "Company details" link
    Then I see "Company details" on the page header
    When I enter "CHANGED COMPANY LTD" into the "Company name" field
    Then I click Cancel, a window pops up and I click Ok
    Then I see the "Check and submit" section heading

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

    # Test cancel functionality for Contact Details for Contact Details
    When I click on the "Contact details" link
    Then I see "Defendant contact details" on the page header
    When I enter "12345678901" into the "Phone number" field
    Then I click Cancel, a window pops up and I click Ok
    Then I see the "Check and submit" section heading

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

    # Test cancel functionality for Offence Details
    When I click on the "Offence details" link
    Then I see "Offences and impositions" on the page header
    When I click on the "Change" link
    When I enter "HY80508" into the "Offence code" field
    Then I click Cancel, a window pops up and I click Ok
    Then I click the "Return to account details" button
    Then I see the "Check and submit" section heading

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

    # Test cancel functionality for Payment Terms
    When I click on the "Payment terms" link
    Then I see "Payment terms" on the page header
    And I enter a date 8 weeks into the future into the "Start date" date field
    Then I click "Cancel", a window pops up and I click Ok
    Then I see the "Check and submit" section heading

    # Account Comments and Notes section
    When I click on the "Account comments and notes" link
    Then I see "Account comments and notes" on the page header
    And I enter "This is a test comment" into the "Add comment" text field
    When I click the "Return to account details" button
    Then I see the "Check and submit" section heading
    And I see the status of "Account comments and notes" is "Provided"

    # Test cancel functionality for Account Comments
    When I click on the "Account comments and notes" link
    Then I see "Account comments and notes" on the page header
    When I enter "Test comment" into the "Add comment" text field
    Then I click Cancel, a window pops up and I click Ok
    Then I see the "Check and submit" section heading

    # Final check and verification
    When I click the "Check account" button
    Then I see "Check account details" on the page header

    Then I see the following in the "Court details" table:
      | Sending area or Local Justice Area (LJA) | Avon & Somerset Magistrates' Court (1450) |
      | Prosecutor Case Reference (PCR)          | ABCD1234A                                 |
      | Enforcement court                        | ATCM Test (828)                           |

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
      | imposition       | Costs                    |
      | creditor         | TFL2 ATCM Testing (TFL2) |
      | amountImposed    | 122                      |
      | amountPaid       | 10                       |
      | balanceRemaining | 112                      |

    Then I see the following in the "Payment terms" table:
      | Payment terms | Lump sum plus instalments |
      | Lump sum      | £150                      |
      | Instalment    | £50                       |
      | Frequency     | Monthly                   |

    Then I see the following in the "Account comments and notes" table:
      | Comment | This is a test comment |


    When I click the "Submit for review" button
    Then I see "Create accounts" on the page header

    Then I click on the "In review" link

    # Create a adultOrYouthOnly account with rejected status for testing
    Given I create a "adultOrYouthOnly" draft account with the following details:
      | account.defendant.surname   | TEST                             |
      | account.defendant.forenames | Rejected-PO-640-AdultOrYouthOnly |
    When I update the last created draft account with status "Rejected"

    Then I click on the "Rejected" link
    Then I click on the "TEST, Rejected-PO-640-AdultOrYouthOnly" link

    And I see the "Check and submit" section heading
    And I see the status of "Court details" is "Provided"
    And I see the status of "Personal details" is "Provided"
    And I see the status of "Contact details" is "Not provided"
    And I see the status of "Offence details" is "Provided"
    And I see the status of "Payment terms" is "Provided"
    And I see the status of "Employer details" is "Not provided"
    And I see the status of "Account comments and notes" is "Not provided"

    # Court Details section
    When I click on the "Court details" link
    Then I see "Court details" on the page header
    When I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box
    When I enter "abcd1234a" into the "Prosecutor Case Reference (PCR)" field
    When I enter "ATCM Test (828)" into the "Enforcement court" search box
    Then I see "ABCD1234A" in the "Prosecutor Case Reference (PCR)" field
    When I click the "Return to account details" button
    Then I see the "Check and submit" section heading
    And I see the status of "Court details" is "Provided"

    # Personal Details section
    When I click on the "Personal details" link
    Then I see "Personal details" on the page header
    When I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "lname" into the "Last name" field
    Then I see "LNAME" in the "Last name" field
    And I enter "Addr1" into the "Address line 1" field
    And I enter "te1 1st" into the "Postcode" field
    Then I see "TE1 1ST" in the "Postcode" field
    And I enter "01/01/1990" into the Date of birth field
    And I see "Adult" in the date of birth panel
    And I enter "FORD FOCUS" into the "Make and model" field
    And I enter "ab12 cde" into the "Registration number" field
    Then I see "AB12 CDE" in the "Registration number" field
    And I enter "qq123456c" into the "National insurance number" field
    Then I see "QQ123456C" in the "National insurance number" field
    And I select the "Add aliases" checkbox
    And I set the "Alias 1", "First names" to "fname1"
    And I set the "Alias 1", "Last name" to "lname1"
    Then I see "Alias 1", "Last name" is set to "LNAME1"

    Then I click the "Return to account details" button
    And I see the "Check and submit" section heading
    And I see the status of "Personal details" is "Provided"

    # Test cancel functionality for Personal Details
    When I click on the "Personal details" link
    Then I see "Personal details" on the page header
    When I enter "Test Name" into the "First names" field
    Then I click Cancel, a window pops up and I click Ok
    Then I see the "Check and submit" section heading


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

    When I click on the "Change" link

    When I enter "HY35014" into the "Offence code" field
    And I enter a date 8 weeks into the past into the "Date of sentence" date field

    When I click the "Review offence" button
    When I click the "Return to account details" button
    Then I see the "Check and submit" section heading
    Then I see the status of "Offence details" is "Provided"

    # Payment Terms section
    When I click on the "Payment terms" link
    And I see "Payment terms" on the page header
    And I select the "No" radio button under the "Has a collection order been made?" section
    And I select the "Make collection order today" checkbox
    And I select the "Lump sum plus instalments" radio button
    And I enter "150" into the "Lump sum" payment field
    And I enter "50" into the "Instalment" payment field
    And I select the "Monthly" radio button
    And I enter a date 2 weeks into the future into the "Start date" date field
    And I select the "Request payment card" checkbox
    And I select the "There are days in default" checkbox
    And I enter a date 1 weeks into the past into the "Date days in default were imposed" date field
    And I enter "100" into the days in default input field
    And I select the "Add enforcement action" radio button
    And I select the "Hold enforcement on account (NOENF)" radio button
    And I enter "Reason" into the "Reason account is on NOENF" text field
    When I click the "Return to account details" button
    Then I see the status of "Payment terms" is "Provided"

    # Employer Details section
    When I click on the "Employer details" link
    And I see "Employer details" on the page header
    And I enter "Test Corp" into the "Employer name" field
    And I enter "ab123456c" into the "Employee reference" field
    Then I see "AB123456C" in the "Employee reference" field
    And I enter "employer@example.com" into the "Employer email address" field
    And I enter "01234567890" into the "Employer telephone" field
    And I enter "Addr1" into the "Address line 1" field
    And I enter "Addr2" into the "Address line 2" field
    And I enter "Addr3" into the "Address line 3" field
    And I enter "te12 3st" into the "Postcode" field
    Then I see "TE12 3ST" in the "Postcode" field
    And I click the "Return to account details" button
    Then I see the status of "Employer details" is "Provided"

    # Test cancel functionality for Employer Details
    When I click on the "Employer details" link
    Then I see "Employer details" on the page header
    When I enter "Testing Corp" into the "Employer name" field
    Then I click Cancel, a window pops up and I click Ok
    Then I see the "Check and submit" section heading

    # Account Comments and Notes section
    When I click on the "Account comments and notes" link
    Then I see "Account comments and notes" on the page header
    And I enter "This is a test comment" into the "Add comment" text field
    When I click the "Return to account details" button
    Then I see the "Check and submit" section heading
    And I see the status of "Account comments and notes" is "Provided"

    # Final check and verification
    When I click the "Check account" button
    Then I see "Check account details" on the page header

    Then I see the following in the "Court details" table:
      | Sending area or Local Justice Area (LJA) | Avon & Somerset Magistrates' Court (1450) |
      | Prosecutor Case Reference (PCR)          | ABCD1234A                                 |
      | Enforcement court                        | ATCM Test (828)                           |

    Then I see the following in the "Personal details" table:
      | Title                     | Mr                      |
      | First names               | FNAME                   |
      | Last name                 | LNAME                   |
      | Address                   | Addr1  TE1 1ST          |
      | Date of birth             | 01 January 1990 (Adult) |
      | Vehicle make and model    | FORD FOCUS              |
      | National Insurance number | QQ123456C               |
      | Registration number       | AB12 CDE                |

    Then I see the following in the "Contact details" table:
      | Primary email address   | P@EMAIL.COM   |
      | Secondary email address | S@EMAIL.COM   |
      | Mobile telephone number | 07123 456 789 |
      | Home telephone number   | 07123 456 789 |
      | Work telephone number   | 07123 456 789 |

    Then I see the following details for imposition 1 in the Offences and impositions table:
      | imposition       | Costs                    |
      | creditor         | TFL2 ATCM Testing (TFL2) |
      | amountImposed    | 125                      |
      | amountPaid       | 10                       |
      | balanceRemaining | 115                      |

    Then I see the following in the "Payment terms" table:
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

    Then I see the following in the "Employer details" table:
      | Employer name          | Test Corp                     |
      | Employee reference     | AB123456C                     |
      | Employer email address | employer@example.com          |
      | Employer telephone     | 01234567890                   |
      | Employer address       | Addr1  Addr2  Addr3  TE12 3ST |

    Then I see the following in the "Account comments and notes" table:
      | Comment | This is a test comment |

    When I click the "Submit for review" button
    Then I see "Create accounts" on the page header

    Then I click on the "In review" link

    # Create a parentOrGuardianToPay account with rejected status for testing
    Given I create a "parentOrGuardianToPay" draft account with the following details:
      | account.defendant.surname   | TEST                                  |
      | account.defendant.forenames | Rejected-PO-640-ParentOrGuardianToPay |
    When I update the last created draft account with status "Rejected"

    Then I click on the "Rejected" link
    Then I click on the "TEST, Rejected-PO-640-ParentOrGuardianToPay" link

    And I see the "Check and submit" section heading
    And I see the status of "Court details" is "Provided"
    And I see the status of "Personal details" is "Provided"
    And I see the status of "Parent or guardian details" is "Provided"
    And I see the status of "Contact details" is "Not provided"
    And I see the status of "Offence details" is "Provided"
    And I see the status of "Payment terms" is "Provided"
    And I see the status of "Employer details" is "Provided"
    And I see the status of "Account comments and notes" is "Not provided"

    # Court Details section
    When I click on the "Court details" link
    Then I see "Court details" on the page header
    When I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box
    When I enter "abcd1234a" into the "Prosecutor Case Reference (PCR)" field
    When I enter "Aram Court (123)" into the "Enforcement court" search box
    Then I see "ABCD1234A" in the "Prosecutor Case Reference (PCR)" field
    When I click the "Return to account details" button
    Then I see the "Check and submit" section heading
    And I see the status of "Court details" is "Provided"

    # Personal Details section
    When I click on the "Personal details" link
    Then I see "Personal details" on the page header
    When I select "Miss" from the "Title" dropdown
    And I enter "fname" into the "First names" field
    And I enter "lname" into the "Last name" field
    Then I see "LNAME" in the "Last name" field
    And I enter "Addr1" into the "Address line 1" field
    And I enter "rg12 8eu" into the "Postcode" field
    Then I see "RG12 8EU" in the "Postcode" field
    And I enter "01/01/2010" into the Date of birth field
    And I see "Youth" in the date of birth panel
    And I enter "AB122398B" into the "National insurance number" field
    Then I see "AB122398B" in the "National insurance number" field

    Then I click the "Return to account details" button
    And I see the "Check and submit" section heading
    And I see the status of "Personal details" is "Provided"

    # Parent or Guardian Details section
    When I click on the "Parent or guardian details" link
    Then I see "Parent or guardian details" on the page header
    When I enter "parent fname" into the "First names" field
    And I enter "parent lname" into the "Last name" field
    Then I see "PARENT LNAME" in the "Last name" field
    And I set the "Alias 1", "First names" to "alias fname"
    And I set the "Alias 1", "Last name" to "alias lname"
    Then I see "Alias 1", "Last name" is set to "ALIAS LNAME"
    And I enter "01/01/1980" into the Date of birth field
    And I enter "QW123456C" into the "National Insurance number" field
    And I enter "Addr1" into the "Address line 1" field
    And I enter "Addr2" into the "Address line 2" field
    And I enter "Addr3" into the "Address line 3" field
    And I enter "AB12 3CD" into the "Postcode" field
    And I enter "Ford Focus" into the "Make and model" field
    And I enter "AB12 CDE" into the "Registration number" field

    When I click the "Return to account details" button
    Then I see the "Check and submit" section heading
    And I see the status of "Parent or guardian details" is "Provided"

    # Test cancel functionality for Parent or Guardian Details
    When I click on the "Parent or guardian details" link
    Then I see "Parent or guardian details" on the page header
    When I enter "Test Name" into the "First names" field
    Then I click Cancel, a window pops up and I click Ok
    Then I see the "Check and submit" section heading

    # Contact Details section
    When I click on the "Contact details" link
    Then I see "Parent or guardian contact details" on the page header
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

    When I click on the "Change" link

    When I enter "HY35014" into the "Offence code" field
    And I enter a date 8 weeks into the past into the "Date of sentence" date field

    When I click the "Review offence" button
    When I click the "Return to account details" button
    Then I see the "Check and submit" section heading
    Then I see the status of "Offence details" is "Provided"

    # Payment Terms section
    When I click on the "Payment terms" link
    And I see "Payment terms" on the page header
    And I select the "No" radio button under the "Has a collection order been made?" section
    And I select the "Make collection order today" checkbox
    And I select the "Lump sum plus instalments" radio button
    And I enter "150" into the "Lump sum" payment field
    And I enter "50" into the "Instalment" payment field
    And I select the "Monthly" radio button
    And I enter a date 2 weeks into the future into the "Start date" date field
    When I click the "Return to account details" button
    Then I see the status of "Payment terms" is "Provided"

    # Employer Details section
    When I click on the "Employer details" link
    And I see "Employer details" on the page header
    And I enter "XYZ Company" into the "Employer name" field
    And I enter "ab123456c" into the "Employee reference" field
    Then I see "AB123456C" in the "Employee reference" field
    And I enter "employer@example.com" into the "Employer email address" field
    And I enter "01234567890" into the "Employer telephone" field
    And I enter "Employer Addr1" into the "Address line 1" field
    And I enter "Employer Addr2" into the "Address line 2" field
    And I enter "Employer Addr3" into the "Address line 3" field
    And I enter "TE12 3ST" into the "Postcode" field
    And I click the "Return to account details" button
    Then I see the status of "Employer details" is "Provided"

    # Account Comments and Notes section
    When I click on the "Account comments and notes" link
    Then I see "Account comments and notes" on the page header
    And I enter "This is a test comment" into the "Add comment" text field
    When I click the "Return to account details" button
    Then I see the "Check and submit" section heading
    And I see the status of "Account comments and notes" is "Provided"

    # Final check and verification
    When I click the "Check account" button
    Then I see "Check account details" on the page header

    Then I see the following in the "Court details" table:
      | Sending area or Local Justice Area (LJA) | Avon & Somerset Magistrates' Court (1450) |
      | Prosecutor Case Reference (PCR)          | ABCD1234A                                 |
      | Enforcement court                        | Aram Court (123)                          |

    Then I see the following in the "Defendant details" table:
      | Title                     | Miss                    |
      | First names               | fname                   |
      | Last name                 | LNAME                   |
      | Address                   | Addr1  RG12 8EU         |
      | Date of birth             | 01 January 2010 (Youth) |
      | National Insurance number | AB122398B               |

    Then I see the following in the "Parent or guardian details" table:
      | Forenames                 | parent fname                  |
      | Surname                   | PARENT LNAME                  |
      | Aliases                   | alias fname ALIAS LNAME       |
      | Date of birth             | 01 January 1980               |
      | National Insurance number | QW123456C                     |
      | Address                   | Addr1  Addr2  Addr3  AB12 3CD |
      | Vehicle make and model    | Ford Focus                    |
      | Registration number       | AB12 CDE                      |

    Then I see the following in the "Contact details" table:
      | Primary email address   | P@EMAIL.COM   |
      | Secondary email address | S@EMAIL.COM   |
      | Mobile telephone number | 07123 456 789 |
      | Home telephone number   | 07123 456 789 |
      | Work telephone number   | 07123 456 789 |

    Then I see the following details for imposition 1 in the Offences and impositions table:
      | imposition       | Compensation   |
      | creditor         | Minor Creditor |
      | amountImposed    | 300            |
      | amountPaid       | 100            |
      | balanceRemaining | 200            |

    Then I see the following in the "Payment terms" table:
      | Payment terms | Lump sum plus instalments |
      | Lump sum      | £150                      |
      | Instalment    | £50                       |
      | Frequency     | Monthly                   |

    Then I see the following in the "Employer details" table:
      | Employer name          | XYZ Company                                              |
      | Employee reference     | AB123456C                                                |
      | Employer email address | employer@example.com                                     |
      | Employer telephone     | 01234567890                                              |
      | Employer address       | Employer Addr1  Employer Addr2  Employer Addr3  TE12 3ST |

    Then I see the following in the "Account comments and notes" table:
      | Comment | This is a test comment |

    When I click the "Submit for review" button
    Then I see "Create accounts" on the page header

  @PO-640
  Scenario: AC10 - Back button functionality for rejected account

    # Create a company account with rejected status for testing
    Given I create a "company" draft account with the following details:
      | account.defendant.company_name | TEST Rejected-PO-640-BackButton |
    When I update the last created draft account with status "Rejected"

    Then I click on the "Rejected" link
    Then I click on the "TEST Rejected-PO-640-BackButton" link

    And I see "TEST Rejected-PO-640" on the page header
    And I see the "Check and submit" section heading
    And I see the status of "Court details" is "Provided"

    When I click on the "Back" link
    Then I see "Create accounts" on the page header

    # Test back button with no amendments made - AC10
    Then I click on the "TEST Rejected-PO-640-BackButton" link

    When I click on the "Court details" link
    Then I see "Court details" on the page header
    When I enter "Updated PCR" into the "Prosecutor Case Reference (PCR)" field
    Then I click the "Return to account details" button
    Then I see the "Check and submit" section heading

    When I click "Back", a window pops up and I click Ok
    Then I see "Create accounts" on the page header

    Then I click on the "TEST Rejected-PO-640-BackButton" link

    # Test back button with amendments again
    When I click on the "Court details" link
    Then I see "Court details" on the page header
    When I enter "Another PCR Update" into the "Prosecutor Case Reference (PCR)" field
    Then I click the "Return to account details" button
    Then I see the "Check and submit" section heading

    When I click "Back", a window pops up and I click Cancel
    Then I see the "Check and submit" section heading


  @PO-657
  Scenario: AC.8, AC.9 & AC.10 View account details of rejected account, A/Y only


    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status              | Rejected |
      | account.defendant.forenames | Mike     |
      | account.defendant.surname   | Mills    |
    And I update the last created draft account with status "Rejected"
    And I click on the "Rejected" link
    And I click on the "Mills, Mike" link
    Then I see "Mr Mike MILLS" on the page header

    #Test back link

    When I click the "Check account" button
    And I see "Check account details" on the page header
    And I click on the "Back" link
    Then I see "Mr Mike MILLS" on the page header
    And I see "Test reason" text on the page

    When I click the "Check account" button
    And I click on the "Change" link in the "Court details" table
    Then I see "Mr Mike MILLS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Personal details" table
    Then I see "Mr Mike MILLS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Contact details" table
    Then I see "Mr Mike MILLS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Employer details" table
    Then I see "Mr Mike MILLS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Offences and impositions" table
    Then I see "Mr Mike MILLS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Payment terms" table
    Then I see "Mr Mike MILLS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Account comments and notes" table
    Then I see "Mr Mike MILLS" on the page header

    When I click the "Check account" button
    And I click the "Submit for review" button

  @PO-657
  Scenario: AC.8, AC.9 & AC.10 View account details of rejected account, A/Y with parent/guardian to pay


    And I create a "parentOrGuardianToPay" draft account with the following details:
      | account.defendant.forenames | Samantha |
      | account.defendant.surname   | Sellers  |
    And I update the last created draft account with status "Rejected"
    And I click on the "Rejected" link
    And I click on the "Sellers, Samantha" link
    Then I see "Miss Samantha SELLERS" on the page header

    #Test back link

    When I click the "Check account" button
    And I see "Check account details" on the page header
    And I click on the "Back" link
    Then I see "Miss Samantha SELLERS" on the page header
    And I see "Test reason" text on the page

    When I click the "Check account" button
    And I click on the "Change" link in the "Court details" table
    Then I see "Miss Samantha SELLERS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Parent or guardian details" table
    Then I see "Miss Samantha SELLERS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Contact details" table
    Then I see "Miss Samantha SELLERS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Employer details" table
    Then I see "Miss Samantha SELLERS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Defendant details" table
    Then I see "Miss Samantha SELLERS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Offences and impositions" table
    Then I see "Miss Samantha SELLERS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Payment terms" table
    Then I see "Miss Samantha SELLERS" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Account comments and notes" table
    Then I see "Miss Samantha SELLERS" on the page header

    When I click the "Check account" button
    And I click the "Submit for review" button

  @PO-657
  Scenario: AC.8, AC.9 & AC.10 View account details of rejected account, Company


    And I create a "company" draft account with the following details:
      | Account_status                 | Rejected                     |
      | account.defendant.company_name | TEST Rejected PO-657-Company |
    And I update the last created draft account with status "Rejected"
    And I click on the "Rejected" link
    And I click on the "TEST Rejected PO-657-Company" link
    Then I see "TEST Rejected PO-657-Company" on the page header
    And the account status is "Rejected"

    #Test back link

    When I click the "Check account" button
    And I see "Check account details" on the page header
    And I click on the "Back" link
    Then I see "TEST Rejected PO-657-Company" on the page header
    And I see "Test reason" text on the page

    When I click the "Check account" button
    And I click on the "Change" link in the "Court details" table
    Then I see "TEST Rejected PO-657-Company" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Company details" table
    Then I see "TEST Rejected PO-657-Company" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Contact details" table
    Then I see "TEST Rejected PO-657-Company" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Offences and impositions" table
    Then I see "TEST Rejected PO-657-Company" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Payment terms" table
    Then I see "TEST Rejected PO-657-Company" on the page header

    When I click the "Check account" button
    And I click on the "Change" link in the "Account comments and notes" table
    Then I see "TEST Rejected PO-657-Company" on the page header

    When I click the "Check account" button
    And I click the "Submit for review" button

  @PO-610
  Scenario: View the details of an account in review
    And I create a "adultOrYouthOnly" draft account with the following details:
      | Account_status                          | Submitted                 |
      | account.defendant.forenames             | Larry                     |
      | account.defendant.surname               | Lincoln                   |
      | account.defendant.email_address_1       | larry.lincoln@outlook.com |
      | account.defendant.telephone_number_home | 02078219385               |

    Then I click on the "Rejected" link
    And I click on the "In review" link

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
      | Payment terms       | Pay in full |
      | Pay by date - exact | 30 May 2025 |

    And I see the following in the "Account comments and notes" table:
      | Comment      | — |
      | Account note | — |

  @PO-607 @only
  Scenario: AC2 - View accounts in the Approved tab
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    Given I create a "company" approved draft account with the following details:
      | account_snapshot.defendant_name | TEST New Company Ltd |

    Given I create a "adultOrYouthOnly" approved draft account with the following details:
      | account_snapshot.defendant_name | James, Smith |

    Given I navigate to Create and Manage Draft Accounts
    When I click on the "Approved" link

    And I see "Showing accounts Approved in the past 7 days" text on the page

    When I click on the "FP123456" link
    Then I see "Account Details" on the page header



