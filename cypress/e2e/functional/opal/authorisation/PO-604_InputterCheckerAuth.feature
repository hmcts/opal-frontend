Feature: PO-604 Inputter and Checker flow authorisation

  Scenario: Inputter and Checker flow authorisation - No Authorisation User
    Given I am on the Opal Frontend and I sign in as "opal-test-2@hmcts.net"
    When I am on the dashboard

    Then the link with text "Check and Validate Draft Accounts" should not be present

  Scenario: Inputter and Checker flow authorisation - Inputter Authorised User
    Given I am on the Opal Frontend and I sign in as "opal-test-7@hmcts.net"
    When I am on the dashboard

    Then I see the "Create and Manage Draft Accounts" link
    And the link with text "Check and Validate Draft Accounts" should not be present

  Scenario: Inputter and Checker flow authorisation - Checker Authorised User
    Given I am on the Opal Frontend and I sign in as "opal-test-10@hmcts.net"
    When I am on the dashboard

    Then the link with text "Create and Manage Draft Accounts" should not be present
    And I see the "Check and Validate Draft Accounts" link

  @only
  Scenario: Inputter and Checker flow authorisation - Inputter and Checker Authorised User
    Given I am on the Opal Frontend and I sign in as "opal-test@hmcts.net"
    When I am on the dashboard

    Then I see the "Create and Manage Draft Accounts" link
    And I see the "Check and Validate Draft Accounts" link

    Then I get the opal app mode

