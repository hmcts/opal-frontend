Feature: PO-566 Basic Payment Terms screen - all defendant types

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Create account" as the caption on the page
    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button

  Scenario Outline: AC1, AC2, AC3, AC4 & AC5 - Payment terms screen adult or youth only
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    And I see "Account details" on the page header

    When I see the status of "Payment terms" is "Cannot start yet"
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header

    When I select title "Mr" from dropdown
    And I enter "Edgar Kolton" into the "First names" field
    And I enter "Mills" into the "Last name" field
    And I enter "03/10/1990" into the Date of birth field
    And I enter "AB123456C" into the "National Insurance number" field
    And I enter "18 Tester House" into the "Address line 1" field
    And I click the "Return to account details" button
    Then I see the status of "Personal details" is "Provided"

    When I see the "Offence and imposition details" section heading
    And I see the "Payment terms" link under the "Offence and imposition details" section
    And I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

    #When I see "Select payment terms" below the "Payment terms" header - or line 73 generic steps once screen exists
    And I validate the "Pay in full" radio button is not selected
    And I validate the "Instalments only" radio button is not selected
    And I validate the "Lump sum plus instalments" radio button is not selected

    #When I see "Enforcement action" below the "Payment terms" header - or line 73 generic steps once screen exists
    And I select the "Add enforcement action" checkbox
    And I unselect the "Add enforcement action" checkbox

    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I see the status of "Payment terms" is "Not provided"

  Scenario Outline: AC1, AC2, AC3, AC4 & AC5 - Payment terms screen adult or youth with parent or guardian to pay
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    And I see "Account details" on the page header

    #When I see the status of "Payment terms" is "Cannot start yet" - This will be uncommented once Offence Details is delivered
    #Placeholder for offence details steps

    When I see the "Offence and imposition details" section heading
    And I see the "Payment terms" link under the "Offence and imposition details" section
    And I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

    #When I see "Select payment terms" below the "Payment terms" header - or line 73 generic steps once screen exists
    And I validate the "Pay in full" radio button is not selected
    And I validate the "Instalments only" radio button is not selected
    And I validate the "Lump sum plus instalments" radio button is not selected

    #When I see "Enforcement action" below the "Payment terms" header - or line 73 generic steps once screen exists
    And I select the "Add enforcement action" checkbox
    And I unselect the "Add enforcement action" checkbox

    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I see the status of "Payment terms" is "Not provided"

  Scenario Outline: AC1, AC2, AC3, AC4 & AC5 - Payment terms screen company
    And I select the "Company" radio button
    And I click the "Continue" button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    And I see "Account details" on the page header

    #When I see the status of "Payment terms" is "Cannot start yet" - This will be uncommented once Offence Details is delivered
    #Placeholder for offence details steps

    When I see the "Offence and imposition details" section heading
    And I see the "Payment terms" link under the "Offence and imposition details" section
    And I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

    #When I see "Select payment terms" below the "Payment terms" header - or line 73 generic steps once screen exists
    And I validate the "Pay in full" radio button is not selected
    And I validate the "Instalments only" radio button is not selected
    And I validate the "Lump sum plus instalments" radio button is not selected

    #When I see "Enforcement action" below the "Payment terms" header - or line 73 generic steps once screen exists
    And I select the "Hold enforcement on account (NOENF)" checkbox
    And I unselect the "Hold enforcement on account (NOENF)" checkbox

    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I see the status of "Payment terms" is "Not provided"
