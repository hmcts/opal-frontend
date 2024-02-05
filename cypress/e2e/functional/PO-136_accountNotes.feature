Feature: PO-136 add account notes
  Scenario: The application allows a user to add an account note
    Given I am on the OPAL Frontend
    Then I see "OPAL Frontend" in the header

    When I sign in
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

    When the name on the details screen for the result is "Mr Smart D John"
    And I click the "History" tab on the account details screen
    And I can see "History" in the account history panel header

    When I add the text "testNote1" to the note input
    And I click the Add button
    Then I see the text "testNote1" under the input
