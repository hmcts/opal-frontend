Feature: PO-524 Account Details task list screen for all defendant types

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box

  Scenario: AC1, AC2- The new Account type section will be displayed for all the defendant types
    When I select the "<accountType>" radio button
    And I select the "<defendantType>" radio button
    And I see "Defendant type" below the "Account type" header
    Then I click on continue button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    And I see "Business unit" is "West London"
    And I see "Account type" is "<accountType>"
    And I see "Defendant type" is "<defendantType>"

    Examples:
      | accountType   | defendantType                                 |
      | Fine          | Adult or youth only                           |
      | Fine          | Adult or youth with parent or guardian to pay |
      | Fine          | Company                                       |
      | Fixed Penalty | Adult or youth only                           |
      | Fixed Penalty | Company                                       |

  Scenario: AC1, AC2 -The new Account type section will be displayed for all Conditional Caution
    When I select the "Conditional Caution" radio button
    #And I see "Adult or youth only" below the "Conditional Caution" radio button
    And I see help text "Adult or youth only" for the "Conditional Caution" radio button
    Then I click on continue button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header
    And I see "Business unit" is "West London"
    And I see "Account type" is "Conditional Caution"
    And I see "Defendant type" is "Adult or youth only"

