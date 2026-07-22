@JIRA-LABEL:account-enquiry @JIRA-LABEL:accessibility
@JIRA-NFR:PO-2322
Feature: Defendant - Company - Account Enquiries - Enforcement Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts  @R1B @JIRA-STORY:PO-1863 @JIRA-STORY:PO-3729 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5461
  Scenario: Company enforcement tab accessibility
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                                  | Submitted                 |
      | account.defendant.company_name                  | Enf Company{uniq}         |
      | account.defendant.email_address_1               | EnfCompany{uniq}@test.com |
      | account.defendant.post_code                     | AB23 4RN                  |
      | account.account_type                            | Fine                      |
      | account.prosecutor_case_reference               | PCR-AUTO-017              |
      | account.collection_order_made                   | false                     |
      | account.collection_order_made_today             | false                     |
      | account.payment_card_request                    | false                     |
      | account.payment_terms.enforcements[0].result_id | PRIS                      |

    When I open the company account details for "Enf Company{uniq}"
    And I go to the Enforcement tab
    Then I check the page for accessibility
    And I open the change enforcement court form
    And I check the page for accessibility
  @R1B @JIRA-STORY:PO-1867 @JIRA-STORY:PO-1863 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5462
  Scenario: Company add enforcement override page accessibility
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                                  | Submitted                         |
      | account.defendant.company_name                  | Enf Override Company{uniq}        |
      | account.defendant.email_address_1               | EnfOverrideCompany{uniq}@test.com |
      | account.defendant.post_code                     | AB23 4RN                          |
      | account.account_type                            | Fine                              |
      | account.prosecutor_case_reference               | PCR-AUTO-018                      |
      | account.collection_order_made                   | false                             |
      | account.collection_order_made_today             | false                             |
      | account.payment_card_request                    | false                             |
      | account.payment_terms.enforcements[0].result_id | PRIS                              |

    When I open the company account details for "Enf Override Company{uniq}"
    And I go to the Enforcement tab
    And I open the add enforcement override form
    Then I check the page for accessibility
  @R1B @JIRA-STORY:PO-1782 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5465
  Scenario: Company add enforcement action page accessibility
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                                  | Submitted                       |
      | account.defendant.company_name                  | Enf Action Company{uniq}        |
      | account.defendant.email_address_1               | EnfActionCompany{uniq}@test.com |
      | account.defendant.post_code                     | AB23 4RN                        |
      | account.account_type                            | Fine                            |
      | account.prosecutor_case_reference               | PCR-AUTO-018                    |
      | account.collection_order_made                   | false                           |
      | account.collection_order_made_today             | false                           |
      | account.payment_card_request                    | false                           |
      | account.payment_terms.enforcements[0].result_id | PRIS                            |

    When I open the company account details for "Enf Action Company{uniq}"
    And I go to the Enforcement tab
    And I open the add enforcement action form
    Then I check the page for accessibility
