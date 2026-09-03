@JIRA-LABEL:account-enquiry
Feature: Adult Youth Account Enquiries View Impositions Accessibility
  As a caseworker
  I want to view the impositions for a defendant account
  So that I can confirm the account's imposed amounts and balances

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-2079 @JIRA-EPIC:PO-979
  Scenario: Defendant account impositions tab accessibility
    Given I create a "ayMultiOffenceMultiImposition" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted                         |
      | account.defendant.forenames         | Morgan                            |
      | account.defendant.surname           | Impositions{uniq}                 |
      | account.defendant.email_address_1   | Morgan.Impositions{uniq}@test.com |
      | account.account_type                | Fine                              |
      | account.prosecutor_case_reference   | PCR-IMPOSITIONS{uniqUpper}        |
      | account.collection_order_made       | false                             |
      | account.collection_order_made_today | false                             |
      | account.payment_card_request        | false                             |
      | account.defendant.dob               | 1998-08-24                        |
      | account.account_sentence_date       | 2025-05-15                        |
      | account.enforcement_court_id        | 770000000001                      |

    When I search for the account by last name "Impositions{uniq}" and open the latest result
    When I go to the Impositions tab
    Then I should return to the Impositions tab
    And I check the page for accessibility



