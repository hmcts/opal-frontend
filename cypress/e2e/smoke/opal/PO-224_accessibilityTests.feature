Feature: PO-224 Accesibility Tests
  Scenario: Sign in Page - Accessibility
    Given I am on the OPAL Frontend
    Then I check accessibility

  Scenario: Defandant seach page Page - Accessibility
    Given I am on the OPAL Frontend
    Then I sign in
    Then I check accessibility

    Then I click the Sign out link

  Scenario: Defendant matches Page - Accessibility
    Given I am on the OPAL Frontend
    When I sign in

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

    When I sign in

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
    Then I check accessibility

    Then I click the Sign out link
