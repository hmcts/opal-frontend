Feature: PO-672 Create the Imposition Removal screen - Adult or youth with parent or guardian to pay

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header

  Scenario: AC1, AC2 & AC4 - Successfully remove imposition

    When I click the "Add another imposition" button
    And I click the "Add another imposition" button
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1
    And I enter "Criminal Courts Charge (FCC)" into the "Result code" field for imposition 2
    And I enter "300" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I enter "Victim Surcharge (FVS)" into the "Result code" field for imposition 3
    And I enter "500" into the "Amount imposed" field for imposition 3
    And I enter "200" into the "Amount paid" field for imposition 3
    Then I see "Remove imposition" link for imposition 1
    And I see "Remove imposition" link for imposition 2
    And I see "Remove imposition" link for imposition 3

    When I click on the "Remove imposition" link for imposition 2
    Then I see "Are you sure you want to remove this imposition?" on the page header

    ###Creditor added, Test for PO-683
    And row number 1 should have the following data:
      | Imposition                   | Creditor                                | Amount imposed | Amount paid | Balance remaining |
      | Criminal Courts Charge (FCC) | HM Courts and Tribunals Service (HMCTS) | £300.00        | £100.00     | £200.00           |

    When I click the "Yes - remove imposition" button
    Then I see "Add an offence" on the page header
    And I see "Fine (FO)" in the "Result code" field for imposition 1
    And I see "200" in the "Amount imposed" field for imposition 1
    And I see "50" in the "Amount paid" field for imposition 1
    And I see "Victim Surcharge (FVS)" in the "Result code" field for imposition 2
    And I see "500" in the "Amount imposed" field for imposition 2
    And I see "200" in the "Amount paid" field for imposition 2
    And I see "Remove imposition" link for imposition 1
    And I see "Remove imposition" link for imposition 2
    And I do not see "Criminal Courts Charge (FCC)" text on the page

  Scenario: AC1, AC2 & AC3 - Cancel remove imposition

    When I click the "Add another imposition" button
    And I click the "Add another imposition" button
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1
    And I enter "Criminal Courts Charge (FCC)" into the "Result code" field for imposition 2
    And I enter "300" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I enter "Costs to Crown Prosecution Service (FCPC)" into the "Result code" field for imposition 3
    And I enter "500" into the "Amount imposed" field for imposition 3
    And I enter "200" into the "Amount paid" field for imposition 3
    Then I see "Remove imposition" link for imposition 1
    And I see "Remove imposition" link for imposition 2
    And I see "Remove imposition" link for imposition 3

    When I click on the "Remove imposition" link for imposition 3
    Then I see "Are you sure you want to remove this imposition?" on the page header
    ###Creditor added, Test for PO-683
    And row number 1 should have the following data:
      | Imposition                                | Creditor                        | Amount imposed | Amount paid | Balance remaining |
      | Costs to Crown Prosecution Service (FCPC) | Crown Prosecution Service (CPS) | £500.00        | £200.00     | £300.00           |

    When I click on the "No - cancel" link
    Then I see "Add an offence" on the page header
    And I see "Fine (FO)" in the "Result code" field for imposition 1
    And I see "200" in the "Amount imposed" field for imposition 1
    And I see "50" in the "Amount paid" field for imposition 1
    And I see "Criminal Courts Charge (FCC)" in the "Result code" field for imposition 2
    And I see "300" in the "Amount imposed" field for imposition 2
    And I see "100" in the "Amount paid" field for imposition 2
    And I see "Costs to Crown Prosecution Service (FCPC)" in the "Result code" field for imposition 3
    And I see "500" in the "Amount imposed" field for imposition 3
    And I see "200" in the "Amount paid" field for imposition 3
    And I see "Remove imposition" link for imposition 1
    And I see "Remove imposition" link for imposition 2
    And I see "Remove imposition" link for imposition 3

  Scenario: AC2bii, AC4ai & AC4aiii - Remove imposition with minor/major creditor

    When I click the "Add another imposition" button
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1
    And I enter "Compensation (FCOMP)" into the "Result code" field for imposition 2
    And I enter "300" into the "Amount imposed" field for imposition 2
    And I enter "100" into the "Amount paid" field for imposition 2
    And I see "Add creditor" text on the page
    And I select the "Major creditor" radio button

    And I enter "Tesco Stores (TESC)" into the "Search using name or code" search box

    When I click on the "Remove imposition" link for imposition 2
    Then I see "Are you sure you want to remove this imposition?" on the page header
    ###Creditor added, Test for PO-683
    And row number 1 should have the following data:
      | Imposition           | Creditor            | Amount imposed | Amount paid | Balance remaining |
      | Compensation (FCOMP) | Tesco Stores (TESC) | £300.00        | £100.00     | £200.00           |

    When I click the "Yes - remove imposition" button
    Then I see "Add an offence" on the page header
    And I see "Fine (FO)" in the "Result code" field for imposition 1
    And I see "200" in the "Amount imposed" field for imposition 1
    And I see "50" in the "Amount paid" field for imposition 1
    And I do not see "Compensation (FCOMP)" text on the page
    And I do not see "Add creditor" text on the page
    And the link with text "Remove imposition" should not be present

    When I click the "Add another imposition" button
    And I enter "Costs (FCOST)" into the "Result code" field for imposition 2
    And I enter "500" into the "Amount imposed" field for imposition 2
    And I enter "200" into the "Amount paid" field for imposition 2
    And I see "Add creditor" text on the page
    And I select the "Minor creditor" radio button

    And I select the "Minor creditor" radio button

    When I click on the "Add minor creditor details" link for imposition 2
    Then I see "Minor creditor details" on the page header

    When I select the "Company" radio button
    And I enter "CNAME" into the "Company name" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Remove imposition" link for imposition 2
    Then I see "Are you sure you want to remove this imposition?" on the page header
    ###Creditor added, Test for PO-683
    And row number 1 should have the following data:
      | Imposition    | Creditor | Amount imposed | Amount paid | Balance remaining |
      | Costs (FCOST) | CNAME    | £500.00        | £200.00     | £300.00           |

    When I click the "Yes - remove imposition" button
    Then I see "Add an offence" on the page header

    When I click the "Add another imposition" button
    And I enter "Costs (FCOST)" into the "Result code" field for imposition 2
    And I enter "500" into the "Amount imposed" field for imposition 2
    And I enter "200" into the "Amount paid" field for imposition 2
    And I see "Add creditor" text on the page
    And I select the "Minor creditor" radio button

    When I click on the "Add minor creditor details" link for imposition 2
    Then I see "Minor creditor details" on the page header

    Then I validate the "Individual" radio button is not selected

    When I select the "Individual" radio button
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Remove imposition" link for imposition 2
    Then I see "Are you sure you want to remove this imposition?" on the page header
    ###Creditor added, Test for PO-683
    And row number 1 should have the following data:
      | Imposition    | Creditor    | Amount imposed | Amount paid | Balance remaining |
      | Costs (FCOST) | FNAME LNAME | £500.00        | £200.00     | £300.00           |

    When I click the "Yes - remove imposition" button
    Then I see "Add an offence" on the page header
    And I see "Fine (FO)" in the "Result code" field for imposition 1
    And I see "200" in the "Amount imposed" field for imposition 1
    And I see "50" in the "Amount paid" field for imposition 1
    And I do not see "Costs (FCOST)" text on the page
    And I do not see "Add creditor" text on the page
    And the link with text "Remove imposition" should not be present
