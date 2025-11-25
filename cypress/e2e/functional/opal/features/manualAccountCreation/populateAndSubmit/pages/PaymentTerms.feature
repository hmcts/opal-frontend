@ManualAccountCreation @PaymentTerms @PO-272 @PO-344 @PO-345 @PO-545 @PO-429 @PO-587 @PO-592
Feature: Manual account creation - Payment Terms
  #This feature file contains tests for the Payment Terms page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the PaymentTermsComponent.cy.ts component tests
  #Tests for conditional rendering (different defendant types) are contained in the PaymentTermsComponent.cy.ts component tests

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the status of "Payment terms" is "Cannot start yet"

    Then I click on the "Personal details" link
    And I see "Personal details" on the page header

    Then I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr1" into the "Address line 1" field

    And I click the "Return to account details" button

    Then I see the status of "Personal details" is "Provided"
    And I see the status of "Payment terms" is "Not provided"

    When I click on the "Payment terms" link
    And I see "Payment terms" on the page header

  Scenario: (AC.15, AC.16) Entered data persists in the session [@PO-272, @PO-344, @PO-345, @PO-545, @PO-429, @PO-587, @PO-592]
    #Enter data into the Payment Terms page
    When I select the "No" radio button under the "Has a collection order been made?" section
    And I select the "Make collection order today" checkbox
    And I select the "Lump sum plus instalments" radio button
    And I enter "150" into the "Lump sum" payment field
    And I enter "300" into the "Instalment" payment field
    And I select the "Monthly" radio button
    And I enter a date 2 weeks into the future into the "Start date" date field
    And I select the "Request payment card" checkbox

    And I select the "There are days in default" checkbox
    And I enter a date 1 weeks into the past into the "Date days in default were imposed" date field
    And I enter "100" into the days in default input field



    Then I select the "Add enforcement action" radio button
    And I select the "Hold enforcement on account (NOENF)" radio button
    And I enter "Reason" into the "Reason account is on NOENF" text field

    And I click the "Return to account details" button
    Then I see "Account details" on the page header
    Then I see the status of "Payment terms" is "Provided"

    #Check data is retained on the Payment Terms page
    When I click on the "Payment terms" link

    Then I see the "No" radio button under the "Has a collection order been made?" section is selected
    And I validate the "Make collection order today" checkbox is checked

    And I validate the "Lump sum plus instalments" radio button is selected
    And I see "150" in the "Lump sum" payment field
    And I see "300" in the "Instalment" payment field
    And I validate the "Monthly" radio button is selected
    And I see a date 2 weeks into the future in the "Start date" date field
    And I validate the "Request payment card" checkbox is checked

    And I validate the "There are days in default" checkbox is checked
    And I see a date 1 weeks into the past in the "Date days in default were imposed" date field
    And I see "100" in the days in default input field

    And I validate the "Add enforcement action" checkbox is checked
    And I validate the "Hold enforcement on account (NOENF)" radio button is selected
    And I see "Reason" in the "Reason account is on NOENF" text field

    When I reload the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the status of "Payment terms" is "Cannot start yet"

    When I click on the "Personal details" link
    And I see "Personal details" on the page header
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr1" into the "Address line 1" field
    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"

    Then I see the status of "Payment terms" is "Not provided"
    And I click on the "Payment terms" link

    Then I see the "No" radio button under the "Has a collection order been made?" section is not selected

    And I validate the "Lump sum plus instalments" radio button is not selected
    And I validate the "There are days in default" checkbox is not checked
    And I validate the "Add enforcement action" checkbox is not checked

  Scenario: (AC.17, AC.18) Unsaved data is cleared when cancel is clicked [PO-272, PO-344, PO-345, PO-429, PO-587, PO-592]
    Then I select the "No" radio button under the "Has a collection order been made?" section
    And I select the "Pay in full" radio button
    And I enter a date 1 weeks into the future into the "Enter pay by date" date field

    Then I click Cancel, a window pops up and I click Cancel

    Then I see "Payment terms" on the page header
    And I see the "No" radio button under the "Has a collection order been made?" section is selected
    And I validate the "Pay in full" radio button is selected
    And I see a date 1 weeks into the future in the "Enter pay by date" date field

    When I click Cancel, a window pops up and I click Ok

    Then I see "Account details" on the page header
    And I see the status of "Payment terms" is "Not provided"

    When I click on the "Payment terms" link
    Then I see the "No" radio button under the "Has a collection order been made?" section is not selected
    And I validate the "Pay in full" radio button is not selected

  Scenario: (AC.16) Grey navigation links routes correctly [PO-272, PO-344, PO-345, PO-429, PO-587, PO-592]
    Then I select the "No" radio button under the "Has a collection order been made?" section
    And I select the "Pay in full" radio button
    And I enter a date 1 weeks into the future into the "Enter pay by date" date field

    Then I click the "Add account comments and notes" button

    Then I see "Account comments and notes" on the page header

  Scenario: Payment terms - Axe Core
    Then I check accessibility






