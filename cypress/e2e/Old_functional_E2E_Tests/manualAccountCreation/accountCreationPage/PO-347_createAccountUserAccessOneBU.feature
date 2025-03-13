Feature: PO-347 manual account creation, user has access to one BU

  Feature Description
  https://tools.hmcts.net/jira/browse/PO-347
  UI - Business Unit and Defendant type screen - View 1 - Ensure the BU shown for a user associated with 1 BU, is driven by an API call

  Scenario: AC1 - When creating an account, with a user with one BU, the correct BU is shown
    Given I am on the Opal Frontend and I sign in as "opal-test-3@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header

    And I see "The account will be created in Hertfordshire" above the "Account type" heading

  Scenario: AC2 - Correct BU is shown - Adult or youth only
    Given I am on the Opal Frontend and I sign in as "opal-test-3@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header

    When I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see the business unit is "Hertfordshire"
    And I see the defendant type is "Adult or youth only"

  Scenario: AC3 - Correct BU is shown - Adult or youth with parent or guardian to pay
    Given I am on the Opal Frontend and I sign in as "opal-test-3@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header

    When I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    Then I see the business unit is "Hertfordshire"
    And I see the defendant type is "Adult or youth with parent or guardian to pay"

  Scenario: AC4 - Correct BU is shown - Company
    Given I am on the Opal Frontend and I sign in as "opal-test-3@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header

    When I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button

    Then I see the business unit is "Hertfordshire"
    And I see the defendant type is "Company"
