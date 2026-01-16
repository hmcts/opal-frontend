@ManualAccountCreation @ContactDetails @PO-272 @PO-344 @PO-345 @PO-419 @PO-371 @PO-370 @PO-358 @UAT-Technical
Feature: Manual account creation - Contact Details
  #This feature file contains tests for the Contact Details page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the ContactDetailsComponent.cy.ts component tests
  #Tests for conditional rendering (different defendant types) are contained in the ContactDetailsComponent.cy.ts component tests

  Background:
    Given I am logged in with email "opal-test@hmcts.net"
    And I start a fine manual account for business unit "West London" with defendant type "Adult or youth only"
    And I view the "Contact details" task

  Scenario: (AC.9) Entered data persists in the session [@PO-272, @PO-344, @PO-345, @PO-419, @PO-371, @PO-370, @PO-358]
    When I complete manual contact details:
      | Primary email address   | P@EMAIL.COM   |
      | Secondary email address | S@EMAIL.COM   |
      | Mobile telephone number | 07123 456 789 |
      | Home telephone number   | 07123 456 789 |
      | Work telephone number   | 07123 456 789 |
    And I return to account details
    Then the "Contact details" task status is "Provided"
    When I view the "Contact details" task
    Then the manual contact details fields are:
      | Primary email address   | P@EMAIL.COM   |
      | Secondary email address | S@EMAIL.COM   |
      | Mobile telephone number | 07123 456 789 |
      | Home telephone number   | 07123 456 789 |
      | Work telephone number   | 07123 456 789 |

    When I restart manual fine account for business unit "West London" with defendant type "Adult or youth only"
    Then the "Contact details" task status is "Not provided"

    When I view the "Contact details" task
    Then the manual contact details fields are:
      | Primary email address   |  |
      | Secondary email address |  |
      | Mobile telephone number |  |
      | Home telephone number   |  |
      | Work telephone number   |  |

  Scenario: (AC.9) Grey navigation links routes correctly [@PO-272, @PO-344, @PO-345, @PO-419, @PO-371, @PO-370, @PO-358]
    When I complete manual contact details:
      | Primary email address | P@EMAIL.COM |
    And I continue to employer details from contact details

  Scenario: (AC.10) Unsaved contact details are cleared when user confirms cancel [@PO-272, @PO-344, @PO-345, @PO-419, @PO-371, @PO-370, @PO-358]
    When I complete manual contact details:
      | Primary email address   | P@EMAIL.COM   |
      | Mobile telephone number | 07123 456 789 |
    And I confirm cancellation of manual contact details "Ok" and I am taken to account details
    And the "Contact details" task status is "Not provided"

    When I view the "Contact details" task
    Then the manual contact details fields are:
      | Primary email address   |  |
      | Secondary email address |  |
      | Mobile telephone number |  |
      | Home telephone number   |  |
      | Work telephone number   |  |

  Scenario: (AC.10) Unsaved contact details are retained when cancel is dismissed
    When I complete manual contact details:
      | Primary email address   | P@EMAIL.COM   |
      | Mobile telephone number | 07123 456 789 |
    And I cancel manual contact details choosing "Cancel"
    Then I am viewing contact details
    And the manual contact details fields are:
      | Primary email address   | P@EMAIL.COM   |
      | Mobile telephone number | 07123 456 789 |

  Scenario: (AC.11) Confirming cancel restores last saved contact details
    Given I complete manual contact details:
      | Primary email address   | P@EMAIL.COM   |
      | Mobile telephone number | 07123 456 789 |
    And I return to account details
    And the "Contact details" task status is "Provided"
    When I view the "Contact details" task
    And I complete manual contact details:
      | Primary email address   | P-EDIT@EMAIL.COM |
      | Mobile telephone number | 07123 456 789    |
    And I confirm cancellation of manual contact details "Ok" and I am taken to account details

    When I view the "Contact details" task
    Then the manual contact details fields are:
      | Primary email address   | P@EMAIL.COM   |
      | Mobile telephone number | 07123 456 789 |

  Scenario: (AC.11) Inline primary email error persists across navigation and cancel
    When I clear the manual contact "Primary email address" field
    And I complete manual contact details:
      | Primary email address | PEMAIL.COM |
    And I return to account details
    And I see a manual contact inline error "Enter primary email address in the correct format, like name@example.com" for "Primary email address"
    When I cancel manual contact details choosing "Cancel"
    And the manual contact details fields are:
      | Primary email address | PEMAIL.COM |
    And I see a manual contact inline error "Enter primary email address in the correct format, like name@example.com" for "Primary email address"

  Scenario: Contact Details - Axe Core
    Then I check accessibility
