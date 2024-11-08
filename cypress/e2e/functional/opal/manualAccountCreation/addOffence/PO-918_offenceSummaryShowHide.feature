Feature: PO-918 - Offence Summary Screen Show/Hide Offences - All defendant types

  Scenario Outline: AC1,2,3 - Offence Summary - Show/Hide
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "<defendantType>" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page

    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field

    Then I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1

    Then I click the "Review offence" button
    And I see "Offences and impositions" on the page header
    And I click the "Add another offence" button

    Then I enter "HY35014" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field

    Then I enter "Criminal Courts Charge (FCC)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1

    When I click the "Review offence" button
    Then I see "Offences and impositions" on the page header

    And the table with offence code "TP11003" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals     |                                       | £200.00        | £50.00      | £150.00           |

    And the table with offence code "HY35014" should contain the following data:
      | Imposition             | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Criminal Courts Charge | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals                 |                                       | £200.00        | £50.00      | £150.00           |

    When I click the "Hide" link for offence "TP11003"
    Then I see the "Show" link for offence "TP11003"
    And I do not see the offence details for offence "TP11003"
    And the table with offence code "HY35014" should contain the following data:
      | Imposition             | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Criminal Courts Charge | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals                 |                                       | £200.00        | £50.00      | £150.00           |

    When I click the "Show" link for offence "TP11003"
    Then I see the "Hide" link for offence "TP11003"
    And the table with offence code "TP11003" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals     |                                       | £200.00        | £50.00      | £150.00           |

    And the table with offence code "HY35014" should contain the following data:
      | Imposition             | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Criminal Courts Charge | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals                 |                                       | £200.00        | £50.00      | £150.00           |

    When I click the "Hide" link for offence "HY35014"
    Then I see the "Show" link for offence "HY35014"
    And I do not see the offence details for offence "HY35014"
    And the table with offence code "TP11003" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals     |                                       | £200.00        | £50.00      | £150.00           |

    When I click the "Show" link for offence "HY35014"
    Then I see the "Hide" link for offence "HY35014"
    And the table with offence code "HY35014" should contain the following data:
      | Imposition             | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Criminal Courts Charge | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals                 |                                       | £200.00        | £50.00      | £150.00           |

    And the table with offence code "TP11003" should contain the following data:
      | Imposition | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Fine       | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals     |                                       | £200.00        | £50.00      | £150.00           |

    Examples:
      | defendantType                                 |
      | Adult or youth                                |
      | Adult or youth with parent or guardian to pay |
      | Company                                       |
