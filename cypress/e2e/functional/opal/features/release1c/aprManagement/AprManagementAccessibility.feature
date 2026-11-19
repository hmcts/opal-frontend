@JIRA-LABEL:account-enquiry @JIRA-EPIC:PO-7465 @JIRA-STORY:PO-10906
Feature: Alternate Payment Reference Management accessibility

  @R1CBankingInterfaces
  Scenario: APR Management and access-denied pages are accessible
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | business_unit_id                                   | 73                 |
      | account.defendant.forenames                        | Jordan             |
      | account.defendant.surname                          | AprA11y{uniq}      |
      | account.prosecutor_case_reference                  | APRA11Y{uniqUpper} |
      | account.offences.0.impositions.0.major_creditor_id | 730000000083       |
    When the Payment terms tab is displayed for defendant account with last name "AprA11y{uniq}"
    And I open APR Management from Payment terms
    Then I should see the header containing text "Manage Alternate Payment References"
    And I check the page for accessibility
    Given I am logged in with email "opal-test-10@dev.platform.hmcts.net"
    When the Payment terms tab is displayed for defendant account with last name "AprA11y{uniq}"
    And I open APR Management from Payment terms
    Then I should see the header containing text "You cannot manage alternate payment references"
    And I check the page for accessibility
