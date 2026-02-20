Feature: Manual account creation - Create Draft Account

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"

  @PO-2763
  #AC-6 click cancel
  Scenario: Clicking Cancel after beginning to enter information, display the Cancel pop-up before navigating away
    When I open Manual Account Creation
    And I begin entering details on the Originator Type page
    And I cancel without entering data

  @PO-2763
  #AC-5 click cancel without entering details
  Scenario: Clicking Cancel without entering details returns to the Inputter Dashboard
    When I open Manual Account Creation
    Then I cancel without entering data
    Then I should be on the dashboard

  @PO-1448 @PO-1638 @PO-1872
  Scenario: Mixed creditors offence review shows correct totals and summary
    When I start a fine manual account for business unit "West London" with defendant type "Adult or youth" and I view the "Offence details" task
    Then I provide offence details for offence code "TP11003" with a sentence date 9 weeks in the past
    And I record imposition financial details:
      | Imposition | Result code            | Amount imposed | Amount paid |
      | 1          | Compensation (FCOMP)   | 200            | 100         |
      | 2          | Compensation (FCOMP)   | 300            | 100         |
      | 3          | Victim Surcharge (FVS) | 500            | 250         |
    And I set imposition creditor types:
      | Imposition | Creditor type | Creditor search           |
      | 1          | Minor         |                           |
      | 2          | Major         | Temporary Creditor (TEMP) |
      | 3          | Default       |                           |
    And I maintain individual minor creditor with BACS details for imposition 1:
      | Title             | Mr       |
      | First name        | FNAME    |
      | Last name         | LNAME    |
      | Address line 1    | Addr1    |
      | Address line 2    | Addr2    |
      | Address line 3    | Addr3    |
      | Postcode          | TE12 3ST |
      | Name on account   | F LNAME  |
      | Sort code         | 123456   |
      | Account number    | 12345678 |
      | Payment reference | REF      |
    Then I see the offence details page with header "Add an offence" and text "Offence details"
    When I review the offence and see the review page
    Then I see the offence review details:
      | Type    | Value                                                                              |
      | Header  | Offences and impositions                                                           |
      | Message | Offence TP11003 added                                                              |
      | Text    | Possess potentially dangerous item on Transport for London road transport premises |
    Then the table with offence code "TP11003" should contain the following information:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation     | FNAME LNAME                           | £200.00        | £100.00     | £100.00           |
      | Compensation     | Temporary Creditor (TEMP)             | £300.00        | £100.00     | £200.00           |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £500.00        | £250.00     | £250.00           |
      | Totals           |                                       | £1000.00       | £450.00     | £550.00           |
    And the summary list should contain the following information:
      | Amount imposed    | £1000.00 |
      | Amount paid       | £450.00  |
      | Balance remaining | £550.00  |
    When I return to account details from offence details
    Then the "Offence details" task status is "Provided"

  @PO-1448 @PO-1638 @PO-1872
  Scenario: Minor creditor summary displays captured address and BACS details
    When I start a fine manual account for business unit "West London" with defendant type "Adult or youth" and I view the "Offence details" task
    And I provide offence details for offence code "TP11003" with a sentence date 9 weeks in the past
    And I record imposition financial details:
      | Imposition | Result code          | Amount imposed | Amount paid |
      | 1          | Compensation (FCOMP) | 200            | 100         |
    And I set imposition creditor types:
      | Imposition | Creditor type |
      | 1          | Minor         |
    And I maintain individual minor creditor with BACS details for imposition 1:
      | Title             | Mr       |
      | First name        | FNAME    |
      | Last name         | LNAME    |
      | Address line 1    | Addr1    |
      | Address line 2    | Addr2    |
      | Address line 3    | Addr3    |
      | Postcode          | TE12 3ST |
      | Name on account   | F LNAME  |
      | Sort code         | 123456   |
      | Account number    | 12345678 |
      | Payment reference | REF      |
    When I view minor creditor details for imposition 1
    Then the minor creditor summary for imposition 1 is:
      | Minor creditor    | FNAME LNAME                |
      | Address           | Addr1 Addr2 Addr3 TE12 3ST |
      | Payment method    | BACS                       |
      | Account name      | F LNAME                    |
      | Sort code         | 12-34-56                   |
      | Account number    | 12345678                   |
      | Payment reference | REF                        |

  @PO-1448 @PO-1638 @PO-1872
  Scenario: Impositions with amounts recorded show remove links for each row
    When I start a fine manual account for business unit "West London" with defendant type "Adult or youth" and I view the "Offence details" task
    And I provide offence details for offence code "TP11003" with a sentence date 9 weeks in the past
    And I record imposition financial details:
      | Imposition | Result code            | Amount imposed | Amount paid |
      | 1          | Compensation (FCOMP)   | 200            | 100         |
      | 2          | Compensation (FCOMP)   | 300            | 100         |
      | 3          | Victim Surcharge (FVS) | 500            | 250         |
    Then I see remove imposition links for:
      | Imposition |
      | 1          |
      | 2          |
      | 3          |


  @PO-1450 @PO-1638
  Scenario: Capitalisation is applied when submitting a company manual account with a minor creditor
    When I start a fine manual account for business unit "West London" with defendant type "Company" and originator type "New"
    And I view the "Court details" task
    And I complete manual court details:
      | Sending area or Local Justice Area (LJA) | Avon             |
      | Prosecutor Case Reference (PCR)          | abcd1234a        |
      | Enforcement court                        | Aram Court (100) |
    Then the manual court details fields are:
      | Sending area or Local Justice Area (LJA) | Avon             |
      | Prosecutor Case Reference (PCR)          | ABCD1234A        |
      | Enforcement court                        | Aram Court (100) |
    And returning to account details the "Court details" task the status is "Provided"
    When I view the "Offence details" task
    And I provide offence details for offence code "HY35014" with a sentence date 8 weeks in the past
    And I record imposition financial details:
      | Imposition | Result code          | Amount imposed | Amount paid |
      | 1          | Compensation (FCOMP) | 300            | 100         |
    And I set imposition creditor types:
      | Imposition | Creditor type |
      | 1          | Minor         |
    When I open minor creditor details for imposition 1
    And I maintain minor creditor details for imposition 1:
      | Title          | Mr      |
      | First name     | FNAME   |
      | Last name      | lname   |
      | Address line 1 | Addr1   |
      | Postcode       | te1 1st |
    Then I see the following values in the Minor Creditor fields:
      | Field     | Value   |
      | Last name | LNAME   |
      | Postcode  | TE1 1ST |
    And I maintain BACS payment details for imposition 1:
      | Name on the account | F LNAME  |
      | Sort code           | 123456   |
      | Account number      | 12345678 |
      | Payment reference   | ref      |
    Then I see the following values in the Payment details fields:
      | Field             | Value |
      | Payment reference | REF   |

  @PO-1450 @PO-1638
  Scenario: Submitting a company manual account with a minor creditor shows the correct review summaries
    When I start a fine manual account for business unit "West London" with defendant type "Company" and originator type "New"
    And I complete manual account creation with the following fields and defaults:
      | Section        | Field                     | Value                               | Imposition |
      | Court          | Prosecutor Case Reference | ABCD1234A                           |            |
      | Offence        | Offence code              | HY35014                             | 1          |
      | Offence        | Date of sentence          | 8 weeks in the past                 | 1          |
      | Offence        | Result code               | Compensation (FCOMP)                | 1          |
      | Offence        | Amount imposed            | 300                                 | 1          |
      | Offence        | Amount paid               | 100                                 | 1          |
      | Offence        | Creditor type             | Minor                               | 1          |
      | Offence        | Payment method            | BACS                                | 1          |
      | Minor creditor | Name on the account       | Mr FNAME LNAME                      | 1          |
      | Payment terms  | Payment term              | Lump sum plus instalments           |            |
      | Payment terms  | Lump sum amount           | 150                                 |            |
      | Payment terms  | Instalment amount         | 300                                 |            |
      | Payment terms  | Payment frequency         | Monthly                             |            |
      | Payment terms  | Start date                | 2 weeks in the future               |            |
      | Payment terms  | Enforcement action option | Hold enforcement on account (NOENF) |            |
      | Payment terms  | Enforcement reason        | Reason                              |            |
      | Company        | Company name              | COMPANY NAME {uniqUpper}            |            |
      | Company        | Address line 1            | Addr1                               |            |
      | Company        | Postcode                  | TE1 1ST                             |            |
      | Company        | Alias 1                   | CNAME1                              |            |
      | Company        | Alias 2                   | CNAME2                              |            |
      | Company        | Alias 3                   | CNAME3                              |            |
      | Company        | Alias 4                   | CNAME4                              |            |
      | Company        | Alias 5                   | CNAME5                              |            |
    Then the task statuses are:
      | Offence details | Provided |
      | Payment terms   | Provided |
      | Company details | Provided |

    When I check the manual account details
    Then I see the manual review "Court details" summary:
      | Prosecutor Case Reference (PCR) | ABCD1234A |
    And I see the manual review "Company details" summary:
      | Company name | COMPANY NAME {uniqUpper}           |
      | Address      | Addr1 TE1 1ST                      |
      | Aliases      | CNAME1 CNAME2 CNAME3 CNAME4 CNAME5 |
    And the manual review offence table contains:
      | Imposition   | Creditor       | Amount imposed | Amount paid | Balance remaining |
      | Compensation | Mr FNAME LNAME | £300.00        | £100.00     | £200.00           |
      | Totals       |                | £300.00        | £100.00     | £200.00           |
    And the manual review minor creditor details are:
      | Address           | Addr1 TE1 1ST  |
      | Payment method    | Pay by BACS    |
      | Name on account   | Mr FNAME LNAME |
      | Sort code         | 12-34-56       |
      | Account number    | 12345678       |
      | Payment reference | REF            |

    When I submit the manual account for review
    Then I see the following text on the page "You've submitted this account for review"

  @PO-1449 @PO-1638
  Scenario: Capitalisation is applied for parent or guardian, defendant and employer details
    When I start a fine manual account for business unit "West London" with defendant type "Adult or youth with parent or guardian to pay" and originator type "New"

    When I view the "Court details" task
    And I complete manual court details:
      | Sending area or Local Justice Area (LJA) | Bedfordshire     |
      | Prosecutor Case Reference (PCR)          | abcd1234a        |
      | Enforcement court                        | Aram Court (100) |
    Then the manual court details fields are:
      | Sending area or Local Justice Area (LJA) | Bedfordshire     |
      | Prosecutor Case Reference (PCR)          | ABCD1234A        |
      | Enforcement court                        | Aram Court (100) |
    And returning to account details the "Court details" task the status is "Provided"

    When I view the "Parent or guardian details" task
    And I complete parent or guardian details:
      | firstNames              | FNAME            |
      | lastName                | lname            |
      | addressLine1            | 1 Address Street |
      | postcode                | rg12 8eu         |
      | nationalInsuranceNumber | ab122398b        |
      | addAliases              | true             |
      | alias1.firstNames       | fnameone         |
      | alias1.lastName         | lnameone         |
      | alias2.firstNames       | fnametwo         |
      | alias2.lastName         | lnametwo         |
      | alias3.firstNames       | fnamethree       |
      | alias3.lastName         | lnamethree       |
      | alias4.firstNames       | fnamefour        |
      | alias4.lastName         | lnamefour        |
      | alias5.firstNames       | fnamefive        |
      | alias5.lastName         | lnamefive        |
      | vehicleMake             | CarMake          |
      | vehicleRegistration     | carreg           |
    Then I see parent or guardian details populated:
      | firstNames              | FNAME            |
      | lastName                | LNAME            |
      | postcode                | RG12 8EU         |
      | nationalInsuranceNumber | AB122398B        |
      | addAliasesChecked       | true             |
      | alias1.firstNames       | fnameone         |
      | alias1.lastName         | LNAMEONE         |
      | alias2.firstNames       | fnametwo         |
      | alias2.lastName         | LNAMETWO         |
      | alias3.firstNames       | fnamethree       |
      | alias3.lastName         | LNAMETHREE       |
      | alias4.firstNames       | fnamefour        |
      | alias4.lastName         | LNAMEFOUR        |
      | alias5.firstNames       | fnamefive        |
      | alias5.lastName         | LNAMEFIVE        |
      | vehicleMake             | CarMake          |
      | vehicleRegistration     | CARREG           |
      | addressLine1            | 1 Address Street |
    And returning to account details the "Parent or guardian details" task the status is "Provided"

    When I view the "Employer details" task
    And I complete manual employer details:
      | employer name      | XYZ company      |
      | employee reference | AB122398B        |
      | address line 1     | 1 Address Street |
      | postcode           | rg12 8eu         |
    Then the manual employer details fields are:
      | employer name      | XYZ company      |
      | employee reference | AB122398B        |
      | address line 1     | 1 Address Street |
      | postcode           | RG12 8EU         |
    And returning to account details the "Employer details" task the status is "Provided"

    When I view the "Personal details" task
    And I complete manual personal details:
      | title                     | Miss             |
      | first names               | FNAME            |
      | last name                 | lname            |
      | address line 1            | 1 Address Street |
      | postcode                  | rg12 8eu         |
      | national insurance number | ab122398b        |
    Then the manual personal details fields are:
      | title                     | Miss             |
      | first names               | FNAME            |
      | last name                 | LNAME            |
      | address line 1            | 1 Address Street |
      | postcode                  | RG12 8EU         |
      | national insurance number | AB122398B        |
    And returning to account details the "Personal details" task the status is "Provided"

  Scenario: Capitalisation is applied for defendant and employer details without parent or guardian
    When I start a fine manual account for business unit "West London" with defendant type "Adult or youth" and originator type "New"

    When I view the "Court details" task
    And I complete manual court details:
      | Sending area or Local Justice Area (LJA) | Bedfordshire     |
      | Prosecutor Case Reference (PCR)          | abcd1234a        |
      | Enforcement court                        | Aram Court (100) |
    Then the manual court details fields are:
      | Sending area or Local Justice Area (LJA) | Bedfordshire     |
      | Prosecutor Case Reference (PCR)          | ABCD1234A        |
      | Enforcement court                        | Aram Court (100) |
    And returning to account details the "Court details" task the status is "Provided"

    When I view the "Employer details" task
    And I complete manual employer details:
      | employer name      | XYZ company      |
      | employee reference | AB122398B        |
      | address line 1     | 1 Address Street |
      | postcode           | rg12 8eu         |
    Then the manual employer details fields are:
      | employer name      | XYZ company      |
      | employee reference | AB122398B        |
      | address line 1     | 1 Address Street |
      | postcode           | RG12 8EU         |
    And returning to account details the "Employer details" task the status is "Provided"
    When I view the "Personal details" task
    And I complete manual personal details:
      | title                     | Miss             |
      | first names               | FNAME            |
      | last name                 | lname            |
      | address line 1            | 1 Address Street |
      | postcode                  | rg12 8eu         |
      | national insurance number | ab122398b        |
      | make and model            | FORD FOCUS       |
      | registration number       | AB12 CDE         |
    Then the manual personal details fields are:
      | title                     | Miss             |
      | first names               | FNAME            |
      | last name                 | LNAME            |
      | address line 1            | 1 Address Street |
      | postcode                  | RG12 8EU         |
      | national insurance number | AB122398B        |
      | make and model            | FORD FOCUS       |
      | registration number       | AB12 CDE         |
    And returning to account details the "Personal details" task the status is "Provided"


  @PO-1449 @PO-1638
  Scenario: Submitting an adult or youth with parent or guardian to pay account with a minor creditor shows the correct review summaries
    When I start a fine manual account for business unit "West London" with defendant type "Adult or youth with parent or guardian to pay" and originator type "New"
    And I complete manual account creation with the following fields and defaults:
      | Section            | Field                                    | Value                | Imposition |
      | Court              | Sending area or Local Justice Area (LJA) | Bedfordshire         |            |
      | Court              | Prosecutor Case Reference (PCR)          | abcd1234a            |            |
      | Court              | Enforcement court                        | Aram Court (100)     |            |
      | Parent or guardian | firstNames                               | FNAME                |            |
      | Parent or guardian | lastName                                 | lname                |            |
      | Parent or guardian | addressLine1                             | 1 Address Street     |            |
      | Parent or guardian | postcode                                 | rg12 8eu             |            |
      | Parent or guardian | nationalInsuranceNumber                  | ab122398b            |            |
      | Parent or guardian | addAliases                               | true                 |            |
      | Parent or guardian | alias1.firstNames                        | fnameone             |            |
      | Parent or guardian | alias1.lastName                          | lnameone             |            |
      | Parent or guardian | alias2.firstNames                        | fnametwo             |            |
      | Parent or guardian | alias2.lastName                          | lnametwo             |            |
      | Parent or guardian | alias3.firstNames                        | fnamethree           |            |
      | Parent or guardian | alias3.lastName                          | lnamethree           |            |
      | Parent or guardian | alias4.firstNames                        | fnamefour            |            |
      | Parent or guardian | alias4.lastName                          | lnamefour            |            |
      | Parent or guardian | alias5.firstNames                        | fnamefive            |            |
      | Parent or guardian | alias5.lastName                          | lnamefive            |            |
      | Employer           | employer name                            | XYZ company          |            |
      | Employer           | employee reference                       | AB122398B            |            |
      | Employer           | address line 1                           | 1 Address Street     |            |
      | Employer           | postcode                                 | rg12 8eu             |            |
      | Personal           | title                                    | Miss                 |            |
      | Personal           | first names                              | FNAME                |            |
      | Personal           | last name                                | lname                |            |
      | Personal           | address line 1                           | 1 Address Street     |            |
      | Personal           | postcode                                 | rg12 8eu             |            |
      | Personal           | national insurance number                | ab122398b            |            |
      | Offence            | Offence code                             | HY35014              | 1          |
      | Offence            | Date of sentence                         | 8 weeks in the past  | 1          |
      | Offence            | Result code                              | Compensation (FCOMP) | 1          |
      | Offence            | Amount imposed                           | 300                  | 1          |
      | Offence            | Amount paid                              | 100                  | 1          |
      | Offence            | Creditor type                            | Minor                | 1          |
      | Offence            | Payment method                           | BACS                 | 1          |
      | Minor creditor     | Title                                    | Mr                   | 1          |
      | Minor creditor     | First name                               | FNAME                | 1          |
      | Minor creditor     | Last name                                | lname                | 1          |
      | Minor creditor     | Postcode                                 | ne13 8ed             | 1          |
      | Minor creditor     | Name on the account                      | F LNAME              | 1          |
      | Minor creditor     | Sort code                                | 123456               | 1          |
      | Minor creditor     | Account number                           | 12345678             | 1          |
      | Minor creditor     | Payment reference                        | refab                | 1          |
      | Payment terms      | Collection order                         | No                   |            |
      | Payment terms      | Make collection order today              | true                 |            |
      | Payment terms      | Payment term                             | Pay in full          |            |
      | Payment terms      | Pay in full by                           | 01/04/2025           |            |
    Then the task statuses are:
      | Offence details | Provided |
      | Payment terms   | Provided |
      | Court details   | Provided |
    When I check the manual account details
    Then I see the manual review "Court details" summary:
      | Prosecutor Case Reference (PCR) | ABCD1234A |
    And I see the manual review "Parent or guardian details" summary:
      | Surname                   | LNAME                                                                                             |
      | Address                   | 1 Address Street RG12 8EU                                                                         |
      | National Insurance number | AB 12 23 98 B                                                                                     |
      | Aliases                   | fnameone LNAMEONE fnametwo LNAMETWO fnamethree LNAMETHREE fnamefour LNAMEFOUR fnamefive LNAMEFIVE |
    And I see the manual review "Defendant details" summary:
      | Last name                 | LNAME                     |
      | Address                   | 1 Address Street RG12 8EU |
      | National Insurance number | AB 12 23 98 B             |
      | Aliases                   | Not provided              |
    And I see the manual review "Employer details" summary:
      | Employee reference | AB122398B                 |
      | Employer address   | 1 Address Street RG12 8EU |
    And the manual review offence table contains:
      | Imposition   | Creditor           | Amount imposed | Amount paid | Balance remaining |
      | Compensation | Minor Creditor Ltd | £300.00        | £100.00     | £200.00           |
      | Totals       |                    | £300.00        | £100.00     | £200.00           |
    And the manual review minor creditor details are:
      | Address           | NE13 8ED    |
      | Payment method    | Pay by BACS |
      | Name on account   | F LNAME     |
      | Sort code         | 12-34-56    |
      | Account number    | 12345678    |
      | Payment reference | REFAB       |

    When I submit the manual account for review
    Then I see the following text on the page "You've submitted this account for review"

  @PO-2766 @only
  Scenario: User moves from through create account page links depending on selected options - Fine
    When I open Manual Account Creation
    Then I choose 'Transfer in' and continue to create account page
    # AC1 Transfer in screen naviagated to & confirmed.
    Then I should see the header containing text 'Transfer in'

    # AC6 Back link is on screening
    When I click the back link on create account page I return to Create or Transfer In page - No data retained

    Then I choose 'New' and continue to create account page
    Then I should see the header containing text 'Create account'
    # AC6a Back link is on screening
    When I click the back link on create account page I return to Create or Transfer In page - No data retained

    # AC5a Navigates via transfer in to create account then fine penalty page and confirms page is correct
    Then I start a fine manual account via transfer for business unit 'Camberwell Green' with defendant type 'Adult or youth only' and originator type "Transfer in"


  @PO-2766 @only
  Scenario: User moves from through create account page links depending on selected options - Fixed Penalty
    # AC7
    When I open Manual Account Creation
    Then I choose 'Transfer in' and continue to create account page
    Then I cancel create account
    Then I should be on the dashboard

    # AC7a
    When I open Manual Account Creation
    Then I choose 'Transfer in' and continue to create account page
    Then I choose manual account type 'Fine'
    Then I cancel create account choosing 'Ok'
    Then I should be on the dashboard

    # AC5b Navigates via transfer in to create account then fixed penalty page and confirms page is correct
    Then I start a fixed penalty account for business unit 'Camberwell Green', defendant type 'Adult or youth only' and originator type "Transfer in"

