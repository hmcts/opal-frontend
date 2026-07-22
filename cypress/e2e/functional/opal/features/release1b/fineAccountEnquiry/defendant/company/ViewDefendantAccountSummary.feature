@JIRA-LABEL:account-enquiry
@JIRA-STORY:PO-777
Feature: Defendant - Company - View Defendant Account Summary - Add Comments

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts
  @JIRA-EPIC:PO-812 @R1B @JIRA-STORY:PO-777 @JIRA-TEST-KEY:PO-5476
  Scenario: Complete View Defendant Company Account Summary and Comments functionality
    # AC4 - Create & publish a company account then view header summary
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted                    |
      | account.defendant.company_name      | Accdetail comp{uniq}         |
      | account.defendant.email_address_1   | Accdetailcomp{uniq}@test.com |
      | account.defendant.post_code         | AB23 4RN                     |
      | account.account_type                | Fine                         |
      | account.prosecutor_case_reference   | PCR-AUTO-003                 |
      | account.collection_order_made       | false                        |
      | account.collection_order_made_today | false                        |
      | account.payment_card_request        | false                        |
    When I open the company account details for "Accdetail comp{uniq}"

    # AC9a - Test route guard with unsaved changes
    # Test cancel with unsaved changes (route guard should trigger)
    When I verify route guard behaviour when cancelling comments with "Comment Test"
    Then I should see the account header contains "Accdetail comp{uniq}"

    # AC5 – Verify updated comments on Defendant summary
    When I save the following comments and verify the account header is "Accdetail comp{uniq}":
      | field   | text            |
      | Comment | Company Comment |
      | Line 1  | Company Line1   |
      | Line 2  | Company Line2   |
      | Line 3  | Company Line3   |

    # AC5c - Verify updated comments display for defendant
    Then Verify updated comments display in Comments section:
      | Comment | Company Comment |
      | Line 1  | Company Line1   |
      | Line 2  | Company Line2   |
      | Line 3  | Company Line3   |

    Then I should see the following values on the Comments form:
      | Comment | Company Comment |
      | Line 1  | Company Line1   |
      | Line 2  | Company Line2   |
      | Line 3  | Company Line3   |
