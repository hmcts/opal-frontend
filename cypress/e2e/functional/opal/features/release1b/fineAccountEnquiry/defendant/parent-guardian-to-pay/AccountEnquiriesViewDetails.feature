@JIRA-LABEL:account-enquiry
Feature: Defendant - Parent or guardian to pay - Account Enquiries – View Account Details
  As a caseworker
  I want to view an account’s details
  So that I can confirm and, when needed, safely discard edits

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

  Rule: Youth-only add parent or guardian baseline
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                      | Submitted        |
        | account.defendant.forenames         | Jamie            |
        | account.defendant.surname           | AddPgYouth{uniq} |
        | account.account_type                | Fine             |
        | account.prosecutor_case_reference   | PCR-AUTO-017     |
        | account.collection_order_made       | false            |
        | account.collection_order_made_today | false            |
        | account.payment_card_request        | false            |
        | account.defendant.dob               | 2010-05-15       |
      When I search for the account by last name "AddPgYouth{uniq}" and open the latest result
      Then I should see the page header contains "ADDPGYOUTH{uniqUpper}"
      When I go to the Defendant details section and the header is "Defendant details"
      Then I should see the add parent or guardian details action

    @R1B @JIRA-STORY:PO-1877 @JIRA-EPIC:PO-1875 @JIRA-TEST-KEY:PO-5530
    Scenario: Cancelling add parent or guardian details without changes returns to the Defendant tab
      When I start adding parent or guardian details
      Then I should be on the add parent or guardian details page
      When I cancel adding parent or guardian details without making changes
      Then I should return to the account details page Defendant tab
      And I should see the add parent or guardian details action

    @R1B @JIRA-STORY:PO-1877 @JIRA-EPIC:PO-1875
    Scenario: Discarding entered parent or guardian details clears the add form
      When I start adding parent or guardian details
      Then I should be on the add parent or guardian details page
      When I enter "Jamie" into the parent or guardian first name field
      And I attempt to cancel adding parent or guardian details and choose OK on the confirmation dialog
      Then I should return to the account details page Defendant tab
      And I should see the add parent or guardian details action
      When I start adding parent or guardian details
      Then I should be on the add parent or guardian details page
      And I should see the parent or guardian first name field contains ""

    @R1B @JIRA-STORY:PO-1877 @JIRA-EPIC:PO-1875 @JIRA-TEST-KEY:PO-5531
    Scenario: Add parent or guardian warning keeps entered data and validation errors when I stay on the form
      # AC2a, AC2aii – Cancel with entered data shows a warning and staying keeps the user on the page
      # AC2a, AC2aiii – Existing validation errors remain visible when the cancel warning is dismissed
      When I start adding parent or guardian details
      Then I should be on the add parent or guardian details page
      When I enter "Jamie" into the parent or guardian first name field
      And I attempt to save the parent or guardian add details
      Then I should see the parent or guardian add error summary contains "Enter parent or guardian last name"
      And I should see the parent or guardian add error summary contains "Enter address line 1, typically the building and street"
      When I attempt to cancel adding parent or guardian details and choose Cancel on the confirmation dialog
      Then I should remain on the add parent or guardian details page
      And I should see the parent or guardian first name field contains "Jamie"
      And I should see the parent or guardian add error summary contains "Enter parent or guardian last name"
      And I should see the parent or guardian add error summary contains "Enter address line 1, typically the building and street"

  Rule: Youth-only account with parent or guardian details
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                      | Submitted           |
        | account.defendant.forenames         | Jamie               |
        | account.defendant.surname           | RemovePgYouth{uniq} |
        | account.account_type                | Fine                |
        | account.prosecutor_case_reference   | PCR-AUTO-017        |
        | account.collection_order_made       | false               |
        | account.collection_order_made_today | false               |
        | account.payment_card_request        | false               |
        | account.defendant.dob               | 2010-05-15          |
      When I search for the account by last name "RemovePgYouth{uniq}" and open the latest result
      Then I should see the page header contains "REMOVEPGYOUTH{uniqUpper}"
      When I go to the Defendant details section and the header is "Defendant details"
      Then I should see the add parent or guardian details action
      When I start adding parent or guardian details
      Then I should be on the add parent or guardian details page
      When I enter "Pat" into the parent or guardian first name field
      And I enter "GUARDIANREMOVE{uniqUpper}" into the parent or guardian last name field
      And I enter "1 Removal Street" into the parent or guardian address line 1 field
      And I save the parent or guardian details
      Then I should return to the account details page Parent or guardian tab
      And I should see the remove parent or guardian details action

    @R1B @JIRA-STORY:PO-5749 @JIRA-EPIC:PO-2990
    Scenario: Youth-only account with non-paying parent or guardian shows the remove link
      # AC3 – Existing eligibility rules still show the actions for a non-paying parent or guardian
      # AC4 – The visible actions keep their existing navigation and behaviour
      Then I should see the remove parent or guardian details action
      And I should see the parent or guardian details Change actions

    @R1B @JIRA-STORY:PO-1878 @JIRA-EPIC:PO-1875 @JIRA-TEST-KEY:PO-6355
    Scenario: Cancelling parent or guardian removal keeps the parent or guardian details on the account
      When I start removing parent or guardian details
      Then I should be on the remove parent or guardian details page for "REMOVEPGYOUTH{uniqUpper}"
      When I cancel removing parent or guardian details
      Then I should return to the account details page Parent or guardian tab
      And I should see the parent or guardian name contains "Pat GUARDIANREMOVE{uniqUpper}"
      And I should see the remove parent or guardian details action

    @R1B @JIRA-STORY:PO-1878 @JIRA-EPIC:PO-1875
    Scenario: Confirming parent or guardian removal returns to the Defendant tab with a success message
      When I start removing parent or guardian details
      Then I should be on the remove parent or guardian details page for "REMOVEPGYOUTH{uniqUpper}"
      When I confirm removing parent or guardian details
      Then I should return to the account details page Defendant tab
      And I should see the add parent or guardian details action
      And I should see the account details success message "Parent or guardian details removed"
      And I verify the parent or guardian has been removed via API

  Rule: Parent or guardian account baseline
    Background:
      # AC1 – Account setup
      Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                          | Submitted                     |
        | account.defendant.forenames             | Alex                          |
        | account.defendant.surname               | PgPayEdit{uniq}               |
        | account.defendant.email_address_1       | Alex.PgPayEdit{uniq}@test.com |
        | account.defendant.telephone_number_home | 02078250011                   |
        | account.account_type                    | Fine                          |
        | account.prosecutor_case_reference       | PCR-AUTO-009                  |
        | account.collection_order_made           | false                         |
        | account.collection_order_made_today     | false                         |
        | account.payment_card_request            | false                         |
        | account.defendant.dob                   | 2010-11-10                    |
        | account.defendant.parent_guardian.dob   | 1980-02-15                    |
      # AC2 – Search and view account details
      When I search for the account by last name "PgPayEdit{uniq}" and open the latest result
      Then I should see the page header contains "Alex PGPAYEDIT{uniqUpper}"
      # AC3 – Navigate to Parent or guardian details
      When I go to the Parent or guardian details section and the header is "Parent or guardian details"

    @R1B @JIRA-STORY:PO-2671 @JIRA-EPIC:PO-8248
    Scenario Outline: AC3a-AC3e Parent or guardian tab Change links open the correct amend screens
      # AC3a – the heading Change link is removed
      # AC3b – section Change links are shown for Parent or guardian details, Contact details, and Employer details
      When I open the "<section>" Change link on the Parent or guardian tab
      Then I should be on the "parentGuardian" amend route with fragment "<fragment>"

      Examples:
        | section                    | fragment           |
        | Parent or guardian details | party-details      |
        | Contact details            | contact-details    |
        | Employer details           | employment-details |

    @JIRA-EPIC:PO-976 @R1B @JIRA-STORY:PO-1129 @JIRA-TEST-KEY:PO-5532
    Scenario: Saving parent or guardian details updates the name and audit trail
      # AC1 – Edit and save changes
      And I edit the Parent or guardian details and change the First name to "Updated"
      And I save the parent or guardian details
      Then I should return to the account details page Parent or guardian tab
      And I should see the parent or guardian name contains "Updated"
      # AC3/4 - Verify via API
      And I verify parent or guardian amendments via API for guardian name "Updated"

    @JIRA-EPIC:PO-976 @R1B @JIRA-STORY:PO-1129 @JIRA-TEST-KEY:PO-5533
    Scenario: Saving unchanged parent or guardian details does not create amendments
      # AC3/4 – Verify via API and store amendment count baseline
      And I establish a parent or guardian amendment baseline with first name "Updated"
      # AC4 – Save without making changes (no new amendments created)
      And I edit the Parent or guardian details without making changes
      And I save the parent or guardian details
      Then I should return to the account details page Parent or guardian tab
      # LNAME is set in the original pgToPay account creation
      And I should see the parent or guardian name contains "Updated LNAME"
      And I verify no amendments were created via API for parent or guardian details

  Rule: Youth-only amend parent or guardian baseline
    Background:
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                      | Submitted          |
        | account.defendant.forenames         | Jamie              |
        | account.defendant.surname           | AmendPgYouth{uniq} |
        | account.account_type                | Fine               |
        | account.prosecutor_case_reference   | PCR-AUTO-018       |
        | account.collection_order_made       | false              |
        | account.collection_order_made_today | false              |
        | account.payment_card_request        | false              |
        | account.defendant.dob               | 2010-05-15         |
      When I search for the account by last name "AmendPgYouth{uniq}" and open the latest result
      Then I should see the page header contains "AMENDPGYOUTH{uniqUpper}"
      When I go to the Defendant details section and the header is "Defendant details"
      Then I should see the add parent or guardian details action
      When I start adding parent or guardian details
      Then I should be on the add parent or guardian details page
      When I enter "Pat" into the parent or guardian first name field
      And I enter "GuardianAmend{uniqUpper}" into the parent or guardian last name field
      And I enter "1 Youth Street" into the parent or guardian address line 1 field
      And I save the parent or guardian details
      Then I should return to the account details page Parent or guardian tab
      And I should see the parent or guardian name contains "Pat GUARDIANAMEND{uniqUpper}"

    @R1B @JIRA-STORY:PO-3915 @JIRA-EPIC:PO-1875 @JIRA-TEST-KEY:PO-6356
    Scenario: Cancelling parent or guardian changes without edits returns to the Defendant tab
      When I start changing the non-paying parent or guardian details
      Then I should be on the amend parent or guardian details page
      When I cancel changing parent or guardian details without making changes
      Then I should return to the account details page Defendant tab

    @R1B @JIRA-STORY:PO-3915 @JIRA-EPIC:PO-1875
    Scenario: Discarding entered parent or guardian changes keeps the saved name on the account
      When I go to the Parent or guardian details section and the header is "Parent or guardian details"
      And I start changing the non-paying parent or guardian details
      Then I should be on the amend parent or guardian details page
      When I enter "Updated" into the amend parent or guardian first name field
      And I attempt to cancel changing parent or guardian details and choose OK on the confirmation dialog
      Then I should return to the account details page Defendant tab
      When I go to the Parent or guardian details section and the header is "Parent or guardian details"
      Then I should see the parent or guardian name contains "Pat GUARDIANAMEND{uniqUpper}"

    @R1B @JIRA-STORY:PO-3915 @JIRA-EPIC:PO-1875
    Scenario: Saving parent or guardian changes updates the Parent or guardian tab and audit trail
      When I start changing the non-paying parent or guardian details
      Then I should be on the amend parent or guardian details page
      When I enter "Updated" into the amend parent or guardian first name field
      And I save the parent or guardian details
      Then I should return to the account details page Parent or guardian tab
      And I should see the parent or guardian name contains "Updated GUARDIANAMEND{uniqUpper}"
      And I verify parent or guardian amendments via API for guardian name "Updated"

    @R1B @JIRA-STORY:PO-3915 @JIRA-EPIC:PO-1875 @JIRA-TEST-KEY:PO-6357
    Scenario: Non-paying parent or guardian change warning keeps entered data and validation errors when I stay on the form
      # AC2a, AC2aii – Cancel with entered data warns and staying keeps the user on the page
      # AC2a, AC2aiii – Existing validation errors remain visible when the warning is dismissed
      When I start changing the non-paying parent or guardian details
      Then I should be on the amend parent or guardian details page
      When I enter "Updated" into the amend parent or guardian first name field
      And I enter "" into the parent or guardian last name field
      And I attempt to save the parent or guardian amend details
      Then I should see the parent or guardian amend error summary contains "Enter parent or guardian last name"
      When I attempt to cancel changing parent or guardian details and choose Cancel on the confirmation dialog
      Then I should remain on the amend parent or guardian details page
      And I should see the amend parent or guardian first name field contains "Updated"
      And I should see the parent or guardian amend error summary contains "Enter parent or guardian last name"
  Rule: Non-paying defendant account baseline
    Background:
      # AC1 – Account setup
      Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | account.defendant.forenames           | Jane               |
        | account.defendant.surname             | TestNonPayee{uniq} |
        | account.defendant.dob                 | 2012-06-15         |
        | account.defendant.parent_guardian.dob | 1980-02-15         |
        | account.prosecutor_case_reference     | PCR-AUTO-004       |
      # AC2 – Search and view account details
      When I search for the account by last name "TestNonPayee{uniq}" and open the latest result
      Then I should see the page header contains "Miss Jane TESTNONPAYEE{uniqUpper}"
      # AC3 – Navigate to Defendant details
      When I go to the Defendant details section and the header is "Defendant details"
      Then I should not see the convert to company account action


    @R1B @JIRA-STORY:PO-2315 @JIRA-STORY:PO-1663 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5526
    Scenario: Defendant edit warning retains changes for a non-paying account when I stay
      # AC4 – Route Guard (Cancel and stay)
      And I edit the Defendant details and change the First name to "Test"
      And I attempt to cancel editing and choose Cancel on the confirmation dialog
      Then I should remain on the defendant edit page
      And I should see the First name field still contains "Test"


    @R1B @JIRA-STORY:PO-2315 @JIRA-STORY:PO-1663 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5527
    Scenario: Defendant edit warning discards changes for a non-paying account when I leave
      # AC4 – Route Guard (Cancel and leave)
      And I edit the Defendant details and change the First name to "Test"
      And I attempt to cancel editing and choose OK on the confirmation dialog
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Miss Jane TESTNONPAYEE{uniqUpper}"


    @R1B @JIRA-STORY:PO-2315 @JIRA-STORY:PO-1663 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5528
    Scenario: Saving defendant details updates the name and audit trail for a non-paying account
      # AC1 – Edit and save changes
      And I edit the Defendant details and change the First name to "Updated"
      And I save the defendant details
      Then I should return to the account details page Defendant tab
      And I should see the defendant name contains "Updated"
      # AC3/4 – Verify via API and store amendment count baseline
      And I verify defendant amendments via API for first name "Updated"


    @R1B @JIRA-STORY:PO-2315 @JIRA-STORY:PO-1663 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5529
    Scenario: Saving unchanged defendant details does not create amendments for a non-paying account
      # AC3/4 – Verify via API and store amendment count baseline
      And I establish a defendant amendment baseline with first name "Updated"
      # AC4 – Save without making changes (no new amendments created)
      And I edit the Defendant details without making changes
      And I save the defendant details
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Miss Updated TESTNONPAYEE{uniqUpper}"
      And I verify no amendments were created via API

    @R1B @JIRA-STORY:PO-5749 @JIRA-EPIC:PO-2990
    Scenario Outline: Restricted account statuses hide Parent or guardian actions on the summary tab
      Given I stub the defendant header summary account status code to "<status>"
      And I create a "pgToPay" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | Account_status                          | Submitted                           |
        | account.defendant.forenames             | Alex                                |
        | account.defendant.surname               | PgPayRestricted{uniq}               |
        | account.defendant.email_address_1       | Alex.PgPayRestricted{uniq}@test.com |
        | account.defendant.telephone_number_home | 02078250011                         |
        | account.account_type                    | Fine                                |
        | account.prosecutor_case_reference       | PCR-AUTO-028                        |
        | account.collection_order_made           | false                               |
        | account.collection_order_made_today     | false                               |
        | account.payment_card_request            | false                               |
        | account.defendant.dob                   | 2010-11-10                          |
        | account.defendant.parent_guardian.dob   | 1980-02-15                          |
      When I search for the account by last name "PgPayRestricted{uniq}" and verify the page header is "Alex PGPAYRESTRICTED{uniqUpper}"
      And I go to the Parent or guardian details section and the header is "Parent or guardian details"
      # AC2 – Change actions are hidden for restricted account statuses
      Then I do not see any parent or guardian details Change actions
      # AC1 – Remove parent or guardian details is hidden for restricted account statuses
      And I do not see the remove parent or guardian details action

      Examples:
        | status |
        | CS     |
        | WO     |
        | TA     |
        | TS     |
        | TO     |
