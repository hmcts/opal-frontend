Feature: PO-416,682,680 - Offence Removal Confirmation Screen - All defendant types

  Scenario Outline: AC12,3,4,5,6 - Offence Removal Confirmation Screen
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "<accountType>" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page


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
    And I enter "BTPO" into the "Search using name or code" search box
    And I see "British Transport Police (BTPO)" in the "Search using name or code" field for imposition 2
    And I click the "Review offence" button
    Then I see "Offences and impositions" on the page header
    And I see "Offence TP11003 added" text on the page

    And the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | British Transport Police (BTPO)       | £300.00        | £100.00     | £200.00           |
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
    And I enter "Tesco Stores (TESC)" into the "Search using name or code" search box

    And I click the "Review offence" button
    Then I see "Offences and impositions" on the page header
    And I see "Offence HY35014 added" text on the page
    And I see "Possess potentially dangerous item on Transport for London road transport premises" text on the page
    And I see "Riding a bicycle on a footpath" text on the page

    Then the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | British Transport Police (BTPO)       | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Costs      | Tesco Stores (TESC)                   | £250.00        | £100.00     | £150.00           |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £350.00        | £125.00     | £225.00           |

    When I click the "Remove" link for offence "HY35014"
    Then I see "Are you sure you want to remove this offence and all its impositions?" on the page header
    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Costs      | Tesco Stores (TESC)                   | £250.00        | £100.00     | £150.00           |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £350.00        | £125.00     | £225.00           |

    When I click on the "No - cancel" link
    Then I see "Offences and impositions" on the page header

    Then the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | British Transport Police (BTPO)       | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Costs      | Tesco Stores (TESC)                   | £250.00        | £100.00     | £150.00           |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £350.00        | £125.00     | £225.00           |

    When I click the "Remove" link for offence "HY35014"
    Then I see "Are you sure you want to remove this offence and all its impositions?" on the page header
    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Costs      | Tesco Stores (TESC)                   | £250.00        | £100.00     | £150.00           |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £350.00        | £125.00     | £225.00           |

    When I click the "Yes - remove offence and all impositions" button
    Then I see "Offences and impositions" on the page header

    And the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | British Transport Police (BTPO)       | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    And I do not see the offence code "HY35014" on the page

    When I click the "Remove" link for offence "TP11003"
    Then I see "Are you sure you want to remove this offence and all its impositions?" on the page header
    And the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | British Transport Police (BTPO)       | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    When I click the "Yes - remove offence and all impositions" button
    Then I see "Offences and impositions" on the page header
    And I see "There are no offences" text on the page
    And I see the "Add another offence" button
    And I see the "Return to account details" button


    Examples:
      | accountType                                   |
      | Adult or youth only                           |
      | Adult or youth with parent or guardian to pay |
      | Company                                       |
