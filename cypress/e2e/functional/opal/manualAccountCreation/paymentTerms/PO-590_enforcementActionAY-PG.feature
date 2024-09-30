Feature: PO-590 Implement enforcement action fields to Payment Terms (Adult or youth with parent or guardian to pay)

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    When I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    Then I see "Account details" on the page header

    When I click on the "Payment terms" link
    Then I see "Payment terms" on the page header
    And I select the "No" radio button under the "Has a collection order been made?" section
    And I select the "Pay in full" radio button
    And I enter a date 2 weeks into the future into the "Enter pay by date" date field

  Scenario: AC1, AC2 & AC3 - New fields and successful validation, happy path

    When I select the "Add enforcement action" checkbox
    Then I validate the "Defendant is in custody (PRIS)" radio button is not selected
    And I validate the "Hold enforcement on account (NOENF)" radio button is not selected

    When I select the "Defendant is in custody (PRIS)" radio button
    And I enter a date 9 weeks into the future into the "Earliest release date (EDR)" date field
    And I see "Held as enforcement comment" text under the "Prison and prison number" field
    And the characters remaining counter should show 18 after entering 10 characters into the "Prison and prison number" input field
    And I enter "Prison information 123" into the "Prison and prison number" text field
    And I click the "Return to account details" button
    Then I see the status of "Payment terms" is "Provided"

    When I click on the "Payment terms" link
    Then I see a date 2 weeks into the future in the "Enter pay by date" date field
    And I see a date 9 weeks into the future in the "Earliest release date (EDR)" date field
    And I see "Prison information 123" in the "Prison and prison number" text field

    When I select the "Hold enforcement on account (NOENF)" checkbox
    And the characters remaining counter should show 18 after entering 10 characters into the "Reason account is on NOENF" input field
    And I enter "abc123'()_., -*" into the "Reason account is on NOENF" text field
    And I click the "Add account comments and notes" button
    And I see "Account comments and notes" on the page header
    And I click on the "Cancel" link
    Then I see the status of "Payment terms" is "Provided"

    When I click on the "Payment terms" link
    Then I see a date 2 weeks into the future in the "Enter pay by date" date field
    And I see "abc123'()_., -*" in the "Reason account is on NOENF" text field

  Scenario: AC4, AC5, AC6, AC7 & AC8 - Error handling

    #AC4

    When I select the "Add enforcement action" checkbox
    And I click the "Return to account details" button
    Then I see the error message "Select reason for enforcement action" at the top of the page
    And I see the error message "Select reason for enforcement action" above the "Defendant is in custody (PRIS)" radio button

    #AC5

    When I select the "Defendant is in custody (PRIS)" radio button
    And I enter "32/09/2025" into the "Earliest release date (EDR)" date field
    And I click the "Return to account details" button
    Then I see the error message "Enter a valid calendar date" at the top of the page
    And I see the error message "Enter a valid calendar date" above the "Earliest release date (EDR)" date field

    When I enter "09.09.2025" into the "Earliest release date (EDR)" date field
    And I click the "Add account comments and notes" button
    Then I see the error message "Date must be in the format DD/MM/YYYY" at the top of the page
    And I see the error message "Date must be in the format DD/MM/YYYY" above the "Earliest release date (EDR)" date field

    #AC6

    When I enter a date 2 weeks into the past into the "Earliest release date (EDR)" date field
    And I click the "Return to account details" button
    Then I see the error message "Date must be in the future" at the top of the page
    And I see the error message "Date must be in the future" above the "Earliest release date (EDR)" date field

    #AC7

    When I select the "Hold enforcement on account (NOENF)" radio button
    And I click the "Return to account details" button
    Then I see the error message "Enter a reason" at the top of the page
    And I see the error message "Enter a reason" above the "Reason account is on NOENF" field
    And I click the "Add account comments and notes" button
    Then I see the error message "Enter a reason" at the top of the page
    And I see the error message "Enter a reason" above the "Reason account is on NOENF" field

    #AC8

    When I enter "abc123!" into the "Reason account is on NOENF" text field
    And I click the "Return to account details" button
    And I see the error message "Reason must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes" at the top of the page
    And I see the error message "Reason must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes" above the "Reason account is on NOENF" field
    And I enter "abc123?" into the "Reason account is on NOENF" text field
    And I click the "Add account comments and notes" button
    Then I see the error message "Reason must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes" at the top of the page
    And I see the error message "Reason must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes" above the "Reason account is on NOENF" field
