Feature: PO-648 days in default calculator on payment terms page - adult or youth only
  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button

    Then I see "Account details" on the page header

  Scenario: AC1,2,3,4 - Presentation of component and month, week, day calculations
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

    When I select the "There are days in default" checkbox
    And I see the Help calculate days in default section is collapsed

    When I click on the Help calculate days in default section
    Then I see the Help calculate days in default section is expanded

    And I see "" in the "years" input in the calculator
    And I see "" in the "months" input in the calculator
    And I see "" in the "weeks" input in the calculator
    And I see "" in the "days" input in the calculator

    And I see the text "Cannot calculate total time in days" in the calculator
    And I see the text "You must enter a date days in default were imposed" in the calculator

    When I enter "1" into the "weeks" input in the calculator
    Then I see the text "Cannot calculate total time in days" in the calculator
    And I see the text "You must enter a date days in default were imposed" in the calculator

    When I enter a date 1 weeks into the past into the "Date days in default were imposed" date field
    Then I see the text "Total time in days" in the calculator
    And I see the text "7 days" in the calculator

    When I enter "05/01/2024" into the "Date days in default were imposed" date field
    When I enter "1" into the "months" input in the calculator
    And I enter "0" into the "weeks" input in the calculator
    And I see the text "31 days" in the calculator

    When I enter "05/02/2024" into the "Date days in default were imposed" date field
    When I enter "1" into the "months" input in the calculator
    And I see the text "29 days" in the calculator

    When I enter "05/02/2025" into the "Date days in default were imposed" date field
    When I enter "1" into the "months" input in the calculator
    And I see the text "28 days" in the calculator

    Then I enter "0" into the "months" input in the calculator
    And I enter "2" into the "weeks" input in the calculator
    And I enter "3" into the "days" input in the calculator
    And I see the text "17 days" in the calculator


  Scenario: AC1,2,3,4 - Presentation of component and year and leap year calculations
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

    When I select the "There are days in default" checkbox
    And I click on the Help calculate days in default section

    Then I see "" in the "years" input in the calculator
    And I see "" in the "months" input in the calculator
    And I see "" in the "weeks" input in the calculator
    And I see "" in the "days" input in the calculator

    When I enter "05/01/2024" into the "Date days in default were imposed" date field
    And I enter "1" into the "years" input in the calculator
    And I see the text "366 days" in the calculator

    When I enter "05/01/2025" into the "Date days in default were imposed" date field
    And I enter "1" into the "years" input in the calculator
    And I see the text "365 days" in the calculator

####################################################
# MAY NEED REVISION FOR NEGATIVE CALCULATION TESTS #
####################################################
