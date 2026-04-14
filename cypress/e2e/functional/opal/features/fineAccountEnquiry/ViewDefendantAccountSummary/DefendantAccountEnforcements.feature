@JIRA-LABEL:account-enquiry
@JIRA-STORY:PO-1848
Feature: Defendant account enforcement - Collection order
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

    @JIRA-KEY:POT-4702
    Scenario: Save Collection Order status for an adult or youth account
      And I open the Change Collection Order status form
      Then I should see the Change Collection Order status page
      And I should see the account identifier "Mr Pearl COLLECTIONORDERADULT{uniqUpper} Change Collection Order Status"
      And I select "Yes" for Collection Order status
      And I submit the Change Collection Order status form
      Then I should return to the Enforcement tab
      And I should see the collection order success banner "Collection Order status changed"
      And the collection order summary should show "Collection Order"

    @JIRA-KEY:POT-4703
    Scenario: Cancel without making a selection returns to the Enforcement tab
      And I open the Change Collection Order status form
      And I cancel the Change Collection Order status form without making changes
      Then I should return to the Enforcement tab

    @JIRA-KEY:POT-4704
    Scenario: Cancel after selecting a value shows a route guard
      And I open the Change Collection Order status form
      And I select "Yes" for Collection Order status
      And I cancel the Change Collection Order status form and choose to stay
      Then I should remain on the Change Collection Order status page

    @JIRA-STORY:PO-1860
  Rule: Adult or youth account with parent or guardian
    Background:
      Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                          | Submitted                             |
        | account.defendant.forenames             | Michael                               |
        | account.defendant.surname               | ParentGuardianSurname{uniq}           |
        | account.defendant.email_address_1       | Michael.ParentGuardian{uniq}@test.com |
        | account.defendant.telephone_number_home | 02078259318                           |
        | account.account_type                    | Fine                                  |
        | account.prosecutor_case_reference       | PCR-AUTO-007                          |
        | account.collection_order_made           | false                                 |
        | account.collection_order_made_today     | false                                 |
        | account.payment_card_request            | false                                 |
        | account.defendant.dob                   | 2010-05-15                            |
      When I search for the account by last name "ParentGuardianSurname{uniq}" and verify the page header is "Miss Michael PARENTGUARDIANSURNAME{uniqUpper}"
      And I go to the Enforcement tab

    @JIRA-KEY:POT-4705
    Scenario: Save Collection Order status for an account with parent or guardian details
      And I open the Change Collection Order status form
      Then I should see the Change Collection Order status page
      And I should see the account identifier "Miss Michael PARENTGUARDIANSURNAME{uniqUpper} Change Collection Order Status"
      And I select "Yes" for Collection Order status
      And I submit the Change Collection Order status form
      Then I should return to the Enforcement tab
      And I should see the collection order success banner "Collection Order status changed"
      And the collection order summary should show "Collection Order"

    @JIRA-KEY:POT-4706
    Scenario: Cancel without making a selection returns to the Enforcement tab
      And I open the Change Collection Order status form
      And I cancel the Change Collection Order status form without making changes
      Then I should return to the Enforcement tab

    @JIRA-KEY:POT-4707
    Scenario: Cancel after selecting a value shows a route guard
      And I open the Change Collection Order status form
      And I select "Yes" for Collection Order status
      And I cancel the Change Collection Order status form and choose to stay
      Then I should remain on the Change Collection Order status page


    @JIRA-STORY:PO-1848
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

    @JIRA-KEY:POT-4708
    Scenario: Save Collection Order status for a company account
      And I open the Change Collection Order status form
      Then I should see the Change Collection Order status page
      And I should see the account identifier "Collection Order Company{uniq}"
      And I select "Yes" for Collection Order status
      And I submit the Change Collection Order status form
      Then I should return to the Enforcement tab
      And I should see the collection order success banner "Collection Order status changed"
      And the collection order summary should show "Collection Order"

    @JIRA-KEY:POT-4709
    Scenario: Cancel without making a selection returns to the Enforcement tab
      And I open the Change Collection Order status form
      And I cancel the Change Collection Order status form without making changes
      Then I should return to the Enforcement tab

    @JIRA-KEY:POT-4710
    Scenario: Cancel after selecting a value shows a route guard
      And I open the Change Collection Order status form
      And I select "Yes" for Collection Order status
      And I cancel the Change Collection Order status form and choose to stay
      Then I should remain on the Change Collection Order status page
