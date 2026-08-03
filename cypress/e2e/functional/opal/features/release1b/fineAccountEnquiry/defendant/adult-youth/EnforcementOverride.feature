@JIRA-LABEL:account-enquiry
Feature: Defendant - Adult or youth - Account Enquiries - Add Enforcement Override
  As an Opal user
  I want to add an enforcement override from account enquiry
  So that the override is saved and shown on the Enforcement tab

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  Rule: Adult or youth account
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                    |
        | account.defendant.forenames                     | Evan                         |
        | account.defendant.surname                       | AddEnfOverride{uniq}         |
        | account.defendant.email_address_1               | evan.override{uniq}@test.com |
        | account.defendant.telephone_number_home         | 02078259316                  |
        | account.account_type                            | Fine                         |
        | account.prosecutor_case_reference               | PCR-AUTO-019                 |
        | account.collection_order_made                   | false                        |
        | account.collection_order_made_today             | false                        |
        | account.payment_card_request                    | false                        |
        | account.defendant.dob                           | 2002-05-15                   |
        | account.payment_terms.enforcements[0].result_id | PRIS                         |
      When I search for the account by last name "AddEnfOverride{uniq}" and open the latest result
      And I go to the Enforcement tab

    @R1B @JIRA-STORY:PO-1866 @JIRA-STORY:PO-1849 @JIRA-EPIC:PO-1675 @JIRA-TEST-KEY:PO-5297
    Scenario: Saving an enforcement override returns to the Enforcement tab with the new summary value
      And I open the add enforcement override form
      When I add the enforcement override "ABDC" with the enforcer "The DWP (3)"
      Then I should return to the Enforcement tab
      And the enforcement override success banner is "Enforcement override added"
      And the enforcement override save request shows:
        | enforcement override result id | ABDC         |
        | enforcer id                    | 770000000003 |
      And the enforcement override summary shows:
        | enforcement override | Application made for Benefit Deductions (ABDC) |

    @R1B @JIRA-STORY:PO-1849 @JIRA-EPIC:PO-1675
    Scenario: Changing the existing enforcement court returns to the Enforcement tab with a success banner
      Given the enforcement court summary shows an existing value
      When I change the enforcement court to a different value
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      And the enforcement court success banner is "Enforcement court changed"

    @R1B @JIRA-STORY:PO-1849 @JIRA-EPIC:PO-1675
    Scenario: Saving the same changed enforcement court again does not display a success banner
      Given the enforcement court summary shows an existing value
      When I change the enforcement court to a different value
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      And the enforcement court success banner is "Enforcement court changed"
      When I save the same enforcement court value again
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      And the enforcement success banner is not displayed

    @R1B @JIRA-STORY:PO-1849 @JIRA-EPIC:PO-1675
    Scenario: Cancelling enforcement court change without edits returns to the Enforcement tab
      Given the enforcement court summary shows an existing value
      When I open the change enforcement court form
      And I cancel without entering data
      Then I should return to the Enforcement tab
      And the enforcement court summary still shows the original value

    @R1B @JIRA-STORY:PO-1849 @JIRA-EPIC:PO-1675
    Scenario: Discarding an edited enforcement court change keeps the changed value on the Enforcement tab
      Given the enforcement court summary shows an existing value
      When I change the enforcement court to a different value
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      When I open the change enforcement court form
      And I cancel the change enforcement court form after selecting a value and discarding changes
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value

  Rule: Adult or youth account
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                    |
        | account.defendant.forenames                     | Evan                         |
        | account.defendant.surname                       | AddEnfOverride{uniq}         |
        | account.defendant.email_address_1               | evan.override{uniq}@test.com |
        | account.defendant.telephone_number_home         | 02078259316                  |
        | account.account_type                            | Fine                         |
        | account.prosecutor_case_reference               | PCR-AUTO-019                 |
        | account.collection_order_made                   | false                        |
        | account.collection_order_made_today             | false                        |
        | account.payment_card_request                    | false                        |
        | account.defendant.dob                           | 2002-05-15                   |
        | account.payment_terms.enforcements[0].result_id | PRIS                         |
    @R1B @JIRA-STORY:PO-1843 @JIRA-EPIC:PO-1675 @JIRA-LABEL:account-enquiry @JIRA-TEST-KEY:PO-8005
    Scenario: Remove enforcement hold page is displayed for a defendant account on NOENF
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                        |
        | account.defendant.forenames                     | Robert                           |
        | account.defendant.surname                       | RemoveHold{uniq}                 |
        | account.defendant.email_address_1               | robert.removehold{uniq}@test.com |
        | account.defendant.telephone_number_home         | 02078259321                      |
        | account.account_type                            | Fine                             |
        | account.prosecutor_case_reference               | PCR-AUTO-030                     |
        | account.collection_order_made                   | false                            |
        | account.collection_order_made_today             | false                            |
        | account.payment_card_request                    | false                            |
        | account.defendant.dob                           | 2000-06-15                       |
        | account.payment_terms.enforcements[0].result_id | NOENF                            |

      When I search for the account by last name "RemoveHold{uniq}" and open the latest result
      And I go to the Enforcement tab
      And I open the remove enforcement hold screen
      Then I should see the remove enforcement hold page
      And I should see the remove enforcement hold account identifier "Mr Robert REMOVEHOLD{uniqUpper} Remove enforcement hold"

  Rule: Adult or youth account
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                    |
        | account.defendant.forenames                     | Evan                         |
        | account.defendant.surname                       | AddEnfOverride{uniq}         |
        | account.defendant.email_address_1               | evan.override{uniq}@test.com |
        | account.defendant.telephone_number_home         | 02078259316                  |
        | account.account_type                            | Fine                         |
        | account.prosecutor_case_reference               | PCR-AUTO-019                 |
        | account.collection_order_made                   | false                        |
        | account.collection_order_made_today             | false                        |
        | account.payment_card_request                    | false                        |
        | account.defendant.dob                           | 2002-05-15                   |
        | account.payment_terms.enforcements[0].result_id | PRIS                         |
    @R1B @JIRA-STORY:PO-1843 @JIRA-EPIC:PO-1675 @JIRA-LABEL:account-enquiry @JIRA-TEST-KEY:PO-8006

    Scenario: Canceling remove enforcement hold with entered text shows confirmation before leaving
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                              |
        | account.defendant.forenames                     | Robert                                 |
        | account.defendant.surname                       | RemoveHoldCancel{uniq}                 |
        | account.defendant.email_address_1               | robert.removeholdcancel{uniq}@test.com |
        | account.defendant.telephone_number_home         | 02078259322                            |
        | account.account_type                            | Fine                                   |
        | account.prosecutor_case_reference               | PCR-AUTO-031                           |
        | account.collection_order_made                   | false                                  |
        | account.collection_order_made_today             | false                                  |
        | account.payment_card_request                    | false                                  |
        | account.defendant.dob                           | 2000-06-15                             |
        | account.payment_terms.enforcements[0].result_id | NOENF                                  |

      When I search for the account by last name "RemoveHoldCancel{uniq}" and open the latest result
      And I go to the Enforcement tab
      And I open the remove enforcement hold screen
      When I enter "Removed for review" in the "Reason" field
      And I cancel the remove enforcement hold screen and confirm leaving
      Then I should return to the Enforcement tab

  Rule: Adult or youth account
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                    |
        | account.defendant.forenames                     | Evan                         |
        | account.defendant.surname                       | AddEnfOverride{uniq}         |
        | account.defendant.email_address_1               | evan.override{uniq}@test.com |
        | account.defendant.telephone_number_home         | 02078259316                  |
        | account.account_type                            | Fine                         |
        | account.prosecutor_case_reference               | PCR-AUTO-019                 |
        | account.collection_order_made                   | false                        |
        | account.collection_order_made_today             | false                        |
        | account.payment_card_request                    | false                        |
        | account.defendant.dob                           | 2002-05-15                   |
        | account.payment_terms.enforcements[0].result_id | PRIS                         |

    @R1B @JIRA-STORY:PO-1843 @JIRA-STORY:PO-1833 @JIRA-EPIC:PO-1675 @JIRA-LABEL:account-enquiry @JIRA-TEST-KEY:PO-8007
    Scenario: Removing enforcement hold returns to add additional enforcement action with successful remove banner
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                               |
        | account.defendant.forenames                     | Robert                                  |
        | account.defendant.surname                       | RemoveHoldSuccess{uniq}                 |
        | account.defendant.email_address_1               | robert.removeholdsuccess{uniq}@test.com |
        | account.defendant.telephone_number_home         | 02078259323                             |
        | account.account_type                            | Fine                                    |
        | account.prosecutor_case_reference               | PCR-AUTO-032                            |
        | account.collection_order_made                   | false                                   |
        | account.collection_order_made_today             | false                                   |
        | account.payment_card_request                    | false                                   |
        | account.defendant.dob                           | 2000-06-15                              |
        | account.payment_terms.enforcements[0].result_id | NOENF                                   |

      When I search for the account by last name "RemoveHoldSuccess{uniq}" and open the latest result
      And I go to the Enforcement tab
      And I open the remove enforcement hold screen
      Then I should see the remove enforcement hold account identifier "Mr Robert REMOVEHOLDSUCCESS{uniqUpper} Remove enforcement hold"
      When I enter "Removed" in the "Reason" field
      And I press the "Remove" button
      Then I should see the add new enforcement action page
      And the enforcement hold success banner is "Enforcement hold removed"

  Rule: Adult or youth account
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                    |
        | account.defendant.forenames                     | Evan                         |
        | account.defendant.surname                       | AddEnfOverride{uniq}         |
        | account.defendant.email_address_1               | evan.override{uniq}@test.com |
        | account.defendant.telephone_number_home         | 02078259316                  |
        | account.account_type                            | Fine                         |
        | account.prosecutor_case_reference               | PCR-AUTO-019                 |
        | account.collection_order_made                   | false                        |
        | account.collection_order_made_today             | false                        |
        | account.payment_card_request                    | false                        |
        | account.defendant.dob                           | 2002-05-15                   |
        | account.payment_terms.enforcements[0].result_id | PRIS                         |
      When I search for the account by last name "AddEnfOverride{uniq}" and open the latest result
      And I go to the Enforcement tab

    @R1B @JIRA-STORY:PO-1782 @JIRA-EPIC:PO-2630 @JIRA-TEST-KEY:PO-8011
    Scenario: Saving an enforcement action returns to the Enforcement tab
      And I open the add enforcement action form
      And I choose the enforcement action "Collection order (COLLO)"
      And I continue to the confirm enforcement action page
      And I enter "Test reason" for the enforcement action reason
      And I choose "No" for changing existing payment terms
      And I add the enforcement action
      Then I should return to the Enforcement tab
      And the enforcement action summary shows "Collection Order(COLLO)"

  Rule: Adult or youth account
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                    |
        | account.defendant.forenames                     | Evan                         |
        | account.defendant.surname                       | AddEnfOverride{uniq}         |
        | account.defendant.email_address_1               | evan.override{uniq}@test.com |
        | account.defendant.telephone_number_home         | 02078259316                  |
        | account.account_type                            | Fine                         |
        | account.prosecutor_case_reference               | PCR-AUTO-019                 |
        | account.collection_order_made                   | false                        |
        | account.collection_order_made_today             | false                        |
        | account.payment_card_request                    | false                        |
        | account.defendant.dob                           | 2002-05-15                   |
        | account.payment_terms.enforcements[0].result_id | PRIS                         |
      When I search for the account by last name "AddEnfOverride{uniq}" and open the latest result
      And I go to the Enforcement tab

    @R1B @JIRA-STORY:PO-1786 @JIRA-EPIC:PO-1675 @JIRA-TEST-KEY:PO-8012
    Scenario: Saving a withdrawn enforcement action takes the user to add another enforcement action
      And I open the add enforcement action form
      And I choose the enforcement action "Withdrawn (WDN)"
      And I continue to the confirm enforcement action page
      And I enter "Test reason" for the enforcement action reason
      And I add the enforcement action
      And the enforcement action added success banner is "Enforcement action added"
      Then I should see the add new enforcement action page
