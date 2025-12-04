@ManualAccountCreation @OffenceDetails @PO-272 @PO-344 @PO-345 @PO-545 @PO-412 @PO-668 @PO-669 @PO-413 @PO-817 @PO-818 @PO-414 @PO-670 @PO-671 @PO-686 @PO-696 @PO-411 @PO-681 @PO-684 @PO-815 @PO-417 @PO-676 @PO-679 @PO-416 @PO-682 @PO-680 @PO-1395 @PO-987
Feature: Manual account creation - Offence Details
  #This feature file contains tests for the Offence details pages of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the Offence screens component tests

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I start a fine manual account for business unit "West London" with defendant type "Adult or youth"
    And I view the "Offence details" task

  Scenario: The User can add an offence with multiple impositions with different creditor types [@PO-272, @PO-344, @PO-345, @PO-545, @PO-412, @PO-668, @PO-669, @PO-413, @PO-817, @PO-818]
    When I provide offence details for offence code "TP11003" with a sentence date 9 weeks in the past
    Then the "Remove imposition" option is not available

    When I record impositions with creditor types:
      | Imposition | Result code            | Amount imposed | Amount paid | Creditor type | Creditor search           |
      | 1          | Compensation (FCOMP)   | 200            | 100         | Minor         |                           |
      | 2          | Compensation (FCOMP)   | 300            | 100         | Major         | Temporary Creditor (TEMP) |
      | 3          | Victim Surcharge (FVS) | 500            | 250         | Default       |                           |

    And I maintain individual minor creditor with BACS details for imposition 1:
      | Title | First name | Last name | Address line 1 | Address line 2 | Address line 3 | Postcode | Account name | Sort code | Account number | Payment reference |
      | Mr    | FNAME      | LNAME     | Addr1          | Addr2          | Addr3          | TE12 3ST | F LNAME      | 123456    | 12345678       | REF               |
    Then I see the offence details page with header "Add an offence" and text "Offence details"

    When I view minor creditor details for imposition 1
    Then I see the following Minor creditor details for imposition 1:
      | Minor creditor    | FNAME LNAME             |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |

    And I see remove imposition links for:
      | Imposition |
      | 1          |
      | 2          |
      | 3          |

    When I review the offence
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

    And the summary table contains the following data:
      | Amount imposed    | £1000.00 |
      | Amount paid       | £450.00  |
      | Balance remaining | £550.00  |

    When I return to account details from offence details
    Then the "Offence details" task status is "Provided"

  Scenario: User can add an offence with individual and company minor creditors
    When I provide offence details for offence code "TP11003" with a sentence date 9 weeks in the past

    When I record imposition financial details:
      | Imposition | Result code          | Amount imposed | Amount paid |
      | 1          | Compensation (FCOMP) | 200            | 100         |
      | 2          | Compensation (FCOMP) | 200            | 100         |

    And I set imposition creditor types:
      | Imposition | Creditor type | Creditor search |
      | 1          | Minor         |                 |
      | 2          | Minor         |                 |

    And I maintain individual minor creditor with BACS details for imposition 1:
      | Title | First name | Last name | Address line 1 | Address line 2 | Address line 3 | Postcode | Account name | Sort code | Account number | Payment reference |
      | Mr    | FNAME      | LNAME     | Addr1          | Addr2          | Addr3          | TE12 3ST | F LNAME      | 123456    | 12345678       | REF               |

    And I maintain company minor creditor with BACS details for imposition 2:
      | Company | Address line 1 | Address line 2 | Address line 3 | Postcode | Account name | Sort code | Account number | Payment reference |
      | CNAME   | Addr1          | Addr2          | Addr3          | TE12 3ST | F LNAME      | 123456    | 12345678       | REF               |

    Then I see the minor creditor summary for imposition 1:
      | Minor creditor    | FNAME LNAME             |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |

    And I see the minor creditor summary for imposition 2:
      | Minor creditor    | CNAME                   |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |

    When I review the offence
    Then the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                    | Amount imposed | Amount paid | Balance remaining |
      | Compensation | Mr FNAME LNAME Show details | £200.00        | £100.00     | £100.00           |
      | Compensation | CNAME                       | £200.00        | £100.00     | £100.00           |
      | Totals       |                             | £400.00        | £200.00     | £200.00           |

  Scenario: User can update an existing minor creditor for an imposition
    Given an offence exists with 2 minor creditor impositions for offence code "TP11003"

    When I update individual minor creditor with BACS details for imposition 1:
      | Title | First name | Last name | Address line 1 | Address line 2 | Address line 3 | Postcode | Account name | Sort code | Account number | Payment reference |
      | Mr    | FNAMEONE   | LNAMEONE  | Addr1 edit     | Addr2 edit     | Addr3 edit     | ED32 1IT | F LNAMEONE   | 654321    | 87654321       | REFONE            |

    Then I see the minor creditor summary for imposition 1:
      | Minor creditor    | FNAMEONE LNAMEONE                      |
      | Address           | Addr1 editAddr2 editAddr3 editED32 1IT |
      | Payment method    | BACS                                   |
      | Account name      | F LNAMEONE                             |
      | Sort code         | 65-43-21                               |
      | Account number    | 87654321                               |
      | Payment reference | REFONE                                 |


  Scenario: User can remove and re-add a minor creditor for an imposition
    Given an offence exists with 2 minor creditor impositions for offence code "TP11003"
    When I cancel removing the minor creditor for imposition 2
    When I confirm removing the minor creditor for imposition 2

    And I maintain company minor creditor with BACS details for imposition 2:
      | Company  | Address line 1 | Address line 2 | Address line 3 | Postcode | Account name | Sort code | Account number | Payment reference |
      | CNAMENEW | Addr1          | Addr2          | Addr3          | TE12 3ST | FLNAME TWO   | 654321    | 87654321       | REFTWO            |

    Then I see the minor creditor summary for imposition 2:
      | Minor creditor    | CNAMENEW                |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | FLNAME TWO              |
      | Sort code         | 65-43-21                |
      | Account number    | 87654321                |
      | Payment reference | REFTWO                  |

  Scenario: User can switch a minor creditor to major and add a new minor creditor on another imposition
    Given an offence exists with 2 minor creditor impositions for offence code "TP11003"

    # Update imposition 1
    When I update individual minor creditor with BACS details for imposition 1:
      | Title | First name   | Last name    | Address line 1 | Address line 2 | Address line 3 | Postcode | Account name   | Sort code | Account number | Payment reference |
      | Mr    | FNAMETWOEDIT | LNAMETWOEDIT | Addr1edit      | Addr2edit      | Addr3edit      | TE12 3ST | F LNAMETWOEDIT | 123456    | 12345678       | REFEDIT           |

    Then I see the minor creditor summary for imposition 1:
      | Minor creditor    | FNAMETWOEDIT LNAMETWOEDIT           |
      | Address           | Addr1editAddr2editAddr3editTE12 3ST |
      | Payment method    | BACS                                |
      | Account name      | F LNAMETWOEDIT                      |
      | Sort code         | 12-34-56                            |
      | Account number    | 12345678                            |
      | Payment reference | REFEDIT                             |

    # Remove imposition 2 minor creditor and switch to major
    When I confirm removing the minor creditor for imposition 2

    And I set imposition creditor types:
      | Imposition | Creditor type | Creditor search           |
      | 2          | Major         | Temporary Creditor (TEMP) |

    # Add imposition 3 with minor creditor
    When I record imposition financial details:
      | Imposition | Result code          | Amount imposed | Amount paid |
      | 3          | Compensation (FCOMP) | 200            | 100         |
    And I set imposition creditor types:
      | Imposition | Creditor type | Creditor search |
      | 3          | Minor         |                 |

    And I maintain company minor creditor with BACS details for imposition 3:
      | Company | Address line 1 | Address line 2 | Address line 3 | Postcode | Account name | Sort code | Account number | Payment reference |
      | CNAME3  | Addr1          | Addr2          | Addr3          | TE12 3ST | F LNAMETHREE | 123456    | 12345678       | REF               |

    Then I see the minor creditor summary for imposition 3:
      | Minor creditor    | CNAME3                  |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAMETHREE            |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |

    When I review the offence
    Then the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                     | Amount imposed | Amount paid | Balance remaining |
      | Compensation | Mr FNAMETWOEDIT LNAMETWOEDIT | £200.00        | £100.00     | £100.00           |
      | Compensation | Temporary Creditor (TEMP)    | £200.00        | £100.00     | £100.00           |
      | Compensation | CNAME3                       | £200.00        | £100.00     | £100.00           |
      | Totals       |                              | £600.00        | £300.00     | £300.00           |

    And the summary table should contain the following data:
      | Amount imposed    | £600.00 |
      | Amount paid       | £300.00 |
      | Balance remaining | £300.00 |

    When I return to account details from offence details
    Then the "Offence details" task status is "Provided"


  Scenario: User can see imposition details before removal and cancel or confirm removal
    Given an offence exists with the following impositions:
      | Offence code | Sentence weeks ago | Imposition | Result code            | Amount imposed | Amount paid | Creditor type | Creditor search           | Minor creditor type | Minor creditor name | Address line 1 | Postcode |
      | TP11003      | 9                  | 1          | Compensation (FCOMP)   | 200            | 100         | Minor         |                           | Company             | CNAME               | Addr1          | TE12 3ST |
      | TP11003      | 9                  | 2          | Costs (FCOST)          | 300            | 100         | Major         | Temporary Creditor (TEMP) |                     |                     |                |          |
      | TP11003      | 9                  | 3          | Victim Surcharge (FVS) | 500            | 250         | Default       |                           |                     |                     |                |          |

    Then I see remove imposition links for:
      | Imposition |
      | 1          |
      | 2          |
      | 3          |

    # Remove Imposition 1 - cancel then remove
    When I choose to "remove imposition" imposition 1
    Then I am asked to confirm removing imposition 1
    And row number 1 has the following data:
      | Imposition           | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Compensation (FCOMP) | CNAME    | £200.00        | £100.00     | £100.00           |

    When I cancel removing imposition 1
    Then I am viewing Add an Offence

    When I choose to "remove imposition" imposition 1
    Then I am asked to confirm removing imposition 1
    And row number 1 has the following data:
      | Imposition           | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Compensation (FCOMP) | CNAME    | £200.00        | £100.00     | £100.00           |

    When I confirm removing imposition 1
    Then I am viewing Add an Offence
    And I do not see "Compensation (FCOMP)" text on the page

  Scenario: User sees correct reindexing and cannot remove the last remaining imposition
    Given an offence exists with the following impositions:
      | Offence code | Sentence weeks ago | Imposition | Result code            | Amount imposed | Amount paid | Creditor type | Creditor search           | Minor creditor type | Minor creditor name | Address line 1 | Postcode |
      | TP11003      | 9                  | 1          | Compensation (FCOMP)   | 200            | 100         | Minor         |                           | Company             | CNAME               | Addr1          | TE12 3ST |
      | TP11003      | 9                  | 2          | Costs (FCOST)          | 300            | 100         | Major         | Temporary Creditor (TEMP) |                     |                     |                |          |
      | TP11003      | 9                  | 3          | Victim Surcharge (FVS) | 500            | 250         | Default       |                           |                     |                     |                |          |

    Then I see remove imposition links for:
      | Imposition |
      | 1          |
      | 2          |
      | 3          |

    # Remove Imposition 1
    When I choose to "remove imposition" imposition 1
    Then I am asked to confirm removing imposition 1
    And row number 1 has the following data:
      | Imposition           | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Compensation (FCOMP) | CNAME    | £200.00        | £100.00     | £100.00           |

    When I confirm removing imposition 1
    Then I am viewing Add an Offence
    And I do not see "Compensation (FCOMP)" text on the page

    # Remove Imposition 2, now reindexed as imposition 1
    When I choose to "remove imposition" imposition 1
    Then I am asked to confirm removing imposition 1
    And row number 1 has the following data:
      | Imposition    | Creditor                  | Amount imposed | Amount paid | Balance remaining |
      | Costs (FCOST) | Temporary Creditor (TEMP) | £300.00        | £100.00     | £200.00           |

    When I confirm removing imposition 1
    Then I am viewing Add an Offence
    And I do not see "Fine (FO)" text on the page

    # Only one imposition left – cannot remove
    And I do not see the "Remove imposition" link for imposition 1


  Scenario: User removes two impositions and rebuilds four impositions
    When I provide offence details for offence code "TP11003" with a sentence date 9 weeks in the past

    When I record imposition financial details:
      | Imposition | Result code            | Amount imposed | Amount paid |
      | 1          | Victim Surcharge (FVS) | 500            | 250         |
      | 2          | Compensation (FCOMP)   | 300            | 100         |
      | 3          | Costs (FCOST)          | 200            | 100         |

    And I set imposition creditor types:
      | Imposition | Creditor type | Creditor search           |
      | 1          | Default       |                           |
      | 2          | Major         | Temporary Creditor (TEMP) |
      | 3          | Minor         |                           |

    And I maintain company minor creditor with BACS details for imposition 3:
      | Company | Address line 1 | Address line 2 | Address line 3 | Postcode |
      | CNAME3  | Addr1          | Addr2          | Addr3          | TE12 3ST |

    When I remove these impositions:
      | Imposition |
      | 1          |
      | 2          |

    When I record imposition financial details:
      | Imposition | Result code                               | Amount imposed | Amount paid |
      | 1          | Victim Surcharge (FVS)                    | 500            | 250         |
      | 2          | Compensation (FCOMP)                      | 300            | 100         |
      | 3          | Costs (FCOST)                             | 200            | 100         |
      | 4          | Costs to Crown Prosecution Service (FCPC) | 500            | 250         |

    And I set imposition creditor types:
      | Imposition | Creditor type | Creditor search           |
      | 1          | Default       |                           |
      | 2          | Major         | Temporary Creditor (TEMP) |
      | 3          | Minor         |                           |
      | 4          | Default       |                           |

    And I maintain company minor creditor with BACS details for imposition 3:
      | Company | Address line 1 | Address line 2 | Address line 3 | Postcode |
      | CNAME3  | Addr1          | Addr2          | Addr3          | TE12 3ST |

    When I review the offence
    Then the table with offence code "TP11003" should contain the following data:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation     | Temporary Creditor (TEMP)             | £300.00        | £100.00     | £200.00           |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £500.00        | £250.00     | £250.00           |
      | Costs            | CNAME3                                | £200.00        | £100.00     | £100.00           |
      | Costs to Crown   | Crown Prosecution Service (CPS)       | £500.00        | £250.00     | £250.00           |
      | Totals           |                                       | £1500.00       | £700.00     | £800.00           |

  Scenario: User can update remaining impositions and add a new one after removals
    When I provide offence details for offence code "TP11003" with a sentence date 9 weeks in the past

    When I record imposition financial details:
      | Imposition | Result code                               | Amount imposed | Amount paid |
      | 1          | Compensation (FCOMP)                      | 300            | 100         |
      | 2          | Victim Surcharge (FVS)                    | 500            | 250         |
      | 3          | Costs (FCOST)                             | 200            | 100         |
      | 4          | Costs to Crown Prosecution Service (FCPC) | 500            | 250         |

    And I set imposition creditor types:
      | Imposition | Creditor type | Creditor search           |
      | 1          | Major         | Temporary Creditor (TEMP) |
      | 2          | Default       |                           |
      | 3          | Default       |                           |
      | 4          | Default       |                           |

    When I remove these impositions:
      | Imposition |
      | 2          |
      | 3          |

    When I record imposition financial details:
      | Imposition | Result code                               | Amount imposed | Amount paid |
      | 1          | Compensation (FCOMP)                      | 900            | 134         |
      | 2          | Vehicle Excise Back Duty (FVEBD)          | 100            | 50          |
      | 3          | Costs to Crown Prosecution Service (FCPC) | 500            | 250         |

    And I set imposition creditor types:
      | Imposition | Creditor type | Creditor search           |
      | 1          | Major         | Temporary Creditor (TEMP) |
      | 2          | Default       |                           |
      | 3          | Default       |                           |

    When I review the offence
    Then the table with offence code "TP11003" should contain the following data:
      | Imposition                         | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation                       | Temporary Creditor (TEMP)             | £900.00        | £134.00     | £766.00           |
      | Costs to Crown Prosecution Service | Crown Prosecution Service (CPS)       | £500.00        | £250.00     | £250.00           |
      | Vehicle Excise Back Duty           | HM Courts & Tribunals Service (HMCTS) | £100.00        | £50.00      | £50.00            |
      | Totals                             |                                       | £1500.00       | £434.00     | £1066.00          |

  Scenario: (AC.2, AC.7, AC.8) User can add multiple offences and see them ordered with correct totals [@PO-272, @PO-344, @PO-345, @PO-545, @PO-815, @PO-417, @PO-676, @PO-679, @PO-416, @PO-682, @PO-680, @PO-1395]
    # Offence 1
    When I provide offence details for offence code "TP11003" with a sentence date 9 weeks in the past
    And I record imposition financial details:
      | Imposition | Result code            | Amount imposed | Amount paid |
      | 1          | Victim Surcharge (FVS) | 500            | 250         |

    When I review the offence
    And I add another offence

    # Offence 2
    When I provide offence details for offence code "HY35014" with a sentence date 8 weeks in the past
    And I record imposition financial details:
      | Imposition | Result code   | Amount imposed | Amount paid |
      | 1          | Costs (FCOST) | 500            | 250         |
    And I set imposition creditor types:
      | Imposition | Creditor type | Creditor search |
      | 1          | Minor         |                 |
    And I maintain company minor creditor details for imposition 1:
      | Company | Address line 1 | Address line 2 | Address line 3 | Postcode |
      | CNAME   |                |                |                |          |
    And I save the minor creditor details for imposition 1

    And I add another offence

    # Offence 3
    When I provide offence details for offence code "TH68001B" with a sentence date 7 weeks in the past
    And I record imposition financial details:
      | Imposition | Result code | Amount imposed | Amount paid |
      | 1          | Fine (FO)   | 200            | 100         |

    When I review all offences

    Then I see the offences ordered by sentence date:
      | Position | Sentence date offset | Offence code |
      | 1        | 9 weeks ago          | TP11003      |
      | 2        | 8 weeks ago          | HY35014      |
      | 3        | 7 weeks ago          | TH68001B     |

    And the table with offence code "TP11003" will contain the following data:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £500.00        | £250.00     | £250.00           |
      | Totals           |                                       | £500.00        | £250.00     | £250.00           |

    And the table with offence code "HY35014" will contain the following data:
      | Imposition | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Costs      | CNAME    | £500.00        | £250.00     | £250.00           |
      | Totals     |          | £500.00        | £250.00     | £250.00           |

    And the table with offence code "TH68001B" will contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £100.00     | £100.00           |
      | Totals     |                                       | £200.00        | £100.00     | £100.00           |

    And the summary list will contain the following data:
      | Amount imposed | £1200.00 |
      | Amount paid    | £600.00  |
      | Balance        | £600.00  |


  Scenario: (AC.2, AC.7, AC.8) User can change an offence and remove another offence when multiple offences exist [@PO-272, @PO-344, @PO-345, @PO-545, @PO-815, @PO-417, @PO-676, @PO-679, @PO-416, @PO-682, @PO-680, @PO-1395]
    Given the following offences exist for the account:
      | Offence code | Sentence weeks ago | Result code            | Amount imposed | Amount paid | Creditor type | Creditor search | Creditor name | Minor creditor type |
      | TP11003      | 9                  | Victim Surcharge (FVS) | 500            | 250         | Default       |                 |               |                     |
      | HY35014      | 8                  | Costs (FCOST)          | 500            | 250         | Minor         |                 | CNAME         | Company             |
      | TH68001B     | 7                  | Fine (FO)              | 200            | 100         | Default       |                 |               |                     |

    # Change offence TP11003 (Offence 1)
    When I choose to amend offence with offence code "TP11003"
    And I update the sentence date to 6 weeks in the past for the current offence
    And I update imposition financial details for the current offence:
      | Imposition | Result code            | Amount imposed | Amount paid |
      | 1          | Victim Surcharge (FVS) | 300            | 150         |

    And I add another imposition to the current offence
    And I record imposition financial details:
      | Imposition | Result code          | Amount imposed | Amount paid |
      | 2          | Compensation (FCOMP) | 200            | 100         |

    And I set imposition creditor types:
      | Imposition | Creditor type | Creditor search |
      | 2          | Minor         |                 |

    And I maintain company minor creditor with BACS details for imposition 2:
      | Company | Address line 1 | Address line 2 | Address line 3 | Postcode | Account name | Sort code | Account number | Payment reference |
      | CNAME2  |                |                |                |          |              |           |                |                   |

    When I review all offences

    Then the table with offence code "TP11003" should contain the following information:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation     | CNAME2                                | £200.00        | £100.00     | £100.00           |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £300.00        | £150.00     | £150.00           |
      | Totals           |                                       | £500.00        | £250.00     | £250.00           |

    And the table with offence code "HY35014" should contain the following information:
      | Imposition | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Costs      | CNAME    | £500.00        | £250.00     | £250.00           |
      | Totals     |          | £500.00        | £250.00     | £250.00           |

    And the table with offence code "TH68001B" should contain the following information:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £100.00     | £100.00           |
      | Totals     |                                       | £200.00        | £100.00     | £100.00           |

    And the summary list should contain the following information:
      | Amount imposed | £1200.00 |
      | Amount paid    | £600.00  |
      | Balance        | £600.00  |

    # Remove offence TH68001B (Offence 3) – cancel then confirm
    When I choose to remove offence with offence code "TH68001B"
    Then I am asked to confirm removing offence with offence code "TH68001B"
    And the table with offence code "TH68001B" should contain the following information:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £100.00     | £100.00           |
      | Totals     |                                       | £200.00        | £100.00     | £100.00           |

    When I cancel removing offence with offence code "TH68001B"
    Then I see the offence review for offence code "TP11003" with the following information:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation     | CNAME2                                | £200.00        | £100.00     | £100.00           |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £300.00        | £150.00     | £150.00           |
      | Totals           |                                       | £500.00        | £250.00     | £250.00           |

    And I see the offence review for offence code "HY35014" with the following information:
      | Imposition | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Costs      | CNAME    | £500.00        | £250.00     | £250.00           |
      | Totals     |          | £500.00        | £250.00     | £250.00           |

    And I see the offence review for offence code "TH68001B" with the following information:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £100.00     | £100.00           |
      | Totals     |                                       | £200.00        | £100.00     | £100.00           |

    And the summary list should contain the following information:
      | Amount imposed | £1200.00 |
      | Amount paid    | £600.00  |
      | Balance        | £600.00  |

    When I choose to remove offence with offence code "TH68001B"
    Then I am asked to confirm removing offence with offence code "TH68001B"
    And the table with offence code "TH68001B" should contain the following information:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £100.00     | £100.00           |
      | Totals     |                                       | £200.00        | £100.00     | £100.00           |

    When I confirm removing offence with offence code "TH68001B"
    Then I see the offence review for offence code "TP11003" with the following information:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation     | CNAME2                                | £200.00        | £100.00     | £100.00           |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £300.00        | £150.00     | £150.00           |
      | Totals           |                                       | £500.00        | £250.00     | £250.00           |
    And I do not see the offence code "TH68001B"

    Then I see the offences ordered by sentence date:
      | Position | Sentence date offset | Offence code |
      | 1        | 8 weeks ago          | HY35014      |
      | 2        | 6 weeks ago          | TP11003      |

    And I see the offence review for offence code "TP11003" with the following information:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation     | CNAME2                                | £200.00        | £100.00     | £100.00           |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £300.00        | £150.00     | £150.00           |
      | Totals           |                                       | £500.00        | £250.00     | £250.00           |

    And I see the offence review for offence code "HY35014" with the following information:
      | Imposition | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Costs      | CNAME    | £500.00        | £250.00     | £250.00           |
      | Totals     |          | £500.00        | £250.00     | £250.00           |

    And the summary list should contain the following information:
      | Amount imposed | £1000.00 |
      | Amount paid    | £500.00  |
      | Balance        | £500.00  |

  @PO-272 @PO-344 @PO-345 @PO-416 @PO-682 @PO-680
  Scenario: User can add multiple offences and remove all offences
    When I provide offence details for offence code "TP11003" with a sentence date 9 weeks in the past
    And I record imposition financial details:
      | Imposition | Result code          | Amount imposed | Amount paid |
      | 1          | Fine (FO)            | 200            | 50          |
      | 2          | Compensation (FCOMP) | 300            | 100         |
    And I set imposition creditor types:
      | Imposition | Creditor type | Creditor search |
      | 2          | Major         | LBUS            |
    When I review the offence and see the review page
    And the table with offence code "TP11003" should contain the following information:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | LBUSMajorCreditor (LBUS)              | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    When I add another offence
    And I provide offence details for offence code "HY35014" with a sentence date 7 weeks in the past
    And I record imposition financial details:
      | Imposition | Result code   | Amount imposed | Amount paid |
      | 1          | Fine (FO)     | 100            | 25          |
      | 2          | Costs (FCOST) | 250            | 100         |
    And I set imposition creditor types:
      | Imposition | Creditor type | Creditor search           |
      | 2          | Major         | Temporary Creditor (TEMP) |
    When I review the offence and see the review page
    And the table with offence code "HY35014" should contain the following information:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Costs      | Temporary Creditor (TEMP)             | £250.00        | £100.00     | £150.00           |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £350.00        | £125.00     | £225.00           |

    When I add another offence
    And I provide offence details for offence code "TH68001B" with a sentence date 9 weeks in the past
    And I record imposition financial details:
      | Imposition | Result code | Amount imposed | Amount paid |
      | 1          | Fine (FO)   | 100            | 25          |
    When I review the offence and see the review page
    Then I see offence "TH68001B" on the offence review page
    And the table with offence code "TH68001B" should contain the following information:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £100.00        | £25.00      | £75.00            |

    When I choose to remove offence with offence code "HY35014"
    Then I am asked to confirm removing offence with offence code "HY35014"
    And the table with offence code "HY35014" should contain the following information:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Costs      | Temporary Creditor (TEMP)             | £250.00        | £100.00     | £150.00           |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £350.00        | £125.00     | £225.00           |

    When I cancel removing offence with offence code "HY35014"
    Then I am viewing Offences and impositions
    And the table with offence code "HY35014" should contain the following information:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Costs      | Temporary Creditor (TEMP)             | £250.00        | £100.00     | £150.00           |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £350.00        | £125.00     | £225.00           |

    When I remove offence with offence code "HY35014" and confirm
    And the table with offence code "TP11003" should contain the following information:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | LBUSMajorCreditor (LBUS)              | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |
    And the table with offence code "TH68001B" should contain the following information:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £100.00        | £25.00      | £75.00            |

    When I remove offence with offence code "TP11003" and confirm
    And the table with offence code "TH68001B" should contain the following information:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £100.00        | £25.00      | £75.00            |

    When I remove offence with offence code "TH68001B" and confirm
    Then I see no offences messaging

    When I return to account details from offence details
    Then the "Offence details" task status is "Not provided"

  Scenario: (AC.11) Grey navigation links routes correctly [@PO-272, @PO-344, @PO-345, @PO-417, @PO-676, @PO-679]
    When I add offence "TP11003" dated 9 weeks ago with impositions:
      | Imposition | Result code | Amount imposed | Amount paid | Creditor type | Creditor search |
      | 1          | Fine (FO)   | 200            | 50          |               |                 |
    When I review the offence and see the review page
    And I should not see the button with text "Add payment terms"

    When I return to account details from offence details
    Then the "Personal details" task status is "Not provided"
    When I provide manual personal details from account details:
      | title          | Mr             |
      | first names    | Firstname      |
      | last name      | Lastname       |
      | address line 1 | Address line 1 |
    And I return to account details
    Then the "Personal details" task status is "Provided"

    When I view the "Offence details" task
    When I continue to payment terms from offence review

  Scenario: (AC.10, AC.3) Unsaved data is cleared when cancel is clicked [@PO-272, @PO-344, @PO-345, @PO-411, @PO-681, @PO-684, @PO-686]
    When I add and cancel offence "TP11003" dated 9 weeks ago with impositions:
      | Imposition | Result code | Amount imposed | Amount paid | Creditor type | Creditor search |
      | 1          | Fine (FO)   | 200            | 50          |               |                 |
    And I see the following offence detail fields:
      | Field          | Value     | Imposition |
      | Offence code   | TP11003   |            |
      | Result code    | Fine (FO) | 1          |
      | Amount imposed | 200       | 1          |
      | Amount paid    | 50        | 1          |

    When I cancel offence details choosing "Ok"
    Then the "Offence details" task status is "Not provided"

    When I view the "Offence details" task
    And I add offence "TP11003" dated 9 weeks ago with impositions:
      | Imposition | Result code   | Amount imposed | Amount paid | Creditor type | Creditor search |
      | 1          | Costs (FCOST) | 200            | 50          |               |                 |
    And I set imposition creditor types:
      | Imposition | Creditor type |
      | 1          | Minor         |
    When I open and cancel company minor creditor for imposition 1 with company "CNAME"

    When I cancel minor creditor details choosing "Ok"
    Then I am viewing Add an Offence

    When I maintain company minor creditor with BACS details for imposition 1:
      | Company | Address line 1 | Address line 2 | Address line 3 | Postcode | Account name | Sort code | Account number | Payment reference |
      | CNAME   |                |                |                |          |              |           |                |                   |

    When I choose to "change" imposition 1
    And I enter "addr1" into the "Address line 1" field
    When I cancel minor creditor details choosing "Cancel"
    Then I see "addr1" in the "Address line 1" field

    When I cancel minor creditor details choosing "Ok"
    Then I am viewing Add an Offence


  Scenario: Offences screens - Axe core
    Then I check accessibility

    When I add offence "TP11003" dated 9 weeks ago with impositions:
      | Imposition | Result code | Amount imposed | Amount paid | Creditor type | Creditor search |
      | 1          | Fine (FO)   | 200            | 50          |               |                 |
    And I add another imposition
    And I record imposition financial details:
      | Imposition | Result code          | Amount imposed | Amount paid |
      | 2          | Compensation (FCOMP) | 300            | 100         |
    And I set imposition creditor types:
      | Imposition | Creditor type |
      | 2          | Minor         |
    When I perform minor creditor accessibility checks for imposition 2 with company "CNAME"
    And I perform remove minor creditor accessibility check for imposition 2
    And I perform remove imposition accessibility check for imposition 1

    When I review the offence and see the review page
    Then I check accessibility

    When I perform offence removal accessibility check for offence code "TP11003"



  Scenario: AC7. Back button navigation retains search field values [@PO-987, @PO-545]
    When I follow the offence search link in the same tab
    Then I am viewing Search offences

    When I search offences with:
      | Offence code    | TP11003       |
      | Short title     | Transport     |
      | Act and section | Transport Act |
    Then I am viewing offence results
    And I see "Possess potentially dangerous item on Transport for London road transport premises" text on the page

    When I return to the offence search form
    Then I am viewing Search offences
    And I see the offence search form with:
      | Offence code    | TP11003       |
      | Short title     | Transport     |
      | Act and section | Transport Act |

    When I search offences with:
      | Offence code    | XYZ999      |
      | Short title     | NonExistent |
      | Act and section | Invalid Act |
    Then I am viewing offence results
    And I see "There are no matching results" text

    When I return to the offence search form
    Then I am viewing Search offences
    And I see the offence search form with:
      | Offence code    | XYZ999      |
      | Short title     | NonExistent |
      | Act and section | Invalid Act |





  @PO-667 @PO-987 @PO-545
  Scenario: AC1a Guarding against empty offence search submissions
    When I follow the offence search link in the same tab
    Then I am viewing Search offences

    # Guard empty search
    When I submit the offence search
    Then I am viewing Search offences


  @PO-667 @PO-987 @PO-545
  Scenario: AC1b-d Single-field offence searches
    When I follow the offence search link in the same tab

    # Offence code only
    And I search offences with:
      | Offence code | A |

    # Short title only
    When I return to the offence search form
    And I search offences with:
      | Short title | d |

    # Act and Section only
    When I return to the offence search form
    And I search offences with:
      | Act and section | e |


  @PO-667 @PO-987 @PO-545
  Scenario: AC1e Combination offence search across fields
    When I follow the offence search link in the same tab
    And I search offences with:
      | Offence code    | TP        |
      | Short title     | Transport |
      | Act and section | London    |
    Then I see all offence search results have:
      | Column          | Value     |
      | Short title     | Transport |
      | Code            | TP        |
      | Act and section | London    |


  @PO-667 @PO-987 @PO-545
  Scenario: AC1f Case-insensitive offence searches
    When I follow the offence search link in the same tab

    And I search offences with:
      | Offence code | tp11003 |
    Then I see all offence search results have:
      | Column | Value   |
      | Code   | TP11003 |

    When I return to the offence search form
    And I search offences with:
      | Short title | TRANSPORT |
    Then I see all offence search results have:
      | Column      | Value     |
      | Short title | Transport |

    When I return to the offence search form
    And I search offences with:
      | Act and section | LONDON |
    Then I see all offence search results have:
      | Column          | Value  |
      | Act and section | London |

  @only
  # This test assumes there is data already present!
  @PO-667 @PO-987 @PO-545
  Scenario: AC1g-h Starts-with, contains and max-results offence searches
    When I follow the offence search link in the same tab

    # Starts-with (offence code)
    And I search offences with:
      | Offence code | TP47 |
    Then I see offence search results contain rows with values in column:
      | Column | Values           |
      | Code   | TP47033, TP47032 |

    When I return to the offence search form
    And I search offences with:
      | Short title | dangerous |
    Then I see offence search results contain rows with values in column:
      | Column      | Values                            |
      | Short title | dangerous item, dangerous driving |

    When I return to the offence search form
    And I search offences with:
      | Act and section | London |
    Then I see offence search results contain rows with values in column:
      | Column          | Values         |
      | Act and section | London Byelaws |

    # Max results message
    When I return to the offence search form
    And I search offences with:
      | Offence code | A |
    Then I see the offence search max results message "100 results"

  @PO-667 @PO-987 @PO-545
  Scenario: AC2a-b Active and inactive offence filter behaviour
    When I follow the offence search link in the same tab

    When I search offences with:
      | Offence code | AB0 |
    Then I see all offence search results have:
      | Column  | Value   |
      | Used to | Present |

    When I enable inactive offence codes and run the offence search
    Then I am viewing offence results with active and inactive offences

    When I reset the offence search to exclude inactive offence codes
    Then I am viewing offence results with active offences only
