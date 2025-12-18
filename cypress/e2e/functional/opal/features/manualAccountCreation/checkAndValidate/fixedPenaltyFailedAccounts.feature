Feature: Fixed Penalty Failed Account Validation (PO-1816)
  As a checker user
  I want to view and validate failed Fixed Penalty draft accounts
  So that I can ensure the Check and Validate journey works for Fixed Penalty accounts

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I clear all approved accounts

  @only
  @PO-1816
  Scenario: AC1 - Failed individual fixed penalty draft appears in Failed tab with expected details
    Given I create a "failedAdultOrYouthOnly" draft account with the following details and set status "Publishing Pending":
      | Account_status              | failed |
      | account.defendant.forenames | Oliver |
      | account.defendant.surname   | GREEN  |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"
    When I view the "Failed" tab on the Check and Validate page
    Then the manual draft table headings are:
      | Defendant     |
      | Date of birth |
      | Created       |
      | Account type  |
      | Business unit |
      | Submitted by  |
    And I sort the draft accounts table by column "Date failed" in "descending" order
    Then the manual draft table row 1 has values:
      | Defendant     | GREEN, Oliver    |
      | Date of birth | 01 Nov 2004      |
      | Date failed   | Today            |
      | Account type  | Fixed Penalty    |
      | Business unit | Camberwell Green |
      | Submitted by  | opal-test        |

  @PO-1816
  Scenario: AC1a - Failed individual fixed penalty draft returns to Failed tab after viewing details
    Given I create a "failedAdultOrYouthOnly" draft account with the following details and set status "Publishing Pending":
      | Account_status              | failed |
      | account.defendant.forenames | Oliver |
      | account.defendant.surname   | GREEN  |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    And I view the "Failed" tab on the Check and Validate page
    And I sort the draft accounts table by column "Date failed" in "descending" order
    And I open the draft account for defendant "GREEN, Oliver"
    Then I should see the header containing text "Mr Oliver GREEN"
    When I go back to Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"
    And I view the "Failed" tab on the Check and Validate page

  @PO-1816
  Scenario: AC2 - Failed company fixed penalty draft appears in Failed tab with expected details
    Given I create a "failedCompany" draft account with the following details and set status "Publishing Pending":
      | Account_status                 | Submitted                     |
      | account.defendant.company_name | Argent Oak Solutions Ltd comp |
      | account.account_type           | Fixed Penalty                 |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"
    When I view the "Failed" tab on the Check and Validate page
    Then the manual draft table headings are:
      | Defendant     |
      | Date of birth |
      | Created       |
      | Account type  |
      | Business unit |
      | Submitted by  |
    And I sort the draft accounts table by column "Date failed" in "descending" order
    Then the manual draft table row 1 has values:
      | Defendant     | Argent Oak Solutions Ltd comp |
      | Date of birth | —                             |
      | Date failed   | Today                         |
      | Account type  | Fixed Penalty                 |
      | Business unit | Camberwell Green              |
      | Submitted by  | opal-test                     |

  @PO-1816
  Scenario: AC2a - Failed company fixed penalty draft returns to Failed tab after viewing details
    Given I create a "failedCompany" draft account with the following details and set status "Publishing Pending":
      | Account_status                 | Submitted                     |
      | account.defendant.company_name | Argent Oak Solutions Ltd comp |
      | account.account_type           | Fixed Penalty                 |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    And I view the "Failed" tab on the Check and Validate page
    And I sort the draft accounts table by column "Date failed" in "descending" order
    And I open the draft account for defendant "Argent Oak Solutions Ltd comp"
    Then I should see the header containing text "Argent Oak Solutions Ltd comp"
    When I go back to Check and Validate Draft Accounts
    Then I should see the header containing text "Review accounts"
    And I view the "Failed" tab on the Check and Validate page
