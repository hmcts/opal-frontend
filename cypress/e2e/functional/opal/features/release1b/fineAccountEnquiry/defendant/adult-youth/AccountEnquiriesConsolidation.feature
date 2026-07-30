@JIRA-LABEL:account-enquiry
Feature: Defendant - Adult or youth - Account Enquiries - Consolidation
  As an Opal user
  I want to view the child account of a defendant's consolidated account

  @R1B @JIRA-STORY:PO-2391 @JIRA-EPIC:PO-2332
  Scenario: Consolidated account links open the child account At a glance view
    # The consolidated-account response is mocked in the test harness because consolidation
    # behaviour is not available end-to-end in the live environment yet.
    Given I am viewing a master account with a consolidated child account
    When I view the Consolidated accounts tab
    Then I can see a table containing the child accounts
    When I view the first child account record
    Then I am presented with the details of the selected child account