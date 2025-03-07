Feature: PO-365 PO-652 Creating a fines account for a Company where defendant type is company

  #Cancel link steps adding in this feature to save execution time (stpes added on AC6)

  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@HMCTS.NET"
    Then I am on the dashboard
    When I navigate to Manual Account Creation

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Company" radio button
    And I click the "Continue" button

    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

    Then I see the "Defendant details" section heading
    And I see the "Company details" link under the "Defendant details" section
    And I click on the "Company details" link
    Then I see "Company details" on the page header

  Scenario Outline: AC1a,AC1c,AC12- positive: user can enter data into all the fields where company name field accepts a-z A-Z 0-9 ' - * ( ) _ , . [space]
    When I enter "Amazon_1*(2) Essentials, Deal And Products Ltd's.," into the "Company name" field
    When I enter "12 Warwickshire" into the "Address line 1" field
    And I enter "24-34 Hyderabad Road" into the "Address line 2" field
    And I enter "Telangana" into the "Address line 3" field
    And I enter "AB12 4TH" into the "Postcode" field

    When I select the "Add company aliases" checkbox

    Then I set the "Alias 1", "Company name" to "(Alias) Home 1 Ltd.,"

    And I click the "Add another alias" button
    Then I set the "Alias 2", "Company name" to "Alias Home 2* Ltd.,"

    Then I see the "Remove" link below the "Alias 2", "Company name" input
    And I click the "Add another alias" button

    Then I set the "Alias 3", "Company name" to "Alias-3 Home Ltd.,"

    Then I see the "Remove" link below the "Alias 3", "Company name" input
    And I click the "Add another alias" button

    Then I set the "Alias 4", "Company name" to "Alias's_4 Home Ltd.,"

    Then I see the "Remove" link below the "Alias 4", "Company name" input
    And I click the "Add another alias" button

    Then I set the "Alias 5", "Company name" to "Alias (5) Home Ltd.,"
    Then I see the "Remove" link below the "Alias 5", "Company name" input

    Then I click the "<returnButton>" button and see "<pageName>" on the page header
    Examples:
      | returnButton              | pageName                  |
      | Return to account details | Account details           |
      | Add contact details       | Defendant contact details |

  Scenario Outline: AC2,AC3,AC4,AC5,AC7- positive: verifying 'Add company aliases' box & 'Add another alias' & Remove' [alias]
    When I enter "Amazon_1*(2) Ltd's.," into the "Company name" field
    When I enter "12 Warwickshire" into the "Address line 1" field

    When I select the "Add company aliases" checkbox

    Then I see the text box "Company name" below the sub heading "Alias 1"
    Then I set the "Alias 1", "Company name" to "(Alias) Home 1 Ltd.,"
    And I click the "Add another alias" button

    Then I see the text box "Company name" below the sub heading "Alias 2"
    Then I set the "Alias 2", "Company name" to "Alias Home 2* Ltd.,"
    Then I see the "Remove" link below the "Alias 2", "Company name" input
    And I click the "Add another alias" button

    Then I see the text box "Company name" below the sub heading "Alias 3"
    Then I set the "Alias 3", "Company name" to "Alias-3 Home Ltd.,"
    Then I see the "Remove" link below the "Alias 3", "Company name" input
    And I click the "Add another alias" button

    Then I see the text box "Company name" below the sub heading "Alias 4"
    Then I set the "Alias 4", "Company name" to "Alias's_4 Home Ltd.,"
    Then I see the "Remove" link below the "Alias 4", "Company name" input
    And I click the "Add another alias" button

    Then I see the text box "Company name" below the sub heading "Alias 5"
    Then I set the "Alias 5", "Company name" to "Alias (5) Home Ltd.,"
    Then I see the "Remove" link below the "Alias 5", "Company name" input

    Then I unselect the "Add company aliases" checkbox
    Then I do not see "Alias 1" below the "Add company aliases" checkbox
    When I select the "Add company aliases" checkbox

    Then I see "Alias 1", "Company name" is set to ""

  Scenario: AC6-positive: If there are between 2 and 5 aliases, when a user selects 'Remove' [alias]
    When I enter "Amazon_1*(2) Ltd's.," into the "Company name" field
    When I enter "12 Warwickshire" into the "Address line 1" field

    When I select the "Add company aliases" checkbox
    Then I see the text box "Company name" below the sub heading "Alias 1"
    Then I set the "Alias 1", "Company name" to "(Alias) Home 1 Ltd.,"
    And I click the "Add another alias" button

    Then I see the text box "Company name" below the sub heading "Alias 2"
    Then I set the "Alias 2", "Company name" to "Alias Home 2* Ltd.,"
    Then I see the "Remove" link below the "Alias 2", "Company name" input
    And I click the "Add another alias" button

    Then I see the text box "Company name" below the sub heading "Alias 3"
    Then I set the "Alias 3", "Company name" to "Alias-3 Home Ltd.,"
    Then I see the "Remove" link below the "Alias 3", "Company name" input
    And I click the "Add another alias" button

    Then I see the text box "Company name" below the sub heading "Alias 4"
    Then I set the "Alias 4", "Company name" to "Alias's_4 Home Ltd.,"
    Then I see the "Remove" link below the "Alias 4", "Company name" input
    And I click the "Add another alias" button

    Then I see the text box "Company name" below the sub heading "Alias 5"
    Then I set the "Alias 5", "Company name" to "Alias (5) Home Ltd.,"
    Then I see the "Remove" link below the "Alias 5", "Company name" input

    And I select "Remove" link below the "Alias 5", "Company name" input
    And I see "Add another alias" button below the "Remove" link

    And I select "Remove" link below the "Alias 4", "Company name" input
    And I see "Add another alias" button below the "Remove" link

    And I select "Remove" link below the "Alias 3", "Company name" input
    And I see "Add another alias" button below the "Remove" link

    And I select "Remove" link below the "Alias 2", "Company name" input
    And I see "Add another alias" button

    #verifying cancel button which is developed on PO-652
    When I see the "Cancel" link
    Then I click on the "Cancel" link
    Then I see "Account details" on the page header


  Scenario Outline: AC8- positive: user has not entered data into any mandatory fields (Company name, Address line 1) but has entered data into one or more other optional fields, then upon selecting the 'Return to account details' or 'Add contact details' buttons
    And I enter "24-34 Hyderabad Road" into the "Address line 2" field
    And I enter "Telangana" into the "Address line 3" field
    And I enter "AB12 4TH" into the "Postcode" field

    Then I click the "<returnButton>" button

    Then I see the error message "Enter company name" at the top of the page
    Then I see the error message "Enter address line 1, typically the building and street" at the top of the page
    Examples:
      | returnButton              |
      | Return to account details |
      | Add contact details       |

  Scenario Outline: AC1b,AC9,AC10-negative:If a user has ticked the 'Add Aliases' tick box and does not input any data into Aliases then selecting 'Return to account details' or''Add contact details' buttons
    When I enter "Amazon_1*(2) Essentials, Deal And Products Ltd's.," into the "Company name" field
    When I enter "12 *Warwickshire" into the "Address line 1" field
    When I enter "War*wickshire" into the "Address line 2" field
    When I enter "England**" into the "Address line 3" field


    When I select the "Add company aliases" checkbox

    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button
    And I click the "Add another alias" button

    Then I click the "<returnButton>" button
    Then I see the error message "The address line 1 must not contain special characters" at the top of the page
    Then I see the error message "The address line 2 must not contain special characters" at the top of the page
    Then I see the error message "The address line 3 must not contain special characters" at the top of the page
    Then I see the error message "Enter company name for alias 1" at the top of the page
    Then I see the error message "Enter company name for alias 2" at the top of the page
    Then I see the error message "Enter company name for alias 3" at the top of the page
    Then I see the error message "Enter company name for alias 4" at the top of the page
    Then I see the error message "Enter company name for alias 5" at the top of the page
    And I see "Company details" on the page header
    Examples:
      | returnButton              |
      | Return to account details |
      | Add contact details       |

  Scenario Outline: AC11-negative: user can enter data into all the fields where all validation failures occur
    When I enter "Amazon_1*(2) Essentials, Deals And Products Ltd's.," into the "Company name" field
    When I enter "12 Warwickshire, West midlands of England" into the "Address line 1" field
    And I enter "24-34 Hyderabad Road, Telangana , Hyderabad" into the "Address line 2" field
    And I enter "Telangana England UK" into the "Address line 3" field
    And I enter "AB12 44TH" into the "Postcode" field

    When I select the "Add company aliases" checkbox

    Then I set the "Alias 1", "Company name" to "Essentials (Alias) Home 1 Ltd.,"

    And I click the "Add another alias" button
    Then I set the "Alias 2", "Company name" to "Essentials Alias Home's- 22* Ltd.,"

    Then I see the "Remove" link below the "Alias 2", "Company name" input
    And I click the "Add another alias" button

    Then I set the "Alias 3", "Company name" to "Essentials Alias-3 Home's-34 Ltd.,"

    Then I see the "Remove" link below the "Alias 3", "Company name" input
    And I click the "Add another alias" button

    Then I set the "Alias 4", "Company name" to "Essentials Alias's_4 Home Ltd.,"

    Then I see the "Remove" link below the "Alias 4", "Company name" input
    And I click the "Add another alias" button

    Then I set the "Alias 5", "Company name" to "Essentials Alias (5) Home Ltd.,"
    Then I see the "Remove" link below the "Alias 5", "Company name" input

    Then I click the "<returnButton>" button
    And I see "Company details" on the page header

    Then I see the error message "The company name must be 50 characters or fewer" at the top of the page
    Then I see the error message "The address line 1 must be 30 characters or fewer" at the top of the page
    Then I see the error message "The address line 2 must be 30 characters or fewer" at the top of the page
    Then I see the error message "The address line 3 must be 16 characters or fewer" at the top of the page
    Then I see the error message "The company name must be 30 characters or fewer for alias 1" at the top of the page
    Then I see the error message "The company name must be 30 characters or fewer for alias 2" at the top of the page
    Then I see the error message "The company name must be 30 characters or fewer for alias 3" at the top of the page
    Then I see the error message "The company name must be 30 characters or fewer for alias 4" at the top of the page
    Then I see the error message "The company name must be 30 characters or fewer for alias 5" at the top of the page
    Then I see the error message "The postcode must be 8 characters or fewer" at the top of the page

    When I enter "<updateCompanyName>" into the "Company name" field
    When I enter "<updateAddressLine1>" into the "Address line 1" field
    And I enter "<updateAddressLine2>" into the "Address line 2" field
    And I enter "<updateAddressLine3>" into the "Address line 3" field
    And I enter "<updatePostcode>" into the "Postcode" field

    Then I set the "Alias 1", "Company name" to "<alias1>"
    Then I set the "Alias 2", "Company name" to "<alias2>"
    Then I set the "Alias 3", "Company name" to "<alias3>"
    Then I set the "Alias 4", "Company name" to "<alias4>"
    Then I set the "Alias 5", "Company name" to "<alias5>"

    Then I click the "<returnButton>" button and see "<pageName>" on the page header
    And I see the status of "Company details" is "Provided"
    And I click on the "Company details" link
    Then I see "Company details" on the page header

    Then I see "<updateCompanyName>" in the "Company name" field
    Then I see "<updateAddressLine1>" in the "Address line 1" field
    Then I see "<updateAddressLine2>" in the "Address line 2" field
    Then I see "<updateAddressLine3>" in the "Address line 3" field
    Then I see "<updatePostcode>" in the "Postcode" field

    Then I see "Alias 1", "Company name" is set to "<alias1>"
    Then I see "Alias 2", "Company name" is set to "<alias2>"
    Then I see "Alias 3", "Company name" is set to "<alias3>"
    Then I see "Alias 4", "Company name" is set to "<alias4>"
    Then I see "Alias 5", "Company name" is set to "<alias5>"

    Examples:
      | returnButton              | updateCompanyName | updateAddressLine1  | updateAddressLine2 | updateAddressLine3 | updatePostcode | alias1               | alias2                | alias3             | alias4             | alias5              | pageName                  |
      | Return to account details | Amaxon Ltd.       | 12 Carnoustie Court | Abbey Lane         | England            | SL9 4GH        | (Alias) Home 1 Ltd., | Alias Home's22* Ltd., | Advice Cycle's Org | Managekick*-22 Ltd | Reliance Industries | Account details           |
      | Add contact details       | Amaxon Ltd.       | 12 Carnoustie Court | Abbey Lane         | England            | SL9 4GH        | (Alias) Home 1 Ltd., | Alias Home's22* Ltd., | Advice Cycle's Org | Managekick*-22 Ltd | Reliance Industries | Defendant contact details |

  Scenario: AC13-negative: user has selected 'Cancel' button and not entered data into any fields
    When "Cancel" is clicked
    #Descoped by PO-426 --- Then I see "Create account" as the caption on the page
    Then I see "Account details" on the page header

  Scenario: AC14a-negative: user selects the 'Cancel' button and the user has entered data into one or more fields and selecting 'OK' on warning message
    When I enter "Amazon_1*(2) Essentials, Deals And Products Ltd's.," into the "Company name" field
    When I enter "12 Warwickshire, West midlands of England" into the "Address line 1" field

    Then I click Cancel, a window pops up and I click Ok
    Then I see "Account details" on the page header



  Scenario: AC14b-negative: user selects the 'Cancel' button and the user has entered data into one or more fields and selecting 'Cancel' on warning message
    When I enter "Amazon_1*(2) Essentials, Deals And Products Ltd's.," into the "Company name" field
    When I enter "12 Warwickshire, West midlands of England" into the "Address line 1" field
    Then I click Cancel, a window pops up and I click Cancel
    Then I see "Company details" on the page header
