@ManualAccountCreation @PaymentTerms @PO-272 @PO-344 @PO-345 @PO-545 @PO-429 @PO-587 @PO-592
Feature: Manual account creation - Payment Terms
  #This feature file contains tests for the Payment Terms page of the Manual Account Creation journey that cannot be exercised in the component tests #
  #Validation tests are contained in the PaymentTermsComponent.cy.ts component tests
  #Tests for conditional rendering (different defendant types) are contained in the PaymentTermsComponent.cy.ts component tests

  Background:
    Given I am logged in with email "opal-test@HMCTS.NET"
    When I start a fine manual account for business unit "West London" with defendant type "Adult or youth only"
    And I provide manual personal details from account details:
      | title          | Mr    |
      | first names    | FNAME |
      | last name      | LNAME |
      | address line 1 | Addr1 |
    And I return to account details
    Then the "Personal details" task status is "Provided"
    And the "Payment terms" task status is "Not provided"
    When I view the "Payment terms" task
    Then I should see the header containing text "Payment terms"

  Scenario: Payment terms data persists within the session [@PO-272, @PO-344, @PO-345, @PO-545, @PO-429, @PO-587, @PO-592]
    When I complete manual payment terms:
      | collection order            | No                                 |
      | make collection order today | Yes                                |
      | payment term                | Lump sum plus instalments          |
      | lump sum amount             | 150                                |
      | instalment amount           | 300                                |
      | payment frequency           | Monthly                            |
      | start date                  | 2 weeks into the future            |
      | request payment card        | Yes                                |
      | days in default             | Yes                                |
      | days in default imposed     | 1 weeks into the past              |
      | default days                | 100                                |
      | add enforcement action      | Yes                                |
      | enforcement action          | Hold enforcement on account (NOENF) |
      | enforcement reason          | Reason                             |
    And I return to account details
    Then the "Payment terms" task status is "Provided"
    When I view the "Payment terms" task
    Then the manual payment terms fields are:
      | collection order            | No                                 |
      | make collection order today | Yes                                |
      | payment term                | Lump sum plus instalments          |
      | lump sum amount             | 150                                |
      | instalment amount           | 300                                |
      | payment frequency           | Monthly                            |
      | start date                  | 2 weeks into the future            |
      | request payment card        | Yes                                |
      | days in default             | Yes                                |
      | days in default imposed     | 1 weeks into the past              |
      | default days                | 100                                |
      | add enforcement action      | Yes                                |
      | enforcement action          | Hold enforcement on account (NOENF) |
      | enforcement reason          | Reason                             |

  Scenario: Restarting manual account clears previous payment terms [@PO-272, @PO-344, @PO-345, @PO-545, @PO-429, @PO-587, @PO-592]
    When I complete manual payment terms:
      | collection order | No                       |
      | payment term     | Pay in full              |
      | pay in full by   | 1 weeks into the future  |
    And I return to account details
    Then the "Payment terms" task status is "Provided"
    When I refresh the application
    And I restart manual fine account for business unit "West London" with defendant type "Adult or youth only"
    And I provide manual personal details from account details:
      | title          | Mr    |
      | first names    | FNAME |
      | last name      | LNAME |
      | address line 1 | Addr1 |
    And I return to account details
    Then the "Payment terms" task status is "Not provided"
    When I view the "Payment terms" task
    Then the manual payment terms fields are:
      | collection order       | Not selected |
      | payment term           | Not selected |
      | days in default        | No           |
      | add enforcement action | No           |

  Scenario: Dismissing cancel keeps unsaved payment terms [@PO-272, @PO-344, @PO-345, @PO-429, @PO-587, @PO-592]
    When I complete manual payment terms:
      | collection order | No                      |
      | payment term     | Pay in full             |
      | pay in full by   | 1 weeks into the future |
    And I cancel manual payment terms choosing "Cancel"
    Then the manual payment terms fields are:
      | collection order | No                      |
      | payment term     | Pay in full             |
      | pay in full by   | 1 weeks into the future |

  Scenario: Confirming cancel discards payment terms [@PO-272, @PO-344, @PO-345, @PO-429, @PO-587, @PO-592]
    When I complete manual payment terms:
      | collection order | No                      |
      | payment term     | Pay in full             |
      | pay in full by   | 1 weeks into the future |
    And I cancel manual payment terms choosing "Ok" and return to account details
    Then the "Payment terms" task status is "Not provided"
    When I view the "Payment terms" task
    Then the manual payment terms fields are:
      | collection order | Not selected |
      | payment term     | Not selected |

  Scenario: (AC.16) Grey navigation links routes correctly [@PO-272, @PO-344, @PO-345, @PO-429, @PO-587, @PO-592]
    When I complete manual payment terms:
      | collection order | No                      |
      | payment term     | Pay in full             |
      | pay in full by   | 1 weeks into the future |
    And I proceed to account comments from payment terms
    Then I should see the header containing text "Account comments and notes"

  Scenario: Payment terms - Axe Core
    Then I check accessibility




