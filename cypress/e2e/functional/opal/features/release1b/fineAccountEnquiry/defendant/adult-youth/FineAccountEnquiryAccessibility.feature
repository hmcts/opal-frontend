@JIRA-LABEL:account-enquiry @JIRA-LABEL:accessibility
@JIRA-NFR:PO-2322
Feature: Defendant - Adult or youth - Account Enquiries - Enforcement Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts  @R1B @JIRA-STORY:PO-1849 @JIRA-STORY:PO-3729 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5459
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
  @R1B @JIRA-STORY:PO-1850 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5460
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
  @R1B @JIRA-STORY:PO-1782 @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5464
  Scenario: Add enforcement action page accessibility
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                                  | Submitted                           |
      | account.defendant.forenames                     | Evan                                |
      | account.defendant.surname                       | EnfActionAccess{uniq}               |
      | account.defendant.email_address_1               | Evan.EnfActionAccess{uniq}@test.com |
      | account.defendant.telephone_number_home         | 02078259315                         |
      | account.account_type                            | Fine                                |
      | account.prosecutor_case_reference               | PCR-AUTO-016                        |
      | account.collection_order_made                   | false                               |
      | account.collection_order_made_today             | false                               |
      | account.payment_card_request                    | false                               |
      | account.defendant.dob                           | 2002-05-15                          |
      | account.payment_terms.enforcements[0].result_id | PRIS                                |

    When I search for the account by last name "EnfActionAccess{uniq}" and open the latest result
    And I go to the Enforcement tab
    And I open the add enforcement action form
    Then I check the page for accessibility
  @R1B @JIRA-STORY:PO-1782 @JIRA-EPIC:PO-2630 @JIRA-TEST-KEY:PO-7555
  Scenario: Confirm enforcement action page accessibility
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                                  | Submitted                           |
      | account.defendant.forenames                     | Evan                                |
      | account.defendant.surname                       | EnfActionAccess{uniq}               |
      | account.defendant.email_address_1               | Evan.EnfActionAccess{uniq}@test.com |
      | account.defendant.telephone_number_home         | 02078259315                         |
      | account.account_type                            | Fine                                |
      | account.prosecutor_case_reference               | PCR-AUTO-016                        |
      | account.collection_order_made                   | false                               |
      | account.collection_order_made_today             | false                               |
      | account.payment_card_request                    | false                               |
      | account.defendant.dob                           | 2002-05-15                          |
      | account.payment_terms.enforcements[0].result_id | PRIS                                |

    When I search for the account by last name "EnfActionAccess{uniq}" and open the latest result
    And I go to the Enforcement tab
    And I open the add enforcement action form
    And I choose the enforcement action "Collection order (COLLO)"
    And I continue to the confirm enforcement action page
    Then I check the page for accessibility
  @R1B @JIRA-STORY:PO-1785 @JIRA-EPIC:PO-1675 @JIRA-TEST-KEY:PO-5466
  Scenario: Remove enforcement hold page accessibility
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                                  | Submitted                           |
      | account.defendant.forenames                     | Evan                                |
      | account.defendant.surname                       | EnfRemoveAccess{uniq}               |
      | account.defendant.email_address_1               | Evan.EnfRemoveAccess{uniq}@test.com |
      | account.defendant.telephone_number_home         | 02078259315                         |
      | account.account_type                            | Fine                                |
      | account.prosecutor_case_reference               | PCR-AUTO-019                        |
      | account.collection_order_made                   | false                               |
      | account.collection_order_made_today             | false                               |
      | account.payment_card_request                    | false                               |
      | account.defendant.dob                           | 2002-05-15                          |
      | account.payment_terms.enforcements[0].result_id | NOENF                               |

    When I search for the account by last name "EnfRemoveAccess{uniq}" and open the latest result
    And I go to the Enforcement tab
    And I open the remove enforcement hold screen
    Then I check the page for accessibility
  @R1B @JIRA-STORY:PO-2635 @JIRA-EPIC:PO-2621
  Scenario: History and notes tab accessibility
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                          | Submitted                           |
      | account.defendant.title                 | Ms                                  |
      | account.defendant.forenames             | Hannah                              |
      | account.defendant.surname               | HistoryAccess{uniq}                 |
      | account.defendant.email_address_1       | Hannah.HistoryAccess{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078259314                         |
      | account.account_type                    | Fine                                |
      | account.prosecutor_case_reference       | PCR-AUTO-027                        |
      | account.collection_order_made           | false                               |
      | account.collection_order_made_today     | false                               |
      | account.payment_card_request            | false                               |
      | account.defendant.dob                   | 2002-05-15                          |
    And the History and notes API is stubbed with standard tab data

    When I search for the account by last name "HistoryAccess{uniq}" and open the latest result
    And I go to the History and notes tab
    Then I check the page for accessibility
