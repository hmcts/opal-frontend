Feature: PO-919 - Major and Minor Creditor details showing on offence summary screen
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

  Scenario: AC1

    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field

    Then I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1
    And I click the "Add another imposition" button

    Then I enter "Costs to Crown Prosecution Service (FCPC)" into the "Result code" field for imposition 2
    And I enter "100" into the "Amount imposed" field for imposition 2
    And I enter "50" into the "Amount paid" field for imposition 2
    And I click the "Add another imposition" button

    Then I enter "Compensation (FCOMP)" into the "Result code" field for imposition 3
    And I enter "300" into the "Amount imposed" field for imposition 3
    And I enter "100" into the "Amount paid" field for imposition 3
    And I see "Add creditor" text on the page
    And I select the "Major creditor" radio button for imposition 3
    And I enter "BTPO" into the "Search using name or code" search box
    And I see "British Transport Police (BTPO)" in the "Search using name or code" field for imposition 3
    And I click the "Add another imposition" button

    Then I enter "Costs (FCOST)" into the "Result code" field for imposition 4
    And I enter "200" into the "Amount imposed" field for imposition 4
    And I enter "50" into the "Amount paid" field for imposition 4
    And I see "Add creditor" text on the page
    And I select the "Minor creditor" radio button for imposition 4
    When I click on the "Add minor creditor details" link for imposition 4
    Then I see "Minor creditor details" on the page header

    Then I validate the "Individual" radio button is not selected

    When I select the "Individual" radio button
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field
    And I click the "Save" button

    Then I see "Add an offence" on the page header
    Then I click the "Add another imposition" button

    Then I enter "Costs (FCOST)" into the "Result code" field for imposition 5
    And I enter "200" into the "Amount imposed" field for imposition 5
    And I enter "50" into the "Amount paid" field for imposition 5
    And I see "Add creditor" text on the page
    And I select the "Minor creditor" radio button for imposition 5

    Then I click on the "Add minor creditor details" link for imposition 5
    Then I see "Minor creditor details" on the page header
    Then I validate the "Company" radio button is not selected
    Then I select the "Company" radio button
    And I enter "CNAME" into the "Company name" field
    And I click the "Save" button

    Then I see "Add an offence" on the page header

    When I click the "Review offence" button
    Then I see "Offences and impositions" on the page header

    Then I see "Offences and impositions" on the page header
    And I see "Offence TP11003 added" text on the page

    And the table with offence code "TP11003" should contain the following data:
      | Imposition                         | Creditor                              | Amount imposed | Amount paid | Balance remaining |
      | Compensation                       | British Transport Police (BTPO)       | £300.00        | £100.00     | £200.00           |
      | Costs                              | Mr FNAME LNAME                        | £200.00        | £50.00      | £150.00           |
      | Costs                              | CNAME                                 | £200.00        | £50.00      | £150.00           |
      | Costs to Crown Prosecution Service | Crown Prosecution Service (CPS)       | £100.00        | £50.00      | £50.00            |
      | Fine                               | HM Courts & Tribunals Service (HMCTS) | £200.00        | £50.00      | £150.00           |
      | Totals                             |                                       | £1000.00       | £300.00     | £700.00           |
