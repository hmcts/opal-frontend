# Due to rigorous changes in the database temporarily suspending the account enquiry tests
# Feature: PO-115 account search page
#   Scenario: check values are entered for all field search
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

#   Scenario: check clear clears form
#     Given I am on the OPAL Frontend
#     Then I see "Opal" in the header

# Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     Then I am on the dashboard

#     When I navigate to Account Enquiry
#     Then I see "Account Enquiry" in the page body header

#   When I populate the form with the following search criteria
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

#     And I click the clear button

#  Then I see the form contains the following search criteria
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
