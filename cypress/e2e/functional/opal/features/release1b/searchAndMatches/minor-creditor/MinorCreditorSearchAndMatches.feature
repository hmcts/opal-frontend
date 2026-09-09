@JIRA-LABEL:account-enquiry
Feature: Minor Creditor Search And Matches
  The Minor creditors search form defaults to the expected state and validates
  minor creditor searches correctly.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I am on the Account Search page - Individuals form displayed by default

  @JIRA-EPIC:PO-704 @R1BDrop2 @JIRA-STORY:PO-715 @JIRA-TEST-KEY:PO-5420 @JIRA-NFR:PO-2549
  Scenario: Minor creditors Individual validation message on empty submit
    #PO-715 - AC5, AC5a
    When I view the Minor creditors search form
    And I choose minor creditor type "Individual"
    And I submit an empty Minor Creditors account search
    Then the search remains on the Minor creditors form - no navigation
    And I see "Enter minor creditor first name, last name, address or postcode" validation message for a minor creditor "individual"

  @JIRA-EPIC:PO-704 @R1BDrop2 @JIRA-STORY:PO-715 @JIRA-TEST-KEY:PO-5421 @JIRA-NFR:PO-2549
  Scenario: Minor creditors Company validation message on empty submit
    #PO-715 - AC5b
    When I view the Minor creditors search form
    And I switch minor creditor type to "Company"
    And I submit an empty Minor Creditors account search
    Then the search remains on the Minor creditors form - no navigation
    And I see "Enter minor creditor company name or address" validation message for a minor creditor "company"

  @JIRA-EPIC:PO-704 @R1BDrop2 @JIRA-STORY:PO-715 @JIRA-TEST-KEY:PO-5424
  Scenario: Switching tabs clears Minor creditors data (Individual and Company)
    #PO-715 - AC10
    When I prepare a Minor creditors search for type "Individual" - sample details provided
    And I switch away and back to the Minor creditors form
    Then the Minor creditors form is cleared to defaults
    When I prepare a Minor creditors search for type "Company" - sample details provided
    And I switch away and back to the Minor creditors form
    Then the Minor creditors form is cleared to defaults

  @JIRA-EPIC:PO-704 @JIRA-STORY:PO-715
  #- AC5i.
  @R1BDrop2 @JIRA-TEST-KEY:PO-5432
  Scenario: Error when all 3 sections contain data on Minor creditors (Company)
    And I view the Minor Creditors search form
    When I search using the following inputs:
      | minor creditor type      | Company    |
      | account number           | 12345678   |
      | reference or case number | REF-123    |
      | company name             | CompanyOne |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, National Insurance number, advanced search"
    And I go back from the problem page
    Then I see the "Search for an account" page for minor creditors - company with the following details:
      | minor creditor type      | Company    |
      | account number           | 12345678   |
      | reference or case number | REF-123    |
      | company name             | CompanyOne |

  @JIRA-STORY:PO-715
  #-AC9a
  Scenario Outline: Minor creditors - company type error validation with examples - <validation_case>
    And I view the Minor Creditors search form
    When I search using the following inputs:
      | minor creditor type      | Company         |
      | account number           | <accountNumber> |
      | reference or case number | <reference>     |
      | company name             | <companyName>   |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, National Insurance number, advanced search"
    And I go back from the problem page
    Then I see the "Search for an account" page for minor creditors - company with the following details:
      | minor creditor type      | Company         |
      | account number           | <accountNumber> |
      | reference or case number | <reference>     |
      | company name             | <companyName>   |
    @R1BDrop2 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5433
    Examples: Account number, reference, and company name
      | validation_case                             | accountNumber | reference | companyName |
      | Account number, reference, and company name | 12345678      | REF-123   | CompanyOne  |

    @R1BDrop2 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5434
    Examples: Account number and company name
      | validation_case                 | accountNumber | reference | companyName |
      | Account number and company name | 12345678      |           | CompanyOne  |

    @R1BDrop2 @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5435
    Examples: Reference and company name
      | validation_case            | accountNumber | reference | companyName |
      | Reference and company name |               | REF-123   | CompanyOne  |

  @JIRA-EPIC:PO-704 @R1BDrop2 @JIRA-STORY:PO-715 @JIRA-TEST-KEY:PO-5436 @JIRA-NFR:PO-2549
  Scenario: Minor creditors - company type displays validation message when name, address and postcode are missing
    # AC5a
    And I view the Minor Creditors search form
    When I search using the following inputs:
      | minor creditor type | Company |
    Then the search remains on the Minor creditors form - no navigation
    And I see "Enter minor creditor company name or address or postcode" validation message for a minor creditor "company"

  @JIRA-EPIC:PO-704 @JIRA-STORY:PO-715
  # AC8.
  @R1BDrop2 @JIRA-TEST-KEY:PO-5437 @JIRA-NFR:PO-2549
  Scenario: Minor creditors - individual first name only triggers last name required
    And I view the Minor Creditors search form
    When I search using the following inputs:
      | minor creditor type | Individual |
      | first names         | FirstName  |
    Then the search remains on the Minor creditors form - no navigation
    And I see "Enter last name" validation message for a minor creditor "individual"

  @JIRA-EPIC:PO-704 @R1BDrop2 @JIRA-STORY:PO-708 @JIRA-TEST-KEY:PO-5441
  Scenario: Successful Search For Minor Creditor Accounts
    And I view the Minor Creditors search form
    When I search using the following inputs:
      | minor creditor type  | Individual |
      | individual last name | Graham     |
    Then I see the Search results page
    # AC10 Check Back Link Works Correctly
    When I go back from the results page
    Then I see the "Search for an account" page for minor creditors - individual with the following details:
      | minor creditor type  | Individual |
      | individual last name | Graham     |

  @JIRA-EPIC:PO-704 @R1BDrop2 @JIRA-STORY:PO-708 @JIRA-TEST-KEY:PO-5456
  Scenario: Verify API call parameters for Minor Creditor search - Individual
    #AC1
    And I view the Minor Creditors search form
    When I intercept the "minor creditor" account search API
    And I search using the following inputs:
      | minor creditor type  | Individual      |
      | individual last name | LastName        |
      | first names          | FirstName       |
      | address line 1       | 123 Test Street |
      | postcode             | SW1A 1AA        |
    Then the intercepted "minor creditor" account search API call will contain the following parameters:
      | organisation                  | false           |
      | organisation_name             | null            |
      | exact_match_organisation_name | null            |
      | surname                       | LastName        |
      | exact_match_surname           | null            |
      | forenames                     | FirstName       |
      | exact_match_forenames         | null            |
      | address_line_1                | 123 Test Street |
      | postcode                      | SW1A 1AA        |

  @JIRA-EPIC:PO-704 @R1BDrop2 @JIRA-STORY:PO-708 @JIRA-TEST-KEY:PO-5457
  Scenario: Verify API call parameters for Minor Creditor search - Individual with only last name populated
    #AC1
    And I view the Minor Creditors search form
    When I intercept the "minor creditor" account search API
    And I search using the following inputs:
      | minor creditor type  | Individual |
      | individual last name | LastName   |
    Then the intercepted "minor creditor" account search API call will contain the following parameters:
      | forenames                     | null     |
      | surname                       | LastName |
      | address_line_1                | null     |
      | postcode                      | null     |
      | organisation_name             | null     |
      | exact_match_organisation_name | null     |
      | organisation                  | false    |
      | exact_match_surname           | null     |
      | exact_match_forenames         | null     |

  @JIRA-EPIC:PO-704 @R1BDrop2 @JIRA-STORY:PO-708 @JIRA-TEST-KEY:PO-5458
  Scenario: Verify API call parameters for Minor Creditor search - Company
    #AC1
    And I view the Minor Creditors search form
    When I intercept the "minor creditor" account search API
    And I search using the following inputs:
      | minor creditor type | Company         |
      | company name        | CompanyOne      |
      | address line 1      | 123 Test Street |
      | postcode            | SW1A 1AA        |
    Then the intercepted "minor creditor" account search API call will contain the following parameters:
      | forenames                     | null            |
      | surname                       | null            |
      | address_line_1                | 123 Test Street |
      | postcode                      | SW1A 1AA        |
      | organisation_name             | CompanyOne      |
      | exact_match_organisation_name | null            |
      | organisation                  | true            |
      | exact_match_surname           | null            |
      | exact_match_forenames         | null            |
