@JIRA-LABEL:account-enquiry @JIRA-EPIC:PO-7465 @JIRA-STORY:PO-10906 @R1CBankingInterfaces
Feature: Remove alternate payment references

  Background:
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"

  Rule: Editable alternate payment reference
    Background:
      Given a published adult or youth defendant account exists:
        | first name                | Jordan          |
        | last name                 | AprRemove{uniq} |
        | prosecutor case reference | APRR{uniqUpper} |
      When I open APR Management for defendant "AprRemove{uniq}"
      And I submit alternate payment reference "REMOVE{uniqUpper}"
      Then the current alternate payment references include "REMOVE{uniqUpper}"

    Scenario: Confirm removal and verify the reference stays absent
      When I remove alternate payment reference "REMOVE{uniqUpper}"
      Then I should see the header containing text "Are you sure you want to remove this alternate payment reference?"
      When I confirm removal of the alternate payment reference
      Then there are no alternate payment references for the current account
      When I open APR Management for defendant "AprRemove{uniq}"
      Then there are no alternate payment references for the current account

    Scenario: Cancel removal and keep the reference
      When I remove alternate payment reference "REMOVE{uniqUpper}"
      Then I should see the header containing text "Are you sure you want to remove this alternate payment reference?"
      When I cancel removal of the alternate payment reference
      Then the current alternate payment references include "REMOVE{uniqUpper}"
      When I open APR Management for defendant "AprRemove{uniq}"
      Then the current alternate payment references include "REMOVE{uniqUpper}"

  Rule: Read-only alternate payment reference
    # Requires the AprReadOnlyFixture test account with a consolidated ACC reference in the deployment.
    Scenario: A read-only consolidated reference is unavailable for removal
      When the Payment terms tab is displayed for defendant account with last name "AprReadOnlyFixture"
      And I open APR Management for the read-only reference
      Then I should see the header containing text "Manage alternate payment references"
      And the read-only consolidated reference "APRREADONLY" cannot be removed
