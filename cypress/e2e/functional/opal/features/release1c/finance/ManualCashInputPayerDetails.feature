@JIRA-LABEL:manual-cash-input @JIRA-EPIC:PO-2439 @JIRA-STORY:PO-3674 @R1CFinancialMovements
Feature: Manual Cash Input - Suspense payer details

  Background:
    Given I am logged in on the Fines Search landing page with email "opal-test@dev.platform.hmcts.net"
    When I select the Fines primary navigation item "Finance"
    And I am taken to the "Finance" Fines landing page
    And I open Manual Cash Input
    And I create a till
    And I select "Camden and Islington"
    And I continue

  Scenario Outline: AC1, AC1b, AC1c, AC3 - a suspense payment records <type> payer information with <details> details
    When I record a suspense payment for reason "<reason>"
    Then Payer Details displays the selected Manual Cash Input business unit
    When the suspense payer has type "<type>" and "<details>" details
    And I continue with the suspense payer details
    Then the suspense payment is ready for checking

    Examples:
      | reason        | type       | details |
      | overpayment   | individual | full    |
      | advance       | company    | full    |
      | miscellaneous | individual | minimal |
      | miscellaneous | company    | minimal |

  @AC2
  Scenario Outline: AC2b, AC2c - a required payer name must be supplied before continuing
    When I record a suspense payment for reason "overpayment"
    And the suspense payer type is "<type>"
    And I continue with the suspense payer details
    Then the suspense payer field "<field>" has error "<message>"
    When the suspense payer field "<field>" is "Example"
    And I continue with the suspense payer details
    Then the suspense payment is ready for checking

    Examples:
      | type       | field       | message            |
      | individual | lastName    | Enter last name    |
      | company    | companyName | Enter company name |

  @AC2
  Scenario: AC2e - invalid postcode characters must be corrected before continuing
    When I record a suspense payment for reason "overpayment"
    And the suspense payer has type "individual" and "minimal" details
    And the suspense payer field "postcode" is "AB1-2CD"
    And I continue with the suspense payer details
    Then the suspense payer field "postcode" has error "Post code must only include letters a to z, numbers and spaces"
    When the suspense payer field "postcode" is "AB1 2CD"
    And I continue with the suspense payer details
    Then the suspense payment is ready for checking

  @AC2
  Scenario: AC2f - a postcode must not exceed eight characters
    When I record a suspense payment for reason "overpayment"
    And the suspense payer has type "company" and "minimal" details
    And the suspense payer field "postcode" is "AB12 3CDE"
    And I continue with the suspense payer details
    Then the suspense payer field "postcode" has error "Post code must be 8 characters or fewer"
    When the suspense payer field "postcode" is "AB12 3CD"
    And I continue with the suspense payer details
    Then the suspense payment is ready for checking

  Scenario: AC1 - an unidentified payment needs no payer details
    When I record a suspense payment for reason "unidentified"
    Then the suspense payment is ready for checking

  Scenario Outline: AC4, AC5 - an empty payer form can be left using <action> without a warning
    When I record a suspense payment for reason "overpayment"
    Then Payer Details displays the selected Manual Cash Input business unit
    When I request "<action>" from Payer Details with "none" confirmation
    Then the suspense payer journey returns using "<action>"

    Examples:
      | action |
      | Back   |
      | Cancel |

  Scenario Outline: AC4a, AC4ai, AC4aii, AC5a, AC5ai, AC5aii - entered <type> details are protected when leaving using <action>
    When I record a suspense payment for reason "overpayment"
    Then Payer Details displays the selected Manual Cash Input business unit
    When the suspense payer has type "<type>" and "full" details
    And I request "<action>" from Payer Details with "decline" confirmation
    Then the "<type>" payer details are retained
    When I request "<action>" from Payer Details with "confirm" confirmation
    Then the suspense payer journey returns using "<action>"
    And the payer data discarded using "<action>" does not reappear

    Examples:
      | action | type       |
      | Back   | individual |
      | Back   | company    |
      | Cancel | individual |
      | Cancel | company    |
