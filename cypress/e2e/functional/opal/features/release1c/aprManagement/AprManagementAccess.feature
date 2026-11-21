@JIRA-LABEL:account-enquiry @JIRA-EPIC:PO-7465 @JIRA-STORY:PO-10906
Feature: Alternate Payment Reference Management access

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"

  Rule: User has APR permission in the account's business unit
    Background:
      Given a published adult or youth defendant account exists:
        | first name                | Jordan           |
        | last name                 | AprAccess{uniq}  |
        | prosecutor case reference | APRAC{uniqUpper} |

    @R1CBankingInterfacesOff
    Scenario: The APR Management link is hidden when Banking Interfaces is disabled
      When the Payment terms tab is displayed for defendant account with last name "AprAccess{uniq}"
      Then the APR Management link is hidden

    @R1CBankingInterfaces
    Scenario: A user with APR permission in the account's business unit can open APR Management
      When I open APR Management for defendant "AprAccess{uniq}"
      Then I should see the header containing text "Manage Alternate Payment References"

  Rule: User has APR permission only in another business unit
    # The published fixture uses BU 77. opal-test-4 has APR permission in another unit.
    @R1CBankingInterfaces
    Scenario: A user with APR permission in another business unit is denied access
      Given a published adult or youth defendant account exists:
        | first name                | Jordan           |
        | last name                 | AprDenied{uniq}  |
        | prosecutor case reference | APRAD{uniqUpper} |
      And I am logged in with email "opal-test-4@dev.platform.hmcts.net"
      When I open APR Management for defendant "AprDenied{uniq}"
      Then I should see the header containing text "You cannot manage alternate payment references"
