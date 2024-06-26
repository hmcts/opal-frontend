Feature: PO-224 Accesibility Tests
  Scenario: Sign in Page - Accessibility
    Given I am on the OPAL Frontend
    Then I check accessibility

  Scenario: Dashboard - Accessibility
    Given I am on the OPAL Frontend
    Then I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    Then I check accessibility

  Scenario: Defandant seach page Page - Accessibility
    Given I am on the OPAL Frontend
    Then I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Account Enquiry
    Then I see "Account Enquiry" in the page body header
    Then I check accessibility

    Then I click the Sign out link

  Scenario: Defendant matches Page - Accessibility
    Given I am on the OPAL Frontend
    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Account Enquiry
    Then I see "Account Enquiry" in the page body header
    When I populate the form with the following search criteria
      | court    |             |
      | surname  | John        |
      | forename | Smart       |
      | initials | D           |
      | dobDay   | 23          |
      | dobMonth | 11          |
      | dobYear  | 1999        |
      | addrLn1  | Brooks Lake |
      | niNumber |             |
      | pcr      |             |

    Then I click the search button
    Then I check accessibility

    Then I click the Sign out link

  Scenario: Defendant details Page - Accessibility
    Given I am on the OPAL Frontend

    When I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard

    When I navigate to Account Enquiry
    Then I see "Account Enquiry" in the page body header
    When I populate the form with the following search criteria
      | court    |             |
      | surname  | John        |
      | forename | Smart       |
      | initials | D           |
      | dobDay   | 23          |
      | dobMonth | 11          |
      | dobYear  | 1999        |
      | addrLn1  | Brooks Lake |
      | niNumber |             |
      | pcr      |             |
    And I click the search button

    When I view the first result
    Then I see "Account" on the page header

    Then I check accessibility

    Then I click the Sign out link
  Scenario Outline: Manual account creation - Accessibility - user 1 BU
    Given I am on the OPAL Frontend
    When I sign in as "opal-test-3@hmcts.net"
    When I navigate to "<url>" URL
    And I see "<header>" on the page header

    Then I check accessibility

    Then I click the Sign out link

    Examples:
      | page          | header                           | url                                      |
      | createAccount | Business unit and defendant type | /manual-account-creation/create-account |



  Scenario Outline: Manual account creation - Accessibility
    Given I am on the OPAL Frontend
    When I sign in as "opal-test@hmcts.net"
    When I navigate to "<url>" URL
    And I see "<header>" on the page header
    Then I check accessibility

    Then I click the Sign out link

    Examples:
      | page                  | header                           | url                                              |
      | createAccount         | Business unit and defendant type | /manual-account-creation/create-account         |
      | taskList              | Account details                  | /manual-account-creation/account-details          |
      | contactDetails        | Contact details                  | /manual-account-creation/contact-details         |
      | employerDetails       | Employer details                 | /manual-account-creation/employer-details        |
      | parentGuardianDetails | Parent or guardian details       | /manual-account-creation/parent-guardian-details |




