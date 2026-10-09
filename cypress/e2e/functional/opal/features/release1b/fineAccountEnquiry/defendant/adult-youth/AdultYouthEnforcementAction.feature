@JIRA-LABEL:account-enquiry
Feature: Adult Youth Enforcement Action
  As an Opal user
  I want to add an enforcement action from account enquiry
  So that court autocomplete options are available for enforcement actions

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  Rule: Adult or youth account
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                          | Submitted                   |
        | account.defendant.forenames             | Frank                       |
        | account.defendant.surname               | AddEnfAction{uniq}          |
        | account.defendant.email_address_1       | Frank.action{uniq}@test.com |
        | account.defendant.telephone_number_home | 02078259316                 |
        | account.account_type                    | Fine                        |
        | account.prosecutor_case_reference       | PCR-AUTO-021                |
        | account.collection_order_made           | false                       |
        | account.collection_order_made_today     | false                       |
        | account.payment_card_request            | false                       |
        | account.defendant.dob                   | 2002-05-15                  |

      When the Enforcement tab is displayed for defendant account with last name "AddEnfAction{uniq}"

    @JIRA-STORY:PO-10902
    Scenario: Court options are available when adding a SUMM enforcement action
      And the add enforcement action form is displayed
      And the enforcement action is "SUMM"
      And I continue to the confirm enforcement action page
      Then the Court code autocomplete should be displayed
      When I search the Court code options for "ATCM"
      And the Court code options should use the Court name (court code) format
      And I select the first filtered Court code option
      Then the selected Court code should be displayed
      And I enter "QA test" for the enforcement action reason
      And the prison detention option is "Prison"
      When I submit the enforcement action and capture the request
      Then the submitted enforcement action should contain the selected Court code
