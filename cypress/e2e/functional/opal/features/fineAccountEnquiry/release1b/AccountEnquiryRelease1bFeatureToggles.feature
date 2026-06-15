@JIRA-LABEL:account-enquiry
Feature: Account Enquiry Release 1B Feature Toggles

  @R1BOff @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685
  Scenario: Accounts is the default landing page when release 1b is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    Then I am taken to the "Accounts" Fines landing page
    And I should not see the Fines primary navigation item "Search"

  @R1BOff @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685
  Scenario: Direct navigation to Account Search is blocked when release 1b is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    When I navigate directly to the Account Search page
    Then I should see an Access Denied page
    And I should see a "Back to dashboard" action

  @R1BOff @JIRA-STORY:PO-3720 @JIRA-EPIC:PO-3685
  Scenario: Direct navigation to Account Enquiry is blocked when release 1b is disabled
    Given I am authenticated with email "opal-test@dev.platform.hmcts.net"
    And a published adult or youth defendant account exists:
      | first name                | Riley                   |
      | last name                 | Release1BDirect{uniq}   |
      | prosecutor case reference | PCRR1BDIRECT{uniqUpper} |
      | date of birth             | 2001-04-15              |
    When I navigate directly to the last created published account details
    Then I should see an Access Denied page
    And I should see a "Back to dashboard" action

  @R1B @R1CWriteOffOff @JIRA-STORY:PO-3720 @JIRA-STORY:PO-3757 @JIRA-EPIC:PO-3685
  Scenario: Impositions write off actions are hidden when release 1c write off is disabled
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And a published adult or youth defendant account exists:
      | first name                | Morgan                     |
      | last name                 | Release1BImpositions{uniq} |
      | prosecutor case reference | PCRR1BIMP{uniqUpper}       |
      | date of birth             | 1998-08-24                 |
    And I am on the Account Search page - Individuals form displayed by default
    When I search for the last created account by account number
    And I open the latest matching result from the search results
    And I go to the Impositions tab
    Then I should return to the Impositions tab
    And I should not see the button with text "Adjust"
    And I should not see the button with text "Reverse"
    And I should not see the button with text "Write off"
    And I should not see the button with text "Reverse write off"
