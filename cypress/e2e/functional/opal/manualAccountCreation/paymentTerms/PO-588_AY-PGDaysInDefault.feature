Feature: PO-588 days in default on payment terms page - adult or youth with PG to pay

  #####################################
  # AC 5-8 WILL BE COVERED IN PO-648  #
  #####################################

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button

    Then I see "Account details" on the page header

  Scenario: AC1a,2,3,4,9,10,12 - Presentation of component and validation - Return to account details
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header
    When I select title "Mr" from dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "ADDR1" into the "Address line 1" field
    Then I click the "Return to account details" button

    ##################################################################################
    # MAY NEED REVISION WHEN OFFENCES AND IMPOSITIONS DETAILS SECTION IS IMPLEMENTED #
    ##################################################################################

    When I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

    Then I select the "Pay in full" radio button
    And I enter a date 1 weeks into the future into the "Enter pay by date" date field

    When I select the "There are days in default" checkbox
    Then I see the text "Date days in default were imposed" in the days in default section
    And I see the text "This should be whichever date is most recent - the sentencing date or the date of the suspended committal order." in the days in default section
    And I see the text "Enter days in default" in the days in default section
    And I see the Help calculate days in default section is collapsed

    When I click on the Help calculate days in default section
    Then I see the Help calculate days in default section is expanded

    When I click the "Return to account details" button
    Then I see the error message "Enter date days in default were imposed" at the top of the page
    And I see the error message "Enter days in default" at the top of the page

    And I see the error message "Enter date days in default were imposed" above the "Date days in default were imposed" date field
    And I see the error message "Enter days in default" above the days in default input field
    Then I see the error message "Select whether there was a collection order" at the top of the page

    # the next 2 steps are introduced in PO-471, this field is mandatory
    And I select the "Yes" radio button under the "Has a collection order been made?" section
    And I enter "20/05/2024" into the "Date of collection order" date field

    Then I enter a date 1 weeks into the future into the "Date days in default were imposed" date field
    And I enter "ab12" into the days in default input field
    When I click the "Return to account details" button

    Then I see the error message "Date must not be in the future" at the top of the page
    And I see the error message "Enter number of days in default" at the top of the page

    And I see the error message "Date must not be in the future" above the "Date days in default were imposed" date field
    And I see the error message "Enter number of days in default" above the days in default input field

    ###   Subject to Change    ####
    Then I enter "123456" into the days in default input field
    When I click the "Return to account details" button
    Then I see the error message "Days in default needs to be less than 5 digits" at the top of the page
    And I see the error message "Days in default needs to be less than 5 digits" above the days in default input field

    ####   Awaiting Fix   ####
    Then I enter "monday" into the "Date days in default were imposed" date field
    When I click the "Return to account details" button
    Then I see the error message "Default date must be in the format DD/MM/YYYY" at the top of the page
    And I see the error message "Default date must be in the format DD/MM/YYYY" above the "Date days in default were imposed" date field

    Then I enter "1/1/2024" into the "Date days in default were imposed" date field
    And I enter "12345" into the days in default input field

    Then I see "01/01/2024" in the "Date days in default were imposed" date field

    When I click the "Return to account details" button

    When I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

    Then I see "12345" in the days in default input field
    And I see "01/01/2024" in the "Date days in default were imposed" date field

    When I unselect the "There are days in default" checkbox
    And I select the "There are days in default" checkbox

    Then I see "" in the days in default input field
    And I see "" in the "Date days in default were imposed" date field

    When I enter "30" into the days in default input field
    And I enter a date 1 weeks into the past into the "Date days in default were imposed" date field
    When I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Payment terms" is "Provided"

    When I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

    Then I see "30" in the days in default input field
    And I see a date 1 weeks into the past in the "Date days in default were imposed" date field

  Scenario: AC11 - Add account comments and notes
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header
    When I select title "Mr" from dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "ADDR1" into the "Address line 1" field
    Then I click the "Return to account details" button

    ##################################################################################
    # MAY NEED REVISION WHEN OFFENCES AND IMPOSITIONS DETAILS SECTION IS IMPLEMENTED #
    ##################################################################################

    When I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

    # the next 2 steps are introduced in PO-471, this field is mandatory
    And I select the "Yes" radio button under the "Has a collection order been made?" section
    And I enter "20/05/2024" into the "Date of collection order" date field

    Then I select the "Pay in full" radio button
    And I enter a date 1 weeks into the future into the "Enter pay by date" date field

    When I select the "There are days in default" checkbox
    Then I see the text "Date days in default were imposed" in the days in default section
    And I see the text "This should be whichever date is most recent - the sentencing date or the date of the suspended committal order." in the days in default section
    And I see the text "Enter days in default" in the days in default section

    Then I see "" in the days in default input field
    And I see "" in the "Date days in default were imposed" date field

    When I enter "30" into the days in default input field
    And I enter a date 1 weeks into the past into the "Date days in default were imposed" date field
    When I click the "Add account comments and notes" button
    Then I see "Account comments and notes" on the page header
    And I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Payment terms" is "Provided"

    When I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

    Then I see "30" in the days in default input field
    And I see a date 1 weeks into the past in the "Date days in default were imposed" date field

  Scenario: AC13,14 - Cancel pop-up, Ok and Cancel
    And I click on the "Personal details" link
    Then I see "Personal details" on the page header
    When I select title "Mr" from dropdown
    And I enter "FNAME" into the "First names" field
    And I enter "LNAME" into the "Last name" field
    And I enter "ADDR1" into the "Address line 1" field
    Then I click the "Return to account details" button

    ##################################################################################
    # MAY NEED REVISION WHEN OFFENCES AND IMPOSITIONS DETAILS SECTION IS IMPLEMENTED #
    ##################################################################################

    When I click on the "Payment terms" link
    Then I see "Payment terms" on the page header

    Then I select the "Pay in full" radio button
    And I enter a date 1 weeks into the future into the "Enter pay by date" date field

    And I select the "There are days in default" checkbox

    Then I enter "30" into the days in default input field
    And I enter a date 1 weeks into the past into the "Date days in default were imposed" date field
    When I click "Cancel", a window pops up and I click Ok
    Then I see "Account details" on the page header
    And I see the status of "Payment terms" is "Not provided"

    When I click on the "Payment terms" link
    Then I see "Payment terms" on the page header
    And I select the "There are days in default" checkbox

    Then I enter "30" into the days in default input field
    And I enter a date 1 weeks into the past into the "Date days in default were imposed" date field

    When I click "Cancel", a window pops up and I click Cancel
    Then I see "30" in the days in default input field
    And I see a date 1 weeks into the past in the "Date days in default were imposed" date field


