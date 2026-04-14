@JIRA-LABEL:account-enquiry @JIRA-LABEL:accessibility
@JIRA-STORY:PO-2322
Feature: Account Enquiries - Enforcement Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts
  @JIRA-STORY:PO-1866 @JIRA-STORY:PO-1849 @JIRA-EPIC:PO-1675 @JIRA-KEY:POT-4454
  Scenario: Enforcement tab accessibility
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                                  | Submitted                     |
      | account.defendant.forenames                     | Erin                          |
      | account.defendant.surname                       | EnfAccess{uniq}               |
      | account.defendant.email_address_1               | Erin.EnfAccess{uniq}@test.com |
      | account.defendant.telephone_number_home         | 02078259314                   |
      | account.account_type                            | Fine                          |
      | account.prosecutor_case_reference               | PCR-AUTO-015                  |
      | account.collection_order_made                   | false                         |
      | account.collection_order_made_today             | false                         |
      | account.payment_card_request                    | false                         |
      | account.defendant.dob                           | 2002-05-15                    |
      | account.payment_terms.enforcements[0].result_id | PRIS                          |

    When I search for the account by last name "EnfAccess{uniq}" and open the latest result
    And I go to the Enforcement tab
    Then I check the page for accessibility
    And I open the change enforcement court form
    And I check the page for accessibility

  @JIRA-STORY:PO-1866 @JIRA-STORY:PO-1850 @JIRA-EPIC:PO-1675 @JIRA-KEY:POT-4455
  Scenario: Add enforcement override page accessibility
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                                  | Submitted                             |
      | account.defendant.forenames                     | Evan                                  |
      | account.defendant.surname                       | EnfOverrideAccess{uniq}               |
      | account.defendant.email_address_1               | Evan.EnfOverrideAccess{uniq}@test.com |
      | account.defendant.telephone_number_home         | 02078259315                           |
      | account.account_type                            | Fine                                  |
      | account.prosecutor_case_reference               | PCR-AUTO-016                          |
      | account.collection_order_made                   | false                                 |
      | account.collection_order_made_today             | false                                 |
      | account.payment_card_request                    | false                                 |
      | account.defendant.dob                           | 2002-05-15                            |
      | account.payment_terms.enforcements[0].result_id | PRIS                                  |

    When I search for the account by last name "EnfOverrideAccess{uniq}" and open the latest result
    And I go to the Enforcement tab
    And I open the add enforcement override form
    Then I check the page for accessibility

  @JIRA-STORY:PO-1867 @JIRA-STORY:PO-1863 @JIRA-EPIC:PO-1675 @JIRA-KEY:POT-4456
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

  @JIRA-STORY:PO-1867 @JIRA-EPIC:PO-1675 @JIRA-KEY:POT-4457
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

  @JIRA-STORY:PO-1849 @JIRA-STORY:PO-1862 @JIRA-EPIC:PO-1675
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
