@ManualAccountCreation @CourtDetails
Feature: Manual account creation - Local justice area filtering
  Verifies that local justice area requests include the correct lja_type filters by journey.

  Background:
    Given I am logged in with email "opal-test@hmcts.net"
    When I open Manual Account Creation from the dashboard
    And I ensure I am on the create or transfer in page
    And I monitor local justice areas requests

  # AC2, AC3, AC4, AC6
  @PO-2761
  Scenario: Fine + New requests only PSA and CRWCRT local justice areas
    When I create a "New" manual "Fine" account for business unit "West London" with defendant type "Adult or youth only"
    And I access the "Court details" task
    Then the latest local justice areas request should include lja types:
      | LJA    |
      | CRWCRT |
    And the latest local justice areas request should not include lja types:
      | SJCRT  |
      | SCSCRT |
      | NICRT  |

  # AC2, AC3, AC4, AC6
  @PO-2761
  Scenario: Fine + Transfer in requests only PSA and CRWCRT local justice areas
    When I create a "Transfer in" manual "Fine" account for business unit "West London" with defendant type "Adult or youth only"
    And I access the "Court details" task
    Then the latest local justice areas request should include lja types:
      | LJA    |
      | CRWCRT |
    And the latest local justice areas request should not include lja types:
      | SJCRT  |
      | SCSCRT |
      | NICRT  |

  # AC2, AC3, AC5, AC6
  @PO-2761
  Scenario: Conditional Caution + New requests all local justice area types
    When I create a "New" manual "Conditional Caution" account for business unit "West London"
    And I access the "Court details" task
    Then the latest local justice areas request should include lja types:
      | CRWCRT |
      | LJA    |
      | SJCRT  |
      | SCSCRT |
      | NICRT  |

  # AC2, AC3, AC5, AC6
  @PO-2761
  Scenario: Fixed Penalty + New requests all local justice area types (Prosecutors all remain visible)
    When I create a "New" manual "Fixed Penalty" account for business unit "West London" with defendant type "Adult or youth only"
    Then I should see the header containing text "Fixed Penalty details"
    Then the latest local justice areas request should include lja types:
      | CRWCRT |
      | LJA    |
      | SJCRT  |
      | SCSCRT |
      | NICRT  |

  # AC2, AC3, AC5, AC6
  @PO-2761
  Scenario: Fixed Penalty + Transfer in requests all local justice area types (Prosecutors all remain visible)
    When I create a "Transfer in" manual "Fixed Penalty" account for business unit "West London" with defendant type "Adult or youth only"
    Then I should see the header containing text "Fixed Penalty details"
    Then the latest local justice areas request should include lja types:
      | CRWCRT |
      | LJA    |
      | SJCRT  |
      | SCSCRT |
      | NICRT  |
