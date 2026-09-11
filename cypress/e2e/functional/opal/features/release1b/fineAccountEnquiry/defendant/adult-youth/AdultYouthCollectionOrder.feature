@JIRA-LABEL:account-enquiry
@JIRA-STORY:PO-1848
Feature: Adult Youth Collection Order
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

    @R1BDrop1 @JIRA-EPIC:PO-2219 @JIRA-TEST-KEY:PO-5349
    Scenario: Save Collection Order status for an adult or youth account
      And I open the Change Collection Order status form
      Then I should see the Change Collection Order status page
      And I should see the account identifier "Mr Pearl COLLECTIONORDERADULT{uniqUpper} Change Collection Order Status"
      And I select "Yes" for Collection Order status
      And I submit the Change Collection Order status form
      Then I should return to the Enforcement tab
      And I should see the collection order success banner "Collection Order status changed"
      And the collection order summary should show "Collection Order"

    @R1BDrop1 @JIRA-EPIC:PO-2219 @JIRA-TEST-KEY:PO-5350
    Scenario: Cancel without making a selection returns to the Enforcement tab (adult or youth account)
      And I open the Change Collection Order status form
      And I cancel the Change Collection Order status form without making changes
      Then I should return to the Enforcement tab

    @R1BDrop1 @JIRA-EPIC:PO-2219 @JIRA-TEST-KEY:PO-5351
    Scenario: Cancel after selecting a value shows a route guard (adult or youth account)
      And I open the Change Collection Order status form
      And I select "Yes" for Collection Order status
      And I cancel the Change Collection Order status form and choose to stay
      Then I should remain on the Change Collection Order status page

    @R1BDrop1 @JIRA-STORY:PO-3395 @JIRA-EPIC:PO-2630
    Scenario: AC1, AC3, AC4 - Adult account without a Collection Order displays a permanent warning
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                          | Submitted                    |
        | account.defendant.forenames             | Casey                        |
        | account.defendant.surname               | NoOrderWarning{uniq}         |
        | account.defendant.email_address_1       | Casey.NoOrder{uniq}@test.com |
        | account.defendant.telephone_number_home | 02078259314                  |
        | account.defendant.dob                   | 2001-05-15                   |
        | account.account_type                    | Fine                         |
        | account.prosecutor_case_reference       | PCR-COLLO-{uniqUpper}        |
        | account.collection_order_made           | false                        |
        | account.collection_order_made_today     | false                        |
      When I search for the account by last name "NoOrderWarning{uniq}" and open the latest result
      Then I should be on the FAE account details page
      And I should see the permanent Collection Order warning "Account has no Collection Order."

    @R1BDrop1 @JIRA-STORY:PO-3395 @JIRA-EPIC:PO-2630
    Scenario Outline: AC2, AC3, AC4 - Header API data for youth and Conditional Caution accounts displays the matching permanent warning
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                    | Submitted                     |
        | account.defendant.forenames       | Jordan                        |
        | account.defendant.surname         | CollectionWarning{uniq}       |
        | account.defendant.email_address_1 | Jordan.Warning{uniq}@test.com |
        | account.account_type              | Fine                          |
        | account.collection_order_made     | false                         |
      And I stub the defendant header summary for the "<account type>" Collection Order warning scenario
      When I search for the account by last name "CollectionWarning{uniq}" and open the latest result
      Then I should be on the FAE account details page
      And I should see the permanent Collection Order warning "<warning>"

      Examples:
        | account type        | warning                                                              |
        | Youth               | Account has a Collection Order but is a youth account.               |
        | Conditional Caution | Account has a Collection Order but is a conditional caution account. |
