@JIRA-LABEL:account-enquiry
Feature: Adult Youth View Defendant Account Summary Journeys
  High-value end-to-end journeys for View Defendant Account Summary.
  This scenario covers the core business flow for opening an adult or youth defendant account
  and verifying the default At a glance summary content.

  Background:
    Given I clear all approved accounts

  @R1BDrop1UatTechJCDE @R1BDrop1UatTechPreprod @JIRA-STORY:PO-1593 @JIRA-STORY:PO-866 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5569
  Scenario: Search for an adult or youth defendant account and view the default account summary
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And a published adult or youth defendant account exists:
      | first name                | Jordan               |
      | last name                 | SummaryAdult{uniq}   |
      | prosecutor case reference | PCRR1BSUM{uniqUpper} |
      | date of birth             | 2001-05-15           |
    When I search for the account by last name "SummaryAdult{uniq}" and open the latest result
    Then I should see the account summary header contains "JORDAN SUMMARYADULT{uniqUpper}"
    And the At a glance tab should be selected by default
    And I should see the read only sections on the At a glance tab:
      | Defendant          |
      | Payment terms      |
      | Enforcement status |
      | Comment            |
    And I should see the account header summary values:
      | Account type | Fine                 |
      | Case number  | PCRR1BSUM{uniqUpper} |

  @R1BDrop1 @JIRA-STORY:PO-7410 @JIRA-EPIC:PO-8248
  Scenario: Account header displays the business unit code
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And a published adult or youth defendant account exists:
      | first name                | Taylor               |
      | last name                 | BusinessUnit{uniq}   |
      | prosecutor case reference | PCRBUCODE{uniqUpper} |
      | date of birth             | 2001-05-15           |
    And I stub the defendant header summary business unit code to "BU-CODE-E2E"
    When I search for the account by last name "BusinessUnit{uniq}" and open the latest result
    Then I should see the account header summary values:
      | Business unit | BU-CODE-E2E |

  @R1BDrop1 @JIRA-STORY:PO-11437 @JIRA-EPIC:PO-812
  Scenario: Collection Order status is displayed on the At a glance page
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    When I start a fine manual account for business unit "Camberwell Green" with defendant type "Adult or youth only" and originator type "New"
    And I complete standard manual fine account fields with a unique defendant name
    And I check the manual account details
    Then I see the manual review "Payment terms" summary:
      | Has a collection order been made? | No  |
      | Make collection order today       | Yes |
    And I submit the manual account for review
    And I am logged in with email "opal-test-10@dev.platform.hmcts.net"
    And I open Check and Validate Draft Accounts
    And I open the draft account for "LNAME{uniq}, FNAME{uniq}" and see header "Mr FNAME{uniq} LNAME{uniq}"
    And I record the following decision on the draft account:
      | Decision | Approve |
    Then the draft success banner is "You have approved FNAME{uniq} LNAME{uniqUpper}'s account"
    When I sign out from the Fines primary navigation
    Then I am returned to the OPAL sign-in page
    And I am logged in with email "opal-test@dev.platform.hmcts.net"
    When I search for the account by last name "LNAME{uniq}" and open the latest result
    Then the At a glance tab should be selected by default
    And I should see the following enforcement status values on the At a glance tab:
      | Collection order | Collection Order |
