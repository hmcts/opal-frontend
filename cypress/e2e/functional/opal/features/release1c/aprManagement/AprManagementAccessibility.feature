@JIRA-LABEL:account-enquiry @JIRA-EPIC:PO-7465 @JIRA-STORY:PO-10906
Feature: Alternate Payment Reference Management accessibility

  # The published fixture uses BU 77. opal-test-4 has APR permission in another unit.
  @R1CBankingInterfaces
  Scenario: APR Management and access-denied pages are accessible
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And a published adult or youth defendant account exists:
      | first name                | Jordan             |
      | last name                 | AprA11y{uniq}      |
      | prosecutor case reference | APRA11Y{uniqUpper} |
    When I open APR Management for defendant "AprA11y{uniq}"
    Then I should see the header containing text "Manage alternate payment references"
    And I check the page for accessibility
    Given I am logged in with email "opal-test-4@dev.platform.hmcts.net"
    When I open APR Management for defendant "AprA11y{uniq}"
    Then I should see the header containing text "You cannot manage alternate payment references"
    And I check the page for accessibility
