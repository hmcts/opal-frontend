
#New features implemented on Account details page where PO-366 is covering all of the scenarios
# Feature: PO-279 Manual account creation, Adult and Youth account creation page
#   Background:
#     Given I am on the OPAL Frontend
#     Then I see "Opal" in the header

# Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
#     Then I am on the dashboard

#     When I navigate to Manual Account Creation
#     #new feature implemented on Po-346 so deactivating this step
#     #Then I see "Account details" on the page header
#     #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
#     Then I see "Business unit and defendant type" on the page header

#     When I select adults and youth only
#     Then I click on continue button
#   #new feature implemented on Po-346 so deactivating this step
#   #And I click continue to Create Account page


#   Scenario: Business unit above 'Create Account' heading
#     Then I see "Account details" on the page header
#     #The page header being changed on PO-366
#     #And I see "Cambridgeshire" above "Create account"
#     And I see "Create account" above "Account details"

#     And I click the Sign out link

#   Scenario: Only employer details has configured hyperlink
#     When "Court details" is clicked, nothing happens
#     When "Personal details" is clicked, nothing happens
#     #This feature is descoped in PO-366
#     #When "Additional defendant details" is clicked, nothing happens
#     When "Offence details" is clicked, nothing happens
#     When "Payment terms" is clicked, nothing happens

#     When "Employer details" is clicked
#     Then I see "Employer details" on the page header

#     And I click the Sign out link


#   Scenario: Check account and delete account elements are not configured (do nothing)
#     When The button "Check account" is clicked, nothing happens
#     #new feature implementing on PO-366 so deactivating this step
#     #When "Delete account" is clicked, nothing happens
#     Then "Cancel account creation" is clicked
#     And I click the Sign out link

#   Scenario: The back button returns the user to the previous screen
#     When "Back" is clicked
#     #new feature implemented on Po-346 so deactivating this step
#     #Then I see "Account details" on the page header

#     #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
#     Then I see "Business unit and defendant type" on the page header

#     And I click the Sign out link




