#Due to changes in PO-598 this test has been descoped
# Feature: PO-117 account details page
#   Scenario: When the user views the account details for any account they are correct
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
#     When I view the first result

#     Then the name on the details screen for the result is "Mr Smart D John"
#     And the account details are
#       | Postcode   | CK12 9XX   |
#       | Dob        | 1999-11-23 |
#       | Imposed    | £2,100.00  |
#       | AmountPaid | £1,100.00  |
#       | Balance    | £1,000.00  |

#   Scenario: The search results persist when the user clicks back on the details screen
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

#     And I view the first result

#     When I click the back button
#     Then I am presented with results all containing
#       | name        | il |
#       | dateOfBirth |    |
#       | addrLn1     |    |

#   Scenario: When the user clicks new search they are sent back to an empty search form
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
#     And I view the first result

#     When I click the New Search button

#     Then I see the form contains the following search criteria
#       | court    |  |
#       | surname  |  |
#       | forename |  |
#       | initials |  |
#       | dobDay   |  |
#       | dobMonth |  |
#       | dobYear  |  |
#       | addrLn1  |  |
#       | niNumber |  |
#       | pcr      |  |

#   Scenario: The tabs on the account details screen are functional
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
#     And I view the first result

#     Then I can see "Account Details" in the account details panel header

#     When I click the "Imposition" tab on the account details screen
#     Then I can see "Imposition" in the account imposition panel header

#     When I click the "History" tab on the account details screen
#     Then I can see "History" in the account history panel header

#     When I click the "Details" tab on the account details screen
#     Then I can see "Account Details" in the account details panel header

