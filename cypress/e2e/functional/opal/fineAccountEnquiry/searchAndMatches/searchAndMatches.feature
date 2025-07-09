Feature: Account Search and Matches

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Search For An Account

  @PO-705
  Scenario: Tab switching clears data on selecting new tab
    #PO-705 - AC2 should not trigger any actions when Search button is clicked with no data
    When I click the "Search" button
    Then I see "" in the "Last name" field
    And I see "" in the "First names" field
    And I see "" in the Date of birth field
    And I see "" in the "National Insurance number" field
    And I see "" in the "Address line 1" field
    And I see "" in the "Postcode" field

    #PO-705 - AC7. Tab switching clears data on the Individuals tab
    When I enter "Smith" into the "Last name" field
    And I select the last name exact match checkbox
    And I enter "John" into the "First names" field
    And I select the first names exact match checkbox
    And I select the "Include aliases" checkbox
    And I enter "15/05/1980" into the Date of birth field
    And I enter "AB123456C" into the "National Insurance number" field
    And I enter "123 Test Street" into the "Address line 1" field
    And I enter "SW1A 1AA" into the "Postcode" field

    Then I see "Smith" in the "Last name" field
    And I see "John" in the "First names" field
    And I see "15/05/1980" in the Date of birth field
    And I see "AB123456C" in the "National Insurance number" field
    And I see "123 Test Street" in the "Address line 1" field
    And I see "SW1A 1AA" in the "Postcode" field

    When I click on the "Companies" link
    And I click on the "Individuals" link

    Then I see "" in the "Last name" field
    And I see "" in the "First names" field
    And I see "" in the Date of birth field
    And I see "" in the "National Insurance number" field
    And I see "" in the "Address line 1" field
    And I see "" in the "Postcode" field
    And I verify the last name exact match checkbox is not checked
    And I verify the first names exact match checkbox is not checked
    And I validate the "Include aliases" checkbox is not checked

    And I validate the "Active accounts only" checkbox is checked

  @PO-705
  Scenario: Error navigation when searching with multiple section data
    #PO-705 - AC6. Error when all 3 sections contain data (Account number, Reference number, Individual field)
    When I enter "12345678" into the "Account number" field
    And I enter "REF-123" into the "Reference or case number" field
    And I enter "Smith" into the "Last name" field

    And I click the "Search" button

    Then I see "There is a problem" on the page header
    Then I see "Reference data and account information cannot be entered together when searching for an account. Search using either:" text on the page
    And I see "account number" text on the page
    And I see "reference or case number" text on the page
    And I see "selected tab" text on the page

    #PO-705 - AC6ia. Back button returns to search screen with data intact
    When I click on the "Go back" link

    Then I see "Search for an account" on the page header
    And I see "12345678" in the "Account number" field
    And I see "REF-123" in the "Reference or case number" field
    And I see "Smith" in the "Last name" field

    When I click on the "Companies" link
    And I click on the "Individuals" link

    #PO-705 - AC6a. Error when 2 out of 3 sections contain data - Case 1: Account number + Reference
    When I enter "12345678" into the "Account number" field
    And I enter "REF-123" into the "Reference or case number" field

    And I click the "Search" button

    Then I see "There is a problem" on the page header

    When I click on the "Go back" link
    And I click on the "Companies" link
    And I click on the "Individuals" link

    #PO-705 - AC6a. Error when 2 out of 3 sections contain data - Case 2: Account number + Individual
    When I enter "12345678" into the "Account number" field
    And I enter "Smith" into the "Last name" field

    And I click the "Search" button

    Then I see "There is a problem" on the page header

    When I click on the "Go back" link
    And I click on the "Companies" link
    And I click on the "Individuals" link

    #PO-705 - AC6a. Error when 2 out of 3 sections contain data - Case 3: Reference + Individual
    When I enter "REF-123" into the "Reference or case number" field
    And I enter "Smith" into the "Last name" field

    And I click the "Search" button

    Then I see "There is a problem" on the page header

    When I click on the "Go back" link

    Then I see "Search for an account" on the page header
    And I see "12345678" in the "Account number" field
    And I see "REF-123" in the "Reference or case number" field
    And I see "Smith" in the "Last name" field

  @PO-705
  Scenario: Route guard prevents accidental navigation away from search screen with data
    #PO-705 - AC8. Route guard prevents accidental navigation away from search screen with data
    When I enter "12345678" into the "Account number" field
    And I enter "Smith" into the "Last name" field

    Then I see "12345678" in the "Account number" field
    And I see "Smith" in the "Last name" field

    When I click the browser back button, a window pops up and I click Ok

    Then I am on the dashboard

    When I navigate to Search For An Account

    When I enter "REF-123" into the "Reference or case number" field
    And I enter "John" into the "First names" field

    Then I see "REF-123" in the "Reference or case number" field
    And I see "John" in the "First names" field
    When I click the browser back button, a window pops up and I click Cancel

    Then I see "Search for an account" on the page header
    And I see "REF-123" in the "Reference or case number" field
    And I see "John" in the "First names" field
