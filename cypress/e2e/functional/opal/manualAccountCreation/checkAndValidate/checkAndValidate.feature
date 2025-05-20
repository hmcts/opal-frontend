Feature: PO-6 Navigate and edit sections from task list

    Background:
        Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
        Then I am on the dashboard

        Given I navigate to Create and Manage Draft Accounts


    Scenario: AC8 - Navigate and validate account sections for a rejected account

        Given I create a "company" draft account with the following details:
            | account_status | Rejected |
        When I update the last created draft account with status "Rejected"

        Then I click on the "Rejected" link


# When I click on the rejected tab and ensure there are three accounts
# Then I click on the "LNAME, FNAME1" link


# And I see the "Check and submit" section heading
# And I see the status of "Court details" is "Provided"
# And I see the status of "Personal details" is "Provided"
# And I see the status of "Contact details" is "Provided"
# And I see the status of "Employer details" is "Provided"
# And I see the status of "Offence details" is "Provided"
# And I see the status of "Payment terms" is "Provided"
# And I see the status of "Account comments and notes" is "Provided"

# When I click on the "Court details" link
# Then I see "Court details" on the page header
# When I click the "Return to account details" button
# Then I see "Account details" on the page header

# When I click on the "Personal details" link
# Then I see "Personal details" on the page header
# When I click the "Return to account details" button
# Then I see "Account details" on the page header

# When I click on the "Contact details" link
# Then I see "Contact details" on the page header
# When I click the "Return to account details" button
# Then I see "Account details" on the page header

# When I click on the "Check account" button
# Then I see "Check account details" on the page header


