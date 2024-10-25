Feature: PO-817 Introduce Major Creditor functionality onto the 'Add an Offence' screen - Adult or youth with parent or guardian to pay

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
    And I see "Offence details" text on the page

  Scenario: AC1 & AC3 - Add major creditor and validation successful

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
    And I enter "Transport for London" into the "Search using name or code" search box
    And I see "Transport for London (TFL2)" in the "Search using name or code" field for imposition 2
    And I enter "BTPO" into the "Search using name or code" search box
    Then I see "British Transport Police (BTPO)" in the "Search using name or code" field for imposition 2

    When I click the "Review offence" button
    And I see "Offences and impositions" on the page header
    And I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Offence details" is "Provided"

    When I click on the "Offence details" link
    And I see "Offences and impositions" on the page header
    And I click on the "Change" link
    Then I see "Add an offence" on the page header
    And I see a date 9 weeks into the past in the "Date of sentence" date field
    And I see "TP11003" in the "Offence code" field
    And I see "Fine (FO)" in the "Result code" field for imposition 1
    And I see "200" in the "Amount imposed" field for imposition 1
    And I see "50" in the "Amount paid" field for imposition 1
    And I see "Compensation (FCOMP)" in the "Result code" field for imposition 2
    And I see "300" in the "Amount imposed" field for imposition 2
    And I see "100" in the "Amount paid" field for imposition 2

  Scenario: AC2 - Error handling

    When I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field
    And I enter "Compensation (FCOMP)" into the "Result code" field for imposition 1
    And I enter "300" into the "Amount imposed" field for imposition 1
    And I enter "100" into the "Amount paid" field for imposition 1
    And I click the "Review offence" button
    Then I see the error message "Select whether major or minor creditor" at the top of the page
    And I see the error message "Select whether major or minor creditor" above the "Major creditor" radio button

    When I select the "Major creditor" radio button
    And I click the "Review offence" button
    Then I see the error message "Enter a major creditor name or code" at the top of the page
    And I see the error message "Enter a major creditor name or code" above the "Search using name or code" field
