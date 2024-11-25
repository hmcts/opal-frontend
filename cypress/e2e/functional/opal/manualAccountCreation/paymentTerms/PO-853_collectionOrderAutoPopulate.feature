Feature: PO-853 - Collection order is auto populated with the earliest date of sentence added
  Scenario: AC1,2 - Collection order is auto populated with the earliest date of sentence added
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    Then I see "Account details" on the page header

    When I click on the "Offence details" link
    Then I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1
    And I click the "Add another offence" button

    Then I enter "TH68001B" into the "Offence code" field
    And I enter a date 15 weeks into the past into the "Date of sentence" date field
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1

    Then I click the "Review offence" button
    And I click the "Return to account details" button

    Then I see the status of "Offence details" is "Provided"
    And I click on the "Payment terms" link

    Then I see "Payment terms" on the page header
    And I select the "Yes" radio button under the "Has a collection order been made?" section
    Then I see a date 15 weeks into the past in the "Date of collection order" date field

    When I enter a date 12 weeks into the past into the "Date of collection order" date field
    And I select the "Pay in full" radio button
    And I enter a date 52 weeks into the future into the "Enter pay by date" date field
    And I click the "Return to account details" button
    And I click on the "Offence details" link
    And I click the "Add another offence" button
    And I enter "HY35014" into the "Offence code" field
    And I enter a date 20 weeks into the past into the "Date of sentence" date field
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1
    And I click the "Review offence" button
    And I click the "Return to account details" button

    When I click on the "Payment terms" link
    Then I see a date 12 weeks into the past in the "Date of collection order" date field
