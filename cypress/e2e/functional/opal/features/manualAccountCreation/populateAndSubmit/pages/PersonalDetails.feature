@ManualAccountCreation @PersonalDetails @PO-272 @PO-360 @PO-369 @PO-433 @PO-502 @PO-505
Feature: Manual account creation - Personal Details
  #This feature file contains tests for the Personal Details page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the PersonalDetailsComponent.cy.ts component tests
  #Tests for conditional rendering (different defendant types) are contained in the PersonalDetailsComponent.cy.ts component tests

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    When I start a fine manual account for business unit "West London" with defendant type "Adult or youth only"
    And I view the "Personal details" task
    Then I should see the header containing text "Personal details"

  Scenario: (AC.13) Personal details persist within the session [@PO-272, @PO-344, @PO-360, @PO-369, @PO-502, @PO-505]
    When I complete manual personal details:
      | title               | Mr          |
      | first names         | FNAME       |
      | last name           | LNAME       |
      | address line 1      | Addr Line 1 |
      | address line 2      | Addr Line 2 |
      | address line 3      | Addr Line 3 |
      | postcode            | TE1 1ST     |
      | date of birth       | 01/01/1990  |
      | make and model      | FORD FOCUS  |
      | registration number | AB12 CDE    |
    And I return to account details
    Then the "Personal details" task status is "Provided"
    When I view the "Personal details" task
    Then the manual personal details fields are:
      | title               | Mr          |
      | first names         | FNAME       |
      | last name           | LNAME       |
      | address line 1      | Addr Line 1 |
      | address line 2      | Addr Line 2 |
      | address line 3      | Addr Line 3 |
      | postcode            | TE1 1ST     |
      | date of birth       | 01/01/1990  |
      | make and model      | FORD FOCUS  |
      | registration number | AB12 CDE    |

  Scenario: (AC.13) Restarting manual account clears personal details [@PO-272, @PO-344, @PO-360, @PO-369, @PO-502, @PO-505]
    When I complete manual personal details:
      | title          | Mr          |
      | first names    | FNAME       |
      | last name      | LNAME       |
      | address line 1 | Addr Line 1 |
    And I return to account details
    Then the "Personal details" task status is "Provided"
    When I refresh the application
    And I restart manual fine account for business unit "West London" with defendant type "Adult or youth only"
    Then the "Personal details" task status is "Not provided"
    When I view the "Personal details" task
    Then the manual personal details fields are:
      | title               | Not selected |
      | first names         |              |
      | last name           |              |
      | address line 1      |              |
      | address line 2      |              |
      | address line 3      |              |
      | postcode            |              |
      | date of birth       |              |
      | make and model      |              |
      | registration number |              |

  Scenario: (AC.14) Confirming cancel clears unsaved personal details [@PO-272, @PO-344, @PO-360, @PO-369, @PO-502, @PO-505]
    When I complete manual personal details:
      | title               | Mr          |
      | first names         | FNAME       |
      | last name           | LNAME       |
      | address line 1      | Addr Line 1 |
      | address line 2      | Addr Line 2 |
      | address line 3      | Addr Line 3 |
      | postcode            | TE1 1ST     |
      | date of birth       | 01/01/1990  |
      | make and model      | FORD FOCUS  |
      | registration number | AB12 CDE    |
    And I cancel manual personal details choosing "Ok"
    Then I am viewing account details
    And the "Personal details" task status is "Not provided"
    When I view the "Personal details" task
    Then the manual personal details fields are:
      | title               | Not selected |
      | first names         |              |
      | last name           |              |
      | address line 1      |              |
      | address line 2      |              |
      | address line 3      |              |
      | postcode            |              |
      | date of birth       |              |
      | make and model      |              |
      | registration number |              |

  Scenario: (AC.15) Confirming cancel restores last saved details [@PO-272, @PO-344, @PO-360, @PO-369, @PO-502, @PO-505]
    When I complete manual personal details:
      | title          | Mr          |
      | first names    | FNAME       |
      | last name      | LNAME       |
      | address line 1 | Addr Line 1 |
    And I return to account details
    Then the "Personal details" task status is "Provided"
    When I view the "Personal details" task
    And I complete manual personal details:
      | first names | FNAME EDITED |
    And I cancel manual personal details choosing "Ok"
    Then I am viewing account details
    And the "Personal details" task status is "Provided"
    When I view the "Personal details" task
    Then the manual personal details fields are:
      | title          | Mr          |
      | first names    | FNAME       |
      | last name      | LNAME       |
      | address line 1 | Addr Line 1 |

  Scenario: (AC.15) Dismissing cancel keeps unsaved personal details on the page [@PO-272, @PO-344, @PO-360, @PO-369, @PO-502, @PO-505]
    When I complete manual personal details:
      | title          | Mr          |
      | first names    | FNAME       |
      | last name      | LNAME       |
      | address line 1 | Addr Line 1 |
    And I return to account details
    Then the "Personal details" task status is "Provided"
    When I view the "Personal details" task
    And I complete manual personal details:
      | first names | FNAME EDITED |
    And I cancel manual personal details choosing "Cancel"
    Then I should see the header containing text "Personal details"
    And the manual personal details fields are:
      | first names | FNAME EDITED |

  Scenario: Personal Details - Axe Core
    Then I check the page for accessibility

  Scenario: (AC.1) Grey navigation links routes correctly [@PO-272, @PO-433]
    When I complete manual personal details:
      | title          | Mr          |
      | first names    | FNAME       |
      | last name      | LNAME       |
      | address line 1 | Addr Line 1 |
    And I continue to contact details from personal details
    Then I should see the header containing text "Defendant contact details"
