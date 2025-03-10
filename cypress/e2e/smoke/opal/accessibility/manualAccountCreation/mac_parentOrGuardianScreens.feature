##############################################

###### NOW COVERED IN FUNCTIONAL TESTS #######

##############################################

# Feature: Manual account creation - Parent or guardian screens - accessibility

#   Scenario Outline: Manual account creation - Accessibility - Parent or guardian screens
#     Given I am on the OPAL Frontend
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
#       | screen                     | pageHeading                |
#       | Parent or guardian details | Parent or guardian details |
