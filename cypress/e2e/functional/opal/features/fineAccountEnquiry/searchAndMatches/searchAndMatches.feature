Feature: Account Search and Matches
  The Account Search page defaults to the Individuals form and resets to default state
  when switching between account types or submitting without valid criteria.

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I am on the Account Search page - Individuals form displayed by default

  @PO-705
  Scenario: Individuals empty submit shows defaults
    # PO-705 - AC2
    When I submit an empty individual account search
    Then the Individuals form shows default empty fields and options

  @PO-712.
  Scenario: Companies empty submit shows defaults
    #PO-712 - AC2
    When I view the Companies search form
    And I submit an empty company account search
    Then the Companies form shows default empty fields and options

  @PO-715
  Scenario: Minor creditors Individual validation message on empty submit
    #PO-715 - AC5, AC5a
    When I view the Minor creditors search form
    And I choose minor creditor type "Individual"
    And I submit an empty Minor Creditors account search
    Then the search remains on the Minor creditors form - no navigation
    And I see "Enter minor creditor first name, last name, address or postcode" validation message for a minor creditor "individual"

  @PO-715
  Scenario: Minor creditors Company validation message on empty submit
    #PO-715 - AC5b
    When I view the Minor creditors search form
    And I switch minor creditor type to "Company"
    And I submit an empty Minor Creditors account search
    Then the search remains on the Minor creditors form - no navigation
    And I see "Enter minor creditor company name or address" validation message for a minor creditor "company"

  @PO-705
  Scenario: Switching tabs clears Individuals data
    #PO-705 - AC7
    When I prepare an Individuals search - sample details provided
    And I switch away and back to the Individuals form
    Then the Individuals form is cleared to defaults

  @PO-712
  Scenario: Switching tabs clears Companies data
    #PO-712 - AC6
    When I prepare a Companies search - sample details provided
    And I switch away and back to the Companies form
    Then the Companies form is cleared to defaults

  @PO-715
  Scenario: Switching tabs clears Minor creditors data (Individual and Company)
    #PO-715 - AC10
    When I prepare a Minor creditors search for type "Individual" - sample details provided
    And I switch away and back to the Minor creditors form
    Then the Minor creditors form is cleared to defaults
    When I prepare a Minor creditors search for type "Company" - sample details provided
    And I switch away and back to the Minor creditors form
    Then the Minor creditors form is cleared to defaults


  @PO-705
  Scenario: Error when all 3 sections contain data (Account number, Reference number, Individual last name)
    When I search using the following inputs:
      | account number           | 12345678 |
      | reference or case number | REF-123  |
      | individual last name     | Smith    |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, selected tab"

  @PO-705
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

  @PO-705
  Scenario Outline: Error when two sections contain data (Individuals)
    When I search using the following inputs:
      | account number           | <accountNumber> |
      | reference or case number | <reference>     |
      | individual last name     | <lastName>      |
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, selected tab"
    Examples:
      | accountNumber | reference | lastName    |
      | 12345678      | REF-123   |             |
      |               | REF-123   | Smith       |


  @PO-712
  Scenario: Error when all 3 sections contain data (Account number, Reference number, Company name)
    # PO-712 - AC5i.
    And I view the Companies search form
    When I search using the following inputs:
      | account number           | 12345678   |
      | reference or case number | REF-123    |
      | company name             | CompanyOne |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, selected tab"
    And I go back from the problem page
    Then I see the "Search for an account" page for companies with the following details:
      | account number           | 12345678   |
      | reference or case number | REF-123    |
      | company name             | CompanyOne |

  @PO-712
  Scenario Outline: Error when two sections contain data (Companies) Case 1
    And I view the Companies search form
    When I search using the following inputs:
      | account number           | <accountNumber> |
      | reference or case number | <reference>     |
      | company name             | <companyName>   |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, selected tab"
    And I go back from the problem page
    Then I see the "Search for an account" page for companies with the following details:
      | account number           | <accountNumber> |
      | reference or case number | <reference>     |
      | company name             | <companyName>   |
    Examples:
      | accountNumber | reference | companyName     |
      |               | REF-123   | CompanyOne      |
      | 2345678       | REF-123   |                 |

  @PO-715
  #- AC5i.
  Scenario: Error when all 3 sections contain data on Minor creditors (Company)
    And I view the Minor Creditors search form
    When I search using the following inputs:
      | minor creditor type      | Company    |
      | account number           | 12345678   |
      | reference or case number | REF-123    |
      | company name             | CompanyOne |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, selected tab"
    And I go back from the problem page
    Then I see the "Search for an account" page for minor creditors - company with the following details:
      | minor creditor type      | Company    |
      | account number           | 12345678   |
      | reference or case number | REF-123    |
      | company name             | CompanyOne |

  @PO-715
  #-AC9a
  Scenario Outline: Minor creditors - company type error validation with examples
    And I view the Minor Creditors search form
    When I search using the following inputs:
      | minor creditor type      | Company         |
      | account number           | <accountNumber> |
      | reference or case number | <reference>     |
      | company name             | <companyName>   |
    Then I see an page containing "There is a problem"
    And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
    And I see the listed options "account number, reference or case number, selected tab"
    And I go back from the problem page
    Then I see the "Search for an account" page for minor creditors - company with the following details:
      | minor creditor type      | Company         |
      | account number           | <accountNumber> |
      | reference or case number | <reference>     |
      | company name             | <companyName>   |
    Examples:
      | accountNumber | reference | companyName     |
      | 12345678      | REF-123   | CompanyOne      |
      | 12345678      |           | CompanyOne      |
      |               | REF-123   | CompanyOne      |


  Scenario: Minor creditors - company type displays validation message when name, address and postcode are missing
    #-AC9a
    And I view the Minor Creditors search form
    When I search using the following inputs:
      | minor creditor type      | Company  |
      | account number           | 12345678 |
      | reference or case number | REF-123  |
    Then the search remains on the Minor creditors form - no navigation
    And I see "Enter minor creditor company name or address or postcode" validation message for a minor creditor "company"

  @PO-715
  # AC8.
  Scenario: Minor creditors - individual first name only triggers last name required
    And I view the Minor Creditors search form
    When I search using the following inputs:
      | minor creditor type | Individual |
      | first names         | FirstName  |
    Then the search remains on the Minor creditors form - no navigation
    And I see "Enter last name" validation message for a minor creditor "individual"


  @PO-705
  Scenario: Route guard prevents accidental navigation away from search screen with data
    PO-705 - AC8. Route guard prevents accidental navigation away from search screen with data
    When I view the Individuals search form and enter the following:
      | account number       | 12345678 |
      | individual last name | Smith    |
    And I select back with confirmation and verify I navigate to the Dashboard
    When I navigate the Individuals search form and enter the following:
      | account number       | 12345678 |
      | individual last name | Smith    |
    And I select back and cancel
    Then I see the "Search for an account" page for individuals with the following details:
      | account number       | 12345678 |
      | individual last name | Smith    |

  @PO-717
  # AC5. Back Button navigates to Search Page
  Scenario: Successful Search For Individual Defendant Accounts
    When I search using the following inputs:
      | individual last name | Graham |
    Then I see the Search results page
    And I select back and confirm
    Then I see the "Search for an account" page for individuals with the following details:
      | individual last name | Smith |


  @PO-707
  Scenario: Successful Search For company defendant accounts
    And I view the Companies search form
    When I search using the following inputs:
      | company name | TechCorp Solutions Ltd |
    Then I see the Search results page
    And I select back and confirm
    Then I see the "Search for an account" page for companies with the following details:
      | company name | TechCorp Solutions Ltd |


  @PO-708
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


  # PO-706  AC7 Back Button navigates to Search Page
  @PO-706
  Scenario: Search results back button preserves tab state and form data
    When I search using the following inputs:
      | account number | 12345678A |
    Then I see the Search results page
    When I go back from the results page
    Then I see the "Search for an account" page for individuals with the following details:
      | account number | 12345678A |


  # Need to check that intercepted call should be organisation = true (it wasn't originally)
  @PO-706
  Scenario: Verify API call parameters for Defenders and Creditor search using Account number
    # AC1a, AC1b, AC1c
    When I intercept the "account number" account search API
    And I search using the following inputs:
      | account number | 12345678A |
    Then the intercepted "defendant" account search API call will contain the following parameters:
      | defendant                 | null                                                                                                                                                                                |
      | account_number            | 12345678A                                                                                                                                                                           |
      | business_unit_ids         | [107,52,109,130,82,135,47,77,5,65,66,8,97,45,9,10,11,12,60,126,61,110,14,89,26,36,21,22,105,24,78,112,29,139,113,106,28,30,119,31,103,57,124,96,92,38,125,116,128,99,73,129,80,138] |
      | active_accounts_only      | false                                                                                                                                                                               |
      | organisation              | false                                                                                                                                                                               |
      | prosecutor_case_reference | null                                                                                                                                                                                |
    And the intercepted "minor creditor" account search API call will contain the following parameters:
      | account_number       | 12345678A                                                                                                                                                                           |
      | business_unit_ids    | [107,52,109,130,82,135,47,77,5,65,66,8,97,45,9,10,11,12,60,126,61,110,14,89,26,36,21,22,105,24,78,112,29,139,113,106,28,30,119,31,103,57,124,96,92,38,125,116,128,99,73,129,80,138] |
      | active_accounts_only | false                                                                                                                                                                               |
      | creditor             | null                                                                                                                                                                                |


  @PO-709
  Scenario: Verify API call parameters for Defenders and Creditors search using Reference or case number
    # AC1a, AC1b, AC1c
    Given I create a "company" draft account with the following details and set status "Publishing Pending":
      | Account_status                      | Submitted              |
      | account.defendant.company_name      | Test CGI Comp 1{uniq}  |
      | account.defendant.email_address_1   | Accdetailcomp@test.com |
      | account.defendant.post_code         | AB23 4RN               |
      | account.account_type                | Fine                   |
      | account.prosecutor_case_reference   | PCRAUTO008             |
      | account.collection_order_made       | false                  |
      | account.collection_order_made_today | false                  |
      | account.payment_card_request        | false                  |
    And I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending":
      | Account_status                          | Submitted                      |
      | account.defendant.forenames             | John                           |
      | account.defendant.surname               | AccWithComp{uniq}                    |
      | account.defendant.email_address_1       | John.AccDetailSurname{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078259314                    |
      | account.account_type                    | Fine                           |
      | account.prosecutor_case_reference       | PCRAUTO008                     |
      | account.collection_order_made           | false                          |
      | account.collection_order_made_today     | false                          |
      | account.payment_card_request            | false                          |
      | account.defendant.dob                   | 2002-05-15                     |
    When I intercept the "reference" account search API
    And I view the Companies search form
    When I search using the following inputs:
      | reference or case number | PCRAUTO008 |
    #This step verifies that 2 calls are made, one for individuals and one for companies
    #AC6B active accounts only is set to false
    Then the intercepted "defendant" account search API call will contain the following parameters:
      | defendant                 | null                                                                                                                                                                                |
      | account_number            | null                                                                                                                                                                                |
      | business_unit_ids         | [107,52,109,130,82,135,47,77,5,65,66,8,97,45,9,10,11,12,60,126,61,110,14,89,26,36,21,22,105,24,78,112,29,139,113,106,28,30,119,31,103,57,124,96,92,38,125,116,128,99,73,129,80,138] |
      | active_accounts_only      | false                                                                                                                                                                               |
      | organisation              | false                                                                                                                                                                               |
      | prosecutor_case_reference | PCRAUTO008                                                                                                                                                                          |
    #AC5b, AC5c, AC5e, AC5f
    Then I see the Individuals search results:
      | Ref | PCRAUTO008 |
    And I see the Companies search results by tab switch:
      | Ref | PCRAUTO008 |
    #   #AC7: Verify Back navigation behaviour
    When I return to the Companies search page from the results it is displayed with:
      | reference or case number | PCRAUTO008 |


  @PO-709
  Scenario: Verify search works for all reference types
    #AC6
    Given I create a "company" draft account with the following details and set status "Publishing Pending":
      | Account_status                      | Submitted         |
      | account.defendant.company_name      | Test CGI Co{uniq}       |
      | account.defendant.email_address_1   | test@test.com     |
      | account.defendant.post_code         | AB23 4RN          |
      | account.account_type                | Fine              |
      | <reference_field>                   | <reference_value> |
      | account.collection_order_made       | false             |
      | account.collection_order_made_today | false             |
      | account.payment_card_request        | false             |
    And I view the Companies search form
    When I search using the following inputs:
      | reference or case number | <reference_value> |
    And I see the Companies search results:
      | Ref | <reference_value> |
    Examples:
      | reference_type          | reference_field                   | expected_reference_field | reference_value |
      | Case Number             | account.prosecutor_case_reference | case_number              | CN12345         |
      | Police Reference Number | account.prosecutor_case_reference | police_reference_number  | PRN67890        |
      | Crown Court Reference   | account.prosecutor_case_reference | crown_court_reference    | CCR98765        |

  @PO-709
  Scenario: Verify that the Reference or Case Number search only returns exact matches
    #AC6a - Return only exact match
    Given I create a "company" draft account with the following details and set status "Publishing Pending":
      | Account_status                      | Submitted      |
      | account.defendant.company_name      | Test CGI Co A{uniq}  |
      | account.defendant.email_address_1   | testA@test.com |
      | account.defendant.post_code         | AB23 4RN       |
      | account.account_type                | Fine           |
      | account.prosecutor_case_reference   | PCRUNIQ010     |
      | account.collection_order_made       | false          |
      | account.collection_order_made_today | false          |
      | account.payment_card_request        | false          |
    And I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending":
      | Account_status                      | Submitted      |
      | account.defendant.company_name      | Test CGI Co B{uniq}  |
      | account.defendant.email_address_1   | testB@test.com |
      | account.defendant.post_code         | AB23 4RN       |
      | account.account_type                | Fine           |
      | account.prosecutor_case_reference   | PCRUNIQ010A    |
      | account.collection_order_made       | false          |
      | account.collection_order_made_today | false          |
      | account.payment_card_request        | false          |
    When I search using the following inputs:
      | reference or case number | PCRAUTO010 |
    # --- Step 3: Verify results show only exact match ---
    Then I see the Companies search results:
      | Ref | PCRUNIQ010 |
    And I see the Companies search results exclude:
      | Ref | PCRUNIQ010A |


  @PO-709
  Scenario: Verify that 'Check your search' link returns user to Search for an Account screen after no results found
    And I view the Companies search form
    When I search using the following inputs:
      | reference or case number | NOMATCH999 |
    When I see there are no matching results and I check my search
    #AC3b - Returned to search screen with state retained
    Then I see the "Search for an account" page for companies with the following details:
      | reference or case number | NOMATCH999 |


  @PO-717
  Scenario: Verify API call parameters for Individual search
    #AC1
    When I intercept the "defendant" account search API
    And I search using the following inputs:
      | individual last name      | Smith           |
      | first names               | John            |
      | Date of birth             | 15/05/1980      |
      | National Insurance number | AB123456C       |
      | Address line 1            | 123 Test Street |
      | Postcode                  | SW1A 1AA        |
      | Last name exact match     | Yes             |
      | First names exact match   | No              |
      | Include aliases           | Yes             |
    Then the intercepted "defendant" account search API call will contain the following parameters:
      | surname                       | Smith           |
      | exact_match_surname           | true            |
      | forenames                     | John            |
      | exact_match_forenames         | false           |
      | include_aliases               | true            |
      | birth_date                    | 1980-05-15      |
      | national_insurance_number     | AB123456C       |
      | address_line_1                | 123 Test Street |
      | postcode                      | SW1A 1AA        |
      | organisation_name             | null            |
      | exact_match_organisation_name | null            |

  @PO-717
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


  @PO-717
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


  @PO-707
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

  @PO-707
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

  @PO-707
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

  @PO-708
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

  @PO-708
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

  @PO-708
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


  @PO-2075
  Scenario: Data is wiped after navigating to homepage and going back to search page
    When I view the Individuals search form and enter the following:
      | account number            | 12345678        |
      | reference or case number  | 12345           |
      | individual last name      | Smith           |
      | first names               | John            |
      | date of birth             | 15/05/1980      |
      | national insurance number | AB123456C       |
      | address line 1            | 123 Test Street |
      | postcode                  | SW1A 1AA        |
    And I return to the dashboard using the HMCTS link
    When I open Search for an Account
    Then I see the "Search for an account" page for individuals with the following details:
      | account number            |  |
      | reference or case number  |  |
      | individual last name      |  |
      | first names               |  |
      | date of birth             |  |
      | national insurance number |  |
      | address line 1            |  |
      | postcode                  |  |
