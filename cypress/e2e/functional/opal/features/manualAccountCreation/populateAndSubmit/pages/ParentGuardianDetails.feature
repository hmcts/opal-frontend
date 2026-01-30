@ManualAccountCreation @ParentGuardianDetails @PO-344 @PO-364 @PO-436
Feature: Manual account creation - Parent Guardian Details
  #This feature file contains tests for the Parent guardian details page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the CompanyDetailsComponent.cy.ts component tests

  Background:
    Given I am logged in with email "opal-test@hmcts.net"
    And I start a fine manual account for business unit "West London" with defendant type "Adult or youth with parent or guardian to pay"
    And I view the "Parent or guardian details" task

  Scenario: (AC.6, AC.5) Entered data persists in the session [@PO-344, @PO-364, @PO-436]
    When I complete parent or guardian details:
      | firstNames          | FNAME       |
      | lastName            | LNAME       |
      | addAliases          | true        |
      | alias1.firstNames   | ALIAS FNAME |
      | alias1.lastName     | ALIAS LNAME |
      | alias2.firstNames   | ALIAS FNAME |
      | alias2.lastName     | ALIAS LNAME |
      | dobYearsAgo         | 18          |
      | addressLine1        | Addr1       |
      | addressLine2        | Addr2       |
      | addressLine3        | Addr3       |
      | postcode            | TE1 1ST     |
      | vehicleMake         | CarMake     |
      | vehicleRegistration | CARREG      |
    And I return to account details from parent or guardian details
    Then the "Parent or guardian details" task status is "Provided"
    When I view the "Parent or guardian details" task
    Then I see parent or guardian details populated:
      | firstNames          | FNAME       |
      | lastName            | LNAME       |
      | addAliasesChecked   | true        |
      | alias1.firstNames   | ALIAS FNAME |
      | alias1.lastName     | ALIAS LNAME |
      | alias2.firstNames   | ALIAS FNAME |
      | alias2.lastName     | ALIAS LNAME |
      | addressLine1        | Addr1       |
      | addressLine2        | Addr2       |
      | addressLine3        | Addr3       |
      | postcode            | TE1 1ST     |
      | vehicleMake         | CarMake     |
      | vehicleRegistration | CARREG      |
    When I restart manual fine account for business unit "West London" with defendant type "Adult or youth with parent or guardian to pay"
    Then the "Parent or guardian details" task status is "Not provided"
    When I view the "Parent or guardian details" task
    Then I see parent or guardian details populated:
      | firstNames          |       |
      | lastName            |       |
      | addAliasesChecked   | false |
      | addressLine1        |       |
      | addressLine2        |       |
      | addressLine3        |       |
      | postcode            |       |
      | vehicleMake         |       |
      | vehicleRegistration |       |

  Scenario: (AC.5) Grey navigation links routes correctly [@PO-344, @PO-436]
    When I complete parent or guardian details:
      | firstNames   | FNAME |
      | lastName     | LNAME |
      | addressLine1 | Addr1 |
    And I continue to parent or guardian contact details
    Then I should see the header containing text "Parent or guardian contact details"

  Scenario: (AC.6, AC.7, AC.8) Confirming cancel clears unsaved parent or guardian details
    When I complete parent or guardian details:
      | firstNames          | FNAME         |
      | lastName            | LNAME         |
      | addAliases          | true          |
      | alias1.firstNames   | ALIAS 1 FNAME |
      | alias1.lastName     | ALIAS 1 LNAME |
      | alias2.firstNames   | ALIAS 2 FNAME |
      | alias2.lastName     | ALIAS 2 LNAME |
      | dobYearsAgo         | 18            |
      | addressLine1        | Addr1         |
      | addressLine2        | Addr2         |
      | addressLine3        | Addr3         |
      | postcode            | TE1 1ST       |
      | vehicleMake         | CarMake       |
      | vehicleRegistration | CARREG        |
    And I cancel parent or guardian details choosing "Ok"
    Then the "Parent or guardian details" task status is "Not provided"

    When I view the "Parent or guardian details" task
    Then I see parent or guardian details populated:
      | firstNames          |       |
      | lastName            |       |
      | addAliasesChecked   | false |
      | addressLine1        |       |
      | addressLine2        |       |
      | addressLine3        |       |
      | postcode            |       |
      | vehicleMake         |       |
      | vehicleRegistration |       |

  Scenario: (AC.6, AC.7) Dismissing cancel retains parent or guardian details
    When I complete parent or guardian details:
      | firstNames   | FNAME |
      | lastName     | LNAME |
      | addressLine1 | Addr1 |
    And I cancel parent or guardian details choosing "Cancel"
    Then I see parent or guardian details populated:
      | firstNames   | FNAME |
      | lastName     | LNAME |
      | addressLine1 | Addr1 |

  Scenario: (AC.7, AC.8) Confirming cancel restores last saved parent or guardian details
    When I complete parent or guardian details:
      | firstNames   | FNAME |
      | lastName     | LNAME |
      | addressLine1 | Addr1 |
    And I return to account details from parent or guardian details
    Then the "Parent or guardian details" task status is "Provided"

    When I view the "Parent or guardian details" task
    And I complete parent or guardian details:
      | firstNames   | FNAME EDITED |
      | addressLine2 | Addr2        |
    And I cancel parent or guardian details choosing "Ok"
    Then I should see the header containing text "Account details"

    When I view the "Parent or guardian details" task
    Then I see parent or guardian details populated:
      | firstNames   | FNAME |
      | lastName     | LNAME |
      | addressLine1 | Addr1 |
      | addressLine2 |       |

  Scenario: (AC.6, AC.8) Parent or guardian first names error persists on cancel
    When I complete parent or guardian details:
      | firstNames   | FNAME |
      | lastName     | LNAME |
      | addressLine1 | Addr1 |
    And I return to account details from parent or guardian details

    When I view the "Parent or guardian details" task
    And I clear the following parent or guardian fields:
      | Field       |
      | First names |
    When I attempt to return to account details from parent or guardian details
    Then I see the parent or guardian "First names" error "Enter parent or guardian's first name(s)"

    When I cancel parent or guardian details choosing "Cancel"
    Then I see parent or guardian details populated:
      | firstNames |  |
    And I see the parent or guardian "First names" error "Enter parent or guardian's first name(s)"


  Scenario: Parent guardian details - Axe Core
    Then I check the page for accessibility

