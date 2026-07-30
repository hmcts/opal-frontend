@JIRA-LABEL:account-enquiry
Feature: Defendant - Adult or youth - Account Enquiries - Consolidation Accessibility
  As an Opal user
  I want to view the child account of a defendant's consolidated account

  @R1B @JIRA-STORY:PO-2391 @JIRA-EPIC:PO-2332
  Scenario: Consolidated account tab accessibility
    # The consolidated-account response is mocked in the test harness because consolidation
    # behaviour is not available end-to-end in the live environment yet.
    Given I am viewing a master account with a consolidated child account
    When I view the Consolidated accounts tab
    And I can see a table containing the child accounts
    Then I check the page for accessibility
