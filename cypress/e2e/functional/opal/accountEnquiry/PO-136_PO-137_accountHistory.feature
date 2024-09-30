
#Due to changes in PO-598 this test has been descoped
# Feature: PO-136 PO-137 view account history
#   Scenario: The application shows the account history for a given account
#     Given I am on the OPAL Frontend
#     Then I see "Opal" in the header

# Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     Then I am on the dashboard

#     When I navigate to Account Enquiry
#     Then I see "Account Enquiry" in the page body header

#     When I populate the form with the following search criteria
#       | court    |                |
#       | surname  | Noddy          |
#       | forename | Will           |
#       | initials |                |
#       | dobDay   | 01             |
#       | dobMonth | 04             |
#       | dobYear  | 1983           |
#       | addrLn1  | 12 Broady Road |
#       | niNumber |                |
#       | pcr      |                |

#     And I click the search button
#     When I view the first result

#     When the name on the details screen for the result is "Dr Will Noddy"
#     And I click the "History" tab on the account details screen
#     And I can see "History" in the account history panel header

#     Then I can see "Comment for Notes 500000002" at the top of the history

#   Scenario: The application shows the existing and additional account history for a given account
#     Given I am on the OPAL Frontend
#     Then I see "Opal" in the header

# Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     Then I am on the dashboard

#     When I navigate to Account Enquiry
#     Then I see "Account Enquiry" in the page body header

#     When I populate the form with the following search criteria
#       | court    |               |
#       | surname  | Khalid        |
#       | forename | Muhad         |
#       | initials |               |
#       | dobDay   | 14            |
#       | dobMonth | 04            |
#       | dobYear  | 2000          |
#       | addrLn1  | 17 Brown Road |
#       | niNumber |               |
#       | pcr      |               |

#     And I click the search button
#     When I view the first result

#     When the name on the details screen for the result is "Mr Muhad Khalid"
#     And I click the "History" tab on the account details screen
#     And I can see "History" in the account history panel header

#     Then I can see "Comment for Notes 500000005" at the top of the history

#     When I add the text "testNote1" to the note input
#     And I click the Add button

#     Then I can see "testNote1" at position "1" of the history

#     When I add the text "testNote2" to the note input
#     And I click the Add button

#     Then I can see "testNote2" at position "1" of the history
#     And I can see "testNote1" at position "2" of the history
