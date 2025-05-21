@ManualAccountCreation @OffenceDetails @PO-272 @PO-344 @PO-345 @PO-545 @PO-412 @PO-668 @PO-669 @PO-413 @PO-817 @PO-818 @PO-414 @PO-670 @PO-671 @PO-686 @PO-696 @PO-411 @PO-681 @PO-684 @PO-815 @PO-417 @PO-676 @PO-679 @PO-416 @PO-682 @PO-680 @PO-1395
Feature: Manual account creation - Offence Details
  #This feature file contains tests for the Offence details pages of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the Offence screens component tests

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page

  Scenario: The User can add an offence with multiple impositions with different creditor types [@PO-272, @PO-344, @PO-345, @PO-545, @PO-412, @PO-668, @PO-669, @PO-413, @PO-817, @PO-818]
    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field

    Then the link with text "Remove imposition" should not be present

    When I click the "Add another imposition" button
    And I click the "Add another imposition" button

    # Imposition 1 - minor creditor
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "100" into the "Amount paid" field for imposition 1
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link for imposition 1
    Then I see "Minor creditor details" on the page header

    When I select the "Individual" radio button
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr1" into the "Address Line 1" field
    And I enter "Addr2" into the "Address Line 2" field
    And I enter "Addr3" into the "Address Line 3" field
    And I enter "TE12 3ST" into the "Postcode" field

    Then I select the "I have BACS payment details" checkbox
    And I enter "F LNAME" into the "Name on the account" field
    And I enter "123456" into the "Sort code" field
    And I enter "12345678" into the "Account number" field
    And I enter "REF" into the "Payment reference" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1
    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor    | FNAME LNAME             |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |




    #Imposition 2 - major creditor
    And I enter "Compensation (FCOMP)" into the "Result code" field for imposition 2
    And I enter "300" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I see "Add creditor" text on the page
    And I select the "Major creditor" radio button
    And I enter "Temporary Creditor" into the "Search using name or code" search box
    And I see "Temporary Creditor (TEMP)" in the "Search using name or code" field for imposition 2


    #Imposition 3 - default creditor
    And I enter "Victim Surcharge (FVS)" into the "Result code" field for imposition 3
    And I enter "500" into the "Amount imposed" field for imposition 3
    And I enter "250" into the "Amount paid" field for imposition 3

    And I see "Remove imposition" link for imposition 1
    And I see "Remove imposition" link for imposition 2
    And I see "Remove imposition" link for imposition 3

    When I click the "Review offence" button
    Then I see "Offences and impositions" on the page header
    And I see "Offence TP11003 added" text on the page

    And I see "Possess potentially dangerous item on Transport for London road transport premises" text on the page

    When the table with offence code "TP11003" should contain the following data:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation     | FNAME LNAME                           | £200.00        | £100.00     | £100.00           |
      | Compensation     | Temporary Creditor (TEMP)             | £300.00        | £100.00     | £200.00           |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £500.00        | £250.00     | £250.00           |
      | Totals           |                                       | £1000.00       | £450.00     | £550.00           |

    And the summary list should contain the following data:
      | Amount imposed    | £1000.00 |
      | Amount paid       | £450.00  |
      | Balance remaining | £550.00  |

    When I click the "Return to account details" button
    And I see the status of "Offence details" is "Provided"

  Scenario: The User can add an offence with a minor creditors and change the creditor details / add / remove a creditor [@PO-272, @PO-344, @PO-345, @PO-545, @PO-412, @PO-414, @PO-668, @PO-669, @PO-670, @PO-671, @PO-686, @PO-696, @PO-1395]
    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field

    # Imposition 1 - minor creditor to be changed
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "100" into the "Amount paid" field for imposition 1
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link for imposition 1
    Then I see "Minor creditor details" on the page header

    When I select the "Individual" radio button
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr1" into the "Address Line 1" field
    And I enter "Addr2" into the "Address Line 2" field
    And I enter "Addr3" into the "Address Line 3" field
    And I enter "TE12 3ST" into the "Postcode" field

    Then I select the "I have BACS payment details" checkbox
    And I enter "F LNAME" into the "Name on the account" field
    And I enter "123456" into the "Sort code" field
    And I enter "12345678" into the "Account number" field
    And I enter "REF" into the "Payment reference" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1
    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor    | FNAME LNAME             |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |


    # Imposition 2 - minor creditor to be removed
    When I click the "Add another imposition" button
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 2
    And I enter "200" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link for imposition 2
    Then I see "Minor creditor details" on the page header

    When I select the "Company" radio button
    And I enter "CNAME" into the "Company" field
    And I enter "Addr1" into the "Address Line 1" field
    And I enter "Addr2" into the "Address Line 2" field
    And I enter "Addr3" into the "Address Line 3" field
    And I enter "TE12 3ST" into the "Postcode" field

    Then I select the "I have BACS payment details" checkbox
    And I enter "F LNAME" into the "Name on the account" field
    And I enter "123456" into the "Sort code" field
    And I enter "12345678" into the "Account number" field
    And I enter "REF" into the "Payment reference" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 2
    Then I see the following Minor creditor details for impostion 2:
      | Minor creditor    | CNAME                   |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |

    # Change minor creditor details for imposition 1
    When I click on the "Change" link for imposition 1
    Then I see "Minor creditor details" on the page header

    When I enter "FNAME1" into the "First name" field
    And I enter "LNAME1" into the "Last name" field
    And I enter "Addr1_edit" into the "Address Line 1" field
    And I enter "Addr2_edit" into the "Address Line 2" field
    And I enter "Addr3_edit" into the "Address Line 3" field
    And I enter "ED32 1IT" into the "Postcode" field

    Then I enter "F LNAME1" into the "Name on the account" field
    And I enter "654321" into the "Sort code" field
    And I enter "87654321" into the "Account number" field
    And I enter "REF1" into the "Payment reference" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1
    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor    | FNAME1 LNAME1                          |
      | Address           | Addr1_editAddr2_editAddr3_editED32 1IT |
      | Payment method    | BACS                                   |
      | Account name      | F LNAME1                               |
      | Sort code         | 65-43-21                               |
      | Account number    | 87654321                               |
      | Payment reference | REF1                                   |

    # Remove minor creditor for imposition 2
    When I click on the "Remove" link for imposition 2
    Then I see "Are you sure you want to remove this minor creditor?" on the page header
    And I see the following Minor creditor details:
      | Minor creditor    | CNAME                   |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |

    When I click on the "No - cancel" link
    Then I see "Add an offence" on the page header

    Then I click on the "Remove" link for imposition 2
    Then I see "Are you sure you want to remove this minor creditor?" on the page header
    And I see the following Minor creditor details:
      | Minor creditor    | CNAME                   |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |

    Then I click the "Yes - remove minor creditor" button
    Then I see "Add an offence" on the page header

    And I do not see the Minor creditor details for impostion 2

    #Adding imposition 2 again to be removed later
    When I click on the "Add minor creditor details" link for imposition 2
    Then I see "Minor creditor details" on the page header

    When I select the "Company" radio button
    And I enter "CNAME_NEW" into the "Company" field
    And I enter "Addr1_" into the "Address Line 1" field
    And I enter "Addr2_" into the "Address Line 2" field
    And I enter "Addr3_" into the "Address Line 3" field
    And I enter "TE12 3ST" into the "Postcode" field

    Then I select the "I have BACS payment details" checkbox
    And I enter "F LNAME_2" into the "Name on the account" field
    And I enter "654321" into the "Sort code" field
    And I enter "87654321" into the "Account number" field
    And I enter "REF_2" into the "Payment reference" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 2
    Then I see the following Minor creditor details for impostion 2:
      | Minor creditor    | CNAME_NEW                  |
      | Address           | Addr1_Addr2_Addr3_TE12 3ST |
      | Payment method    | BACS                       |
      | Account name      | F LNAME_2                  |
      | Sort code         | 65-43-21                   |
      | Account number    | 87654321                   |
      | Payment reference | REF_2                      |

    When I click the "Review offence" button
    Then I see "Offences and impositions" on the page header

    When the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor      | Amount imposed | Amount paid | Balance remaining |
      | Compensation | FNAME1 LNAME1 | £200.00        | £100.00     | £100.00           |
      | Compensation | CNAME_NEW     | £200.00        | £100.00     | £100.00           |
      | Totals       |               | £400.00        | £200.00     | £200.00           |

    Then I click on the "Change" link
    Then I see "Add an offence" on the page header
    # Change minor creditor details for imposition 1
    When I click on the "Change" link for imposition 1
    Then I see "Minor creditor details" on the page header

    When I enter "FNAME2_EDIT" into the "First name" field
    And I enter "LNAME2_EDIT" into the "Last name" field
    And I enter "Addr1_edit" into the "Address Line 1" field
    And I enter "Addr2_edit" into the "Address Line 2" field
    And I enter "Addr3_edit" into the "Address Line 3" field
    And I enter "TE12 3ST" into the "Postcode" field

    Then I enter "F LNAME2_EDIT" into the "Name on the account" field
    And I enter "123456" into the "Sort code" field
    And I enter "12345678" into the "Account number" field
    And I enter "REF_EDIT" into the "Payment reference" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1
    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor    | FNAME2_EDIT LNAME2_EDIT                |
      | Address           | Addr1_editAddr2_editAddr3_editTE12 3ST |
      | Payment method    | BACS                                   |
      | Account name      | F LNAME2_EDIT                          |
      | Sort code         | 12-34-56                               |
      | Account number    | 12345678                               |
      | Payment reference | REF_EDIT                               |

    # Remove minor creditor for imposition 2
    When I click on the "Remove" link for imposition 2
    Then I see "Are you sure you want to remove this minor creditor?" on the page header
    And I see the following Minor creditor details:
      | Minor creditor    | CNAME_NEW                  |
      | Address           | Addr1_Addr2_Addr3_TE12 3ST |
      | Payment method    | BACS                       |
      | Account name      | F LNAME_2                  |
      | Sort code         | 65-43-21                   |
      | Account number    | 87654321                   |
      | Payment reference | REF_2                      |

    When I click the "Yes - remove minor creditor" button
    Then I see "Add an offence" on the page header

    And I do not see the Minor creditor details for impostion 2
    #change to major creditor
    And I see "Add creditor" text on the page
    And I select the "Major creditor" radio button
    And I enter "Temporary Creditor" into the "Search using name or code" search box
    And I see "Temporary Creditor (TEMP)" in the "Search using name or code" field for imposition 2

    # Add another imposition with a minor creditor
    Then I click the "Add another imposition" button
    And I enter "Compensation (FCOMP)" into the "Result code" field for imposition 3
    And I enter "200" into the "Amount imposed" field for imposition 3
    And I enter "100" into the "Amount paid" field for imposition 3
    And I select the "Minor creditor" radio button for imposition 3
    When I click on the "Add minor creditor details" link for imposition 3
    Then I see "Minor creditor details" on the page header

    When I select the "Company" radio button
    And I enter "CNAME3" into the "Company" field
    And I enter "Addr1" into the "Address Line 1" field
    And I enter "Addr2" into the "Address Line 2" field
    And I enter "Addr3" into the "Address Line 3" field
    And I enter "TE12 3ST" into the "Postcode" field

    Then I select the "I have BACS payment details" checkbox
    And I enter "F LNAME3" into the "Name on the account" field
    And I enter "123456" into the "Sort code" field
    And I enter "12345678" into the "Account number" field
    And I enter "REF" into the "Payment reference" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 3
    Then I see the following Minor creditor details for impostion 3:
      | Minor creditor    | CNAME3                  |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME3                |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |

    Then I click the "Review offence" button
    Then I see "Offences and impositions" on the page header

    When the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                   | Amount imposed | Amount paid | Balance remaining |
      | Compensation | Mr FNAME2_EDIT LNAME2_EDIT | £200.00        | £100.00     | £100.00           |
      | Compensation | Temporary Creditor (TEMP)  | £200.00        | £100.00     | £100.00           |
      | Compensation | CNAME3                     | £200.00        | £100.00     | £100.00           |
      | Totals       |                            | £600.00        | £300.00     | £300.00           |

  Scenario: The User can add an offence with multiple impositions and add / change / remove an imposition [@PO-272, @PO-344, @PO-345, @PO-545, @PO-411, @PO-681, @PO-684, @PO-1395]
    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field

    # Imposition 1 - minor creditor
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "100" into the "Amount paid" field for imposition 1
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link for imposition 1
    Then I see "Minor creditor details" on the page header

    When I select the "Company" radio button
    And I enter "CNAME" into the "Company" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    # Imposition 2 - major creditor
    And I click the "Add another imposition" button
    And I enter "Costs (FCOST)" into the "Result code" field for imposition 2
    And I enter "300" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I select the "Major creditor" radio button
    And I enter "Temporary Creditor" into the "Search using name or code" search box
    And I see "Temporary Creditor (TEMP)" in the "Search using name or code" field for imposition 2

    # Imposition 3 - default creditor
    And I click the "Add another imposition" button
    And I enter "Victim Surcharge (FVS)" into the "Result code" field for imposition 3
    And I enter "500" into the "Amount imposed" field for imposition 3
    And I enter "250" into the "Amount paid" field for imposition 3

    And I see "Remove imposition" link for imposition 1
    And I see "Remove imposition" link for imposition 2
    And I see "Remove imposition" link for imposition 3

    #Remove Imposition 1 - cancel then remove
    When I click on the "Remove imposition" link for imposition 1
    Then I see "Are you sure you want to remove this imposition?" on the page header
    And row number 1 should have the following data:
      | Imposition           | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Compensation (FCOMP) | CNAME    | £200.00        | £100.00     | £100.00           |

    When I click on the "No - cancel" link
    Then I see "Add an offence" on the page header

    When I click on the "Remove imposition" link for imposition 1
    Then I see "Are you sure you want to remove this imposition?" on the page header
    And row number 1 should have the following data:
      | Imposition           | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Compensation (FCOMP) | CNAME    | £200.00        | £100.00     | £100.00           |

    When I click the "Yes - remove imposition" button
    Then I see "Add an offence" on the page header

    And I do not see "Compensation (FCOMP)" text on the page

    #Remove Imposition 2, now imposition 1
    When I click on the "Remove imposition" link for imposition 1
    Then I see "Are you sure you want to remove this imposition?" on the page header
    And row number 1 should have the following data:
      | Imposition    | Creditor                  | Amount imposed | Amount paid | Balance remaining |
      | Costs (FCOST) | Temporary Creditor (TEMP) | £300.00        | £100.00     | £200.00           |

    When I click the "Yes - remove imposition" button
    Then I see "Add an offence" on the page header
    And I do not see "Fine (FO)" text on the page

    #Remove Imposition 3, now imposition 1
    When I do not see the "Remove imposition" link for imposition 1

    #Add back impositions
    # Imposition 2 - major creditor
    And I click the "Add another imposition" button
    And I enter "Compensation (FCOMP)" into the "Result code" field for imposition 2
    And I enter "300" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I select the "Major creditor" radio button for imposition 2
    And I enter "Temporary Creditor" into the "Search using name or code" search box
    And I see "Temporary Creditor (TEMP)" in the "Search using name or code" field for imposition 2

    # Imposition 3 - minor creditor
    And I click the "Add another imposition" button
    And I enter "Costs (FCOST)" into the "Result code" field for imposition 3
    And I enter "200" into the "Amount imposed" field for imposition 3
    And I enter "100" into the "Amount paid" field for imposition 3
    And I select the "Minor creditor" radio button for imposition 3
    When I click on the "Add minor creditor details" link for imposition 3
    Then I see "Minor creditor details" on the page header



    When I select the "Company" radio button
    And I enter "CNAME3" into the "Company" field
    Then I click the "Save" button
    Then I see "Add an offence" on the page header

    # Imposition 4 - default creditor
    And I click the "Add another imposition" button
    And I enter "Costs to Crown Prosecution Service (FCPC)" into the "Result code" field for imposition 4
    And I enter "500" into the "Amount imposed" field for imposition 4
    And I enter "250" into the "Amount paid" field for imposition 4

    When I click the "Review offence" button
    Then I see "Offences and impositions" on the page header

    When the table with offence code "TP11003" should contain the following data:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation     | Temporary Creditor (TEMP)             | £300.00        | £100.00     | £200.00           |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £500.00        | £250.00     | £250.00           |
      | Costs            | CNAME3                                | £200.00        | £100.00     | £100.00           |
      | Costs to Crown   | Crown Prosecution Service (CPS)       | £500.00        | £250.00     | £250.00           |
      | Totals           |                                       | £1500.00       | £700.00     | £800.00           |

    Then I click on the "Change" link
    Then I see "Add an offence" on the page header

    #Remove imposition 1
    When I click on the "Remove imposition" link for imposition 1
    Then I see "Are you sure you want to remove this imposition?" on the page header
    And row number 1 should have the following data:
      | Imposition             | Creditor                                | Amount imposed | Amount paid | Balance remaining |
      | Victim Surcharge (FVS) | HM Courts and Tribunals Service (HMCTS) | £500.00        | £250.00     | £250.00           |

    When I click the "Yes - remove imposition" button
    Then I see "Add an offence" on the page header

    And I do not see "Victim Surcharge (FVS)" text on the page

    #Remove imposition 4
    When I click on the "Remove imposition" link for imposition 3
    Then I see "Are you sure you want to remove this imposition?" on the page header
    And row number 1 should have the following data:
      | Imposition                                | Creditor                        | Amount imposed | Amount paid | Balance remaining |
      | Costs to Crown Prosecution Service (FCPC) | Crown Prosecution Service (CPS) | £500.00        | £250.00     | £250.00           |

    When I click the "Yes - remove imposition" button
    Then I see "Add an offence" on the page header

    #Change imposition 2
    And I clear the "Amount imposed" field for imposition 2
    And I clear the "Amount paid" field for imposition 2

    And I enter "900" into the "Amount imposed" field for imposition 2
    And I enter "134" into the "Amount paid" field for imposition 2

    #Add another imposition
    And I click the "Add another imposition" button
    And I enter "Vehicle Excise Back Duty (FVEBD)" into the "Result code" field for imposition 3
    And I enter "100" into the "Amount imposed" field for imposition 3
    And I enter "50" into the "Amount paid" field for imposition 3

    Then I click the "Review offence" button
    Then I see "Offences and impositions" on the page header

    When the table with offence code "TP11003" should contain the following data:
      | Imposition     | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation   | Temporary Creditor (TEMP)             | £300.00        | £100.00     | £200.00           |
      | Costs          | CNAME3                                | £900.00        | £134.00     | £766.00           |
      | Vehicle Excise | HM Courts & Tribunals Service (HMCTS) | £100.00        | £50.00      | £50.00            |
      | Totals         |                                       | £1300.00       | £284.00     | £1016.00          |

  Scenario: (AC.2, AC.7, AC.8) The User can add multiple offences and add / change / remove offences [@PO-272, @PO-344, @PO-345, @PO-545, @PO-815, PO-417, @PO-676, @PO-679, @PO-416, @PO-682, @PO-680, @PO-1395]

    #Offence 1
    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field

    And I enter "Victim Surcharge (FVS)" into the "Result code" field for imposition 1
    And I enter "500" into the "Amount imposed" field for imposition 1
    And I enter "250" into the "Amount paid" field for imposition 1

    Then I click the "Review offence" button
    And I click the "Add another offence" button

    #Offence 2
    When I enter "HY35014" into the "Offence code" field
    And I enter a date 8 weeks into the past into the "Date of sentence" date field

    And I enter "Costs (FCOST)" into the "Result code" field for imposition 1
    And I enter "500" into the "Amount imposed" field for imposition 1
    And I enter "250" into the "Amount paid" field for imposition 1
    And I select the "Minor creditor" radio button for imposition 1

    When I click on the "Add minor creditor details" link for imposition 1
    Then I see "Minor creditor details" on the page header
    And I select the "Company" radio button
    And I enter "CNAME" into the "Company" field
    Then I click the "Save" button

    And I click the "Add another offence" button

    #Offence 3
    When I enter "TH68001B" into the "Offence code" field
    And I enter a date 7 weeks into the past into the "Date of sentence" date field

    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "100" into the "Amount paid" field for imposition 1

    Then I click the "Review offence" button

    And I see the date of sentence 9 weeks ago above the date of sentence 8 weeks ago
    And I see the date of sentence 8 weeks ago above the date of sentence 7 weeks ago

    And the table with offence code "TP11003" should contain the following data:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £500.00        | £250.00     | £250.00           |
      | Totals           |                                       | £500.00        | £250.00     | £250.00           |

    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Costs      | CNAME    | £500.00        | £250.00     | £250.00           |
      | Totals     |          | £500.00        | £250.00     | £250.00           |

    And the table with offence code "TH68001B" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £100.00     | £100.00           |
      | Totals     |                                       | £200.00        | £100.00     | £100.00           |

    And the summary list should contain the following data:
      | Amount imposed | £1200.00 |
      | Amount paid    | £600.00  |
      | Balance        | £600.00  |

    Then I click the "Change" link for offence "TP11003"
    Then I see "Add an offence" on the page header

    #Change offence date and change / add imposition details
    And I enter a date 6 weeks into the past into the "Date of sentence" date field
    And I clear the "Amount imposed" field for imposition 1
    And I clear the "Amount paid" field for imposition 1

    And I enter "300" into the "Amount imposed" field for imposition 1
    And I enter "150" into the "Amount paid" field for imposition 1

    And I click the "Add another imposition" button
    And I enter "Compensation (FCOMP)" into the "Result code" field for imposition 2
    And I enter "200" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I select the "Minor creditor" radio button for imposition 2

    When I click on the "Add minor creditor details" link for imposition 2
    Then I see "Minor creditor details" on the page header
    And I select the "Company" radio button
    And I enter "CNAME2" into the "Company" field
    Then I click the "Save" button

    Then I click the "Review offence" button

    And the table with offence code "TP11003" should contain the following data:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation     | CNAME2                                | £200.00        | £100.00     | £100.00           |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £300.00        | £150.00     | £150.00           |
      | Totals           |                                       | £500.00        | £250.00     | £250.00           |

    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Costs      | CNAME    | £500.00        | £250.00     | £250.00           |
      | Totals     |          | £500.00        | £250.00     | £250.00           |

    And the table with offence code "TH68001B" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £100.00     | £100.00           |
      | Totals     |                                       | £200.00        | £100.00     | £100.00           |

    And the summary list should contain the following data:
      | Amount imposed | £1200.00 |
      | Amount paid    | £600.00  |
      | Balance        | £600.00  |

    Then I click the "Remove" link for offence "TH68001B"
    Then I see "Are you sure you want to remove this offence and all its impositions?" on the page header
    And the table with offence code "TH68001B" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £100.00     | £100.00           |
      | Totals     |                                       | £200.00        | £100.00     | £100.00           |

    #Cancel then remove
    When I click on the "No - cancel" link
    Then I see "Offences and impositions" on the page header

    And the table with offence code "TP11003" should contain the following data:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation     | CNAME2                                | £200.00        | £100.00     | £100.00           |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £300.00        | £150.00     | £150.00           |
      | Totals           |                                       | £500.00        | £250.00     | £250.00           |

    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Costs      | CNAME    | £500.00        | £250.00     | £250.00           |
      | Totals     |          | £500.00        | £250.00     | £250.00           |

    And the table with offence code "TH68001B" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £100.00     | £100.00           |
      | Totals     |                                       | £200.00        | £100.00     | £100.00           |

    And the summary list should contain the following data:
      | Amount imposed | £1200.00 |
      | Amount paid    | £600.00  |
      | Balance        | £600.00  |

    Then I click the "Remove" link for offence "TH68001B"
    Then I see "Are you sure you want to remove this offence and all its impositions?" on the page header
    And the table with offence code "TH68001B" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £100.00     | £100.00           |
      | Totals     |                                       | £200.00        | £100.00     | £100.00           |

    When I click the "Yes - remove offence" button
    Then I see "Offences and impositions" on the page header
    And I do not see the offence code "TH68001B" on the page

    And I see the date of sentence 8 weeks ago above the date of sentence 6 weeks ago


    And the table with offence code "TP11003" should contain the following data:
      | Imposition       | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation     | CNAME2                                | £200.00        | £100.00     | £100.00           |
      | Victim Surcharge | HM Courts & Tribunals Service (HMCTS) | £300.00        | £150.00     | £150.00           |
      | Totals           |                                       | £500.00        | £250.00     | £250.00           |

    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Costs      | CNAME    | £500.00        | £250.00     | £250.00           |
      | Totals     |          | £500.00        | £250.00     | £250.00           |

    And the summary list should contain the following data:
      | Amount imposed | £1000.00 |
      | Amount paid    | £500.00  |
      | Balance        | £500.00  |

  Scenario: The User can add multiple offences and remove all offences [@PO-272, @PO-344, @PO-345, @PO-416, @PO-682, @PO-680]
    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field
    And I click the "Add another imposition" button
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1
    And I enter "Compensation (FCOMP)" into the "Result code" field for imposition 2
    And I enter "300" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I see "Add creditor" text on the page
    And I select the "Major creditor" radio button
    And I enter "LBUS" into the "Search using name or code" search box
    And I see "LBUSMajorCreditor (LBUS)" in the "Search using name or code" field for imposition 2
    And I click the "Review offence" button
    Then I see "Offences and impositions" on the page header
    And I see "Offence TP11003 added" text on the page

    And the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | LBUSMajorCreditor (LBUS)              | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    When I click the "Add another offence" button
    And I see "Add an offence" on the page header
    And I enter "HY35014" into the "Offence code" field
    And I enter a date 7 weeks into the past into the "Date of sentence" date field
    And I click the "Add another imposition" button
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "100" into the "Amount imposed" field for imposition 1
    And I enter "25" into the "Amount paid" field for imposition 1
    And I enter "Costs (FCOST)" into the "Result code" field for imposition 2
    And I enter "250" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I see "Add creditor" text on the page
    And I select the "Major creditor" radio button
    And I enter "Temporary Creditor (TEMP)" into the "Search using name or code" search box

    When I click the "Add another offence" button
    And I see "Add an offence" on the page header
    And I enter "TH68001B" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "100" into the "Amount imposed" field for imposition 1
    And I enter "25" into the "Amount paid" field for imposition 1

    And I click the "Review offence" button
    Then I see "Offences and impositions" on the page header
    And I see "Offence TH68001B added" text on the page
    And I see "Possess potentially dangerous item on Transport for London road transport premises" text on the page
    And I see "Riding a bicycle on a footpath" text on the page

    Then the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | LBUSMajorCreditor (LBUS)              | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Costs      | Temporary Creditor (TEMP)             | £250.00        | £100.00     | £150.00           |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £350.00        | £125.00     | £225.00           |

    And the table with offence code "TH68001B" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £100.00        | £25.00      | £75.00            |

    When I click the "Remove" link for offence "HY35014"
    Then I see "Are you sure you want to remove this offence and all its impositions?" on the page header
    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Costs      | Temporary Creditor (TEMP)             | £250.00        | £100.00     | £150.00           |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £350.00        | £125.00     | £225.00           |

    When I click on the "No - cancel" link
    Then I see "Offences and impositions" on the page header

    Then the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | LBUSMajorCreditor (LBUS)              | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Costs      | Temporary Creditor (TEMP)             | £250.00        | £100.00     | £150.00           |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £350.00        | £125.00     | £225.00           |

    And the table with offence code "TH68001B" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £100.00        | £25.00      | £75.00            |

    When I click the "Remove" link for offence "HY35014"
    Then I see "Are you sure you want to remove this offence and all its impositions?" on the page header
    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Costs      | Temporary Creditor (TEMP)             | £250.00        | £100.00     | £150.00           |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £350.00        | £125.00     | £225.00           |

    When I click the "Yes - remove offence and all impositions" button
    Then I see "Offences and impositions" on the page header

    And the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | LBUSMajorCreditor (LBUS)              | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    And the table with offence code "TH68001B" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £100.00        | £25.00      | £75.00            |

    And I do not see the offence code "HY35014" on the page

    When I click the "Remove" link for offence "TP11003"
    Then I see "Are you sure you want to remove this offence and all its impositions?" on the page header
    And the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | LBUSMajorCreditor (LBUS)              | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    When I click the "Yes - remove offence and all impositions" button

    And I do not see the offence code "TP11003" on the page

    And the table with offence code "TH68001B" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £100.00        | £25.00      | £75.00            |

    When I click the "Remove" link for offence "TH68001B"
    Then I see "Are you sure you want to remove this offence and all its impositions?" on the page header
    And the table with offence code "TH68001B" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £100.00        | £25.00      | £75.00            |

    When I click the "Yes - remove offence and all impositions" button

    And I do not see the offence code "TP11003" on the page

    Then I see "Offences and impositions" on the page header
    And I see "There are no offences" text on the page
    And I see the "Add another offence" button
    And I see the "Return to account details" button

    When I click the "Return to account details" button
    Then I see the status of "Offence details" is "Not provided"

  Scenario: (AC.11) Grey navigation links routes correctly [@PO-272, @PO-344, @PO-345, @PO-417, @PO-676, @PO-679]
    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1
    And I click the "Review offence" button
    Then I see "Offences and impositions" on the page header
    And the button with text "Add payment terms" should not be present

    When I click the "Return to account details" button
    And I see the status of "Personal details" is "Not provided"
    And I click on the "Personal details" link
    And I see "Personal details" on the page header
    And I select title "Mr" from dropdown
    And I enter "Firstname" into the "First names" field
    And I enter "Lastname" into the "Last name" field
    And I enter "Address line 1" into the "Address line 1" field
    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"

    When I click on the "Offence details" link
    And I see "Offences and impositions" on the page header
    And I click the "Add payment terms" button
    Then I see "Payment terms" on the page header

  Scenario: (AC.10, AC.3) Unsaved data is cleared when cancel is clicked [@PO-272, @PO-344, @PO-345, @PO-411, @PO-681, @PO-684, @PO-686]
    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1
    And I click Cancel, a window pops up and I click Cancel

    Then I see "Add an offence" on the page header

    When I see "TP11003" in the "Offence code" field
    And I see "Fine (FO)" in the "Result code" field for imposition 1
    And I see "200" in the "Amount imposed" field for imposition 1
    And I see "50" in the "Amount paid" field for imposition 1

    Then I click Cancel, a window pops up and I click Ok

    Then I see the status of "Offence details" is "Not provided"

    Then I click on the "Offence details" link
    And I see "Add an offence" on the page header

    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field
    And I enter "Costs (FCOST)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1
    And I select the "Minor creditor" radio button for imposition 1
    And I click on the "Add minor creditor details" link for imposition 1
    And I see "Minor creditor details" on the page header
    And I select the "Company" radio button
    And I enter "CNAME" into the "Company" field
    And I click Cancel, a window pops up and I click Cancel

    Then I validate the "Company" radio button is selected
    And I see "CNAME" in the "Company" field

    Then I click Cancel, a window pops up and I click Ok

    And I do not see the Minor creditor details for impostion 1

    Then I click on the "Add minor creditor details" link for imposition 1
    And I see "Minor creditor details" on the page header
    And I select the "Company" radio button
    And I enter "CNAME" into the "Company" field
    And I click the "Save" button

    Then I click on the "Change" link for imposition 1
    And I enter "addr1" into the "Address line 1" field
    And I click Cancel, a window pops up and I click Cancel

    Then I see "addr1" in the "Address line 1" field

    Then I click Cancel, a window pops up and I click Ok
    And I click on the "Change" link for imposition 1

    Then I see "" in the "Address line 1" field

  Scenario: Offences screens - Axe core
    # check accessibility on Add an offence screen
    Then I check accessibility

    #Add offence details
    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1

    And I click the "Add another imposition" button
    And I enter "Compensation (FCOMP)" into the "Result code" field for imposition 2
    And I enter "300" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I select the "Minor creditor" radio button for imposition 2
    When I click on the "Add minor creditor details" link for imposition 2

    #Check accessibility of Minor creditor details screen
    Then I see "Minor creditor details" on the page header
    And I select the "Individual" radio button
    And I check accessibility

    Then I select the "Company" radio button
    And I enter "CNAME" into the "Company" field

    Then I select the "I have BACS payment details" checkbox

    And I check accessibility
    Then I unselect the "I have BACS payment details" checkbox

    And I click the "Save" button
    Then I see "Add an offence" on the page header

    #Check accessibility of Remove Minor creditor screen
    When I click on the "Remove" link for imposition 2
    Then I see "Are you sure you want to remove this minor creditor?" on the page header
    And I check accessibility

    When I click on the "No - cancel" link
    Then I see "Add an offence" on the page header

    #Check accessibility of Remove imposition screen
    When I click on the "Remove imposition" link for imposition 1
    Then I see "Are you sure you want to remove this imposition?" on the page header
    And I check accessibility

    When I click on the "No - cancel" link
    Then I see "Add an offence" on the page header

    #Check accessibility on Review offence screen

    And I click the "Review offence" button
    Then I see "Offences and impositions" on the page header
    Then I check accessibility

    #Check accessibility on Remove offence screen
    When I click the "Remove" link for offence "TP11003"
    Then I see "Are you sure you want to remove this offence and all its impositions?" on the page header
    And I check accessibility
    When I click the "Yes - remove offence and all impositions" button
    Then I see "Offences and impositions" on the page header
    And I check accessibility

  Scenario: AC.1c, AC.1d, AC.3, AC.4 user selects the 'Search' button on the 'Search Offences' screen and at least one of the search fields has at least one character entered [@PO-545, @PO-667]
    And I open the "search the offence list" link in the same tab

    And I see "Search offences" on the page header
    And I click the search button

    Then I see "Search offences" on the page header

    And I enter "ABC123" into the "Offence code" field
    And I enter "Title name" into the "Short title" field
    And I enter "testing the new field" into the "Act and section" text field

    And I click the search button
    Then I see "Search results" on the page header

  Scenario: Offence search screen - Axe core
    # check accessibility on Add an offence screen
    And I open the "search the offence list" link in the same tab

    #Check accessibility of Search offences screen
    And I enter "ABC123" into the "Offence code" field
    And I enter "Title name" into the "Short title" field
    And I enter "testing the new field" into the "Act and section" text field

    And I click the search button
    Then I see "Search results" on the page header
    And I check accessibility







