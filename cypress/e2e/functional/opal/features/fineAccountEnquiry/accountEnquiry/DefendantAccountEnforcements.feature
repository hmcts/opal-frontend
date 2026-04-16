@JIRA-LABEL:account-enquiry
Feature: Account Enquiries - Add Enforcement Override
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

    @JIRA-STORY:PO-1866 @JIRA-STORY:PO-1849 @JIRA-EPIC:PO-1675
    Scenario: Save an enforcement override and return to the Enforcement tab
      When I search for the account by last name "AddEnfOverride{uniq}" and open the latest result
      And I go to the Enforcement tab
      And I open the add enforcement override form
      When I add the enforcement override "ABDC" with the enforcer "The DWP (3)"
      Then I should return to the Enforcement tab
      And the enforcement override success banner is "Enforcement override added"
      And the enforcement override save request shows:
        | enforcement override result id | ABDC         |
        | enforcer id                    | 770000000003 |
      And the enforcement override summary shows:
        | enforcement override | Application made for Benefit Deductions(ABDC) |
      # AC4a/AC4b/AC4c - Change the enforcement court to a different value and verify the Enforcement tab, new value, and success banner
      When I change the enforcement court to a different value
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      And the enforcement court success banner is "Enforcement court changed"
      # AC4ci - Save the same enforcement court value again and verify no success banner is shown
      When I save the same enforcement court value again
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      And the enforcement success banner is not displayed
      # AC5a - Cancel without selecting a value returns to the Enforcement tab without confirmation
      When I open the change enforcement court form
      And I cancel without entering data
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      # AC5b - Cancel after selecting a value shows the route guard confirmation before returning to the Enforcement tab
      When I open the change enforcement court form
      And I cancel the change enforcement court form after selecting a value and discarding changes
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value

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

    @JIRA-STORY:PO-1867 @JIRA-STORY:PO-1863 @JIRA-EPIC:PO-1675
    Scenario: Company save an enforcement override and return to the Enforcement tab
      When I open the company account details for "Add Override Company{uniq}"
      And I go to the Enforcement tab
      And I open the add enforcement override form
      When I add the enforcement override "ABDC" with the enforcer "The DWP (3)"
      Then I should return to the Enforcement tab
      And the enforcement override success banner is "Enforcement override added"
      And the enforcement override save request shows:
        | enforcement override result id | ABDC         |
        | enforcer id                    | 770000000003 |
      And the enforcement override summary shows:
        | enforcement override | Application made for Benefit Deductions(ABDC) |
      # AC4a/AC4b/AC4c - Change the enforcement court to a different value and verify the Enforcement tab, new value, and success banner
      When I change the enforcement court to a different value
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      And the enforcement court success banner is "Enforcement court changed"
      # AC4ci - Save the same enforcement court value again and verify no success banner is shown
      When I save the same enforcement court value again
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      And the enforcement success banner is not displayed
      # AC5a - Cancel without selecting a value returns to the Enforcement tab without confirmation
      When I open the change enforcement court form
      And I cancel without entering data
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      # AC5b - Cancel after selecting a value shows the route guard confirmation before returning to the Enforcement tab
      When I open the change enforcement court form
      And I cancel the change enforcement court form after selecting a value and discarding changes
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value

  Rule: Parent or guardian account
    Background:
      Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                        |
        | account.defendant.forenames                     | Alex                             |
        | account.defendant.surname                       | AddEnfOverridePG{uniq}           |
        | account.defendant.email_address_1               | alex.enf.override{uniq}@test.com |
        | account.defendant.telephone_number_home         | 02078250011                      |
        | account.account_type                            | Fine                             |
        | account.prosecutor_case_reference               | PCR-AUTO-024                     |
        | account.collection_order_made                   | false                            |
        | account.collection_order_made_today             | false                            |
        | account.payment_card_request                    | false                            |
        | account.defendant.dob                           | 2010-11-10                       |
        | account.defendant.parent_guardian.dob           | 1980-02-15                       |
        | account.payment_terms.enforcements[0].result_id | PRIS                             |

    @JIRA-STORY:PO-1866 @JIRA-STORY:PO-1863 @JIRA-EPIC:PO-1675
    Scenario: Parent or guardian save an enforcement override and return to the Enforcement tab
      When I search for the account by last name "AddEnfOverridePG{uniq}" and open the latest result
      And I go to the Enforcement tab
      And I open the add enforcement override form
      When I add the enforcement override "ABDC" with the enforcer "The DWP (3)"
      Then I should return to the Enforcement tab
      And the enforcement override success banner is "Enforcement override added"
      And the enforcement override save request shows:
        | enforcement override result id | ABDC         |
        | enforcer id                    | 770000000003 |
      And the enforcement override summary shows:
        | enforcement override | Application made for Benefit Deductions(ABDC) |
      # AC4a/AC4b/AC4c - Change the enforcement court to a different value and verify the Enforcement tab, new value, and success banner
      When I change the enforcement court to a different value
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      And the enforcement court success banner is "Enforcement court changed"
      # AC4ci - Save the same enforcement court value again and verify no success banner is shown
      When I save the same enforcement court value again
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      And the enforcement success banner is not displayed
      # AC5a - Cancel without selecting a value returns to the Enforcement tab without confirmation
      When I open the change enforcement court form
      And I cancel without entering data
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
      # AC5b - Cancel after selecting a value shows the route guard confirmation before returning to the Enforcement tab
      When I open the change enforcement court form
      And I cancel the change enforcement court form after selecting a value and discarding changes
      Then I should return to the Enforcement tab
      And the enforcement court summary shows the selected value
