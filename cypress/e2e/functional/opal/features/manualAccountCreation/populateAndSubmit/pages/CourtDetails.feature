@ManualAccountCreation @CourtDetails @PO-272 @PO-344 @PO-345 @PO-389 @PO-527 @PO-529
Feature: Manual account creation - Court Details
  #This feature file contains tests for the Court Details page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the CourtDetailsComponent.cy.ts component tests
  #Tests for conditional rendering (different defendant types) are contained in the CourtDetailsComponent.cy.ts component tests

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I click on the "Court details" link
    And I see "Court details" on the page header

  Scenario: (AC.8, AC.9) Entered data persists in the session [@PO-272, @PO-344, @PO-345, @PO-389, @PO-527, @PO-529]
    When I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box
    And I enter "1234" into the "Prosecutor Case Reference (PCR)" field
    And I enter "West London VPFPO (101)" into the "Enforcement court" search box

    Then I click the "Return to account details" button

    Then I see the status of "Court details" is "Provided"

    When I click on the "Court details" link
    And I see "Avon & Somerset Magistrates' Court (1450)" in the "Sending area or Local Justice Area (LJA)" searchbox
    And I see "1234" in the "Prosecutor Case Reference (PCR)" field
    And I see "West London VPFPO (101)" in the "Enforcement court" searchbox

    When I reload the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the status of "Court details" is "Not provided"

    When I click on the "Court details" link

    And I see "" in the "Sending area or Local Justice Area (LJA)" searchbox
    And I see "" in the "Prosecutor Case Reference (PCR)" field
    And I see "" in the "Enforcement court" searchbox

  Scenario: (AC.10, AC.11) Unsaved data is cleared when cancel is clicked [@PO-272, @PO-344, @PO-345, @PO-389, @PO-527, @PO-529]
    When I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box
    And I enter "1234" into the "Prosecutor Case Reference (PCR)" field
    And I enter "West London VPFPO" into the "Enforcement court" search box

    Then I click Cancel, a window pops up and I click Ok

    Then I see the status of "Court details" is "Not provided"

    When I click on the "Court details" link

    And I see "" in the "Sending area or Local Justice Area (LJA)" searchbox
    And I see "" in the "Prosecutor Case Reference (PCR)" field
    And I see "" in the "Enforcement court" searchbox

    Then I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box
    And I enter "1234" into the "Prosecutor Case Reference (PCR)" field
    And I enter "West London VPFPO" into the "Enforcement court" search box

    Then I click the "Return to account details" button

    Then I see the status of "Court details" is "Provided"

    When I click on the "Court details" link
    And I enter "4321" into the "Prosecutor Case Reference (PCR)" field
    And I click Cancel, a window pops up and I click Ok

    When I click on the "Court details" link
    And I see "1234" in the "Prosecutor Case Reference (PCR)" field

    Then I enter "4321" into the "Prosecutor Case Reference (PCR)" field
    And I click Cancel, a window pops up and I click Cancel

    Then I see "4321" in the "Prosecutor Case Reference (PCR)" field

    When I enter "1234" into the "Prosecutor Case Reference (PCR)" field
    And I click Cancel, a window pops up and I click Ok

    Then I see the status of "Court details" is "Provided"

    When I click on the "Court details" link
    When I enter "1234" into the "Prosecutor Case Reference (PCR)" field

  Scenario: Court Details - Axe Core
    Then I check accessibility

  Scenario: (AC.6) Grey navigation links routes correctly [@PO-272, @PO-389]
    When I enter "Avon" into the "Sending area or Local Justice Area (LJA)" search box
    And I enter "1234" into the "Prosecutor Case Reference (PCR)" field
    And I enter "West London VPFPO" into the "Enforcement court" search box

    When I click the "Add personal details" button

    Then I see "Personal details" on the page header

