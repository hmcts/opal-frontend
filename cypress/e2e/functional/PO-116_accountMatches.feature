Feature: PO-116 account matches page
  Scenario: Search criteria persists when user goes back from matches screen
    Given I am on the OPAL Frontend
    Then I see "OPAL Frontend" in the header

    #When I sign in with Microsoft SSO
    When I click Sign in
    Then I see "Account Enquiry" in the page body header

    When I populate the form with the following search criteria
      | court    | Bath         |
      | surname  | testSurname  |
      | forename | testForename |
      | initials |              |
      | dobDay   | 01           |
      | dobMonth | 01           |
      | dobYear  | 1990         |
      | addrLn1  | addrLn1      |
      | niNumber | AB123456C    |
      | pcr      | testPCR      |

    Then I click the search button
    When I click the back button

    Then I see the form contains the following search criteria
      | court    | Bath         |
      | surname  | testSurname  |
      | forename | testForename |
      | initials |              |
      | dobDay   | 01           |
      | dobMonth | 01           |
      | dobYear  | 1990         |
      | addrLn1  | addrLn1      |
      | niNumber | AB123456C    |
      | pcr      | testPCR      |

  Scenario: when a user performs a specific search the correct result is returned to the user on the matches screen
    Given I am on the OPAL Frontend
    Then I see "OPAL Frontend" in the header

    #When I sign in with Microsoft SSO
    When I click Sign in
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
    #will need changing when exact search returns the details screen not matches screen
    Then I am presented with a result matching
      | name        | Mr Smart D John |
      | dateOfBirth | 1999-11-23      |
      | addrLn1     | 10 Brooks Lake  |

  Scenario: when a user performs a specific partial search the correct result is returned to the user on the matches screen
    Given I am on the OPAL Frontend
    Then I see "OPAL Frontend" in the header

    #When I sign in with Microsoft SSO
    When I click Sign in
    Then I see "Account Enquiry" in the page body header

    When I populate the form with the following search criteria
      | court    |             |
      | surname  | Joh         |
      | forename | Smart       |
      | initials | D           |
      | dobDay   | 23          |
      | dobMonth | 11          |
      | dobYear  | 1999        |
      | addrLn1  | Brooks Lake |
      | niNumber |             |
      | pcr      |             |

    And I click the search button
    #will need changing when exact search returns the details screen not matches screen
    Then I am presented with a result matching
      | name        | Mr Smart D John |
      | dateOfBirth | 1999-11-23      |
      | addrLn1     | 10 Brooks Lake  |

  Scenario: when a user performs a specific search with an incorrect date of birth no results are returned to the user on the matches screen
    Given I am on the OPAL Frontend
    Then I see "OPAL Frontend" in the header

    #When I sign in with Microsoft SSO
    When I click Sign in
    Then I see "Account Enquiry" in the page body header

    When I populate the form with the following search criteria
      | court    |             |
      | surname  | John        |
      | forename | Smart       |
      | initials | D           |
      | dobDay   | 22          |
      | dobMonth | 11          |
      | dobYear  | 1999        |
      | addrLn1  | Brooks Lake |
      | niNumber |             |
      | pcr      |             |

    And I click the search button
    #may need changing depending how the implementation of this is handled
    Then No results are returned

  Scenario: when a user performs a broad search the correct results are returned to the user on the matches screen
    Given I am on the OPAL Frontend
    Then I see "OPAL Frontend" in the header

    #When I sign in with Microsoft SSO
    When I click Sign in
    Then I see "Account Enquiry" in the page body header

    When I populate the form with the following search criteria
      | court    |      |
      | surname  |      |
      | forename |      |
      | initials |      |
      | dobDay   |      |
      | dobMonth |      |
      | dobYear  |      |
      | addrLn1  | Road |
      | niNumber |      |
      | pcr      |      |

    And I click the search button
    Then I am presented with results all containing
      | name        |      |
      | dateOfBirth |      |
      | addrLn1     | Road |
