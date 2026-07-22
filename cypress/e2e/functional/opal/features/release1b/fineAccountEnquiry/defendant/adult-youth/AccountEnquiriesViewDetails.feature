@JIRA-LABEL:account-enquiry
Feature: Defendant - Adult or youth - Account Enquiries – View Account Details
  As a caseworker
  I want to view an account’s details
  So that I can confirm and, when needed, safely discard edits

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  Rule: Adult or youth account baseline
    Background:
      # AC1 – Account setup
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                          | Submitted                            |
        | account.defendant.forenames             | John                                 |
        | account.defendant.surname               | AccDetailSurname{uniq}               |
        | account.defendant.email_address_1       | John.AccDetailSurname{uniq}@test.com |
        | account.defendant.telephone_number_home | 02078259314                          |
        | account.account_type                    | Fine                                 |
        | account.prosecutor_case_reference       | PCR-AUTO-002                         |
        | account.collection_order_made           | false                                |
        | account.collection_order_made_today     | false                                |
        | account.payment_card_request            | false                                |
        | account.defendant.dob                   | 2002-05-15                           |
      # AC2 – Search and view account details
      When I search for the account by last name "AccDetailSurname{uniq}" and open the latest result
      Then I should see the page header contains "Mr John ACCDETAILSURNAME{uniqUpper}"
      # AC3 – Navigate to Defendant details
      When I go to the Defendant details section and the header is "Defendant details"
      Then I should see the convert to company account action


    @R1B @JIRA-STORY:PO-1593 @JIRA-STORY:PO-866 @JIRA-STORY:PO-1110 @JIRA-STORY:PO-1127 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5514
    Scenario: Defendant edit warning retains changes when I stay on the form
      # AC4 – Route Guard (Cancel and stay)
      And I edit the Defendant details and change the First name to "Test"
      And I attempt to cancel editing and choose Cancel on the confirmation dialog
      Then I should remain on the defendant edit page
      And I should see the First name field still contains "Test"


    @R1B @JIRA-STORY:PO-1593 @JIRA-STORY:PO-866 @JIRA-STORY:PO-1110 @JIRA-STORY:PO-1127 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5515
    Scenario: Defendant edit warning discards changes when I leave the form
      # AC4 – Route Guard (Cancel and leave)
      And I edit the Defendant details and change the First name to "Test"
      And I attempt to cancel editing and choose OK on the confirmation dialog
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Mr John ACCDETAILSURNAME{uniqUpper}"


    @R1B @JIRA-STORY:PO-1593 @JIRA-STORY:PO-866 @JIRA-STORY:PO-1110 @JIRA-STORY:PO-1127 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5516
    Scenario: Saving defendant details updates the name and audit trail
      # AC1 – Edit and save changes
      And I edit the Defendant details and change the First name to "Updated"
      And I save the defendant details
      Then I should return to the account details page Defendant tab
      And I should see the defendant name contains "Updated"
      # AC3/4 – Verify via API and store amendment count baseline
      And I verify defendant amendments via API for first name "Updated"


    @R1B @JIRA-STORY:PO-1593 @JIRA-STORY:PO-866 @JIRA-STORY:PO-1110 @JIRA-STORY:PO-1127 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5517
    Scenario: Saving unchanged defendant details does not create amendments
      # AC3/4 – Verify via API and store amendment count baseline
      And I establish a defendant amendment baseline with first name "Updated"
      # AC4 – Save without making changes (no new amendments created)
      And I edit the Defendant details without making changes
      And I save the defendant details
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Mr Updated ACCDETAILSURNAME{uniqUpper}"
      And I verify no amendments were created via API

    @R1B @JIRA-EPIC:PO-1970 @JIRA-STORY:PO-1942 @JIRA-STORY:PO-1943 @JIRA-STORY:PO-1953 @JIRA-TEST-KEY:PO-5518
    Scenario: Convert to company saves and shows the converted company account details
      When I start converting the account to a company account
      Then I should see the convert to company confirmation screen for defendant "Mr John ACCDETAILSURNAME{uniqUpper}"
      When I continue converting the account to a company account
      Then I should be on the Company details convert route
      Then the Company details form should be pre-populated with:
        | Primary email address | John.AccDetailSurname{uniq}@test.com |
        | Home telephone number | 02078259314                          |
      When I complete converting the account to a company with company name "Accdetail converted comp{uniq}"
      Then I should return to the account details page Defendant tab
      And I should see the account conversion success message "Converted to a company account."
      When I go to the Defendant details section and the header is "Company details"
      Then I should see the company summary card
      And I should not see the defendant summary card
      And I should see the company name contains "Accdetail converted comp{uniq}"
      And I should see the primary email address contains "John.AccDetailSurname{uniq}@test.com"

    @R1B @JIRA-EPIC:PO-1970 @JIRA-STORY:PO-1943 @JIRA-TEST-KEY:PO-5519
    Scenario: Convert to company confirmation cancel returns to Defendant details with no changes made
      When I start converting the account to a company account
      Then I should see the convert to company confirmation screen for defendant "Mr John ACCDETAILSURNAME{uniqUpper}"
      When I cancel converting the account to a company account
      Then I should return to the account details page Defendant tab
      And I should see the convert to company account action

  Rule: History and notes tab
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                          | Submitted                           |
        | account.defendant.title                 | Ms                                  |
        | account.defendant.forenames             | Harriet                             |
        | account.defendant.surname               | HistoryNotes{uniq}                  |
        | account.defendant.email_address_1       | Harriet.HistoryNotes{uniq}@test.com |
        | account.defendant.telephone_number_home | 02078259314                         |
        | account.account_type                    | Fine                                |
        | account.prosecutor_case_reference       | PCR-AUTO-026                        |
        | account.collection_order_made           | false                               |
        | account.collection_order_made_today     | false                               |
        | account.payment_card_request            | false                               |
        | account.defendant.dob                   | 2002-05-15                          |
      And the History and notes API is stubbed with standard tab data
      When I search for the account by last name "HistoryNotes{uniq}" and open the latest result
      Then I should see the page header contains "Ms Harriet HISTORYNOTES{uniqUpper}"

    @R1B @JIRA-STORY:PO-2635 @JIRA-EPIC:PO-2621
    Scenario: History and notes items load and can be filtered
      When I go to the History and notes tab
      Then I should see the History and notes items load
      When I filter the History and notes results to Notes
      Then I should only see Note items in History and notes

    @R1B @JIRA-STORY:PO-2635 @JIRA-EPIC:PO-2621
    Scenario: History and notes account links open the correct record in a new tab
      When I go to the History and notes tab
      And I open the first History and notes account link in a new tab

