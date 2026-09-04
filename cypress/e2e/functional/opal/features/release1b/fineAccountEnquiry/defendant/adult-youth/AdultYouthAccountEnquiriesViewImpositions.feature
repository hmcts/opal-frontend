@JIRA-LABEL:account-enquiry
Feature: Adult Youth Account Enquiries View Impositions
  As a caseworker
  I want to view the impositions for a defendant account
  So that I can confirm the account's imposed amounts and balances

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  @R1BDrop1 @JIRA-STORY:PO-2079 @JIRA-EPIC:PO-979
  Scenario: Get impositions for a defendant account created with an offence
    Given I create a "ayMultiOffenceMultiImposition" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted                         |
      | account.defendant.forenames         | Morgan                            |
      | account.defendant.surname           | Impositions{uniq}                 |
      | account.defendant.email_address_1   | Morgan.Impositions{uniq}@test.com |
      | account.account_type                | Fine                              |
      | account.prosecutor_case_reference   | PCR-IMPOSITIONS{uniqUpper}        |
      | account.collection_order_made       | false                             |
      | account.collection_order_made_today | false                             |
      | account.payment_card_request        | false                             |
      | account.defendant.dob               | 1998-08-24                        |
      | account.account_sentence_date       | 2025-05-15                        |
      | account.enforcement_court_id        | 770000000001                      |

    When I search for the account by last name "Impositions{uniq}" and open the latest result
    When I go to the Impositions tab
    Then I should return to the Impositions tab
    And I should see the defendant account impositions load with the following values:
      | Date added | Imposition | Creditor     | Imposed   | Paid/Written off | Balance    | Date imposed | Offence                          | Imposed by                |
      | {today}    | FCOST      | DVLA         | £125.00   | £10.00           | -£115.00   | 29 Feb 2024  | Riding a bicycle on a footpath   | Court 777 Camberwell CH09 |
      | {today}    | FO         | Central Fund | £1,250.00 | £10.00           | -£1,240.00 | 29 Feb 2024  | Riding a bicycle on a footpath   | Court 777 Camberwell CH09 |
      | {today}    | FO         | Central Fund | £1,250.00 | £10.00           | -£1,240.00 | 15 May 2025  | Theft from the person of another | Court 777 Camberwell CH09 |
      | {today}    | FVS        | Central Fund | £999.00   | £0.00            | -£999.00   | 15 May 2025  | Theft from the person of another | Court 777 Camberwell CH09 |

