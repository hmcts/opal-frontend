Feature: PO-696 - Minor Creditor Show/Hide
  Background:
    Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
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


  Scenario: AC1 - Minor creditor details hidden by default
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

    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor | FNAME LNAME |

    And I do not see the Minor creditor details for impostion 1

  Scenario: AC4 - The User can Show/Hide the Minor Creditor details
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

    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor | FNAME LNAME |

    And I do not see the Minor creditor details for impostion 1
    And I do not see the "Hide" link for imposition 1

    When I click on the "Show" link for imposition 1
    Then I do not see the "Show" link for imposition 1

    And I see the following Minor creditor details for impostion 1:
      | Minor creditor | FNAME LNAME  |
      | Address        | Not provided |
      | Payment method | Not provided |

    When I click on the "Hide" link for imposition 1
    Then I do not see the "Hide" link for imposition 1

    Then I see the following Minor creditor details for impostion 1:
      | Minor creditor | FNAME LNAME |

    And I do not see the Minor creditor details for impostion 1
