@JIRA-LABEL:account-enquiry
@JIRA-STORY:PO-1848
Feature: Defendant - Adult or youth - Defendant account enforcement - Collection order
  As an Opal user
  I want to change Collection Order status from the Enforcement tab
  So that the account reflects the correct enforcement status

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts
  @JIRA-STORY:PO-1846
  Rule: Adult or youth account
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                             |
        | account.defendant.forenames                     | Pearl                                 |
        | account.defendant.surname                       | CollectionOrderAdult{uniq}            |
        | account.defendant.email_address_1               | Pearl.collection.order{uniq}@test.com |
        | account.defendant.telephone_number_home         | 02078250021                           |
        | account.account_type                            | Fine                                  |
        | account.prosecutor_case_reference               | PCR-ENF-ADULT-{uniqUpper}             |
        | account.collection_order_made                   | false                                 |
        | account.collection_order_made_today             | false                                 |
        | account.payment_card_request                    | false                                 |
        | account.defendant.dob                           | 2001-05-15                            |
        | account.payment_terms.enforcements[0].result_id | PRIS                                  |
      When I search for the account by last name "CollectionOrderAdult{uniq}" and open the latest result
      And I go to the Enforcement tab

    @R1B @JIRA-EPIC:PO-2219 @JIRA-TEST-KEY:PO-5349
    Scenario: Save Collection Order status for an adult or youth account
      And I open the Change Collection Order status form
      Then I should see the Change Collection Order status page
      And I should see the account identifier "Mr Pearl COLLECTIONORDERADULT{uniqUpper} Change Collection Order Status"
      And I select "Yes" for Collection Order status
      And I submit the Change Collection Order status form
      Then I should return to the Enforcement tab
      And I should see the collection order success banner "Collection Order status changed"
      And the collection order summary should show "Collection Order"

    @R1B @JIRA-EPIC:PO-2219 @JIRA-TEST-KEY:PO-5350
    Scenario: Cancel without making a selection returns to the Enforcement tab (adult or youth account)
      And I open the Change Collection Order status form
      And I cancel the Change Collection Order status form without making changes
      Then I should return to the Enforcement tab

    @R1B @JIRA-EPIC:PO-2219 @JIRA-TEST-KEY:PO-5351
    Scenario: Cancel after selecting a value shows a route guard (adult or youth account)
      And I open the Change Collection Order status form
      And I select "Yes" for Collection Order status
      And I cancel the Change Collection Order status form and choose to stay
      Then I should remain on the Change Collection Order status page

    @JIRA-STORY:PO-1860
