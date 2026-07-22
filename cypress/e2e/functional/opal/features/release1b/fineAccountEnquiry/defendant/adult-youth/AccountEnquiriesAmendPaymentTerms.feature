@JIRA-LABEL:account-enquiry
Feature: Defendant - Adult or youth - Account Enquiries - Amend Payment Terms
  As an Opal user
  I want to amend payment terms after account creation
  So that updates are saved and reflected in account enquiry

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  Rule: Adult or youth account
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                                  | Submitted                 |
        | account.defendant.forenames                     | John                      |
        | account.defendant.surname                       | AmendPayTerms{uniq}       |
        | account.defendant.email_address_1               | john.amend{uniq}@test.com |
        | account.defendant.telephone_number_home         | 02078250001               |
        | account.account_type                            | Fine                      |
        | account.prosecutor_case_reference               | PCR-AUTO-020              |
        | account.collection_order_made                   | false                     |
        | account.collection_order_made_today             | false                     |
        | account.payment_card_request                    | false                     |
        | account.defendant.dob                           | 2002-05-15                |
        | account.offences.0.impositions.0.amount_imposed | 250                       |
        | account.offences.0.impositions.0.amount_paid    | 300                       |
        | account.payment_terms.payment_terms_type_code   | B                         |
        | account.payment_terms.effective_date            | 2025-05-30                |

    @JIRA-EPIC:PO-977 @R1B @JIRA-STORY:PO-1149 @JIRA-TEST-KEY:PO-5303
    Scenario: Save payment terms changes and return to Payment terms tab
      When I search for the account by last name "AmendPayTerms{uniq}" and open the latest result
      And I go to the Payment terms tab
      And I open the amend payment terms form
      And I submit instalments only payment terms with a payment card request
      Then I should return to the Payment terms tab
      And the payment terms summary shows instalments:
        | instalment amount | £45.00          |
        | frequency         | Monthly         |
        | start date        | 15 January 2026 |
      And the payment terms save request should include a payment card request
      And the payment terms last enforcement is cleared

    @JIRA-EPIC:PO-977 @R1B @JIRA-STORY:PO-1149 @JIRA-TEST-KEY:PO-5304
    Scenario: Cancel payment terms amendments returns to Payment terms tab
      When I search for the account by last name "AmendPayTerms{uniq}" and open the latest result
      And I go to the Payment terms tab
      And I open the amend payment terms form
      And I cancel payment terms amendments
      Then I should return to the Payment terms tab
      And the payment terms pay by date is "30 May 2025"
      And the payment terms instalment rows are not shown

