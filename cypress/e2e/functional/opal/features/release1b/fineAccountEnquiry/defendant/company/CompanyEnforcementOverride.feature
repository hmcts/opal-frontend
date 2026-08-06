@JIRA-LABEL:account-enquiry
Feature: Company Enforcement Override
  As an Opal user
  I want to add an enforcement override from account enquiry
  So that the override is saved and shown on the Enforcement tab

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  Rule: Company account on NOENF
    @R1B @JIRA-STORY:PO-1843 @JIRA-EPIC:PO-1675 @JIRA-LABEL:account-enquiry @JIRA-TEST-KEY:PO-8008
    Scenario: Company removing enforcement hold returns to add additional enforcement action
      Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                         |
        | account.defendant.company_name                  | RemoveHold Company{uniq}          |
        | account.defendant.email_address_1               | removehold.company{uniq}@test.com |
        | account.defendant.post_code                     | AB23 4RN                          |
        | account.account_type                            | Fine                              |
        | account.prosecutor_case_reference               | PCR-AUTO-033                      |
        | account.collection_order_made                   | false                             |
        | account.collection_order_made_today             | false                             |
        | account.payment_card_request                    | false                             |
        | account.payment_terms.enforcements[0].result_id | NOENF                             |

      When I open the company account details for "RemoveHold Company{uniq}"
      And I go to the Enforcement tab
      And I open the remove enforcement hold screen
      When I enter "Removed" in the "Reason" field
      And I press the "Remove" button
      Then I should see the add new enforcement action page
      And the enforcement hold success banner is "Enforcement hold removed"

  Rule: Company account on NOENF
    @R1B @JIRA-STORY:PO-1843 @JIRA-EPIC:PO-1675 @JIRA-LABEL:account-enquiry @JIRA-TEST-KEY:PO-8010
    Scenario: Remove enforcement hold page is displayed for a company account on NOENF
      Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                         |
        | account.defendant.company_name                  | RemoveHold Company{uniq}          |
        | account.defendant.email_address_1               | removehold.company{uniq}@test.com |
        | account.defendant.post_code                     | AB23 4RN                          |
        | account.account_type                            | Fine                              |
        | account.prosecutor_case_reference               | PCR-AUTO-033                      |
        | account.collection_order_made                   | false                             |
        | account.collection_order_made_today             | false                             |
        | account.payment_card_request                    | false                             |
        | account.payment_terms.enforcements[0].result_id | NOENF                             |

      When I open the company account details for "RemoveHold Company{uniq}"
      And I go to the Enforcement tab
      And I open the remove enforcement hold screen
      Then I should see the remove enforcement hold page
      And I should see the remove enforcement hold account identifier "– RemoveHold Company{uniq}"
  Rule: Company account
    Background:
      Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                           |
        | account.defendant.company_name                  | Add Override Company{uniq}          |
        | account.defendant.email_address_1               | add.override.company{uniq}@test.com |
        | account.defendant.post_code                     | AB23 4RN                            |
        | account.account_type                            | Fine                                |
        | account.prosecutor_case_reference               | PCR-AUTO-023                        |
        | account.collection_order_made                   | false                               |
        | account.collection_order_made_today             | false                               |
        | account.payment_card_request                    | false                               |
        | account.payment_terms.enforcements[0].result_id | PRIS                                |
      When I open the company account details for "Add Override Company{uniq}"
      And I go to the Enforcement tab

    @R1B @JIRA-STORY:PO-1867 @JIRA-STORY:PO-1863 @JIRA-EPIC:PO-1675 @JIRA-TEST-KEY:PO-5298
    Scenario: Saving a company enforcement override returns to the Enforcement tab with the new summary value
      And I open the add enforcement override form
      When I add the enforcement override "ABDC" with the enforcer "The DWP (3)"
      Then I should return to the Enforcement tab
      And the enforcement override success banner is "Enforcement override added"
      And the enforcement override save request shows:
        | enforcement override result id | ABDC         |
        | enforcer id                    | 770000000003 |
      And the enforcement override summary shows:
        | enforcement override | Application made for Benefit Deductions (ABDC) |

    @R1B @JIRA-STORY:PO-1863 @JIRA-EPIC:PO-1675
    Scenario: Changing an existing company enforcement court returns to the Enforcement tab with a success banner
      Given the enforcement court summary shows an existing value
      When I change the enforcement court to a different value
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      And the enforcement court success banner is "Enforcement court changed"

    @R1B @JIRA-STORY:PO-1863 @JIRA-EPIC:PO-1675
    Scenario: Saving the same changed company enforcement court again does not display a success banner
      Given the enforcement court summary shows an existing value
      When I change the enforcement court to a different value
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      And the enforcement court success banner is "Enforcement court changed"
      When I save the same enforcement court value again
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      And the enforcement success banner is not displayed

    @R1B @JIRA-STORY:PO-1863 @JIRA-EPIC:PO-1675
    Scenario: Cancelling company enforcement court change without edits returns to the Enforcement tab
      Given the enforcement court summary shows an existing value
      When I open the change enforcement court form
      And I cancel without entering data
      Then I should return to the Enforcement tab
      And the enforcement court summary still shows the original value

    @R1B @JIRA-STORY:PO-1863 @JIRA-EPIC:PO-1675
    Scenario: Discarding an edited company enforcement court change keeps the changed value on the Enforcement tab
      Given the enforcement court summary shows an existing value
      When I change the enforcement court to a different value
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      When I open the change enforcement court form
      And I cancel the change enforcement court form after selecting a value and discarding changes
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value

    @R1B @JIRA-STORY:PO-1843 @JIRA-EPIC:PO-1675 @JIRA-TEST-KEY:PO-8013
    Scenario: Saving a withdrawn company enforcement action takes the user to add another enforcement action
      And I open the add enforcement action form
      And I choose the enforcement action "Withdrawn (WDN)"
      And I continue to the confirm enforcement action page
      And I enter "Test reason" for the enforcement action reason
      And I add the enforcement action
      And the enforcement action added success banner is "Enforcement action added"
      Then I should see the add new enforcement action page
