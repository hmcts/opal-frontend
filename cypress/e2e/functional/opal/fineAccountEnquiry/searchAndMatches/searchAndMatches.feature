Feature: Account Search and Matches

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Search For An Account

  @PO-705 @PO-712 @PO-715 @PO-1969
  Scenario: Switching to a new tab clears all fields on the 'search for an account' page
    #PO-705 - AC2 should not trigger any actions when Search button is clicked with no data field populated
    When I click the "Search" button
    Then I see "" in the "Last name" field
    And I see "" in the "First names" field
    And I see "" in the Date of birth field
    And I see "" in the "National Insurance number" field
    And I see "" in the "Address line 1" field
    And I see "" in the "Postcode" field

    #PO-712 - AC2 should not trigger any actions when Search button is clicked with no data field populated
    When I click on the "Companies" link
    And I click the "Search" button
    When I click on the "Companies" link
    Then I see "" in the "Company name" field
    And I see "" in the "Reference or case number" field
    And I see "" in the "Account number" field
    And I see "" in the "Address line 1" field
    And I see "" in the "Postcode" field

    #PO-715 - AC5 should not trigger any actions when Search button is clicked with radio button is selected
    When I click on the "Minor creditors" link
    And I click the "Search" button
    When I click on the "Minor creditors" link
    Then I see the "Individual" radio button is unselected
    And I see the "Company" radio button is unselected

    #PO-715 - AC5a should trigger error message when search button is clicked with the individual radio button selected and no other fields populated
    When I click on the "Minor creditors" link
    And I select the "Individual" radio button
    And I click the "Search" button
    Then I see "Enter minor creditor first name, last name, address or postcode" text on the page
    When I reload the page
    And I click on the "Companies" link
    And I click on the "Minor creditors" link
    Then I see the "Individual" radio button is unselected
    And I see the "Company" radio button is unselected

    #PO-715 - AC5b should trigger error message when search button is clicked with the company radio button selected and no other fields populated
    When I select the "Company" radio button
    And I click the "Search" button
    Then I see "Enter minor creditor company name or address" text on the page
    When I reload the page
    And I click on the "Companies" link
    And I click on the "Minor creditors" link
    Then I see the "Individual" radio button is unselected
    And I see the "Company" radio button is unselected

    #PO-705 - AC7. Tab switching clears data on the Individuals tab
    When I click on the "Individuals" link
    And I enter "Smith" into the "Last name" field
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

    #PO-1969 Clear error messages when switching tabs after validation errors
    And I select the last name exact match checkbox
    And I click the "Search" button
    Then I see the error message "Enter last name" at the top of the page
    Then I see "There is a problem" text on the page
    And I see "Enter last name" text on the page

    When I click on the "Companies" link
    And I click on the "Individuals" link
    And I verify the last name exact match checkbox is not checked
    Then I do not see "Enter last name" text on the page

    #PO-712 - AC6. Tab switching clears data on the company tab
    When I click on the "Companies" link
    And I enter "CompanyOne" into the "Company name" field
    And I select the company name exact match checkbox
    And I select the include alias checkbox
    And I enter "123 Test Street" into the "Address line 1" field
    And I enter "SW1A 1AA" into the "Postcode" field

    Then I see "CompanyOne" in the "Company name" field
    And I see "123 Test Street" in the "Address line 1" field
    And I see "SW1A 1AA" in the "Postcode" field

    When I click on the "Individuals" link
    And I click on the "Companies" link

    Then I see "" in the "Company name" field
    And I see "" in the "Address line 1" field
    And I see "" in the "Postcode" field
    And I verify the company name exact match checkbox is not checked
    And I verify the include alias checkbox is not checked
    And I validate the "Active accounts only" checkbox is checked

    #PO-715 - AC10. Tab switching clears data on the minor creditors tab
    When I click on the "Minor creditors" link
    And I select the "Individual" radio button
    And I enter "FirstName" into the "First names" field
    And I enter "LastName" into the "Last name" field
    And I enter "123 Test Street" into the "Address line 1" field
    And I enter "SW1A 1AA" into the "Postcode" field
    Then I click on the "Companies" link
    And I click on the "Minor creditors" link
    And I select the "Individual" radio button
    Then I see "" in the "First names" field
    And I see "" in the "Last name" field
    And I see "" in the "Address line 1" field
    And I see "" in the "Postcode" field

    Then I click on the "Companies" link
    When I click on the "Minor creditors" link
    And I select the "Company" radio button
    And I enter "CompanyOne" into the "Company name" field
    And I enter "123 Test Street" into the "Address line 1" field
    And I enter "SW1A 1AA" into the "Postcode" field
    Then I click on the "Companies" link
    And I click on the "Minor creditors" link
    And I select the "Company" radio button
    Then I see "" in the "Company name" field
    And I see "" in the "Address line 1" field
    And I see "" in the "Postcode" field


  @PO-705 @PO-712 @PO-715 @ignore
  Scenario: Validate error displayed when searching with multiple data sections populated
    #PO-705 - AC6. Error when all 3 sections contain data (Account number, Reference number, Individual field)
    When I enter "12345678" into the "Account number" field
    And I enter "REF-123" into the "Reference or case number" field
    And I enter "Smith" into the "Last name" field

    And I click the "Search" button

    Then I see "There is a problem" text on the page
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

    Then I see "There is a problem" text on the page

    When I click on the "Go back" link
    And I click on the "Companies" link
    And I click on the "Individuals" link

    #PO-705 - AC6a. Error when 2 out of 3 sections contain data - Case 2: Account number + Individual
    When I enter "12345678" into the "Account number" field
    And I enter "Smith" into the "Last name" field

    And I click the "Search" button

    Then I see "There is a problem" text on the page

    When I click on the "Go back" link
    And I click on the "Companies" link
    And I click on the "Individuals" link

    #PO-705 - AC6a. Error when 2 out of 3 sections contain data - Case 3: Reference + Individual
    When I enter "REF-123" into the "Reference or case number" field
    And I enter "Smith" into the "Last name" field

    And I click the "Search" button

    Then I see "There is a problem" text on the page

    When I click on the "Go back" link

    Then I see "Search for an account" on the page header
    And I see "12345678" in the "Account number" field
    And I see "REF-123" in the "Reference or case number" field
    And I see "Smith" in the "Last name" field

    #PO-712 - AC5i. Error when all 3 sections contain data (Account number, Reference number, Company field)
    When I enter "12345678" into the "Account number" field
    And I enter "REF-123" into the "Reference or case number" field
    And I click on the "Companies" link
    And I enter "CompanyOne" into the "Company name" field
    And I click the "Search" button

    Then I see "There is a problem" text on the page
    And I see "Reference data and account information cannot be entered together when searching for an account. Search using either:" text on the page
    And I see "account number" text on the page
    And I see "reference or case number" text on the page
    And I see "selected tab" text on the page

    #PO-712 - AC5ia. Back button returns to search screen with data intact
    When I click on the "Go back" link
    Then I see "Search for an account" on the page header
    And I see "12345678" in the "Account number" field
    And I see "REF-123" in the "Reference or case number" field
    And I see "CompanyOne" in the "Company name" field

    When I click on the "Individuals" link
    And I click on the "Companies" link

    #PO-712 - AC5a. Error when 2 out of 3 sections contain data - Case 1: Account number + Reference
    When I enter "12345678" into the "Account number" field
    And I enter "REF-123" into the "Reference or case number" field
    And I click the "Search" button
    Then I see "There is a problem" text on the page

    When I click on the "Go back" link
    And I click on the "Individuals" link
    And I click on the "Companies" link

    #PO-712 - AC5a. Error when 2 out of 3 sections contain data - Case 2: Account number + Company
    When I enter "12345678" into the "Account number" field
    And I enter "CompanyOne" into the "Company name" field
    And I click the "Search" button
    Then I see "There is a problem" text on the page

    When I click on the "Go back" link
    And I click on the "Individuals" link
    And I click on the "Companies" link

    #PO-712 - AC5a. Error when 2 out of 3 sections contain data - Case 3: Reference + Company
    When I enter "REF-123" into the "Reference or case number" field
    And I enter "CompanyOne" into the "Company name" field
    And I click the "Search" button
    Then I see "There is a problem" text on the page

    When I click on the "Go back" link
    Then I see "Search for an account" on the page header
    And I see "12345678" in the "Account number" field
    And I see "REF-123" in the "Reference or case number" field
    And I see "CompanyOne" in the "Company name" field
    And I reload the page

    #PO-715 - AC9i. Error when all 3 sections contain data (Account number, Reference number, Company field - minor creditors tab)
    When I enter "12345678" into the "Account number" field
    And I enter "REF-123" into the "Reference or case number" field
    And I click on the "Minor creditors" link
    And I select the "Company" radio button
    And I enter "CompanyOne" into the "Company name" field
    And I click the "Search" button

    Then I see "There is a problem" text on the page
    And I see "Reference data and account information cannot be entered together when searching for an account. Search using either:" text on the page
    And I see "account number" text on the page
    And I see "reference or case number" text on the page
    And I see "selected tab" text on the page
    When I click on the "Go back" link

    Then I see "Search for an account" on the page header
    And I see "12345678" in the "Account number" field
    And I see "REF-123" in the "Reference or case number" field
    And I see "CompanyOne" in the "Company name" field
    And I reload the page

    #PO-715 - AC9a. Error when 2 out of 3 sections contain data - Case 1: Account number + Reference
    When I enter "12345678" into the "Account number" field
    And I enter "REF-123" into the "Reference or case number" field
    And I click on the "Minor creditors" link
    And I click the "Search" button

    Then I see "There is a problem" text on the page
    And I see "Reference data and account information cannot be entered together when searching for an account. Search using either:" text on the page
    And I see "account number" text on the page
    And I see "reference or case number" text on the page
    And I see "selected tab" text on the page
    When I click on the "Go back" link

    Then I see "Search for an account" on the page header
    And I see "12345678" in the "Account number" field
    And I see "REF-123" in the "Reference or case number" field
    And I reload the page

    #PO-715 - AC9a. Error when 2 out of 3 sections contain data - Case 1: Account number + Company name (Minor creditor)
    When I enter "12345678" into the "Account number" field
    And I click on the "Minor creditors" link
    And I select the "Company" radio button
    And I enter "CompanyOne" into the "Company name" field
    And I click the "Search" button

    Then I see "There is a problem" text on the page
    And I see "Reference data and account information cannot be entered together when searching for an account. Search using either:" text on the page
    And I see "account number" text on the page
    And I see "reference or case number" text on the page
    And I see "selected tab" text on the page
    When I click on the "Go back" link

    Then I see "Search for an account" on the page header
    And I see "12345678" in the "Account number" field
    And I see "CompanyOne" in the "Company name" field

    #PO-715 - AC9a. Error when 2 out of 3 sections contain data - Case 1: Account number + Company name (Minor creditor)
    When I enter "REF-123" into the "Reference or case number" field
    And I click on the "Minor creditors" link
    And I select the "Company" radio button
    And I enter "CompanyOne" into the "Company name" field
    And I click the "Search" button

    Then I see "There is a problem" text on the page
    And I see "Reference data and account information cannot be entered together when searching for an account. Search using either:" text on the page
    And I see "account number" text on the page
    And I see "reference or case number" text on the page
    And I see "selected tab" text on the page
    When I click on the "Go back" link

    Then I see "Search for an account" on the page header
    And I see "REF-123" in the "Reference or case number" field
    And I see "CompanyOne" in the "Company name" field


    #PO-715 - AC8. Error when individual contains only the first names field populated when searched
    And I reload the page
    When I click on the "Minor creditors" link
    And I select the "Individual" radio button
    And I enter "FirstName" into the "First names" field
    And I click the "Search" button
    Then I see "Enter last name" text on the page



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

  @PO-717
  Scenario: Successful Search For Individual Defendant Accounts
    When I enter "Graham" into the "Last name" field
    And I click the "Search" button

    # PO-717 - AC5. Back Button navigates to Search Page
    Then I see "Search results" on the page header

    When I click on the "Back" link
    Then I see "Graham" in the "Last name" field
    Then I see "Individuals" on the page header


  # PO-717 - AC4g. Click on Account Number link and verify navigation to template page - to be completed once API integration is complete - test data needs discussed
  # Handles window.open navigation
  # When I click the "Search" button
  # When I click the "100A" link and handle new window navigation
  # Then I see "Account Details" on the page header


  # PO-707
  @PO-707
  Scenario: Successful Search For company defendant accounts
    When I click on the "Companies" link
    And I enter "TechCorp Solutions Ltd" into the "Company name" field
    And I click the "Search" button

    # PO-707 - AC5. Back Button navigates to Search Page
    Then I see "Search results" on the page header

    When I click on the "Back" link
    And I see "TechCorp Solutions Ltd" in the "Company name" field
    Then I see "Companies" on the page header


  # PO-707 - AC4g. Click on Account Number link and verify navigation to template page - to be completed once API integration is complete - test data needs discussed
  # Handles window.open navigation
  # When I click the "Search" button
  # When I click the "555O" link and handle new window navigation
  # Then I see "Account Details" on the page header

  #PO-707 AC3b & AC2b Will be covered once API integration is complete

  # PO-717 AC3b & AC2b Will be covered once API integration is complete

  @PO-708
  Scenario: Successful Search For Minor Creditor Accounts
    When I click on the "Minor creditors" link
    When I select the 'Individual' radio button
    Then I enter "Graham" into the "Last name" field
    And I click the "Search" button

    Then I see "Search results" on the page header

    # AC10 Check Back Link Works Correctly
    When I click on the "Back" link
    Then I see "Search for an account" on the page header

  # AC4g. Click on Account Number link and verify navigation to template page - To be fixed once API integration is complete
  # Handles window.open navigation
  # When I click the "Search" button
  # When I click the "100A" link and handle new window navigation
  # Then I see "Account Details" on the page header

  # PO-708 AC3b & AC2b Will be covered once API integration is complete


  # PO-706  AC7 Back Button navigates to Search Page
  @PO-706
  Scenario: Search results back button preserves tab state and form data
    When I enter "12345678A" into the "Account number" field
    And I click the "Search" button
    Then I see "Search results" on the page header
    When I click on the "Back" link
    Then I see "12345678A" in the "Account number" field
    Then I see "Individuals" on the page header


  @PO-706
  Scenario: Verify API call parameters for Defenders and Creditor search using Account number
    # AC1a, AC1b, AC1c
    When I enter "12345678A" into the "Account number" field
    When I intercept the "account number" account search API call
    And I click the "Search" button
    Then the intercepted defendant search calls contain expected parameters
      | defendant                 | null                     |
      | account_number            | 12345678A                |
      | business_unit_ids         | [65, 66, 73, 77, 80, 78] |
      | active_accounts_only      | false                    |
      | organisation              | false                    |
      | prosecutor_case_reference | null                     |
    And the intercepted minor creditor search call contains
      | account_number       | 12345678A                |
      | business_unit_ids    | [65, 66, 73, 77, 80, 78] |
      | active_accounts_only | false                    |
      | creditor             | null                     |

  # PO-708 AC3b & AC2b Will be covered once API integration is complete

  @PO-717
  Scenario: Verify API call parameters for Individual search
    #AC1
    When I enter "Smith" into the "Last name" field
    And I select the last name exact match checkbox
    And I enter "John" into the "First names" field
    And I select the first names exact match checkbox
    And I select the "Include aliases" checkbox
    And I enter "15/05/1980" into the Date of birth field
    And I enter "AB123456C" into the "National Insurance number" field
    And I enter "123 Test Street" into the "Address line 1" field
    And I enter "SW1A 1AA" into the "Postcode" field

    When I intercept the "defendant" account search API call
    And I click the "Search" button

    Then the intercepted "defendant" account search API call contains the following parameters:
      | lastName                | Smith           |
      | lastNameExact           | true            |
      | firstNames              | John            |
      | firstNamesExact         | true            |
      | includeAliases          | true            |
      | dateOfBirth             | 15/05/1980      |
      | nationalInsuranceNumber | AB123456C       |
      | addressLine1            | 123 Test Street |
      | postcode                | SW1A 1AA        |
      | companyName             | null            |
      | companyNameExact        | null            |

  @PO-717
  Scenario: Verify API call parameters for Individual search with only last name populated
    #AC1
    When I enter "Smith" into the "Last name" field

    When I intercept the "defendant" account search API call
    And I click the "Search" button

    Then the intercepted "defendant" account search API call contains the following parameters:
      | lastName                | Smith |
      | lastNameExact           | false |
      | firstNames              | null  |
      | firstNamesExact         | false |
      | includeAliases          | false |
      | dateOfBirth             | null  |
      | nationalInsuranceNumber | null  |
      | addressLine1            | null  |
      | postcode                | null  |
      | companyName             | null  |
      | companyNameExact        | null  |


  @PO-717
  Scenario: Verify API call parameters for Individual search with "Active accounts only" checkbox unchecked
    #AC1
    When I enter "Smith" into the "Last name" field
    And I unselect the Active accounts only checkbox

    When I intercept the "defendant" account search API call
    And I click the "Search" button

    Then the intercepted "defendant" account search API call contains the following parameters:
      | lastName                | Smith |
      | lastNameExact           | false |
      | firstNames              | null  |
      | firstNamesExact         | false |
      | includeAliases          | false |
      | dateOfBirth             | null  |
      | nationalInsuranceNumber | null  |
      | addressLine1            | null  |
      | postcode                | null  |
      | companyName             | null  |
      | companyNameExact        | null  |
      | activeAccountsOnly      | false |


  @PO-707
  Scenario: Verify API call parameters for Company search
    #AC1
    When I click on the "Companies" link
    And I enter "CompanyOne" into the "Company name" field
    And I select the company name exact match checkbox
    And I select the include alias checkbox
    And I enter "123 Test Street" into the "Address line 1" field
    And I enter "SW1A 1AA" into the "Postcode" field

    When I intercept the "defendant" account search API call
    And I click the "Search" button

    Then the intercepted "defendant" account search API call contains the following parameters:
      | companyName             | CompanyOne      |
      | companyNameExact        | true            |
      | includeAliases          | true            |
      | addressLine1            | 123 Test Street |
      | postcode                | SW1A 1AA        |
      | lastName                | null            |
      | lastNameExact           | null            |
      | firstNames              | null            |
      | firstNamesExact         | null            |
      | dateOfBirth             | null            |
      | nationalInsuranceNumber | null            |

  @PO-707
  Scenario: Verify API call parameters for Company search with only company name populated
    #AC1
    When I click on the "Companies" link
    And I enter "CompanyOne" into the "Company name" field

    When I intercept the "defendant" account search API call
    And I click the "Search" button

    Then the intercepted "defendant" account search API call contains the following parameters:
      | companyName             | CompanyOne |
      | companyNameExact        | false      |
      | includeAliases          | false      |
      | addressLine1            | null       |
      | postcode                | null       |
      | lastName                | null       |
      | lastNameExact           | null       |
      | firstNames              | null       |
      | firstNamesExact         | null       |
      | dateOfBirth             | null       |
      | nationalInsuranceNumber | null       |

  @PO-707
  Scenario: Verify API call parameters for Company search with "Active accounts only" checkbox unchecked
    #AC1
    When I click on the "Companies" link
    And I enter "CompanyOne" into the "Company name" field
    And I unselect the Active accounts only checkbox

    When I intercept the "defendant" account search API call
    And I click the "Search" button

    Then the intercepted "defendant" account search API call contains the following parameters:
      | companyName             | CompanyOne |
      | companyNameExact        | false      |
      | includeAliases          | false      |
      | addressLine1            | null       |
      | postcode                | null       |
      | lastName                | null       |
      | lastNameExact           | null       |
      | firstNames              | null       |
      | firstNamesExact         | null       |
      | dateOfBirth             | null       |
      | nationalInsuranceNumber | null       |
      | activeAccountsOnly      | false      |

  @PO-708
  Scenario: Verify API call parameters for Minor Creditor search - Individual
    #AC1
    When I click on the "Minor creditors" link
    And I select the "Individual" radio button
    And I enter "FirstName" into the "First names" field
    And I enter "LastName" into the "Last name" field
    And I enter "123 Test Street" into the "Address line 1" field
    And I enter "SW1A 1AA" into the "Postcode" field

    When I intercept the "minor creditor" account search API call
    And I click the "Search" button

    Then the intercepted "minor creditor" account search API call contains the following parameters:
      | firstNames            | FirstName       |
      | lastName              | LastName        |
      | addressLine1          | 123 Test Street |
      | postcode              | SW1A 1AA        |
      | organisationName      | null            |
      | organisationNameExact | null            |
      | organisation          | false           |
      | exactLastName         | null            |
      | exactFirstNames       | null            |




  @PO-708
  Scenario: Verify API call parameters for Minor Creditor search - Individual with only last name populated
    #AC1
    When I click on the "Minor creditors" link
    And I select the "Individual" radio button
    And I enter "LastName" into the "Last name" field

    When I intercept the "minor creditor" account search API call
    And I click the "Search" button

    Then the intercepted "minor creditor" account search API call contains the following parameters:
      | firstNames            | null     |
      | lastName              | LastName |
      | addressLine1          | null     |
      | postcode              | null     |
      | organisationName      | null     |
      | organisationNameExact | null     |
      | organisation          | false    |
      | exactLastName         | null     |
      | exactFirstNames       | null     |

  @PO-708
  Scenario: Verify API call parameters for Minor Creditor search - Company
    #AC1
    When I click on the "Minor creditors" link
    And I select the "Company" radio button
    And I enter "CompanyOne" into the "Company name" field
    And I enter "123 Test Street" into the "Address line 1" field
    And I enter "SW1A 1AA" into the "Postcode" field

    When I intercept the "minor creditor" account search API call
    And I click the "Search" button

    Then the intercepted "minor creditor" account search API call contains the following parameters:
      | firstNames            | null            |
      | lastName              | null            |
      | addressLine1          | 123 Test Street |
      | postcode              | SW1A 1AA        |
      | organisationName      | CompanyOne      |
      | organisationNameExact | null            |
      | organisation          | true            |
      | exactLastName         | null            |
      | exactFirstNames       | null            |

  @PO-2075
  Scenario: Data is wiped after navigating to homepage and going back to search page
    When I enter "12345678" into the "Account number" field
    And I enter "12345" into the "Reference or case number" field
    And I enter "Smith" into the "Last name" field
    And I enter "John" into the "First names" field
    And I enter "15/05/1980" into the Date of birth field
    And I enter "AB123456C" into the "National Insurance number" field
    And I enter "123 Test Street" into the "Address line 1" field
    And I enter "SW1A 1AA" into the "Postcode" field
    And I click on the "HMCTS" link
    Then I am on the dashboard

    When I navigate to Search For An Account
    Then I see "" in the "Account number" field
    And I see "" in the "Reference or case number" field
    Then I see "" in the "Last name" field
    And I see "" in the "First names" field
    And I see "" in the Date of birth field
    And I see "" in the "National Insurance number" field
    And I see "" in the "Address line 1" field
    And I see "" in the "Postcode" field