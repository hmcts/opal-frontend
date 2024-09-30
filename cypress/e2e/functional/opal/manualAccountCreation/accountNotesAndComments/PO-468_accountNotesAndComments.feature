Feature: PO-468 Account comments and notes section onto the Account Details screen

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box


  Scenario Outline: AC1,AC2,AC3 -positive: verifying the Account comments and notes link for 3 defendant types
    When I select the "<accountType>" radio button
    And I select the "<defendantType>" radio button
    Then I click on continue button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    Then I see the "Account comments and notes" section heading
    And I see the "Account comments and notes" link under the "Account comments and notes" section
    And I see the status of "Account comments and notes" is "Not provided"

    Then I click on the "Account comments and notes" link
    Then I see "Account comments and notes" on the page header
    And I click the "Return to account details" button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    Examples:
      | defendantType                                 | accountType |
      | Adult or youth only                           | Fine        |
      | Adult or youth with parent or guardian to pay | Fine        |
      | Company                                       | Fine        |





