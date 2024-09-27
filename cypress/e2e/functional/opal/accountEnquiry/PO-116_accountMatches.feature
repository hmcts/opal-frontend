# Due to rigorous changes in the database temporarily suspending the account enquiry tests
# Feature: PO-116 account matches page
#   Scenario: Search criteria persists when user goes back from matches screen
#     Given I am on the OPAL Frontend
#     Then I see "Opal" in the header

# Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     Then I am on the dashboard

#     When I navigate to Account Enquiry
#     Then I see "Account Enquiry" in the page body header

#     When I populate the form with the following search criteria
#       | court    | Kingston     |
#       | surname  | testSurname  |
#       | forename | testForename |
#       | initials |              |
#       | dobDay   | 01           |
#       | dobMonth | 01           |
#       | dobYear  | 1990         |
#       | addrLn1  | addrLn1      |
#       | niNumber | AB123456C    |
#       | pcr      | testPCR      |

#     Then I click the search button
#     When I click the back button

#     Then I see the form contains the following search criteria
#       | court    | Kingston-upon-Thames Mags Court |
#       | surname  | testSurname                     |
#       | forename | testForename                    |
#       | initials |                                 |
#       | dobDay   | 01                              |
#       | dobMonth | 01                              |
#       | dobYear  | 1990                            |
#       | addrLn1  | addrLn1                         |
#       | niNumber | AB123456C                       |
#       | pcr      | testPCR                         |

#   Scenario: when a user performs a specific search the correct result is returned to the user on the matches screen
#     Given I am on the OPAL Frontend
#     Then I see "Opal" in the header

# Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     Then I am on the dashboard

#     When I navigate to Account Enquiry
#     Then I see "Account Enquiry" in the page body header

#     When I populate the form with the following search criteria
#       | court    |             |
#       | surname  | John        |
#       | forename | Smart       |
#       | initials | D           |
#       | dobDay   | 23          |
#       | dobMonth | 11          |
#       | dobYear  | 1999        |
#       | addrLn1  | Brooks Lake |
#       | niNumber |             |
#       | pcr      |             |

#     And I click the search button
#     #will need changing when exact search returns the details screen not matches screen
#     Then I am presented with a result matching
#       | name        | Mr Smart D John |
#       | dateOfBirth | 1999-11-23      |
#       | addrLn1     | 10 Brooks Lake  |

#   Scenario: when a user performs a specific partial search the correct result is returned to the user on the matches screen
#     Given I am on the OPAL Frontend
#     Then I see "Opal" in the header

# Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     Then I am on the dashboard

#     When I navigate to Account Enquiry
#     Then I see "Account Enquiry" in the page body header

#     When I populate the form with the following search criteria
#       | court    |             |
#       | surname  | Joh         |
#       | forename | Smart       |
#       | initials | D           |
#       | dobDay   | 23          |
#       | dobMonth | 11          |
#       | dobYear  | 1999        |
#       | addrLn1  | Brooks Lake |
#       | niNumber |             |
#       | pcr      |             |

#     And I click the search button
#     #will need changing when exact search returns the details screen not matches screen
#     Then I am presented with a result matching
#       | name        | Mr Smart D John |
#       | dateOfBirth | 1999-11-23      |
#       | addrLn1     | 10 Brooks Lake  |

#   Scenario: when a user performs a specific search with an incorrect date of birth no results are returned to the user on the matches screen
#     Given I am on the OPAL Frontend
#     Then I see "Opal" in the header

# Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     Then I am on the dashboard

#     When I navigate to Account Enquiry
#     Then I see "Account Enquiry" in the page body header

#     When I populate the form with the following search criteria
#       | court    |             |
#       | surname  | John        |
#       | forename | Smart       |
#       | initials | D           |
#       | dobDay   | 22          |
#       | dobMonth | 11          |
#       | dobYear  | 1999        |
#       | addrLn1  | Brooks Lake |
#       | niNumber |             |
#       | pcr      |             |

#     And I click the search button
#     #may need changing depending how the implementation of this is handled
#     Then No results are returned

#   Scenario: when a user performs a broad search the correct results are returned to the user on the matches screen
#     Given I am on the OPAL Frontend
#     Then I see "Opal" in the header

# Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     Then I am on the dashboard

#     When I navigate to Account Enquiry
#     Then I see "Account Enquiry" in the page body header

#     When I populate the form with the following search criteria
#       | court    |    |
#       | surname  |    |
#       | forename | il |
#       | initials |    |
#       | dobDay   |    |
#       | dobMonth |    |
#       | dobYear  |    |
#       | addrLn1  |    |
#       | niNumber |    |
#       | pcr      |    |

#     And I click the search button
#     Then I am presented with results all containing
#       | name        | il |
#       | dateOfBirth |    |
#       | addrLn1     |    |
