Feature: PO-654 - Enabling the review account button - Company

### Descoped by PO-663 - functionality is covered there


# Background:
#   Given I am on the OPAL Frontend
#   When I see "Opal" in the header

#   Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
#   And I am on the dashboard
#   And I navigate to Manual Account Creation

#   And I see "Business unit and defendant type" on the page header
#   And I enter "West London" into the business unit search box
#   And I select the "Fine" radio button
#   And I select the "Company" radio button
#   And I click the "Continue" button
#   And I see "Account details" on the page header

# Scenario: AC1,2 - User navigates to account details screen, presses return to account details after entering mandatory information
#   ### Check the button is not displayed when no data has been entered
#   Given I see "Account details" on the page header
#   And I see the status of "Court details" is "Not provided"
#   And I see the status of "Company details" is "Not provided"
#   And I see the status of "Contact details" is "Not provided"
#   And I see the status of "Offence details" is "Not provided"
#   And I see the status of "Payment terms" is "Not provided"
#   And I see the status of "Account comments and notes" is "Not provided"
#   And I see the "Check and submit for review" section heading
#   And I see "Check that all required fields have been entered before you submit for review" text on the page
#   And the button with text "Review account" should not be present

#   ### Court Details
#   When I click on the "Court details" link
#   And I see "Court details" on the page header
#   And I enter "Central London Magistrates' Court (2570)" into the "Sending area or Local Justice Area (LJA)" search box
#   And I enter "AC123NMJT" into the "Prosecutor Case Reference (PCR)" field
#   And I enter "ACTON (820)" into the "Enforcement court" search box

#   When I click the "Return to account details" button
#   Then I see "Account details" on the page header
#   And I see the status of "Court details" is "Provided"
#   And I see "Check that all required fields have been entered before you submit for review" text on the page
#   And the button with text "Review account" should not be present

#   ### Company Details
#   When I click on the "Company details" link
#   And I see "Company details" on the page header
#   And I enter "CNAME" into the "Company name" field
#   And I enter "ADDR1" into the "Address line 1" field

#   When I click the "Return to account details" button
#   Then I see "Account details" on the page header
#   And I see the status of "Company details" is "Provided"
#   And I see "Check that all required fields have been entered before you submit for review" text on the page
#   And the button with text "Review account" should not be present

#   ### Offence Details
#   When I click on the "Offence details" link
#   And I see "Add an offence" on the page header

#   Then I enter "TP11003" into the "Offence code" field
#   And I enter a date 9 weeks into the past into the "Date of sentence" date field

#   Then I enter "Fine (FO)" into the "Result code" field for imposition 1
#   And I enter "200" into the "Amount imposed" field for imposition 1
#   And I enter "50" into the "Amount paid" field for imposition 1

#   Then I click the "Review offence" button
#   And I see "Offences and impositions" on the page header

#   Then I click the "Return to account details" button
#   And I see "Account details" on the page header
#   And I see the status of "Offence details" is "Provided"
#   And I see the status of "Payment terms" is "Not provided"
#   And the button with text "Review account" should not be present

#   ### Payment Terms
#   When I click on the "Payment terms" link
#   And I see "Payment terms" on the page header
#   And I select the "Pay in full" radio button
#   And I enter a date 28 weeks into the future into the "Enter pay by date" date field

#   ### Button is now enabled
#   When I click the "Return to account details" button
#   Then I see "Account details" on the page header
#   And I see the status of "Payment terms" is "Provided"
#   And I see the "Review account" button
#   And I do not see "Check that all required fields have been entered before you submit for review" text on the page

#   ### Click the button
#   When I click the "Review account" button
#   Then I see "Check account details" on the page header
