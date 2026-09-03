@JIRA-LABEL:account-enquiry
Feature: Defendant Shared Search And Matches
  Shared account number and reference searches preserve state, return the
  expected results, and issue the correct API requests.

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I am on the Account Search page - Individuals form displayed by default

  # PO-706  AC7 Back Button navigates to Search Page
  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-706 @JIRA-TEST-KEY:PO-5442
  Scenario: Search results back button preserves tab state and form data
    When I search using the following inputs:
      | account number | 12345678A |
    Then I see the Search results page
    When I go back from the results page
    Then I see the "Search for an account" page for individuals with the following details:
      | account number | 12345678A |

  # Need to check that intercepted call should be organisation = true (it wasn't originally)
  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-706 @JIRA-TEST-KEY:PO-5443
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
      | prosecutor_case_reference | null                                                                                                                                                                                |
    Then the intercepted "defendant" account search API requests should contain the following counts for "organisation":
      | false | 1 |
      | true  | 1 |
    And the intercepted "minor creditor" account search API call will contain the following parameters:
      | account_number       | 12345678A                                                                                                                                                                           |
      | business_unit_ids    | [107,52,109,130,82,135,47,77,5,65,66,8,97,45,9,10,11,12,60,126,61,110,14,89,26,36,21,22,105,24,78,112,29,139,113,106,28,30,119,31,103,57,124,96,92,38,125,116,128,99,73,129,80,138] |
      | active_accounts_only | false                                                                                                                                                                               |
      | creditor             | null                                                                                                                                                                                |

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-709 @JIRA-TEST-KEY:PO-5444
  Scenario: Verify API call parameters for Defenders and Creditors search using Reference or case number
    # AC1a, AC1b, AC1c
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted              |
      | account.defendant.company_name      | Test CGI Comp 1{uniq}  |
      | account.defendant.email_address_1   | Accdetailcomp@test.com |
      | account.defendant.post_code         | AB23 4RN               |
      | account.account_type                | Fine                   |
      | account.prosecutor_case_reference   | PCRAUTO008             |
      | account.collection_order_made       | false                  |
      | account.collection_order_made_today | false                  |
      | account.payment_card_request        | false                  |
    And I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                          | Submitted                            |
      | account.defendant.forenames             | John                                 |
      | account.defendant.surname               | AccWithComp{uniq}                    |
      | account.defendant.email_address_1       | John.AccDetailSurname{uniq}@test.com |
      | account.defendant.telephone_number_home | 02078259314                          |
      | account.account_type                    | Fine                                 |
      | account.prosecutor_case_reference       | PCRAUTO008                           |
      | account.collection_order_made           | false                                |
      | account.collection_order_made_today     | false                                |
      | account.payment_card_request            | false                                |
      | account.defendant.dob                   | 2002-05-15                           |
    And I am on the Account Search page - Individuals form displayed by default

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

  @R1B @JIRA-STORY:PO-709
  Scenario Outline: Verify search works for all reference types - <reference_type>
    #AC6
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted         |
      | account.defendant.company_name      | Test CGI Co{uniq} |
      | account.defendant.email_address_1   | test@test.com     |
      | account.defendant.post_code         | AB23 4RN          |
      | account.account_type                | Fine              |
      | <reference_field>                   | <reference_value> |
      | account.collection_order_made       | false             |
      | account.collection_order_made_today | false             |
      | account.payment_card_request        | false             |
    And I am on the Account Search page - Individuals form displayed by default

    And I view the Companies search form
    When I search using the following inputs:
      | reference or case number | <reference_value> |
    And I see the Companies search results:
      | Ref | <reference_value> |
    @R1B @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5445
    Examples: Case Number
      | reference_type | reference_field                   | expected_reference_field | reference_value |
      | Case Number    | account.prosecutor_case_reference | case_number              | CN12345         |

    @R1B @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5446
    Examples: Police Reference Number
      | reference_type          | reference_field                   | expected_reference_field | reference_value |
      | Police Reference Number | account.prosecutor_case_reference | police_reference_number  | PRN67890        |

    @R1B @JIRA-EPIC:PO-704 @JIRA-TEST-KEY:PO-5447
    Examples: Crown Court Reference
      | reference_type        | reference_field                   | expected_reference_field | reference_value |
      | Crown Court Reference | account.prosecutor_case_reference | crown_court_reference    | CCR98765        |

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-709 @JIRA-TEST-KEY:PO-5448
  Scenario: Verify that the Reference or Case Number search only returns exact matches
    #AC6a - Return only exact match
    Given I create a "company" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted           |
      | account.defendant.company_name      | Test CGI Co A{uniq} |
      | account.defendant.email_address_1   | testA@test.com      |
      | account.defendant.post_code         | AB23 4RN            |
      | account.account_type                | Fine                |
      | account.prosecutor_case_reference   | PCRUNIQ010          |
      | account.collection_order_made       | false               |
      | account.collection_order_made_today | false               |
      | account.payment_card_request        | false               |
    And I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | Account_status                      | Submitted           |
      | account.defendant.company_name      | Test CGI Co B{uniq} |
      | account.defendant.email_address_1   | testB@test.com      |
      | account.defendant.post_code         | AB23 4RN            |
      | account.account_type                | Fine                |
      | account.prosecutor_case_reference   | PCRUNIQ010A         |
      | account.collection_order_made       | false               |
      | account.collection_order_made_today | false               |
      | account.payment_card_request        | false               |
    And I am on the Account Search page - Individuals form displayed by default

    When I search using the following inputs:
      | reference or case number | PCRUNIQ010 |
    # --- Step 3: Verify results show only exact match ---
    Then I see the Companies search results:
      | Ref | PCRUNIQ010 |
    And I see the Companies search results exclude:
      | Ref | PCRUNIQ010A |

  @JIRA-EPIC:PO-704 @R1B @JIRA-STORY:PO-709 @JIRA-TEST-KEY:PO-5449
  Scenario: Verify that 'Check your search' link returns user to Search for an Account screen after no results found
    And I view the Companies search form
    When I search using the following inputs:
      | reference or case number | NOMATCH999 |
    When I see there are no matching results and I check my search
    #AC3b - Returned to search screen with state retained
    Then I see the "Search for an account" page for companies with the following details:
      | reference or case number | NOMATCH999 |
