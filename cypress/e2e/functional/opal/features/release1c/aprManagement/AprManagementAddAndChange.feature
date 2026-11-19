@JIRA-LABEL:account-enquiry @JIRA-EPIC:PO-7465 @JIRA-STORY:PO-10906 @R1CBankingInterfaces
Feature: View, add and change alternate payment references

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And a published adult or youth defendant account exists:
      | first name                | Jordan          |
      | last name                 | AprMain{uniq}   |
      | prosecutor case reference | APRM{uniqUpper} |

  Scenario: The management page lists the references for the selected defendant account
    When the Payment terms tab is displayed for defendant account with last name "AprMain{uniq}"
    And I open APR Management from Payment terms
    And I add an alternate payment reference
    And I save alternate payment reference "OTHER{uniqUpper}"
    Then the current alternate payment references include "OTHER{uniqUpper}"
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | business_unit_id                                   | 65              |
      | account.defendant.forenames                        | Casey           |
      | account.defendant.surname                          | AprOther{uniq}  |
      | account.prosecutor_case_reference                  | APRO{uniqUpper} |
      | account.offences.0.impositions.0.major_creditor_id  | 650000000041    |
    When the Payment terms tab is displayed for defendant account with last name "AprOther{uniq}"
    And I open APR Management from Payment terms
    And I add an alternate payment reference
    And I save alternate payment reference "MAIN{uniqUpper}"
    Then the current alternate payment references include "MAIN{uniqUpper}"
    And the current alternate payment references exclude "OTHER{uniqUpper}"

  Scenario: Add a valid alternate payment reference
    When the Payment terms tab is displayed for defendant account with last name "AprMain{uniq}"
    And I open APR Management from Payment terms
    Then there are no alternate payment references for the current account
    When I add an alternate payment reference
    And I save alternate payment reference "NEW{uniqUpper}"
    Then the current alternate payment references include "NEW{uniqUpper}"

  Scenario: Reject an alternate payment reference longer than 18 characters on add
    When the Payment terms tab is displayed for defendant account with last name "AprMain{uniq}"
    And I open APR Management from Payment terms
    And I add an alternate payment reference
    And I save alternate payment reference "ABCDEFGHIJKLMNOPQRS"
    Then I see the alternate payment reference length error

  Scenario: Reject a duplicate alternate payment reference in the same business unit
    When the Payment terms tab is displayed for defendant account with last name "AprMain{uniq}"
    And I open APR Management from Payment terms
    And I add an alternate payment reference
    And I save alternate payment reference "TAKEN{uniqUpper}"
    Then the current alternate payment references include "TAKEN{uniqUpper}"
    Given a published adult or youth defendant account exists:
      | first name                | Casey           |
      | last name                 | AprOther{uniq}  |
      | prosecutor case reference | APRO{uniqUpper} |
    Given I watch for alternate payment reference creation
    When the Payment terms tab is displayed for defendant account with last name "AprOther{uniq}"
    And I open APR Management from Payment terms
    And I add an alternate payment reference
    And I save alternate payment reference "TAKEN{uniqUpper}"
    Then creation of the duplicate alternate payment reference is rejected
    When the Payment terms tab is displayed for defendant account with last name "AprOther{uniq}"
    And I open APR Management from Payment terms
    Then there are no alternate payment references for the current account

  Scenario: Add a reference that is already used in a different business unit
    When the Payment terms tab is displayed for defendant account with last name "AprMain{uniq}"
    And I open APR Management from Payment terms
    And I add an alternate payment reference
    And I save alternate payment reference "SHARED{uniqUpper}"
    Then the current alternate payment references include "SHARED{uniqUpper}"
    Given I create a "adultOrYouthOnly" draft account with the following details and set status "Publishing Pending" using user "opal-test-10@dev.platform.hmcts.net":
      | business_unit_id                                   | 65              |
      | account.defendant.forenames                        | Casey           |
      | account.defendant.surname                          | AprOther{uniq}  |
      | account.prosecutor_case_reference                  | APRO{uniqUpper} |
      | account.offences.0.impositions.0.major_creditor_id  | 650000000041    |
    When the Payment terms tab is displayed for defendant account with last name "AprOther{uniq}"
    And I open APR Management from Payment terms
    And I add an alternate payment reference
    And I save alternate payment reference "SHARED{uniqUpper}"
    Then the current alternate payment references include "SHARED{uniqUpper}"

  Scenario: Change an existing alternate payment reference
    When the Payment terms tab is displayed for defendant account with last name "AprMain{uniq}"
    And I open APR Management from Payment terms
    And I add an alternate payment reference
    And I save alternate payment reference "OLD{uniqUpper}"
    Then the current alternate payment references include "OLD{uniqUpper}"
    When I change alternate payment reference "OLD{uniqUpper}"
    And I save alternate payment reference "NEW{uniqUpper}"
    Then the current alternate payment references include "NEW{uniqUpper}"
    And the current alternate payment references exclude "OLD{uniqUpper}"

  Scenario: Reject an alternate payment reference longer than 18 characters on change
    When the Payment terms tab is displayed for defendant account with last name "AprMain{uniq}"
    And I open APR Management from Payment terms
    And I add an alternate payment reference
    And I save alternate payment reference "OLD{uniqUpper}"
    Then the current alternate payment references include "OLD{uniqUpper}"
    When I change alternate payment reference "OLD{uniqUpper}"
    And I save alternate payment reference "ABCDEFGHIJKLMNOPQRS"
    Then I see the alternate payment reference length error

  Scenario: Reject changing an alternate payment reference to a duplicate in the same business unit
    When the Payment terms tab is displayed for defendant account with last name "AprMain{uniq}"
    And I open APR Management from Payment terms
    And I add an alternate payment reference
    And I save alternate payment reference "TAKEN{uniqUpper}"
    Then the current alternate payment references include "TAKEN{uniqUpper}"
    Given a published adult or youth defendant account exists:
      | first name                | Casey           |
      | last name                 | AprOther{uniq}  |
      | prosecutor case reference | APRO{uniqUpper} |
    When the Payment terms tab is displayed for defendant account with last name "AprOther{uniq}"
    And I open APR Management from Payment terms
    And I add an alternate payment reference
    And I save alternate payment reference "ORIGINAL{uniqUpper}"
    Then the current alternate payment references include "ORIGINAL{uniqUpper}"
    When I change alternate payment reference "ORIGINAL{uniqUpper}"
    And I try to update to the duplicate alternate payment reference "TAKEN{uniqUpper}"
    Then the duplicate alternate payment reference update is rejected
    When the Payment terms tab is displayed for defendant account with last name "AprOther{uniq}"
    And I open APR Management from Payment terms
    Then the current alternate payment references include "ORIGINAL{uniqUpper}"
    And the current alternate payment references exclude "TAKEN{uniqUpper}"
