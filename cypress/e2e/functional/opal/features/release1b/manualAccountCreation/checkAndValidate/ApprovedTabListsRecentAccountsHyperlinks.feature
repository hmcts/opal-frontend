@JIRA-LABEL:manual-account-creation
Feature: Approved tab lists recent accounts - Hyperlinks

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I open Create and Manage Draft Accounts

  @JIRA-EPIC:PO-2220 @R1BDrop1 @JIRA-STORY:PO-607 @JIRA-STORY:PO-3720 @JIRA-TEST-KEY:PO-3883
  Scenario: Approved tab lists recent accounts - Hyperlinks
    Given I create a "company" approved account with the following details:
      | account_snapshot.defendant_name | TEST New Company Ltd {uniq} |
    And I create a "adultOrYouthOnly" approved account with the following details:
      | account_snapshot.defendant_name | Smith{uniq}, James |

    When I view the "Approved" tab on the Create and Manage Draft Accounts page
    Then I should see the header containing text "Create accounts"
    Then the manual draft table row 1 has values:
      | Account       | FP123456                    |
      | Defendant     | TEST New Company Ltd {uniq} |
      | Date of birth | -                           |
      | Approved      | days ago                    |
      | Account type  | Fixed Penalty               |
      | Business unit | Business Unit B             |
    And the manual draft table row 2 has values:
      | Account       | FINE123456         |
      | Defendant     | Smith{uniq}, James |
      | Date of birth | 15 May 1990        |
      | Approved      | days ago           |
      | Account type  | Fine               |
      | Business unit | Business Unit A    |
    And the approved draft account number "FP123456" is shown as a hyperlink
    And the approved draft account number "FINE123456" is shown as a hyperlink
