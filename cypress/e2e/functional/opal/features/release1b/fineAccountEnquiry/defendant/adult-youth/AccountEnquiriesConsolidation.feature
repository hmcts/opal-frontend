@JIRA-LABEL:account-enquiry
Feature: Defendant - Adult or youth - Account Enquiries - Consolidation
  As an Opal user
  I want to view the child account of a defendant's consolidated account

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                    | Submitted                                  |
      | account.defendant.title           | Ms                                         |
      | account.defendant.forenames       | Harriet                                    |
      | account.defendant.surname         | ConsolidatedAccount{uniq}                  |
      | account.defendant.email_address_1 | Harriet.ConsolidatedAccount{uniq}@test.com |
      | account.defendant.dob             | 2002-05-15                                 |
    When I search for the account by last name "ConsolidatedAccount{uniq}" and open the latest result


  @R1B @JIRA-STORY:PO-2391 @JIRA-EPIC:PO-2332
  Scenario: Consolidated account links open the child account At a glance view
    # The consolidated-account response is mocked in the test harness because consolidation
    # behaviour is not available end-to-end in the live environment yet.
    Given I am viewing a master account with a consolidated child account
    When I view the Consolidated accounts tab
    Then I can see a table containing the child accounts
    When I view the first child account record
    Then I am presented with the details of the selected child account