@JIRA-LABEL:account-enquiry
Feature: Defendant - Company - Account Enquiries – View Account Details
  As a caseworker
  I want to view an account’s details
  So that I can confirm and, when needed, safely discard edits

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts

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


    @R1B @JIRA-STORY:PO-967 @JIRA-STORY:PO-1111 @JIRA-STORY:PO-1128 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5520
    Scenario: Company edit warning retains changes when I stay on the form
      # AC4 - Route Guard (stay on edit)
      And I edit the Company details and change the Company name to "Test"
      And I cancel the company edit and choose to stay
      Then I should remain on the company edit page
      And I should see the company name field contains "Test"


    @R1B @JIRA-STORY:PO-967 @JIRA-STORY:PO-1111 @JIRA-STORY:PO-1128 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5521
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


    @R1B @JIRA-STORY:PO-967 @JIRA-STORY:PO-1111 @JIRA-STORY:PO-1128 @JIRA-EPIC:PO-812 @JIRA-TEST-KEY:PO-5523
    Scenario: Saving unchanged company details does not create amendments
      # AC3/4 – Verify via API and store amendment count baseline
      And I establish a company amendment baseline with company name "Accdetail comp updated{uniq}"
      # AC4 – Save without making changes (no new amendments created)
      And I edit the Company details without making changes
      And I save the company details
      Then I should return to the account details page Defendant tab
      And I should see the account header contains "Accdetail comp updated{uniq}"
      And I verify no amendments were created via API for company details

    @R1B @JIRA-EPIC:PO-1970 @JIRA-STORY:PO-1955 @JIRA-STORY:PO-1956 @JIRA-STORY:PO-1957 @JIRA-TEST-KEY:PO-5524
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

    @R1B @JIRA-EPIC:PO-1970 @JIRA-STORY:PO-1955 @JIRA-STORY:PO-1956 @JIRA-STORY:PO-1957 @JIRA-TEST-KEY:PO-5525
    Scenario: Convert to individual confirmation cancel returns to Defendant details with no changes made
      When I start converting the account to an individual account
      Then I should see the convert to individual confirmation screen for company "Accdetail comp{uniq}"
      When I cancel converting the account to an individual account
      Then I should return to the account details page Defendant tab
      And I should see the convert to individual account action
      And I should not see the convert to company account text

