@JIRA-LABEL:account-enquiry
Feature: Seeded defendant account imposition creditor names
  As a caseworker
  I want to see the creditor names supplied by Opal
  So that I can identify each creditor and view their details

  @functional @R1BDrop1 @JIRA-STORY:PO-10571 @JIRA-EPIC:PO-979
  Scenario: Display all six creditor summaries for the repeatable seeded account
    Given I am logged in with email "opal-test@dev.platform.hmcts.net"
    And I observe the seeded PO-10571 Opal impositions request
    When I view the Individuals search form
    And I search using the following inputs:
      | account number | 10571001A |
    And I open the latest matching result from the search results
    And I go to the Impositions tab
    Then I should return to the Impositions tab
    And the seeded Opal impositions show these creditor names and links:
      | Creditor               | Type | Organisation flag |
      | PO10571 Company Ltd    | MN   | true              |
      | Alex James Example     | MN   | false             |
      | SurnameOnly            | MN   | false             |
      | PO10571 Major Creditor | MJ   |                   |
      | Central Fund           | CF   |                   |
      | Minor Creditor         | MN   | true              |
