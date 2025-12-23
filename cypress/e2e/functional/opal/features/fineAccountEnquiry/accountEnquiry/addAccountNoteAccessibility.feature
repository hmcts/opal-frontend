Feature: Add Account Note - View Defendant Account Details Accessibility

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I clear all approved accounts

  Scenario: Check Add Account Note Accessibility with Axe-Core for Individual Account

    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending":
      | Account_status                          | Submitted                           |
      | account.defendant.forenames             | James                               |
      | account.defendant.surname               | GrahamAddNoteSurname                |
      | account.defendant.email_address_1       | James.GrahamAddNoteSurname@test.com |
      | account.defendant.telephone_number_home | 02078259314                         |
      | account.account_type                    | Fine                                |
      | account.prosecutor_case_reference       | PCR-AUTO-002                        |
      | account.collection_order_made           | false                               |
      | account.collection_order_made_today     | false                               |
      | account.payment_card_request            | false                               |
      | account.defendant.dob                   | 2002-05-15                          |
    When I search for the account by last name "GrahamAddNoteSurname" and verify the page header is "Mr James GRAHAMADDNOTESURNAME"

    ## Check Accessibility on Add Account Note Page
    And I open the Add account note screen and verify the header is Add account note
    Then I check the page for accessibility

    ## Check Accessibility with Form Data Entered for Company
    And I enter "Valid test account note for company accessibility testing" into the notes field and save the note
    Then I should see the header "Mr James GRAHAMADDNOTESURNAME" and the URL should contain "details"
    Then I check the page for accessibility

  Scenario: Check Add Account Note Accessibility with Axe-Core for Company Account
    Given I create a "company" draft account with the following details and set status "Publishing Pending":
      | Account_status                      | Submitted             |
      | account.defendant.company_name      | AccNote comp          |
      | account.defendant.email_address_1   | AAccNotecomp@test.com |
      | account.defendant.post_code         | AB23 4RN              |
      | account.account_type                | Fine                  |
      | account.prosecutor_case_reference   | PCR-AUTO-003          |
      | account.collection_order_made       | false                 |
      | account.collection_order_made_today | false                 |
      | account.payment_card_request        | false                 |
    When I open the company account details for "AccNote comp"

    ## Check Accessibility on Add Account Note Page for Company
    When I open the Add account note screen and verify the header is Add account note
    Then I check the page for accessibility

    ## Check Accessibility with Form Data Entered for Company
    And I enter "Valid test account note for company accessibility testing" into the notes field and save the note
    Then I should see the header containing text "AccNote comp"
    And I check the page for accessibility
