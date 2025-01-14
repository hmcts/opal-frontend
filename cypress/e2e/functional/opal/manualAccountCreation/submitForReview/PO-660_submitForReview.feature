Feature: PO-660 Submit for Review

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button
    Then I see "Account details" on the page header

    ### Court Details
    When I click on the "Court details" link
    And I see "Court details" on the page header
    And I enter "Central London Magistrates' Court (2570)" into the "Sending area or Local Justice Area (LJA)" search box
    And I enter "AC123NMJT" into the "Prosecutor Case Reference (PCR)" field
    And I enter "ACTON (820)" into the "Enforcement court" search box

    Then I click the "Return to account details" button

    ### Personal Details
    Then I click on the "Personal details" link
    And I see "Personal details" on the page header
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field
    And I enter "ADDR1" into the "Address line 1" field
    And I enter "car make 1" into the "make and model" field
    And I enter "car reg 1" into the "registration number" field

    Then I click the "Return to account details" button

    ### Offence Details
    Then I click on the "Offence details" link
    And I see "Add an offence" on the page header

    Then I enter "TP11003" into the "Offence code" field
    And I enter a date 9 weeks into the past into the "Date of sentence" date field

    Then I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "50" into the "Amount paid" field for imposition 1

    Then I click the "Review offence" button
    And I see "Offences and impositions" on the page header

    Then I click the "Return to account details" button

    ### Payment Terms
    Then I click on the "Payment terms" link
    And I see "Payment terms" on the page header
    And I select the "Yes" radio button
    And I enter a date 8 weeks into the past into the "Date of collection order" date field
    And I select the "Pay in full" radio button
    And I enter a date 28 weeks into the future into the "Enter pay by date" date field

    Then I click the "Return to account details" button

    ### Click the button
    When I click the "Check account" button
    Then I see "Check account details" on the page header

  Scenario:AC1,2 - User is presented with confirmation screen and can selected to create another account

    When I click the "Submit for review" button and capture the created account number

    Then I see "You've submitted this account for review" text on the page
    And I see "Next steps" text on the page
    And I see the "Create a new account" link
    And I see the "See all accounts in review" link

    When I click on the "Create a new account" link
    Then I see "Business unit and defendant type" on the page header
    And I see "West London" in the "Business unit" searchbox

  Scenario: AC3 - User is presented with confirmation screen and can view all accounts in review

    When I click the "Submit for review" button and capture the created account number

    Then I see "You've submitted this account for review" text on the page
    And I see "Next steps" text on the page
    And I see the "Create a new account" link
    And I see the "See all accounts in review" link

    When I click on the "See all accounts in review" link
    Then I see "Create accounts" on the page header
