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
    # Before enabling, provision a separate test user with draft validation in business unit 73.
    # Use that user for draft publication. Keep opal-test-10 as the APR access-denied user.
    @R1CBankingInterfaces @skip
    Scenario: A user with APR permission in another business unit is denied access
      Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
        | business_unit_id                                   | 73               |
        | account.defendant.forenames                        | Jordan           |
        | account.defendant.surname                          | AprDenied{uniq}  |
        | account.prosecutor_case_reference                  | APRAD{uniqUpper} |
        | account.offences.0.impositions.0.major_creditor_id | 730000000083     |
      And I am logged in with email "opal-test-10@dev.platform.hmcts.net"
      When I open APR Management for defendant "AprDenied{uniq}"
      Then I should see the header containing text "You cannot manage alternate payment references"
