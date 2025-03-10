##############################################

###### NOW COVERED IN FUNCTIONAL TESTS #######

##############################################

# Feature: Manual account creation - Common screens - accessibility
#   Scenario: Manual account creation - Accessibility - User 1 BU
#     Given I am on the Opal Frontend and I sign in as "opal-test-3@hmcts.net"
#     And I navigate to Manual Account Creation
#     And I see "Business unit and defendant type" on the page header

#     Then I check accessibility
#     Then I click the Sign out link

#   Scenario: Manual account creation - Accessibility - User multiple BUs
#     Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     And I navigate to Manual Account Creation
#     And I see "Business unit and defendant type" on the page header
#     Then I check accessibility
#     Then I click the Sign out link

#   Scenario: Manual account creation - Accessibility - Create Account screen
#     Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     And I navigate to Manual Account Creation
#     And I enter "West London" into the business unit search box
#     And I select the "Fine" radio button
#     And I select the "Adult or youth with parent or guardian to pay" radio button
#     And I click the "Continue" button

#     Then I see "Account details" on the page header
#     Then I check accessibility
#     Then I click the Sign out link

#   Scenario Outline: Manual account creation - Accessibility - Common screens
#     Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     And I navigate to Manual Account Creation
#     And I enter "West London" into the business unit search box
#     And I select the "Fine" radio button
#     And I select the "Adult or youth with parent or guardian to pay" radio button
#     And I click the "Continue" button

#     When I click on the "<screen>" link
#     Then I see "<pageHeading>" on the page header
#     Then I check accessibility
#     Then I click the Sign out link
#     Examples:
#       | screen                     | pageHeading                                   |
#       | Court details              | Court details                                 |
#       | Contact details            | Parent or guardian contact details            |
#       | Offence details            | Add an offence                                |
#       | Account comments and notes | Account comments and notes                    |
#       | Delete account             | Are you sure you want to delete this account? |

#   Scenario: Manual account creation - Accessibility - Welsh language screens
#     Given I am on the Opal Frontend and I sign in as "opal-test-8@HMCTS.NET"
#     And I navigate to Manual Account Creation
#     And I select the "Fine" radio button
#     And I select the "Adult or youth" radio button
#     And I click the "Continue" button

#     Then I check accessibility

#     Then I see "Account details" on the page header
#     Then I click the "Document language" change link in the account details table

#     Then I check accessibility
#     Then I click the Sign out link

#   Scenario: Manual account creation - Accessibility - Offence summary screen
#     Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     And I am on the dashboard
#     And I navigate to Manual Account Creation

#     And I see "Business unit and defendant type" on the page header
#     And I enter "West London" into the business unit search box
#     And I select the "Fine" radio button
#     And I select the "Adult or youth with parent or guardian to pay" radio button
#     And I click the "Continue" button
#     And I see "Account details" on the page header
#     And I click on the "Offence details" link
#     Then I see "Add an offence" on the page header
#     And I see "Offence details" text on the page

#     When I enter "TP11003" into the "Offence code" field
#     And I enter a date 9 weeks into the past into the "Date of sentence" date field
#     And I click the "Add another imposition" button
#     And I enter "Fine (FO)" into the "Result code" field for imposition 1
#     And I enter "200" into the "Amount imposed" field for imposition 1
#     And I enter "50" into the "Amount paid" field for imposition 1

#     And I enter "Criminal Courts Charge (FCC)" into the "Result code" field for imposition 2
#     And I enter "300" into the "Amount imposed" field for imposition 2
#     And I enter "100" into the "Amount paid" field for imposition 2

#     Then I check accessibility

#     And I click the "Review offence" button
#     Then I see "Offences and impositions" on the page header

#     Then I check accessibility
