Feature: Accessibility Tests for Check and Validate Screens
  # This feature file ensures that all screens in the Check and Validate flow meet accessibility standards using Axe-Core.

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    Given I navigate to Create and Manage Draft Accounts

  Scenario: Draft Account List, Account Details, and Check and Validate Sections - Axe Core
    Then I check accessibility

    # Create a draft account with rejected status for testing
    Given I create a "parentOrGuardianToPay" draft account with the following details:
      | account.defendant.forenames | Accessibility |
      | account.defendant.surname   | Test          |
    When I update the last created draft account with status "Rejected"
    Then I click on the "Rejected" link

    Then I see "Test, Accessibility" text on the page
    Then I check accessibility

    Then I click on the 'Approved' link
    Then I check accessibility

    Then I click on the "Deleted" link
    Then I check accessibility

    Then I click on the "Rejected" link
    Then I click on the "Test, Accessibility" link

    # Account Details screen - Axe Core
    And I see the "Check and submit" section heading
    Then I check accessibility

    # Check Account screen - Axe Core
    When I click the "Check account" button
    Then I see "Check account details" on the page header
    Then I check accessibility

    # Submit for review screen - Axe Core
    When I click the "Submit for review" button
    Then I see "You have submitted Accessibility Test's account for review" text on the page
