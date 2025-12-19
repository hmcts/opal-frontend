Feature: Add Account Note - View Defendant Account Details
  # This feature file contains tests for adding an account note in the View Defendant Account Details section #
  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I clear all approved accounts

  @PO-771 @807
  Scenario: As a user I can add defendant account note
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
    # (AC4) Add a valid note
    When I open the Add account note screen and verify the header is Add account note
    And I enter "Valid test account note" into the notes field and save the note
    Then I should see the header "Mr James GRAHAMADDNOTESURNAME" and the URL should contain "details"

    # (AC5) Cancel button without entering data
    When I open the Add account note screen and verify the header is Add account note
    And I cancel without entering data
    Then I should see the header "Mr James GRAHAMADDNOTESURNAME" and the URL should contain "details"

    # (AC5a) Cancel button after entering data
    When I open the Add account note screen, enter "This is a test account note for validation", and cancel
    And I should see the header containing text "Mr James GRAHAMADDNOTESURNAME"

    # (AC5b) Browser back button after entering data
    When I open the Add account note screen, enter "This is a test account note for back button", and navigate back with confirmation
    Then I should see the header "Mr James GRAHAMADDNOTESURNAME" and the URL should contain "details"

  # @809
  Scenario: As a user I can add the account note for company defendant
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

    # (AC.1) Navigate to Add account note screen
    When I open the Add account note screen and verify the header is Add account note

    #(AC4) valid data
    And I enter "Valid test account note" into the notes field and save the note
    Then the URL should contain "details"

    # #(AC5) Cancel button without entering data
    When I open the Add account note screen and verify the header is Add account note
    And I cancel without entering data
    Then the URL should contain "details"

    #(AC5a) Cancel button after entering data
    When I open the Add account note screen, enter "This is a test account note for validation", and cancel
    And I should see the header containing text "AccNote comp"

    # #(AC5b) Browser back button after entering data
    When I open the Add account note screen, enter "This is a test account note for back button", and navigate back with confirmation
    Then I should see the header "AccNote comp" and the URL should contain "details"
