Feature: PO-815 Introduce a 'Add another offence' button onto the 'Add an Offence' screen (All defendants)

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button

  Scenario: AC1, AC3, AC4, AC5 & AC6 - Add offences, successful validation, check summary screen for A/Y only

    When I select the "Adult or youth only" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page

    When I enter "TP11003" into the "Offence code" field
    And I enter a date 1 weeks into the past into the "Date of sentence" date field
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
    And I click the "Add another offence" button
    Then I see "Add an offence" on the page header
    And I see "Offence TP11003 added" text on the page
    And I see "" in the "Date of sentence" date field
    And I see "" in the "Offence code" field
    And I see "" in the "Result code" field for imposition 1
    And I see "" in the "Amount imposed" field for imposition 1
    And I see "" in the "Amount paid" field for imposition 1

    And I enter "HY35014" into the "Offence code" field
    And I enter a date 2 weeks into the past into the "Date of sentence" date field
    And I click the "Add another imposition" button
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "100" into the "Amount imposed" field for imposition 1
    And I enter "25" into the "Amount paid" field for imposition 1
    And I enter "Vehicle Excise Back Duty (FVEBD)" into the "Result code" field for imposition 2
    And I enter "250" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2

    And I click the "Add another offence" button
    And I enter "TH68001B" into the "Offence code" field
    And I enter a date 2 weeks into the past into the "Date of sentence" date field
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "100" into the "Amount imposed" field for imposition 1
    And I enter "25" into the "Amount paid" field for imposition 1

    And I click the "Review offence" button

    Then I see the date of sentence 2 weeks ago above the date of sentence 1 weeks ago
    And I see the offence "HY35014" above the offence "TH68001B"

    Then I see "Offences and impositions" on the page header

    And the table with offence code "HY35014" should contain the following data:
      | Imposition               | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine                     | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Vehicle Excise Back Duty | HM Courts & Tribunals Service (HMCTS) | £250.00        | £100.00     | £150.00           |
      | Totals                   |                                       | £350.00        | £125.00     | £225.00           |

    And the table with offence code "TH68001B" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Totals     |                                       | £100.00        | £25.00      | £75.00            |

    And the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | British Transport Police (BTPO)       | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    And the summary list should contain the following data:
      | Amount imposed    | £950.00 |
      | Amount paid       | 300.00  |
      | Balance remaining | £650.00 |


  Scenario: AC2 - Error handling for A/Y only

    When I select the "Adult or youth only" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page

    When I click the "Add another offence" button
    Then I see the error message "Enter sentence date" at the top of the page
    And I see the error message "Enter an offence code" at the top of the page
    And I see the error message "Enter an imposition code" at the top of the page
    And I see the error message "Enter amount imposed" at the top of the page
    And I see the error message "Enter sentence date" above the "Date of sentence" date field
    And I see the error message "Enter an offence code" above the "Offence code" field
    And I see the error message "Enter an imposition code" above the result code field
    And I see the error message "Enter amount imposed" above the "Amount imposed" payment field

    When I enter "18.09.2024" into the "Date of sentence" date field
    And I enter "AB12345" into the "Offence code" field
    And I enter "25a" into the "Amount imposed" payment field
    And I enter "1234567891234567890" into the "Amount paid" payment field
    And I click the "Review offence" button
    Then I see the error message "Enter date of sentence in the format DD/MM/YYYY" at the top of the page
    And I see the error message "Offence not found" at the top of the page
    And I see the error message "Enter a valid amount" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Enter date of sentence in the format DD/MM/YYYY" above the "Date of sentence" date field
    And I see the error message "Offence not found" above the "Offence code" field
    And I see the error message "Enter a valid amount" above the "Amount imposed" payment field
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount paid" payment field

    When I enter "32/09/2024" into the "Date of sentence" date field
    And I enter "1234567891234567890" into the "Amount imposed" payment field
    And I enter "50b" into the "Amount paid" payment field
    And I click the "Review offence" button
    Then I see the error message "Enter a valid date of sentence" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Enter a valid amount" at the top of the page
    And I see the error message "Enter a valid date of sentence" above the "Date of sentence" date field
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount imposed" payment field
    And I see the error message "Enter a valid amount" above the "Amount paid" payment field

    When I enter a date 2 weeks into the future into the "Date of sentence" date field
    And I enter "200.255" into the "Amount imposed" payment field
    And I enter "100.50" into the "Amount paid" payment field
    And I click the "Review offence" button
    Then I see the error message "Sentence date must not be in the future" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Sentence date must not be in the future" above the "Date of sentence" date field
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount imposed" payment field

    When I enter "100.525" into the "Amount paid" payment field
    And I enter "200.25" into the "Amount imposed" payment field
    And I click the "Review offence" button
    Then I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount paid" payment field

  Scenario: AC1, AC3, AC5 & AC6 - Add offences, successful validation, check summary screen for A/Y with parent or guardian to pay

    When I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page

    When I enter "TP11003" into the "Offence code" field
    And I enter a date 1 weeks into the past into the "Date of sentence" date field
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
    And I click the "Add another offence" button
    Then I see "Add an offence" on the page header
    And I see "Offence TP11003 added" text on the page
    And I see "" in the "Date of sentence" date field
    And I see "" in the "Offence code" field
    And I see "" in the "Result code" field for imposition 1
    And I see "" in the "Amount imposed" field for imposition 1
    And I see "" in the "Amount paid" field for imposition 1

    And I enter "HY35014" into the "Offence code" field
    And I enter a date 2 weeks into the past into the "Date of sentence" date field
    And I click the "Add another imposition" button
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "100" into the "Amount imposed" field for imposition 1
    And I enter "25" into the "Amount paid" field for imposition 1
    And I enter "Vehicle Excise Back Duty (FVEBD)" into the "Result code" field for imposition 2
    And I enter "250" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I click the "Review offence" button
    Then I see "Offences and impositions" on the page header

    And the table with offence code "HY35014" should contain the following data:
      | Imposition               | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine                     | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Vehicle Excise Back Duty | HM Courts & Tribunals Service (HMCTS) | £250.00        | £100.00     | £150.00           |
      | Totals                   |                                       | £350.00        | £125.00     | £225.00           |

    And the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | British Transport Police (BTPO)       | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    And the summary list should contain the following data:
      | Amount imposed    | £850.00 |
      | Amount paid       | 275.00  |
      | Balance remaining | £575.00 |

  #Consider 3rd offence as well

  Scenario: AC2 - Error handling for A/Y with parent or guardian to pay

    When I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page

    When I click the "Add another offence" button
    Then I see the error message "Enter sentence date" at the top of the page
    And I see the error message "Enter an offence code" at the top of the page
    And I see the error message "Enter an imposition code" at the top of the page
    And I see the error message "Enter amount imposed" at the top of the page
    And I see the error message "Enter sentence date" above the "Date of sentence" date field
    And I see the error message "Enter an offence code" above the "Offence code" field
    And I see the error message "Enter an imposition code" above the result code field
    And I see the error message "Enter amount imposed" above the "Amount imposed" payment field

    When I enter "18.09.2024" into the "Date of sentence" date field
    And I enter "AB12345" into the "Offence code" field
    And I enter "25a" into the "Amount imposed" payment field
    And I enter "1234567891234567890" into the "Amount paid" payment field
    And I click the "Review offence" button
    Then I see the error message "Enter date of sentence in the format DD/MM/YYYY" at the top of the page
    And I see the error message "Offence not found" at the top of the page
    And I see the error message "Enter a valid amount" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Enter date of sentence in the format DD/MM/YYYY" above the "Date of sentence" date field
    And I see the error message "Offence not found" above the "Offence code" field
    And I see the error message "Enter a valid amount" above the "Amount imposed" payment field
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount paid" payment field

    When I enter "32/09/2024" into the "Date of sentence" date field
    And I enter "1234567891234567890" into the "Amount imposed" payment field
    And I enter "50b" into the "Amount paid" payment field
    And I click the "Review offence" button
    Then I see the error message "Enter a valid date of sentence" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Enter a valid amount" at the top of the page
    And I see the error message "Enter a valid date of sentence" above the "Date of sentence" date field
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount imposed" payment field
    And I see the error message "Enter a valid amount" above the "Amount paid" payment field

    When I enter a date 2 weeks into the future into the "Date of sentence" date field
    And I enter "200.255" into the "Amount imposed" payment field
    And I enter "100.50" into the "Amount paid" payment field
    And I click the "Review offence" button
    Then I see the error message "Sentence date must not be in the future" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Sentence date must not be in the future" above the "Date of sentence" date field
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount imposed" payment field

    When I enter "100.525" into the "Amount paid" payment field
    And I enter "200.25" into the "Amount imposed" payment field
    And I click the "Review offence" button
    Then I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount paid" payment field

  Scenario: AC1, AC3, AC5 & AC6 - Add offences, successful validation, check summary screen for Company

    When I select the "Company" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page

    When I enter "TP11003" into the "Offence code" field
    And I enter a date 1 weeks into the past into the "Date of sentence" date field
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
    And I click the "Add another offence" button
    Then I see "Add an offence" on the page header
    And I see "Offence TP11003 added" text on the page
    And I see "" in the "Date of sentence" date field
    And I see "" in the "Offence code" field
    And I see "" in the "Result code" field for imposition 1
    And I see "" in the "Amount imposed" field for imposition 1
    And I see "" in the "Amount paid" field for imposition 1

    And I enter "HY35014" into the "Offence code" field
    And I enter a date 2 weeks into the past into the "Date of sentence" date field
    And I click the "Add another imposition" button
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "100" into the "Amount imposed" field for imposition 1
    And I enter "25" into the "Amount paid" field for imposition 1
    And I enter "Vehicle Excise Back Duty (FVEBD)" into the "Result code" field for imposition 2
    And I enter "250" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I click the "Review offence" button
    Then I see "Offences and impositions" on the page header

    And the table with offence code "HY35014" should contain the following data:
      | Imposition               | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine                     | HM Courts & Tribunals Service (HMCTS) | £100.00        | £25.00      | £75.00            |
      | Vehicle Excise Back Duty | HM Courts & Tribunals Service (HMCTS) | £250.00        | £100.00     | £150.00           |
      | Totals                   |                                       | £350.00        | £125.00     | £225.00           |

    And the table with offence code "TP11003" should contain the following data:
      | Imposition   | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation | British Transport Police (BTPO)       | £300.00        | £100.00     | £200.00           |
      | Fine         | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals       |                                       | £500.00        | £150.00     | £350.00           |

    And the summary list should contain the following data:
      | Amount imposed    | £850.00 |
      | Amount paid       | 275.00  |
      | Balance remaining | £575.00 |

  #Consider 3rd offence as well

  Scenario: AC2 - Error handling for Company

    When I select the "Company" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page

    When I click the "Add another offence" button
    Then I see the error message "Enter sentence date" at the top of the page
    And I see the error message "Enter an offence code" at the top of the page
    And I see the error message "Enter an imposition code" at the top of the page
    And I see the error message "Enter amount imposed" at the top of the page
    And I see the error message "Enter sentence date" above the "Date of sentence" date field
    And I see the error message "Enter an offence code" above the "Offence code" field
    And I see the error message "Enter an imposition code" above the result code field
    And I see the error message "Enter amount imposed" above the "Amount imposed" payment field

    When I enter "18.09.2024" into the "Date of sentence" date field
    And I enter "AB12345" into the "Offence code" field
    And I enter "25a" into the "Amount imposed" payment field
    And I enter "1234567891234567890" into the "Amount paid" payment field
    And I click the "Review offence" button
    Then I see the error message "Enter date of sentence in the format DD/MM/YYYY" at the top of the page
    And I see the error message "Offence not found" at the top of the page
    And I see the error message "Enter a valid amount" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Enter date of sentence in the format DD/MM/YYYY" above the "Date of sentence" date field
    And I see the error message "Offence not found" above the "Offence code" field
    And I see the error message "Enter a valid amount" above the "Amount imposed" payment field
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount paid" payment field

    When I enter "32/09/2024" into the "Date of sentence" date field
    And I enter "1234567891234567890" into the "Amount imposed" payment field
    And I enter "50b" into the "Amount paid" payment field
    And I click the "Review offence" button
    Then I see the error message "Enter a valid date of sentence" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Enter a valid amount" at the top of the page
    And I see the error message "Enter a valid date of sentence" above the "Date of sentence" date field
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount imposed" payment field
    And I see the error message "Enter a valid amount" above the "Amount paid" payment field

    When I enter a date 2 weeks into the future into the "Date of sentence" date field
    And I enter "200.255" into the "Amount imposed" payment field
    And I enter "100.50" into the "Amount paid" payment field
    And I click the "Review offence" button
    Then I see the error message "Sentence date must not be in the future" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Sentence date must not be in the future" above the "Date of sentence" date field
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount imposed" payment field

    When I enter "100.525" into the "Amount paid" payment field
    And I enter "200.25" into the "Amount imposed" payment field
    And I click the "Review offence" button
    Then I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount paid" payment field
