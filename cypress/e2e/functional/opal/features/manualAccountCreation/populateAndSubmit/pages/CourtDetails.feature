@ManualAccountCreation @CourtDetails @PO-272 @PO-344 @PO-345 @PO-389 @PO-527 @PO-529
Feature: Manual account creation - Court Details
  #This feature file contains tests for the Court Details page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the CourtDetailsComponent.cy.ts component tests
  #Tests for conditional rendering (different defendant types) are contained in the CourtDetailsComponent.cy.ts component tests

  Background:
    Given I am logged in with email "opal-test@hmcts.net"
    When I start a fine manual account for business unit "West London" with defendant type "Adult or youth only"
    And I view the "Court details" task

  Scenario: (AC.8, AC.9) Entered data persists in the session [@PO-272, @PO-344, @PO-345, @PO-389, @PO-527, @PO-529]
    When I complete manual court details:
      | Sending area or Local Justice Area (LJA) | Avon                    |
      | Prosecutor Case Reference (PCR)          | 1234                    |
      | Enforcement court                        | West London VPFPO (101) |
    And I return to account details
    Then the "Court details" task status is "Provided"
    When I view the "Court details" task
    Then the manual court details fields are:
      | Sending area or Local Justice Area (LJA) | Avon & Somerset Magistrates' Court (1450) |
      | Prosecutor Case Reference (PCR)          | 1234                                      |
      | Enforcement court                        | West London VPFPO (101)                   |
    When I restart manual fine account for business unit "West London" with defendant type "Adult or youth only"
    Then the "Court details" task status is "Not provided"
    When I view the "Court details" task
    Then the manual court details fields are:
      | Sending area or Local Justice Area (LJA) |  |
      | Prosecutor Case Reference (PCR)          |  |
      | Enforcement court                        |  |

  Scenario: (AC.10) Unsaved court details are cleared when user confirms cancel [@PO-272, @PO-344, @PO-345, @PO-389, @PO-527, @PO-529]
    When I complete manual court details:
      | Sending area or Local Justice Area (LJA) | Avon              |
      | Prosecutor Case Reference (PCR)          | 1234              |
      | Enforcement court                        | West London VPFPO |
    And I cancel manual court details choosing "Ok" and return to account details
    Then the "Court details" task status is "Not provided"
    When I view the "Court details" task
    Then the manual court details fields are:
      | Sending area or Local Justice Area (LJA) |  |
      | Prosecutor Case Reference (PCR)          |  |
      | Enforcement court                        |  |

  Scenario: (AC.11) Confirming cancel restores last saved court details [@PO-272, @PO-344, @PO-345, @PO-389, @PO-527, @PO-529]
    When I complete manual court details:
      | Sending area or Local Justice Area (LJA) | Avon              |
      | Prosecutor Case Reference (PCR)          | 1234              |
      | Enforcement court                        | West London VPFPO |
    And I return to account details
    Then the "Court details" task status is "Provided"

    When I view the "Court details" task
    And I complete manual court details:
      | Prosecutor Case Reference (PCR) | 4321 |
    And I cancel manual court details choosing "Ok" and return to account details

    When I view the "Court details" task
    Then the manual court details fields are:
      | Prosecutor Case Reference (PCR) | 1234 |

  Scenario: (AC.11) Unsaved court details are retained when cancel is dismissed
    When I complete manual court details:
      | Prosecutor Case Reference (PCR) | 4321 |
    And I cancel manual court details choosing "Cancel"
    Then the manual court details fields are:
      | Prosecutor Case Reference (PCR) | 4321 |

  Scenario: Court Details - Axe Core
    Then I check accessibility

  Scenario: (AC.6) Grey navigation links routes correctly [@PO-272, @PO-389]
    When I complete manual court details:
      | Sending area or Local Justice Area (LJA) | Avon              |
      | Prosecutor Case Reference (PCR)          | 1234              |
      | Enforcement court                        | West London VPFPO |
    And I continue to personal details from court details
    Then I should see the header containing text "Personal details"
