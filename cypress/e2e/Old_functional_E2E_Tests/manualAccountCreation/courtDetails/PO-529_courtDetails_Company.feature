Feature: PO-529 Test scenarios for court details screen - creating a fines account for company

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

    Then I see the "Court details" section heading
    And I see the "Court details" link under the "Court details" section
    And I click on the "Court details" link
    Then I see "Court details" on the page header

  Scenario Outline: AC1, AC2, AC3, AC4, AC8, AC9-positive: User enters data into all the fields
    When I enter "<lja>" into the "Sending area or Local Justice Area (LJA)" search box
    And I see "Search using the code or name of the area that sent the transfer" under the "Sending area or Local Justice Area (LJA)" search box
    And I enter "<prosecutorCaseRef>" into the "Prosecutor Case Reference (PCR)" field
    And I see "Enter the prosecutor's reference number or original account number" under the "Prosecutor Case Reference (PCR)" field
    When I enter "<enforcemnetCourt>" into the "Enforcement court" search box
    And I see "Search using enforcement court or code" under the "Enforcement court" search box

    Then I see "Southern Derbyshire Magistrates' Court (1428)" in the "Sending area or Local Justice Area (LJA)" searchbox
    Then I see "<prosecutorCaseRef>" in the "Prosecutor Case Reference (PCR)" field
    Then I see "ACTON (820)" in the "Enforcement court" searchbox

    Then I click the "<returnButton>" button and see "<pageName>" on the page header
    And I see the status of "Court details" is "Provided"
    Then I click on the "Court details" link
    Then I see "Court details" on the page header

    Then I see "Southern Derbyshire Magistrates' Court (1428)" in the "Sending area or Local Justice Area (LJA)" searchbox
    Then I see "<prosecutorCaseRef>" in the "Prosecutor Case Reference (PCR)" field
    Then I see "ACTON (820)" in the "Enforcement court" searchbox

    Examples:
      | lja      | prosecutorCaseRef              | enforcemnetCourt | returnButton              | pageName        |
      | Southern | AC123NMJTGB345213LKJIUYT765MIO | Acton            | Return to account details | Account details |
      | 1428     | AC123NMJTGB345213LKJIUYT765MIO | 820              | Add company details       | Company details |

  Scenario Outline: AC5, 6-negative: User does not enter data into any of the fields
    When I click the "<returnButton>" button

    Then I see "Court details" on the page header
    And I see the error message "Enter a sending area or Local Justice Area" at the top of the page
    And I see the error message "Enter a Prosecutor Case Reference" at the top of the page
    And I see the error message "Enter an Enforcement court" at the top of the page

    Examples:
      | returnButton              |
      | Return to account details |
      | Add company details       |

  Scenario Outline: AC7bi-negative: User has entered a Prosecutor Case Reference that does not adhere to validation
    When I enter "1450" into the "Sending area or Local Justice Area (LJA)" search box
    When I enter "<pcr>" into the "Prosecutor Case Reference (PCR)" field
    When I enter "821" into the "Enforcement court" search box
    When I click the "<returnButton>" button

    Then I see "Court details" on the page header
    And I see the error message "Enter letters and numbers only" at the top of the page

    Examples:
      | returnButton              | pcr                   |
      | Return to account details | Alpha_1234@rate-09877 |
      | Add company details       | Alpha_1234@rate-09877 |

  Scenario Outline: AC7bii-negative: User has entered a Prosecutor Case Reference that does not adhere to validation
    When I enter "1450" into the "Sending area or Local Justice Area (LJA)" search box
    When I enter "<pcr>" into the "Prosecutor Case Reference (PCR)" field
    When I enter "821" into the "Enforcement court" search box
    When I click the "<returnButton>" button

    Then I see "Court details" on the page header
    And I see the error message "You have entered too many characters. Enter 30 characters or fewer" at the top of the page

    Examples:
      | returnButton              | pcr                                   |
      | Return to account details | Testing prosecutor case reference pcr |
      | Add company details       | Testing prosecutor case reference pcr |

  Scenario: AC10-negative: When user selects 'Cancel' button without data enter
    When "Cancel" is clicked
    Then I see "Account details" on the page header

  Scenario: AC11a-negative: When user selects 'Cancel' and user has entered data into one or more fields then click on 'OK' on a warning message
    When I enter "1450" into the "Sending area or Local Justice Area (LJA)" search box
    When I enter "821" into the "Enforcement court" search box

    Then I click Cancel, a window pops up and I click Ok
    Then I see "Account details" on the page header

  Scenario: AC11a-negative: When user selects 'Cancel' and user has entered data into one or more fields then click on 'Cancel' on a warning message
    When I enter "1450" into the "Sending area or Local Justice Area (LJA)" search box
    When I enter "266" into the "Enforcement court" search box

    Then I click Cancel, a window pops up and I click Cancel
    Then I see "Court details" on the page header
