Feature: PO-499 Account comments and notes screen, Adult or Youth with Parent or Guardian to Pay

  Background:
    Given I am on the OPAL Frontend
    When I see "Opal" in the header

    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Create account" as the caption on the page
    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    And I see "Account details" on the page header
    And I see the status of "Account comments and notes" is "Not provided"
    And I see the "Account comments and notes" section heading
    And I see the "Account comments and notes" link under the "Account comments and notes" section
    And I click on the "Account comments and notes" link
    Then I see "Account comments and notes" on the page header

  Scenario Outline: AC1, AC2, AC3, AC4 & AC5 - User navigates to comments and notes screen, presses return to account details after entering information

    When I enter 20 alphanumeric characters into the "Add comment" text field
    And I enter 100 alphanumeric characters into the "Add account notes" text field
    And I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Account comments and notes" is "Provided"

    When I click on the "Account comments and notes" link
    Then I see 20 alphanumeric characters in the "Add comment" text field
    And I see 100 alphanumeric characters in the "Add account notes" text field

    Then the character remaining should show 10 for the "Add comment" input field
    And the character remaining should show 900 for the "Add account notes" input field
    ### Changes for PO-773
    When I enter 30 alphanumeric characters into the "Add comment" text field
    And I enter 900 alphanumeric characters into the "Add account notes" text field
    Then the character remaining should show 0 for the "Add comment" input field
    And the character remaining should show 100 for the "Add account notes" input field

    When the characters remaining counter should show 20 after entering 10 characters into the "Add comment" input field
    Then the characters remaining counter should show 980 after entering 20 characters into the "Add account notes" input field

  Scenario Outline: AC1 & AC6 - User navigates to comments and notes screen, presses cancel without entering any information

    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I see the status of "Account comments and notes" is "Not provided"

  Scenario Outline: AC1, AC2, AC3 & AC7 - User navigates to comments and notes screen, presses cancel after entering information

    When I enter "Adding comment" into the "Add comment" text field
    And I enter "Adding note regarding this account" into the "Add account notes" text field
    And I click Cancel, a window pops up and I click Ok
    Then I see "Account details" on the page header
    And I see the status of "Account comments and notes" is "Not provided"

    When I click on the "Account comments and notes" link
    And I enter "Adding comment" into the "Add comment" text field
    And I enter "Adding note regarding this account" into the "Add account notes" text field
    And I click Cancel, a window pops up and I click Cancel
    Then I see "Account comments and notes" on the page header
    And I see "Adding comment" in the "Add comment" text field
    And I see "Adding note regarding this account" in the "Add account notes" text field


