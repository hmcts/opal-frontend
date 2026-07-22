@JIRA-LABEL:account-enquiry @JIRA-LABEL:accessibility
@JIRA-NFR:PO-2322
Feature: Defendant - Parent or guardian to pay - Account Enquiries - Enforcement Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1B @JIRA-STORY:PO-1862 @JIRA-STORY:PO-3729 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5463
  Scenario: Parent or guardian enforcement tab accessibility
    Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                                  | Submitted                       |
      | account.defendant.forenames                     | Alex                            |
      | account.defendant.surname                       | EnfPgAccess{uniq}               |
      | account.defendant.email_address_1               | Alex.EnfPgAccess{uniq}@test.com |
      | account.defendant.telephone_number_home         | 02078250011                     |
      | account.account_type                            | Fine                            |
      | account.prosecutor_case_reference               | PCR-AUTO-025                    |
      | account.collection_order_made                   | false                           |
      | account.collection_order_made_today             | false                           |
      | account.payment_card_request                    | false                           |
      | account.defendant.dob                           | 2010-11-10                      |
      | account.defendant.parent_guardian.dob           | 1980-02-15                      |
      | account.payment_terms.enforcements[0].result_id | PRIS                            |

    When I search for the account by last name "EnfPgAccess{uniq}" and open the latest result
    And I go to the Enforcement tab
    Then I check the page for accessibility
    And I open the change enforcement court form
    And I check the page for accessibility
