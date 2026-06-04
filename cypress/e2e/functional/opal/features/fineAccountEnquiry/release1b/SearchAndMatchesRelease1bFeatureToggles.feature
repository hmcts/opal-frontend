@JIRA-LABEL:account-enquiry
Feature: Search and Matches Release 1B Feature Toggles

  @FeatureFlag @R1B @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685
  Scenario: Search and Matches is available when release 1b is enabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    And a published adult or youth defendant account exists:
      | first name                | Jordan                  |
      | last name                 | Release1BSearch{uniq}   |
      | prosecutor case reference | PCRR1BSEARCH{uniqUpper} |
      | date of birth             | 2001-05-15              |
    Then I see the Fines primary navigation with Search selected by default
    When I search for the last created account by account number
    Then I see the Search results page
    And I see the Individuals search results for the last created account
    When I open the latest matching result from the search results
    Then I should see the account summary header contains "RELEASE1BSEARCH{uniqUpper}"

  @FeatureFlag @R1BOff @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685 @only
  Scenario: Search and Matches is hidden when release 1b is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    Then I should not see the Fines primary navigation item "Search"
    When I navigate directly to the Account Search page
    Then I should see an Access Denied page
    And I should see a "Back to dashboard" action
