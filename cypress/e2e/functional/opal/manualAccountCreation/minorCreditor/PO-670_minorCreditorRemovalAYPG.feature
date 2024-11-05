Feature: PO-670 - Minor Creditor - Removal - Adult or Youth with Parent or guardian to pay
  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
    And I am on the dashboard
    And I navigate to Manual Account Creation

    And I see "Business unit and defendant type" on the page header
    And I enter "West London" into the business unit search box
    And I select the "Fine" radio button
    And I select the "Adult or youth with parent or guardian to pay" radio button
    And I click the "Continue" button
    And I see "Account details" on the page header
    And I click on the "Offence details" link
    Then I see "Add an offence" on the page header
    And I see "Offence details" text on the page

  Scenario: AC1,2,3,4 - Minor Creditor Removal - Individual
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 1
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link for imposition 1
    Then I see "Minor creditor details" on the page header

    Then I validate the "Individual" radio button is not selected

    When I select the "Individual" radio button
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1
    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor | FNAME LNAME  |
      | Address        | Not provided |
      | Payment method | Not provided |

    When I click on the "Remove" link for imposition 1
    Then I see "Are you sure you want to remove this minor creditor?" on the page header
    And I see the following Minor creditor details:
      | Minor creditor | FNAME LNAME  |
      | Address        | Not provided |
      | Payment method | Not provided |

    When I click on the "No - cancel" link
    Then I see "Add an offence" on the page header
    When I click on the "Show details" link for imposition 1
    And I see the following Minor creditor details for impostion 1:
      | Minor creditor | FNAME LNAME  |
      | Address        | Not provided |
      | Payment method | Not provided |

    When I click on the "Remove" link for imposition 1
    Then I see "Are you sure you want to remove this minor creditor?" on the page header
    And I see the following Minor creditor details:
      | Minor creditor | FNAME LNAME  |
      | Address        | Not provided |
      | Payment method | Not provided |

    When I click the "Yes - remove" button
    Then I see "Add an offence" on the page header
    And I see the "Add minor creditor details" link for imposition 1

  Scenario: AC1,2,3,4 - Minor Creditor Removal - Company
    Given I enter "Compensation (FCOMP){downArrow}{ENTER}" into the "Result code" field for imposition 1
    And I select the "Minor creditor" radio button
    When I click on the "Add minor creditor details" link for imposition 1
    Then I see "Minor creditor details" on the page header

    When I select the "Individual" radio button
    And I select "Mr" from the "Title" dropdown
    And I enter "FNAME" into the "First name" field
    And I enter "LNAME" into the "Last name" field
    And I enter "Addr1" into the "Address Line 1" field
    And I enter "Addr2" into the "Address Line 2" field
    And I enter "Addr3" into the "Address Line 3" field
    And I enter "TE12 3ST" into the "Postcode" field

    Then I select the "I have BACS payment details" checkbox
    And I enter "F LNAME" into the "Name on the account" field
    And I enter "123456" into the "Sort code" field
    And I enter "12345678" into the "Account number" field
    And I enter "REF" into the "Payment reference" field

    When I click the "Save" button
    Then I see "Add an offence" on the page header

    When I click on the "Show details" link for imposition 1

    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor    | FNAME LNAME             |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |

    When I click on the "Remove" link for imposition 1
    Then I see "Are you sure you want to remove this minor creditor?" on the page header
    And I see the following Minor creditor details:
      | Minor creditor    | FNAME LNAME             |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |

    When I click on the "No - cancel" link
    Then I see "Add an offence" on the page header
    When I click on the "Show details" link for imposition 1
    And I see the following Minor creditor details for impostion 1:
      | Minor creditor    | FNAME LNAME             |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |

    When I click on the "Remove" link for imposition 1
    Then I see "Are you sure you want to remove this minor creditor?" on the page header
    And I see the following Minor creditor details:
      | Minor creditor    | FNAME LNAME             |
      | Address           | Addr1Addr2Addr3TE12 3ST |
      | Payment method    | BACS                    |
      | Account name      | F LNAME                 |
      | Sort code         | 12-34-56                |
      | Account number    | 12345678                |
      | Payment reference | REF                     |

    When I click the "Yes - remove" button
    Then I see "Add an offence" on the page header
    And I see the "Add minor creditor details" link for imposition 1
