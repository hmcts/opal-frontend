Feature: Account Enquiries – View Account Details
  As a caseworker
  I want to view an account’s details
  So that I can confirm and, when needed, safely discard edits

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I clear all approved accounts

  Rule: Adult or youth account baseline
    Background:
      # AC1 – Account setup
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@hmcts.net":
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

    @PO-1593 @866 @PO-1110 @PO-1127
    Scenario: Defendant edit warning retains changes when I stay on the form
      # AC4 – Route Guard (Cancel and stay)
      And I edit the Defendant details and change the First name to "Test"
      And I attempt to cancel editing and choose Cancel on the confirmation dialog
      Then I should remain on the defendant edit page
      And I should see the First name field still contains "Test"

    @PO-1593 @866 @PO-1110 @PO-1127
    Scenario: Defendant edit warning discards changes when I leave the form
      # AC4 – Route Guard (Cancel and leave)
      And I edit the Defendant details and change the First name to "Test"
      And I attempt to cancel editing and choose OK on the confirmation dialog
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Mr John ACCDETAILSURNAME{uniqUpper}"

    @PO-1593 @866 @PO-1110 @PO-1127
    Scenario: Saving defendant details updates the name and audit trail
      # AC1 – Edit and save changes
      And I edit the Defendant details and change the First name to "Updated"
      And I save the defendant details
      Then I should return to the account details page Defendant tab
      And I should see the defendant name contains "Updated"
      # AC3/4 – Verify via API and store amendment count baseline
      And I verify defendant amendments via API for first name "Updated"

    @PO-1593 @866 @PO-1110 @PO-1127
    Scenario: Saving unchanged defendant details does not create amendments
      # AC3/4 – Verify via API and store amendment count baseline
      And I establish a defendant amendment baseline with first name "Updated"
      # AC4 – Save without making changes (no new amendments created)
      And I edit the Defendant details without making changes
      And I save the defendant details
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Mr Updated ACCDETAILSURNAME{uniqUpper}"
      And I verify no amendments were created via API

  Rule: Company account baseline
    Background:
      # AC1 – Account setup
      Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@hmcts.net":
        | account.defendant.company_name    | Accdetail comp{uniq}         |
        | account.defendant.email_address   | Accdetailcomp{uniq}@test.com |
        | account.defendant.post_code       | AB23 4RN                     |
        | account.prosecutor_case_reference | PCR-AUTO-003                 |
        | account.account_type              | Fine                         |
      # AC2 – Search and view account details
      When I open the company account details for "Accdetail comp{uniq}"
      Then I should see the account header contains "Accdetail comp{uniq}"
      # AC3 – Navigate to Company details
      When I go to the Defendant details section and the header is "Company details"

    @967 @PO-1111 @PO-1128
    Scenario: Company edit warning retains changes when I stay on the form
      # AC4 - Route Guard (stay on edit)
      And I edit the Company details and change the Company name to "Test"
      And I cancel the company edit and choose to stay
      Then I should remain on the company edit page
      And I should see the company name field contains "Test"

    @967 @PO-1111 @PO-1128
    Scenario: Company edit warning discards changes when I leave the form
      # AC4 - Route Guard (discard changes)
      And I edit the Company details and change the Company name to "Test"
      And I discard the company edit changes and expect the header "Accdetail comp{uniq}"
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Accdetail comp{uniq}"

    @967 @PO-1111 @PO-1128
    Scenario: Saving company details updates the organisation name and audit trail
      # AC3 - Edit and save changes
      And I edit the Company details and change the Company name to "Accdetail comp updated{uniq}"
      And I save the company details
      Then I should return to the account details page Defendant tab
      And I should see the company name contains "Accdetail comp updated{uniq}"
      # AC3/4 - Verify via API
      And I verify Company amendments via API for company name "Accdetail comp updated{uniq}"

    @967 @PO-1111 @PO-1128
    Scenario: Saving unchanged company details does not create amendments
      # AC3/4 – Verify via API and store amendment count baseline
      And I establish a company amendment baseline with company name "Accdetail comp updated{uniq}"
      # AC4 – Save without making changes (no new amendments created)
      And I edit the Company details without making changes
      And I save the company details
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Accdetail comp updated{uniq}"
      And I verify no amendments were created via API for company details

  Rule: Non-paying defendant account baseline
    Background:
      # AC1 – Account setup
      Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@hmcts.net":
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

    @PO-2315 @PO-1663
    Scenario: Defendant edit warning retains changes for a non-paying account when I stay
      # AC4 – Route Guard (Cancel and stay)
      And I edit the Defendant details and change the First name to "Test"
      And I attempt to cancel editing and choose Cancel on the confirmation dialog
      Then I should remain on the defendant edit page
      And I should see the First name field still contains "Test"

    @PO-2315 @PO-1663
    Scenario: Defendant edit warning discards changes for a non-paying account when I leave
      # AC4 – Route Guard (Cancel and leave)
      And I edit the Defendant details and change the First name to "Test"
      And I attempt to cancel editing and choose OK on the confirmation dialog
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Miss Jane TESTNONPAYEE{uniqUpper}"

    @PO-2315 @PO-1663
    Scenario: Saving defendant details updates the name and audit trail for a non-paying account
      # AC1 – Edit and save changes
      And I edit the Defendant details and change the First name to "Updated"
      And I save the defendant details
      Then I should return to the account details page Defendant tab
      And I should see the defendant name contains "Updated"
      # AC3/4 – Verify via API and store amendment count baseline
      And I verify defendant amendments via API for first name "Updated"

    @PO-2315 @PO-1663
    Scenario: Saving unchanged defendant details does not create amendments for a non-paying account
      # AC3/4 – Verify via API and store amendment count baseline
      And I establish a defendant amendment baseline with first name "Updated"
      # AC4 – Save without making changes (no new amendments created)
      And I edit the Defendant details without making changes
      And I save the defendant details
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Miss Updated TESTNONPAYEE{uniqUpper}"
      And I verify no amendments were created via API

  Rule: Parent or guardian account baseline
    Background:
      # AC1 – Account setup
      Given I create a "pgToPay" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@hmcts.net":
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

    @PO-1129
    Scenario: Saving parent or guardian details updates the name and audit trail
      # AC1 – Edit and save changes
      And I edit the Parent or guardian details and change the First name to "Updated"
      And I save the parent or guardian details
      Then I should return to the account details page Parent or guardian tab
      And I should see the parent or guardian name contains "Updated"
      # AC3/4 - Verify via API
      And I verify parent or guardian amendments via API for guardian name "Updated"

    @PO-1129
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
