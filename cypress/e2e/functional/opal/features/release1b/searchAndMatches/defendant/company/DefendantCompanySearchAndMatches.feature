@JIRA-LABEL:account-enquiry
Feature: Defendant Company Search And Matches
  The Companies search form defaults to the expected state and validates
  company defendant searches correctly.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I am on the Account Search page - Individuals form displayed by default

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-712 @JIRA-TEST-KEY:PO-5419
  Scenario: Companies empty submit shows defaults
    #PO-712 - AC2
    When I view the Companies search form
    And I submit an empty company account search
    Then the Companies form shows default empty fields and options

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-712 @JIRA-TEST-KEY:PO-5423
  Scenario: Switching tabs clears Companies data
    #PO-712 - AC6
    When I prepare a Companies search - sample details provided
    And I switch away and back to the Companies form
    Then the Companies form is cleared to defaults

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-712 @JIRA-TEST-KEY:PO-5429 @JIRA-NFR:PO-2549
  Scenario: Error when all 3 sections contain data (Account number, Reference number, Company name)
    # PO-712 - AC5i.
    And I view the Companies search form
    When I search using the following inputs:
      | account number           | 12345678   |
      | reference or case number | REF-123    |
      | company name             | CompanyOne |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, National Insurance number, advanced search"
    And I go back from the problem page
    Then I see the "Search for an account" page for companies with the following details:
      | account number           | 12345678   |
      | reference or case number | REF-123    |
      | company name             | CompanyOne |

  @JIRA-STORY:PO-712
  Scenario Outline: Error when two sections contain data (Companies) Case 1 - <validation_case>
    And I view the Companies search form
    When I search using the following inputs:
      | account number           | <accountNumber> |
      | reference or case number | <reference>     |
      | company name             | <companyName>   |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, National Insurance number, advanced search"
    And I go back from the problem page
    Then I see the "Search for an account" page for companies with the following details:
      | account number           | <accountNumber> |
      | reference or case number | <reference>     |
      | company name             | <companyName>   |
    @R1B @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5430
    Examples: Reference and company name
      | validation_case            | accountNumber | reference | companyName |
      | Reference and company name |               | REF-123   | CompanyOne  |

    @R1B @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5431
    Examples: Account number and reference
      | validation_case              | accountNumber | reference | companyName |
      | Account number and reference | 2345678       | REF-123   |             |

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-707 @JIRA-TEST-KEY:PO-5440
  Scenario: Successful Search For company defendant accounts
    And I view the Companies search form
    When I search using the following inputs:
      | company name | TechCorp Solutions Ltd |
    Then I see the Search results page
    And I select back and confirm
    Then I see the "Search for an account" page for companies with the following details:
      | company name | TechCorp Solutions Ltd |

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-707 @JIRA-TEST-KEY:PO-5453
  Scenario: Verify API call parameters for Company search
    #AC1
    And I view the Companies search form
    When I intercept the "defendant" account search API
    And I search using the following inputs:
      | company name             | CompanyOne      |
      | company name exact match | Yes             |
      | include aliases          | Yes             |
      | address line 1           | 123 Test Street |
      | postcode                 | SW1A 1AA        |
    Then the intercepted "defendant" account search API call will contain the following parameters:
      | organisation_name             | CompanyOne      |
      | exact_match_organisation_name | true            |
      | include_aliases               | true            |
      | address_line_1                | 123 Test Street |
      | postcode                      | SW1A 1AA        |
      | surname                       | null            |
      | exact_match_surname           | null            |
      | forenames                     | null            |
      | exact_match_forenames         | null            |
      | birth_date                    | null            |
      | national_insurance_number     | null            |

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-707 @JIRA-TEST-KEY:PO-5454
  Scenario: Verify API call parameters for Company search with only company name populated
    #AC1
    And I view the Companies search form
    When I intercept the "defendant" account search API
    And I search using the following inputs:
      | company name | CompanyOne |
    Then the intercepted "defendant" account search API call will contain the following parameters:
      | organisation_name             | CompanyOne |
      | exact_match_organisation_name | false      |
      | include_aliases               | false      |
      | address_line_1                | null       |
      | postcode                      | null       |
      | exact_match_surname           | null       |
      | forenames                     | null       |
      | exact_match_forenames         | null       |
      | birth_date                    | null       |
      | national_insurance_number     | null       |

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-707 @JIRA-TEST-KEY:PO-5455
  Scenario: Verify API call parameters for Company search with "Active accounts only" checkbox unchecked
    #AC1
    And I view the Companies search form
    When I intercept the "defendant" account search API
    And I search using the following inputs:
      | company name             | CompanyOne |
      | company name exact match | Yes        |
      | Active accounts only     | Yes        |
    Then the intercepted "defendant" account search API call will contain the following parameters:
      | organisation_name             | CompanyOne |
      | exact_match_organisation_name | true       |
      | include_aliases               | false      |
      | address_line_1                | null       |
      | postcode                      | null       |
      | exact_match_surname           | null       |
      | lastNameExact                 | null       |
      | forenames                     | null       |
      | exact_match_forenames         | null       |
      | birth_date                    | null       |
      | national_insurance_number     | null       |
      | active_accounts_only          | true       |
