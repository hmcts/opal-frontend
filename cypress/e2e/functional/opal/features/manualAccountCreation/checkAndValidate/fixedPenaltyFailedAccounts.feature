Feature: Fixed Penalty Failed Account Validation (PO-1816)
  As a checker user
  I want to view and validate failed Fixed Penalty draft accounts
  So that I can ensure the Check and Validate journey works for Fixed Penalty accounts

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I clear all approved accounts

  @PO-1816
  Scenario: AC1 - Failed individual fixed penalty draft appears in Failed tab with expected details
    Given I create a "failedAdultOrYouthOnly" draft account with the following details and set status "Publishing Pending":
      | Account_status              | failed |
      | account.defendant.forenames | Oliver |
      | account.defendant.surname   | GREEN{uniq}  |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    And I view the "Failed" tab on the Check and Validate page
    Then the manual draft table headings are:
      | Defendant     |
      | Date of birth |
      | Date failed   |
      | Account type  |
      | Business unit |
      | Submitted by  |
    And I sort the draft accounts table by column "Date failed" in "descending" order
    Then the manual draft table row containing "GREEN{uniq}, Oliver" in column "Defendant" has values:
      | Defendant     | GREEN{uniq}, Oliver    |
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
      | account.defendant.surname   | GREEN{uniq}  |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    And I view the "Failed" tab on the Check and Validate page
    And I view the draft account details for defendant "GREEN{uniq}, Oliver"
    When I go back to Check and Validate Draft Accounts
    Then the "Failed" tab on Check and Validate is active
    And the draft accounts table should contain "GREEN{uniq}, Oliver" in column "Defendant"

  @PO-1816
  Scenario: AC2 - Failed company fixed penalty draft appears in Failed tab with expected details
    Given I create a "failedCompany" draft account with the following details and set status "Publishing Pending":
      | Account_status                 | Submitted                     |
      | account.defendant.company_name | Argent Oak Solutions Ltd comp {uniq} |
      | account.account_type           | Fixed Penalty                 |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    And I view the "Failed" tab on the Check and Validate page
    Then the manual draft table headings are:
      | Defendant     |
      | Date of birth |
      | Date failed   |
      | Account type  |
      | Business unit |
      | Submitted by  |
    And I sort the draft accounts table by column "Date failed" in "descending" order
    Then the manual draft table row containing "Argent Oak Solutions Ltd comp {uniq}" in column "Defendant" has values:
      | Defendant     | Argent Oak Solutions Ltd comp {uniq} |
      | Date of birth | —                             |
      | Date failed   | Today                         |
      | Account type  | Fixed Penalty                 |
      | Business unit | Camberwell Green              |
      | Submitted by  | opal-test                     |


  @PO-1816
  Scenario: AC2a - Failed company fixed penalty draft returns to Failed tab after viewing details
    Given I create a "failedCompany" draft account with the following details and set status "Publishing Pending":
      | Account_status                 | Submitted                     |
      | account.defendant.company_name | Argent Oak Solutions Ltd comp {uniq} |
      | account.account_type           | Fixed Penalty                 |
    And I am logged in with email "opal-test-10@HMCTS.NET"
    When I open Check and Validate Draft Accounts
    And I view the "Failed" tab on the Check and Validate page
    And I view the draft account details for defendant "Argent Oak Solutions Ltd comp {uniq}"
    When I go back to Check and Validate Draft Accounts
    Then the "Failed" tab on Check and Validate is active
    And the draft accounts table should contain "Argent Oak Solutions Ltd comp {uniq}" in column "Defendant"
