@JIRA-LABEL:account-enquiry
Feature: Defendant - Adult or youth - Account Enquiries - Consolidation Accessibility
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

  @R1B @JIRA-STORY:PO-2391 @JIRA-EPIC:PO-2332 @JIRA-TEST-KEY:PO-10037
  Scenario: Consolidated account tab accessibility
    # The consolidated-account response is mocked in the test harness because consolidation
    # behaviour is not available end-to-end in the live environment yet.
    Given I am viewing a master account with a consolidated child account
    When I view the Consolidated accounts tab
    And I can see a table containing the child accounts
    Then I check the page for accessibility
