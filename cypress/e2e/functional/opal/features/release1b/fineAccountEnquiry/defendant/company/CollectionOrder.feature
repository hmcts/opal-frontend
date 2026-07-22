@JIRA-LABEL:account-enquiry
@JIRA-STORY:PO-1848
Feature: Defendant - Company - Defendant account enforcement - Collection order
  As an Opal user
  I want to change Collection Order status from the Enforcement tab
  So that the account reflects the correct enforcement status

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts
  @JIRA-STORY:PO-1846
  Rule: Company account
    Background:
      Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                               |
        | account.defendant.company_name                  | Collection Order Company{uniq}          |
        | account.defendant.email_address_1               | collection.order.company{uniq}@test.com |
        | account.defendant.post_code                     | AB23 4RN                                |
        | account.account_type                            | Fine                                    |
        | account.prosecutor_case_reference               | PCR-ENF-COMP-{uniqUpper}                |
        | account.collection_order_made                   | false                                   |
        | account.collection_order_made_today             | false                                   |
        | account.payment_card_request                    | false                                   |
        | account.payment_terms.enforcements[0].result_id | PRIS                                    |
      When I open the company account details for "Collection Order Company{uniq}"
      And I go to the Enforcement tab

    @R1B @JIRA-EPIC:PO-1675 @JIRA-TEST-KEY:PO-5355
    Scenario: Save Collection Order status for a company account
      And I open the Change Collection Order status form
      Then I should see the Change Collection Order status page
      And I should see the account identifier "Collection Order Company{uniq}"
      And I select "Yes" for Collection Order status
      And I submit the Change Collection Order status form
      Then I should return to the Enforcement tab
      And I should see the collection order success banner "Collection Order status changed"
      And the collection order summary should show "Collection Order"

    @R1B @JIRA-EPIC:PO-1675 @JIRA-TEST-KEY:PO-5356
    Scenario: Cancel without making a selection returns to the Enforcement tab (company account)
      And I open the Change Collection Order status form
      And I cancel the Change Collection Order status form without making changes
      Then I should return to the Enforcement tab

    @R1B @JIRA-EPIC:PO-1675 @JIRA-TEST-KEY:PO-5357
    Scenario: Cancel after selecting a value shows a route guard (company account)
      And I open the Change Collection Order status form
      And I select "Yes" for Collection Order status
      And I cancel the Change Collection Order status form and choose to stay
      Then I should remain on the Change Collection Order status page
