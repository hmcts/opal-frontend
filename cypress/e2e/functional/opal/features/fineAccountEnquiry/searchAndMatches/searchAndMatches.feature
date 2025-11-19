Feature: Account Search and Matches
  The Account Search page defaults to the Individuals form and resets to default state
  when switching between account types or submitting without valid criteria.

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    And I am on the Account Search page - Individuals form displayed by default

  @PO-705
  Scenario: Individuals empty submit shows defaults
    #PO-705 - AC2
    When I submit an empty individual account search
    Then the Individuals form shows default empty fields and options

  @PO-712
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
    And I see "Enter minor creditor first name, last name, address or postcode" validation message for a minor creditor individual

  @PO-715
  Scenario: Minor creditors Company validation message on empty submit
    #PO-715 - AC5b
    When I view the Minor creditors search form
    And I switch minor creditor type to "Company"
    And I submit an empty Minor Creditors account search
    Then the search remains on the Minor creditors form - no navigation
    And I see "Enter minor creditor company name or address" validation message for a minor creditor company

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
  Scenario Outline: Error when two sections contain data (Individuals) Case 1
    When I search using the following inputs:
      | account number           | <accountNumber> |
      | reference or case number | <reference>     |
      | individual last name     | <lastName>      |
    Then I see an page containing "There is a problem"
    And I go back from the problem page
    Examples:
      | accountNumber | reference | lastName |
      |               | REF-123   | Smith    |

  Scenario Outline: Error when two sections contain data (Individuals) Case 2
    When I search using the following inputs:
      | account number           | <accountNumber> |
      | reference or case number | <reference>     |
      | individual last name     | <lastName>      |
    Then the search remains on the Search Individuals form - no navigation
    And I see "Reference or case number must only contain letters or numbers" validation message for an individual
    Examples:
      | accountNumber | reference | lastName |
      | 12345678      | REF-123   |          |


# @PO-712
# Scenario: Error when all 3 sections contain data (Account number, Reference number, Company name)
#   # PO-712 - AC5i.
#   And I view the Companies search form
#   When I search using the following inputs:
#     | account number           | 12345678   |
#     | reference or case number | REF-123    |
#     | company name             | CompanyOne |
#   Then I see an page containing "There is a problem"
#   And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
#   And I see the listed options "account number, reference or case number, selected tab"
#   And I go back from the problem page
#   Then I see the "Search for an account" page for companies with the following details:
#     | account number           | 12345678   |
#     | reference or case number | REF-123    |
#     | company name             | CompanyOne |



# @PO-712
# Scenario Outline: Error when two sections contain data (Companies)
#   And I view the Companies search form
#   When I search using the following inputs:
#     | account number  | reference or case number | company name  |
#     | <accountNumber> | <reference>              | <companyName> |
#   Then I see an page containing "There is a problem"
#   And I go back from the problem page
#   Examples:
#     | accountNumber | reference | companyName |
#     | 12345678      | REF-123   |             |
#     | 12345678      |           | CompanyOne  |
#     |               | REF-123   | CompanyOne  |

# @PO-715
# Scenario: Error when all 3 sections contain data on Minor creditors (Company)
#   And I view the Minor Creditors search form
#   When I search using the following inputs:
#     | account number           | 12345678   |
#     | reference or case number | REF-123    |
#     | minor creditor type      | Company    |
#     | company name             | CompanyOne |
#   Then I see an page containing "There is a problem"
#   And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
#   And I see the listed options "account number, reference or case number, selected tab"
#   And I go back from the problem page
#   Then I see the "Search for an account" page for minor creditors - company with the following details:
#     | minor creditor type      | Company    |
#     | account number           | 12345678   |
#     | reference or case number | REF-123    |
#     | company name             | CompanyOne |

# @PO-715
# Scenario Outline: Minor creditors - two-section errors and data persistence
#   When I search using the following inputs:
#     | account number | reference or case number | minor creditor type | company name |
#     | <accountNumber> | <reference>             | <creditorType>     | <companyName> |
#   And I switch to the "Minor creditors" tab
#   Then I see an error summary containing "There is a problem"
#   And I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
#   And I see the listed options "account number, reference or case number, selected tab"
#   When I choose to go back to the search page
#   Then I see the page header "Search for an account"
#   And the account number field contains "<accountNumber>"
#   And the reference or case number field contains "<reference>"
#   And the company name field contains "<companyName>"
#   And I reload the page

#   Examples:
#     | accountNumber | reference | creditorType | companyName |
#     | 12345678      | REF-123   | Company      | CompanyOne  |
#     | 12345678      | REF-123   |              |             |
#     | 12345678      |           | Company      | CompanyOne  |
#     |               | REF-123   | Company      | CompanyOne  |

# @PO-715
# Scenario: Minor creditors - individual first names only triggers last name required
#   When I search using the following inputs:
#     | minor creditor type | first names |
#     | Individual          | FirstName   |
#   And I switch to the "Minor creditors" tab
#   Then I see an inline validation message "Enter last name"









#   #PO-715 - AC9i. Error when all 3 sections contain data (Account number, Reference number, Company field - minor creditors tab)
#   When I enter "12345678" into the "Account number" field
#   And I enter "REF-123" into the "Reference or case number" field
#   And I click on the "Minor creditors" link
#   And I select the "Company" radio button
#   And I enter "CompanyOne" into the "Company name" field
#   And I click the "Search" button

#   Then I see "There is a problem" text on the page
#   And I see "Reference data and account information cannot be entered together when searching for an account. Search using either:" text on the page
#   And I see "account number" text on the page
#   And I see "reference or case number" text on the page
#   And I see "selected tab" text on the page
#   When I click on the "Go back" link

#   Then I see "Search for an account" on the page header
#   And I see "12345678" in the "Account number" field
#   And I see "REF-123" in the "Reference or case number" field
#   And I see "CompanyOne" in the "Company name" field
#   And I reload the page

#   #PO-715 - AC9a. Error when 2 out of 3 sections contain data - Case 1: Account number + Reference
#   When I enter "12345678" into the "Account number" field
#   And I enter "REF-123" into the "Reference or case number" field
#   And I click on the "Minor creditors" link
#   And I click the "Search" button

#   Then I see "There is a problem" text on the page
#   And I see "Reference data and account information cannot be entered together when searching for an account. Search using either:" text on the page
#   And I see "account number" text on the page
#   And I see "reference or case number" text on the page
#   And I see "selected tab" text on the page
#   When I click on the "Go back" link

#   Then I see "Search for an account" on the page header
#   And I see "12345678" in the "Account number" field
#   And I see "REF-123" in the "Reference or case number" field
#   And I reload the page

#   #PO-715 - AC9a. Error when 2 out of 3 sections contain data - Case 1: Account number + Company name (Minor creditor)
#   When I enter "12345678" into the "Account number" field
#   And I click on the "Minor creditors" link
#   And I select the "Company" radio button
#   And I enter "CompanyOne" into the "Company name" field
#   And I click the "Search" button

#   Then I see "There is a problem" text on the page
#   And I see "Reference data and account information cannot be entered together when searching for an account. Search using either:" text on the page
#   And I see "account number" text on the page
#   And I see "reference or case number" text on the page
#   And I see "selected tab" text on the page
#   When I click on the "Go back" link

#   Then I see "Search for an account" on the page header
#   And I see "12345678" in the "Account number" field
#   And I see "CompanyOne" in the "Company name" field

#   #PO-715 - AC9a. Error when 2 out of 3 sections contain data - Case 1: Account number + Company name (Minor creditor)
#   When I enter "REF-123" into the "Reference or case number" field
#   And I click on the "Minor creditors" link
#   And I select the "Company" radio button
#   And I enter "CompanyOne" into the "Company name" field
#   And I click the "Search" button

#   Then I see "There is a problem" text on the page
#   And I see "Reference data and account information cannot be entered together when searching for an account. Search using either:" text on the page
#   And I see "account number" text on the page
#   And I see "reference or case number" text on the page
#   And I see "selected tab" text on the page
#   When I click on the "Go back" link

#   Then I see "Search for an account" on the page header
#   And I see "REF-123" in the "Reference or case number" field
#   And I see "CompanyOne" in the "Company name" field


#   #PO-715 - AC8. Error when individual contains only the first names field populated when searched
#   And I reload the page
#   When I click on the "Minor creditors" link
#   And I select the "Individual" radio button
#   And I enter "FirstName" into the "First names" field
#   And I click the "Search" button
#   Then I see "Enter last name" text on the page






















# Background:
#   Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#   Then I am on the dashboard
#   When I navigate to Search For An Account



# @PO-705
# Scenario: Route guard prevents accidental navigation away from search screen with data
#   #PO-705 - AC8. Route guard prevents accidental navigation away from search screen with data
#   When I enter "12345678" into the "Account number" field
#   And I enter "Smith" into the "Last name" field

#   Then I see "12345678" in the "Account number" field
#   And I see "Smith" in the "Last name" field

#   When I click the browser back button, a window pops up and I click Ok

#   Then I am on the dashboard

#   When I navigate to Search For An Account

#   When I enter "REF-123" into the "Reference or case number" field
#   And I enter "John" into the "First names" field

#   Then I see "REF-123" in the "Reference or case number" field
#   And I see "John" in the "First names" field
#   When I click the browser back button, a window pops up and I click Cancel

#   Then I see "Search for an account" on the page header
#   And I see "REF-123" in the "Reference or case number" field
#   And I see "John" in the "First names" field

# @PO-717
# Scenario: Successful Search For Individual Defendant Accounts
#   When I enter "Graham" into the "Last name" field
#   And I click the "Search" button

#   # PO-717 - AC5. Back Button navigates to Search Page
#   Then I see "Search results" on the page header

#   When I click on the "Back" link
#   Then I see "Graham" in the "Last name" field
#   Then I see "Individuals" on the page header


# # PO-717 - AC4g. Click on Account Number link and verify navigation to template page - to be completed once API integration is complete - test data needs discussed
# # Handles window.open navigation
# # When I click the "Search" button
# # When I click the "100A" link and handle new window navigation
# # Then I see "Account Details" on the page header


# # PO-707
# @PO-707
# Scenario: Successful Search For company defendant accounts
#   When I click on the "Companies" link
#   And I enter "TechCorp Solutions Ltd" into the "Company name" field
#   And I click the "Search" button

#   # PO-707 - AC5. Back Button navigates to Search Page
#   Then I see "Search results" on the page header

#   When I click on the "Back" link
#   And I see "TechCorp Solutions Ltd" in the "Company name" field
#   Then I see "Companies" on the page header


# # PO-707 - AC4g. Click on Account Number link and verify navigation to template page - to be completed once API integration is complete - test data needs discussed
# # Handles window.open navigation
# # When I click the "Search" button
# # When I click the "555O" link and handle new window navigation
# # Then I see "Account Details" on the page header

# #PO-707 AC3b & AC2b Will be covered once API integration is complete

# # PO-717 AC3b & AC2b Will be covered once API integration is complete

# @PO-708
# Scenario: Successful Search For Minor Creditor Accounts
#   When I click on the "Minor creditors" link
#   When I select the 'Individual' radio button
#   Then I enter "Graham" into the "Last name" field
#   And I click the "Search" button

#   Then I see "Search results" on the page header

#   # AC10 Check Back Link Works Correctly
#   When I click on the "Back" link
#   Then I see "Search for an account" on the page header

# # AC4g. Click on Account Number link and verify navigation to template page - To be fixed once API integration is complete
# # Handles window.open navigation
# # When I click the "Search" button
# # When I click the "100A" link and handle new window navigation
# # Then I see "Account Details" on the page header

# # PO-708 AC3b & AC2b Will be covered once API integration is complete


# # PO-706  AC7 Back Button navigates to Search Page
# @PO-706
# Scenario: Search results back button preserves tab state and form data
#   When I enter "12345678A" into the "Account number" field
#   And I click the "Search" button
#   Then I see "Search results" on the page header
#   When I click on the "Back" link
#   Then I see "12345678A" in the "Account number" field
#   Then I see "Individuals" on the page header


# @PO-706
# Scenario: Verify API call parameters for Defenders and Creditor search using Account number
#   # AC1a, AC1b, AC1c
#   When I enter "12345678A" into the "Account number" field
#   When I intercept the "account number" account search API call
#   And I click the "Search" button
#   Then the intercepted defendant search calls contain expected parameters
#     | defendant                 | null                                                                                                                                                                                |
#     | account_number            | 12345678A                                                                                                                                                                           |
#     | business_unit_ids         | [107,52,109,130,82,135,47,77,5,65,66,8,97,45,9,10,11,12,60,126,61,110,14,89,26,36,21,22,105,24,78,112,29,139,113,106,28,30,119,31,103,57,124,96,92,38,125,116,128,99,73,129,80,138] |
#     | active_accounts_only      | false                                                                                                                                                                               |
#     | organisation              | false                                                                                                                                                                               |
#     | prosecutor_case_reference | null                                                                                                                                                                                |
#   And the intercepted minor creditor search call contains
#     | account_number       | 12345678A                                                                                                                                                                           |
#     | business_unit_ids    | [107,52,109,130,82,135,47,77,5,65,66,8,97,45,9,10,11,12,60,126,61,110,14,89,26,36,21,22,105,24,78,112,29,139,113,106,28,30,119,31,103,57,124,96,92,38,125,116,128,99,73,129,80,138] |
#     | active_accounts_only | false                                                                                                                                                                               |
#     | creditor             | null                                                                                                                                                                                |


# @PO-709
# Scenario: Verify API call parameters for Defenders and Creditors search using Reference or case number
#   # AC1a, AC1b, AC1c
#   And I create a "company" draft account with the following details:
#     | Account_status                      | Submitted              |
#     | account.defendant.company_name      | Test CGI Comp 1        |
#     | account.defendant.email_address_1   | Accdetailcomp@test.com |
#     | account.defendant.post_code         | AB23 4RN               |
#     | account.account_type                | Fine                   |
#     | account.prosecutor_case_reference   | PCRAUTO008             |
#     | account.collection_order_made       | false                  |
#     | account.collection_order_made_today | false                  |
#     | account.payment_card_request        | false                  |
#   When I update the last created draft account with status "Publishing Pending"
#   And the update should succeed and return a new strong ETag
#   And I create a "adultOrYouthOnly" draft account with the following details:
#     | Account_status                          | Submitted                      |
#     | account.defendant.forenames             | John                           |
#     | account.defendant.surname               | AccWithComp                    |
#     | account.defendant.email_address_1       | John.AccDetailSurname@test.com |
#     | account.defendant.telephone_number_home | 02078259314                    |
#     | account.account_type                    | Fine                           |
#     | account.prosecutor_case_reference       | PCRAUTO008                     |
#     | account.collection_order_made           | false                          |
#     | account.collection_order_made_today     | false                          |
#     | account.payment_card_request            | false                          |
#     | account.defendant.dob                   | 2002-05-15                     |
#   When I update the last created draft account with status "Publishing Pending"
#   When I intercept the "reference" account search API call
#   When I enter "PCRAUTO008" into the "Reference or case number" field
#   When I select the "Companies" tab
#   And I click the "Search" button

#   #This step verifies that 2 calls are made, one for individuals and one for companies
#   #AC6B active accounts only is set to false
#   Then the intercepted defendant search calls contain expected parameters
#     | defendant                 | null                                                                                                                                                                                |
#     | account_number            | null                                                                                                                                                                                |
#     | business_unit_ids         | [107,52,109,130,82,135,47,77,5,65,66,8,97,45,9,10,11,12,60,126,61,110,14,89,26,36,21,22,105,24,78,112,29,139,113,106,28,30,119,31,103,57,124,96,92,38,125,116,128,99,73,129,80,138] |
#     | active_accounts_only      | false                                                                                                                                                                               |
#     | organisation              | false                                                                                                                                                                               |
#     | prosecutor_case_reference | PCRAUTO008                                                                                                                                                                          |

#   #AC5b, AC5c, AC5e, AC5f
#   Then I see "Search results" on the page header
#   And I see the "Individuals" tab is selected
#   And I see "PCRAUTO008" is present in column "Ref"
#   When I select the "Companies" tab
#   And I see the "Companies" tab is selected
#   And I see "PCRAUTO008" is present in column "Ref"

#   #AC7: Verify Back navigation behaviour
#   When I click the back button link
#   Then I see "Search for an account" on the page header
#   And I see the "Companies" tab is selected
#   And I see "PCRAUTO008" in the "Reference or case number" field


# @PO-709
# Scenario: Verify search works for all reference types
#   #AC6
#   And I create a "company" draft account with the following details:
#     | Account_status                      | Submitted         |
#     | account.defendant.company_name      | Test CGI Co       |
#     | account.defendant.email_address_1   | test@test.com     |
#     | account.defendant.post_code         | AB23 4RN          |
#     | account.account_type                | Fine              |
#     | <reference_field>                   | <reference_value> |
#     | account.collection_order_made       | false             |
#     | account.collection_order_made_today | false             |
#     | account.payment_card_request        | false             |

#   When I update the last created draft account with status "Publishing Pending"
#   And the update should succeed and return a new strong ETag
#   And I enter "<reference_value>" into the "Reference or case number" field
#   And I click the "Search" button
#   And I see "Search results" on the page header
#   And I see the "Companies" tab is selected
#   And I see "<reference_value>" is present in column "Ref"

#   Examples:
#     | reference_type          | reference_field                   | expected_reference_field | reference_value |
#     | Case Number             | account.prosecutor_case_reference | case_number              | CN12345         |
#     | Police Reference Number | account.prosecutor_case_reference | police_reference_number  | PRN67890        |
#     | Crown Court Reference   | account.prosecutor_case_reference | crown_court_reference    | CCR98765        |

# @PO-709
# Scenario: Verify that the Reference or Case Number search only returns exact matches
#   #AC6a - Return only exact match
#   And I create a "company" draft account with the following details:
#     | Account_status                      | Submitted      |
#     | account.defendant.company_name      | Test CGI Co A  |
#     | account.defendant.email_address_1   | testA@test.com |
#     | account.defendant.post_code         | AB23 4RN       |
#     | account.account_type                | Fine           |
#     | account.prosecutor_case_reference   | PCRAUTO010     |
#     | account.collection_order_made       | false          |
#     | account.collection_order_made_today | false          |
#     | account.payment_card_request        | false          |
#   When I update the last created draft account with status "Publishing Pending"

#   And I create a "company" draft account with the following details:
#     | Account_status                      | Submitted      |
#     | account.defendant.company_name      | Test CGI Co B  |
#     | account.defendant.email_address_1   | testB@test.com |
#     | account.defendant.post_code         | AB23 4RN       |
#     | account.account_type                | Fine           |
#     | account.prosecutor_case_reference   | PCRAUTO010A    |
#     | account.collection_order_made       | false          |
#     | account.collection_order_made_today | false          |
#     | account.payment_card_request        | false          |
#   When I update the last created draft account with status "Publishing Pending"

#   When I enter "PCRAUTO010" into the "Reference or case number" field
#   And I click the "Search" button

#   # --- Step 3: Verify results show only exact match ---
#   Then I see "Search results" on the page header
#   And I see the "Companies" tab is selected
#   And I see "PCRAUTO010" is present in column "Ref"
#   And I do not see "PCRAUTO010A" in column "Ref"

# @PO-709
# Scenario: Verify that 'Check your search' link returns user to Search for an Account screen after no results found

#   When I enter "NOMATCH999" into the "Reference or case number" field
#   When I select the "Companies" tab
#   And I click the "Search" button
#   And I see "Check your search" text on the page
#   When I click on the "Check your search" link

#   #AC3b - Returned to search screen with state retained
#   Then I see "Search for an account" on the page header
#   And I see the "Companies" tab is selected
#   And I see "NOMATCH999" in the "Reference or case number" field

# @PO-717
# Scenario: Verify API call parameters for Individual search
#   #AC1
#   When I enter "Smith" into the "Last name" field
#   And I select the last name exact match checkbox
#   And I enter "John" into the "First names" field
#   And I select the first names exact match checkbox
#   And I select the "Include aliases" checkbox
#   And I enter "15/05/1980" into the Date of birth field
#   And I enter "AB123456C" into the "National Insurance number" field
#   And I enter "123 Test Street" into the "Address line 1" field
#   And I enter "SW1A 1AA" into the "Postcode" field

#   When I intercept the "defendant" account search API call
#   And I click the "Search" button

#   Then the intercepted "defendant" account search API call contains the following parameters:
#     | lastName                | Smith           |
#     | lastNameExact           | true            |
#     | firstNames              | John            |
#     | firstNamesExact         | true            |
#     | includeAliases          | true            |
#     | dateOfBirth             | 15/05/1980      |
#     | nationalInsuranceNumber | AB123456C       |
#     | addressLine1            | 123 Test Street |
#     | postcode                | SW1A 1AA        |
#     | companyName             | null            |
#     | companyNameExact        | null            |

# @PO-717
# Scenario: Verify API call parameters for Individual search with only last name populated
#   #AC1
#   When I enter "Smith" into the "Last name" field

#   When I intercept the "defendant" account search API call
#   And I click the "Search" button

#   Then the intercepted "defendant" account search API call contains the following parameters:
#     | lastName                | Smith |
#     | lastNameExact           | false |
#     | firstNames              | null  |
#     | firstNamesExact         | false |
#     | includeAliases          | false |
#     | dateOfBirth             | null  |
#     | nationalInsuranceNumber | null  |
#     | addressLine1            | null  |
#     | postcode                | null  |
#     | companyName             | null  |
#     | companyNameExact        | null  |


# @PO-717
# Scenario: Verify API call parameters for Individual search with "Active accounts only" checkbox unchecked
#   #AC1
#   When I enter "Smith" into the "Last name" field
#   And I unselect the Active accounts only checkbox

#   When I intercept the "defendant" account search API call
#   And I click the "Search" button

#   Then the intercepted "defendant" account search API call contains the following parameters:
#     | lastName                | Smith |
#     | lastNameExact           | false |
#     | firstNames              | null  |
#     | firstNamesExact         | false |
#     | includeAliases          | false |
#     | dateOfBirth             | null  |
#     | nationalInsuranceNumber | null  |
#     | addressLine1            | null  |
#     | postcode                | null  |
#     | companyName             | null  |
#     | companyNameExact        | null  |
#     | activeAccountsOnly      | false |


# @PO-707
# Scenario: Verify API call parameters for Company search
#   #AC1
#   When I click on the "Companies" link
#   And I enter "CompanyOne" into the "Company name" field
#   And I select the company name exact match checkbox
#   And I select the include alias checkbox
#   And I enter "123 Test Street" into the "Address line 1" field
#   And I enter "SW1A 1AA" into the "Postcode" field

#   When I intercept the "defendant" account search API call
#   And I click the "Search" button

#   Then the intercepted "defendant" account search API call contains the following parameters:
#     | companyName             | CompanyOne      |
#     | companyNameExact        | true            |
#     | includeAliases          | true            |
#     | addressLine1            | 123 Test Street |
#     | postcode                | SW1A 1AA        |
#     | lastName                | null            |
#     | lastNameExact           | null            |
#     | firstNames              | null            |
#     | firstNamesExact         | null            |
#     | dateOfBirth             | null            |
#     | nationalInsuranceNumber | null            |

# @PO-707
# Scenario: Verify API call parameters for Company search with only company name populated
#   #AC1
#   When I click on the "Companies" link
#   And I enter "CompanyOne" into the "Company name" field

#   When I intercept the "defendant" account search API call
#   And I click the "Search" button

#   Then the intercepted "defendant" account search API call contains the following parameters:
#     | companyName             | CompanyOne |
#     | companyNameExact        | false      |
#     | includeAliases          | false      |
#     | addressLine1            | null       |
#     | postcode                | null       |
#     | lastName                | null       |
#     | lastNameExact           | null       |
#     | firstNames              | null       |
#     | firstNamesExact         | null       |
#     | dateOfBirth             | null       |
#     | nationalInsuranceNumber | null       |

# @PO-707
# Scenario: Verify API call parameters for Company search with "Active accounts only" checkbox unchecked
#   #AC1
#   When I click on the "Companies" link
#   And I enter "CompanyOne" into the "Company name" field
#   And I unselect the Active accounts only checkbox

#   When I intercept the "defendant" account search API call
#   And I click the "Search" button

#   Then the intercepted "defendant" account search API call contains the following parameters:
#     | companyName             | CompanyOne |
#     | companyNameExact        | false      |
#     | includeAliases          | false      |
#     | addressLine1            | null       |
#     | postcode                | null       |
#     | lastName                | null       |
#     | lastNameExact           | null       |
#     | firstNames              | null       |
#     | firstNamesExact         | null       |
#     | dateOfBirth             | null       |
#     | nationalInsuranceNumber | null       |
#     | activeAccountsOnly      | false      |

# @PO-708
# Scenario: Verify API call parameters for Minor Creditor search - Individual
#   #AC1
#   When I click on the "Minor creditors" link
#   And I select the "Individual" radio button
#   And I enter "FirstName" into the "First names" field
#   And I enter "LastName" into the "Last name" field
#   And I enter "123 Test Street" into the "Address line 1" field
#   And I enter "SW1A 1AA" into the "Postcode" field

#   When I intercept the "minor creditor" account search API call
#   And I click the "Search" button

#   Then the intercepted "minor creditor" account search API call contains the following parameters:
#     | firstNames            | FirstName       |
#     | lastName              | LastName        |
#     | addressLine1          | 123 Test Street |
#     | postcode              | SW1A 1AA        |
#     | organisationName      | null            |
#     | organisationNameExact | null            |
#     | organisation          | false           |
#     | exactLastName         | null            |
#     | exactFirstNames       | null            |




# @PO-708
# Scenario: Verify API call parameters for Minor Creditor search - Individual with only last name populated
#   #AC1
#   When I click on the "Minor creditors" link
#   And I select the "Individual" radio button
#   And I enter "LastName" into the "Last name" field

#   When I intercept the "minor creditor" account search API call
#   And I click the "Search" button

#   Then the intercepted "minor creditor" account search API call contains the following parameters:
#     | firstNames            | null     |
#     | lastName              | LastName |
#     | addressLine1          | null     |
#     | postcode              | null     |
#     | organisationName      | null     |
#     | organisationNameExact | null     |
#     | organisation          | false    |
#     | exactLastName         | null     |
#     | exactFirstNames       | null     |

# @PO-708
# Scenario: Verify API call parameters for Minor Creditor search - Company
#   #AC1
#   When I click on the "Minor creditors" link
#   And I select the "Company" radio button
#   And I enter "CompanyOne" into the "Company name" field
#   And I enter "123 Test Street" into the "Address line 1" field
#   And I enter "SW1A 1AA" into the "Postcode" field

#   When I intercept the "minor creditor" account search API call
#   And I click the "Search" button

#   Then the intercepted "minor creditor" account search API call contains the following parameters:
#     | firstNames            | null            |
#     | lastName              | null            |
#     | addressLine1          | 123 Test Street |
#     | postcode              | SW1A 1AA        |
#     | organisationName      | CompanyOne      |
#     | organisationNameExact | null            |
#     | organisation          | true            |
#     | exactLastName         | null            |
#     | exactFirstNames       | null            |

# @PO-2075
# Scenario: Data is wiped after navigating to homepage and going back to search page
#   When I enter "12345678" into the "Account number" field
#   And I enter "12345" into the "Reference or case number" field
#   And I enter "Smith" into the "Last name" field
#   And I enter "John" into the "First names" field
#   And I enter "15/05/1980" into the Date of birth field
#   And I enter "AB123456C" into the "National Insurance number" field
#   And I enter "123 Test Street" into the "Address line 1" field
#   And I enter "SW1A 1AA" into the "Postcode" field
#   And I click on the "HMCTS" link
#   Then I am on the dashboard

#   When I navigate to Search For An Account
#   Then I see "" in the "Account number" field
#   And I see "" in the "Reference or case number" field
#   Then I see "" in the "Last name" field
#   And I see "" in the "First names" field
#   And I see "" in the Date of birth field
#   And I see "" in the "National Insurance number" field
#   And I see "" in the "Address line 1" field
#   And I see "" in the "Postcode" field
