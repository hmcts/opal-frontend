@JIRA-LABEL:account-enquiry
Feature: Account Enquiries – View Account Details
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


    @JIRA-STORY:PO-1593 @JIRA-STORY:PO-866 @JIRA-STORY:PO-1110 @JIRA-STORY:PO-1127 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5514
    Scenario: Defendant edit warning retains changes when I stay on the form
      # AC4 – Route Guard (Cancel and stay)
      And I edit the Defendant details and change the First name to "Test"
      And I attempt to cancel editing and choose Cancel on the confirmation dialog
      Then I should remain on the defendant edit page
      And I should see the First name field still contains "Test"


    @JIRA-STORY:PO-1593 @JIRA-STORY:PO-866 @JIRA-STORY:PO-1110 @JIRA-STORY:PO-1127 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5515
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


    @JIRA-STORY:PO-1593 @JIRA-STORY:PO-866 @JIRA-STORY:PO-1110 @JIRA-STORY:PO-1127 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5517
    Scenario: Saving unchanged defendant details does not create amendments
      # AC3/4 – Verify via API and store amendment count baseline
      And I establish a defendant amendment baseline with first name "Updated"
      # AC4 – Save without making changes (no new amendments created)
      And I edit the Defendant details without making changes
      And I save the defendant details
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Mr Updated ACCDETAILSURNAME{uniqUpper}"
      And I verify no amendments were created via API

    @JIRA-EPIC:PO-1970 @JIRA-STORY:PO-1942 @JIRA-STORY:PO-1943 @JIRA-STORY:PO-1953 @JIRA-TEST-KEY:PO-5518
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

    @JIRA-EPIC:PO-1970 @JIRA-STORY:PO-1943 @JIRA-TEST-KEY:PO-5519
    Scenario: Convert to company confirmation cancel returns to Defendant details with no changes made
      When I start converting the account to a company account
      Then I should see the convert to company confirmation screen for defendant "Mr John ACCDETAILSURNAME{uniqUpper}"
      When I cancel converting the account to a company account
      Then I should return to the account details page Defendant tab
      And I should see the convert to company account action

  Rule: Company account baseline
    Background:
      # AC1 – Account setup
      Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
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
      Then I should see the convert to individual account action
      And I should not see the convert to company account text


    @JIRA-STORY:PO-967 @JIRA-STORY:PO-1111 @JIRA-STORY:PO-1128 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5520
    Scenario: Company edit warning retains changes when I stay on the form
      # AC4 - Route Guard (stay on edit)
      And I edit the Company details and change the Company name to "Test"
      And I cancel the company edit and choose to stay
      Then I should remain on the company edit page
      And I should see the company name field contains "Test"


    @JIRA-STORY:PO-967 @JIRA-STORY:PO-1111 @JIRA-STORY:PO-1128 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5521
    Scenario: Company edit warning discards changes when I leave the form
      # AC4 - Route Guard (discard changes)
      And I edit the Company details and change the Company name to "Test"
      And I discard the company edit changes and expect the header "Accdetail comp{uniq}"
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Accdetail comp{uniq}"


    @R1B @JIRA-STORY:PO-967 @JIRA-STORY:PO-1111 @JIRA-STORY:PO-1128 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5522
    Scenario: Saving company details updates the organisation name and audit trail
      # AC3 - Edit and save changes
      And I edit the Company details and change the Company name to "Accdetail comp updated{uniq}"
      And I save the company details
      Then I should return to the account details page Defendant tab
      And I should see the company name contains "Accdetail comp updated{uniq}"
      # AC3/4 - Verify via API
      And I verify Company amendments via API for company name "Accdetail comp updated{uniq}"


    @JIRA-STORY:PO-967 @JIRA-STORY:PO-1111 @JIRA-STORY:PO-1128 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5523
    Scenario: Saving unchanged company details does not create amendments
      # AC3/4 – Verify via API and store amendment count baseline
      And I establish a company amendment baseline with company name "Accdetail comp updated{uniq}"
      # AC4 – Save without making changes (no new amendments created)
      And I edit the Company details without making changes
      And I save the company details
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Accdetail comp updated{uniq}"
      And I verify no amendments were created via API for company details

    @JIRA-EPIC:PO-1970 @JIRA-STORY:PO-1955 @JIRA-STORY:PO-1956 @JIRA-STORY:PO-1957 @JIRA-TEST-KEY:PO-5524
    Scenario: Convert to individual saves and shows the converted defendant account details
      When I start converting the account to an individual account
      Then I should see the convert to individual confirmation screen for company "Accdetail comp{uniq}"
      When I continue converting the account to an individual account
      Then I should be on the Defendant details convert route
      And the Defendant details form should be pre-populated with:
        | Postcode              | AB23 4RN       |
        | Primary email address | Test@email.com |
      When I complete converting the account to an individual with title "Miss", first name "Jamie", and last name "Converted{uniq}"
      Then I should return to the account details page Defendant tab
      And I should see the account conversion success message "Converted to an individual account."
      When I go to the Defendant details section and the header is "Defendant details"
      Then I should see the defendant summary card
      And I should not see the company summary card
      And I should see the defendant name contains "Jamie"
      And I should see the primary email address contains "Test@email.com"

    @JIRA-EPIC:PO-1970 @JIRA-STORY:PO-1955 @JIRA-STORY:PO-1956 @JIRA-STORY:PO-1957 @JIRA-TEST-KEY:PO-5525
    Scenario: Convert to individual confirmation cancel returns to Defendant details with no changes made
      When I start converting the account to an individual account
      Then I should see the convert to individual confirmation screen for company "Accdetail comp{uniq}"
      When I cancel converting the account to an individual account
      Then I should return to the account details page Defendant tab
      And I should see the convert to individual account action
      And I should not see the convert to company account text

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


    @JIRA-STORY:PO-2315 @JIRA-STORY:PO-1663 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5526
    Scenario: Defendant edit warning retains changes for a non-paying account when I stay
      # AC4 – Route Guard (Cancel and stay)
      And I edit the Defendant details and change the First name to "Test"
      And I attempt to cancel editing and choose Cancel on the confirmation dialog
      Then I should remain on the defendant edit page
      And I should see the First name field still contains "Test"


    @JIRA-STORY:PO-2315 @JIRA-STORY:PO-1663 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5527
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


    @JIRA-STORY:PO-2315 @JIRA-STORY:PO-1663 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5529
    Scenario: Saving unchanged defendant details does not create amendments for a non-paying account
      # AC3/4 – Verify via API and store amendment count baseline
      And I establish a defendant amendment baseline with first name "Updated"
      # AC4 – Save without making changes (no new amendments created)
      And I edit the Defendant details without making changes
      And I save the defendant details
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Miss Updated TESTNONPAYEE{uniqUpper}"
      And I verify no amendments were created via API

  Rule: Minor creditor amend creditor details baseline
    Background:
      Given a published account exists with an individual minor creditor:
        | prosecutor case reference | PCRMINAMEND{uniqUpper} |
        | title                     | Mr                     |
        | first name                | John                   |
        | last name                 | AmendMinor{uniq}       |
        | address line 1            | 1 Test Street          |
        | postcode                  | AB1 2CD                |
      And I am on the Account Search page - Individuals form displayed by default
      When I view the Minor creditors search form
      And I search using the following inputs:
        | minor creditor type  | Individual       |
        | individual last name | AmendMinor{uniq} |
        | first names          | John             |
        | address line 1       | 1 Test Street    |
        | postcode             | AB1 2CD          |
      Then I see the Search results page
      When I open the latest matching result from the search results
      Then I should see the account header contains "Mr John AMENDMINOR{uniqUpper}"
      When I go to the Creditor tab

    @JIRA-STORY:PO-1984 @JIRA-EPIC:PO-1285
    Scenario: Cancelling amend minor creditor details after making changes discards updates and returns to the Creditor tab
      # AC2a – Cancel with unsaved changes shows a warning and confirming discard returns to Creditor with no save
      When I start changing the minor creditor details
      Then I should be on the amend minor creditor details page
      When I enter "Updated" into the amend minor creditor first name field
      And I attempt to cancel changing minor creditor details and choose OK on the confirmation dialog
      Then I should return to the account details page Creditor tab
      And I should see the minor creditor name contains "Mr John AMENDMINOR{uniqUpper}"

    @JIRA-STORY:PO-1984 @JIRA-EPIC:PO-1285
    Scenario: Saving valid amend minor creditor details returns to the Creditor tab and persists the changes
      # AC2b – Save valid changes returns to Creditor and persists updates
      When I start changing the minor creditor details
      Then I should be on the amend minor creditor details page
      When I enter "Updated" into the amend minor creditor first name field
      And I save the minor creditor amend details
      Then I should return to the account details page Creditor tab
      And I should see the minor creditor name contains "Mr Updated AMENDMINOR{uniqUpper}"
      And I verify minor creditor amendments via API for first name "Updated"

    @JIRA-STORY:PO-1984 @JIRA-EPIC:PO-1285
    Scenario: Saving invalid amend minor creditor details keeps me on the form and displays validation errors
      # AC2c – Save invalid changes remains on the same screen and shows relevant errors
      When I start changing the minor creditor details
      Then I should be on the amend minor creditor details page
      When I enter "" into the amend minor creditor first name field
      And I save the minor creditor amend details
      Then I should remain on the amend minor creditor details page
      And I should see the minor creditor amend error summary contains "Enter minor creditor’s first name"

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

    @JIRA-STORY:PO-1877 @JIRA-EPIC:PO-1875 @JIRA-TEST-KEY:PO-5530
    Scenario: Cancelling add parent or guardian details without changes and after confirming discard returns to the Defendant tab
      # AC2 – Cancel with no entered data returns directly to the Defendant tab
      When I start adding parent or guardian details
      Then I should be on the add parent or guardian details page
      When I cancel adding parent or guardian details without making changes
      Then I should return to the account details page Defendant tab
      And I should see the add parent or guardian details action

      When I start adding parent or guardian details
      Then I should be on the add parent or guardian details page
      When I enter "Jamie" into the parent or guardian first name field
      # AC2a, AC2ai – Cancel with entered data shows a warning and confirming discards unsaved changes
      And I attempt to cancel adding parent or guardian details and choose OK on the confirmation dialog
      Then I should return to the account details page Defendant tab
      And I should see the add parent or guardian details action
      When I start adding parent or guardian details
      Then I should be on the add parent or guardian details page
      And I should see the parent or guardian first name field contains ""

    @JIRA-STORY:PO-1877 @JIRA-EPIC:PO-1875 @JIRA-TEST-KEY:PO-5531
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

    @JIRA-STORY:PO-1878 @JIRA-EPIC:PO-1875 @JIRA-TEST-KEY:PO-6355
    Scenario: Cancelling and then confirming removal of a non-paying parent or guardian returns to the correct tabs
      When I start adding parent or guardian details
      Then I should be on the add parent or guardian details page
      When I enter "Pat" into the parent or guardian first name field
      And I enter "GUARDIANREMOVE{uniqUpper}" into the parent or guardian last name field
      And I enter "1 Removal Street" into the parent or guardian address line 1 field
      And I save the parent or guardian details
      Then I should return to the account details page Parent or guardian tab
      And I should see the remove parent or guardian details action
      # AC1a, AC1b – Remove confirmation screen shows the expected title and account identifier
      When I start removing parent or guardian details
      Then I should be on the remove parent or guardian details page for "ADDPGYOUTH{uniqUpper}"
      # AC3, AC3a – No - cancel returns to the Parent or guardian tab without removing the parent/guardian
      When I cancel removing parent or guardian details
      Then I should return to the account details page Parent or guardian tab
      And I should see the parent or guardian name contains "Pat GUARDIANREMOVE{uniqUpper}"
      And I should see the remove parent or guardian details action
      # AC2, AC2a, AC2b, AC2c – Yes - remove deletes the party, returns to Defendant, and shows success
      When I start removing parent or guardian details
      Then I should be on the remove parent or guardian details page for "ADDPGYOUTH{uniqUpper}"
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

    @JIRA-EPIC:PO-976
    @R1B @JIRA-STORY:PO-1129 @JIRA-TEST-KEY:PO-5532
    Scenario: Saving parent or guardian details updates the name and audit trail
      # AC1 – Edit and save changes
      And I edit the Parent or guardian details and change the First name to "Updated"
      And I save the parent or guardian details
      Then I should return to the account details page Parent or guardian tab
      And I should see the parent or guardian name contains "Updated"
      # AC3/4 - Verify via API
      And I verify parent or guardian amendments via API for guardian name "Updated"

    @JIRA-EPIC:PO-976
    @JIRA-STORY:PO-1129 @JIRA-TEST-KEY:PO-5533
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

    @JIRA-STORY:PO-3915 @JIRA-EPIC:PO-1875 @JIRA-TEST-KEY:PO-6356
    Scenario: Non-paying parent or guardian change can be cancelled, discarded, and then saved successfully
      # AC1, AC1a, AC1b – Change opens the reduced parent or guardian details screen with the information banner
      # AC2 – Cancel with no changes returns to the Defendant tab
      When I start changing the non-paying parent or guardian details
      Then I should be on the amend parent or guardian details page
      When I cancel changing parent or guardian details without making changes
      Then I should return to the account details page Defendant tab

      # AC2a, AC2ai – Cancel with entered data warns and confirming discards changes
      When I go to the Parent or guardian details section and the header is "Parent or guardian details"
      And I start changing the non-paying parent or guardian details
      Then I should be on the amend parent or guardian details page
      When I enter "Updated" into the amend parent or guardian first name field
      And I attempt to cancel changing parent or guardian details and choose OK on the confirmation dialog
      Then I should return to the account details page Defendant tab
      When I go to the Parent or guardian details section and the header is "Parent or guardian details"
      Then I should see the parent or guardian name contains "Pat GUARDIANAMEND{uniqUpper}"
      # AC3, AC3a – Saving valid changes returns to the Parent or guardian tab with updated information
      When I start changing the non-paying parent or guardian details
      Then I should be on the amend parent or guardian details page
      When I enter "Updated" into the amend parent or guardian first name field
      And I save the parent or guardian details
      Then I should return to the account details page Parent or guardian tab
      And I should see the parent or guardian name contains "Updated GUARDIANAMEND{uniqUpper}"
      And I verify parent or guardian amendments via API for guardian name "Updated"

    @JIRA-STORY:PO-3915 @JIRA-EPIC:PO-1875 @JIRA-TEST-KEY:PO-6357
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
