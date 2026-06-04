@JIRA-LABEL:account-enquiry
@JIRA-NFR:PO-2322
Feature: Account Enquiries - View Account Details Accessibility

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I clear all approved accounts


  @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5466
  Scenario: Check Account Details View Accessibility with Axe-Core for Individual Account
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
    When I search for the account by last name "AccDetailSurname{uniq}"
    ## Check Accessibility on Search Results Page
    Then I check the page for accessibility
    And I select the latest published account and verify the header is "Mr John ACCDETAILSURNAME{uniqUpper}"
    And I go to the Defendant details section and the header is "Defendant details"
    And I should see the convert to company account action
    ## Check Accessibility on Defendant Details Page
    Then I check the page for accessibility
    When I start converting the account to a company account
    Then I should see the convert to company confirmation screen for defendant "Mr John ACCDETAILSURNAME{uniqUpper}"
    And I check the page for accessibility


  @JIRA-EPIC:PO-2472 @JIRA-TEST-KEY:PO-5467
  Scenario: Check Account Details View Accessibility with Axe-Core for Company Account
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted                    |
      | account.defendant.company_name      | Accdetail comp{uniq}         |
      | account.defendant.email_address_1   | Accdetailcomp{uniq}@test.com |
      | account.defendant.post_code         | AB23 4RN                     |
      | account.account_type                | Fine                         |
      | account.prosecutor_case_reference   | PCR-AUTO-003                 |
      | account.collection_order_made       | false                        |
      | account.collection_order_made_today | false                        |
      | account.payment_card_request        | false                        |
    When I search for the account by company name "Accdetail comp{uniq}"
    # Check Accessibility on Company Search Results Page
    Then I check the page for accessibility
    # Check Accessibility on Company Defendant Details Page
    And I select the latest published account and verify the header is "Accdetail comp{uniqUpper}"
    And I go to the Defendant details section and the header is "Company details"
    And I should see the convert to individual account action
    And I should not see the convert to company account text
    Then I check the page for accessibility
    When I start converting the account to an individual account
    Then I should see the convert to individual confirmation screen for company "Accdetail comp{uniq}"
    And I check the page for accessibility

  Rule: Minor creditor amend accessibility
    Background:
      Given a published account exists with an individual minor creditor:
        | prosecutor case reference | PCRMINA11Y{uniqUpper} |
        | title                     | Mr                    |
        | first name                | Access                |
        | last name                 | Minor{uniq}           |
        | address line 1            | 1 Test Street         |
        | postcode                  | AB1 2CD               |
      And I am on the Account Search page - Individuals form displayed by default
      When I view the Minor creditors search form
      And I search using the following inputs:
        | minor creditor type  | Individual    |
        | individual last name | Minor{uniq}   |
        | first names          | Access        |
        | address line 1       | 1 Test Street |
        | postcode             | AB1 2CD       |
      Then I see the Search results page
      When I open the latest matching result from the search results
      And I go to the Creditor tab

    @JIRA-STORY:PO-1984 @JIRA-EPIC:PO-1285
    Scenario: Amend minor creditor details form and validation summary states are accessible
      When I view the amend minor creditor details form
      # Check accessibility on the amend minor creditor form
      Then I check the page for accessibility
      # Check accessibility when the validation error summary is displayed
      When I attempt to save the amend minor creditor details with first name ""
      Then I should remain on the amend minor creditor details page
      And I should see the minor creditor amend error summary contains "Enter minor creditor’s first name"
      And I check the page for accessibility
