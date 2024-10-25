Feature: PO-417 Create the Offences and Impositions summary screen - Adult or youth only

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page

  Scenario: AC1, AC2, AC3, AC4, AC5, AC6, AC8, AC9, AC10 & AC12 - Add multiple offences and impositions, verify summary screen, return to account details

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
    And I select the "Minor creditor" radio button
    And I click the "Review offence" button
    Then I see "Offences and impositions" on the page header
    And I see "Offence HY35014 added" text on the page
    And I see "Possess potentially dangerous item on Transport for London road transport premises" text on the page
    And I see "Riding a bicycle on a footpath" text on the page

    When the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | British Transport Police (BTPO)       | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    And the table with offence code "HY35014" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Costs      | Minor Creditor                        | £250.00        | £100.00     | £150.00           |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £350.00        | £125.00     | £225.00           |

    And the summary list should contain the following data:
      | Amount imposed    | £850.00 |
      | Amount paid       | 275.00  |
      | Balance remaining | £575.00 |

    And I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Offence details" is "Provided"

  Scenario: AC7 - Test change link, change offence/imposition details, verify changes are reflected successfully

    #AC7 - Only the "Change" link is currently functional

    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field
    And I click the "Add another imposition" button
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1
    And I enter "Criminal Courts Charge (FCC)" into the "Result code" field for imposition 2
    And I enter "300" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I click the "Review offence" button
    Then I see "Offences and impositions" on the page header
    And the table with offence code "TP11003" should contain the following data:
      | Imposition             | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine                   | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Criminal Courts Charge | HM Courts & Tribunals Service (HMCTS) | £300.00        | £100.00     | £200.00           |
      | Totals                 |                                       | £500.00        | £150.00     | £350.00           |

    When I click on the "Change" link
    Then I see "Add an offence" on the page header
    And I see "Fine (FO)" in the "Result code" field for imposition 1
    And I see "200" in the "Amount imposed" field for imposition 1
    And I see "50" in the "Amount paid" field for imposition 1
    And I see "Criminal Courts Charge (FCC)" in the "Result code" field for imposition 2
    And I see "300" in the "Amount imposed" field for imposition 2
    And I see "100" in the "Amount paid" field for imposition 2

    When I click on the "Remove imposition" link for imposition 2
    And I click the "Yes - remove imposition" button
    And I see "Add an offence" on the page header
    And I click the "Add another imposition" button
    And I enter "FORFEITED RECOGNISANCE (FFR)" into the "Result code" field for imposition 2
    And I enter "500" into the "Amount imposed" field for imposition 2
    And I enter "200" into the "Amount paid" field for imposition 2
    And I click the "Review offence" button
    Then the table with offence code "TP11003" should contain the following data:
      | Imposition             | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine                   | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | FORFEITED RECOGNISANCE | HM Courts & Tribunals Service (HMCTS) | £500.00        | £200.00     | £300.00           |
      | Totals                 |                                       | £700.00        | £250.00     | £450.00           |

  Scenario: AC11 - Add payment terms button behaviour

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
