Feature: PO-411 PO-852 Create the 'Add an offence' screen and Review Offence button- Adult or youth only

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth only" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page

  Scenario: AC1, AC2, AC3, AC4, AC5 & AC6 - New screen and fields

    When I click on the "search the offence list" link
    And I see "Search offences" on the page header
    And I click on the "Back" link
    Then I see "Add an offence" on the page header

    When I see "For example, 31/01/2023" hint text above the "Date of sentence" date picker
    And I enter a date 9 weeks into the past into the "Date of sentence" date field
    And I see "For example, HY35014. If you don't know the offence code, you can" hint text on the page
    And I enter "AB12345" into the "Offence code" field
    Then I see "Offence not found" help text on the page
    And I see "Enter a valid offence code" help text on the page

    When I enter "TP11003" into the "Offence code" field
    Then I see "Offence found" help text on the page
    And I see "Possess potentially dangerous item on Transport for London road transport premises" help text on the page

    When I see "Impositions" text on the page
    And I enter "Compensation (FCOMP)" into the "Result code" search box
    And I enter "100" into the "Amount imposed" payment field
    And I enter "50" into the "Amount paid" payment field
    Then I see "Add creditor" text on the page
    And I validate the "Major creditor" radio button is not selected
    And I validate the "Minor creditor" radio button is not selected

    When I select the "Major creditor" radio button
    Then I validate the "Major creditor" radio button is selected
    And I validate the "Minor creditor" radio button is not selected

    When I select the "Minor creditor" radio button
    Then I validate the "Major creditor" radio button is not selected
    And I validate the "Minor creditor" radio button is selected

    When I enter "Fine (FO)" into the "Result code" search box
    And I enter "25" into the "Amount imposed" payment field
    And I do not see "Add creditor" text on the page
    And I enter "Victim Surcharge (FVS)" into the "Result code" search box
    And I enter "50" into the "Amount imposed" payment field
    And I do not see "Add creditor" text on the page
    And I enter "Costs to Crown Prosecution Service (FCPC)" into the "Result code" search box
    And I enter "75" into the "Amount imposed" payment field
    And I do not see "Add creditor" text on the page
    And I enter "Criminal Courts Charge (FCC)" into the "Result code" search box
    And I enter "100" into the "Amount imposed" payment field
    And I do not see "Add creditor" text on the page
    And I enter "Vehicle Excise Back Duty (FVEBD)" into the "Result code" search box
    And I enter "125" into the "Amount imposed" payment field
    And I do not see "Add creditor" text on the page
    And I enter "FORFEITED RECOGNISANCE (FFR)" into the "Result code" search box
    And I enter "150" into the "Amount imposed" payment field
    And I do not see "Add creditor" text on the page

    When I click Cancel, a window pops up and I click Ok
    And I click on the "Offence details" link
    When I enter "Costs (FCOST)" into the "Result code" search box
    And I enter "200" into the "Amount imposed" payment field
    And I enter "100" into the "Amount paid" payment field
    Then I see "Add creditor" text on the page
    And I validate the "Major creditor" radio button is not selected
    And I validate the "Minor creditor" radio button is not selected

  Scenario: AC5 & AC6 - Adding multiple impositions

    When the link with text "Remove imposition" should not be present
    Then I click the "Add another imposition" button
    And I click the "Add another imposition" button
    And I enter "Fine (FO)" into the "Result code" field for imposition 1
    And I enter "200" into the "Amount imposed" field for imposition 1
    And I enter "100" into the "Amount paid" field for imposition 1
    And I enter "Compensation (FCOMP)" into the "Result code" field for imposition 2
    And I enter "400" into the "Amount imposed" field for imposition 2
    And I enter "200" into the "Amount paid" field for imposition 2
    And I enter "Victim Surcharge (FVS)" into the "Result code" field for imposition 3
    And I enter "500" into the "Amount imposed" field for imposition 3
    And I enter "250" into the "Amount paid" field for imposition 3

    And I see "Remove imposition" link for imposition 1
    And I see "Remove imposition" link for imposition 2
    And I see "Remove imposition" link for imposition 3

  Scenario: AC7 - Error handling

    When I click the "Review offence" button
    Then I see the error message "Enter sentence date" at the top of the page
    And I see the error message "Enter an offence code" at the top of the page
    And I see the error message "Enter an imposition code" at the top of the page
    #And I see the error message "Enter an amount" at the top of the page
    And I see the error message "Enter amount imposed" at the top of the page
    And I see the error message "Enter sentence date" above the "Date of sentence" date field
    And I see the error message "Enter an offence code" above the "Offence code" field
    And I see the error message "Enter an imposition code" above the result code field
    #And I see the error message "Enter an amount" above the "Amount imposed" payment field
    And I see the error message "Enter amount imposed" above the "Amount imposed" payment field

    When I enter "18.09.2024" into the "Date of sentence" date field
    And I enter "AB12345" into the "Offence code" field
    And I enter "25a" into the "Amount imposed" payment field
    And I enter "1234567891234567890" into the "Amount paid" payment field
    And I click the "Review offence" button
    Then I see the error message "Enter date of sentence in the format DD/MM/YYYY" at the top of the page
    And I see the error message "Offence not found" at the top of the page
    #updated error messages on PO-852
    #And I see the error message "Enter an amount using numbers only" at the top of the page
    And I see the error message "Enter a valid amount" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Enter date of sentence in the format DD/MM/YYYY" above the "Date of sentence" date field
    And I see the error message "Offence not found" above the "Offence code" field
    #updated error messages on PO-852
    #And I see the error message "Enter an amount using numbers only" above the "Amount imposed" payment field
    And I see the error message "Enter a valid amount" above the "Amount imposed" payment field
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount paid" payment field

    When I enter "32/09/2024" into the "Date of sentence" date field
    And I enter "1234567891234567890" into the "Amount imposed" payment field
    And I enter "50b" into the "Amount paid" payment field
    And I click the "Review offence" button
    Then I see the error message "Enter a valid date of sentence" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    #updated error messages on PO-852
    #And I see the error message "Enter an amount using numbers only" at the top of the page
    And I see the error message "Enter a valid amount" at the top of the page
    And I see the error message "Enter a valid date of sentence" above the "Date of sentence" date field
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount imposed" payment field
    #updated error messages on PO-852
    #And I see the error message "Enter an amount using numbers only" above the "Amount paid" payment field
    And I see the error message "Enter a valid amount" above the "Amount paid" payment field

    When I enter a date 2 weeks into the future into the "Date of sentence" date field
    And I enter "200.255" into the "Amount imposed" payment field
    And I enter "100.50" into the "Amount paid" payment field
    And I click the "Review offence" button
    #updated error message on PO-852
    #Then I see the error message "Enter a valid date of sentence in the past" at the top of the page
    Then I see the error message "Sentence date must not be in the future" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    #updated error message on PO-852
    #And I see the error message "Enter a valid date of sentence in the past" above the "Date of sentence" date field
    And I see the error message "Sentence date must not be in the future" above the "Date of sentence" date field
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount imposed" payment field

    When I enter "100.525" into the "Amount paid" payment field
    And I enter "200.25" into the "Amount imposed" payment field
    And I click the "Review offence" button
    Then I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" at the top of the page
    And I see the error message "Enter an amount that is no more than 18 numbers before the decimal and 2 or less after" above the "Amount paid" payment field

  Scenario: AC8 - Validation passes, review offence, return to account details

    When I enter a date 2 weeks into the past into the "Date of sentence" date field
    And I enter "TP11003" into the "Offence code" field
    And I enter "Fine (FO)" into the "Result code" search box
    And I enter "200" into the "Amount imposed" payment field
    And I enter "100" into the "Amount paid" payment field
    And I click the "Review offence" button
    Then I see "Offences and impositions" on the page header
    And I see green banner on the top of the page

    When I click the "Return to account details" button
    Then I see "Account details" on the page header
    And I see the status of "Offence details" is "Provided"

    When I click on the "Offence details" link
    And I see "Offences and impositions" on the page header
    And I click on the "Change" link
    Then I see "Add an offence" on the page header
    And I see a date 2 weeks into the past in the "Date of sentence" date field
    And I see "TP11003" in the "Offence code" field
    And I see "Fine (FO)" in the "Result code" searchbox
    And I see "200" in the "Amount imposed" payment field
    And I see "100" in the "Amount paid" payment field

  Scenario: AC9 & AC10 - Cancel link behaviour

    When I click on the "Cancel" link
    Then I see "Account details" on the page header
    And I see the status of "Offence details" is "Not provided"

    When I click on the "Offence details" link
    And I see "Add an offence" on the page header
    When I enter a date 2 weeks into the past into the "Date of sentence" date field
    And I enter "TP11003" into the "Offence code" field
    And I enter "Fine (FO)" into the "Result code" search box
    And I enter "300" into the "Amount imposed" payment field
    And I enter "150" into the "Amount paid" payment field
    And I click Cancel, a window pops up and I click Ok
    Then I see "Account details" on the page header
    And I see the status of "Offence details" is "Not provided"

    When I click on the "Offence details" link
    Then I see "" in the "Date of sentence" date field
    And I see "" in the "Offence code" field
    And I see "" in the "Result code" searchbox
    And I see "" in the "Amount imposed" payment field
    And I see "" in the "Amount paid" payment field

    When I enter a date 3 weeks into the past into the "Date of sentence" date field
    And I enter "Fine (FO)" into the "Result code" search box
    And I enter "200" into the "Amount paid" payment field
    And I click the "Review offence" button
    And I see the error message "Enter an offence code" at the top of the page
    #updated error messages on PO-852
    #And I see the error message "Enter an amount" at the top of the page
    And I see the error message "Enter amount imposed" at the top of the page
    And I see the error message "Enter an offence code" above the "Offence code" field
    #updated error messages on PO-852
    #And I see the error message "Enter an amount" above the "Amount imposed" payment field
    And I see the error message "Enter amount imposed" above the "Amount imposed" payment field
    And I click Cancel, a window pops up and I click Cancel
    Then I see "Add an offence" on the page header
    And I see a date 3 weeks into the past in the "Date of sentence" date field
    And I see "Fine (FO)" in the "Result code" searchbox
    And I see "200" in the "Amount paid" payment field
    And I see the error message "Enter an offence code" at the top of the page
    #updated error messages on PO-852
    #And I see the error message "Enter an amount" at the top of the page
    And I see the error message "Enter amount imposed" at the top of the page
    And I see the error message "Enter an offence code" above the "Offence code" field
    #updated error messages on PO-852
    #And I see the error message "Enter an amount" above the "Amount imposed" payment field
    And I see the error message "Enter amount imposed" above the "Amount imposed" payment field





