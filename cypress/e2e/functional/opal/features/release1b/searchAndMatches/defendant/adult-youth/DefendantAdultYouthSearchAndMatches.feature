@JIRA-LABEL:account-enquiry
Feature: Defendant Adult Youth Search And Matches
  The Individuals search form defaults to the expected state and validates
  adult or youth defendant searches correctly.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I am on the Account Search page - Individuals form displayed by default

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-705 @JIRA-TEST-KEY:PO-5418
  Scenario: Individuals empty submit shows defaults
    # PO-705 - AC2
    When I submit an empty individual account search
    Then the Individuals form shows default empty fields and options

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-705 @JIRA-TEST-KEY:PO-5422
  Scenario: Switching tabs clears Individuals data
    #PO-705 - AC7
    When I prepare an Individuals search - sample details provided
    And I switch away and back to the Individuals form
    Then the Individuals form is cleared to defaults

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-705 @JIRA-TEST-KEY:PO-5425 @JIRA-NFR:PO-2549
  Scenario: Error when all 3 sections contain data (Account number, Reference number, Individual last name)
    When I search using the following inputs:
      | account number           | 12345678 |
      | reference or case number | REF-123  |
      | individual last name     | Smith    |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, National Insurance number, advanced search"

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-705 @JIRA-TEST-KEY:PO-5426
  Scenario: Back returns to search with data intact after all-3-fields error
    When I search using the following inputs:
      | account number           | 12345678 |
      | reference or case number | REF-123  |
      | individual last name     | Smith    |
    And I go back from the problem page
    Then I see the "Search for an account" page for individuals with the following details:
      | account number           | 12345678 |
      | reference or case number | REF-123  |
      | individual last name     | Smith    |

  @JIRA-STORY:PO-705
  Scenario Outline: Error when two sections contain data (Individuals) - <validation_case>
    When I search using the following inputs:
      | account number           | <accountNumber> |
      | reference or case number | <reference>     |
      | individual last name     | <lastName>      |
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, National Insurance number, advanced search"
    @R1B @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5427
    Examples: Account number and reference
      | validation_case              | accountNumber | reference | lastName |
      | Account number and reference | 12345678      | REF-123   |          |

    @R1B @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5428
    Examples: Reference and last name
      | validation_case         | accountNumber | reference | lastName |
      | Reference and last name |               | REF-123   | Smith    |

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-705 @JIRA-TEST-KEY:PO-5438
  Scenario: Route guard prevents accidental navigation away from search screen with data
    # AC8. Cancelling browser Back keeps the user on Search for an account with entered data retained
    When I view the Individuals search form and enter the following:
      | account number       | 12345678 |
      | individual last name | Smith    |
    And I attempt to navigate away using the HMCTS link and cancel
    Then I see the "Search for an account" page for individuals with the following details:
      | account number       | 12345678 |
      | individual last name | Smith    |

  @JIRA-EPIC:PO-704 @JIRA-STORY:PO-717
  # AC5. Back Button navigates to Search Page
  @R1B @JIRA-TEST-KEY:PO-5439
  Scenario: Successful Search For Individual Defendant Accounts
    When I search using the following inputs:
      | individual last name | Graham |
    Then I see the Search results page
    And I select back and confirm
    Then I see the "Search for an account" page for individuals with the following details:
      | individual last name | Smith |

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-717 @JIRA-TEST-KEY:PO-5450
  Scenario: Verify API call parameters for Individual search
    #AC1
    When I intercept the "defendant" account search API
    And I search using the following inputs:
      | individual last name    | Smith           |
      | first names             | John            |
      | Date of birth           | 15/05/1980      |
      | Address line 1          | 123 Test Street |
      | Postcode                | SW1A 1AA        |
      | Last name exact match   | Yes             |
      | First names exact match | No              |
      | Include aliases         | Yes             |
    Then the intercepted "defendant" account search API call will contain the following parameters:
      | surname                       | Smith           |
      | exact_match_surname           | true            |
      | forenames                     | John            |
      | exact_match_forenames         | false           |
      | include_aliases               | true            |
      | birth_date                    | 1980-05-15      |
      | address_line_1                | 123 Test Street |
      | postcode                      | SW1A 1AA        |
      | organisation_name             | null            |
      | exact_match_organisation_name | null            |

  @JIRA-EPIC:PO-2630 @JIRA-STORY:PO-2953 @R1B @JIRA-TEST-KEY:PO-10016
  Scenario: Verify National Insurance search cannot be combined with account number
    #AC6, AC9, AC9a
    When I search using the following inputs:
      | account number            | 12345678  |
      | National Insurance number | AB123456C |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, National Insurance number, advanced search"
    And I go back from the problem page
    Then I see the "Search for an account" page for individuals with the following details:
      | account number            | 12345678  |
      | National Insurance number | AB123456C |

  @JIRA-STORY:PO-2953 @JIRA-EPIC:PO-2630 @R1B @JIRA-TEST-KEY:PO-10017
  Scenario: Verify National Insurance search cannot be combined with reference or case number
    # AC6, AC9
    When I search using the following inputs:
      | reference or case number  | REF123    |
      | National Insurance number | AB123456C |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, National Insurance number, advanced search"

  @JIRA-STORY:PO-2953 @JIRA-EPIC:PO-2630 @R1B @JIRA-TEST-KEY:PO-10018
  Scenario: Verify National Insurance search cannot be combined with individual search fields
    #AC6, AC9
    When I search using the following inputs:
      | National Insurance number | AB123456C |
      | individual last name      | Smith     |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, National Insurance number, advanced search"

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-717 @JIRA-TEST-KEY:PO-5451
  Scenario: Verify API call parameters for Individual search with only last name populated
    #AC1
    When I intercept the "defendant" account search API
    And I search using the following inputs:
      | individual last name | Smith |
    Then the intercepted "defendant" account search API call will contain the following parameters:
      | surname                       | Smith |
      | exact_match_surname           | false |
      | forenames                     | null  |
      | exact_match_forenames         | false |
      | include_aliases               | false |
      | birth_date                    | null  |
      | national_insurance_number     | null  |
      | address_line_1                | null  |
      | postcode                      | null  |
      | organisation_name             | null  |
      | exact_match_organisation_name | null  |

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-717 @JIRA-TEST-KEY:PO-5452
  Scenario: Verify API call parameters for Individual search with "Active accounts only" checkbox unchecked
    #AC1
    When I intercept the "defendant" account search API
    And I search using the following inputs:
      | individual last name | Smith |
      | Active accounts only | No    |
    Then the intercepted "defendant" account search API call will contain the following parameters:
      | surname                       | Smith |
      | exact_match_surname           | false |
      | forenames                     | null  |
      | exact_match_forenames         | false |
      | include_aliases               | false |
      | birth_date                    | null  |
      | national_insurance_number     | null  |
      | address_line_1                | null  |
      | postcode                      | null  |
      | organisation_name             | null  |
      | exact_match_organisation_name | null  |
      | active_accounts_only          | false |
