# Feature: Manual fixed penalty account creation - Create Draft Account

#     Background:
#         Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
#         Then I am on the dashboard

#     @PO-857
#     Scenario: As a user I can create a fixed penalty draft account for the Adult or youth only defendant type
#         Given I navigate to Manual Account Creation
#         And I enter "West London" into the business unit search box
#         And I select the "Fixed Penalty" radio button
#         And I select the "Adult or youth only" radio button
#         Then I click the "Continue" button