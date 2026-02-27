@ManualAccountCreation @EmployerDetails @PO-272 @PO-280 @PO-368 @PO-434 @PO-435
Feature: Manual account creation - Employer Details
  #This feature file contains tests for the Employer Details page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the EmployerDetailsComponent.cy.ts component tests
  #Tests for conditional rendering (different defendant types) are contained in the EmployerDetailsComponent.cy.ts component tests

  Background:
    Given I am logged in with email "opal-test@hmcts.net"
    And I start a fine manual account for business unit "West London" with defendant type "Adult or youth only" and originator type "New"
    And I view the "Employer details" task

  Scenario: (AC.7) Entered employer data persists in the session [@PO-272, @PO-280, @PO-368, @PO-434, @PO-435]
    When I complete manual employer details:
      | Employer name      | Test Corp            |
      | Employee reference | AB123456C            |
      | Employer email     | employer@example.com |
      | Employer telephone | 01234567890          |
      | Address line 1     | Addr1                |
      | Address line 2     | Addr2                |
      | Address line 3     | Addr3                |
      | Address line 4     | Addr4                |
      | Address line 5     | Addr5                |
      | Postcode           | TE12 3ST             |
    And I return to account details
    Then the "Employer details" task status is "Provided"
    When I view the "Employer details" task
    Then the manual employer details fields are:
      | Employer name      | Test Corp            |
      | Employee reference | AB123456C            |
      | Employer email     | employer@example.com |
      | Employer telephone | 01234567890          |
      | Address line 1     | Addr1                |
      | Address line 2     | Addr2                |
      | Address line 3     | Addr3                |
      | Address line 4     | Addr4                |
      | Address line 5     | Addr5                |
      | Postcode           | TE12 3ST             |

    When I restart manual fine account for business unit "West London" with defendant type "Adult or youth only"
    Then the "Employer details" task status is "Not provided"
    When I view the "Employer details" task
    Then the manual employer details fields are:
      | Employer name      |  |
      | Employee reference |  |
      | Employer email     |  |
      | Employer telephone |  |
      | Address line 1     |  |
      | Address line 2     |  |
      | Address line 3     |  |
      | Address line 4     |  |
      | Address line 5     |  |
      | Postcode           |  |

  Scenario: (AC.8) Unsaved employer data is cleared when user confirms cancel [@PO-272, @PO-280, @PO-368, @PO-434, @PO-435]
    When I complete manual employer details:
      | Employer name      | Test Corp |
      | Employee reference | AB123456C |
      | Address line 1     | Addr1     |
    And I cancel manual employer details choosing "Ok" and return to account details
    Then the "Employer details" task status is "Not provided"
    When I view the "Employer details" task
    Then the manual employer details fields are:
      | Employer name      |  |
      | Employee reference |  |
      | Employer email     |  |

  Scenario: (AC.9, AC.10) Confirming cancel restores last saved employer details [@PO-272, @PO-280, @PO-368, @PO-434, @PO-435]
    When I complete manual employer details:
      | Employer name      | Test Corp |
      | Employee reference | AB123456C |
      | Address line 1     | Addr1     |
    And I return to account details
    Then the "Employer details" task status is "Provided"

    When I view the "Employer details" task
    And I complete manual employer details:
      | Employer name | Edited Corp |
    And I cancel manual employer details choosing "Ok" and return to account details

    When I view the "Employer details" task
    Then the manual employer details fields are:
      | Employer name | Test Corp |


  Scenario: (AC.9, AC.10) Unsaved employer details are retained when cancel is dismissed [@PO-272, @PO-280, @PO-368, @PO-434, @PO-435]
    When I complete manual employer details:
      | Employer name | Edited Corp |
    And I cancel manual employer details choosing "Cancel"
    Then the manual employer details fields are:
      | Employer name | Edited Corp |


  Scenario: Employer Details - Axe Core
    Then I check the page for accessibility


  Scenario: (AC.1) Grey navigation links routes correctly [@PO-272, @PO-434]
    When I complete manual employer details:
      | Employer name      | Test Corp |
      | Employee reference | AB123456C |
      | Address line 1     | Addr1     |
    And I continue to offence details from employer details
    Then I should see the header containing text "Add an offence"
